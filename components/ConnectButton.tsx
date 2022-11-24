import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@chakra-ui/react";

export const ConnectButton = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <Button
      onClick={() =>
        isConnected ? disconnect() : connect({ connector: connectors[0] })
      }
    >
      {isConnected
        ? `${connectedAddress?.substring(0, 5)}...${connectedAddress?.substring(
            connectedAddress.length - 4
          )}`
        : "Connect"}
    </Button>
  );
};
