import { ConnectButton, useAccount } from "@web3modal/react";
import { ClientCtrl } from "@web3modal/core";

import { useState } from "react";
import { truncateAddress } from "./utils";

import { Contract, providers } from "ethers";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "../constants";

export default function Home() {
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
    color: "white",
    cursor: "pointer",
  };

  const { connected, address } = useAccount();

  const [name, setName] = useState();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);

    const contract = new Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI
      // TODO: add signer here // stil figure this out
    );
    const response = await contract.name();
    setName(response);
    setLoading(false);
  };

  return (
    <div style={card}>
      {connected ? (
        <div>
          <h5>Account is {truncateAddress(address)}</h5>
          <p onClick={getData} style={walletButton}>
            {!loading ? "Get Data" : "Getting....."}
          </p>
          {name && <p>{name}</p>}
          <p onClick={ClientCtrl.ethereum().disconnect} style={walletButton}>
            Disconnect
          </p>
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
