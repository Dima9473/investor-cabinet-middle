import { adaptBankAccounts } from "../../../../adapters/banks/tBank/accounts";
import { AccountsResponse, Accounts } from "../../../../types/banks/tBank/accounts";
import { IBankServices } from "../../../../types/banks/bankServices";
import { getAccounts } from "./api/getAccounts";
import { OperationsResponse } from "../../../../types/banks/tBank/operations";
import { getOperations } from "./api/getOperations";
import { adaptBankOperations } from "../../../../adapters/banks/tBank/operations";

export class TBank implements IBankServices {
    async getAccountsInfo(token: string): Promise<unknown[]> {
        const { data } = await getAccounts<AccountsResponse>(token)
    
        const accounts = adaptBankAccounts(data);
    
        const userInfo: Accounts = accounts ?? []
    
        return userInfo
    }

    async getOperationsInfo(token: string, body: unknown): Promise<unknown[]> {
        const { data } = await getOperations<OperationsResponse>(token, body)
    
        const accounts = adaptBankOperations(data);
    
        const userInfo: Accounts = accounts ?? []
    
        return userInfo
    }
}
