import { ConnectButton, useAccount } from "@web3modal/react";
import { ClientCtrl } from "@web3modal/core";

export default function App() {
  const { connected } = useAccount();

  return connected ? (
    <>
      <button onClick={ClientCtrl.ethereum().disconnect}>Disconnect</button>
      <div>
        <buttom>Get Data</buttom>
      </div>
    </>
  ) : (
    <ConnectButton />
  );
}
