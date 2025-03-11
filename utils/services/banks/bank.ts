import { BANKS } from '../../../lib/constants/banks';
import { IBankServices} from '../../../types/banks/bankServices'
import { TBank } from './tBank/tBank';

export class Bank implements IBankServices {
    private bank: IBankServices | null;

    constructor(bank: BANKS) {
        this.bank = this.getBank(bank)
    }

    private getBank(bank: BANKS): IBankServices | null {
        switch (bank) {
            case 't-bank': {
                return new TBank()

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

    getOperationsInfo(token: string, body: unknown): Promise<unknown[]> {
        if(!this.bank) {
            throw new Error("Банк не найден");
        }

        return this.bank.getOperationsInfo(token, body)
    }

}
