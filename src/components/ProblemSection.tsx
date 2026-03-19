import { motion } from "framer-motion";
import { X, ArrowRight, Usb } from "lucide-react";

const ProblemSection = () => (
  <section className="section-padding">
    <div className="container max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="text-xs font-mono text-glow-emerald uppercase tracking-widest">The Problem</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3">
          The End of <span className="text-gradient-emerald">Chaos</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 items-center">
        {/* Before */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-glass rounded-xl p-8 text-center"
        >
          <X className="w-8 h-8 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Before</h3>
          <p className="font-mono text-2xl font-bold text-destructive mb-2">N × M</p>
          <p className="text-sm text-muted-foreground">
            Spaghetti integrations. Every model needs a custom connector for each tool.
          </p>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center"
        >
          <ArrowRight className="w-10 h-10 text-primary hidden md:block" />
          <div className="md:hidden w-10 h-10 flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-primary rotate-90" />
          </div>
        </motion.div>

        {/* After */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-glass rounded-xl p-8 text-center glow-border"
        >
          <Usb className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">With MCP</h3>
          <p className="font-mono text-2xl font-bold text-primary mb-2">N + M</p>
          <p className="text-sm text-muted-foreground">
            One universal protocol. The USB-C of AI. Connect once, use everywhere.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ProblemSection;
