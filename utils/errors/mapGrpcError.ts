import { ClientError, Status } from 'nice-grpc'

/** Расшифровка бизнес-кодов T-Bank Invest API (поле details) */
const TBANK_ERROR_MESSAGES: Record<string, string> = {
    '40003': 'Токен доступа T-Bank не найден или неактивен. Выпустите новый токен в настройках T-Invest.',
    '30021': 'Не указан обязательный параметр accountId.',
}

/** Маппинг gRPC-ошибок SDK в HTTP-статус для Koa */
export const mapGrpcErrorToHttp = (error: unknown): { status: number; message: string } => {
    if (error instanceof ClientError) {
        const statusByCode: Partial<Record<Status, number>> = {
            [Status.UNAUTHENTICATED]: 401,
            [Status.PERMISSION_DENIED]: 403,
            [Status.NOT_FOUND]: 404,
            [Status.INVALID_ARGUMENT]: 400,
            [Status.UNAVAILABLE]: 503,
        }

        return {
            status: statusByCode[error.code] ?? 502,
            message: TBANK_ERROR_MESSAGES[error.details] ?? (error.details || error.message),
        }
    }

    if (error instanceof Error) {
        return { status: 500, message: error.message }
    }

    return { status: 500, message: 'Internal server error' }
}
