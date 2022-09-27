import { useEffect, useState } from "react";
import { toHex, truncateAddress } from "./utils";

import {
  useAccount,
  useConnect,
  useNetwork,
  useSwitchNetwork,
  useDisconnect,
} from "wagmi";

import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "../constants";

const card = {
  background: "#999",
  maxWidth: "600px",
  margin: "0 auto",
  borderRadius: "8px",
  padding: "20px",
  fontSize: "1.5rem",
};

const walletButton = {
  border: "1px solid black",
  padding: "10px",
  borderRadius: "4px",
  maxWidth: "fit-content",
  margin: "10px auto",
  color: "black",
  cursor: "pointer",
};

export default function Home() {
  const { isConnected, connector, address } = useAccount();

  const { connect, connectors } = useConnect();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const { disconnect } = useDisconnect();

  const getData = async () => {
    setLoading(true);

    const contract = new Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      library
    );
    const response = await contract.name();
    setName(response);
    setLoading(false);
  };

  if (isConnected)
    return (
      <div style={card}>
        <div>Connected with {truncateAddress(address)}</div>
        <button style={walletButton} onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );

  return (
    <div style={card}>
      {connectors.map((x) => (
        <div key={x.id} onClick={() => connect({ connector: x })}>
          <button style={walletButton}>{x.name}</button>
        </div>
      ))}
    </div>
  );
}
