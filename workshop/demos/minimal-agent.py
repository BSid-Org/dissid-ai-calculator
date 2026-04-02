"""
Minimal AI Agent Loop Demo
===========================
Demonstrates the core pattern behind every AI agent: a loop that lets an LLM
call tools and feed results back until it has enough info to respond.

Only ~20 lines of core logic. The rest is tool definitions.
"""

import json
import os
import subprocess

import anthropic

if not os.environ.get("ANTHROPIC_API_KEY"):
    import sys
    sys.exit("Set ANTHROPIC_API_KEY in your .env file first. See README.")

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
MODEL = "claude-sonnet-4-20250514"

# ---------------------------------------------------------------------------
# Tool implementations
# ---------------------------------------------------------------------------

def read_file(path: str) -> str:
    """Read and return the contents of a file."""
    with open(path) as f:
        return f.read()

def run_shell(command: str) -> str:
    """Execute a shell command and return its output."""
    # WARNING: shell=True is dangerous in production. See safety-hook.py for guardrails.
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout + result.stderr

def web_search(query: str) -> str:
    """Search the web (simulated for demo purposes)."""
    return f"[Simulated results for '{query}']: 1. Example result A  2. Example result B"

TOOL_FUNCTIONS = {
    "read_file": read_file,
    "run_shell": run_shell,
    "web_search": web_search,
}

# ---------------------------------------------------------------------------
# Tool definitions (JSON schema for the API)
# ---------------------------------------------------------------------------

TOOLS = [
    {
        "name": "read_file",
        "description": "Read the contents of a file at the given path.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string", "description": "File path to read"}},
            "required": ["path"],
        },
    },
    {
        "name": "run_shell",
        "description": "Execute a shell command and return its output.",
        "input_schema": {
            "type": "object",
            "properties": {"command": {"type": "string", "description": "Shell command to run"}},
            "required": ["command"],
        },
    },
    {
        "name": "web_search",
        "description": "Search the web for information.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string", "description": "Search query"}},
            "required": ["query"],
        },
    },
]

# ---------------------------------------------------------------------------
# The agent loop (~20 lines)
# ---------------------------------------------------------------------------

def agent_loop(user_message: str) -> str:
    """Run the agent loop: send message, execute tools, repeat until done."""
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model=MODEL,
            max_tokens=1024,
            tools=TOOLS,
            messages=messages,
        )

        # If the model is done (no more tool calls), return the text
        if response.stop_reason == "end_turn":
            return "".join(b.text for b in response.content if b.type == "text")

        # Otherwise, execute each tool call and feed results back
        messages.append({"role": "assistant", "content": response.content})
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                func = TOOL_FUNCTIONS[block.name]
                try:
                    result = func(**block.input)
                except Exception as e:
                    result = f"Error: {e}"
                print(f"  [tool] {block.name}({block.input}) -> {result[:80]}...")
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result,
                })
        messages.append({"role": "user", "content": tool_results})

# ---------------------------------------------------------------------------
# Interactive REPL
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("Minimal Agent Demo (type 'quit' to exit)")
    print("-" * 40)
    while True:
        try:
            user_input = input("\nYou: ")
        except (EOFError, KeyboardInterrupt):
            break
        if user_input.strip().lower() in ("quit", "exit"):
            break
        answer = agent_loop(user_input)
        print(f"\nAgent: {answer}")
