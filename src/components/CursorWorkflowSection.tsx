import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Brain,
  Plug,
  Zap,
  CheckCircle,
  Play,
  Pause,
  Activity,
  Github,
  Server,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

interface WorkflowStep {
  id: number;
  label: string;
  title: string;
  icon: typeof MessageSquare;
  color: string;
  glowClass: string;
}

const STEPS: WorkflowStep[] = [
  {
    id: 0,
    label: "Describe",
    title: "Natural-Language Request",
    icon: MessageSquare,
    color: "text-primary",
    glowClass: "border-primary/40",
  },
  {
    id: 1,
    label: "Reason",
    title: "AI Plans the Approach",
    icon: Brain,
    color: "text-accent",
    glowClass: "border-accent/40",
  },
  {
    id: 2,
    label: "Connect",
    title: "Discover MCP Servers",
    icon: Plug,
    color: "text-glow-emerald",
    glowClass: "border-[hsl(160,80%,50%)]/40",
  },
  {
    id: 3,
    label: "Execute",
    title: "Call External APIs",
    icon: Zap,
    color: "text-yellow-400",
    glowClass: "border-yellow-400/40",
  },
  {
    id: 4,
    label: "Deliver",
    title: "Present the Result",
    icon: CheckCircle,
    color: "text-pink-400",
    glowClass: "border-pink-400/40",
  },
];

const STEP_DURATION = 3500;

// ---------------------------------------------------------------------------
// Step visual content
// ---------------------------------------------------------------------------

function StepDescribe() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-[10px] font-mono text-muted-foreground ml-2">Cursor IDE — Chat</span>
      </div>
      <div className="rounded-lg bg-secondary/60 border border-border/50 p-3">
        <p className="text-xs text-muted-foreground mb-2 font-mono">You</p>
        <TypingText text="Create a PR that fixes the authentication timeout bug in the login service. Reference issue #247." />
      </div>
    </div>
  );
}

function StepReason() {
  const bullets = [
    "Read issue #247 to understand the bug",
    "Find the relevant source files for auth timeout",
    "Create a fix branch and apply the code change",
    "Open a pull request linking issue #247",
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-4 h-4 text-accent" />
        <span className="text-xs font-mono text-accent">Agent Reasoning</span>
      </div>
      <div className="space-y-2">
        {bullets.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.35, duration: 0.3 }}
            className="flex items-start gap-2"
          >
            <span className="text-accent mt-0.5 text-xs">
              {i + 1}.
            </span>
            <span className="text-xs text-muted-foreground">{b}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="text-[10px] font-mono text-accent/70 mt-3"
      >
        Tools needed: issue_read, search_code, create_branch, push_files, create_pull_request
      </motion.div>
    </div>
  );
}

function StepConnect() {
  const servers = [
    { name: "GitHub", icon: Github, delay: 0.2 },
    { name: "Dynatrace", icon: Activity, delay: 0.5 },
    { name: "Jira", icon: Server, delay: 0.8 },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Plug className="w-4 h-4 text-glow-emerald" />
        <span className="text-xs font-mono text-glow-emerald">MCP Server Discovery</span>
      </div>
      <div className="space-y-2">
        {servers.map((s) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0.3, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: s.delay, duration: 0.4 }}
            className="flex items-center gap-3 rounded-lg bg-secondary/50 border border-border/50 p-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <s.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium">{s.name} MCP</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                {s.name === "GitHub" ? "41 tools" : s.name === "Dynatrace" ? "20 tools" : "15 tools"}
              </p>
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: s.delay + 0.3 }}
              className="w-2 h-2 rounded-full bg-glow-emerald flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-[10px] font-mono text-glow-emerald/70"
      >
        Selected: GitHub MCP &rarr; create_pull_request
      </motion.p>
    </div>
  );
}

function StepExecute() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-primary">MCP &rarr; create_pull_request</span>
        </div>
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[11px] font-mono text-muted-foreground leading-relaxed"
        >
{`{
  "owner": "acme-corp",
  "repo": "login-service",
  "title": "Fix auth timeout bug",
  "head": "fix/auth-timeout-247",
  "base": "main",
  "body": "Closes #247"
}`}
        </motion.pre>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-2"
      >
        <Zap className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-[10px] text-muted-foreground font-mono">
          POST api.github.com/repos/acme-corp/login-service/pulls
        </span>
      </motion.div>
    </div>
  );
}

function StepDeliver() {
  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-lg bg-glow-emerald/10 border border-glow-emerald/30 p-4 text-center"
      >
        <CheckCircle className="w-8 h-8 text-glow-emerald mx-auto mb-2" />
        <p className="text-sm font-semibold">Pull Request Created</p>
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          acme-corp/login-service#312
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-lg bg-secondary/50 border border-border/50 p-3"
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Done.</strong> I created PR{" "}
          <span className="text-primary font-mono">#312</span> on{" "}
          <span className="font-mono text-primary">fix/auth-timeout-247</span> → <span className="font-mono">main</span>.
          It references issue #247 and includes the timeout fix in{" "}
          <span className="font-mono text-primary">AuthService.java</span>.
        </p>
      </motion.div>
    </div>
  );
}

const STEP_VISUALS = [StepDescribe, StepReason, StepConnect, StepExecute, StepDeliver];

// ---------------------------------------------------------------------------
// Typing text component
// ---------------------------------------------------------------------------

function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="text-sm leading-relaxed">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-text-bottom"
      />
    </p>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

const CursorWorkflowSection = () => {
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
          <span className="text-xs font-mono text-accent uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3">
            The Cursor <span className="text-gradient-primary">Workflow</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            From a plain-English request to a completed action — see the five stages an AI agent
            goes through using MCP inside Cursor.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-glass rounded-2xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Timeline (left) */}
            <div className="md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-border/50 p-4 md:p-5">
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
                {STEPS.map((s, i) => {
                  const isActive = s.id === activeStep;
                  const isPast = s.id < activeStep;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleStepClick(s.id)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300
                        cursor-pointer flex-shrink-0 w-full text-left
                        ${isActive ? "bg-primary/10 " + s.glowClass + " border" : "hover:bg-secondary/80"}
                        ${isPast && !isActive ? "opacity-50" : ""}
                        ${!isPast && !isActive ? "opacity-40" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300
                          ${isActive ? "bg-primary/20" : "bg-secondary"}`}
                      >
                        <s.icon
                          className={`w-4 h-4 transition-colors duration-300 ${
                            isActive ? s.color : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-mono uppercase tracking-wider ${isActive ? s.color : "text-muted-foreground"}`}>
                          {s.label}
                        </p>
                        <p className={`text-[11px] truncate ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {s.title}
                        </p>
                      </div>
                      {/* Progress dot */}
                      {isActive && (
                        <motion.div
                          layoutId="step-dot"
                          className="w-1.5 h-1.5 rounded-full bg-primary ml-auto flex-shrink-0"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Play / Pause control */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono
                    px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/50
                    hover:border-primary/50 hover:text-primary hover:bg-primary/5
                    transition-all duration-200 cursor-pointer"
                >
                  {playing ? (
                    <>
                      <Pause className="w-3 h-3" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" /> Auto-play
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Visual area (right) */}
            <div className="flex-1 p-5 md:p-8 min-h-[360px] flex flex-col">
              {/* Step header */}
              <div className="flex items-center gap-2 mb-5">
                <step.icon className={`w-5 h-5 ${step.color}`} />
                <span className={`text-sm font-semibold ${step.color}`}>
                  Step {activeStep + 1}: {step.label}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono ml-auto">
                  {activeStep + 1}/{STEPS.length}
                </span>
              </div>

              {/* Animated content */}
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
                  <div
                    key={s.id}
                    className="flex-1 h-1 rounded-full overflow-hidden bg-secondary"
                  >
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

export default CursorWorkflowSection;
