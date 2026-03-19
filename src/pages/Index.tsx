import HeroSection from "@/components/HeroSection";
import ConceptSection from "@/components/ConceptSection";
import ProblemSection from "@/components/ProblemSection";
import ValueSection from "@/components/ValueSection";
import MCPHubSection from "@/components/MCPHubSection";
import ComparisonSection from "@/components/ComparisonSection";
import ArchitectureDiagramSection from "@/components/ArchitectureDiagramSection";
import MCPInstallSection from "@/components/MCPInstallSection";
import CursorWorkflowSection from "@/components/CursorWorkflowSection";
import DynatraceChatSection from "@/components/DynatraceChatSection";
import GitHubMCPSection from "@/components/GitHubMCPSection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <HeroSection />
    <ConceptSection />
    <ProblemSection />
    <ValueSection />
    <MCPHubSection />
    <ComparisonSection />
    <ArchitectureDiagramSection />
    <MCPInstallSection />
    <CursorWorkflowSection />
    <DynatraceChatSection />
    <GitHubMCPSection />

    <footer className="py-12 text-center border-t border-border">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
        Citizen Developers — AI Agents & MCP
      </p>
    </footer>
  </div>
);

export default Index;
