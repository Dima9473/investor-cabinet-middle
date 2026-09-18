import { Money } from "../../../../contracts/readOnly";
import { RawMoney, RawQuotation } from "./schemas";

const NANO_FACTOR = 1_000_000_000n;

export const quotationToNano = (value?: RawQuotation): bigint => {
    const units = BigInt(value?.units ?? "0");
    const nano = BigInt(value?.nano ?? 0);

    return (units * NANO_FACTOR) + nano;
};

export const quotationToString = (value?: RawQuotation): string => {
    const totalNano = quotationToNano(value);
    const negative = totalNano < 0n;
    const absolute = negative ? -totalNano : totalNano;
    const units = absolute / NANO_FACTOR;
    const nano = absolute % NANO_FACTOR;
    const fraction = nano.toString().padStart(9, "0").replace(/0+$/, "");
    const sign = negative ? "-" : "";

    return fraction ? `${sign}${units}.${fraction}` : `${sign}${units}`;
};

export const decimalStringToNano = (value: string): bigint => {
    const match = /^(-?)(\d+)(?:\.(\d{1,9}))?$/.exec(value);

    if (!match) {
        return 0n;
    }

    const fraction = (match[3] ?? "").padEnd(9, "0");
    const absolute = (BigInt(match[2]) * NANO_FACTOR) + BigInt(fraction || "0");

    return match[1] === "-" ? -absolute : absolute;
};

export const moneyToNano = (value: Money | RawMoney): bigint => quotationToNano(value);

export const moneyFromNano = (currency: string, totalNano: bigint): Money => ({
    currency: currency.toUpperCase(),
    nano: Number(totalNano % NANO_FACTOR),
    units: (totalNano / NANO_FACTOR).toString(),
});

export const normalizeMoney = (value: RawMoney | undefined, fallbackCurrency = "RUB"): Money => moneyFromNano(
    value?.currency || fallbackCurrency,
    quotationToNano(value),
);

export const moneyFromQuotation = (value: RawQuotation | undefined, currency: string): Money => moneyFromNano(
    currency,
    quotationToNano(value),
);

export const multiplyMoney = (price: Money, quantity: RawQuotation | undefined): Money => moneyFromNano(
    price.currency,
    (moneyToNano(price) * quotationToNano(quantity)) / NANO_FACTOR,
);

export const zeroMoney = (currency: string): Money => moneyFromNano(currency, 0n);

export const ratioPercent = (numerator: bigint, denominator: bigint): number => {
    if (denominator === 0n) {
        return 0;
    }

    const scaled = (numerator * 1_000_000n) / denominator;

    return Number(scaled) / 10_000;
};

export const addMoney = (left: Money, right: Money): Money => {
    if (left.currency !== right.currency) {
        return left;
    }

    return moneyFromNano(left.currency, moneyToNano(left) + moneyToNano(right));
};
