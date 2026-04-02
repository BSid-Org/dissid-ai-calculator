# Workshop: How AI Agents Actually Work

## A DISSID Technical Deep-Dive for Founders & Dev Teams

**Duration:** 3 hours (with breaks)
**Audience:** Technical founders, dev leads, and engineers in KWC who want to build AI agents — not just use them
**Positioning:** Move beyond API wrappers. Understand the architecture that powers production AI coding assistants.

---

## Module 1: The Agent Loop (45 min)

### What makes an "agent" different from a chatbot?

**Core concept:** The Tool Loop

```
User prompt → LLM thinks → requests tool → harness executes tool → result fed back → LLM thinks again → ...
```

**Live demo:** Build a minimal agent loop in 20 lines of Python

- Accept user input
- Send to LLM with tool definitions
- Parse tool call from response
- Execute tool (file read, web search, shell command)
- Feed result back
- Repeat until LLM says "done"

**Key insight:** The LLM doesn't "do" anything — it decides what tools to call. The harness does the work.

### Subsystems of a production agent (from PARITY.md analysis)

| Subsystem | What it does                                   | Example                               |
| --------- | ---------------------------------------------- | ------------------------------------- |
| Tools     | Define what the agent can do                   | Read files, run shell, search web     |
| Hooks     | Intercept tool calls before/after execution    | Block dangerous commands, log actions |
| Plugins   | Extend the agent with third-party capabilities | Add Slack, GitHub, database access    |
| Skills    | Reusable prompt+tool bundles for common tasks  | "Deploy to production", "Review PR"   |
| Session   | Manage conversation history and context        | Compaction, resumption, memory        |
| MCP       | Standard protocol for connecting data sources  | Any API becomes a tool                |
| CLI       | User interface and command routing             | Slash commands, config, permissions   |

---

## Module 2: Tools & Execution (30 min)

### Anatomy of a tool definition

```json
{
  "name": "read_file",
  "description": "Read contents of a file",
  "parameters": {
    "file_path": { "type": "string", "required": true }
  }
}
```

**Exercise:** Define 3 tools for your business domain

- What would a real estate agent's AI need? (MLS search, CMA generator, showing scheduler)
- What would a clinic's AI need? (appointment lookup, patient intake, prescription check)
- What would an e-commerce store's AI need? (inventory check, order status, return processor)

### Tool orchestration patterns

1. **Sequential:** Tool A → Tool B → Tool C (simple pipeline)
2. **Parallel:** Tools A, B, C run simultaneously (independent queries)
3. **Conditional:** If Tool A returns X, run Tool B; else run Tool C
4. **Recursive:** Agent spawns sub-agents with their own tool loops

---

## Module 3: Hooks — The Production Differentiator (30 min)

### Why hooks matter

Without hooks: your agent can delete production databases, leak API keys, send embarrassing emails.

With hooks: you intercept every tool call and decide: allow, deny, modify, or log.

**Hook types:**

- `PreToolUse` — runs before the tool executes (can block or modify)
- `PostToolUse` — runs after the tool executes (can log or transform results)

**Live demo:** Build a safety hook that:

1. Blocks any shell command containing `rm -rf`
2. Redacts API keys from file read results
3. Logs all tool calls to an audit trail

**Business value:** Hooks are what let you deploy AI agents to clients with confidence. Without them, you are shipping a liability.

---

## Break (15 min)

---

## Module 4: MCP — The Integration Standard (30 min)

### Model Context Protocol explained

MCP = a standard way to connect any data source to any AI agent.

```
AI Agent ←→ MCP Client ←→ MCP Server ←→ Your Data
```

**Why it matters:**

- Build one MCP server for "CRM access" → works with Claude, GPT, Gemini, any agent
- Your client's data stays in their infrastructure — agent calls it over MCP
- Each MCP server is a reusable product, not a one-time integration

**Live demo:** Build a simple MCP server that:

1. Exposes a "search_inventory" tool
2. Connects to a SQLite database
3. Returns formatted results to the agent

**Exercise:** Design an MCP server for your industry

- What data sources would your clients need to expose?
- What tools should the server provide?
- What security boundaries are needed?

---

## Module 5: Building Your First Agent Product (30 min)

### From prototype to product

| Layer   | Prototype        | Production                               |
| ------- | ---------------- | ---------------------------------------- |
| Tools   | 3-5 basic tools  | Full tool suite with validation          |
| Hooks   | None             | Safety hooks, audit logging, rate limits |
| Plugins | None             | Client-specific integrations             |
| Session | In-memory        | Persistent, resumable, compactable       |
| MCP     | Direct API calls | Standard MCP servers                     |
| UI      | Terminal         | Web dashboard or embedded widget         |

### Pricing models for AI agent products

1. **Setup + Monthly:** $5-15K setup, $500-2K/month maintenance
2. **Per-interaction:** $0.01-0.10 per agent action (usage-based)
3. **MCP Server License:** $200-500/month per data source connection
4. **Workshop/Training:** $500-2K per attendee for team enablement

### Live architecture session

Attendees sketch their own agent product:

- Target customer and use case
- Tool definitions (3-5 core tools)
- Hook requirements (safety, compliance, logging)
- MCP servers needed (data sources)
- Deployment model (hosted vs self-hosted)

---

## Q&A and Next Steps (15 min)

### Resources

- DISSID consultation: siddhant@dissid.ca
- AI Savings Calculator: https://dissid-ai-calculator.web.app
- Book a call: https://dissid.ca (scroll to consultation section)

### Follow-up offers

- **1-on-1 Architecture Session** ($500): We design your agent product together
- **MCP Server Build** ($3-10K): We build your industry-specific MCP server
- **Full Agent Deployment** ($5-15K): End-to-end custom agent for your business

---

## Workshop Logistics

### Requirements

- Laptop with Python 3.10+ installed
- API key for Claude or OpenAI (free tier sufficient)
- Basic programming experience (any language)

### Venue options (KWC)

- Communitech Hub
- Velocity Garage
- Google Kitchener office (if available)
- Virtual option via Zoom

### Marketing channels

- KW Startup Community Slack
- Communitech newsletter
- LinkedIn (Sid's network)
- Cross-promote on dissid.ai and dissid.ca
