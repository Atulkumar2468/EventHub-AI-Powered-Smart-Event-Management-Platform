import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aiAPI } from '../services/api';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import toast from 'react-hot-toast';

const PROMPTS = [
  'Find me tech events this week',
  'Recommend clubs for ML enthusiasts',
  'What marketplace items suit a coder?',
  'Show upcoming hackathons',
  'Best cultural events on campus',
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'NEURAL CORE INITIALIZED. I\'m the EventHub AI — your personalized campus intelligence engine. Ask me about events, clubs, or marketplace recommendations.',
  timestamp: new Date().toISOString(),
};

export default function AIAssistant() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (query) => {
    const q = query || input.trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q, timestamp: new Date().toISOString() }]);
    setLoading(true);
    try {
      const { data } = await aiAPI.recommend(q);
      const resp = data.messages?.find(m => m.role === 'assistant') || {
        role: 'assistant',
        content: `Scanning for "${q}"... No specific matches. Try broader terms like "tech", "robotics", or "cultural".`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, resp]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'NEURAL CORE OFFLINE. Could not connect to the recommendation engine. Please ensure the server is running.',
        timestamp: new Date().toISOString(),
        isError: true,
      }]);
    } finally { setLoading(false); }
  };

  return (
    <ProtectedLayout>
      <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
        {/* Header */}
        <div className="mb-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          </div>
          <div>
            <p className="font-mono text-label-mono text-secondary uppercase tracking-widest">AI MODULE</p>
            <h1 className="font-space text-2xl font-bold uppercase tracking-tighter">CAMPUS NEURAL CORE</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-secondary/10 border border-secondary/30 px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-mono text-[10px] text-secondary uppercase">ONLINE</span>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PROMPTS.map(p => (
            <button key={p} onClick={() => sendMessage(p)}
              className="font-mono text-[10px] text-on-surface-variant border border-outline-variant px-3 py-1.5 uppercase hover:border-secondary hover:text-secondary transition-all tracking-widest">
              {p}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-secondary-container flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-on-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                    </div>
                    <span className="font-mono text-[9px] text-secondary uppercase">AI CORE</span>
                    <span className="font-mono text-[9px] text-outline">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                )}
                <div className={`p-4 mechanical-border ${msg.role === 'user' ? 'bg-primary/10 border-primary/30 ml-auto' : msg.isError ? 'bg-error/10 border-error/30' : 'bg-secondary-container/10 border-secondary/20'}`}>
                  <p className="font-body text-body-sm text-on-surface">{msg.content}</p>

                  {/* AI Results */}
                  {msg.role === 'assistant' && msg.events?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="font-mono text-[10px] text-secondary uppercase border-b border-secondary/20 pb-2">RECOMMENDED EVENTS</p>
                      {msg.events.map(ev => (
                        <Link key={ev._id} to={`/events/${ev._id}`} className="flex items-center gap-3 p-2 bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant">
                          <span className="material-symbols-outlined text-primary-container">event</span>
                          <div>
                            <p className="font-mono text-[11px] text-on-surface uppercase">{ev.title}</p>
                            <p className="font-mono text-[9px] text-outline uppercase">{ev.venue} • {ev.category}</p>
                          </div>
                          <span className="material-symbols-outlined text-outline text-sm ml-auto">arrow_forward</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {msg.role === 'assistant' && msg.clubs?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="font-mono text-[10px] text-secondary uppercase border-b border-secondary/20 pb-2">RECOMMENDED CLUBS</p>
                      {msg.clubs.map(cl => (
                        <Link key={cl._id} to={`/clubs/${cl._id}`} className="flex items-center gap-3 p-2 bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant">
                          <span className="material-symbols-outlined text-secondary">groups</span>
                          <div>
                            <p className="font-mono text-[11px] text-on-surface uppercase">{cl.name}</p>
                            <p className="font-mono text-[9px] text-outline uppercase">{cl.memberCount} members • {cl.activityLevel} activity</p>
                          </div>
                          <span className="material-symbols-outlined text-outline text-sm ml-auto">arrow_forward</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <p className="font-mono text-[9px] text-outline text-right mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="mechanical-border bg-secondary-container/10 border-secondary/20 p-4 flex items-center gap-3">
                <div className="flex gap-1">
                  {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }}></span>)}
                </div>
                <span className="font-mono text-[10px] text-secondary uppercase">Neural Core Processing...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
          <input
            className="input-field flex-grow"
            placeholder="ASK THE NEURAL CORE..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}
            className="bg-secondary-container text-on-secondary px-6 font-mono text-nav-mono uppercase hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 flex items-center gap-2">
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </ProtectedLayout>
  );
}
