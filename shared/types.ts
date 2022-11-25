export type AddressInfo = {
  ETH: { balance: number; rawBalance: string; price: { rate: number } };
  tokens: {
    balance: number;
    rawBalance: string;
    tokenInfo: {
      address: string;
      decimals: number;
      image?: string;
      price?: { rate: number };
      symbol: string;
    };
  }[];
};
