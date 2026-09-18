# Investor Cabinet Middle

Read-only адаптер между кабинетом инвестора и T-Invest API. Сервис не содержит методов выставления или отмены заявок и не выполняет денежные операции.

## Запуск

```bash
cp .env.example .env
npm ci
npm run dev
```

В `.env` обязательно задайте новый read-only токен `TBANK_API_TOKEN`. Не используйте токен с правом совершения сделок. Для production также задайте точный список origin в `ALLOWED_ORIGINS` и разместите сервис за пользовательской/session-аутентификацией: CORS сам по себе не защищает API от прямых запросов.

Frontend по умолчанию работает на `https://localhost:9001`, middle — на `http://localhost:3000`.

## API

Все основные методы принимают `POST` и возвращают `{ "data": ..., "meta": { "generatedAt": ..., "source": "t-bank" } }`.

- `/accounts/t-bank`
- `/portfolio/t-bank`
- `/operations/t-bank`
- `/analytics/t-bank`
- `/market-data/t-bank/last-prices`
- `/market-data/t-bank/candles`
- `/health`

Временные совместимые маршруты старого формата находятся под `/legacy/accounts/t-bank` и `/legacy/operations/t-bank`.

`analytics.performance` — оценка исторической стоимости текущего состава портфеля по свечам, а не фактическая доходность счёта. Ответ содержит `quality.coveragePercent`, `quality.methodology` и предупреждения; неподдерживаемые инструменты исключаются. Дивиденды и купоны в `analytics.income` агрегируются по календарным месяцам независимо от интервала графика.

## Проверки

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```
