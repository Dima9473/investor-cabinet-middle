import { ConsoleHelper } from "../../../lib/consoleHelper";
import { BANKS } from "../../../lib/constants/banks";
import { IBank } from "../../../types/banks/bank";
import { OperationsInfo } from "../../../types/banks/operationsInfo";

export class MockBank implements IBank {
    private bankName: BANKS;
    constructor(bank: BANKS) {
        this.bankName = bank
    }

    async getAccountsInfo(_: string): Promise<unknown[]> {
        ConsoleHelper.warn(`${this.bankName} api еще не реализовано`)
        return []
    }
    
    async getOperationsByAccountId(token: string, account: unknown): Promise<OperationsInfo | null> {
        ConsoleHelper.warn(`${this.bankName} api еще не реализовано`)
        return null
    }

    async getOperations(token: string, account: unknown): Promise<OperationsInfo[]> {
        ConsoleHelper.warn(`${this.bankName} api еще не реализовано`)
        return []
    }
}
