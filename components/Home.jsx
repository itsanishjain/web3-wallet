import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connectors";
import { toHex, truncateAddress } from "./utils";

import { Contract } from "ethers";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../constants'

export default function Home() {


  const card = {
    background: "grey",
    maxWidth: "600px",
    margin: "0 auto",
    borderRadius: "8px",
    padding: "20px",
    fontSize: "1.5rem"
  }

  const walletButton = {
    border: "1px solid lightgreen",
    padding: "10px",
    borderRadius: "4px",
    maxWidth: "fit-content",
    margin: "10px auto",
    color: "white",
    cursor: "pointer"
  }

  const { library, chainId, account, activate, deactivate, active } = useWeb3React();
  const [name, setName] = useState()



  // Set MM/walletConnect provider in localStorage
  const setProvider = (type) => { window.localStorage.setItem("provider", type) };

  // Unset MM/walletConnect provider in localStorage
  const refreshState = () => { window.localStorage.setItem("provider", undefined) };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  const getData = async () => {
    if (chainId == 4 && library.connection.url != 'metamask') {
      library.provider.http.connection.url = `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
    }

    const contract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, library);
    const response = await contract.name();
    console.log("RESPONSE:::::", response)
    setName(response);
  }




  const connectMetaMask = async () => {
    let isCancelled = false;
    await activate(connectors.injected, () => {
      window.alert("Connection Rejected");
      isCancelled = true;
    });

    if (!isCancelled) {
      setProvider("injected");
      window.alert("Connected Successfully");
    }
  }

  const connectWalletConnect = async () => {
    let isCancelled = false;
    await activate(connectors.walletConnect, () => {
      window.alert("Connection Rejected");
      isCancelled = true;
    });

    if (!isCancelled) {
      setProvider("walletConnect");
      if (library) {
        toast.success("Connected Successfully");
      };
    }
  }


  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
  }, [activate]);

  return (

    <div style={card}>
      {account &&
        <div>
          <h5>Account is {truncateAddress(account)}</h5>
          <p onClick={getData} style={walletButton}>Get Data</p>
          {name && <p>{name}</p>}
          <p onClick={disconnect} style={walletButton}>Disconnect</p>
        </div>
      }
      <p onClick={connectMetaMask} style={walletButton}>Metamask</p>
      <p onClick={connectWalletConnect} style={walletButton}>WalletConnect</p>
    </div>

  );
}
