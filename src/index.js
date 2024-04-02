import "./style.css";
import { ethers, parseEther } from "./ethers.min.js";

// import { checkNetwork, switchNetwork } from "../helper/EthereumRequests.js";
import {
  marketplaceContractAddress,
  marketplaceAbi,
} from "../contracts/constants.js";

let connected = false;
console.log(connected);

const connect = document.getElementById("connect");
// const submit = document.getElementsByClassName("submit");
const balance = document.getElementById("balance");
const listCar = document.getElementById("listCar");
const buttonsContainer = document.getElementById("buttonsContainer");
const modalContainer = document.getElementById("modal-container");
const balanceContainer = document.querySelector(".balance-container");
const notification = document.getElementById("notification");

// const cancelButton = document.getElementsByClassName(".cancel")

const name = document.getElementById("name");
const model = document.getElementById("model");
const year = document.getElementById("year");
const image = document.getElementById("image");
const location = document.getElementById("location");
const price = document.getElementById("price");
const details = document.getElementById("details");

const targetChainId = "0xaa36a7";

document.querySelector(".cancel").addEventListener("click", () => {
  modalContainer.classList.add("hidden");
});

document.getElementById("cancelNotif").addEventListener("click", () => {
  notification.classList.add("hidden");
});

// document.querySelector

listCar.addEventListener("click", () => {
  modalContainer.classList.remove("hidden");
  modalContainer.classList.add("flex");
});

name.addEventListener("click", () => {
  name.classList.remove("bg-[#e4e4e4]");
  name.classList.add("border");
  name.classList.add("border-solid");
  name.classList.add("border-blue-500");
});

model.addEventListener("click", () => {
  model.classList.remove("bg-[#e4e4e4]");
  model.classList.add("border");
  model.classList.add("border-solid");
  model.classList.add("border-blue-500");
});

year.addEventListener("click", () => {
  year.classList.remove("bg-[#e4e4e4]");
  year.classList.add("border");
  year.classList.add("border-solid");
  year.classList.add("border-blue-500");
});

image.addEventListener("click", () => {
  image.classList.remove("bg-[#e4e4e4]");
  image.classList.add("border");
  image.classList.add("border-solid");
  image.classList.add("border-blue-500");
});

location.addEventListener("click", () => {
  location.classList.remove("bg-[#e4e4e4]");
  location.classList.add("border");
  location.classList.add("border-solid");
  location.classList.add("border-blue-500");
});

price.addEventListener("click", () => {
  price.classList.remove("bg-[#e4e4e4]");
  price.classList.add("border");
  price.classList.add("border-solid");
  price.classList.add("border-blue-500");
});

details.addEventListener("click", () => {
  details.classList.remove("bg-[#e4e4e4]");
  details.classList.add("border");
  details.classList.add("border-solid");
  details.classList.add("border-blue-500");
});

connect.addEventListener("click", async () => {
  console.log("Clicked");

  if (typeof window.ethereum !== "undefined") {
    try {
      const wallets = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const connectedWallet = wallets[0];
      connected = true;

      const isTargetChainId = await checkNetwork(targetChainId);
      if (isTargetChainId === false) await switchNetwork(targetChainId);

      buttonsContainer.classList.add("w-[16rem]");
      connect.classList.add("hidden");
      await getWalletBalance(connectedWallet);
      listCar.classList.remove("hidden");
      const products = await getCars();
      renderNewCar(products);
    } catch (error) {
      console.log(error);
    }
  } else {
    connect.innerHTML = "Install the Metamask Extension Wallet";
  }
});

// const submitNewCar = () => {
document.getElementById("submit").addEventListener("click", async (e) => {
  e.preventDefault();
  modalContainer.classList.add("hidden");
  const carMake = name.value.trim();
  const carModel = model.value.trim();
  const _year = year.value.trim();
  const imageUrl = image.value.trim();
  const carPrice = price.value.trim();
  const carDetails = details.value.trim();

  console.log(carMake, carModel, _year, imageUrl, carDetails, carPrice);

  const contract = await getContract(
    marketplaceContractAddress,
    marketplaceAbi
  );

  try {
    showNotification(`Listing ${carMake + " " + carModel + " " + _year}...`);
    const transactionResponse = await contract.listCar(
      carMake,
      carModel,
      imageUrl,
      _year,
      ethers.parseEther(carPrice),
      carDetails
    );
    await listenForTransactionMine(
      transactionResponse,
      new ethers.BrowserProvider(window.ethereum)
    );
    const products = await contract.getAllListedCars();
    renderNewCar(products);
  } catch (error) {
    console.log(error);
    notification.classList.remove("bg-yellow-400");
    notification.classList.add("bg-red-400");
    notification.innerHTML = "Transaction Failed";
  }
});
// };

document.getElementById("marketplace").addEventListener("click", async (e) => {
  if (e.target.className.includes("buyBtn")) {
    const contract = await getContract(
      marketplaceContractAddress,
      marketplaceAbi
    );
    console.log("calling buy");
    console.log(e.target.name)
    try {
      showNotification(`Buying...`);
      const transactionResponse = await contract.buyCar({value: e.target.name, carId: e.target.id});
      await listenForTransactionMine(
        transactionResponse,
        new ethers.BrowserProvider(window.ethereum)
      );
      const products = await contract.getAllListedCars();
      renderNewCar(products);
    } catch (error) {
      console.log(error);
      notification.classList.remove("bg-yellow-400");
      notification.classList.add("bg-red-400");
      notification.innerHTML = "Transaction Failed";
    }
  }
});

const checkNetwork = async (targetChainId) => {
  try {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (currentChainId === targetChainId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const switchNetwork = async (targetChainId) => {
  console.log("switch");
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: targetChainId }],
  });

  // refresh webpage
  window.location.reload();
};

const getWalletBalance = async (address) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const unFormattedBalance = await provider.getBalance(address);
  balance.classList.remove("hidden");
  balanceContainer.classList.add("flex");
  balanceContainer.classList.add("justify-center");
  balanceContainer.classList.add("items-center");
  balance.innerHTML = `Balance: ${Number(
    ethers.formatEther(unFormattedBalance)
  ).toFixed(2)} eth`;
};

const renderNewCar = (products) => {
  document.getElementById("marketplace").innerHTML = "";
  products.forEach((product) => {
    const [
      carId,
      make,
      model,
      imageUrl,
      year,
      seller,
      price,
      description,
      isSold,
    ] = product;
    const newDiv = document.createElement("div");
    newDiv.className = `border border-solid border-[#d1d1d1] rounded-b-lg ${ethers.formatEther(
      carId
    )}`;
    newDiv.innerHTML = productTemplate(
      carId,
      make,
      model,
      imageUrl,
      year,
      seller,
      price,
      description,
      isSold
    );
    document.getElementById("marketplace").appendChild(newDiv);
  });
};

const productTemplate = (
  id,
  make,
  model,
  imageUrl,
  year,
  seller,
  price,
  description,
  isSold
) => {
  if (isSold) {
    return `
    <div class="relative w-full">
    <image
      src=${imageUrl}
      alt=""
      layout="responsive"
      width="{300}"
      height="{300}"
    />
  </div>
  <div class="p-5 text-dccm-black">
    <div class="border-b border-solid border-b-[#d9d9d9] pb-4">
      <div class="flex justify-between">
        <p class="font-medium text-[1.25rem]">${make} ${model} ${year}</p>
        <div class="w-[4.8125rem]">
          <p>Sold</p>
        </div>
      </div>
      <div class="mt-2">
        <p class="text-[1.25rem] font-bold">${ethers.formatEther(price)} Eth</p>
      </div>
    </div>
    <div class="mt-3">
      ${description}
    </div>
    `;
  } else {
    const carName = make + " " + model + " " + year
    return `
    <div class="relative w-full">
    <image
      src=${imageUrl}
      alt=""
      layout="responsive"
      width="{300}"
      height="{300}"
    />
  </div>
  <div class="p-5 text-dccm-black">
    <div class="border-b border-solid border-b-[#d9d9d9] pb-4">
      <div class="flex justify-between">
        <p class="font-medium text-[1.25rem]">${make} ${model} ${year}</p>
        <div class="w-[4.8125rem]">
          <button
            class="border border-solid border-[#d1d1d1] w-full py-[0.1875rem] text-sm font-medium rounded-sm hover:bg-green-400 hover:text-white hover:border-0 buyBtn" id=${ethers.formatEther(
              id
            )} prices=${ethers.formatEther(price)} name=${ethers.formatEther(price)}
          >
            Buy
          </button>
        </div>
      </div>
      <div class="mt-2">
        <p class="text-[1.25rem] font-bold">${ethers.formatEther(price)} Eth</p>
      </div>
    </div>
    <div class="mt-3">
      ${description}
    </div>
    `;
  }
};

function listenForTransactionMine(transactionResponse, provider) {
  notification.innerHTML = `Mining ${transactionResponse.hash}...`;

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      notification.innerHTML = "Transaction completed";
      resolve();
    });
  });
}

const getCars = async () => {
  const contract = await getContract(
    marketplaceContractAddress,
    marketplaceAbi
  );
  const products = await contract.getAllListedCars();
  return products;
};

const getContract = async (contractAddress, contractAbi) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    return contract;
  } catch (error) {
    console.log(error);
  }
};

const showNotification = (notificationText) => {
  notification.classList.add("bg-yellow-400");
  notification.classList.add("flex");
  notification.classList.remove("hidden");
  notification.innerHTML = notificationText;
};
