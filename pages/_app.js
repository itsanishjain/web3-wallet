import "../styles/globals.css";

import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import {
  WagmiConfig,
  createClient,
  configureChains,
  defaultChains,
} from "wagmi";

const { provider, webSocketProvider } = configureChains(defaultChains, [
  publicProvider(),
]);

const client = createClient({
  connectors: [
    new MetaMaskConnector(),
    new WalletConnectConnector({ options: { qrcode: true } }),
    new CoinbaseWalletConnector({ options: { appName: "WagmiWallet" } }),
  ],
  autoConnect: true,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default MyApp;
