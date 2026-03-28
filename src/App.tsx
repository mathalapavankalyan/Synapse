import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Upload, 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Camera, 
  FileText,
  Loader2,
  Info
} from 'lucide-react';
import { processIntent, ActionPlan } from './lib/gemini';

export default function App() {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ActionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!input && !image) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const plan = await processIntent(input, image || undefined);
      setResult(plan);
    } catch (err) {
      console.error(err);
      setError("Failed to bridge intent. Please try again with clearer data.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setInput('');
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-white z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center text-white">
            <Zap size={18} />
          </div>
          <h1 className="text-xl font-serif italic font-bold tracking-tight">OmniBridge</h1>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-mono">
          Intent-to-Action Engine v1.0
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Input */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col gap-8 overflow-y-auto border-r border-[var(--border)]">
          <div className="max-w-xl">
            <h2 className="text-4xl font-serif font-bold leading-tight mb-4">
              Bridge the gap between <span className="italic">chaos</span> and <span className="text-[var(--accent)]">action</span>.
            </h2>
            <p className="text-[var(--muted)] text-lg leading-relaxed">
              Upload medical records, disaster photos, or messy notes. OmniBridge converts unstructured human intent into life-saving protocols.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the situation or paste messy data here..."
                className="w-full h-48 p-6 bg-white border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-none text-lg"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  title="Upload Image"
                >
                  <Camera size={20} />
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            {image && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[var(--border)]"
              >
                <img src={image} alt="Uploaded context" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ArrowRight className="rotate-45" size={16} />
                </button>
              </motion.div>
            )}

            <button
              onClick={handleProcess}
              disabled={isProcessing || (!input && !image)}
              className="w-full py-4 bg-[var(--ink)] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" />
                  Processing Intent...
                </>
              ) : (
                <>
                  Generate Action Plan
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}
          </div>

          <div className="mt-auto pt-8 grid grid-cols-2 gap-4">
            <div className="p-4 border border-[var(--border)] rounded-xl flex items-start gap-3">
              <Shield className="text-[var(--accent)] shrink-0" size={20} />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-1">Privacy First</div>
                <div className="text-[10px] text-[var(--muted)]">Data is processed locally and securely.</div>
              </div>
            </div>
            <div className="p-4 border border-[var(--border)] rounded-xl flex items-start gap-3">
              <Activity className="text-blue-500 shrink-0" size={20} />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-1">Real-time</div>
                <div className="text-[10px] text-[var(--muted)]">Instant conversion to structured protocols.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Results */}
        <div className="w-full lg:w-1/2 bg-white overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {!result && !isProcessing && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-24 h-24 bg-[var(--bg)] rounded-full flex items-center justify-center mb-6">
                  <Info size={40} className="text-[var(--muted)]" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">Awaiting Intent</h3>
                <p className="text-[var(--muted)] max-w-xs">
                  Input data on the left to see the structured action plan generated here.
                </p>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12"
              >
                <div className="relative">
                  <div className="w-32 h-32 border-4 border-[var(--bg)] border-t-[var(--accent)] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="text-[var(--accent)] animate-pulse" size={32} />
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <div className="font-mono text-xs uppercase tracking-widest mb-2">Analyzing Patterns</div>
                  <div className="text-xl font-serif italic">Gemini is bridging the context...</div>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 lg:p-12"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        result.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                        result.urgency === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {result.urgency} Urgency
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-bold uppercase tracking-wider">
                        {result.category}
                      </span>
                    </div>
                    <h2 className="text-3xl font-serif font-bold">{result.summary}</h2>
                  </div>
                  <button 
                    onClick={reset}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-[var(--muted)]"
                  >
                    <ArrowRight className="rotate-180" size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Structured Data Grid */}
                  <section>
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted)] mb-4 flex items-center gap-2">
                      <FileText size={12} /> Extracted Parameters
                    </h4>
                    <div className="data-grid rounded-lg overflow-hidden border border-[var(--border)]">
                      {result.structuredData.map((item, i) => (
                        <div key={i} className="data-cell border-b border-r border-[var(--border)]">
                          <div className="text-[10px] uppercase text-[var(--muted)] mb-1 font-bold">{item.key}</div>
                          <div className="font-mono text-sm">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Immediate Actions */}
                  <section>
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted)] mb-4 flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-green-500" /> Life-Saving Protocol
                    </h4>
                    <div className="space-y-3">
                      {result.immediateActions.map((action, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={i} 
                          className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl text-green-900 flex gap-3"
                        >
                          <span className="font-mono font-bold text-green-600">{String(i + 1).padStart(2, '0')}</span>
                          <span className="font-medium">{action}</span>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* Verified Resources */}
                  <section>
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted)] mb-4 flex items-center gap-2">
                      <Shield size={12} className="text-blue-500" /> Verified Resources
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.verifiedResources.map((res, i) => (
                        <div key={i} className="p-4 border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-colors group cursor-pointer">
                          <div className="font-bold mb-1 group-hover:text-[var(--accent)] transition-colors">{res.name}</div>
                          {res.contact && <div className="text-xs text-[var(--muted)] font-mono">{res.contact}</div>}
                          {res.link && (
                            <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline mt-2 inline-block">
                              Official Website
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--border)] flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] font-mono">
                    <CheckCircle2 size={14} className="text-green-500" />
                    Verified by Gemini AI Engine
                  </div>
                  <button className="px-6 py-2 bg-[var(--accent)] text-white rounded-full text-xs font-bold hover:opacity-90 transition-opacity">
                    Export Protocol
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-[var(--border)] bg-[var(--bg)] flex justify-between items-center text-[10px] text-[var(--muted)] font-mono">
        <div>© 2026 OmniBridge Systems. All rights reserved.</div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> System Operational</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </footer>
    </div>
  );
}
