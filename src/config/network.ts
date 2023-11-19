import { AppConfig } from "./app";

export const mainnetConfig: AppConfig = {
  chainId: "okp4-nemeton-1",
  chainName: "OKP4 nemeton",
  addressPrefix: "KNOW",
  rpcUrl: "https://api.testnet.okp4.network/rpc",
  feeToken: "uknow",
  stakingToken: "uknow",
  coinMap: {
    uknow: { denom: "uknow", fractionalDigits: 6 },
  },
  gasPrice: 0.025,
  fees: {
    upload: 1500000,
    init: 500000,
    exec: 200000,
  },
};

export const uniTestnetConfig: AppConfig = {
  chainId: "uni-3",
  chainName: "JunoTestnet",
  addressPrefix: "juno",
  rpcUrl: "https://rpc.uni.junonetwork.io/",
  httpUrl: "https://lcd.uni.juno.deuslabs.fi",
  feeToken: "ujunox",
  stakingToken: "ujunox",
  coinMap: {
    ujuno: { denom: "JUNO", fractionalDigits: 6 },
    ujunox: { denom: "JUNOX", fractionalDigits: 6 },
  },
  gasPrice: 0.025,
  fees: {
    upload: 1500000,
    init: 500000,
    exec: 200000,
  },
};

export const getConfig = (network: string): AppConfig => {
  if (network === "mainnet") return mainnetConfig;
  return mainnetConfig;
};
