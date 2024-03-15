
import { app, io } from './run_express';
import axios from 'axios';
import { db, saveBalance, getBalances } from './db';
import { HorizonResponse, Payment, Trade, Balance } from '../shared/types';

const HORIZON_URL = 'https://horizon.stellar.org';
const ACCOUNT_ID = 'GDOJK7UAUMQX5IZERYPNBPQYQ3SHPKGLF5MBUKWLDL2UV2AY6BIS3TFM';
const ASSET_CODE = 'EURMTL';
const ASSET_ISSUER = 'GACKTN5DAZGWXRWB2WLM6OPBDHAMT6SJNGLJZPQMEZBUR4JUGBX2UK7V';

async function fetchPayments(url: string): Promise<Payment[]> {
  const response = await axios.get<HorizonResponse<Payment>>(url);
  const payments = response.data._embedded.records;
  const nextUrl = response.data._links.next.href;

  if (nextUrl !== url) {
    const nextPayments = await fetchPayments(nextUrl);
    return [...payments, ...nextPayments];
  }

  return payments;
}

async function fetchTrades(url: string): Promise<Trade[]> {
  const response = await axios.get<HorizonResponse<Trade>>(url);
  const trades = response.data._embedded.records;
  const nextUrl = response.data._links.next.href;

  if (nextUrl !== url) {
    const nextTrades = await fetchTrades(nextUrl);
    return [...trades, ...nextTrades];
  }

  return trades;
}

async function updateBalances() {
  const paymentsUrl = `${HORIZON_URL}/accounts/${ACCOUNT_ID}/payments?order=asc&limit=200`;
  const payments = await fetchPayments(paymentsUrl);

  const tradesUrl = `${HORIZON_URL}/accounts/${ACCOUNT_ID}/trades?order=asc&limit=200`;
  const trades = await fetchTrades(tradesUrl);

  let balance = 0;

  const transactions = [...payments, ...trades].sort(
    (a, b) => new Date(a.created_at || a.ledger_close_time).getTime() - new Date(b.created_at || b.ledger_close_time).getTime()
  );

  for (const transaction of transactions) {
    if ('amount' in transaction) {
      const payment = transaction as Payment;
      if (
        payment.asset_code === ASSET_CODE &&
        payment.asset_issuer === ASSET_ISSUER &&
        payment.transaction_successful
      ) {
        if (payment.to === ACCOUNT_ID) {
          balance += parseFloat(payment.amount);
        } else if (payment.source_account === ACCOUNT_ID) {
          balance -= parseFloat(payment.amount);
        }
      }
    } else {
      const trade = transaction as Trade;
      if (
        trade.base_asset_code === ASSET_CODE &&
        trade.base_asset_issuer === ASSET_ISSUER
      ) {
        if (trade.base_account === ACCOUNT_ID) {
          balance -= parseFloat(trade.base_amount);
        } else if (trade.counter_account === ACCOUNT_ID) {
          balance += parseFloat(trade.base_amount);
        }
      } else if (
        trade.counter_asset_code === ASSET_CODE &&
        trade.counter_asset_issuer === ASSET_ISSUER
      ) {
        if (trade.base_account === ACCOUNT_ID) {
          balance += parseFloat(trade.counter_amount);
        } else if (trade.counter_account === ACCOUNT_ID) {
          balance -= parseFloat(trade.counter_amount);
        }
      }
    }

    await saveBalance(transaction.created_at || transaction.ledger_close_time, balance);
  }

  io.emit('balances', await getBalances());
}

app.get('/api/balances', async (req, res) => {
  const balances = await getBalances();
  res.json(balances);
});

app.get('/api/update', async (req, res) => {
  await updateBalances();
  res.sendStatus(200);
});

io.on('connection', async (socket) => {
  console.log('Client connected');
  socket.emit('balances', await getBalances());
});

updateBalances();

