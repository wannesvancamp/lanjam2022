'use strict'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
document.addEventListener("DOMContentLoaded", init)

//let extraNumbers = "000000000000000000000000000000000000000000000000000000000000000"

async function init() {
    await loadImages();
}

function extraNumbers(num){
    let format = ".json";
    let paddedNum = num.toString().padStart(64, 0);
    let metadataJSON = paddedNum.concat(format);
    //console.log(metadataJSON);
    return metadataJSON;
}

function toHex(number){
  if (number < 0)
  {
    number = 0xFFFFFFFF + number + 1;
  }

  return number.toString(16);
}

async function loadImages(){
    console.log("got here")
    for(let i = 1;i<51;i++){
            await delay(11);
            fetch('https://gateway.pinata.cloud/ipfs/QmaZyDBgAsxjK51dU4eyY7LZYCah8qGRBxo6FjwhD3HBw8/jsons/' + extraNumbers(toHex(i)))
            .then((res) => res.json())
            .then((data) => {  
                let imgLink = "https://ipfs.io/ipfs/" + data.image.substr(7);
                //console.log(data.image);
                document.querySelector("main").innerHTML += `<img src="${imgLink}" alt="nft">`;
            })

    }
}