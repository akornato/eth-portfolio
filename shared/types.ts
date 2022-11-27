export type TokenInfo = {
  address: string;
  decimals: string;
  image?: string;
  price?: { rate: number };
  symbol: string;
};

export type AddressInfo = {
  address: string;
  ETH: { balance: number; rawBalance: string; price: { rate: number } };
  tokens: {
    rawBalance: string;
    tokenInfo: TokenInfo;
  }[];
};

export type AddressHistory = {
  operations: {
    from: string;
    timestamp: number;
    to: string;
    tokenInfo: TokenInfo;
    type: string;
    value: string;
  }[];
};

export type AddressTransactions = {
  from: string;
  success: boolean;
  timestamp: number;
  to: string;
  value: number;
}[];

export type TxHistory = {
  value: number;
  timestamp: number;
  balance: number;
  type: string;
  symbol: string;
}[];
