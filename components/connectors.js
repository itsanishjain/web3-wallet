import { InjectedConnector } from "@web3-react/injected-connector";
import { UAuthConnector } from "@uauth/web3-react";

const injected = new InjectedConnector({
  supportedChainIds: [4, 37, 80001],
});

export const uauth = new UAuthConnector({
  clientID: "ADD_YOUR_CLIENT_ID",
  redirectUri: "http://127.0.0.1:3000",
  scope: "openid wallet",
  connectors: { injected },
});

export const connectors = { injected, uauth };
