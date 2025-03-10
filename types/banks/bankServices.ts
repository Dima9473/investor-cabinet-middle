export interface IBankServices {
    getAccountsInfo(token: string): Promise<unknown[]>
}
