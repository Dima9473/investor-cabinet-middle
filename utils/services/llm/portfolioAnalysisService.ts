import { portfolioAnalysisResponseSchema } from '../../../zodSchemas/analysis/portfolioAnalysisResponse'
import { PortfolioAnalysis } from '../../../types/analysis/portfolioAnalysis'
import { PortfolioMetrics } from '../../../types/analysis/portfolioMetrics'
import { assertSanitizedForLlm } from './assertSanitizedForLlm'
import { getGigaChatClient } from './gigaChatClient'

const SYSTEM_PROMPT = `Ты аналитик инвестиционного портфеля. Тебе передают только агрегированные метрики без идентификаторов счетов и бумаг.

Правила:
- Не запрашивай дополнительные персональные данные.
- Не давай прямых рекомендаций «купить» или «продать» конкретные активы.
- Если в JSON есть блок portfolio — опирайся на доходность (expectedYieldPercent, dailyYield) и аллокацию по стоимости (allocationByInstrumentType), а не только на счётчики операций в summary.
- Оценивай диверсификацию, концентрацию (largestPositionSharePercent) и общие риски.
- Ответ — только валидный JSON без markdown и пояснений вне JSON.

Формат ответа:
{
  "summary": "краткий обзор портфеля",
  "risks": ["риск 1", "риск 2"],
  "diversification": "оценка диверсификации",
  "observations": ["наблюдение 1"],
  "disclaimer": "Не является индивидуальной инвестиционной рекомендацией."
}`

/** Извлекает JSON из ответа модели (на случай обёртки в \`\`\`json) */
const extractJson = (content: string): string => {
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (fenced?.[1]) {
        return fenced[1].trim()
    }

    const start = content.indexOf('{')
    const end = content.lastIndexOf('}')

    if (start !== -1 && end !== -1 && end > start) {
        return content.slice(start, end + 1)
    }

    return content.trim()
}

/**
 * Анализ портфеля через GigaChat.
 * В сеть уходит только агрегированный snapshot без ID и токенов.
 */
export const analyzePortfolioWithGigaChat = async (
    metrics: PortfolioMetrics,
): Promise<PortfolioAnalysis> => {
    assertSanitizedForLlm(metrics)

    const client = getGigaChatClient()

    const response = await client.chat({
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
                role: 'user',
                content: JSON.stringify(metrics),
            },
        ],
        temperature: 0.3,
    })

    const rawContent = response.choices[0]?.message?.content

    if (!rawContent) {
        throw new Error('GigaChat вернул пустой ответ')
    }

    const parsed = JSON.parse(extractJson(rawContent))
    return portfolioAnalysisResponseSchema.parse(parsed)
}
