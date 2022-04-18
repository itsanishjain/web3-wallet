import React from 'react';
import Home from '../components/Home';
import { ethers } from 'ethers';
import { Web3ReactProvider } from '@web3-react/core';

const getLibrary = (provider) => {
  return new ethers.providers.Web3Provider(provider);
}

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Home />
    </Web3ReactProvider>
  )
}