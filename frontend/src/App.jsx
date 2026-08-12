import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PipelineVisualizer from './components/PipelineVisualizer';
import ClaimTable from './components/ClaimTable';
import CorpusManager from './components/CorpusManager';
import BaselineCompare from './components/BaselineCompare';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://127.0.0.1:8000' 
  : '';

export default function App() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [health, setHealth] = useState(null);
  const [sampleQueries, setSampleQueries] = useState([]);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      console.error('Failed to fetch health check:', err);
    }
  };

  const fetchSampleQueries = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sample-queries`);
      const data = await res.json();
      setSampleQueries(data);
    } catch (err) {
      console.error('Failed to fetch sample queries:', err);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchSampleQueries();
  }, []);

  const handleExecuteQuery = async (queryText, apiKey = '', selectedAgent = 'auto') => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: queryText,
          api_key: apiKey,
          selected_agent: selectedAgent 
        })
      });
      const data = await res.json();
      setPipelineResult(data);
      setLoading(false);
    } catch (err) {
      console.error('Pipeline execution error:', err);
      setLoading(false);
      alert('Error executing query pipeline. Please ensure the backend server is running on http://127.0.0.1:8000.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar health={health} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {activeTab === 'pipeline' && (
          <PipelineVisualizer
            onExecuteQuery={handleExecuteQuery}
            loading={loading}
            pipelineResult={pipelineResult}
            sampleQueries={sampleQueries}
          />
        )}

        {activeTab === 'claims' && (
          <ClaimTable pipelineResult={pipelineResult} />
        )}

        {activeTab === 'corpus' && (
          <CorpusManager onIngestComplete={fetchHealth} apiBase={API_BASE} />
        )}

        {activeTab === 'evaluation' && (
          <BaselineCompare pipelineResult={pipelineResult} />
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '18px 24px',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        borderTop: '1px solid var(--border-glass)',
        marginTop: 'auto'
      }}>
        Hierarchical Bounded Intelligence Architecture (HBI-TGA) • B.Tech Major Project • Operational Local Server
      </footer>
    </div>
  );
}
