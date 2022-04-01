'use strict'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
document.addEventListener("DOMContentLoaded", init)

async function init() {
    await loadImages();
}

function padHex(num){
    return num.toString(16).padStart(64, 0);
}

async function loadImages(){
    for(let i = 1;i<101;i++){
        document.querySelector("main").innerHTML += `<img src="https://ipfs.io/ipfs/QmZXrFU6w4uY2hwu2T7hcqZDaPQ6QqmT6uUhKCKJcaF4aG/${padHex(i)}.png" alt="nft">`;
    }
}