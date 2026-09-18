/** Ошибка для банков без реализации T-Invest API */
export const throwBankNotImplemented = (bankName: string): never => {
    throw Object.assign(
        new Error(`Метод T-Invest API не реализован для банка «${bankName}»`),
        { status: 501 },
    )
}
