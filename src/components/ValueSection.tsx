import { motion } from "framer-motion";
import { Globe, ShieldCheck, Code2 } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Universal Interoperability",
    description: "Any AI model connects to any tool. No vendor lock-in.",
  },
  {
    icon: ShieldCheck,
    title: "Security by Design",
    description: "Full permission control. AI only accesses what you explicitly authorize.",
  },
  {
    icon: Code2,
    title: "Zero Code",
    description: "Configure integrations with JSON. No complex APIs, no SDKs, no friction.",
  },
];

const ValueSection = () => (
  <section className="section-padding">
    <div className="container max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="text-xs font-mono text-accent uppercase tracking-widest">Value Proposition</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3">Why MCP?</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-glass rounded-xl p-8 text-center group hover:glow-border transition-shadow duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/10 transition-colors">
              <f.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ValueSection;
