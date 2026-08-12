import React from 'react';
import { ShieldCheck, Cpu, Database, Activity } from './Icons';

export default function Navbar({ health, activeTab, setActiveTab }) {
  return (
    <header className="glass-panel" style={{ margin: '16px 24px 0 24px', padding: '16px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            padding: '10px',
            borderRadius: '12px',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                HBI-TGA Architecture
              </h1>
              <span style={{
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                v1.0 PRD
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Hierarchical Bounded Intelligence for Trustworthy Generative AI
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <nav style={{ display: 'flex', gap: '8px', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('pipeline')}
            style={{
              background: activeTab === 'pipeline' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'pipeline' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Cpu size={16} /> Pipeline Execution
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            style={{
              background: activeTab === 'claims' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'claims' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck size={16} /> Claims & Citations
          </button>
          <button
            onClick={() => setActiveTab('corpus')}
            style={{
              background: activeTab === 'corpus' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'corpus' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Database size={16} /> Vector Corpus
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            style={{
              background: activeTab === 'evaluation' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'evaluation' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Activity size={16} /> Benchmark Evaluation
          </button>
        </nav>

        {/* Backend Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: health?.status === 'healthy' ? '#10b981' : '#f43f5e',
            boxShadow: health?.status === 'healthy' ? '0 0 10px #10b981' : '0 0 10px #f43f5e'
          }} />
          <span>{health?.status === 'healthy' ? 'Engine Online' : 'Connecting...'}</span>
        </div>
      </div>
    </header>
  );
}
