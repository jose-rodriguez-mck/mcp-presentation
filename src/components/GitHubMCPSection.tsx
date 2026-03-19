import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  GitPullRequest,
  FileCode,
  Search,
  Tag,
  Users,
  Github,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Tool data
// ---------------------------------------------------------------------------

interface Tool {
  name: string;
  description: string;
}

interface ToolCategory {
  id: string;
  label: string;
  icon: typeof GitBranch;
  color: string;
  tools: Tool[];
}

const CATEGORIES: ToolCategory[] = [
  {
    id: "repository",
    label: "Repository",
    icon: FileCode,
    color: "text-primary",
    tools: [
      { name: "create_repository", description: "Create a new GitHub repository in your account or organization" },
      { name: "fork_repository", description: "Fork a repository to your account or a specified organization" },
      { name: "search_repositories", description: "Find repositories by name, description, topics, or metadata" },
      { name: "get_file_contents", description: "Get the contents of a file or directory from a repository" },
      { name: "create_or_update_file", description: "Create or update a single file with a commit message" },
      { name: "delete_file", description: "Delete a file from a repository on a given branch" },
    ],
  },
  {
    id: "issues",
    label: "Issues",
    icon: GitBranch,
    color: "text-glow-emerald",
    tools: [
      { name: "issue_read", description: "Get details, comments, sub-issues, or labels for an issue" },
      { name: "issue_write", description: "Create a new issue or update an existing one" },
      { name: "list_issues", description: "List and filter issues with pagination and label filters" },
      { name: "search_issues", description: "Search issues across repositories using GitHub syntax" },
      { name: "add_issue_comment", description: "Add a comment to an issue or pull request" },
      { name: "list_issue_types", description: "List supported issue types for an organization" },
      { name: "sub_issue_write", description: "Add, remove, or reprioritize sub-issues on a parent issue" },
    ],
  },
  {
    id: "pull-requests",
    label: "Pull Requests",
    icon: GitPullRequest,
    color: "text-accent",
    tools: [
      { name: "create_pull_request", description: "Create a new pull request between branches" },
      { name: "list_pull_requests", description: "List PRs with filters for state, base, and sort order" },
      { name: "search_pull_requests", description: "Search pull requests across repos using GitHub syntax" },
      { name: "pull_request_read", description: "Get diff, status, files, reviews, comments, or check runs" },
      { name: "update_pull_request", description: "Update title, body, reviewers, state, or draft status" },
      { name: "merge_pull_request", description: "Merge a PR using merge, squash, or rebase strategy" },
      { name: "update_pull_request_branch", description: "Update the PR branch with latest base-branch changes" },
      { name: "pull_request_review_write", description: "Create, submit, or delete a pull request review" },
      { name: "add_comment_to_pending_review", description: "Add a line-level comment to a pending review" },
      { name: "add_reply_to_pull_request_comment", description: "Reply to an existing review comment thread" },
    ],
  },
  {
    id: "code-search",
    label: "Code & Search",
    icon: Search,
    color: "text-yellow-400",
    tools: [
      { name: "search_code", description: "Search code across all GitHub repos for symbols and patterns" },
      { name: "search_users", description: "Find GitHub users by username, name, or profile info" },
      { name: "run_secret_scanning", description: "Scan files or diffs for leaked secrets and credentials" },
    ],
  },
  {
    id: "branches-tags",
    label: "Branches & Releases",
    icon: Tag,
    color: "text-orange-400",
    tools: [
      { name: "create_branch", description: "Create a new branch from an existing branch" },
      { name: "list_branches", description: "List all branches in a repository with pagination" },
      { name: "list_tags", description: "List git tags in a repository" },
      { name: "get_tag", description: "Get details about a specific git tag" },
      { name: "list_releases", description: "List all releases for a repository" },
      { name: "get_latest_release", description: "Get the most recent release" },
      { name: "get_release_by_tag", description: "Get a specific release by its tag name" },
    ],
  },
  {
    id: "collaboration",
    label: "CI/CD & Teams",
    icon: Users,
    color: "text-pink-400",
    tools: [
      { name: "push_files", description: "Push multiple files in a single commit" },
      { name: "list_commits", description: "List commits on a branch with author and pagination filters" },
      { name: "get_commit", description: "Get full commit details including diffs and stats" },
      { name: "get_me", description: "Get details of the authenticated GitHub user" },
      { name: "get_teams", description: "Get teams the authenticated user belongs to" },
      { name: "get_team_members", description: "Get member usernames of a specific org team" },
      { name: "get_label", description: "Get a specific label from a repository" },
      { name: "request_copilot_review", description: "Request automated Copilot code review on a PR" },
    ],
  },
];

const TOTAL_TOOLS = CATEGORIES.reduce((sum, c) => sum + c.tools.length, 0);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const GitHubMCPSection = () => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const active = CATEGORIES.find((c) => c.id === activeCategory)!;

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
          <span className="text-xs font-mono text-primary uppercase tracking-widest">
            GitHub MCP Server
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3">
            Your Entire <span className="text-gradient-primary">GitHub</span> at Your Fingertips
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            The GitHub MCP server exposes your repositories, issues, pull requests, and more as
            tools an AI agent can call directly — no custom integration needed.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <Github className="w-5 h-5 text-muted-foreground" />
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-mono">
              {TOTAL_TOOLS} tools available
            </Badge>
          </div>
        </motion.div>

        {/* Explorer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-glass rounded-2xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Category sidebar */}
            <div className="md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-border/50">
              <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible p-2 md:p-3 gap-1">
                {CATEGORIES.map((cat) => {
                  const isActive = cat.id === activeCategory;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left whitespace-nowrap
                        transition-all duration-200 cursor-pointer flex-shrink-0
                        ${
                          isActive
                            ? "bg-primary/10 glow-border"
                            : "hover:bg-secondary/80"
                        }`}
                    >
                      <cat.icon
                        className={`w-4 h-4 flex-shrink-0 ${isActive ? cat.color : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {cat.label}
                      </span>
                      <span
                        className={`text-[10px] font-mono ml-auto ${
                          isActive ? "text-primary" : "text-muted-foreground/60"
                        }`}
                      >
                        {cat.tools.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tool grid */}
            <div className="flex-1 p-4 md:p-6 min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid sm:grid-cols-2 gap-3"
                >
                  {active.tools.map((tool, i) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="rounded-lg bg-secondary/50 border border-border/50 p-3 group
                        hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                    >
                      <p className="text-xs font-mono text-primary mb-1 break-all">
                        {tool.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {tool.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubMCPSection;
