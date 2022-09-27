import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connectors";
import { truncateAddress } from "./utils";

import { Contract } from "ethers";
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

  const { library, chainId, account, activate, deactivate } = useWeb3React();

  const [name, setName] = useState();
  const [loading, setLoading] = useState(false);

  // Unset MM/walletConnect provider in localStorage
  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
    setName();
  };

  const getData = async () => {
    setLoading(true);
    if (chainId == 4 && library.connection.url != "metamask") {
      library.provider.http.connection.url = `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`;
    }

    const contract = new Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      library
    );
    const response = await contract.name();
    setName(response);
    setLoading(false);
  };

  const connectWallet = async (walletName) => {
    setLoading(true);
    let isCancelled = false;

    await activate(connectors[walletName], (err) => {
      console.log(err);

      alert("Connection Rejected");
      isCancelled = true;
    });
    if (isCancelled) return;

    localStorage.setItem("provider", walletName);
    alert("Connected Successfully");
    setLoading(false);
  };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    console.log({ provider });
    if (provider) activate(connectors[provider]);
  }, [activate]);

  console.log(account);
  console.log({ chainId });

  return (
    <div style={card}>
      {account && (
        <div>
          <h5>Account is {truncateAddress(account)}</h5>
          <p onClick={getData} style={walletButton}>
            {!loading ? "Get Data" : "Getting....."}
          </p>
          {name && <p>{name}</p>}
          <p onClick={disconnect} style={walletButton}>
            Disconnect
          </p>
        </div>
      )}
      {!account && (
        <>
          <p onClick={() => connectWallet("uauth")} style={walletButton}>
            UnstoppableDomains
          </p>
        </>
      )}
    </div>
  );
}
