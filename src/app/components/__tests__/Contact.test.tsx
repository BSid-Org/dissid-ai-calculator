import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contact from "../Contact";
import { CONTACT_ENDPOINT } from "../../lib/booking";

// Fill the three required fields and submit the form.
function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/Name/i), {
    target: { value: "Jane Smith" },
  });
  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: "jane@company.com" },
  });
  fireEvent.change(screen.getByLabelText(/Message/i), {
    target: { value: "Let's build something." },
  });
  fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));
}

describe("Contact", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("POSTs JSON to the contact Cloud Function endpoint", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200 } as Response);
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fillAndSubmit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe(CONTACT_ENDPOINT);
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(opts.body)).toEqual({
      name: "Jane Smith",
      email: "jane@company.com",
      message: "Let's build something.",
    });
  });

  it("shows success ONLY on a 2xx response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200 } as Response);
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fillAndSubmit();

    await waitFor(() => expect(screen.getByText(/Message sent/i)).toBeTruthy());
  });

  it("shows an error on a non-2xx response (no success)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 429 } as Response);
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fillAndSubmit();

    await waitFor(() =>
      expect(screen.getByText(/Something went wrong/i)).toBeTruthy(),
    );
    expect(screen.queryByText(/Message sent/i)).toBeNull();
  });

  it("shows an error when fetch rejects (network failure)", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fillAndSubmit();

    await waitFor(() =>
      expect(screen.getByText(/Something went wrong/i)).toBeTruthy(),
    );
    expect(screen.queryByText(/Message sent/i)).toBeNull();
  });

  it("disables the submit button while sending", async () => {
    // A never-resolving fetch keeps the form in the "sending" state for the
    // lifetime of the test (left pending on purpose — no post-assertion state
    // update, which keeps React's act() happy).
    const fetchMock = vi.fn().mockReturnValue(new Promise<Response>(() => {}));
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fillAndSubmit();

    await waitFor(() =>
      expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(
        true,
      ),
    );
  });
});
