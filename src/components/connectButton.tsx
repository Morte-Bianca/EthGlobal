import React, { useEffect } from "react";
import PageButton from "./pageButton";
//import { useAccount, useConnect, useDisconnect, useActiveChain } from "graz";
import { useKeplr } from "@/services/keplr";
import { useWallet } from "@/contexts/WalletProvider";
import { getAddress } from "@/pages/swapper/main";
import * as stytch from "stytch";
import Modal from "./Modal";
import pb from "@/lib/pocketbase";
import { getInitCode } from "@/lib/web3func";
import { Toast, ToastError, ToastSuccess } from "./SweatAlert";
import loginWithGoogle, { CreateUser, useLogin } from "@/lib/auth";

const googleIcon = (
  <svg
    className="w-6 h-6"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_62_133)">
      <path
        d="M10.4508 0.986718C7.45335 2.02657 4.86834 4.00023 3.07548 6.61782C1.28262 9.2354 0.376419 12.3589 0.489976 15.5296C0.603533 18.7003 1.73087 21.751 3.70638 24.2336C5.6819 26.7162 8.40148 28.4999 11.4657 29.3227C13.9499 29.9637 16.5526 29.9918 19.05 29.4047C21.3125 28.8965 23.4042 27.8094 25.1203 26.25C26.9065 24.5774 28.2029 22.4496 28.8703 20.0953C29.5955 17.5351 29.7246 14.8428 29.2477 12.225H15.2977V18.0117H23.3766C23.2151 18.9347 22.8691 19.8155 22.3593 20.6016C21.8495 21.3877 21.1863 22.0629 20.4094 22.5867C19.423 23.2395 18.3109 23.6786 17.1446 23.8758C15.9749 24.0933 14.7752 24.0933 13.6055 23.8758C12.4199 23.6309 11.2984 23.1416 10.3125 22.4391C8.72851 21.3178 7.53912 19.7248 6.9141 17.8875C6.27868 16.0157 6.27868 13.9866 6.9141 12.1148C7.359 10.8028 8.09449 9.60829 9.06566 8.62031C10.177 7.46894 11.5841 6.64593 13.1324 6.24158C14.6808 5.83724 16.3106 5.86718 17.843 6.32812C19.0402 6.69545 20.1349 7.33753 21.0399 8.20312C21.9508 7.29687 22.8602 6.38828 23.768 5.47734C24.2368 4.9875 24.7477 4.52109 25.2094 4.01953C23.8278 2.73403 22.2063 1.73368 20.4375 1.07578C17.2165 -0.0937744 13.6922 -0.125205 10.4508 0.986718Z"
        fill="white"
      />
      <path
        d="M10.4504 0.986718C13.6915 -0.12596 17.2158 -0.0953572 20.4371 1.07344C22.2062 1.73581 23.827 2.74097 25.2066 4.03125C24.7379 4.53281 24.2434 5.00156 23.7652 5.48906C22.8559 6.39687 21.9473 7.30156 21.0395 8.20312C20.1345 7.33753 19.0398 6.69545 17.8426 6.32812C16.3106 5.86556 14.6809 5.83389 13.1322 6.23658C11.5834 6.63927 10.1755 7.46077 9.06289 8.61094C8.09172 9.59891 7.35623 10.7935 6.91133 12.1055L2.05273 8.34375C3.79182 4.89506 6.80293 2.25709 10.4504 0.986718Z"
        fill="#E33629"
      />
      <path
        d="M0.764251 12.0703C1.0252 10.776 1.45876 9.52264 2.05331 8.34375L6.91191 12.1148C6.27649 13.9866 6.27649 16.0157 6.91191 17.8875C5.29316 19.1375 3.67363 20.3938 2.05331 21.6563C0.565385 18.6945 0.111593 15.3199 0.764251 12.0703Z"
        fill="#F8BD00"
      />
      <path
        d="M15.2979 12.2227H29.2479C29.7248 14.8405 29.5958 17.5328 28.8706 20.093C28.2032 22.4472 26.9067 24.575 25.1206 26.2477C23.5526 25.0242 21.9776 23.8102 20.4096 22.5867C21.187 22.0624 21.8505 21.3865 22.3604 20.5995C22.8702 19.8126 23.216 18.9308 23.3768 18.007H15.2979C15.2956 16.0805 15.2979 14.1516 15.2979 12.2227Z"
        fill="#587DBD"
      />
      <path
        d="M2.05078 21.6562C3.67109 20.4062 5.29062 19.15 6.90937 17.8875C7.53564 19.7255 8.72673 21.3185 10.3125 22.4391C11.3014 23.1384 12.4254 23.6237 13.6125 23.8641C14.7822 24.0816 15.9819 24.0816 17.1516 23.8641C18.3179 23.6669 19.43 23.2278 20.4164 22.575C21.9844 23.7984 23.5594 25.0125 25.1273 26.2359C23.4115 27.7962 21.3197 28.8841 19.057 29.393C16.5596 29.9801 13.9569 29.9519 11.4727 29.3109C9.50789 28.7863 7.67268 27.8615 6.08203 26.5945C4.39858 25.2577 3.02352 23.5733 2.05078 21.6562Z"
        fill="#319F43"
      />
    </g>
    <defs>
      <clipPath id="clip0_62_133">
        <rect width="30" height="30" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

function GoogleLoginBtn() {
  return (
    <button
      type="button"
      onClick={loginWithGoogle}
      className="border border-[#616161] rounded-md text-center w-full py-2 flex items-center justify-center gap-3 "
    >
      {googleIcon} Continue with Google
    </button>
  );
}

const ConnectButton = (props: any) => {
  /* const { isConnected, data: account } = useAccount();
  const activeChain = useActiveChain();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect(); */
  const stytchClient = new stytch.Client({
    project_id: "project-test-2fec3cd3-c889-4027-8727-3c7a4ac05a8e",
    secret: "secret-test-QT3KOFDy5KczoEaTnrFjcqVNzag10Xz-di4=",
  });
  const [isValid, setIsValid] = React.useState(false);

  const model:any = isValid ? pb?.authStore?.model : "";
  console.log("model", model);
  async function logOut() {
    pb.authStore.clear();
    setIsValid(false);
  }
  useEffect(() => {
    const isValid = pb.authStore.isValid;
    setIsValid(isValid);
  }, [model]);

  async function login(e: any) {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;

    let res = await useLogin({ email: username, password: password });
    setIsValid(true);
    setModal(false);
    console.log("res", res);
  }

  const toggleConnect = async () => {
    setModal(true);
  };
  const [message, setMessage] = React.useState("");

  //console.log(accountAdress);
  const [modal, setModal] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  return (
    <>
      <Modal title="Login" modal={modal} setModal={setModal}>
        <form
          onSubmit={login}
          key={"login"}
          className="w-[375px] h-fit px-6 gap-3 flex flex-col pb-6 items-center"
        >
          <GoogleLoginBtn />
          <span className="text-[#ADADAD] text-xs font-medium">Or</span>
          <input
            type="text"
            name="username"
            className="border border-[#616161] px-3 bg-[#272733] outline-none rounded-md w-full py-2"
            placeholder="Email or Username"
          />
          <input
            type="password"
            name="password"
            className="border border-[#616161] px-3 bg-[#272733] outline-none rounded-md w-full py-2"
            placeholder="Passworld"
          />
          <button className=" text-black font-medium bg-[#89F3A7] outline-none rounded-md text-center w-full py-2">
            Login
          </button>
          <div>
            <h5 className="text-[#ADADAD] text-sm flex items-center gap-3">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setModal(false);
                  setModal2(true);
                }}
                className="text-[#50A4ED] cursor-pointer"
              >
                Sign up
              </span>
            </h5>
          </div>
        </form>
      </Modal>
      <Modal title="Signup" modal={modal2} setModal={setModal2}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            CreateUser(e);
            setModal2(false);
          }}
          key={"login"}
          className="w-[375px] h-fit px-6 gap-3 flex flex-col pb-6 items-center"
        >
          <GoogleLoginBtn />
          <span className="text-[#ADADAD] text-xs font-medium">Or</span>
          <input
            type="text"
            className="border border-[#616161] px-3 bg-[#272733] outline-none rounded-md w-full py-2"
            name="username"
            placeholder="Email or Username"
          />
          <input
            type="password"
            className="border border-[#616161] px-3 bg-[#272733] outline-none rounded-md w-full py-2"
            name="password"
            placeholder="Password"
          />
          <input
            type="password"
            className="border border-[#616161] px-3 bg-[#272733] outline-none rounded-md w-full py-2"
            name="passwordConfirm"
            placeholder="Password Confirm"
          />
          <button className=" text-black font-medium bg-[#89F3A7] outline-none rounded-md text-center w-full py-2">
            Create
          </button>
        </form>
      </Modal>
      <div className="p-0">
        {isValid ? (
          <div className="bg-black text-white rounded-xl flex-col flex px-3 py-2">
            {model?.accountAddress}
            <button
              className="text-red-500 hover:opacity-70 transition-colors"
              onClick={logOut}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="  bg-[#89F3A7] rounded-xl py-3 px-6 min-w-[100px] text-black font-bold hover:opacity-70 transition-colors"
            onClick={toggleConnect}
          >
            Login
          </button>
        )}
      </div>
    </>
  );
};

export default ConnectButton;
