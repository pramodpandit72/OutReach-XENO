import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, User, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { aiChat } from '../services/api';

const PROMPTS = [
  { text: 'Suggest a segment for high spenders in Pune', desc: 'Identify top customers' },
  { text: 'Write an RCS campaign message for shoe sales', desc: 'Copywriting helper' },
  { text: 'Explain my CRM sales and customer stats', desc: 'Data breakdown' },
  { text: 'How do I optimize campaign click-through rates?', desc: 'Marketing advice' },
];

export default function AIStudio() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Welcome to **AI Studio**!

I am your OutReach CRM Assistant, powered by Google Gemini. I have real-time context of your CRM system, including customer counts, segment sizes, sales stats, and campaign results.

Here are some ways we can work together:
• **Analyze your database** – Ask me about your customer distribution or total revenue trends.
• **Draft campaigns** – I can write SMS, WhatsApp, Email, or RCS templates tailored to your shoppers.
• **Build segments** – Describe who you want to reach, and I'll suggest target rules.

What would you like to build or analyze today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setInput('');
    
    // Append user message
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Create message history for Gemini context (excluding system instructions, limit to last 10 messages)
      const history = messages.slice(1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data } = await aiChat(userMsg, history);
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      toast.error('AI request failed');
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '❌ Sorry, I encountered an error connecting to Gemini. Please verify your Gemini API key in the backend `.env` file.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (text) => {
    if (!text) return '';
    // Format bold text
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Format bullet points
    formatted = formatted.replace(/^\s*[\*\-]\s+(.*?)$/gm, '<li class="ml-4 list-disc mt-1">$1</li>');
    // Format line breaks
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(34,211,238,0.2))', border: '1px solid rgba(167,139,250,0.3)' }}
          >
            <Sparkles size={20} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Studio</h1>
            <p className="text-xs text-gray-500">Gemini-powered CRM Co-pilot</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-1.5 rounded-xl">
          <HelpCircle size={13} className="text-purple-400" />
          <span>Real-time DB Context Active</span>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'assistant' && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(34,211,238,0.15))', border: '1px solid rgba(167,139,250,0.25)' }}
              >
                <Sparkles size={14} style={{ color: '#a78bfa' }} />
              </div>
            )}
            <div
              className="rounded-2xl px-4 py-3 max-w-[80%]"
              style={msg.role === 'user'
                ? { background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(74,222,128,0.1))', border: '1px solid rgba(34,211,238,0.25)', color: 'var(--color-text)' }
                : { background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }
              }
            >
              <p
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
              />
            </div>
            {msg.role === 'user' && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{ background: 'linear-gradient(135deg, #22d3ee, #4ade80)', color: '#0a0f1e' }}
              >
                <User size={14} />
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <Sparkles size={14} style={{ color: '#a78bfa' }} />
            </div>
            <div className="rounded-2xl px-4 py-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-purple-400"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Prompts / Examples */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PROMPTS.map((ex, i) => (
          <button
            key={i}
            onClick={() => sendMessage(ex.text)}
            className="text-left p-3 rounded-xl flex-shrink-0 hover:bg-[var(--color-surface-3)] transition-colors border border-[var(--color-border)] bg-[var(--color-surface-2)]"
            style={{ width: '220px' }}
            id={`example-${i}`}
          >
            <p className="text-xs font-semibold text-cyan-400">{ex.desc}</p>
            <p className="text-[11px] text-gray-500 mt-1 truncate">{ex.text}</p>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Ask AI Studio anything about your shoppers, campaigns, or copywriting templates..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          id="ai-chat-input"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="btn btn-primary px-4"
          id="ai-send-btn"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
