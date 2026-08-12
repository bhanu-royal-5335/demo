import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PipelineVisualizer from './components/PipelineVisualizer';
import ClaimTable from './components/ClaimTable';
import CorpusManager from './components/CorpusManager';
import BaselineCompare from './components/BaselineCompare';

export default function App() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [health, setHealth] = useState(null);
  const [sampleQueries, setSampleQueries] = useState([]);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      console.error('Failed to fetch health check:', err);
    }
  };

  const fetchSampleQueries = async () => {
    try {
      const res = await fetch('/api/sample-queries');
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

  const handleExecuteQuery = async (queryText) => {
    setLoading(true);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      const data = await res.json();
      setPipelineResult(data);
      setLoading(false);
    } catch (err) {
      console.error('Pipeline execution error:', err);
      setLoading(false);
      alert('Error executing query pipeline. Check backend logs.');
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
          <CorpusManager onIngestComplete={fetchHealth} />
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
        Hierarchical Bounded Intelligence Architecture (HBI-TGA) • B.Tech Major Project • Fully Operational
      </footer>
    </div>
  );
}
