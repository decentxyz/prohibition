import "@decent.xyz/the-box/index.css";
import '@rainbow-me/rainbowkit/styles.css'; 
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { BoxThemeProvider } from "@decent.xyz/the-box";
import 'react-toastify/dist/ReactToastify.css';
import Metadata from '../components/Metadata';
import { SearchContextProvider } from "../lib/contexts/SearchContext";
import { ThemeContextProvider, useThemeContext } from "../lib/contexts/ThemeContext";
import { TokenContextProvider } from "../lib/contexts/UserTokens";
import { BoxHooksContextProvider } from "@decent.xyz/box-hooks";

import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { Chain } from 'viem';

const myBoxTheme = {
  mainBgColor: "#FFFFFF",
  boxSubtleColor2: '#000000',
  boxDialogBgColor: '#FFFFFF',
  boxLoadingBadgeColor: '#F0EFEF'
}

const wagmiConfig = getDefaultConfig({
  appName: 'Launch NFTs',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID as string,
  chains: [mainnet, polygon, optimism, arbitrum, base, zora] as unknown as readonly [Chain, ...Chain[]],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const { dark } = useThemeContext();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={lightTheme({
            accentColor: '#000000',
            accentColorForeground: 'white',
            borderRadius: 'small',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          >
          <ThemeContextProvider>
            <div className={dark ? 'bg-black text-white' : 'bg-white text-black'}>
              <Metadata />
              <BoxThemeProvider theme={myBoxTheme}>
                <BoxHooksContextProvider apiKey={process.env.NEXT_PUBLIC_DECENT_API_KEY}>
                  <TokenContextProvider>
                    <SearchContextProvider>
                      <Component {...pageProps} />
                    </SearchContextProvider>
                  </TokenContextProvider>
                </BoxHooksContextProvider>
              </BoxThemeProvider>
              <ToastContainer />
            </div>
          </ThemeContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;