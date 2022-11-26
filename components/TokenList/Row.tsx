import React from "react";
import { ethers } from "ethers";
import { Box, HStack, Avatar, Text, Spacer } from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Chart } from "./Chart";
import { formatCurrency } from "../../shared/utils";
import type { AddressInfo, AddressHistory } from "../../shared/types";
import type { Token } from "./index";

export const MotionBox = motion(
  forwardRef((props, ref) => <Box {...props} ref={ref} />)
);
MotionBox.displayName = "MotionBox";

const Row: React.FC<{
  token: Token;
  addressInfo?: AddressInfo;
  addressHistory?: AddressHistory;
  chartOpened?: boolean;
  setChartOpenedTokenAddress: (
    fun: (arg?: string) => string | undefined
  ) => void;
}> = ({
  token: {
    rawBalance,
    tokenInfo: { address, symbol, price, image, decimals },
  },
  addressInfo,
  addressHistory,
  chartOpened,
  setChartOpenedTokenAddress,
}) => (
  <React.Fragment key={address}>
    <MotionBox
      mt={4}
      backgroundColor="whiteAlpha.50"
      rounded="lg"
      border='1px'
      borderColor='gray.700'
      p={2}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      cursor="pointer"
      whileHover={{
        filter: "brightness(1.5)",
      }}
      onClick={() =>
        setChartOpenedTokenAddress((currentAddress) =>
          currentAddress === address ? undefined : address
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
          addressInfo={addressInfo}
          addressHistory={addressHistory}
          tokenAddress={address}
        />
      )}
    </MotionBox>
  </React.Fragment>
);

export const MemoizedRow = React.memo(Row);
