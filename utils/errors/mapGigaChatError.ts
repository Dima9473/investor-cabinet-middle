import { AxiosError } from 'axios'

/** Приводит ошибки GigaChat/axios к HTTP-статусу для Koa */
export const mapGigaChatErrorToHttp = (error: unknown): { status: number; message: string } => {
    if (error instanceof Error && error.message.includes('Запрещено отправлять поле')) {
        return { status: 500, message: 'Внутренняя ошибка: попытка передать чувствительные данные в LLM' }
    }

    if (error instanceof AxiosError) {
        const status = error.response?.status

        if (status === 401 || status === 403) {
            return { status: 502, message: 'Ошибка авторизации GigaChat — проверьте secrets/gigachat.ts' }
        }

        if (status === 429) {
            return { status: 503, message: 'Превышен лимит запросов GigaChat, повторите позже' }
        }

        const apiMessage =
            typeof error.response?.data === 'object' &&
            error.response.data !== null &&
            'message' in error.response.data
                ? String((error.response.data as { message: unknown }).message)
                : error.message

        return { status: status ?? 502, message: apiMessage }
    }

    if (error instanceof Error) {
        return { status: 500, message: error.message }
    }

    return { status: 500, message: 'Ошибка при обращении к GigaChat' }
}
