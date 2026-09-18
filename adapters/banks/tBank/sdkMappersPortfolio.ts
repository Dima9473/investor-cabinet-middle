import {
    PortfolioPosition,
    PortfolioRequest as SdkPortfolioRequest,
    PortfolioRequest_CurrencyRequest,
    portfolioRequest_CurrencyRequestFromJSON,
    PortfolioResponse,
    PositionsFutures,
    PositionsOptions,
    PositionsRequest,
    PositionsResponse,
    PositionsSecurities,
    VirtualPortfolioPosition,
} from '@tinkoff/invest-js'

import { PortfolioRequest } from '../../../types/banks/portfolioRequest'
import { mapDate, mapMoneyValue, mapQuotation } from './sdkMappersCommon'

const mapPortfolioPosition = (position: PortfolioPosition) => ({
    figi: position.figi,
    instrumentType: position.instrumentType,
    quantity: mapQuotation(position.quantity),
    averagePositionPrice: mapMoneyValue(position.averagePositionPrice),
    expectedYield: mapQuotation(position.expectedYield),
    currentNkd: mapMoneyValue(position.currentNkd),
    currentPrice: mapMoneyValue(position.currentPrice),
    averagePositionPriceFifo: mapMoneyValue(position.averagePositionPriceFifo),
    blocked: position.blocked,
    blockedLots: mapQuotation(position.blockedLots),
    positionUid: position.positionUid,
    instrumentUid: position.instrumentUid,
    varMargin: mapMoneyValue(position.varMargin),
    expectedYieldFifo: mapQuotation(position.expectedYieldFifo),
    dailyYield: mapMoneyValue(position.dailyYield),
})

const mapVirtualPosition = (position: VirtualPortfolioPosition) => ({
    positionUid: position.positionUid,
    instrumentUid: position.instrumentUid,
    figi: position.figi,
    instrumentType: position.instrumentType,
    quantity: mapQuotation(position.quantity),
    averagePositionPrice: mapMoneyValue(position.averagePositionPrice),
    expectedYield: mapQuotation(position.expectedYield),
    expectedYieldFifo: mapQuotation(position.expectedYieldFifo),
    expireDate: mapDate(position.expireDate),
    currentPrice: mapMoneyValue(position.currentPrice),
    averagePositionPriceFifo: mapMoneyValue(position.averagePositionPriceFifo),
})

const mapPositionsSecurities = (item: PositionsSecurities) => ({
    figi: item.figi,
    blocked: item.blocked,
    balance: item.balance,
    positionUid: item.positionUid,
    instrumentUid: item.instrumentUid,
    exchangeBlocked: item.exchangeBlocked,
    instrumentType: item.instrumentType,
})

const mapPositionsFutures = (item: PositionsFutures) => ({
    figi: item.figi,
    blocked: item.blocked,
    balance: item.balance,
    positionUid: item.positionUid,
    instrumentUid: item.instrumentUid,
})

const mapPositionsOptions = (item: PositionsOptions) => ({
    positionUid: item.positionUid,
    instrumentUid: item.instrumentUid,
    blocked: item.blocked,
    balance: item.balance,
})

/** Запрос клиента → SDK getPortfolio */
export const mapPortfolioRequest = (body: PortfolioRequest): SdkPortfolioRequest => ({
    accountId: body.accountId,
    currency: body.currency
        ? portfolioRequest_CurrencyRequestFromJSON(body.currency)
        : PortfolioRequest_CurrencyRequest.RUB,
})

/** SDK getPortfolio → JSON для API */
export const mapSdkPortfolioResponse = (response: PortfolioResponse) => ({
    accountId: response.accountId,
    totalAmountShares: mapMoneyValue(response.totalAmountShares),
    totalAmountBonds: mapMoneyValue(response.totalAmountBonds),
    totalAmountEtf: mapMoneyValue(response.totalAmountEtf),
    totalAmountCurrencies: mapMoneyValue(response.totalAmountCurrencies),
    totalAmountFutures: mapMoneyValue(response.totalAmountFutures),
    totalAmountOptions: mapMoneyValue(response.totalAmountOptions),
    totalAmountSp: mapMoneyValue(response.totalAmountSp),
    totalAmountPortfolio: mapMoneyValue(response.totalAmountPortfolio),
    expectedYield: mapQuotation(response.expectedYield),
    dailyYield: mapMoneyValue(response.dailyYield),
    dailyYieldRelative: mapQuotation(response.dailyYieldRelative),
    positions: response.positions.map(mapPortfolioPosition),
    virtualPositions: response.virtualPositions.map(mapVirtualPosition),
})

/** Запрос клиента → SDK getPositions */
export const mapPositionsRequest = (body: PortfolioRequest): PositionsRequest => ({
    accountId: body.accountId,
})

/** SDK getPositions → JSON для API */
export const mapSdkPositionsResponse = (response: PositionsResponse) => ({
    accountId: response.accountId,
    money: response.money.map(mapMoneyValue),
    blocked: response.blocked.map(mapMoneyValue),
    securities: response.securities.map(mapPositionsSecurities),
    futures: response.futures.map(mapPositionsFutures),
    options: response.options.map(mapPositionsOptions),
    limitsLoadingInProgress: response.limitsLoadingInProgress,
})
