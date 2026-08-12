import React, { useState, useEffect } from 'react';
import { Database, PlusCircle, CheckCircle2 } from './Icons';

export default function CorpusManager({ onIngestComplete, apiBase = '' }) {
  const [documents, setDocuments] = useState([]);
  const [passagesCount, setPassagesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState('');

  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [docCategory, setDocCategory] = useState('General');
  const [docAuthor, setDocAuthor] = useState('User Ingested');

  const fetchCorpus = async () => {
    try {
      const res = await fetch(`${apiBase}/api/documents`);
      const data = await res.json();
      setDocuments(data.documents || []);
      setPassagesCount(data.passages_count || 0);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    fetchCorpus();
  }, []);

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim()) return;

    setLoading(true);
    setIngestSuccess('');

    try {
      const res = await fetch(`${apiBase}/api/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle,
          content: docContent,
          author: docAuthor,
          category: docCategory
        })
      });
      const data = await res.json();
      setLoading(false);
      setIngestSuccess(`Successfully ingested "${data.document?.title}" into Vector Store (${data.total_passages} total passages).`);
      setDocTitle('');
      setDocContent('');
      fetchCorpus();
      if (onIngestComplete) onIngestComplete();
    } catch (err) {
      setLoading(false);
      alert('Failed to ingest document');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Ingestion Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={20} color="var(--accent-emerald)" /> Ingest Custom Knowledge Document (FR-9)
        </h2>

        {ingestSuccess && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} /> {ingestSuccess}
          </div>
        )}

        <form onSubmit={handleIngest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <input
              type="text"
              placeholder="Document Title (e.g., Quantum Computing Guidelines)"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              required
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '0.88rem'
              }}
            />
            <input
              type="text"
              placeholder="Author / Source"
              value={docAuthor}
              onChange={(e) => setDocAuthor(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '0.88rem'
              }}
            />
            <input
              type="text"
              placeholder="Category"
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <textarea
            placeholder="Paste full document text content here..."
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            rows={5}
            required
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              color: '#fff',
              fontSize: '0.88rem',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />

          <div>
            <button type="submit" className="glow-btn" disabled={loading || !docTitle.trim() || !docContent.trim()}>
              {loading ? 'Chunking & Indexing Vectors...' : 'Ingest Document into Vector Store'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Corpus Cards */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="var(--accent-cyan)" /> Indexed Domain Corpus & Passages
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Indexed documents are split into sentence-level passage chunks for TF-IDF vector retrieval.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
            <div><strong>{documents.length}</strong> Documents</div>
            <div><strong>{passagesCount}</strong> Passages</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {documents.map((doc, idx) => (
            <div key={idx} style={{
              background: 'rgba(18, 25, 41, 0.6)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                    {doc.id}
                  </span>
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)'
                  }}>
                    {doc.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '6px' }}>{doc.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {doc.content}
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-glass)', paddingTop: '10px', marginTop: '10px' }}>
                Author: {doc.author}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
