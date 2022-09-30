import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connectors";
import { toHex, truncateAddress } from "./utils";

import Web3 from "web3";
import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";



const magic = new Magic(process.env.NEXT_PUBLIC_MC_KEY, {
  extensions: [new ConnectExtension()],
  network: "rinkeby",
});
const web3 = new Web3(magic.rpcProvider);

import { ConnectWallet, useSigner, useAccount } from "@thirdweb-dev/react";

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
    color: "black",
  };

  const signer = useSigner();
  const account = useAccount();
  const [name, setName] = useState();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);

    const contract = new Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      signer
    );
    const response = await contract.name();
    setName(response);
    setLoading(false);
  };

  if (account[0]?.data?.address) {
    return (
      <div style={card}>
        {loading ? (
          "loading...."
        ) : (
          <button onClick={getData} style={walletButton}>
            Get Data
          </button>
        )}
        <div>{name && name}</div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => magic.connect.supportedSdkMethods()}></button>
    </div>
  );
}
