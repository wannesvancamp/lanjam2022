'use strict'

let contract;
let contractAddress = "0x7e4ed84efa925af6B1357187447748A1BE837eCa";
let ipfsAddress;
let rarities = {};

window.addEventListener('load', async(event) => {
    await loadWeb3();
    setupFormEvents();
    console.log('The page has fully loaded ^ㅂ^')
    document.querySelector("#EWTGetter").addEventListener("click", function(){getEWT()})
});

function tempFunction(data) {
    const perLayer = {
        "ultraRare": 1,
        "rare": 2,
        "uncommon": 3,
        "common": 5
    }
    const totalRarities = {
        "bread": 15,
        "mold": 7,
        "jam": 20,
        "background": 41
    }
    Object.keys(data.properties.rarity).forEach(element => {
        rarities[element] = (perLayer[data.properties.rarity[element]] / totalRarities[element] * 100)
    });
}



async function retrieveTransferEvents() {

    let succesArr = await contract.getPastEvents('TransferSingle', { fromBlock: 0, toBlock: 'latest' });

    succesArr.forEach(entries => {
        if (entries.returnValues.to == web3.eth.defaultAccount) {
            let tempId = (entries.returnValues.id);
            let ipfsLink = ipfsAddress.replace("{id}", leftFillNum(tempId));
            console.log(ipfsLink);
            sessionStorage.setItem("ipfsAddress", ipfsLink)
            fetch(ipfsLink)
                .then((res) => res.json())
                .then((data) => {
                    let output = "";
                    tempFunction(data);
                    document.querySelector("aside").style.display = "block"
                    output =
                        `
                    <img src=${data.image.replace("ipfs://", "https://ipfs.io/ipfs/")}>
                    <p>${data.name}</p>
                    <div class="container">
                        <div>
                            <span>${Object.keys(data.properties)[3]}</span>
                            <span>${(data.properties.jam).split("_")[0]}</span>
                            <span>${(data.properties.rarity.jam)}</span>
                            <span>${Math.round(rarities["jam"])}%</span>
                        </div>
                        <div>
                            <span>${Object.keys(data.properties)[2]}</span>
                            <span>${(data.properties.mold)}</span>
                            <span>${(data.properties.rarity.mold)}</span>
                            <span>${Math.round(rarities["mold"])}%</span>
                        </div>
                        <div>
                            <span>${Object.keys(data.properties)[1]}</span>
                            <span>${(data.properties.bread).split("_")[0]}</span>
                            <span>${(data.properties.rarity.bread)}</span>
                            <span>${Math.round(rarities["bread"])}%</span>
                        </div>
                        <div>
                            <span>${Object.keys(data.properties)[0]}</span>
                            <span>${(data.properties.background).split("_")[1]}</span>
                            <span>${(data.properties.rarity.background)}</span>
                            <span>${Math.round(rarities["background"])}%</span>
                            </div>
                    </div>
                    `

                    document.querySelector('aside').innerHTML = output;

                }).catch(function(err) {
                    console.log(err);
                });
        }
    });
}

async function loadContract() {
    let abi = [{
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": true,
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]"
                },
                {
                    "indexed": false,
                    "internalType": "uint256[]",
                    "name": "values",
                    "type": "uint256[]"
                }
            ],
            "name": "TransferBatch",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "TransferSingle",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": false,
                    "internalType": "string",
                    "name": "value",
                    "type": "string"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "URI",
            "type": "event"
        },
        {
            "inputs": [{
                "internalType": "bytes32[]",
                "name": "hashes",
                "type": "bytes32[]"
            }],
            "name": "addClaimableCodeHashes",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "balanceOf",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "address[]",
                    "name": "accounts",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]"
                }
            ],
            "name": "balanceOfBatch",
            "outputs": [{
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "string",
                "name": "code",
                "type": "string"
            }],
            "name": "mint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "nextId",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256[]",
                    "name": "ids",
                    "type": "uint256[]"
                },
                {
                    "internalType": "uint256[]",
                    "name": "amounts",
                    "type": "uint256[]"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeBatchTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }],
            "name": "supportsInterface",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "name": "uri",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }],
            "name": "vouchers",
            "outputs": [{
                    "internalType": "bool",
                    "name": "exists",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "claimed",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    contract = new web3.eth.Contract(abi, contractAddress);
    console.log(contract.methods);

    ipfsAddress = (await contract.methods.uri(0).call()).replace("ipfs://", "https://ipfs.io/ipfs/");

    retrieveTransferEvents();
}

function display(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i].returnValues.id);
    }
}

async function loadWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        document.querySelector("#steps").innerHTML = `<li style="color:red">You do not have MetaMask, please add MetaMask <a href="https://metamask.io/download/" target="_new">Here</a></li>` + document.querySelector("#steps").innerHTML;
        return;
    }

    let accounts = await web3.eth.getAccounts();
    web3.eth.defaultAccount = accounts[0];
    console.log(`Your account is ${web3.eth.defaultAccount}`);
    let acc = web3.eth.defaultAccount;

    document.getElementById("metaMaskId").innerHTML = `${acc}`;

    await addEnergyWebNetwork();

    await loadContract();
}

function setupFormEvents() {
    document.getElementById("claimForm").addEventListener('submit', function(e) {
        e.preventDefault();
        let claim = document.getElementById("mint").value;
        console.log(claim);

        clientMint(claim);
    });
}

function leftFillNum(num) {
    return num.toString(16).padStart(64, 0);
}

function clientMint(code) {
    contract.methods.mint(code)
        .send({ from: web3.eth.defaultAccount })
        .then(succes => console.log(succes))
        .catch(e => console.log(e));

}

async function addEnergyWebNetwork() {
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xf6' }],
        });
    } catch (error) {
        if (error.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0xf6',
                        chainName: "EWC",
                        nativeCurrency: {
                            name: "EWT",
                            symbol: "EWT",
                            decimals: 18,
                        },
                        rpcUrls: ["https://rpc.energyweb.org"],
                        blockExplorerUrls: ["https://explorer.energyweb.org/"],
                        iconUrls: [""],

                    }],
                });
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xf6' }],
                });
            } catch (addError) {
                console.log('Did not add network');
            }
        }
    }
}

async function addVoltaNetwork() {
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x12047' }], // 73799

        });
    } catch (error) {
        if (error.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x12047',
                        chainName: "VOLTA",
                        nativeCurrency: {
                            name: "VT",
                            symbol: "VT",
                            decimals: 18,
                        },
                        rpcUrls: ["https://volta-rpc.energyweb.org"],
                        blockExplorerUrls: ["https://volta-explorer.energyweb.org/"],
                        iconUrls: [""],

                    }],
                });
            } catch (addError) {
                console.log('Did not add network');
            }
        }
    }
}

function output(array) {
    for (let i = 0; array.length; i++) {
        document.getElementById("output").innerHTML += `<p>` + array[i] + `</p> <br>`;
    }
}


function showShortedAddr(account) {
    let longAddr = account;
    let firstStr = longAddr.substring(0, 5);
    let middleStr = "...";
    let lastStr = longAddr.substring(37, 42);
    return firstStr.concat(middleStr, lastStr)
}


async function removeMintingAbility() {

    let succesArr = await contract.getPastEvents('TransferSingle', { fromBlock: 0, toBlock: 'latest' });
    succesArr.forEach(entries => {
        if (entries.returnValues.to == web3.eth.defaultAccount) {
            document.getElementById("contentMint").style.display = "none";
        }

    })

}

function getEWT() {
    let getEWTDiv = document.getElementById("EWTMessage");
    
     getEWTDiv.innerHTML = `Getting EWT for ${web3.eth.defaultAccount}`;
     fetch(`http://167.99.222.120:3000/faucet/${web3.eth.defaultAccount}`)
    .then((res) => res.json())
    .then(res => {
    console.log("Request complete! response:", res);
    setTimeout(function(){
        getEWTDiv.innerHTML = `EWT is on its way: <a href="https://explorer.energyweb.org/tx/${res.transaction}" target="_blank">Check status here</a>`;
    }, 2000)
    });
    setTimeout(function(){
        getEWTDiv.innerHTML = ""
    }, 20000)

    }
