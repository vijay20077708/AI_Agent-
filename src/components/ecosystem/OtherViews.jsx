import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  MessageSquare,
  Image,
  Video,
  GraduationCap,
  Sparkles,
  Send,
  Play,
  Bot,
  Download,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  Sliders
} from 'lucide-react';

export function AIChatView() {
  const { setCurrentView } = useAgent();
  const [model, setModel] = useState('GPT-4o');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am AURQO AI Core Chat. I can assist with reasoning, research, document summarization, and strategic planning. How can I help you today?',
      model: 'GPT-4o'
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const txt = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: txt }]);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `[${model} Response] I have analyzed your question: "${txt}". For domain-specific tasks with real-time voice, you can also launch specialized agents in AI Agent Studio!`,
          model: model
        }
      ]);
    }, 600);
  };

  return (
    <div className="ecosystem-view-page">
      <div className="ecosystem-view-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eco-badge-tag">Conversational AI</span>
            <span className="text-xs text-gray-500 font-semibold">Active Model: {model}</span>
          </div>
          <h2 className="eco-title">💬 Multi-Model AI Chat</h2>
          <p className="eco-sub">
            Chat with world-class AI models (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, and DeepSeek) in one unified interface.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="eco-model-select"
          >
            <option value="GPT-4o">GPT-4o (OpenAI)</option>
            <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
            <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Google)</option>
            <option value="DeepSeek R1">DeepSeek R1 (Reasoning)</option>
          </select>

          <button onClick={() => setCurrentView('agent-hub')} className="btn-eco-agent-cta">
            <Bot size={16} />
            <span>Agent Studio</span>
          </button>
        </div>
      </div>

      <div className="eco-chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`eco-bubble ${m.role}`}>
            <div className="eco-bubble-meta">
              <strong>{m.role === 'assistant' ? `AURQO (${m.model || model})` : 'You'}</strong>
            </div>
            <p className="eco-bubble-text">{m.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="eco-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${model} anything...`}
          className="eco-input"
        />
        <button type="submit" disabled={!input.trim()} className="eco-btn-submit">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export function AIImageView() {
  const [prompt, setPrompt] = useState('Futuristic glowing holographic AI assistant avatar in cyberpunk purple and cyan');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [stylePreset, setStylePreset] = useState('photorealistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedImage({
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        prompt: prompt,
        style: stylePreset,
        ratio: aspectRatio
      });
    }, 900);
  };

  return (
    <div className="ecosystem-view-page">
      <div className="ecosystem-view-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eco-badge-tag">Generative Imagery</span>
          </div>
          <h2 className="eco-title">🖼️ AI Image Creation Studio</h2>
          <p className="eco-sub">
            Generate ultra-realistic visual artwork, icons, marketing graphics, and 3D renders with Imagen 3 & DALL-E 3.
          </p>
        </div>
      </div>

      <div className="image-creator-layout">
        <form onSubmit={handleGenerate} className="image-controls-panel">
          <label className="form-field-label">Image Prompt Description:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="aurqo-input-field mb-4"
            rows={3}
            placeholder="Describe the image in detail..."
          />

          <div className="form-row-grid-2 mb-4">
            <div>
              <label className="form-field-label">Style Preset:</label>
              <select
                value={stylePreset}
                onChange={(e) => setStylePreset(e.target.value)}
                className="aurqo-input-field"
              >
                <option value="photorealistic">Photorealistic 4K</option>
                <option value="cyberpunk">Cyberpunk Neon</option>
                <option value="anime">Anime / Manga Art</option>
                <option value="3d-render">3D Isometric Render</option>
                <option value="minimalist">Minimalist Vector</option>
              </select>
            </div>

            <div>
              <label className="form-field-label">Aspect Ratio:</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="aurqo-input-field"
              >
                <option value="1:1">Square (1:1)</option>
                <option value="16:9">Landscape (16:9)</option>
                <option value="9:16">Portrait (9:16)</option>
                <option value="4:3">Standard (4:3)</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={!prompt.trim() || isGenerating} className="btn-create-agent-submit">
            <Sparkles size={16} />
            <span>{isGenerating ? 'Rendering Neural Pixels...' : 'Generate High-Res Artwork'}</span>
          </button>
        </form>

        {/* Output Showcase */}
        <div className="image-output-card">
          {generatedImage ? (
            <div className="generated-preview-box">
              <img
                src={generatedImage.url}
                alt={generatedImage.prompt}
                className="generated-image-elem"
              />
              <div className="image-meta-bar">
                <span className="text-xs text-gray-400">{generatedImage.style} • {generatedImage.ratio}</span>
                <button className="btn-download-img" onClick={() => alert('Image download ready!')}>
                  <Download size={14} /> Download 4K
                </button>
              </div>
            </div>
          ) : (
            <div className="image-placeholder-box">
              <Sparkles size={48} className="text-purple-400 mb-2" />
              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">Ready to Generate</h4>
              <p className="text-xs text-gray-500 max-w-xs text-center">
                Configure your prompt and style on the left, then click Generate to create visual assets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AIVideoView() {
  const [videoPrompt, setVideoPrompt] = useState('Cinematic aerial drone shot of futuristic glowing crystal metropolis at sunset');
  const [duration, setDuration] = useState('5s');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoCreated, setVideoCreated] = useState(false);

  const handleGenerateVideo = (e) => {
    e.preventDefault();
    if (!videoPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setVideoCreated(true);
    }, 1000);
  };

  return (
    <div className="ecosystem-view-page">
      <div className="ecosystem-view-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eco-badge-tag">Video Generation</span>
          </div>
          <h2 className="eco-title">🎥 AI Video Creation Studio (Flow & Veo)</h2>
          <p className="eco-sub">
            Generate cinematic video clips, motion animations, and scene transitions with Google Flow and Veo generative engines.
          </p>
        </div>
      </div>

      <div className="image-creator-layout">
        <form onSubmit={handleGenerateVideo} className="image-controls-panel">
          <label className="form-field-label">Video Scene Description & Camera Motion:</label>
          <textarea
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
            className="aurqo-input-field mb-4"
            rows={3}
            placeholder="Describe the camera motion, lighting, and action..."
          />

          <div className="form-row-grid-2 mb-4">
            <div>
              <label className="form-field-label">Duration:</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="aurqo-input-field"
              >
                <option value="5s">5 Seconds (HD 1080p)</option>
                <option value="10s">10 Seconds (4K Ultra)</option>
                <option value="15s">15 Seconds (Cinematic)</option>
              </select>
            </div>

            <div>
              <label className="form-field-label">Camera Motion:</label>
              <select className="aurqo-input-field">
                <option>Smooth Drone Orbit</option>
                <option>Forward Dolly Zoom</option>
                <option>Cinematic Pan Right</option>
                <option>Dynamic FP-V Flight</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={!videoPrompt.trim() || isGenerating} className="btn-create-agent-submit">
            <Play size={16} />
            <span>{isGenerating ? 'Rendering Neural Frames...' : 'Generate AI Video Clip'}</span>
          </button>
        </form>

        <div className="image-output-card">
          {videoCreated ? (
            <div className="video-rendered-box">
              <div className="video-canvas-mock">
                <Play size={44} className="text-white" />
              </div>
              <div className="image-meta-bar">
                <span className="text-xs text-gray-400">Veo Engine 2.0 • 60 FPS • {duration}</span>
                <button className="btn-download-img" onClick={() => alert('Video export ready!')}>
                  <Download size={14} /> Export MP4
                </button>
              </div>
            </div>
          ) : (
            <div className="image-placeholder-box">
              <Play size={48} className="text-purple-400 mb-2" />
              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">Veo Video Pipeline Ready</h4>
              <p className="text-xs text-gray-500 max-w-xs text-center">
                Enter your scene prompt and camera motion to synthesize cinematic video clips.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AILearnView() {
  const { setCurrentView } = useAgent();
  const [activeSubject, setActiveSubject] = useState(null);

  const subjects = [
    {
      id: 'medical',
      icon: '🩺',
      title: 'Biology & Clinical Medicine',
      desc: 'Master pharmacology, cardiology, anatomy & clinical diagnostics with interactive Socratic quizzes.',
      color: '#EC4899',
      topics: ['Pharmacokinetics & Drug Interactions', 'Differential Diagnosis Framework', 'Cardiovascular Physiology']
    },
    {
      id: 'software',
      icon: '💻',
      title: 'Full-Stack Software Architecture',
      desc: 'Learn WebRTC low-latency audio pipelines, microservices, clean code, and algorithm design.',
      color: '#06B6D4',
      topics: ['LiveKit WebRTC Voice Architecture', 'PostgreSQL Query Optimization', 'Distributed Event Queues']
    },
    {
      id: 'tamil',
      icon: '🌐',
      title: 'Tamil (தமிழ்) & Multilingual NLP',
      desc: 'Explore NLP tokenization, bilingual reasoning models, and Tamil literature with phonetic pronunciation.',
      color: '#8B5CF6',
      topics: ['Tamil Natural Conversational Speech', 'Bilingual Translation Nuances', 'Morphological Analysis']
    },
    {
      id: 'physics',
      icon: '🧬',
      title: 'Quantum Physics & Mathematics',
      desc: 'Derive differential calculus, quantum mechanics formulas, and thermodynamic cycles step-by-step.',
      color: '#F59E0B',
      topics: ['Quantum Entanglement Explained', 'Multivariable Calculus & Integrals', 'Thermodynamics Laws']
    }
  ];

  return (
    <div className="ecosystem-view-page">
      <div className="ecosystem-view-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eco-badge-tag">Socratic Tutoring</span>
          </div>
          <h2 className="eco-title">🎓 AI Socratic Learning Hub</h2>
          <p className="eco-sub">
            Personalized study companion with step-by-step guided tutoring, interactive practice questions, and concept breakdowns.
          </p>
        </div>

        <button onClick={() => setCurrentView('choose-agent')} className="btn-eco-agent-cta">
          <Bot size={16} />
          <span>Launch Study Tutor Agent</span>
        </button>
      </div>

      <div className="learn-grid-cards">
        {subjects.map((sub) => (
          <div key={sub.id} className="learn-box" onClick={() => setActiveSubject(sub)}>
            <div className="learn-box-top">
              <span className="text-3xl">{sub.icon}</span>
              <span className="learn-tag" style={{ color: sub.color, backgroundColor: `${sub.color}15` }}>
                Interactive
              </span>
            </div>

            <h4 className="learn-box-title">{sub.title}</h4>
            <p className="learn-box-desc">{sub.desc}</p>

            <div className="learn-topics-list">
              {sub.topics.map((t, idx) => (
                <div key={idx} className="learn-topic-chip">
                  <span>• {t}</span>
                </div>
              ))}
            </div>

            <div className="learn-box-footer">
              <span className="learn-btn-link" style={{ color: sub.color }}>
                Start Socratic Session
              </span>
              <ArrowRight size={14} style={{ color: sub.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

