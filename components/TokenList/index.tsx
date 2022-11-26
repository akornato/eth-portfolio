import React, { useState, useMemo } from "react";
import { ethers } from "ethers";
import { AnimatePresence } from "framer-motion";
import { MemoizedRow } from "./Row";
import type { AddressInfo, AddressHistory } from "../../shared/types";

export type Token = AddressInfo["tokens"][0];

const sortTokens = (a: Token, b: Token) => {
  if (!!a.tokenInfo.price && !b.tokenInfo.price) return -1;
  if (!a.tokenInfo.price && !!b.tokenInfo.price) return 1;
  if (!!a.tokenInfo.price && !!b.tokenInfo.price) {
    const valueA =
      parseFloat(ethers.utils.formatUnits(a.rawBalance, a.tokenInfo.decimals)) *
      a.tokenInfo.price.rate;
    const valueB =
      parseFloat(ethers.utils.formatUnits(b.rawBalance, b.tokenInfo.decimals)) *
      b.tokenInfo.price.rate;
    return valueA > valueB ? -1 : 1;
  }
  return 0;
};

export const TokenList: React.FC<{
  addressInfo?: AddressInfo;
  addressHistory?: AddressHistory;
}> = ({ addressInfo, addressHistory }) => {
  const [chartOpenedTokenAddress, setChartOpenedTokenAddress] =
    useState<string>();

  const tokens = useMemo(
    () =>
      addressInfo
        ? [
            {
              balance: addressInfo.ETH.balance,
              rawBalance: addressInfo.ETH.rawBalance,
              tokenInfo: {
                address: "",
                decimals: 18,
                image: "/eth.svg",
                price: addressInfo.ETH.price,
                symbol: "ETH",
              },
            },
            ...(addressInfo.tokens || []),
          ].sort(sortTokens)
        : [],
    [addressInfo]
  );

  return (
    <AnimatePresence>
      {tokens?.map((token) => (
        <MemoizedRow
          key={token.tokenInfo.address}
          token={token}
          addressInfo={addressInfo}
          addressHistory={addressHistory}
          chartOpened={token.tokenInfo.address === chartOpenedTokenAddress}
          setChartOpenedTokenAddress={setChartOpenedTokenAddress}
        />
      ))}
    </AnimatePresence>
  );
};
