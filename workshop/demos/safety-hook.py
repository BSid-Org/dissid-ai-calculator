"""
Safety Hooks for AI Agent Tool Calls
=====================================

Why hooks matter for production AI agents:

AI agents that can execute tools (shell commands, API calls, database queries)
are powerful but dangerous without guardrails. Safety hooks act as middleware
around every tool invocation, providing three critical layers:

1. **PreToolUse hooks** - Gate dangerous operations BEFORE they execute.
   An agent hallucinating "rm -rf /" should never reach the shell.

2. **PostToolUse hooks** - Sanitize outputs BEFORE they reach the model.
   Tool output may contain API keys, passwords, or PII that the model
   would otherwise memorize and potentially leak in future responses.

3. **Audit logging** - Record every tool call for compliance, debugging,
   and incident response. When something goes wrong, you need the trail.

This demo shows a minimal but production-inspired hook pipeline.
"""

import re
from datetime import datetime, timezone


# ---------------------------------------------------------------------------
# 1. PreToolUse Hook: Block dangerous commands
# ---------------------------------------------------------------------------

DANGEROUS_PATTERNS = [
    r"rm\s+-rf",
    r"DROP\s+TABLE",
    r"DROP\s+DATABASE",
    r"\bformat\b",
    r"mkfs\.",
    r"dd\s+if=",
    r">\s*/dev/sd",
    r"chmod\s+777",
    r"curl.*\|\s*bash",
    r"wget.*\|\s*sh",
]

_dangerous_re = re.compile("|".join(DANGEROUS_PATTERNS), re.IGNORECASE)


def block_dangerous_commands(tool_name: str, tool_input: str) -> tuple[bool, str]:
    """PreToolUse hook: returns (allowed, reason).

    Scans the tool input for patterns known to be destructive or risky.
    Returns (True, "") if the command is safe, or (False, reason) if blocked.
    """
    if tool_name not in ("bash", "shell", "terminal", "execute"):
        return True, ""

    match = _dangerous_re.search(tool_input)
    if match:
        return False, f"Blocked: dangerous pattern '{match.group()}' detected"

    return True, ""


# ---------------------------------------------------------------------------
# 2. PostToolUse Hook: Redact secrets from output
# ---------------------------------------------------------------------------

SECRET_PATTERNS = [
    (r"sk-[A-Za-z0-9]{20,}", "[REDACTED:API_KEY]"),
    (r"AKIA[A-Z0-9]{16}", "[REDACTED:AWS_KEY]"),
    (r"ghp_[A-Za-z0-9]{36,}", "[REDACTED:GITHUB_TOKEN]"),
    (r"password\s*=\s*\S+", "password=[REDACTED]"),
    (r"secret\s*=\s*\S+", "secret=[REDACTED]"),
    (r"token\s*=\s*\S+", "token=[REDACTED]"),
]


def redact_secrets(tool_output: str) -> str:
    """PostToolUse hook: replaces secret patterns with redaction markers."""
    result = tool_output
    for pattern, replacement in SECRET_PATTERNS:
        result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
    return result


# ---------------------------------------------------------------------------
# 3. Audit Log Hook
# ---------------------------------------------------------------------------

audit_trail: list[dict] = []


def audit_log(
    tool_name: str,
    tool_input: str,
    tool_output: str | None,
    allowed: bool,
) -> None:
    """Records every tool call to the in-memory audit trail."""
    audit_trail.append({
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "tool": tool_name,
        "input": tool_input,
        "output": tool_output,
        "allowed": allowed,
    })


# ---------------------------------------------------------------------------
# Full Pipeline
# ---------------------------------------------------------------------------

def simulate_tool_execution(tool_name: str, tool_input: str) -> str:
    """Simulates running a tool and returning output."""
    return f"[output of {tool_name}]: executed '{tool_input}' successfully"


def demo_hook_pipeline(tool_name: str, tool_input: str) -> dict:
    """Runs the full safety hook pipeline:

    1. PreToolUse  - check if command is allowed
    2. Execute     - run the tool (simulated)
    3. PostToolUse - redact secrets from output
    4. Audit       - log everything

    Returns a dict with the pipeline result.
    """
    # --- Pre-hook ---
    allowed, reason = block_dangerous_commands(tool_name, tool_input)

    if not allowed:
        audit_log(tool_name, tool_input, None, allowed=False)
        return {"allowed": False, "reason": reason, "output": None}

    # --- Execute ---
    raw_output = simulate_tool_execution(tool_name, tool_input)

    # --- Post-hook ---
    safe_output = redact_secrets(raw_output)

    # --- Audit ---
    audit_log(tool_name, tool_input, safe_output, allowed=True)

    return {"allowed": True, "reason": "", "output": safe_output}


# ---------------------------------------------------------------------------
# Demo
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("  Safety Hook Demo — PreToolUse / PostToolUse Pipeline")
    print("=" * 60)

    # Scenario 1: Normal command passes through
    print("\n--- Scenario 1: Safe command ---")
    result = demo_hook_pipeline("bash", "ls -la /home/user")
    print(f"  Allowed: {result['allowed']}")
    print(f"  Output:  {result['output']}")

    # Scenario 2: Dangerous command gets blocked
    print("\n--- Scenario 2: Dangerous command ---")
    result = demo_hook_pipeline("bash", "rm -rf / --no-preserve-root")
    print(f"  Allowed: {result['allowed']}")
    print(f"  Reason:  {result['reason']}")

    # Scenario 3: Output with secrets gets redacted
    print("\n--- Scenario 3: Secret redaction ---")

    # Temporarily override simulate to return secrets
    original = simulate_tool_execution

    def _fake_execute(name, inp):
        return (
            "Config loaded:\n"
            "  OPENAI_KEY=sk-abc123def456ghi789jkl012mno345\n"
            "  AWS_ACCESS=AKIAIOSFODNN7EXAMPLE\n"
            "  password=hunter2\n"
            "  ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1234\n"
            "  DB_HOST=localhost:5432"
        )

    # Monkey-patch for demo
    globals()["simulate_tool_execution"] = _fake_execute

    result = demo_hook_pipeline("bash", "cat .env")
    print(f"  Allowed: {result['allowed']}")
    print(f"  Output:\n{result['output']}")

    # Restore
    globals()["simulate_tool_execution"] = original

    # Show audit trail
    print("\n--- Audit Trail ---")
    for i, entry in enumerate(audit_trail, 1):
        status = "ALLOWED" if entry["allowed"] else "BLOCKED"
        print(f"  {i}. [{status}] {entry['tool']}: {entry['input'][:50]}")

    print()
