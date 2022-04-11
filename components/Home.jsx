import { useEffect, useState } from "react";
import {
  VStack,
  useDisclosure,
  Button,
  Text,
  HStack,
  Select,
  Input,
  Box
} from "@chakra-ui/react";
import SelectWalletModal from "./Modal";
import { useWeb3React } from "@web3-react/core";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { networkParams } from "./networks";
import { connectors } from "./connectors";
import { toHex, truncateAddress } from "./utils";

import { Contract } from "ethers";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../constants'

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    library,
    chainId,
    account,
    activate,
    deactivate,
    active
  } = useWeb3React();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();


  const getData = async () => {
    const contract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, library);
    const response = await contract.name();
    console.log("RESPONSE:::::", response)
  }

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]]
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
  }, [activate]);

  return (
    <>
      <VStack justifyContent="center" alignItems="center" h="100vh">
        <HStack marginBottom="10px">
          <Text
            margin="0"
            lineHeight="1.15"
            fontSize={["1.5em", "2em", "3em", "4em"]}
            fontWeight="600"
          >
            Let&apos;s connect with
          </Text>
          <Text
            margin="0"
            lineHeight="1.15"
            fontSize={["1.5em", "2em", "3em", "4em"]}
            fontWeight="600"
            sx={{
              background: "linear-gradient(90deg, #1652f0 0%, #b9cbfb 70.35%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Web3-React
          </Text>
        </HStack>
        <HStack>
          {!active ? (
            <Button onClick={onOpen}>Connect Wallet</Button>
          ) : (
            <Button onClick={disconnect}>Disconnect</Button>
          )}
        </HStack>
        <VStack justifyContent="center" alignItems="center" padding="10px 0">
          <HStack>
            <Text>{`Connection Status: `}</Text>
            {active ? (
              <CheckCircleIcon color="green" />
            ) : (
              <WarningIcon color="#cd5700" />
            )}
          </HStack>

          <Tooltip label={account} placement="right">
            <Text>{`Account: ${truncateAddress(account)}`}</Text>
          </Tooltip>
          <Text>{`Network ID: ${chainId ? chainId : "No Network"}`}</Text>
        </VStack>
        {active && (
          <HStack justifyContent="flex-start" alignItems="flex-start">
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="10px"
            >
              <VStack>
                <Button onClick={getData}>
                  GET DATA
                </Button>
                <Button onClick={switchNetwork} isDisabled={!network}>
                  Switch Network
                </Button>
                <Select placeholder="Select network" onChange={handleNetwork}>
                  <option value="3">Ropsten</option>
                  <option value="4">Rinkeby</option>
                  <option value="42">Kovan</option>
                  <option value="1666600000">Harmony</option>
                  <option value="42220">Celo</option>
                </Select>
              </VStack>
            </Box>
          </HStack>
        )}
        <Text>{error ? error.message : null}</Text>
      </VStack>
      <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
    </>
  );
}
