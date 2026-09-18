import {
    Account,
    ChildOperationItem,
    GetAccountsResponse,
    Operation,
    OperationState,
    operationStateFromJSON,
    OperationTrade,
    OperationsResponse,
} from '@tinkoff/invest-js'

import { AccountDTO } from '../../../types/banks/tBank/DTO/accountDTO'
import { OperationDTO } from '../../../types/banks/tBank/DTO/operationDTO'
import { AccountsResponse } from '../../../types/banks/tBank/responses/accountsResponse'
import { OperationsResponse as AppOperationsResponse } from '../../../types/banks/tBank/responses/operationsResponse'
import { OperationsRequest } from '../../../types/banks/operationsRequest'
import type { OperationsRequest as SdkOperationsRequest } from '@tinkoff/invest-js'
import { mapDate, mapMoneyValue } from './sdkMappersCommon'

/** Ответ SDK getAccounts → внутренний контракт приложения */
export const mapSdkAccountsResponse = (
    response: GetAccountsResponse,
): AccountsResponse => ({
    accounts: response.accounts.map(mapSdkAccount),
})

const mapSdkAccount = (account: Account): AccountDTO => ({
    id: account.id,
    name: account.name,
    openedDate: mapDate(account.openedDate),
    closedDate: account.closedDate ? mapDate(account.closedDate) : undefined,
})

/** Тело запроса клиента → тип SDK getOperations */
export const mapOperationsRequest = (
    body: OperationsRequest,
): SdkOperationsRequest => ({
    accountId: body.accountId,
    from: body.from ? new Date(body.from) : undefined,
    to: body.to ? new Date(body.to) : undefined,
    state: body.state
        ? operationStateFromJSON(body.state)
        : OperationState.OPERATION_STATE_EXECUTED,
    figi: body.figi,
})

/** Ответ SDK getOperations → внутренний контракт приложения */
export const mapSdkOperationsResponse = (
    response: OperationsResponse,
): AppOperationsResponse => ({
    operations: response.operations.map(mapSdkOperation),
})

const mapSdkOperation = (operation: Operation): OperationDTO => ({
    id: operation.id,
    parentOperationId: operation.parentOperationId,
    currency: operation.currency,
    payment: mapMoneyValue(operation.payment),
    price: mapMoneyValue(operation.price),
    quantity: String(operation.quantity),
    quantityRest: String(operation.quantityRest),
    figi: operation.figi,
    instrumentType: operation.instrumentType,
    date: mapDate(operation.date),
    type: operation.type,
    assetUid: operation.assetUid,
    positionUid: operation.positionUid,
    instrumentUid: operation.instrumentUid,
    childOperations: operation.childOperations.map(mapChildOperation),
    trades: operation.trades.map(mapOperationTrade),
})

const mapChildOperation = (item: ChildOperationItem) => ({
    instrumentUid: item.instrumentUid,
    payment: mapMoneyValue(item.payment),
})

const mapOperationTrade = (trade: OperationTrade) => ({
    tradeId: trade.tradeId,
    dateTime: mapDate(trade.dateTime),
    quantity: String(trade.quantity),
    price: mapMoneyValue(trade.price),
})
