import { ContentBrief } from '@/lib/types'

interface Props {
  brief: ContentBrief
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  )
}

export default function ContentBriefView({ brief }: Props) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">İçerik Tipi</p>
          <p className="text-blue-400 font-semibold">{brief.recommendedContentType}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Hedef Intent</p>
          <p className="text-green-400 font-semibold">{brief.targetIntent}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tahmini Kelime</p>
          <p className="text-orange-400 font-semibold">{brief.estimatedWordCount}</p>
        </div>
      </div>

      <Section title="Önerilen Başlık">
        <p className="text-white text-lg font-medium">{brief.suggestedTitle}</p>
      </Section>

      <Section title="İçerik Outline">
        <div className="space-y-2">
          {brief.outline?.map((item, i) => (
            <div
              key={i}
              className={`flex gap-3 ${item.level === 1 ? '' : item.level === 2 ? 'ml-4' : 'ml-8'}`}
            >
              <span className={`text-xs font-mono mt-0.5 ${
                item.level === 1 ? 'text-blue-400' : item.level === 2 ? 'text-gray-500' : 'text-gray-600'
              }`}>
                H{item.level}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-200">{item.heading}</p>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="FAQ Bölümü">
        <ul className="space-y-2">
          {brief.faqSection?.map((q, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-300">
              <span className="text-orange-500 mt-0.5 font-bold">?</span>
              {q}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Farklılaşma Fırsatları">
        <ul className="space-y-2">
          {brief.differentiationOpportunities?.map((d, i) => (
            <li key={i} className="flex gap-2 text-sm text-green-300">
              <span className="text-green-500 mt-0.5">★</span>
              {d}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
