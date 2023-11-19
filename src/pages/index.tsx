import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { GearFill } from "react-bootstrap-icons";

import ConnectButton from "../components/connectButton";
import ConfigModal from "../components/configModal";
import CurrencyField from "../components/currencyField";

import BeatLoader from "react-spinners/BeatLoader";
import {
  getWethContract,
  getUniContract,
  getPrice,
  runSwap,
} from "./AlphaRouterService";
import swap from "./swapper/main";
import { useWallet } from "@/contexts/WalletProvider";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Ethers from "@/lib/ethers";
import Dropdown from "@/components/dropdown";
import pb from "@/lib/pocketbase";

export default function App() {
  const [position, setPosition] = useState(0);
  const options: any[] = [
    {
      value: "Ethereum",
      icon: <img src={"/images/Ethereum.png"} />,
    },
    {
      value: "Wizarre Scroll",
      icon: <img src={"/images/Wizarre Scrol.png"} />,
    },
    {
      value: "Mantle",
      icon: <img src={"/images/Mantle.png"} />,
    },
    {
      value: "BSC",
      icon: <img src={"/images/BSC.png"} />,
    },
    {
      value: "Arbitrum",
      icon: <img src={"/images/Arbitrum.png"} />,
    },
    {
      value: "Polygon",
      icon: <img src={"/images/Polygon.png"} />,
    },
    {
      value: "Base Protocol",
      icon: <img src={"/images/Base Protocol.png"} />,
    },
  ];
  const [dropdown, setDropdown] = useState<any>(options[0]);
  const [provider, setProvider]: any = useState(undefined);
  const [signer, setSigner]: any = useState(undefined);
  const [signerAddress, setSignerAddress]: any = useState(undefined);

  const [slippageAmount, setSlippageAmount]: any = useState(2);
  const [deadlineMinutes, setDeadlineMinutes]: any = useState(10);
  const [showModal, setShowModal]: any = useState(undefined);

  const [inputAmount, setInputAmount]: any = useState(undefined);
  const [outputAmount, setOutputAmount]: any = useState(undefined);
  const [transaction, setTransaction]: any = useState(undefined);
  const [loading, setLoading]: any = useState(undefined);
  const [ratio, setRatio]: any = useState(undefined);
  const [wethContract, setWethContract]: any = useState(undefined);
  const [uniContract, setUniContract]: any = useState(undefined);
  const [wethAmount, setWethAmount]: any = useState(undefined);
  const [uniAmount, setUniAmount]: any = useState(undefined);
  const [accountAdress, setAccountAdress]: any = useState(undefined);
  const { ethereum } = Ethers();
  useEffect(() => {
    const onLoad = async () => {
      //@ts-ignore
      const provider: any = await new ethers.providers.Web3Provider(ethereum);
      setProvider(provider);

      const wethContract = getWethContract();
      setWethContract(wethContract);

      const uniContract = getUniContract();
      setUniContract(uniContract);
    };
    onLoad();
  }, []);

  const getSigner = async (provider: any) => {
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setSigner(signer);
  };
  const isConnected = () => signer !== undefined;
  const getWalletAddress = () => {
    signer.getAddress().then(async (address: any) => {
      setSignerAddress(address);
      //@ts-ignore
      const provider: any = await new ethers.providers.Web3Provider(ethereum);

      let balance = await provider.getBalance(address);
      console.log(ethers.utils.formatEther(balance));
      //setWethAmount(ethers.utils.formatEther(balance))
      // todo: connect weth and uni contracts
      wethContract.balanceOf(address).then((res: any) => {
        setWethAmount(Number(ethers?.utils?.formatEther(res) || 0));
      });
      uniContract.balanceOf(address).then((res: any) => {
        setUniAmount(Number(ethers.utils.formatEther(res)));
      });
    });
  };

  if (signer !== undefined) {
    getWalletAddress();
  }

  const getSwapPrice = (inputAmount: any) => {
    setLoading(true);
    setInputAmount(inputAmount);
    console.log("inputAmount", inputAmount);

    /* const swap = getPrice(
      inputAmount,
      slippageAmount,
      Math.floor(Date.now() / 1000 + (deadlineMinutes * 60)),
      signerAddress
    ) */
    setLoading(false);
    setOutputAmount((inputAmount / 0.002634).toFixed(3));
    //return inputAmount === 0.1 ? 1.40907 : 0
  };
  const wallet = useWallet();

  async function Swap() {
    let transaction = await swap();
    toast.success("Successfully toasted!");
    console.log("Successfully toasted!");
    Swal.fire(" Transaction Hash: " + transaction?.toString());
  }
  const [isValid, setIsValid] = useState(false);
  const model: any = isValid ? pb?.authStore?.model : "";
  console.log("model", model);
  async function logOut() {
    pb.authStore.clear();
    setIsValid(false);
  }
  useEffect(() => {
    const isValid = pb.authStore.isValid;
    setIsValid(isValid);
  }, [model]);
  return (
    <div className=" w-full h-screen flex flex-col">
      <div className="flex items-center justify-between max-w-7xl mx-auto  w-full py-3 px-3 2xl:px-6">
        {/*  <div className="my-2 hidden buttonContainer buttonContainerTop">
          <PageButton name={"Swap"} isBold={true} />
          <PageButton name={"Pool"} />
          <PageButton name={"Vote"} />
          <PageButton name={"Charts"} />
        </div> */}
        <Dropdown
          label={dropdown}
          options={options}
          selectedOption={dropdown.value}
          onSelect={setDropdown}
        />

        <ConnectButton
          provider={provider}
          isConnected={isConnected}
          signerAddress={signerAddress}
          getSigner={getSigner}
        />
        {/*  <div className="my-2 buttonContainer">
            <PageButton name={"..."} isBold={true} />
          </div> */}
      </div>

      <div className="w-full h-full flex justify-center items-center ">
        <div
          className=" gap-3 flex flex-col !p-6"
          style={{
            borderRadius: "16px",
            background: "#E3EBF6",
            backdropFilter: "blur(36px)",
          }}
        >
          <div className="swapHeader flex items-center justify-between">
            <span className="swapText">Swap</span>
            <span className="gearContainer" onClick={() => setShowModal(true)}>
              <GearFill />
            </span>
            {showModal && (
              <ConfigModal
                onClose={() => setShowModal(false)}
                setDeadlineMinutes={setDeadlineMinutes}
                deadlineMinutes={deadlineMinutes}
                setSlippageAmount={setSlippageAmount}
                slippageAmount={slippageAmount}
              />
            )}
          </div>

          <div className="swapBody bg-[#161620] p-6 gap-6 rounded-3xl relative justify-center items-center flex flex-col">
            <div className="flex flex-col gap-6 justify-center w-full relative items-center">
              <button className=" z-50 object-fill w-12 h-12  opacity-80 hover:opacity-100 transition-all absolute ">
                <svg
                  className="h-full"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2.5"
                    y="2.5"
                    width="95"
                    height="95"
                    rx="17.5"
                    fill="#272733"
                    stroke="#161620"
                    stroke-width="5"
                  />
                  <path
                    d="M50 64.5833L50 35.4167M50 64.5833L37.5 52.0833M50 64.5833L62.5 52.0833"
                    stroke="white"
                    stroke-width="6.25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <CurrencyField
                field="input"
                tokenName="ETH"
                getSwapPrice={getSwapPrice}
                signer={signer}
                balance={wethAmount}
              />
              <CurrencyField
                field="output"
                tokenName="UNI"
                value={outputAmount}
                signer={signer}
                balance={uniAmount}
                spinner={BeatLoader}
                loading={loading}
              />
            </div>
            <div className=" flex justify-center  w-full">
              {isValid ? (
                <button
                  onClick={Swap}
                  className="rounded-lg bg-[#89F3A7] text-black font-medium p-3 flex w-2/3 justify-center"
                >
                  Swap
                </button>
              ) : (
                <button
                  onClick={() => {} /* getSigner(provider) */}
                  className=" rounded-lg bg-[#89F3A7] text-black font-medium p-3 flex w-2/3 justify-center"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* <div className="ratioContainer">
            {ratio && (
              <>
                {`1 UNI = ${ratio} WETH`}
              </>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
