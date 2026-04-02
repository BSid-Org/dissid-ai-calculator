"""
MCP Inventory Server Demo
==========================

What is MCP (Model Context Protocol)?
--------------------------------------
MCP is an open protocol that lets AI assistants (like Claude) connect to
external data sources and tools. Think of it as a USB-C port for AI — a
standard way to plug capabilities into any AI model.

How this demo works:
--------------------
This script creates an MCP server that exposes a simple inventory database
via two tools:

  1. search_inventory(query, category?) — search items by name/description
  2. get_item(item_id) — retrieve full details of a single item

The server uses stdio transport, meaning it communicates over stdin/stdout.
An MCP client (like Claude Desktop) launches this script as a subprocess
and sends JSON-RPC messages to invoke the tools.

To run:
    pip install mcp
    python mcp-inventory-server.py

To connect from Claude Desktop, add to claude_desktop_config.json:
    {
      "mcpServers": {
        "inventory": {
          "command": "python",
          "args": ["path/to/mcp-inventory-server.py"]
        }
      }
    }
"""

import sqlite3
from mcp.server.fastmcp import FastMCP


def setup_database() -> sqlite3.Connection:
    """Create an in-memory SQLite database with 20 sample inventory items."""
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE inventory (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            quantity_in_stock INTEGER NOT NULL
        )
    """)
    items = [
        # Electronics
        (1, "Wireless Mouse", "Ergonomic Bluetooth mouse with USB-C charging", "electronics", 29.99, 150),
        (2, "USB-C Hub", "7-in-1 hub with HDMI, USB-A, SD card reader", "electronics", 49.99, 75),
        (3, "Mechanical Keyboard", "Cherry MX Brown switches, RGB backlit", "electronics", 89.99, 40),
        (4, "Portable Monitor", "15.6 inch 1080p USB-C portable display", "electronics", 199.99, 25),
        # Clothing
        (5, "Merino Wool Hoodie", "Lightweight temperature-regulating hoodie", "clothing", 120.00, 60),
        (6, "Running Shoes", "Lightweight mesh with carbon fiber plate", "clothing", 159.99, 35),
        (7, "Waterproof Jacket", "Breathable 3-layer shell, fully seam-sealed", "clothing", 249.99, 20),
        (8, "Wool Beanie", "Double-knit merino wool, one size fits most", "clothing", 24.99, 200),
        # Food
        (9, "Organic Coffee Beans", "Single-origin Ethiopian Yirgacheffe, 1lb bag", "food", 18.99, 300),
        (10, "Dark Chocolate Bar", "85% cacao, fair trade, 100g", "food", 4.99, 500),
        (11, "Trail Mix", "Almonds, cashews, dried cranberries, dark chocolate chips", "food", 8.99, 180),
        (12, "Matcha Powder", "Ceremonial grade Japanese matcha, 30g tin", "food", 32.00, 90),
        # Tools
        (13, "Precision Screwdriver Set", "64-bit magnetic screwdriver kit for electronics", "tools", 34.99, 120),
        (14, "Digital Multimeter", "Auto-ranging with True RMS, CAT III rated", "tools", 59.99, 55),
        (15, "Soldering Station", "Adjustable temperature 200-480C with LED display", "tools", 79.99, 30),
        (16, "Wire Stripper", "Self-adjusting for 10-24 AWG wire", "tools", 19.99, 200),
        # Books
        (17, "Designing Data-Intensive Applications", "By Martin Kleppmann — distributed systems bible", "books", 45.99, 80),
        (18, "The Pragmatic Programmer", "20th anniversary edition, Hunt & Thomas", "books", 39.99, 65),
        (19, "Hands-On Machine Learning", "Scikit-Learn, Keras & TensorFlow, 3rd edition", "books", 54.99, 50),
        (20, "Clean Code", "Robert C. Martin — writing readable software", "books", 34.99, 110),
    ]
    conn.executemany(
        "INSERT INTO inventory VALUES (?, ?, ?, ?, ?, ?)", items
    )
    conn.commit()
    return conn


# --- Server setup ---

server = FastMCP("inventory")
db = setup_database()


@server.tool()
async def search_inventory(query: str, category: str | None = None) -> str:
    """Search inventory items by name or description.

    Args:
        query: Text to search for in item names and descriptions.
        category: Optional filter — one of: electronics, clothing, food, tools, books.

    Returns:
        Matching items as a formatted text list, or a message if none found.
    """
    sql = """
        SELECT id, name, category, price, quantity_in_stock
        FROM inventory
        WHERE (name LIKE ? OR description LIKE ?)
    """
    params: list = [f"%{query}%", f"%{query}%"]

    if category:
        sql += " AND category = ?"
        params.append(category)

    sql += " ORDER BY name"

    rows = db.execute(sql, params).fetchall()

    if not rows:
        return f"No items found matching '{query}'" + (
            f" in category '{category}'" if category else ""
        )

    lines = []
    for r in rows:
        lines.append(
            f"[{r['id']}] {r['name']} — ${r['price']:.2f} "
            f"({r['quantity_in_stock']} in stock) [{r['category']}]"
        )
    return "\n".join(lines)


@server.tool()
async def get_item(item_id: int) -> str:
    """Get full details of a single inventory item by its ID.

    Args:
        item_id: The numeric ID of the item (1-20).

    Returns:
        Formatted item details, or an error message if not found.
    """
    row = db.execute(
        "SELECT * FROM inventory WHERE id = ?", (item_id,)
    ).fetchone()

    if not row:
        return f"No item found with ID {item_id}"

    return (
        f"Item #{row['id']}: {row['name']}\n"
        f"Category:    {row['category']}\n"
        f"Price:       ${row['price']:.2f}\n"
        f"In Stock:    {row['quantity_in_stock']}\n"
        f"Description: {row['description']}"
    )


if __name__ == "__main__":
    server.run(transport="stdio")
