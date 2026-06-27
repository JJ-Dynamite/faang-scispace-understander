'use client';

import { useState } from 'react';

export default function Home() {
  const [paperId, setPaperId] = useState('');
  const [explanation, setExplanation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [detailLevel, setDetailLevel] = useState('beginner');

  const handleExplain = async () => {
    if (!paperId) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paper_id: paperId, detail_level: detailLevel }),
      });
      const data = await res.json();
      if (data.success) setExplanation(data.data);
    } catch (error) {
      console.error('Explanation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">📖</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SciSpace
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Understand any research paper with AI explanations</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={paperId}
              onChange={(e) => setPaperId(e.target.value)}
              placeholder="Enter paper title, DOI, or URL..."
              className="flex-1 px-6 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleExplain}
              disabled={!paperId || loading}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : '📖 Explain'}
            </button>
          </div>
          <div className="flex gap-4">
            {['beginner', 'intermediate', 'expert'].map((level) => (
              <button
                key={level}
                onClick={() => setDetailLevel(level)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  detailLevel === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {explanation && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-indigo-400">Paper Summary</h2>
                <div className="flex gap-3">
                  <span className="px-3 py-1 bg-slate-700 rounded-full text-sm">{explanation.difficulty_level}</span>
                  <span className="px-3 py-1 bg-slate-700 rounded-full text-sm">⏱️ {explanation.estimated_read_time}</span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">{explanation.summary}</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-indigo-400 mb-3">Key Concepts</h3>
                  <ul className="space-y-2">
                    {explanation.key_concepts.map((concept: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <span className="text-indigo-400">•</span>
                        {concept}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-400 mb-3">Key Findings</h3>
                  <ul className="space-y-2">
                    {explanation.findings.map((finding: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <span className="text-green-400">✓</span>
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h3 className="font-semibold text-indigo-400 mb-3">Methodology</h3>
              <p className="text-gray-300">{explanation.methodology}</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h3 className="font-semibold text-indigo-400 mb-3">Original Abstract</h3>
              <p className="text-gray-400 italic">{explanation.abstract_text}</p>
            </div>
          </div>
        )}

        {!explanation && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700 text-center">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="font-semibold">AI-Powered</h3>
              <p className="text-gray-400 text-sm">Advanced language understanding</p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700 text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold">Visual Aids</h3>
              <p className="text-gray-400 text-sm">Diagrams and charts</p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700 text-center">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold">Ask Questions</h3>
              <p className="text-gray-400 text-sm">Interactive Q&A</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
