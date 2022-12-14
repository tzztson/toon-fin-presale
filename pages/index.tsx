import { useWallet } from "use-wallet2";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../contracts/abi/5.json";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [FTMamount, setFTMamount] = useState(0);
  const [TFTamount, setTFTamount] = useState(0);
  const [TFTPrice, setTFTPrice] = useState(0);

  const wallet = useWallet();

  useEffect(() => {
    if (wallet.status == "connected") {
      setIsConnected(false);
      getPrice();
    }
  }, [wallet.status]);

  useEffect(() => {
    setTFTamount(FTMamount * TFTPrice);
  }, [FTMamount]);

  const importTokentoMetamask = async () => {
    const { ethereum } = window;
    const tokenAddress = contractABI.token.address;
    const tokenSymbol = "TFT";
    const tokenDecimals = 18;
    // const tokenImage =
    try {
      if (ethereum) {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              // image: tokenImage, // A string url of the token logo
            },
          },
        });
        if (wasAdded) {
          console.log("Thanks for your interest!");
        } else {
          console.log("Your loss!");
        }
      } else {
        alert("Please install metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPrice = async () => {
    try {
      // const provider = new ethers.providers.Web3Provider(wallet.ethereum);
      const provider = new ethers.providers.JsonRpcProvider(
        "https://goerli.infura.io/v3/ca11249dabe247c1a6e0877c24376dda"
      );
      const ToonContract = new ethers.Contract(
        contractABI.presale.address,
        contractABI.presale.abi,
        provider
      );
      let price = (await ToonContract.getPrice()) / 1000000;
      console.log(price);
      setTFTPrice(price);
    } catch (err) {
      console.log(err);
    }
  };

  const buy_button =
    wallet.status == "connected" ? "Buy Token" : "Connect Wallet";

  const handleChange = (e: any) => {
    setFTMamount(e.target.value);
  };

  const Buy = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(wallet.ethereum);
      const signer = provider.getSigner();
      const ToonContract = new ethers.Contract(
        contractABI.presale.address,
        contractABI.presale.abi,
        signer
      );
      // const signedToonContract = ToonContract.connect(signer);
      let tx = await ToonContract.buy({
        value: ethers.utils.parseUnits(FTMamount.toString(), 18),
      });
      console.log(tx);
    } catch (err) {
      console.log(err);
    }
  };

  const address = wallet.account
    ? wallet.account.slice(0, 4) + "..." + wallet.account.slice(-4)
    : "Connect Wallet";
  const connectWallet = () => {
    setIsConnected(!isConnected);
  };
  return (
    <div className="container mx-auto relative">
      <div className="container mx-auto p-4 flex flex-wrap items-center justify-between xl:gap-5 gap-2">
        <a
          href="https://toon.finance"
          className="flex items-center gap-3 w-auto xl:w-96"
        >
          <Image
            src={"/assets/images/logo.png"}
            alt="logo"
            width={300}
            height={20}
            className="xl:h-12 h-8"
          />
        </a>
        <div className="flex flex-center justify-end w-auto xl:w-96">
          <button
            onClick={connectWallet}
            type="button"
            className="text-[white] font-bold text-black-800 dark:text-black-600 bg-blue-700 hover:bg-blue-400 p-2  mx-2 rounded-xl"
          >
            {address}
          </button>
          <a
            href="https://t.me/ToonSwapFinance"
            target="_blank"
            rel="noreferrer"
            className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold p-2 rounded-xl flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
          >
            <Image
              src={"/assets/images/telegram.svg"}
              alt="telegram"
              width={20}
              height={20}
              className="h-5 text-white mx-2"
            />
            <span className="lg:block hidden">Presale Support</span>
          </a>
        </div>
      </div>
      <div className="h-[18px]"></div>
      <div className="container mx-auto py-6 px-4">
        <form className="w-[512px] grid gap-y-2 bg-[#000000] rounded-2xl py-4 px-6 shadow-2xl mx-auto text-white">
          <h2 className="mb-1 text-center font-extrabold text-4xl">
            {" "}
            Join $TFT Presale{" "}
          </h2>
          <div className="text-center font-bold mb-1">
            {" "}
            Toon Finance Presale Stage 2{" "}
          </div>
          <div className="text-center font-bold mb-1"></div>
          <p className="mb-3 text-center font-xl text-2x1"></p>
          <div className="relative grid grid-cols-[minmax(min-content,100px),minmax(auto,1fr)] gap-x-4">
            <button className="flex flex-wrap items-center gap-x-2">
              <p className="flex flex-wrap items-center gap-x-2">
                <Image
                  src={"/assets/images/eth.png"}
                  alt="Ethereum logo"
                  width="40"
                  height="40"
                  className="object-scale-down bg-white rounded-full w-7 h-7 p-1"
                  loading="lazy"
                />
                ETH
              </p>
            </button>
            <input
              type="text"
              placeholder="0.0"
              className="outline-none bg-transparent text-2xl leading-1 py-4"
              value={FTMamount}
              onChange={(e) => handleChange(e)}
            />
            <span></span>
            <div className="justify-end items-end w-full flex gap-1 mb-2">
              <button
                type="button"
                className="font-bold text-black-800 dark:text-black-600 bg-blue-700 hover:bg-blue-400 px-2"
              ></button>
            </div>
          </div>
          <div className="flex w-full items-center">
            <span className="flex-auto bg-orange-200 h-px"></span>
          </div>
          <div className="relative grid grid-cols-[minmax(max-content,100px),minmax(auto,1fr)] gap-4">
            <div className="flex flex-wrap items-center gap-x-2">
              <Image
                src={"/assets/images/Token.png"}
                alt="TFT logo"
                width="40"
                height="40"
                className="bg-white rounded-full w-7 h-7"
                loading="lazy"
              />
              TFT
            </div>
            <input
              type="text"
              placeholder="0.0"
              value={TFTamount}
              readOnly
              className="outline-none bg-transparent text-2xl leading-1 py-4 w-full"
            />
          </div>
          <button
            onClick={wallet.status == "connected" ? Buy : connectWallet}
            type="button"
            className="rounded-full text-black-800 dark:text-black-600 bg-blue-700 hover:bg-blue-400 w-full p-4 font-bold rounded-4xl"
            // className="text-[white] font-bold text-black-800 dark:text-black-600 bg-blue-700 hover:bg-blue-400 p-2  mx-2 rounded-xl"
          >
            {buy_button}
          </button>
        </form>
        <div className="grid gap-y-4 w-lg max-w-full py-10 px-6 mx-auto">
          <button
            className="text-black hover:underline font-bold"
            onClick={importTokentoMetamask}
          >
            Import TFT Token to Metamask
          </button>
        </div>
      </div>
      {isConnected ? (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="relative p-4 w-full max-w-md h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-toggle="crypto-modal"
                onClick={() => setIsConnected(false)}
              >
                <Image
                  src={"/assets/images/cross.svg"}
                  width={30}
                  height={30}
                  alt=""
                />
                <span className="sr-only">Close modal</span>
              </button>
              <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
                <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                  Connect wallet
                </h3>
              </div>
              <div className="p-6">
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Connect with one of our available wallet providers or create a
                  new one.
                </p>
                <ul className="my-4 space-y-3">
                  <li>
                    <span
                      className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                      onClick={() => wallet.connect("injected")}
                    >
                      <Image
                        src={"/assets/images/metamask.svg"}
                        width={40}
                        height={40}
                        alt=""
                      />

                      <span className="flex-1 ml-3 whitespace-nowrap text-lg pl-2">
                        MetaMask
                      </span>
                      <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-sm font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                        Popular
                      </span>
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => wallet.connect("walletlink")}
                      className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                    >
                      <Image
                        src={"/assets/images/coinbase.svg"}
                        width={40}
                        height={40}
                        alt=""
                      />
                      <span className="flex-1 ml-3 whitespace-nowrap text-lg pl-2">
                        Coinbase Wallet
                      </span>
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => wallet.connect("walletconnect")}
                      className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                    >
                      <Image
                        src={"/assets/images/wallet-connect.svg"}
                        width={40}
                        height={40}
                        alt=""
                      />
                      <span className="flex-1 ml-3 whitespace-nowrap text-lg pl-2">
                        WalletConnect
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
