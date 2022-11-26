import { useMemo } from "react";
import { ethers } from "ethers";
import {
  Container,
  Box,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import { SlWallet } from "react-icons/sl";
import { ConnectButton } from "../components/ConnectButton";
import { TokenList } from "../components/TokenList";
import { formatCurrency } from "../shared/utils";
import type { NextPage, GetServerSideProps } from "next";
import type { AddressInfo, AddressHistory } from "../shared/types";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query?.address) {
    return { props: {} };
  }
  const [addressInfo, addressHistory, addressTransactions] = await Promise.all([
    fetch(
      `https://api.ethplorer.io/getAddressInfo/${query.address}?apiKey=${
        process.env.ETHPLORER_API_KEY || "freekey"
      }`
    ).then((res) => res.json()),
    fetch(
      `https://api.ethplorer.io/getAddressHistory/${query.address}?apiKey=${
        process.env.ETHPLORER_API_KEY || "freekey"
      }`
    ).then((res) => res.json()),
    fetch(
      `https://api.ethplorer.io/getAddressTransactions/${
        query.address
      }?apiKey=${process.env.ETHPLORER_API_KEY || "freekey"}`
    ).then((res) => res.json()),
  ]);
  return {
    props: { addressInfo, addressHistory, addressTransactions },
  };
};

const Home: NextPage<{
  addressInfo: AddressInfo;
  addressHistory: AddressHistory;
  addressTransactions: any;
}> = ({ addressInfo, addressHistory, addressTransactions }) => {
  const totalWalletValue = useMemo(
    () =>
      addressInfo
        ? addressInfo.ETH.balance * addressInfo.ETH.price.rate +
          (addressInfo.tokens
            ? addressInfo.tokens.reduce(
                (totalTokenValue, token) =>
                  totalTokenValue +
                  (token.tokenInfo.price
                    ? parseFloat(
                        ethers.utils.formatUnits(
                          token.rawBalance,
                          token.tokenInfo.decimals
                        )
                      ) * token.tokenInfo.price.rate
                    : 0),

                0
              )
            : 0)
        : undefined,
    [addressInfo]
  );

  return (
    <Box p={[4, 8]}>
      <HStack alignItems="start">
        {totalWalletValue !== undefined && (
          <HStack>
            <Icon as={SlWallet} w={[8, 12]} h={[8, 12]} mr={4} />
            <Stat>
              <StatLabel>Wallet</StatLabel>
              <StatNumber>{formatCurrency(totalWalletValue)}</StatNumber>
            </Stat>
          </HStack>
        )}
        <Spacer />
        <ConnectButton />
      </HStack>
      <Box h={8} />
      {addressInfo && (
        <Container>
          <TokenList
            {...{ addressInfo, addressHistory, addressTransactions }}
          />
        </Container>
      )}
    </Box>
  );
};

export default Home;
