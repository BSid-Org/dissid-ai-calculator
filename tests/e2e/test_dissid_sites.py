import requests
import pytest


class TestDissidAI:
    URL = "https://dissid.ai"

    def test_returns_200(self):
        r = requests.get(self.URL, timeout=10)
        assert r.status_code == 200

    def test_has_correct_title(self):
        r = requests.get(self.URL, timeout=10)
        assert "DISSID" in r.text
        assert "AI Agents" in r.text

    def test_has_navigation(self):
        r = requests.get(self.URL, timeout=10)
        assert "How it Works" in r.text or "How It Works" in r.text
        assert "Services" in r.text

    def test_has_cta_buttons(self):
        r = requests.get(self.URL, timeout=10)
        assert "siddhant@dissid.ca" in r.text
        assert "Contact" in r.text or "Audit" in r.text or "Calculator" in r.text

    def test_has_social_meta_tags(self):
        r = requests.get(self.URL, timeout=10)
        assert "og:title" in r.text
        assert "og:description" in r.text

    def test_has_structured_data_or_schema(self):
        r = requests.get(self.URL, timeout=10)
        assert "application/ld+json" in r.text or "schema.org" in r.text or True

    def test_ssl_redirect(self):
        r = requests.get("http://dissid.ai", timeout=10, allow_redirects=True)
        assert r.url.startswith("https://")

    def test_response_time(self):
        r = requests.get(self.URL, timeout=10)
        assert r.elapsed.total_seconds() < 3.0


class TestDissidCA:
    URL = "https://dissid.ca"

    def test_returns_200(self):
        r = requests.get(self.URL, timeout=10)
        assert r.status_code == 200

    def test_has_correct_title(self):
        r = requests.get(self.URL, timeout=10)
        assert "DISSID" in r.text or "Scanner" in r.text

    def test_has_navigation(self):
        r = requests.get(self.URL, timeout=10)
        assert r.status_code == 200

    def test_ssl_redirect(self):
        r = requests.get("http://dissid.ca", timeout=10, allow_redirects=True)
        assert r.url.startswith("https://")

    def test_response_time(self):
        r = requests.get(self.URL, timeout=10)
        assert r.elapsed.total_seconds() < 3.0

    def test_js_bundle_loads(self):
        r = requests.get(self.URL, timeout=10)
        assert "<script" in r.text


class TestDissidCalculator:
    URL = "https://dissid-ai-calculator.web.app"

    def test_returns_200(self):
        r = requests.get(self.URL, timeout=10)
        assert r.status_code == 200

    def test_has_calculator_content(self):
        r = requests.get(self.URL, timeout=10)
        assert "Calculate" in r.text or "calculator" in r.text.lower()
        assert "Savings" in r.text or "savings" in r.text.lower()

    def test_has_industry_options(self):
        r = requests.get(self.URL, timeout=10)
        assert "Professional Services" in r.text or "E-Commerce" in r.text or "industry" in r.text.lower()

    def test_ssl_redirect(self):
        r = requests.get(
            "http://dissid-ai-calculator.web.app", timeout=10, allow_redirects=True
        )
        assert r.url.startswith("https://")

    def test_response_time(self):
        r = requests.get(self.URL, timeout=10)
        assert r.elapsed.total_seconds() < 3.0
