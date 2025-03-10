import { Context, Next } from "koa";
import { Bank } from "../utils/services/banks/bank";

export const useBank = async (ctx: Context, next: Next) => {
    try {
        const bankName = ctx.params.bankName;
        const bank = new Bank(bankName);
        ctx['bank'] = bank;
        return await next()
    } catch (error) {
        throw error
    }
}
