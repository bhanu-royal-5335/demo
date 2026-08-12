import React from 'react';
import { Activity, ShieldCheck, Zap, AlertCircle, CheckCircle, TrendingUp } from './Icons';

export default function BaselineCompare({ pipelineResult }) {
  if (!pipelineResult || !pipelineResult.evaluation_summary) {
    return (
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Activity size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
        <h3>No benchmark data available</h3>
        <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
          Run a query in the "Pipeline Execution" tab to compute comparative metrics against the Single-Pass RAG baseline.
        </p>
      </div>
    );
  }

  const { hbi_tga_pipeline, baseline_single_pass_rag, metrics } = pipelineResult.evaluation_summary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Metrics Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.15))' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="var(--accent-emerald)" /> PRD Evaluation Harness & Baseline Benchmarking
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>TRUST SCORE GAIN</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#34d399', marginTop: '4px' }}>
              {metrics.trust_score_gain}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Over unverified baseline</div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>ESTIMATED HALLUCINATION REDUCTION</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#38bdf8', marginTop: '4px' }}>
              {metrics.hallucination_reduction_pct}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Target: ≥30% relative reduction (NFR-1)</div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>BOUNDED SELF-CORRECTIONS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fbbf24', marginTop: '4px' }}>
              {hbi_tga_pipeline.correction_iterations} Iterations
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Capped at max 3 iterations</div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>AUDITABILITY</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#a78bfa', marginTop: '4px' }}>
              100%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Layer 0-6 intermediate logs</div>
          </div>
        </div>
      </div>

      {/* Side by side pipeline comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* HBI-TGA Pipeline */}
        <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="badge-supported">RECOMMENDED</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginTop: '6px' }}>
                HBI-TGA Architecture
              </h3>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#34d399' }}>
              {hbi_tga_pipeline.trust_score}% Trust
            </div>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="#10b981" /> 7 Bounded Operational Layers (L0–L6)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="#10b981" /> Atomic Claim Decomposition & Stance Scoring
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="#10b981" /> Bounded Self-Correction Loop (Re-retrieve & Revise)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="#10b981" /> Explicit Flagging of Unresolved Claims (FR-7)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <Zap size={16} color="var(--accent-amber)" /> Latency: {hbi_tga_pipeline.total_latency_seconds}s
            </li>
          </ul>
        </div>

        {/* Baseline Single-Pass RAG */}
        <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-rose)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="badge-unsupported">BASELINE</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginTop: '6px' }}>
                Single-Pass RAG
              </h3>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f87171' }}>
              {baseline_single_pass_rag.trust_score}% Trust
            </div>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <AlertCircle size={16} color="#f43f5e" /> Monolithic Single-Pass Draft (No Verification)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <AlertCircle size={16} color="#f43f5e" /> Silent Propagation of Unchecked Errors
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <AlertCircle size={16} color="#f43f5e" /> No Self-Correction Mechanism
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <AlertCircle size={16} color="#f43f5e" /> Unsupported Claims Hidden/Unflagged
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <Zap size={16} color="#10b981" /> Fast Latency: {baseline_single_pass_rag.total_latency_seconds}s
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
