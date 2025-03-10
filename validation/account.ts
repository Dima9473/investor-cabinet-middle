export const validateBankAccounts = (accounts: any) => {
    if (typeof accounts.id !== 'string' && !accounts.id) throw new Error('invalid account')

    return true
}
