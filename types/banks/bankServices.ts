export interface IBankServices {
    getAccountsInfo(token: string): Promise<unknown[]>
    getOperationsInfo(token: string, body: unknown): Promise<unknown[]>
}
