import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { omitBy } from "lodash";
import { Button } from "@chakra-ui/react";

export const ConnectButton = () => {
  const { query, push } = useRouter();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);

  useEffect(() => {
    if (isConnected) {
      push({
        query: omitBy(
          {
            ...query,
            address,
          },
          (value) => !value
        ),
      });
    }
    // eslint-disable-next-line
  }, [address]);

  return isMounted ? (
    <Button
      onClick={() =>
        isConnected ? disconnect() : connect({ connector: connectors[0] })
      }
    >
      {isConnected
        ? `${address?.substring(0, 5)}...${address?.substring(
            address.length - 4
          )}`
        : "Connect"}
    </Button>
  ) : null;
};
