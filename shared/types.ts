
export interface Balance {
  id: number;
  timestamp: string;
  balance: number;
}

export interface HorizonResponse<T> {
  _embedded: {
    records: T[];
  };
  _links: {
    next: {
      href: string;
    };
  };
}

export interface Payment {
  id: string;
  created_at: string;
  source_account: string;
  to: string;
  asset_type: string;
  asset_code: string;
  asset_issuer: string;
  amount: string;
  transaction_successful: boolean;
}

export interface Trade {
  id: string;
  ledger_close_time: string;
  offer_id: string;
  base_account: string;
  base_amount: string;
  base_asset_type: string;
  base_asset_code: string;
  base_asset_issuer: string;
  counter_account: string;
  counter_amount: string;
  counter_asset_type: string;
  counter_asset_code: string;
  counter_asset_issuer: string;
  base_is_seller: boolean;
}
