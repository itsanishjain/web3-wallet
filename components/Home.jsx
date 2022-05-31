import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connectors";
import { toHex, truncateAddress } from "./utils";

import { Contract, providers } from "ethers";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../constants'

export default function Home() {


  const card = {
    background: "#999",
    maxWidth: "600px",
    margin: "0 auto",
    borderRadius: "8px",
    padding: "20px",
    fontSize: "1.5rem"
  }

  const walletButton = {
    border: "1px solid black",
    padding: "10px",
    borderRadius: "4px",
    maxWidth: "fit-content",
    margin: "10px auto",
    color: "white",
    cursor: "pointer"
  }

  const { library, chainId, account, activate, deactivate, active } = useWeb3React();
  const [name, setName] = useState()
  const [ENS, setENS] = useState()
  const [loading, setLoading] = useState(false)



  // Set MM/walletConnect provider in localStorage
  const setProvider = (type) => { window.localStorage.setItem("provider", type) };

  // Unset MM/walletConnect provider in localStorage
  const refreshState = () => { window.localStorage.setItem("provider", undefined) };

  const disconnect = () => {
    refreshState();
    deactivate();
    setName()
  };

  const getData = async () => {
    setLoading(true)
    if (chainId == 4 && library.connection.url != 'metamask') {
      library.provider.http.connection.url = `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
    }

    const contract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, library);
    const response = await contract.name();
    console.log("RESPONSE:::::", response)
    setName(response);
    setLoading(false)
  }

  const lookupENS = async () => {
    const provider = await library.provider;
    const web3Provider = new providers.Web3Provider(provider)
    console.log({ account })
    const _ens = await web3Provider.lookupAddress(account)
    if (_ens) setENS(_ens)
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
      window.alert("Connected Successfully");
    }
  }


  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
  }, [activate]);

  useEffect(() => {
    if (!account) return;
    if (!library) return;
    lookupENS().then(() => {
      console.log("DONE")
    }).catch(err => console.log('err', err))

  }, [account, library])

  return (

    <div style={card}>
      {account &&
        <div>
          <h5>Account is {truncateAddress(account)}</h5>
          <p onClick={getData} style={walletButton}>{!loading ? "Get Data" : "Getting....."}</p>
          {name && <p>{name}</p>}
          {ENS && <p>  {ENS} </p>}
          <p onClick={disconnect} style={walletButton}>Disconnect</p>
        </div>
      }
      {
        !account && (
          <>
            <p onClick={connectMetaMask} style={walletButton}>Metamask</p>
            <p onClick={connectWalletConnect} style={walletButton}>WalletConnect</p>
          </>
        )
      }
    </div>

  );
}
