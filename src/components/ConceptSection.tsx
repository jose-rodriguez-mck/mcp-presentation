import { motion } from "framer-motion";
import { Brain, Hand } from "lucide-react";

const cards = [
  {
    icon: Brain,
    title: "The Agent = The Brain",
    description: "Reasons, plans, and makes decisions. It's the logic that understands your intent and orchestrates the steps needed to fulfill it.",
    glowClass: "glow-border" as const,
    iconColor: "text-primary",
  },
  {
    icon: Hand,
    title: "MCP = The Hands",
    description: "Executes actions in the real world: queries databases, sends messages, updates records. It's the protocol that connects intelligence to action.",
    glowClass: "glow-border-accent" as const,
    iconColor: "text-accent",
  },
];

const ConceptSection = () => (
  <section className="section-padding">
    <div className="container max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="text-xs font-mono text-primary uppercase tracking-widest">Concept</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3">
          Brain <span className="text-muted-foreground">&</span> Hands
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={`bg-glass rounded-xl p-8 ${card.glowClass}`}
          >
            <card.icon className={`w-10 h-10 ${card.iconColor} mb-5`} />
            <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ConceptSection;
