import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
});


const infuraId = "dc2e719674974f18912598de53fb7e74"

const ALL_SUPPORTED_CHAIN_IDS = [1, 2, 4]

const INFURA_NETWORK_URLS = {
  1: `https://mainnet.infura.io/v3/${infuraId}`,
  2: `https://ropsten.infura.io/v3/${infuraId}`,
  4: `https://rinkeby.infura.io/v3/${infuraId}`
}

// const ALL_SUPPORTED_CHAIN_IDS = {

// }

const walletconnect = new WalletConnectConnector({
  // rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}`,
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: INFURA_NETWORK_URLS,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
};
