import { ToastError, ToastSuccess } from "@/components/SweatAlert";
import pb from "./pocketbase";
import { getInitCode } from "./web3func";

async function getUserNumber() {
  try {
    const getuser = await pb.collection("users").getFullList();
    console.log("getuser", getuser);
    const userNumber = getuser.length + 1;
    console.log("userNumber", userNumber);
    return userNumber;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}

export async function CreateUser(e: any) {
  e.preventDefault();
  let emailOrUserName = e.target.username.value;
  let password = e.target.password.value;
  let passwordConfirm = e.target.passwordConfirm.value;
  /* console.log('password', password);
    console.log('passwordConfirm', passwordConfirm);
    console.log('email', email); */
  if (!emailOrUserName || !password || !passwordConfirm) {
    return;
  }
  try {
    let userNumber = await getUserNumber();
    if (userNumber === false) {
      ToastError.fire("Something went wrong, please try again later");
      return;
    }
    let AccountAddress = await getInitCode({ userNumber: userNumber });
    console.log("AccountAddress", AccountAddress);

    if (AccountAddress) {
      // check userName or email is valid
      let type = "username";
      if (/^\S+@\S+\.\S+$/.test(emailOrUserName)) {
        type = "email";
      } else {
        type = "username";
      }
      const email = type === "email" ? emailOrUserName : "";
      const username = type === "username" ? emailOrUserName : "";
      const data = {
        email: email,
        username: username,
        emailVisibility: false,
        password: password,
        passwordConfirm: passwordConfirm,
        accountAddress: AccountAddress,
      };
      const record = await pb.collection("users").create(data);

      console.log("data", data);
      if (record) {
        ToastSuccess.fire("Account Address created successfully");
        /* login({
            email: email,
            password: e.target.password.value,
          }); */
      } else {
        ToastError.fire("Something went wrong, please try again later");
      }
    } else {
      ToastError.fire("Something went wrong, please try again later");
      throw Error("Account Address not created, please try again later");
    }
  } catch (error: any) {
    console.error(error);
    //console.log('error', error?.data?.data);
    ToastError.fire(
      error?.data?.data?.email?.message ||
        error?.data?.data?.username?.message ||
        error?.data?.data?.passwordConfirm?.message ||
        error?.data?.data?.password?.message ||
        error?.message ||
        "Please enter a valid email address! "
    );
    //handleClickVariant(error?.data?.data?.email?.message || error?.message || 'some thing is wrong', 'error')();
  }
}

export default async function loginWithGoogle() {
  const authMethods = await pb.collection("users").listAuthMethods();

  function storeUserAndRedirect() {
    /* router.push('/auth'); */
    //window.location.href = "/waitlist";
    //reload
    window.location.reload();
  }
  try {
    console.log(
      "authMethods",
      authMethods,
      authMethods.authProviders.length > 0
    );

    if (authMethods.authProviders.length) {
      const authData = await pb
        .collection("users")
        .authWithOAuth2({ provider: "google" })
        .then(async (response) => {
          const user = await pb.collection("users").getOne(response.record.id);

          // skip profile updation if user already exists or user data from OAuth providers haven't changed
          console.log("response.meta", response.meta);
          if (
            user.name &&
            user.avatarUrl &&
            user.name !== response.meta?.name &&
            user.avatarUrl === response.meta?.avatarUrl
          ) {
            storeUserAndRedirect();
          } else if (user)
            console.log({
              name: response.meta?.name,
              avatar: response.meta?.avatarUrl,
            });
          let AccountAddress = "";
          const checkUser = await pb
            .collection("users")
            .getOne(response.record.id);
          if (!checkUser.accountAddress) {
            let userNumber = await getUserNumber();
            if (userNumber === false) {
              ToastError.fire("Something went wrong, please try again later");
              return;
            }
            AccountAddress = await getInitCode({ userNumber: userNumber });
          }
          console.log("AccountAddress", AccountAddress);
          if (AccountAddress) {
            pb.collection("users")
              .update(response.record.id, {
                name: response.meta?.name,
                avatarUrl: response.meta?.avatarUrl,
                accountAddress: AccountAddress,
              })
              .then((res) => {
                console.log("res", res);

                storeUserAndRedirect();
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
        .catch((err) => {
          console.error(err);
        });
      console.log("authData", authData);

      return authData;
    }
  } catch (error) {
    console.log("error", error);

    return false;
  }
}

export async function useLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    if (!email || !password ) {
        return;
      }
    const record = await pb
      .collection("users")
      .authWithPassword(email, password);
    console.log("record", record);
    ToastSuccess.fire("Successfully logged in!");
    return record;
  } catch (error) {
    console.log("error", error);
    ToastError.fire("Something went wrong, please try again later");
    return false;
  }
}
