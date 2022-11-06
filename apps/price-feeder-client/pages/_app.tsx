import { AppProps } from 'next/app';
import Head from 'next/head';

import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@chakra-ui/pro-theme'; // when using npm
import '@fontsource/inter/variable.css';

// Rainbowkit
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';

const { chains, provider } = configureChains(
  [chain.polygonMumbai, chain.localhost],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'PriceFeeder',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// Rainbowkit end

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Price Feeder</title>
      </Head>
      <ChakraProvider theme={theme}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} theme={darkTheme()}>
            <main className="app">
              <Component {...pageProps} />
            </main>
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </>
  );
}

export default CustomApp;
