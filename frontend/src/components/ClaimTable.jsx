import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2 } from './Icons';

export default function ClaimTable({ pipelineResult }) {
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  if (!pipelineResult || !pipelineResult.claims) {
    return (
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldCheck size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
        <h3>No claims evaluated yet</h3>
        <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
          Execute a query in the "Pipeline Execution" tab to inspect atomic claim verification scores and evidence matches.
        </p>
      </div>
    );
  }

  const claims = pipelineResult.claims || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--accent-primary)" /> Layer 4 & Layer 5 — Claim Decomposition & Verification Table
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Each draft sentence is decomposed into an atomic claim and verified against retrieved evidence passages.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="badge-supported">
              Supported ({claims.filter(c => c.status === 'Supported').length})
            </span>
            <span className="badge-partially">
              Partially ({claims.filter(c => c.status === 'Partially Supported').length})
            </span>
            <span className="badge-unsupported">
              Unsupported ({claims.filter(c => c.status === 'Unsupported').length})
            </span>
          </div>
        </div>

        {/* Claims Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Claim ID</th>
                <th style={{ padding: '12px 14px' }}>Decomposed Statement</th>
                <th style={{ padding: '12px 14px' }}>Support Status</th>
                <th style={{ padding: '12px 14px' }}>Confidence Score</th>
                <th style={{ padding: '12px 14px' }}>Matched Source Evidence</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim, idx) => {
                const isSupported = claim.status === 'Supported';
                const isPartially = claim.status === 'Partially Supported';

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {claim.claim_id}
                    </td>
                    <td style={{ padding: '14px', maxWidth: '360px', lineHeight: '1.5' }}>
                      {claim.claim_text}
                      {claim.unresolved_flag && (
                        <div style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '4px', fontWeight: '700' }}>
                          ⚠️ Flagged: Unresolved after max iterations
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className={
                        isSupported ? 'badge-supported' :
                        isPartially ? 'badge-partially' : 'badge-unsupported'
                      }>
                        {claim.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px', minWidth: '140px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          flex: 1,
                          height: '6px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${claim.confidence_percent}%`,
                            height: '100%',
                            background: isSupported ? '#10b981' : isPartially ? '#f59e0b' : '#f43f5e'
                          }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: '700' }}>
                          {claim.confidence_percent}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <button
                        onClick={() => setSelectedEvidence(claim)}
                        style={{
                          background: 'rgba(99, 102, 241, 0.15)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          color: '#a5b4fc',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FileText size={14} /> View Passage ({claim.matched_evidence?.doc_id})
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Card for Evidence Inspection */}
      {selectedEvidence && (
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent-cyan)" /> Evidence Passage Inspection: {selectedEvidence.claim_id}
            </h3>
            <button
              onClick={() => setSelectedEvidence(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}
            >
              ✕ Close
            </button>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '10px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              SOURCE DOCUMENT: <strong>{selectedEvidence.matched_evidence?.doc_title}</strong> [{selectedEvidence.matched_evidence?.doc_id}, {selectedEvidence.matched_evidence?.passage_id}]
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#e0e7ff' }}>
              "{selectedEvidence.matched_evidence?.text_snippet}"
            </p>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            NLI Stance Score: <strong>{selectedEvidence.confidence_percent}% Confidence</strong>
          </div>
        </div>
      )}
    </div>
  );
}
