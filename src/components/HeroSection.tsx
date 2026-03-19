import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden">
    <div className="absolute inset-0 bg-glow-hero" />
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-glow-primary/5 blur-[120px]" />

    <div className="relative z-10 text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass mb-8"
      >
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">
          AI Agents × MCP — For Citizen Developers
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
      >
        From Chat{" "}
        <span className="text-gradient-primary">to Action</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
      >
        How MCP turns AI into your most efficient work companion.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-12 flex items-center justify-center gap-3"
      >
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse-glow" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Scroll to explore
        </span>
        <div className="w-1 h-1 rounded-full bg-accent animate-pulse-glow" />
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
