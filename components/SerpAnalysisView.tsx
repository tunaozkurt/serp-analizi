import { SerpAnalysis } from '@/lib/types'

interface Props {
  analysis: SerpAnalysis
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  )
}

function Tag({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-950 text-blue-300 border-blue-900',
    green: 'bg-green-950 text-green-300 border-green-900',
    orange: 'bg-orange-950 text-orange-300 border-orange-900',
    purple: 'bg-purple-950 text-purple-300 border-purple-900',
  }
  return (
    <span className={`inline-block text-xs px-2 py-1 rounded border ${colors[color]} mr-2 mb-2`}>
      {children}
    </span>
  )
}

export default function SerpAnalysisView({ analysis }: Props) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Card title="Baskın Intent">
          <p className="text-white font-medium">{analysis.dominantIntent}</p>
        </Card>
        <Card title="Önerilen İçerik Tipi">
          <p className="text-blue-400 font-semibold text-lg">{analysis.recommendedContentType}</p>
        </Card>
      </div>

      <Card title="İçerik Tipi Dağılımı">
        <div className="flex flex-wrap">
          {Object.entries(analysis.contentTypeDistribution ?? {}).map(([type, count]) => (
            <Tag key={type} color="purple">{type}: {count}</Tag>
          ))}
        </div>
      </Card>

      <Card title="Ortak Desenler">
        <ul className="space-y-2">
          {analysis.commonPatterns?.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-300">
              <span className="text-blue-500 mt-0.5">•</span>
              {p}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Eksik İntentler / Fırsatlar">
        <ul className="space-y-2">
          {analysis.missingIntents?.map((m, i) => (
            <li key={i} className="flex gap-2 text-sm text-green-300">
              <span className="text-green-500 mt-0.5">+</span>
              {m}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Yapısal Özellikler">
        <ul className="space-y-2">
          {analysis.structureInsights?.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-300">
              <span className="text-gray-500 mt-0.5">→</span>
              {s}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="FAQ Kümeleri">
        <div className="flex flex-wrap">
          {analysis.faqClusters?.map((q, i) => (
            <Tag key={i} color="orange">{q}</Tag>
          ))}
        </div>
      </Card>

      <Card title="Rakip Sayfa Analizleri">
        <div className="space-y-4">
          {analysis.competitors?.map((c, i) => (
            <div key={i} className="border border-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm font-medium text-white">{c.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 break-all">{c.url}</p>
                </div>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded whitespace-nowrap">{i + 1}. sıra</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Tag color="blue">{c.contentType}</Tag>
                <Tag color="purple">{c.intent}</Tag>
              </div>
              {c.keyTopics?.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Ana konular:</p>
                  <div className="flex flex-wrap">
                    {c.keyTopics.map((t, j) => (
                      <span key={j} className="text-xs text-gray-400 mr-2">#{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
