import { adaptBankAccounts } from "../../../../adapters/banks/tBank/accounts";
import { AccountsResponse, Accounts } from "../../../../types/banks/tBank/accounts";
import { IBankServices } from "../../../../types/banks/bankServices";
import { getAccounts } from "./api/getAccounts";
import { OperationsResponse } from "../../../../types/banks/tBank/operations";
import { getOperations } from "./api/getOperations";
import { adaptBankOperations } from "../../../../adapters/banks/tBank/operations";
import { OperationsInfo } from "../../../../types/banks/operationsInfo";
import { OperationsRequest } from "../../../../controllers/operations";
export class TBank implements IBankServices {
    async getAccountsInfo(token: string): Promise<unknown[]> {
        const { data } = await getAccounts<AccountsResponse>(token)
    
        const accounts = adaptBankAccounts(data);
    
        return accounts ?? []
    }

    async getOperationsInfo(token: string, body: unknown): Promise<OperationsInfo> {
        const { data } = await getOperations<OperationsResponse>(token, body)
    
        console.log('body', JSON.parse(body as string).accountId)
        
        const operations = adaptBankOperations(data);
        const operationsInfo: OperationsInfo = {
            accountId: JSON.parse(body as string).accountId,
            operations: operations ?? []
        }
    
        return operationsInfo
    }
}
