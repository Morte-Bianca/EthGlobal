import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Decimal } from "@cosmjs/math";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { AppConfig, getConfig, keplrConfig } from "../config";
import { useWallet } from "../contexts/WalletProvider";
import { useEffect, useState } from "react";

export async function createClient(
    signer: OfflineSigner,
    network: string
): Promise<SigningCosmWasmClient> {
    const config = getConfig(network);

    return SigningCosmWasmClient.connectWithSigner(config.rpcUrl, signer, {
        gasPrice: {
            amount: Decimal.fromUserInput("0.0025", 100),
            denom: config.feeToken,
        },
    });
}

export async function loadKeplrWallet(
    config: AppConfig
): Promise<OfflineSigner> {
    const anyWindow: any = window;

    if (!anyWindow.getOfflineSigner) {
        throw new Error("Keplr extension is not available");
    }

    await anyWindow.keplr.experimentalSuggestChain(keplrConfig(config))
    /* await anyWindow.keplr.suggestToken(
        'juno-1',
        'juno147t4fd3tny6hws6rha9xs5gah9qa6g7hrjv9tuvv6ce6m25sy39sq6yv52',
        'juno147t4fd3tny6hws6rha9xs5gah9qa6g7hrjv9tuvv6ce6m25sy39sq6yv52',
    ) */
    await anyWindow.keplr.enable(config.chainId)

    const signer = await anyWindow.getOfflineSignerAuto(config.chainId);
    signer.signAmino = signer.signAmino ?? signer.sign;

    return Promise.resolve(signer);
}

export function useKeplr() {
    const { clear, init, initialized, network } = useWallet();
    const [initializing, setInitializing] = useState(false);
    const config = getConfig(network);
    //console.log(config);
    
    const disconnect = () => {
        localStorage.clear();
        clear();
    };

    const connect = (walletChange = false) => {
        setInitializing(true);
        
        loadKeplrWallet(config)
            .then((signer) => {
                init(signer);
                if (walletChange) setInitializing(false);
            })
            .catch((err) => {
                console.error(err);
                setInitializing(false);
            });
    };

    useEffect(() => {
        if (!initialized) return;

        setInitializing(false);
    }, [initialized]);

    return {
        connect,
        disconnect,
        initializing,
    };
}
