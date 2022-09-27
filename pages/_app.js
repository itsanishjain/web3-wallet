import { chains, providers } from "@web3modal/ethereum";
import { Web3ModalProvider } from "@web3modal/react";

// Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID)
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");

// Configure web3modal
const modalConfig = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  theme: "dark",
  accentColor: "default",
  ethereum: {
    appName: "web3Modal",
    autoConnect: true,
    chains: [chains.rinkeby],
    providers: [
      providers.walletConnectProvider({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      }),
    ],
  },
};

export default function App({ Component, pageProps }) {
  return (
    <Web3ModalProvider config={modalConfig}>
      <Component {...pageProps} />
    </Web3ModalProvider>
  );
}
