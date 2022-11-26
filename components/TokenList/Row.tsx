import React from "react";
import { ethers } from "ethers";
import { Box, HStack, Avatar, Text, Spacer } from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Chart } from "./Chart";
import { formatCurrency } from "../../shared/utils";
import type {
  AddressInfo,
  AddressHistory,
  AddressTransactions,
} from "../../shared/types";
import type { Token } from "./index";

export const MotionBox = motion(
  forwardRef((props, ref) => <Box {...props} ref={ref} />)
);
MotionBox.displayName = "MotionBox";

const Row: React.FC<{
  token: Token;
  addressInfo?: AddressInfo;
  addressHistory?: AddressHistory;
  addressTransactions?: AddressTransactions;
  chartOpened?: boolean;
  setChartOpenedTokenAddress: (
    fun: (arg?: string) => string | undefined
  ) => void;
}> = ({
  token: {
    rawBalance,
    tokenInfo: { address: tokenAddress, symbol, price, image, decimals },
  },
  addressInfo,
  addressHistory,
  addressTransactions,
  chartOpened,
  setChartOpenedTokenAddress,
}) => (
  <React.Fragment key={tokenAddress}>
    <MotionBox
      mt={4}
      backgroundColor="whiteAlpha.50"
      rounded="lg"
      py={2}
      px={4}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      cursor="pointer"
      whileHover={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }}
      onClick={() =>
        setChartOpenedTokenAddress((currentTokenAddress) =>
          currentTokenAddress === tokenAddress ? undefined : tokenAddress
        )
      }
    >
      <HStack>
        <HStack>
          <Avatar
            size={["sm", "md"]}
            mr={4}
            src={
              image?.startsWith("/images")
                ? `https://ethplorer.io${image}`
                : image
            }
            name={symbol}
            placeholder="blur"
          />
          <Box
            maxWidth={[100, 200]}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            <Text as="b" fontSize="xl">
              {symbol}
            </Text>
            {price && <Text mt={2}>{formatCurrency(price.rate)}</Text>}
          </Box>
        </HStack>
        <Spacer />
        <Box textAlign="end">
          {price && (
            <>
              <Text as="b" fontSize="xl">
                {formatCurrency(
                  parseFloat(ethers.utils.formatUnits(rawBalance, decimals)) *
                    price.rate
                )}
              </Text>
              <Box h={2} />
            </>
          )}
          <Text>
            {parseFloat(ethers.utils.formatUnits(rawBalance, decimals)).toFixed(
              4
            )}
          </Text>
        </Box>
      </HStack>
    </MotionBox>
    <MotionBox
      layout
      style={{
        height: chartOpened ? 300 : 0,
      }}
    >
      {chartOpened && (
        <Chart
          {...{
            tokenAddress,
            addressInfo,
            addressHistory,
            addressTransactions,
          }}
        />
      )}
    </MotionBox>
  </React.Fragment>
);

export const MemoizedRow = React.memo(Row);
