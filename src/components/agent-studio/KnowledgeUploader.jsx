import React, { useRef, useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  UploadCloud,
  FileText,
  FileCode,
  Trash2,
  CheckCircle2,
  Database,
  Link,
  Plus,
  Layers,
  Cpu,
  Search
} from 'lucide-react';

export function KnowledgeUploader() {
  const { agentConfig, addFiles, removeFile, updateConfig } = useAgent();
  const fileInputRef = useRef(null);
  const [urlInput, setUrlInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      addFiles(filesArray);
      e.target.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      addFiles(filesArray);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setIsScraping(true);
    setTimeout(() => {
      const fakeFile = {
        name: `WebScrape: ${urlInput.replace('https://', '').replace('http://', '').slice(0, 30)}`,
        size: 1024 * 1024 * 1.5
      };
      addFiles([fakeFile]);
      setUrlInput('');
      setIsScraping(false);
    }, 1000);
  };

  const totalTokens = agentConfig.files.reduce((acc, f) => acc + (f.tokens || 0), 0);
  const totalChunks = agentConfig.files.reduce((acc, f) => acc + (f.chunks || 0), 0);

  return (
    <div className="studio-step-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="step-number">03</span>
          <div>
            <h3 className="section-title">Knowledge Base & RAG Uploads</h3>
            <p className="section-subtitle">
              Ground your agent in domain-specific documents, papers, codebases, APIs, and guidelines via Vector Embeddings.
            </p>
          </div>
        </div>
      </div>

      {/* Drag & Drop File Zone */}
      <div
        className={`file-drop-zone ${isDragOver ? 'drag-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".pdf,.docx,.txt,.csv,.json,.md,.py,.js,.ts,.html"
          style={{ display: 'none' }}
        />
        <div className="drop-icon-wrap">
          <UploadCloud size={32} className="text-purple-600" />
        </div>
        <h4 className="drop-title">Click to upload or drag & drop files</h4>
        <p className="drop-subtitle">
          Supports PDF, Word (DOCX), Markdown, CSV, Code files (Python, JS, TS), and JSON (Up to 50MB each)
        </p>
        <button type="button" className="btn-browse-files">
          Browse Local Documents
        </button>
      </div>

      {/* Web URL / Scraping Source */}
      <div className="url-scrape-card mt-4">
        <div className="flex-between mb-2">
          <label className="param-label mb-0">
            Add Live URL / Web Documentation Source
          </label>
          <span className="param-subtag">Live Vector Crawler</span>
        </div>
        <div className="url-input-group">
          <div className="url-input-icon">
            <Link size={16} />
          </div>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://docs.livekit.io or https://medical-journals.org/article"
            className="url-input-field"
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddUrl(); }}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={isScraping || !urlInput.trim()}
            className="url-add-btn"
          >
            {isScraping ? 'Indexing...' : 'Index URL'}
          </button>
        </div>
      </div>

      {/* Knowledge Summary Stats */}
      <div className="knowledge-stats-row mt-4">
        <div className="k-stat-card">
          <Database size={18} className="text-purple-500" />
          <div>
            <span className="k-stat-val">{agentConfig.files.length} Files</span>
            <span className="k-stat-label">Indexed Documents</span>
          </div>
        </div>

        <div className="k-stat-card">
          <Layers size={18} className="text-blue-500" />
          <div>
            <span className="k-stat-val">{totalChunks} Chunks</span>
            <span className="k-stat-label">Vector Embeddings</span>
          </div>
        </div>

        <div className="k-stat-card">
          <Cpu size={18} className="text-emerald-500" />
          <div>
            <span className="k-stat-val">~{totalTokens.toLocaleString()}</span>
            <span className="k-stat-label">Estimated Knowledge Tokens</span>
          </div>
        </div>
      </div>

      {/* Uploaded Files Table */}
      <div className="files-list-section mt-5">
        <div className="flex-between mb-3">
          <h4 className="files-section-heading">Connected Knowledge Documents</h4>
          <span className="text-xs text-gray-500">Auto-chunked at 512 tokens</span>
        </div>

        {agentConfig.files.length === 0 ? (
          <div className="no-files-state">
            <p>No knowledge documents uploaded yet. Add files above to empower your agent with custom knowledge.</p>
          </div>
        ) : (
          <div className="files-table-container">
            {agentConfig.files.map((file) => (
              <div key={file.id} className="file-row-item">
                <div className="file-item-left">
                  <div className="file-icon-box">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h5 className="file-name">{file.name}</h5>
                    <div className="file-meta">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.chunks} chunks</span>
                      <span>•</span>
                      <span className="file-status-indexed">
                        <CheckCircle2 size={12} /> Indexed
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="file-remove-btn"
                  title="Remove Document"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
