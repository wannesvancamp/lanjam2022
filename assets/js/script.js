'use strict'

document.addEventListener("DOMContentLoaded", init)

let NUM = 0
let backgroundNum = 0


function init() {
    backgroundMove()

    if (!document.URL.includes("collection.html")){
        gradient_ct()
    }
}

function gradient_c() {
    let refresh = 10; // Refresh rate in milli seconds
    let mytime = setTimeout('gradient_ct()', refresh)
}

function gradient_ct() {
    if (NUM < 360) {
        NUM++;
    } else {
        NUM = 0
    }

    document.querySelector("input[type='submit']").style.background = "linear-gradient(" + NUM + "deg, #eec0c6 0%, #7ee8fa 100%)"
    gradient_c();
}

function backgroundMove() {
    let refresh = 50
    let time = setTimeout('backgroundMover()', refresh)
}

function backgroundMover() {
    backgroundNum += 0.02
    document.querySelector("body").style.backgroundPosition = backgroundNum + "rem 0"
    backgroundMove();
}