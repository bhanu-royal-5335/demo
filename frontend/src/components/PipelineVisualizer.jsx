import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, AlertTriangle, Layers, Clock, ShieldAlert } from './Icons';

export default function PipelineVisualizer({ onExecuteQuery, loading, pipelineResult, sampleQueries }) {
  const [queryInput, setQueryInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('auto');
  const [showSettings, setShowSettings] = useState(false);
  const [expandedLayer, setExpandedLayer] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onExecuteQuery(queryInput, apiKeyInput, selectedAgent);
    }
  };

  const handleSampleClick = (q) => {
    setQueryInput(q);
    onExecuteQuery(q, apiKeyInput, selectedAgent);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search Bar Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--accent-primary)" /> Multi-Agent Bounded Intelligence Engine
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Agent Selector Dropdown */}
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              disabled={loading}
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                color: '#c7d2fe',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="auto" style={{ background: '#090d16', color: '#fff' }}>⚡ Auto (Live Web Search + LLM Agent)</option>
              <option value="duckduckgo" style={{ background: '#090d16', color: '#fff' }}>🌐 DuckDuckGo Free Live Search Agent (Zero Key)</option>
              <option value="gemini" style={{ background: '#090d16', color: '#fff' }}>🌟 Google Gemini 1.5 Flash Agent</option>
              <option value="openai" style={{ background: '#090d16', color: '#fff' }}>🤖 ChatGPT / OpenAI GPT-4o-mini Agent</option>
              <option value="claude" style={{ background: '#090d16', color: '#fff' }}>🎭 Anthropic Claude 3 Haiku Agent</option>
              <option value="corpus" style={{ background: '#090d16', color: '#fff' }}>📚 HBI-TGA Vector Corpus Agent</option>
            </select>

            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-muted)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ⚙️ {showSettings ? 'Hide Key' : 'API Key'}
            </button>
          </div>
        </div>

        {/* Optional API Key settings input */}
        {showSettings && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-glass)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px'
          }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
              Custom API Key (Gemini API Key / OpenAI API Key / Claude API Key):
            </label>
            <input
              type="password"
              placeholder="Paste your Gemini, OpenAI, or Claude API key (or leave blank to use Free Auto Web Agent)..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Ask any question to test ChatGPT, Gemini, Claude or Live Web Search Agents..."
            disabled={loading}
            style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 18px',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button type="submit" className="glow-btn" disabled={loading || !queryInput.trim()}>
            {loading ? 'Executing Agent Pipeline...' : <>Run Agent <Play size={16} /></>}
          </button>
        </form>

        {/* Sample Queries */}
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', marginRight: '8px' }}>
            PRESET DOMAIN SAMPLES:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {sampleQueries?.samples?.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleSampleClick(sq.query)}
                disabled={loading}
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  color: '#c7d2fe',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ color: 'var(--accent-cyan)', fontWeight: '700', marginRight: '4px' }}>[{sq.category}]</span>
                {sq.query}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
          <div className="spinner" style={{
            width: '44px',
            height: '44px',
            border: '4px solid rgba(99, 102, 241, 0.2)',
            borderTop: '4px solid var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Executing Multi-Agent LLM Generation & Verification Pipeline...</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Layer 1 Query → Layer 2 Retrieval → Layer 3 AI Agent Generation → Layer 4 Verification → Layer 5 Correction → Layer 6 Assembly
          </p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Results & Stepper View */}
      {pipelineResult && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Final Response Summary Header */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>FINAL VERIFIED AGENT RESPONSE</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '4px' }}>
                  {pipelineResult.query}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  textAlign: 'right'
                }} className={
                  pipelineResult.trust_score >= 85 ? 'trust-badge-high' :
                  pipelineResult.trust_score >= 60 ? 'trust-badge-moderate' : 'trust-badge-low'
                }>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase' }}>Overall Trust Score</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>{pipelineResult.trust_score}%</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {pipelineResult.total_latency_seconds}s latency
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              {pipelineResult.final_response}
            </div>

            {/* Flagged warnings if any */}
            {pipelineResult.flagged_unresolved?.length > 0 && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                color: '#f87171',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldAlert size={18} />
                <span>
                  <strong>FR-7 Audit Alert:</strong> {pipelineResult.flagged_unresolved.length} claim(s) remain unverified after maximum self-correction iterations.
                </span>
              </div>
            )}
          </div>

          {/* Stepper Visualization of 7 Layers */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent-cyan)" /> Step-by-Step Bounded Pipeline Execution (L0 – L6)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pipelineResult.pipeline_logs?.map((log, idx) => {
                const isExpanded = expandedLayer === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(18, 25, 41, 0.6)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      onClick={() => setExpandedLayer(isExpanded ? null : idx)}
                      style={{
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: isExpanded ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          background: 'var(--accent-primary)',
                          color: '#fff',
                          fontWeight: '800',
                          fontSize: '0.75rem',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          L{idx + 1}
                        </span>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: '700' }}>{log.layer_name}</h4>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {log.latency_seconds}s
                        </span>
                        <span style={{
                          color: 'var(--accent-emerald)',
                          fontWeight: '700',
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={14} /> {log.status}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Detail Body */}
                    {isExpanded && (
                      <div style={{ padding: '16px 18px', borderTop: '1px solid var(--border-glass)', background: 'rgba(0, 0, 0, 0.3)' }}>
                        <pre style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          color: '#c7d2fe',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          maxHeight: '300px',
                          overflowY: 'auto'
                        }}>
                          {JSON.stringify(log, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
