import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; //  FIX: adds .toBeInTheDocument()
import App from "../App";

global.fetch = jest.fn();

beforeAll(() => {
  window.alert = jest.fn();
});

describe("Avalpha Technologies - Commission Calculator UI", () => {
  beforeEach(() => {
    fetch.mockClear();
    window.alert.mockClear();
  });

  test("renders all input fields and calculate button", () => {
    render(<App />);

    expect(screen.getByLabelText(/Local Sales Count/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Foreign Sales Count/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Average Sale Amount/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Calculate Commission/i })).toBeInTheDocument();
  });

  test("submits data and shows correct commission results", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      avalphaTechnologies: { local: 200, foreign: 350, total: 550 },
      competitor: { local: 20, foreign: 75.5, total: 95.5 },
    }),
  });

  render(<App />);

  fireEvent.change(screen.getByLabelText(/Local Sales Count/i), { target: { value: "10" } });
  fireEvent.change(screen.getByLabelText(/Foreign Sales Count/i), { target: { value: "10" } });
  fireEvent.change(screen.getByLabelText(/Average Sale Amount/i), { target: { value: "100" } });

  fireEvent.click(screen.getByRole("button", { name: /Calculate Commission/i }));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

  //  Expect total results to be displayed (as per your DOM)
  expect(await screen.findByText((_, el) => el.textContent.match(/£\s*550/))).toBeInTheDocument();
  expect(screen.getByText((_, el) => el.textContent.match(/£\s*95\.5/))).toBeInTheDocument();

  //  Check advantage text (Avalpha - Competitor)
  expect(screen.getByText((_, el) => el.textContent.match(/£\s*454\.50/))).toBeInTheDocument();

  //  Check company names present
  expect(screen.getByText(/Avalpha Technologies/i)).toBeInTheDocument();
  expect(screen.getByText(/Competitor/i)).toBeInTheDocument();
});


  test("shows validation error when inputs are invalid", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ["Local sales count must be 0 or more."] }),
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/Local Sales Count/i), { target: { value: "-5" } });
    fireEvent.change(screen.getByLabelText(/Foreign Sales Count/i), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText(/Average Sale Amount/i), { target: { value: "100" } });

    fireEvent.click(screen.getByRole("button", { name: /Calculate Commission/i }));

    expect(await screen.findByText(/Local sales count must be 0 or more/i)).toBeInTheDocument();
  });

  test("handles network error gracefully (alert shown)", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<App />);

    fireEvent.change(screen.getByLabelText(/Local Sales Count/i), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText(/Foreign Sales Count/i), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText(/Average Sale Amount/i), { target: { value: "100" } });

    fireEvent.click(screen.getByRole("button", { name: /Calculate Commission/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringMatching(/Failed to calculate commission/i)
      );
    });
  });
});
