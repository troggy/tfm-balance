
# Stellar EURMTL Balance History App

This app displays a line graph of the historical balances of the EURMTL asset (issuer GACKTN5DAZGWXRWB2WLM6OPBDHAMT6SJNGLJZPQMEZBUR4JUGBX2UK7V) for the Stellar account GDOJK7UAUMQX5IZERYPNBPQYQ3SHPKGLF5MBUKWLDL2UV2AY6BIS3TFM. It retrieves payment and trade data from the Stellar Horizon API, calculates the balance changes, stores the results in a SQLite database, and serves the data to a React frontend.

## Routes

- `/`: Serves the React frontend
- `/api/balances`: Returns the historical balance data from the database
- `/api/update`: Fetches the latest payment and trade data from Horizon and updates the database

## Database

The app uses a SQLite database to store the historical balance data. The database has a single table called `balances` with the following columns:

- `id` (INTEGER, PRIMARY KEY): Auto-incrementing ID
- `timestamp` (TEXT): Timestamp of the balance change
- `balance` (REAL): Balance of the EURMTL asset at the given timestamp

## Libraries Used

- Backend:
  - express
  - sqlite3
  - axios
  - socket.io
  - cookie-parser
  - esbuild
- Frontend:
  - react
  - react-dom
  - recharts
  - axios
  - socket.io-client

## Running the App

To run the app, execute the following command:

```
bun server/run.ts
```

This will start the server on port 8001. Open http://localhost:8001 in your browser to view the app.

