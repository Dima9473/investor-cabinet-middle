/** Модель GigaChat для анализа портфеля (Lite — дешевле, Pro/Max — точнее) */
export const GIGACHAT_MODEL = process.env.GIGACHAT_MODEL || 'GigaChat'

/** Scope API: физлица по умолчанию */
export const GIGACHAT_SCOPE = process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS'

/** Глобальный выключатель LLM-анализа без удаления кода */
export const GIGACHAT_ENABLED = process.env.GIGACHAT_ENABLED !== 'false'
