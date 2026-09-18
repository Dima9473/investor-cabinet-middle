import { MoneyValue, Quotation } from '@tinkoff/invest-js'

/** MoneyValue SDK → формат REST/JSON для zod-схем */
export const mapMoneyValue = (value: MoneyValue | undefined) => ({
    currency: value?.currency ?? '',
    units: String(value?.units ?? 0),
    nano: value?.nano ?? 0,
})

/** Quotation SDK → JSON */
export const mapQuotation = (value: Quotation | undefined) => {
    if (!value) {
        return undefined
    }

    return {
        units: String(value.units ?? 0),
        nano: value.nano ?? 0,
    }
}

/** Числовое значение MoneyValue */
export const moneyValueToNumber = (value: MoneyValue | undefined): number => {
    if (!value) {
        return 0
    }

    return Number(value.units) + (value.nano ?? 0) / 1_000_000_000
}

/** Числовое значение Quotation */
export const quotationToNumber = (value: Quotation | undefined): number => {
    if (!value) {
        return 0
    }

    return Number(value.units) + (value.nano ?? 0) / 1_000_000_000
}

/** Дата SDK → ISO-строка */
export const mapDate = (date: Date | undefined): string =>
    date?.toISOString() ?? ''
