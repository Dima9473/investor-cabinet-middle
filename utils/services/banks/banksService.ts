import { BANKS } from '../../../lib/constants/banks';
import { IBank} from '../../../types/banks/bank'
import { TBank } from './tBank/tBank';
import { OperationsInfo } from '../../../types/banks/operationsInfo';
import { BANKS_TOKENS } from '../../../lib/constants/banksTokens';
import { MockBank } from './bankMock';
export class BanksService  {
    private bank: IBank | null;

    constructor(bank: BANKS) {
        this.bank = this.getBank(bank)
    }

    private getBank(bank: BANKS): IBank | null {
        switch (bank) {
            case 't-bank': {
                return new TBank()
            }
            case 'sber': {
                return new MockBank(bank)
            }
            case 'vtb': {
                return new MockBank(bank)
            }
            case 'alfa': {
                return new MockBank(bank)
            }
            case 'gazprom': {
                return new MockBank(bank)
            }

            default: return null
        }
    }

    getAccountsInfo(token: string): Promise<unknown[]> {
        if(!this.bank) {
            throw new Error("Банк не найден");
        }

        return this.bank.getAccountsInfo(token)
    }    

    getOperationsByAccountId(token: string, body: unknown): Promise<OperationsInfo | null> {
        if(!this.bank) {
            throw new Error("Банк не найден");
        }

        return this.bank.getOperationsByAccountId(token, body)
    }

    async getOperations(body: unknown): Promise<OperationsInfo[] > {
        const operationsInfo: OperationsInfo[] = []

        for (const bank of Object.values(BANKS)) {
            const currentBank = this.getBank(bank)

            if (currentBank) {
                //TODO: body - должен приходить список accountId смапленный по банкам
                const data = await this.getOperationsByAccountId(BANKS_TOKENS['t-bank'], body)
                data && operationsInfo.push(data)
            }
        }

        return operationsInfo
    }

}
