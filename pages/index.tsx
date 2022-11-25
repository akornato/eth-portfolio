import { useMemo } from "react";
import { ethers } from "ethers";
import {
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
import { TokensTable } from "../components/TokensTable";
import { formatCurrency } from "../shared/utils";
import type { NextPage, GetServerSideProps } from "next";
import type { AddressInfo } from "../shared/types";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query?.address) {
    return { props: {} };
  }
  const addressInfo = await fetch(
    `https://api.ethplorer.io/getAddressInfo/${query.address}?apiKey=${
      process.env.ETHPLORER_API_KEY || "freekey"
    }`
  ).then((res) => res.json());
  return {
    props: { addressInfo },
  };
};

type Token = AddressInfo["tokens"][0];

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

const Home: NextPage<{ addressInfo: AddressInfo }> = ({ addressInfo }) => {
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
      {addressInfo && <TokensTable tokens={tokens} />}
    </Box>
  );
};

export default Home;
