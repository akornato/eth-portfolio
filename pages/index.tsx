import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
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

type AddressInfo = {
  ETH: { balance: number; price: { rate: number } };
};

export default function Home() {
  const { address } = useAccount();
  const [addressInfo, setAddressInfo] = useState<AddressInfo>();
  const total = useMemo(() => {
    if (!addressInfo) return -1;
    return addressInfo.ETH.balance * addressInfo.ETH.price.rate;
  }, [addressInfo]);

  useEffect(() => {
    if (address) {
      fetch(`https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`)
        .then((res) => res.json())
        .then(setAddressInfo);
    }
  }, [address]);

  return (
    <Box p={8}>
      <HStack>
        {total >= 0 && (
          <HStack>
            <Icon as={SlWallet} w={8} h={8} mr={8} />
            <Stat>
              <StatLabel>Wallet</StatLabel>
              <StatNumber>${total?.toFixed(2)}</StatNumber>
            </Stat>
          </HStack>
        )}
        <Spacer />
        <ConnectButton />
      </HStack>
    </Box>
  );
}
