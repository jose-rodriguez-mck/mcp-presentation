import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Activity,
  ShieldAlert,
  Bug,
  Server,
  Brain,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  Globe,
  AlertTriangle,
  CircleCheck,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  matchIntent,
  SUGGESTED_PROMPTS,
  type MockResponse,
  type Problem,
  type Vulnerability,
  type ExceptionEntry,
  type KubernetesEvent,
  type DavisAnalyzerResult,
  type EnvironmentInfo,
} from "@/data/dynatraceMockData";

// ---------------------------------------------------------------------------
// Chat message type
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: MockResponse;
  isTyping?: boolean;
}

// ---------------------------------------------------------------------------
// Severity / status badge colours
// ---------------------------------------------------------------------------

const severityColors: Record<string, string> = {
  CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
  HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  ERROR: "bg-red-500/20 text-red-400 border-red-500/30",
  WARNING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  INFO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  LOW: "bg-green-500/20 text-green-400 border-green-500/30",
  ACTIVE: "bg-red-500/20 text-red-400 border-red-500/30",
  CLOSED: "bg-green-500/20 text-green-400 border-green-500/30",
};

// ---------------------------------------------------------------------------
// Inline helpers
// ---------------------------------------------------------------------------

function detectDataType(
  resp: MockResponse
): "problems" | "vulnerabilities" | "exceptions" | "k8s" | "forecast" | "environment" {
  const tool = resp.toolCall.tool;
  if (tool === "list_problems") return "problems";
  if (tool === "list_vulnerabilities") return "vulnerabilities";
  if (tool === "list_exceptions") return "exceptions";
  if (tool === "get_kubernetes_events") return "k8s";
  if (tool === "execute_davis_analyzer") return "forecast";
  return "environment";
}

const dataTypeIcons: Record<string, typeof Activity> = {
  problems: Activity,
  vulnerabilities: ShieldAlert,
  exceptions: Bug,
  k8s: Server,
  forecast: Brain,
  environment: Globe,
};

const dataTypeLabels: Record<string, string> = {
  problems: "Problems",
  vulnerabilities: "Vulnerabilities",
  exceptions: "Exceptions",
  k8s: "Kubernetes Events",
  forecast: "Forecast Analysis",
  environment: "Environment Info",
};

// ---------------------------------------------------------------------------
// MCP tool-call card (collapsible)
// ---------------------------------------------------------------------------

function ToolCallCard({ toolCall }: { toolCall: MockResponse["toolCall"] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-primary/30 bg-primary/5 p-3 mb-3"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-primary">
            MCP &rarr; {toolCall.tool}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>

      {/* Description always visible */}
      <p className="text-[11px] text-muted-foreground mt-1 pl-4">
        {toolCall.description}
      </p>

      <AnimatePresence>
        {expanded && (
          <motion.pre
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-[11px] font-mono text-muted-foreground overflow-hidden leading-relaxed pl-4"
          >
            {JSON.stringify(toolCall.parameters, null, 2)}
          </motion.pre>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Data renderers
// ---------------------------------------------------------------------------

function ProblemsDisplay({ data }: { data: Problem[] }) {
  return (
    <div className="space-y-2 mb-3">
      {data.map((p) => (
        <div key={p.id} className="rounded-lg bg-secondary/50 border border-border/50 p-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">{p.id}</span>
            <div className="flex gap-1.5">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${severityColors[p.severity]}`}>
                {p.severity}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${severityColors[p.status]}`}>
                {p.status}
              </span>
            </div>
          </div>
          <p className="text-sm font-medium">{p.title}</p>
          <p className="text-xs text-muted-foreground">
            {p.affectedEntity} &middot; Started {p.startTime.replace("T", " ").slice(0, 16)}
          </p>
          {p.rootCause && (
            <p className="text-xs text-muted-foreground italic">Root cause: {p.rootCause}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function VulnerabilitiesDisplay({ data }: { data: Vulnerability[] }) {
  return (
    <div className="space-y-2 mb-3">
      {data.map((v) => (
        <div key={v.id} className="rounded-lg bg-secondary/50 border border-border/50 p-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">{v.cveId}</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${severityColors[v.riskLevel]}`}>
                {v.riskLevel}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                Score: {v.riskScore}
              </span>
            </div>
          </div>
          <p className="text-sm font-medium">{v.title}</p>
          <p className="text-xs text-muted-foreground">
            {v.affectedEntity} &middot; {v.stack} &middot; Exposure: {v.exposure.replace(/_/g, " ").toLowerCase()}
          </p>
        </div>
      ))}
    </div>
  );
}

function ExceptionsDisplay({ data }: { data: ExceptionEntry[] }) {
  return (
    <div className="space-y-2 mb-3">
      {data.map((e) => (
        <div key={e.id} className="rounded-lg bg-secondary/50 border border-border/50 p-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono text-red-400 break-all">{e.type}</span>
            <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
              x{e.count.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{e.message}</p>
          <p className="text-xs text-muted-foreground">
            {e.service} &middot; {e.application} &middot; Last seen {e.lastSeen.replace("T", " ").slice(11, 16)}
          </p>
        </div>
      ))}
    </div>
  );
}

function K8sDisplay({ data }: { data: KubernetesEvent[] }) {
  return (
    <div className="space-y-2 mb-3">
      {data.map((k) => (
        <div key={k.id} className="rounded-lg bg-secondary/50 border border-border/50 p-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground break-all">{k.involvedObject}</span>
            {k.eventType.includes("ERROR") || k.eventType.includes("CONTENTION") || k.eventType.includes("RESTART") ? (
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
            ) : k.eventType.includes("SLOWDOWN") || k.eventType.includes("FINDING") ? (
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
            ) : (
              <CircleCheck className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm font-medium">{k.reason}</p>
          <p className="text-xs text-muted-foreground">{k.message}</p>
          <p className="text-xs text-muted-foreground">
            {k.namespace} &middot; {k.clusterName} &middot; {k.timestamp.replace("T", " ").slice(11, 16)}
          </p>
        </div>
      ))}
    </div>
  );
}

function ForecastDisplay({ data }: { data: DavisAnalyzerResult }) {
  return (
    <div className="space-y-2 mb-3">
      <div className="rounded-lg bg-secondary/50 border border-border/50 p-3 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-mono text-primary">{data.analyzerName}</span>
          <span className="text-[10px] font-mono text-green-400">{data.status}</span>
        </div>
        <p className="text-sm font-medium">{data.result.prediction}</p>
        <p className="text-[10px] text-muted-foreground font-mono">
          Confidence: {Math.round(data.result.confidence * 100)}% &middot; {data.timeframe.start.slice(0, 10)} to{" "}
          {data.timeframe.end.slice(0, 10)}
        </p>
        <ul className="space-y-1 mt-2">
          {data.result.details.map((d, i) => (
            <li key={i} className="text-xs text-muted-foreground flex gap-2">
              <span className="text-primary mt-0.5">&#x2022;</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function EnvironmentDisplay({ data }: { data: EnvironmentInfo }) {
  return (
    <div className="space-y-2 mb-3">
      <div className="rounded-lg bg-secondary/50 border border-border/50 p-3 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-sm font-medium">{data.tenantName}</span>
          <span className="text-[10px] font-mono text-muted-foreground">ID: {data.tenantId}</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {[
            { label: "Hosts", value: data.monitoredHosts },
            { label: "Services", value: data.monitoredServices },
            { label: "Applications", value: data.monitoredApplications },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-lg font-bold text-primary">{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Cluster: {data.clusterVersion} &middot; ActiveGates: {data.activeGateVersions.join(", ")}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data dispatcher
// ---------------------------------------------------------------------------

function DataRenderer({ response }: { response: MockResponse }) {
  const type = detectDataType(response);
  switch (type) {
    case "problems":
      return <ProblemsDisplay data={response.data as Problem[]} />;
    case "vulnerabilities":
      return <VulnerabilitiesDisplay data={response.data as Vulnerability[]} />;
    case "exceptions":
      return <ExceptionsDisplay data={response.data as ExceptionEntry[]} />;
    case "k8s":
      return <K8sDisplay data={response.data as KubernetesEvent[]} />;
    case "forecast":
      return <ForecastDisplay data={response.data as DavisAnalyzerResult} />;
    case "environment":
      return <EnvironmentDisplay data={response.data as EnvironmentInfo} />;
  }
}

// ---------------------------------------------------------------------------
// Markdown-lite renderer (bold + inline code)
// ---------------------------------------------------------------------------

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    const rendered = parts.map((part, pi) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pi} className="text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={pi}
            className="text-primary font-mono text-[11px] bg-primary/10 px-1 py-0.5 rounded"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={pi}>{part}</span>;
    });
    return (
      <span key={li}>
        {rendered}
        {li < lines.length - 1 && <br />}
      </span>
    );
  });
}

// ---------------------------------------------------------------------------
// Message components
// ---------------------------------------------------------------------------

function AssistantMessage({ message }: { message: ChatMessage }) {
  const response = message.response;
  const type = response ? detectDataType(response) : "problems";
  const Icon = dataTypeIcons[type];
  const label = dataTypeLabels[type];
  const recordCount = response
    ? Array.isArray(response.data)
      ? response.data.length
      : 1
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-3 items-start"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        {message.isTyping ? (
          <div className="flex items-center gap-1 py-3">
            {[0, 0.2, 0.4].map((delay) => (
              <motion.span
                key={delay}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </div>
        ) : response ? (
          <>
            <ToolCallCard toolCall={response.toolCall} />

            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-primary" />
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                {label}
              </Badge>
              <span className="text-[10px] text-muted-foreground font-mono">
                {recordCount} {recordCount === 1 ? "record" : "records"}
              </span>
            </div>

            <DataRenderer response={response} />

            <div className="rounded-lg bg-glass p-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">
                  AI Analysis
                </span>
              </div>
              <div className="text-sm leading-relaxed text-muted-foreground">
                {renderMarkdown(response.analysis)}
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm leading-relaxed text-muted-foreground">
            {renderMarkdown(message.content)}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 items-start justify-end"
    >
      <div className="bg-primary/10 border border-primary/20 rounded-lg rounded-tr-sm px-4 py-2.5 max-w-[80%]">
        <p className="text-sm">{message.content}</p>
      </div>
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
        <User className="w-4 h-4 text-muted-foreground" />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

const WELCOME_TEXT =
  "I'm connected to your **Dynatrace** environment via MCP. I can query problems, vulnerabilities, exceptions, Kubernetes events, run Davis forecast analyses, and check environment info. Ask me anything or try one of the prompts below.";

const DynatraceChatSection = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isProcessing) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
      };

      const typingMsg: ChatMessage = {
        id: `typing-${Date.now()}`,
        role: "assistant",
        content: "",
        isTyping: true,
      };

      setMessages((prev) => [...prev, userMsg, typingMsg]);
      setInput("");
      setIsProcessing(true);

      await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

      const response = matchIntent(text);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        response,
      };

      setMessages((prev) => prev.filter((m) => !m.isTyping).concat(assistantMsg));
      setIsProcessing(false);
    },
    [isProcessing]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <section className="section-padding">
      <div className="container max-w-4xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">
            Live MCP Demo
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3">
            Dynatrace <span className="text-gradient-primary">MCP Chatbot</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            See how an AI agent leverages the Dynatrace MCP server to query observability data and
            provide intelligent analysis — all through a standard MCP interface.
          </p>
        </motion.div>

        {/* Chat container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-glass rounded-2xl overflow-hidden flex flex-col"
          style={{ height: "600px" }}
        >
          {/* Header bar */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/50">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Dynatrace Agent</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                MCP Server: dynatrace &middot; 20 tools available
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {messages.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => {
                    setMessages([]);
                    setInput("");
                    setIsProcessing(false);
                    inputRef.current?.focus();
                  }}
                  className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono
                    px-2.5 py-1.5 rounded-lg border border-border/50 bg-secondary/50
                    hover:border-primary/50 hover:text-primary hover:bg-primary/5
                    transition-all duration-200 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  New Chat
                </motion.button>
              )}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-glow-emerald" />
                <span className="text-[10px] text-muted-foreground">Connected</span>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <ScrollArea className="flex-1">
            <div ref={scrollRef} className="p-5 space-y-6 h-full overflow-y-auto">
              {/* Welcome message */}
              <AssistantMessage
                message={{ id: "welcome", role: "assistant", content: WELCOME_TEXT }}
              />

              {/* Suggested prompt chips (visible only before first message) */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex flex-wrap gap-2 pl-11"
                >
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      disabled={isProcessing}
                      className="text-xs px-3 py-1.5 rounded-full border border-border/70 bg-secondary/50 text-muted-foreground
                        hover:border-primary/50 hover:text-primary hover:bg-primary/5
                        transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {prompt}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Conversation */}
              <AnimatePresence mode="popLayout">
                {messages.map((msg) =>
                  msg.role === "user" ? (
                    <UserMessage key={msg.id} message={msg} />
                  ) : (
                    <AssistantMessage key={msg.id} message={msg} />
                  )
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Input bar */}
          <div className="border-t border-border/50 p-4">
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about problems, vulnerabilities, exceptions..."
                rows={1}
                disabled={isProcessing}
                className="flex-1 bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm
                  placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isProcessing}
                className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center
                  hover:bg-primary/30 transition-colors cursor-pointer
                  disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 text-primary" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/50 mt-2 text-center font-mono">
              Simulated MCP demo &middot; Data is illustrative
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DynatraceChatSection;
