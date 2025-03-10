export type AccountDTO = {
    id: string,
    openedDate?: string,
    closedDate?: string,
    name?: string,
}

export type Account = {
    id: string,
    openedDate?: string,
    closedDate?: string,
    name?: string,
}

export type Accounts = Account[]
export type AccountsDTO = AccountDTO[]

export type AccountsResponse = {
    accounts: AccountsDTO
}
