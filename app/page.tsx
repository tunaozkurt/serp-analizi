'use client'

import { useState } from 'react'
import { AnalysisResult } from '@/lib/types'
import SerpAnalysisView from '@/components/SerpAnalysisView'
import ContentBriefView from '@/components/ContentBriefView'

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('Turkey')
  const [language, setLanguage] = useState('tr')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'analysis' | 'brief'>('analysis')

  async function handleAnalyze() {
    if (!keyword.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setStatus('SERP sonuçları alınıyor...')

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, location, language }),
      })

      setStatus('Sayfalar analiz ediliyor...')
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Analiz başarısız')

      setResult(data)
      setActiveTab('analysis')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setLoading(false)
      setStatus('')
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-1">SERP Mühendisi</h1>
          <p className="text-gray-400 text-sm">Anahtar kelimeyi gir, Google&apos;ın ne görmek istediğini analiz et.</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
              placeholder="Anahtar kelime girin..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
            />
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-gray-300 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Turkey">Türkiye</option>
              <option value="United States">ABD</option>
              <option value="United Kingdom">İngiltere</option>
              <option value="Germany">Almanya</option>
            </select>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-gray-300 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="tr">Türkçe</option>
              <option value="en">İngilizce</option>
              <option value="de">Almanca</option>
            </select>
            <button
              onClick={handleAnalyze}
              disabled={loading || !keyword.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap"
            >
              {loading ? 'Analiz ediliyor...' : 'Analiz Et'}
            </button>
          </div>

          {loading && (
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-400">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              {status}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {result && (
          <>
            <div className="flex gap-1 mb-6 bg-gray-900 rounded-lg p-1 border border-gray-800 w-fit">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                SERP Analizi
              </button>
              <button
                onClick={() => setActiveTab('brief')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'brief'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                İçerik Brief
              </button>
            </div>

            {activeTab === 'analysis' && <SerpAnalysisView analysis={result.serpAnalysis} />}
            {activeTab === 'brief' && <ContentBriefView brief={result.contentBrief} />}
          </>
        )}
      </div>
    </main>
  )
}
