type Payment = {
    nano: number,
    currency: string,
    units: string
}

type childOperation = {
    instrumentUid: string,
    payment: Payment
}

type Price = {
    nano: number,
    currency: string,
    units: string
}

type Trades = {
    tradeId: string,
    dateTime: string,
    quantity: string,
    price: Price,
}

export type Operation = {
    date: string,
    assetUid: string,
    instrumentType: string,
    childOperations:childOperation[],
    quantity: string,
    parentOperationId: string,
    trades: Trades[],
    positionUid: string,
    figi: string,
    type: string,
    price: Price,
    instrumentUid: string,
    currency: string,
    payment: Payment,
    id: string,
    quantityRest: string
}

export type Operations = Operation[]

export type OperationsResponse = {
    operations: Operations
}
