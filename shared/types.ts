export type TokenInfo = {
  address: string;
  decimals: number;
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

export type TokenHistory = {
  value: number;
  timestamp: number;
  balance: number;
  type: string;
  symbol: string;
}[];
