import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import { useKeplr } from "@/services/keplr";
import { useEffect, useState } from "react";
import { WalletProvider } from "@/contexts/WalletProvider";
import { mainnetConfig } from "@/config";
export default function App({ Component, pageProps }: AppProps) {
  const [network, setNetwork]:any = useState(undefined);

  const SideEffects = () => {
    const keplr = useKeplr();
    //console.log(keplr);
    
    useEffect(() => {
      const listenKeystoreChange = () => keplr.connect(true);
      window.addEventListener("keplr_keystorechange", listenKeystoreChange);
    }, [keplr]);

    useEffect(() => {
      const walletAddress = localStorage.getItem("wallet_address");
      if (walletAddress) {
        keplr.connect();
      }
    }, [keplr]);

    return null;
  };
  return (
    <WalletProvider network={network} setNetwork={setNetwork}>
      <Component {...pageProps} />
      <SideEffects />
    </WalletProvider>
  );
}
