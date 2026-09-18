/** Тело запроса операций от клиента middleware */
export type OperationsRequest = {
    accountId: string
    from?: string
    to?: string
    state?: string
    figi?: string
}
