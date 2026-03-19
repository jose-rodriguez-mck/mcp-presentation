import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, MessageSquare, Users, Bot, Plug } from "lucide-react";

const tools = [
  { id: "aws", label: "AWS", icon: Cloud, color: "text-primary" },
  { id: "slack", label: "Slack", icon: MessageSquare, color: "text-accent" },
  { id: "crm", label: "CRM", icon: Users, color: "text-glow-emerald" },
];

const MCPHubSection = () => {
  const [connected, setConnected] = useState(false);

  return (
    <section className="section-padding">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Interactive Demo</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3">The MCP Hub in Action</h2>
          <p className="text-muted-foreground mt-4">Click to connect the AI model with your tools.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-glass rounded-2xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* AI Model */}
            <div className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${connected ? "bg-primary/20 glow-border" : "bg-secondary"}`}>
                <Bot className={`w-10 h-10 transition-colors duration-500 ${connected ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <span className="text-sm font-medium">AI Model</span>
            </div>

            {/* MCP Hub */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setConnected(!connected)}
                className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-500 cursor-pointer hover:scale-105 ${
                  connected
                    ? "border-primary bg-primary/10 glow-border"
                    : "border-border bg-secondary hover:border-muted-foreground"
                }`}
              >
                <Plug className={`w-10 h-10 transition-all duration-500 ${connected ? "text-primary rotate-0" : "text-muted-foreground -rotate-45"}`} />
              </button>
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">MCP Hub</span>
            </div>

            {/* Tools */}
            <div className="flex flex-col gap-4">
              {tools.map((tool, i) => (
                <AnimatePresence key={tool.id}>
                  <motion.div
                    animate={{
                      opacity: connected ? 1 : 0.4,
                      x: connected ? 0 : 20,
                    }}
                    transition={{ duration: 0.4, delay: connected ? i * 0.12 : 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${connected ? "bg-secondary glow-border" : "bg-secondary/50"}`}>
                      <tool.icon className={`w-6 h-6 ${connected ? tool.color : "text-muted-foreground"}`} />
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-500 ${connected ? "text-foreground" : "text-muted-foreground"}`}>
                      {tool.label}
                    </span>
                    {connected && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.12 }}
                        className="w-2 h-2 rounded-full bg-glow-emerald"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
          </div>

          {/* Connection lines (decorative) */}
          <AnimatePresence>
            {connected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 text-center"
              >
                <p className="text-sm text-primary font-mono">
                  ✓ Connection established — 3 tools available
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default MCPHubSection;
