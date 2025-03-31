import { adaptBankAccounts } from "../../../../adapters/banks/tBank/accounts";
import { AccountsResponse } from "../../../../types/banks/tBank/responses/accountsResponse";
import { IBank } from "../../../../types/banks/bank";
import { getAccounts } from "./api/getAccounts";
import { OperationsResponse } from "../../../../types/banks/tBank/responses/operationsResponse";
import { getOperations } from "./api/getOperations";
import { adaptBankOperations } from "../../../../adapters/banks/tBank/operations";
import { OperationsInfo } from "../../../../types/banks/operationsInfo";
import { BANKS } from "../../../../lib/constants/banks";
export class TBank implements IBank {
    async getAccountsInfo(token: string): Promise<unknown[]> {
        const { data } = await getAccounts<AccountsResponse>(token)
    
        const accounts = adaptBankAccounts(data);
    
        return accounts ?? []
    }

    async getOperationsByAccountId(token: string, body: unknown): Promise<OperationsInfo | null> {
        const { data } = await getOperations<OperationsResponse>(token, body)
    
        console.log('body', JSON.parse(body as string).accountId)
        
        const operationsInfo = adaptBankOperations(data, JSON.parse(body as string).accountId, BANKS.T_BANK);

        return operationsInfo
    }

    async getOperations(token: string, body: unknown): Promise<OperationsInfo[]> {
        const operationsInfo = await this.getOperationsByAccountId(token, body)
        
        return operationsInfo ? [operationsInfo] : []
    }
}
