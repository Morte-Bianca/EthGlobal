import { ethers } from "ethers";
//@ts-ignore
import { getAccountNonce } from "permissionless";
//@ts-ignore
import {
  getSenderAddress,
} from "permissionless";

import {
  Address,
  Hash,
  concat,
  createClient,
  createPublicClient,
  encodeFunctionData,
  http,
  Hex,
} from "viem";
import {
  generatePrivateKey,
  privateKeyToAccount,
  signMessage,
} from "viem/accounts";
import { lineaTestnet, scrollSepolia } from "viem/chains";
// DEFINE THE CONSTANTS
const privateKey =
  "0x45ddf996bd2801e91cce585c73240aadc5b18acd4b19dff5810f591c802e426c"; // replace this with a private key you generate!
const apiKey = "93e51e8c-29ab-476d-8195-2dc2adb88979"; // replace with your Pimlico API key

const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
  "0x9406Cc6185a346906296840746125a0E44976454";

const chain = "scroll-sepolia-testnet";

if (apiKey === undefined) {
  throw new Error(
    "Please replace the `apiKey` env variable with your Pimlico API key"
  );
}

if (privateKey.match(/GENERATED_PRIVATE_KEY/)) {
  throw new Error(
    "Please replace the `privateKey` variable with a newly generated private key. You can use `generatePrivateKey()` for this"
  );
}
const publicClient = createPublicClient({
  transport: http("https://sepolia-rpc.scroll.io/"),
  chain: scrollSepolia,
});

const signer = privateKeyToAccount(privateKey as Hash);
// CALCULATE THE DETERMINISTIC SENDER ADDRESS

export async function getInitCode({ userNumber }: { userNumber: number }) {
  let initCode = concat([
    SIMPLE_ACCOUNT_FACTORY_ADDRESS,
    encodeFunctionData({
      abi: [
        {
          inputs: [
            { name: "owner", type: "address" },
            { name: "salt", type: "uint256" },
          ],
          name: "createAccount",
          outputs: [{ name: "ret", type: "address" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      args: [signer.address, BigInt(userNumber)],
    }),
  ]);

  const senderAddress = await getSenderAddress(publicClient, {
    initCode,
    entryPoint: ENTRY_POINT_ADDRESS,
  });
  return senderAddress;
}



