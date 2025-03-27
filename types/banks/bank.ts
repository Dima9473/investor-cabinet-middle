import { OperationsInfo } from "./operationsInfo"

export interface IBank {
    getAccountsInfo(token: string): Promise<unknown[]>
    getOperationsByAccountId(token: string, body: unknown): Promise<OperationsInfo | null>
    getOperations(token: string, body: unknown): Promise<OperationsInfo[]>
}
