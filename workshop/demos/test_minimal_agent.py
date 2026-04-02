"""Tests for minimal-agent.py tool definitions and tool functions."""

import json
import os
import subprocess
import tempfile
import sys
import types

# We can't import the module directly if anthropic isn't installed,
# so we provide a stub and exec the source.

DEMO_DIR = os.path.dirname(os.path.abspath(__file__))
AGENT_PATH = os.path.join(DEMO_DIR, "minimal-agent.py")

_source = open(AGENT_PATH).read()
_module = types.ModuleType("agent")
_module.__file__ = AGENT_PATH
# Provide a fake anthropic module with a stub Anthropic class
fake_anthropic = types.ModuleType("anthropic")
fake_anthropic.Anthropic = lambda **kwargs: None
sys.modules["anthropic"] = fake_anthropic
exec(compile(_source, AGENT_PATH, "exec"), _module.__dict__)


def test_tool_schemas_are_valid():
    """Each tool definition must have name, description, and a valid input_schema."""
    for tool in _module.TOOLS:
        assert "name" in tool, "Tool missing 'name'"
        assert "description" in tool, f"Tool '{tool['name']}' missing 'description'"
        schema = tool["input_schema"]
        assert schema["type"] == "object"
        assert "properties" in schema
        assert "required" in schema
        for req in schema["required"]:
            assert req in schema["properties"], f"Required '{req}' not in properties"
    print("PASS: All tool schemas are valid")


def test_read_file():
    """read_file should return the contents of a file."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as f:
        f.write("hello world")
        f.flush()
        path = f.name
    result = _module.read_file(path)
    os.unlink(path)
    assert result == "hello world", f"Expected 'hello world', got '{result}'"
    print("PASS: read_file works")


def test_run_shell():
    """run_shell should capture output."""
    result = _module.run_shell("echo hello")
    assert "hello" in result, f"Expected 'hello' in output, got '{result}'"
    print("PASS: run_shell works")


if __name__ == "__main__":
    test_tool_schemas_are_valid()
    test_read_file()
    test_run_shell()
    print("\nAll tests passed.")
