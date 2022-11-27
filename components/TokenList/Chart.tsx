import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { ethers } from "ethers";
import { Box, Text, Center } from "@chakra-ui/react";
import type {
  AddressInfo,
  AddressHistory,
  TxHistory,
  AddressTransactions,
} from "../../shared/types";

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: [{ value: number; payload: TxHistory[0] }];
  label?: string;
}> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const date = new Date(payload[0].payload.timestamp * 1000).toLocaleString();
    return (
      <Box p={2}>
        <Text>
          Balance {payload[0].value.toFixed(4)} {payload[0].payload.symbol}
        </Text>
        <Text>
          {payload[0].payload.type} {payload[0].payload.value.toFixed(4)}{" "}
          {payload[0].payload.symbol}
        </Text>
        <Text>{date}</Text>
      </Box>
    );
  }
  return null;
};

export const Chart: React.FC<{
  tokenAddress?: string;
  addressInfo?: AddressInfo;
  addressTransactions?: AddressTransactions;
}> = ({ tokenAddress, addressInfo, addressTransactions }) => {
  const [addressHistory, setAddressHistory] = useState<AddressHistory>();

  useEffect(() => {
    if (tokenAddress) {
      fetch(
        `https://api.ethplorer.io/getAddressHistory/${
          addressInfo?.address
        }?apiKey=${
          process.env.NEXT_PUBLIC_ETHPLORER_API_KEY || "freekey"
        }&limit=1000&token=${tokenAddress}`
      )
        .then((res) => res.json())
        .then(setAddressHistory);
    }
  }, [addressInfo, tokenAddress]);

  const ethHistory = useMemo(() => {
    return addressTransactions
      ?.sort((a, b) => a.timestamp - b.timestamp)
      .reduce((ethHistory, tx) => {
        const previousBalance =
          ethHistory.length > 0 ? ethHistory[ethHistory.length - 1].balance : 0;
        if (tx.to === addressInfo?.address) {
          return [
            ...ethHistory,
            {
              value: tx.value,
              timestamp: tx.timestamp,
              balance: previousBalance + tx.value,
              type: "Incoming",
              symbol: "ETH",
            },
          ];
        }
        if (tx.from === addressInfo?.address) {
          return [
            ...ethHistory,
            {
              value: tx.value,
              timestamp: tx.timestamp,
              balance: previousBalance - tx.value,
              type: "Outgoing",
              symbol: "ETH",
            },
          ];
        }
        return ethHistory;
      }, [] as TxHistory);
  }, [addressTransactions, addressInfo]);

  const tokenHistory = useMemo(
    () =>
      tokenAddress
        ? addressHistory?.operations
            ?.sort((a, b) => a.timestamp - b.timestamp)
            .reduce((tokenHistory, operation) => {
              if (operation.tokenInfo.address === tokenAddress) {
                const previousBalance =
                  tokenHistory.length > 0
                    ? tokenHistory[tokenHistory.length - 1].balance
                    : 0;
                if (
                  operation.to === addressInfo?.address &&
                  operation.type === "transfer"
                ) {
                  const parsedValue = parseFloat(
                    ethers.utils.formatUnits(
                      operation.value,
                      operation.tokenInfo.decimals
                    )
                  );
                  return [
                    ...tokenHistory,
                    {
                      value: parsedValue,
                      timestamp: operation.timestamp,
                      balance: previousBalance + parsedValue,
                      type: "Incoming",
                      symbol: operation.tokenInfo.symbol,
                    },
                  ];
                }
                if (
                  operation.from === addressInfo?.address &&
                  operation.type === "transfer"
                ) {
                  const parsedValue = parseFloat(
                    ethers.utils.formatUnits(
                      operation.value,
                      operation.tokenInfo.decimals
                    )
                  );
                  return [
                    ...tokenHistory,
                    {
                      value: parsedValue,
                      timestamp: operation.timestamp,
                      balance: previousBalance - parsedValue,
                      type: "Outgoing",
                      symbol: operation.tokenInfo.symbol,
                    },
                  ];
                }
              }
              return tokenHistory;
            }, [] as TxHistory) || []
        : [],
    [addressHistory, addressInfo, tokenAddress]
  );

  const chartData = tokenAddress ? tokenHistory : ethHistory;

  return chartData && chartData.length > 0 ? (
    <ResponsiveContainer>
      <AreaChart
        data={tokenAddress ? tokenHistory : ethHistory}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="LightSkyBlue" stopOpacity={0.3} />
            <stop offset="100%" stopColor="LightSkyBlue" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="LightSkyBlue"
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  ) : (
    <Center height={300}>
      <Text>No historical data available</Text>
    </Center>
  );
};
