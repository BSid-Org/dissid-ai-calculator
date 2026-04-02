Most "AI agents" are just API wrappers with a for loop.

Real production agents have 7 subsystems: tools, hooks, plugins, skills, sessions, MCP, and a CLI. I studied the architecture of a 130K-star open source agent harness to understand how they actually work.

Here's the surprising part: the LLM doesn't DO anything. It decides what tools to call. The harness does the work. The hooks keep it safe. The MCP layer connects it to your data.

I'm running a hands-on workshop in KWC where you'll build all three in 3 hours:

1. A working agent loop (20 lines of Python)
2. Safety hooks that block dangerous commands
3. An MCP server that connects a database to your agent

No slides. No theory dumps. You write code, you run it, you leave with a working prototype.

If you're a technical founder or dev lead building AI products — this is the session that shows you what's actually under the hood.

DM me or email siddhant@dissid.ca for details.

#AI #AIAgents #MCP #KWTech #StartupLife #DISSID
