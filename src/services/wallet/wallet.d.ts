// Money - Decimal formatted in currency
type Money = string;
type Timestamp = string;

type UserId = string;
type TransactionId = string;

// Read model for internal ledger
export interface Wallet {
  owner: UserId;
  balance: Money;
  withdrawn: Money;
}

// Write model
// There must be withdraw ledger, deposit ledger and wallet
export interface Ledger {
  name: string;
  debet: Money;
  credit: Money;
  owner: UserId;
  transaction: TransactionId;
}

export interface Transaction {
  timestamp: Timestamp;
  // Transfer, withdraw, deposit
  type: string;
  fromLedger: Ledger;
  toLedger: Ledger;
  amount: Money;
  narration: string;
}
