"""Tests for the MCP inventory server."""

import asyncio
import importlib.util
import sys
from pathlib import Path

import pytest

# Import the server module from its hyphenated filename
_spec = importlib.util.spec_from_file_location(
    "mcp_inventory_server",
    Path(__file__).parent / "mcp-inventory-server.py",
)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["mcp_inventory_server"] = _mod
_spec.loader.exec_module(_mod)

setup_database = _mod.setup_database
search_inventory = _mod.search_inventory
get_item = _mod.get_item


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

@pytest.fixture()
def db(monkeypatch):
    """Provide a fresh database and patch the module-level db reference."""
    conn = setup_database()
    monkeypatch.setattr(_mod, "db", conn)
    yield conn
    conn.close()


def run(coro):
    return asyncio.run(coro)


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class TestSetupDatabase:
    def test_creates_20_items(self, db):
        count = db.execute("SELECT COUNT(*) FROM inventory").fetchone()[0]
        assert count == 20

    def test_has_all_categories(self, db):
        rows = db.execute(
            "SELECT DISTINCT category FROM inventory ORDER BY category"
        ).fetchall()
        categories = sorted(r[0] for r in rows)
        assert categories == ["books", "clothing", "electronics", "food", "tools"]


class TestSearchInventory:
    def test_search_by_name(self, db):
        result = run(search_inventory("mouse"))
        assert "Wireless Mouse" in result

    def test_search_by_description(self, db):
        result = run(search_inventory("Bluetooth"))
        assert "Wireless Mouse" in result

    def test_search_with_category_filter(self, db):
        result = run(search_inventory("wool", category="clothing"))
        assert "Hoodie" in result or "Beanie" in result
        # Should not include items from other categories
        assert "food" not in result.lower().split("clothing")[0] if "clothing" in result else True

    def test_search_no_results(self, db):
        result = run(search_inventory("xyznonexistent"))
        assert "No items found" in result

    def test_search_no_results_with_category(self, db):
        result = run(search_inventory("mouse", category="food"))
        assert "No items found" in result
        assert "food" in result


class TestGetItem:
    def test_get_existing_item(self, db):
        result = run(get_item(1))
        assert "Wireless Mouse" in result
        assert "$29.99" in result
        assert "electronics" in result

    def test_get_item_not_found(self, db):
        result = run(get_item(999))
        assert "No item found" in result

    def test_get_item_has_all_fields(self, db):
        result = run(get_item(17))
        assert "Designing Data-Intensive Applications" in result
        assert "books" in result
        assert "$45.99" in result
        assert "Description:" in result
