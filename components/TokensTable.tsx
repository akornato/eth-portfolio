import { ethers } from "ethers";
import { forwardRef } from "@chakra-ui/react";
import {
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Box,
  HStack,
  Container,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "../shared/utils";
import type { AddressInfo } from "../shared/types";

const MotionTr = motion(
  forwardRef((props, ref) => <Tr {...props} ref={ref} />)
);
MotionTr.displayName = "MotionTr";

export const TokensTable: React.FC<{
  tokens?: AddressInfo["tokens"];
}> = ({ tokens }) => (
  <Container padding={0}>
    <TableContainer>
      <Table variant="simple">
        <Tbody>
          <AnimatePresence>
            {tokens?.map(
              ({
                rawBalance,
                tokenInfo: { address, symbol, price, image, decimals },
              }) => (
                <MotionTr
                  key={address}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Td paddingLeft={0}>
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
                        {price && (
                          <Text mt={2}>{formatCurrency(price.rate)}</Text>
                        )}
                      </Box>
                    </HStack>
                  </Td>
                  <Td paddingRight={0}>
                    {price && (
                      <>
                        <Text as="b" fontSize="xl">
                          {formatCurrency(
                            parseFloat(
                              ethers.utils.formatUnits(rawBalance, decimals)
                            ) * price.rate
                          )}
                        </Text>
                        <Box h={2} />
                      </>
                    )}
                    <Text>
                      {parseFloat(
                        ethers.utils.formatUnits(rawBalance, decimals)
                      ).toFixed(4)}
                    </Text>
                  </Td>
                </MotionTr>
              )
            )}
          </AnimatePresence>
        </Tbody>
      </Table>
    </TableContainer>
  </Container>
);
