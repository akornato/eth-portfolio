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
  Spinner,
  Center,
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
  const [loading, setLoading] = useState(false);
  const [addressInfo, setAddressInfo] = useState<AddressInfo>();
  const [addressTransactions, setAddressTransactions] =
    useState<AddressTransactions>();

  useEffect(() => {
    const fetchInfo = async () => {
      if (query.address) {
        setLoading(true);
        const [newAddressInfo, newAddressTransactions] = (await Promise.all([
          fetch(
            `https://api.ethplorer.io/getAddressInfo/${query.address}?apiKey=${
              process.env.NEXT_PUBLIC_ETHPLORER_API_KEY || "freekey"
            }`
          ).then((res) => res.json()),
          fetch(
            `https://api.ethplorer.io/getAddressTransactions/${
              query.address
            }?apiKey=${
              process.env.NEXT_PUBLIC_ETHPLORER_API_KEY || "freekey"
            }&limit=1000`
          ).then((res) => res.json()),
        ])) as unknown as [AddressInfo, AddressTransactions];
        setAddressInfo(newAddressInfo);
        setAddressTransactions(newAddressTransactions);
        setLoading(false);
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
    <>
      {loading && (
        <Center
          h="100vh"
          position="fixed"
          top={0}
          right={0}
          bottom={0}
          left={0}
        >
          <Spinner size="xl" />
        </Center>
      )}
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

        <Container padding={0}>
          <TokenList {...{ addressInfo, addressTransactions }} />
        </Container>
      </Box>
    </>
  );
};

export default Home;
