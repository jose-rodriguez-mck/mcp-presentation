import { motion } from "framer-motion";
import {
  X,
  Check,
  Minus,
  Usb,
  Code2,
  Webhook,
  Puzzle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Method {
  id: string;
  name: string;
  icon: typeof Code2;
  color: string;
  tagline: string;
}

interface ComparisonRow {
  criterion: string;
  values: Record<string, "yes" | "no" | "partial" | string>;
}

const METHODS: Method[] = [
  { id: "rest",   name: "REST APIs",     icon: Code2,   color: "text-orange-400",    tagline: "Manual HTTP calls" },
  { id: "sdk",    name: "SDKs",          icon: Puzzle,  color: "text-yellow-400",     tagline: "Language-specific libs" },
  { id: "webhook",name: "Webhooks",      icon: Webhook, color: "text-pink-400",       tagline: "Event-driven push" },
  { id: "mcp",    name: "MCP",           icon: Usb,     color: "text-primary",        tagline: "Universal protocol" },
];

const ROWS: ComparisonRow[] = [
  {
    criterion: "Setup complexity",
    values: { rest: "High — auth, endpoints, parsing", sdk: "Medium — install & configure", webhook: "Medium — server + routing", mcp: "Low — JSON config only" },
  },
  {
    criterion: "Code required",
    values: { rest: "yes", sdk: "yes", webhook: "yes", mcp: "no" },
  },
  {
    criterion: "AI-agent friendly",
    values: { rest: "partial", sdk: "partial", webhook: "no", mcp: "yes" },
  },
  {
    criterion: "Tool discovery",
    values: { rest: "no", sdk: "no", webhook: "no", mcp: "yes" },
  },
  {
    criterion: "Multi-tool orchestration",
    values: { rest: "Manual chaining", sdk: "Manual chaining", webhook: "Not applicable", mcp: "Automatic by agent" },
  },
  {
    criterion: "Vendor agnostic",
    values: { rest: "no", sdk: "no", webhook: "partial", mcp: "yes" },
  },
  {
    criterion: "Bidirectional comms",
    values: { rest: "no", sdk: "partial", webhook: "partial", mcp: "yes" },
  },
  {
    criterion: "Permission model",
    values: { rest: "Custom per API", sdk: "Custom per SDK", webhook: "Custom per hook", mcp: "Built-in per tool" },
  },
];

// ---------------------------------------------------------------------------
// Cell renderer
// ---------------------------------------------------------------------------

function CellValue({ value, isMcp }: { value: string; isMcp: boolean }) {
  if (value === "yes") {
    return (
      <div className="flex justify-center">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isMcp ? "bg-primary/20" : "bg-glow-emerald/20"}`}>
          <Check className={`w-3 h-3 ${isMcp ? "text-primary" : "text-glow-emerald"}`} />
        </div>
      </div>
    );
  }
  if (value === "no") {
    return (
      <div className="flex justify-center">
        <div className="w-5 h-5 rounded-full bg-destructive/15 flex items-center justify-center">
          <X className="w-3 h-3 text-destructive" />
        </div>
      </div>
    );
  }
  if (value === "partial") {
    return (
      <div className="flex justify-center">
        <div className="w-5 h-5 rounded-full bg-yellow-500/15 flex items-center justify-center">
          <Minus className="w-3 h-3 text-yellow-400" />
        </div>
      </div>
    );
  }
  return (
    <span className={`text-[10px] leading-tight ${isMcp ? "text-primary font-medium" : "text-muted-foreground"}`}>
      {value}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ComparisonSection = () => (
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
        <span className="text-xs font-mono text-primary uppercase tracking-widest">
          Comparison
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3">
          MCP vs <span className="text-gradient-primary">Traditional Methods</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          How does MCP stack up against REST APIs, SDKs, and Webhooks
          for connecting AI agents to external tools?
        </p>
      </motion.div>

      {/* Method cards (mobile-friendly summary) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        {METHODS.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`bg-glass rounded-xl p-4 text-center ${m.id === "mcp" ? "glow-border" : ""}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${
              m.id === "mcp" ? "bg-primary/20" : "bg-secondary"
            }`}>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <p className="text-sm font-semibold">{m.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{m.tagline}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-glass rounded-2xl overflow-hidden"
      >
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-mono text-muted-foreground uppercase tracking-wider px-5 py-4 w-[200px]">
                  Criterion
                </th>
                {METHODS.map((m) => (
                  <th
                    key={m.id}
                    className={`text-center text-xs font-mono uppercase tracking-wider px-4 py-4 ${
                      m.id === "mcp" ? "text-primary bg-primary/5" : "text-muted-foreground"
                    }`}
                  >
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <motion.tr
                  key={row.criterion}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: ri * 0.04 }}
                  className="border-b border-border/30 last:border-b-0"
                >
                  <td className="text-xs font-medium px-5 py-3.5">
                    {row.criterion}
                  </td>
                  {METHODS.map((m) => (
                    <td
                      key={m.id}
                      className={`text-center px-4 py-3.5 ${m.id === "mcp" ? "bg-primary/5" : ""}`}
                    >
                      <CellValue value={row.values[m.id]} isMcp={m.id === "mcp"} />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden p-4 space-y-4">
          {ROWS.map((row, ri) => (
            <motion.div
              key={row.criterion}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: ri * 0.04 }}
              className="rounded-lg bg-secondary/40 border border-border/50 p-3"
            >
              <p className="text-xs font-semibold mb-2">{row.criterion}</p>
              <div className="grid grid-cols-2 gap-2">
                {METHODS.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-center gap-2 rounded px-2 py-1.5 ${
                      m.id === "mcp" ? "bg-primary/10 border border-primary/20" : "bg-secondary/60"
                    }`}
                  >
                    <span className={`text-[9px] font-mono ${m.color} w-10 flex-shrink-0`}>
                      {m.name.slice(0, 7)}
                    </span>
                    <CellValue value={row.values[m.id]} isMcp={m.id === "mcp"} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom highlight */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-muted-foreground">
          MCP is the only method designed from the ground up for{" "}
          <span className="text-primary font-semibold">AI-agent interoperability</span> —
          zero code, automatic discovery, and built-in permissions.
        </p>
      </motion.div>
    </div>
  </section>
);

export default ComparisonSection;
