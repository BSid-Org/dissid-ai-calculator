# AI Agent Workshop - Starter Kit

## Setup (2 minutes)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp env-template.txt .env
# Edit .env with your API key from https://console.anthropic.com/settings/keys
```

## Workshop Demos

Run each demo from the `demos/` directory:

```bash
# Module 1: Minimal agent loop
python demos/minimal-agent.py

# Module 3: Safety hooks
python demos/safety-hook.py

# Module 4: MCP inventory server
python demos/mcp-inventory-server.py
```

## Exercises

After each module, modify the demos:

1. **Add a tool** - Add a `list_directory` tool to the agent loop
2. **Add a hook** - Block commands containing `sudo`
3. **Add an MCP tool** - Add `update_quantity` to the inventory server

## Resources

- DISSID Consultation: siddhant@dissid.ca
- AI Savings Calculator: https://dissid-ai-calculator.web.app
- Book a session: https://dissid.ca
