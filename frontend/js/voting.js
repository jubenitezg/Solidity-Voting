let web3;
let contractABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timeStart",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_timeEnd",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "_candidates",
        type: "string[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getCandidates",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTimeEnd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTimeStart",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "candidate",
        type: "string",
      },
    ],
    name: "getVoteCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWinner",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "candidate",
        type: "string",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
let contractAddress = "0xC161c71eCaE3416AB3B9B4Fcfb5890DA3bDE5EBe";
let contract;

async function loadWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  } else {
    alert("No Ethereum provider found!");
  }
}

async function checkTime() {
  const timeStart = new Date(document.getElementById("timeStart").innerHTML);
  const timeEnd = new Date(document.getElementById("timeEnd").innerHTML);
  const now = new Date();
  if (now < timeStart) {
    document.getElementById("status").innerHTML = "Voting has not started yet.";
  } else if (now > timeEnd) {
    document.getElementById("status").innerHTML = "Voting has ended.";
    await loadWinner();
  } else {
    document.getElementById("status").innerHTML = "Voting is in progress.";
  }
}

async function load() {
  await loadWeb3();
  contract = new web3.eth.Contract(contractABI, contractAddress);
  console.log(contract);
  await loadCandidates();
  await loadTimes();
  await checkTime();
  setInterval(checkTime, 60000);
}

async function loadWinner() {
  const winner = await contract.methods.getWinner().call();
  document.getElementById("winner").innerHTML = `${winner}!`;
}

async function loadCandidates() {
  const candidates = await contract.methods.getCandidates().call();
  const candidatesSelectEl = document.getElementById("candidates");
  candidatesSelectEl.innerHTML = "";
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const optionEl = document.createElement("option");
    optionEl.textContent = candidate;
    optionEl.value = candidate;
    candidatesSelectEl.appendChild(optionEl);
  }
  document.getElementById("status").innerHTML = "Ready";
}

async function loadTimes() {
  const timeStart = await contract.methods.getTimeStart().call();
  const timeEnd = await contract.methods.getTimeEnd().call();
  document.getElementById("timeStart").innerHTML = new Date(timeStart * 1000);
  document.getElementById("timeEnd").innerHTML = new Date(timeEnd * 1000);
}

async function vote() {
  const candidate = document.getElementById("candidates").value;
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  try {
    await contract.methods.vote(candidate).send({ from: account });
    alert("Voted successfully!");
  } catch (error) {
    const reason = await getRevertReason(error.toString());
    alert("The following error occurred: " + reason);
  }
}

// Adapted from https://ethereum.stackexchange.com/questions/84545/how-to-get-reason-revert-using-web3-eth-call
// https://ethereum.stackexchange.com/questions/117484/how-do-you-parse-json-rpc-errors-on-frontend
async function getRevertReason(error) {
  const errOb = JSON.parse(error.substr(error.indexOf("{")));
  const tx = await web3.eth.getTransaction(errOb.transactionHash);
  try {
    await web3.eth.call(tx, tx.blockNumber);
  } catch (err) {
    let errObj = err.toString();
    if (errObj.indexOf("Internal JSON-RPC error.") > -1) {
      errObj = errObj
        .replace("\n", "")
        .replace("Error: ", "")
        .replace("Internal JSON-RPC error.", "");
      errObj = JSON.parse(errObj);
      return errObj.message;
    }
  }
}

load();
