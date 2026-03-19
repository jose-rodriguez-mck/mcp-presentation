import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  FileJson,
  RefreshCw,
  CheckCircle,
  Play,
  Pause,
  Plus,
  Terminal,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Install steps
// ---------------------------------------------------------------------------

interface InstallStep {
  id: number;
  label: string;
  title: string;
  icon: typeof Settings;
  color: string;
}

const STEPS: InstallStep[] = [
  { id: 0, label: "Open Settings", title: "Cursor Settings > MCP", icon: Settings, color: "text-primary" },
  { id: 1, label: "Add Server", title: "Click + Add MCP Server", icon: Plus, color: "text-glow-emerald" },
  { id: 2, label: "Configure", title: "Paste the JSON config", icon: FileJson, color: "text-accent" },
  { id: 3, label: "Restart", title: "Reload the MCP servers", icon: RefreshCw, color: "text-yellow-400" },
  { id: 4, label: "Ready", title: "Tools are available", icon: CheckCircle, color: "text-glow-emerald" },
];

const STEP_DURATION = 4000;

// ---------------------------------------------------------------------------
// Step visuals
// ---------------------------------------------------------------------------

function StepOpenSettings() {
  return (
    <div className="space-y-3">
      <WindowChrome title="Cursor — Settings" />
      <div className="rounded-lg bg-secondary/60 border border-border/50 overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-36 border-r border-border/50 p-2 space-y-1">
            {["General", "Editor", "AI", "MCP", "Extensions"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1, backgroundColor: item === "MCP" ? "hsl(200 100% 55% / 0.1)" : "transparent" }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className={`text-[10px] px-2 py-1.5 rounded font-mono ${
                  item === "MCP" ? "text-primary border border-primary/30" : "text-muted-foreground"
                }`}
              >
                {item}
              </motion.div>
            ))}
          </div>
          {/* Content */}
          <div className="flex-1 p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs font-semibold mb-2">MCP Servers</p>
              <p className="text-[10px] text-muted-foreground">
                Manage Model Context Protocol servers that extend AI capabilities.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-3 text-[10px] text-muted-foreground/60 italic"
              >
                No servers configured yet.
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepAddServer() {
  return (
    <div className="space-y-3">
      <WindowChrome title="Cursor — Settings > MCP" />
      <div className="rounded-lg bg-secondary/60 border border-border/50 p-4 space-y-3">
        <p className="text-xs font-semibold">MCP Servers</p>
        <motion.button
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={{ scale: [0.95, 1.05, 1], opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-primary/50 bg-primary/5
            text-xs text-primary font-mono w-full justify-center"
        >
          <Plus className="w-3.5 h-3.5" />
          Add new MCP server
        </motion.button>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="overflow-hidden"
        >
          <div className="rounded-lg border border-border/50 bg-secondary/40 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-muted-foreground w-12">Name</label>
              <div className="flex-1 rounded bg-secondary border border-border/50 px-2 py-1">
                <TypingMini text="dynatrace" delay={1.5} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-muted-foreground w-12">Type</label>
              <div className="flex-1 rounded bg-secondary border border-border/50 px-2 py-1 text-[10px] font-mono text-muted-foreground">
                command (stdio)
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StepConfigure() {
  const jsonConfig = `{
  "mcpServers": {
    "dynatrace": {
      "command": "npx",
      "args": [
        "-y",
        "@dynatrace/mcp-server"
      ],
      "env": {
        "DT_URL": "https://abc123.dynatrace.com",
        "DT_TOKEN": "dt0c01.****"
      }
    }
  }
}`;

  return (
    <div className="space-y-3">
      <WindowChrome title=".cursor/mcp.json" />
      <div className="rounded-lg bg-secondary/60 border border-border/50 p-3">
        <div className="flex items-center gap-2 mb-2">
          <FileJson className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-mono text-accent">mcp.json</span>
        </div>
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-[10px] font-mono text-muted-foreground leading-relaxed whitespace-pre overflow-x-auto"
        >
          {jsonConfig.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.008 }}
              className={char === '"' && jsonConfig[i + 1]?.match(/[a-zA-Z]/) ? "text-primary" : ""}
            >
              {char}
            </motion.span>
          ))}
        </motion.pre>
      </div>
    </div>
  );
}

function StepRestart() {
  return (
    <div className="space-y-3">
      <WindowChrome title="Cursor — MCP Servers" />
      <div className="rounded-lg bg-secondary/60 border border-border/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">MCP Servers</p>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.5, ease: "linear", repeat: 1 }}
          >
            <RefreshCw className="w-3.5 h-3.5 text-yellow-400" />
          </motion.div>
        </div>

        <div className="rounded-lg bg-secondary/40 border border-border/50 p-3">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-[10px] font-mono text-foreground">dynatrace</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[10px] font-mono text-muted-foreground"
              >
                npx -y @dynatrace/mcp-server
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 1, duration: 1.5 }}
              className="flex items-center gap-1.5"
            >
              <motion.span
                initial={{ backgroundColor: "hsl(45 100% 50%)" }}
                animate={{ backgroundColor: "hsl(160 80% 50%)" }}
                transition={{ delay: 2.5, duration: 0.3 }}
                className="w-2 h-2 rounded-full"
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="text-[10px] font-mono text-glow-emerald"
              >
                Running
              </motion.span>
            </motion.div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="text-[10px] font-mono text-muted-foreground"
        >
          Loading tools... 20 tools discovered
        </motion.p>
      </div>
    </div>
  );
}

function StepReady() {
  const tools = [
    "list_problems", "list_vulnerabilities", "list_exceptions",
    "get_kubernetes_events", "execute_davis_analyzer", "get_environment_info",
  ];
  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-lg bg-glow-emerald/10 border border-glow-emerald/30 p-4 text-center"
      >
        <CheckCircle className="w-8 h-8 text-glow-emerald mx-auto mb-2" />
        <p className="text-sm font-semibold">MCP Server Ready</p>
        <p className="text-[10px] text-muted-foreground mt-1 font-mono">
          dynatrace — 20 tools available
        </p>
      </motion.div>

      <div className="rounded-lg bg-secondary/50 border border-border/50 p-3">
        <p className="text-[10px] font-mono text-muted-foreground mb-2">Sample tools now available:</p>
        <div className="flex flex-wrap gap-1.5">
          {tools.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-[9px] font-mono px-2 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary"
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-xs text-muted-foreground text-center"
      >
        The AI agent can now call any of these tools via natural language.
      </motion.p>
    </div>
  );
}

const STEP_VISUALS = [StepOpenSettings, StepAddServer, StepConfigure, StepRestart, StepReady];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function WindowChrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <div className="w-2 h-2 rounded-full bg-yellow-500" />
      <div className="w-2 h-2 rounded-full bg-green-500" />
      <span className="text-[10px] font-mono text-muted-foreground ml-2">{title}</span>
    </div>
  );
}

function TypingMini({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 60);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className="text-[10px] font-mono text-foreground">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[3px] h-3 bg-primary ml-px align-text-bottom"
      />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

const MCPInstallSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  const advance = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % STEPS.length);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(advance, STEP_DURATION);
    return () => clearInterval(timer);
  }, [playing, advance]);

  const handleStepClick = (id: number) => {
    setActiveStep(id);
    setPlaying(false);
  };

  const step = STEPS[activeStep];
  const StepVisual = STEP_VISUALS[activeStep];

  return (
    <section className="section-padding">
      <div className="container max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-glow-emerald uppercase tracking-widest">
            Setup Guide
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3">
            Installing an <span className="text-gradient-emerald">MCP Server</span> in Cursor
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            From zero to a fully connected AI agent in under a minute.
            Add any MCP server to Cursor in just a few steps.
          </p>
        </motion.div>

        {/* Animated walkthrough */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-glass rounded-2xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Timeline (left) */}
            <div className="md:w-60 flex-shrink-0 border-b md:border-b-0 md:border-r border-border/50 p-4 md:p-5">
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
                {STEPS.map((s) => {
                  const isActive = s.id === activeStep;
                  const isPast = s.id < activeStep;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleStepClick(s.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300
                        cursor-pointer flex-shrink-0 w-full text-left
                        ${isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/80"}
                        ${isPast && !isActive ? "opacity-50" : ""}
                        ${!isPast && !isActive ? "opacity-40" : ""}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300
                          ${isActive ? "bg-primary/20" : "bg-secondary"}`}
                      >
                        <s.icon
                          className={`w-3.5 h-3.5 transition-colors duration-300 ${
                            isActive ? s.color : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[10px] font-mono uppercase tracking-wider ${isActive ? s.color : "text-muted-foreground"}`}>
                          {s.label}
                        </p>
                        <p className={`text-[10px] truncate ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {s.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono
                    px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/50
                    hover:border-primary/50 hover:text-primary hover:bg-primary/5
                    transition-all duration-200 cursor-pointer"
                >
                  {playing ? (
                    <><Pause className="w-3 h-3" /> Pause</>
                  ) : (
                    <><Play className="w-3 h-3" /> Auto-play</>
                  )}
                </button>
              </div>
            </div>

            {/* Visual area (right) */}
            <div className="flex-1 p-5 md:p-8 min-h-[380px] flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <step.icon className={`w-5 h-5 ${step.color}`} />
                <span className={`text-sm font-semibold ${step.color}`}>
                  Step {activeStep + 1}: {step.label}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono ml-auto">
                  {activeStep + 1}/{STEPS.length}
                </span>
              </div>

              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StepVisual />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress bar */}
              <div className="mt-6 flex gap-1.5">
                {STEPS.map((s) => (
                  <div key={s.id} className="flex-1 h-1 rounded-full overflow-hidden bg-secondary">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={false}
                      animate={{
                        width: s.id < activeStep ? "100%" : s.id === activeStep ? "100%" : "0%",
                      }}
                      transition={{
                        duration: s.id === activeStep && playing ? STEP_DURATION / 1000 : 0.3,
                        ease: s.id === activeStep && playing ? "linear" : "easeOut",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MCPInstallSection;
