import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plug,
  BookOpen,
  Terminal,
  Brain,
  Cpu,
  ArrowRight,
  Play,
  Pause,
  Zap,
  Globe,
  GitBranch,
  BarChart3,
  Mail,
  Calendar,
  MessageSquare,
  Code2,
  Settings,
  Layers,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

type LayerId = "mcp" | "skills" | "cli";

interface Layer {
  id: LayerId;
  label: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  icon: typeof Plug;
  description: string;
  bulletPoints: string[];
  exampleTitle: string;
  examples: { icon: typeof Globe; label: string; detail: string }[];
}

const LAYERS: Layer[] = [
  {
    id: "mcp",
    label: "MCP",
    tagline: "Model Context Protocol",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/40",
    glowColor: "rgba(99,102,241,0.3)",
    icon: Plug,
    description:
      "A universal, open protocol that lets AI agents plug into any external tool or data source — zero custom code required.",
    bulletPoints: [
      "Universal plug-in standard (like USB for AI)",
      "Agent discovers tools automatically",
      "Works across Claude, ChatGPT, Cursor, VSCode…",
      "Built-in permission model per tool",
    ],
    exampleTitle: "Connected MCP Servers",
    examples: [
      { icon: GitBranch, label: "GitHub MCP", detail: "41 tools" },
      { icon: BarChart3, label: "Dynatrace MCP", detail: "20 tools" },
      { icon: Mail, label: "Gmail MCP", detail: "8 tools" },
      { icon: Calendar, label: "Google Calendar MCP", detail: "6 tools" },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    tagline: "Reusable AI Playbooks",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/40",
    glowColor: "rgba(168,85,247,0.3)",
    icon: BookOpen,
    description:
      "Markdown files that encode your team's best practices, standards, and step-by-step workflows — loaded into the agent's context on demand.",
    bulletPoints: [
      "Plain markdown — anyone can write them",
      "Agent reads & follows like a procedure manual",
      "Reusable across projects and teams",
      "Version-controlled just like code",
    ],
    exampleTitle: "Skill Files in Action",
    examples: [
      { icon: Layers, label: "improve-ui/SKILL.md", detail: "UI standards" },
      { icon: Code2, label: "build/SKILL.md", detail: "Build pipeline" },
      { icon: BookOpen, label: "docs/SKILL.md", detail: "Doc templates" },
      { icon: Settings, label: "deploy/SKILL.md", detail: "Release checklist" },
    ],
  },
  {
    id: "cli",
    label: "CLI",
    tagline: "Common Line Interface",
    color: "text-glow-emerald",
    bgColor: "bg-[hsl(160,80%,50%)]/10",
    borderColor: "border-[hsl(160,80%,50%)]/40",
    glowColor: "rgba(52,211,153,0.3)",
    icon: Terminal,
    description:
      "A standardised command-line bridge that lets agents call any local script, tool, or API securely — without exposing raw shell access.",
    bulletPoints: [
      "Wraps existing scripts & executables",
      "Structured JSON in / structured JSON out",
      "Safe sandbox — no unrestricted shell access",
      "Composable with MCP and Skills",
    ],
    exampleTitle: "CLI Tool Examples",
    examples: [
      { icon: Terminal, label: "run-tests", detail: "pytest / jest" },
      { icon: Zap, label: "deploy-service", detail: "Docker / k8s" },
      { icon: MessageSquare, label: "send-alert", detail: "Slack / Teams" },
      { icon: Globe, label: "fetch-api", detail: "curl wrapper" },
    ],
  },
];

const STEP_DURATION = 4500;

// ---------------------------------------------------------------------------
// Animated data packet traveling between nodes
// ---------------------------------------------------------------------------

function DataPacket({
  color,
  delay,
  reverse,
}: {
  color: string;
  delay: number;
  reverse?: boolean;
}) {
  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${color} shadow-lg`}
      initial={{ left: reverse ? "100%" : "0%", opacity: 0 }}
      animate={{
        left: reverse ? ["100%", "0%"] : ["0%", "100%"],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.6,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut",
      }}
      style={{ top: "50%", transform: "translateY(-50%)" }}
    />
  );
}

// ---------------------------------------------------------------------------
// Central Agent Node
// ---------------------------------------------------------------------------

function AgentNode({ activeLayer }: { activeLayer: LayerId }) {
  const layer = LAYERS.find((l) => l.id === activeLayer)!;
  return (
    <motion.div
      layout
      className="relative flex flex-col items-center gap-1"
    >
      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/20"
          style={{ width: 80 + i * 28, height: 80 + i * 28 }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.1, 0.6] }}
          transition={{
            duration: 2.4,
            delay: i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Core circle */}
      <motion.div
        className="w-20 h-20 rounded-full bg-glass border-2 border-primary/60 flex items-center justify-center relative z-10"
        animate={{ borderColor: layer.glowColor }}
        transition={{ duration: 0.5 }}
        style={{ boxShadow: `0 0 30px ${layer.glowColor}` }}
      >
        <Brain className="w-8 h-8 text-primary" />
      </motion.div>
      <span className="text-xs font-mono text-primary font-semibold z-10">
        AI Agent
      </span>
      {/* Floating LLM badge */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1 flex gap-1 z-10"
      >
        {["Claude", "GPT-5", "Gemini"].map((m, i) => (
          <motion.span
            key={m}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className="text-[9px] font-mono text-muted-foreground bg-secondary/60 border border-border/50 px-1.5 py-0.5 rounded"
          >
            {m}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// App icons strip (left side)
// ---------------------------------------------------------------------------

function AppStrip() {
  const apps = [
    { icon: Cpu, label: "Cursor" },
    { icon: MessageSquare, label: "Claude" },
    { icon: Brain, label: "ChatGPT" },
    { icon: Code2, label: "VSCode" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {apps.map((a, i) => (
        <motion.div
          key={a.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 + 0.3 }}
          className="w-12 h-12 rounded-xl bg-glass border border-border/60 flex flex-col items-center justify-center gap-0.5"
        >
          <a.icon className="w-5 h-5 text-muted-foreground" />
          <span className="text-[8px] font-mono text-muted-foreground leading-none">
            {a.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layer detail panel (right side)
// ---------------------------------------------------------------------------

function LayerDetail({ layer }: { layer: Layer }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={layer.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.35 }}
        className="space-y-4"
      >
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {layer.description}
        </p>

        {/* Bullet points */}
        <div className="space-y-2">
          {layer.bulletPoints.map((bp, i) => (
            <motion.div
              key={bp}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.1 }}
              className="flex items-start gap-2"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  layer.id === "mcp"
                    ? "bg-primary"
                    : layer.id === "skills"
                    ? "bg-accent"
                    : "bg-glow-emerald"
                }`}
              />
              <span className="text-xs text-muted-foreground">{bp}</span>
            </motion.div>
          ))}
        </div>

        {/* Examples grid */}
        <div>
          <p className={`text-[10px] font-mono uppercase tracking-wider mb-2 ${layer.color}`}>
            {layer.exampleTitle}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {layer.examples.map((ex, i) => (
              <motion.div
                key={ex.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                className={`rounded-lg ${layer.bgColor} border ${layer.borderColor} p-2.5 flex items-center gap-2`}
              >
                <ex.icon className={`w-4 h-4 flex-shrink-0 ${layer.color}`} />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium truncate">{ex.label}</p>
                  <p className={`text-[9px] font-mono ${layer.color} opacity-70`}>
                    {ex.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Connection arm with animated packets
// ---------------------------------------------------------------------------

function ConnectionArm({
  layer,
  isActive,
}: {
  layer: Layer;
  isActive: boolean;
}) {
  const colorMap: Record<LayerId, string> = {
    mcp: "bg-primary",
    skills: "bg-accent",
    cli: "bg-glow-emerald",
  };
  const dotColor = colorMap[layer.id];

  return (
    <div
      className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-500 cursor-pointer ${
        isActive
          ? `${layer.bgColor} ${layer.borderColor}`
          : "bg-secondary/30 border-border/40 hover:bg-secondary/50"
      }`}
    >
      {/* Animated line */}
      <div className="relative w-8 h-0.5 bg-border/40 overflow-hidden flex-shrink-0">
        {isActive && (
          <>
            <DataPacket color={dotColor} delay={0} />
            <DataPacket color={dotColor} delay={0.8} />
          </>
        )}
        <motion.div
          className={`absolute inset-0 ${isActive ? dotColor : "bg-transparent"} opacity-30`}
          animate={{ opacity: isActive ? [0.2, 0.5, 0.2] : 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Icon */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
          isActive ? layer.bgColor : "bg-secondary"
        }`}
      >
        <layer.icon
          className={`w-4 h-4 transition-colors duration-300 ${
            isActive ? layer.color : "text-muted-foreground"
          }`}
        />
      </div>

      <div className="min-w-0">
        <p
          className={`text-xs font-semibold transition-colors duration-300 ${
            isActive ? layer.color : "text-foreground"
          }`}
        >
          {layer.label}
        </p>
        <p className="text-[10px] text-muted-foreground truncate">
          {layer.tagline}
        </p>
      </div>

      {isActive && (
        <motion.div
          layoutId="active-arm-dot"
          className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0 ml-auto`}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

const ArchitectureDiagramSection = () => {
  const [activeLayer, setActiveLayer] = useState<LayerId>("mcp");
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const ids: LayerId[] = ["mcp", "skills", "cli"];
    const timer = setInterval(() => {
      setActiveLayer((prev) => {
        const idx = ids.indexOf(prev);
        return ids[(idx + 1) % ids.length];
      });
    }, STEP_DURATION);
    return () => clearInterval(timer);
  }, [playing]);

  const layer = LAYERS.find((l) => l.id === activeLayer)!;

  return (
    <section className="section-padding">
      <div className="container max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">
            Architecture
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3">
            MCPs, Skills &{" "}
            <span className="text-gradient-primary">CLIs Explained</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Three complementary layers that give AI agents superpowers — each
            solving a different part of the puzzle.
          </p>
        </motion.div>

        {/* Main diagram card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-glass rounded-2xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row min-h-[520px]">
            {/* ── Left column: diagram ── */}
            <div className="lg:w-[420px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-border/50 p-6 flex flex-col gap-6">
              {/* Top row: Apps → Agent */}
              <div className="flex items-center justify-center gap-4">
                {/* App strip */}
                <div>
                  <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2 text-center">
                    AI Agents
                  </p>
                  <AppStrip />
                </div>

                {/* Arrow + LLM label */}
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
                    LLM
                  </p>
                  <div className="relative w-16 h-0.5 bg-border/50">
                    <DataPacket color="bg-primary" delay={0} />
                    <DataPacket color="bg-primary" delay={1} reverse />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground -mt-1" />
                </div>

                {/* Agent node */}
                <AgentNode activeLayer={activeLayer} />
              </div>

              {/* Divider */}
              <div className="border-t border-border/40" />

              {/* Layer arms */}
              <div>
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-3">
                  Extension Layers
                </p>
                <div className="space-y-2">
                  {LAYERS.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        setActiveLayer(l.id);
                        setPlaying(false);
                      }}
                    >
                      <ConnectionArm layer={l} isActive={l.id === activeLayer} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Services row (connected to MCP) */}
              <AnimatePresence>
                {activeLayer === "mcp" && (
                  <motion.div
                    key="services"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                      External Services
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { icon: GitBranch, label: "GitHub" },
                        { icon: BarChart3, label: "Dynatrace" },
                        { icon: Mail, label: "Gmail" },
                        { icon: Globe, label: "Any API" },
                      ].map((s, i) => (
                        <motion.div
                          key={s.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-center gap-1.5 rounded-lg bg-primary/5 border border-primary/20 px-2 py-1.5"
                        >
                          <s.icon className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {s.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeLayer === "skills" && (
                  <motion.div
                    key="skill-files"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                      Skill Contents (example)
                    </p>
                    <div className="rounded-lg bg-accent/5 border border-accent/20 p-3 font-mono text-[10px] text-muted-foreground leading-relaxed space-y-0.5">
                      <p className={`text-accent font-semibold`}># improve-ui / SKILL.md</p>
                      <p>- Always use rounded corners</p>
                      <p>- Always use border shadows</p>
                      <p>- Buttons must have hover states</p>
                      <p>- Use consistent spacing scale</p>
                    </div>
                  </motion.div>
                )}

                {activeLayer === "cli" && (
                  <motion.div
                    key="cli-terminal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                      CLI in action
                    </p>
                    <div className="rounded-lg bg-[hsl(160,80%,50%)]/5 border border-[hsl(160,80%,50%)]/20 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[9px] font-mono text-muted-foreground ml-1">
                          shell
                        </span>
                      </div>
                      <CliTyping />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Play / Pause */}
              <div className="flex justify-center mt-auto pt-2">
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

            {/* ── Right column: detail panel ── */}
            <div className="flex-1 p-6 md:p-8 flex flex-col">
              {/* Active layer header */}
              <div className={`flex items-center gap-3 mb-6 pb-5 border-b border-border/40`}>
                <motion.div
                  key={activeLayer}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`w-12 h-12 rounded-xl ${layer.bgColor} border ${layer.borderColor} flex items-center justify-center`}
                  style={{ boxShadow: `0 0 20px ${layer.glowColor}` }}
                >
                  <layer.icon className={`w-6 h-6 ${layer.color}`} />
                </motion.div>
                <div>
                  <motion.p
                    key={`title-${activeLayer}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xl font-bold ${layer.color}`}
                  >
                    {layer.label}
                  </motion.p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {layer.tagline}
                  </p>
                </div>

                {/* Progress dots */}
                <div className="ml-auto flex gap-2">
                  {LAYERS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        setActiveLayer(l.id);
                        setPlaying(false);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        l.id === activeLayer
                          ? l.id === "mcp"
                            ? "bg-primary scale-125"
                            : l.id === "skills"
                            ? "bg-accent scale-125"
                            : "bg-glow-emerald scale-125"
                          : "bg-border/60 hover:bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Layer detail */}
              <div className="flex-1">
                <LayerDetail layer={layer} />
              </div>

              {/* Bottom: "How they work together" */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-6 pt-5 border-t border-border/40"
              >
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-3">
                  How they work together
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1.5">
                    <Plug className="w-3 h-3 text-primary" />
                    <span className="font-mono text-primary">MCP</span>
                    <span>connects to services</span>
                  </div>
                  <ArrowRight className="w-3 h-3 flex-shrink-0 text-muted-foreground/50 hidden sm:block" />
                  <div className="flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/20 px-2.5 py-1.5">
                    <BookOpen className="w-3 h-3 text-accent" />
                    <span className="font-mono text-accent">Skills</span>
                    <span>guide the agent</span>
                  </div>
                  <ArrowRight className="w-3 h-3 flex-shrink-0 text-muted-foreground/50 hidden sm:block" />
                  <div className="flex items-center gap-1.5 rounded-lg bg-[hsl(160,80%,50%)]/10 border border-[hsl(160,80%,50%)]/20 px-2.5 py-1.5">
                    <Terminal className="w-3 h-3 text-glow-emerald" />
                    <span className="font-mono text-glow-emerald">CLI</span>
                    <span>runs local tasks</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Progress bar strip */}
        <div className="mt-4 flex gap-1.5">
          {LAYERS.map((l) => (
            <div
              key={l.id}
              className="flex-1 h-1 rounded-full overflow-hidden bg-secondary cursor-pointer"
              onClick={() => {
                setActiveLayer(l.id);
                setPlaying(false);
              }}
            >
              <motion.div
                className={`h-full rounded-full ${
                  l.id === "mcp"
                    ? "bg-primary"
                    : l.id === "skills"
                    ? "bg-accent"
                    : "bg-glow-emerald"
                }`}
                animate={{
                  width:
                    LAYERS.indexOf(l) < LAYERS.findIndex((x) => x.id === activeLayer)
                      ? "100%"
                      : l.id === activeLayer
                      ? "100%"
                      : "0%",
                }}
                transition={{
                  duration:
                    l.id === activeLayer && playing ? STEP_DURATION / 1000 : 0.3,
                  ease: l.id === activeLayer && playing ? "linear" : "easeOut",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// CLI typing animation helper
// ---------------------------------------------------------------------------

function CliTyping() {
  const lines = [
    "$ agent run-tests --suite auth",
    "> Running 47 tests…",
    "> ✓ 45 passed  ✗ 2 failed",
    "$ agent deploy-service --env staging",
    "> Deploying login-service v2.1.4…",
    "> ✓ Deployed successfully",
  ];
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    setVisibleLines(0);
    const timers = lines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), i * 600)
    );
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-0.5">
      {lines.slice(0, visibleLines).map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className={`text-[10px] font-mono ${
            line.startsWith("$")
              ? "text-glow-emerald"
              : line.includes("✓")
              ? "text-green-400"
              : line.includes("✗")
              ? "text-red-400"
              : "text-muted-foreground"
          }`}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}

export default ArchitectureDiagramSection;
