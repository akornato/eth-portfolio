import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
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
import type { NextPage } from "next";
import type {
  AddressInfo,
  AddressHistory,
  AddressTransactions,
} from "../shared/types";

const Home: NextPage = () => {
  const { query } = useRouter();
  const [addressInfo, setAddressInfo] = useState<AddressInfo>();
  const [addressHistory, setAddressHistory] = useState<AddressHistory>();
  const [addressTransactions, setAddressTransactions] =
    useState<AddressTransactions>();

  useEffect(() => {
    const fetchInfo = async () => {
      if (query.address) {
        fetch(
          `https://api.ethplorer.io/getAddressInfo/${query.address}?apiKey=${
            process.env.NEXT_PUBLIC_ETHPLORER_API_KEY || "freekey"
          }`
        )
          .then((res) => res.json())
          .then(setAddressInfo);
        fetch(
          `https://api.ethplorer.io/getAddressHistory/${query.address}?apiKey=${
            process.env.NEXT_PUBLIC_ETHPLORER_API_KEY || "freekey"
          }`
        )
          .then((res) => res.json())
          .then(setAddressHistory);
        fetch(
          `https://api.ethplorer.io/getAddressTransactions/${
            query.address
          }?apiKey=${process.env.NEXT_PUBLIC_ETHPLORER_API_KEY || "freekey"}`
        )
          .then((res) => res.json())
          .then(setAddressTransactions);
      }
    };
    fetchInfo();
  }, [query.address]);

  const totalWalletValue = useMemo(
    () =>
      addressInfo?.ETH
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
