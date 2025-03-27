import { Context, Next } from "koa";
import { BanksService } from "../utils/services/banks/banksService";

export const useBank = async (ctx: Context, next: Next) => {
    try {
        const bankName = ctx.params.bankName;
        const bank = new BanksService(bankName);
        ctx['bank'] = bank;
        return await next()
    } catch (error) {
        throw error
    }
}
