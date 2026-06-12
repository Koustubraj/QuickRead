import React, { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Globe, Loader2 } from "lucide-react";
import "./GeminiSearchPage.css";
import { v4 } from "uuid";

export default function GeminiSearch() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState("");

  useEffect(() => {
    setSession(v4());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");

    fetch("http://localhost:3001/getdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: query, session: session }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data from server");
        return res.json();
      })
      .then((data) => {
        setResponse(data.reply || JSON.stringify(data));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(
          "Could not connect to the server. Make sure your backend is running.",
        );
        setLoading(false);
      });
  };

  return (
    <div className="gemini-wrapper">
      <div className="glow-orb-1" />
      <div className="glow-orb-2" />

      <div className="gemini-content">
        <h1 className="gemini-title">Quick Read</h1>

        <form onSubmit={handleSubmit} className="search-form">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Lets get started ..."
            rows="1"
            className="search-input"
          />

          <div className="action-row">
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className={`submit-btn ${query.trim() && !loading ? "active" : "disabled"}`}
            >
              {loading ? (
                <Loader2 size={16} className="spinner" />
              ) : (
                <ArrowRight size={16} />
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="response-container loading">
            <div className="skeleton-line line-1"></div>
            <div className="skeleton-line line-2"></div>
            <div className="skeleton-line line-3"></div>
          </div>
        )}

        {error && <div className="response-container error-box">{error}</div>}

        {response && !loading && (
          <div className="response-container response-box">
            <div className="ai-icon">
              <Sparkles size={16} />
            </div>
            <div className="response-text">{response}</div>
          </div>
        )}
      </div>
    </div>
  );
}
