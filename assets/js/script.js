document.addEventListener("DOMContentLoaded", init)

let NUM = 0
let backgroundNum = 0
function init() {
    ifSafari()
    calculate()

    if(window.screen.width > 500){
        backgroundMove()
        gradient_c();
    }
    
}

function ifSafari(){
    let check = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })
    (!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    if (check){
        document.querySelector('h1').style.fontSize = "1.9rem"
    }
}

function calculate() {
    // bv 41 is totaal rarity die layer 
    let maxValues = [41, 15, 7, 20]
    let actualValues = [3, 5, 2, 5]
    let max;
    let actual;
    max = maxValues.reduce((a, b) => a + b, 0)
    actual = actualValues.reduce((a, b) => a + b, 0)
    console.log("Maximum: " + max);
    console.log("Actual: " + actual)
    console.log("The rarity is: " + Math.round((actual / max) * 100))
    console.log("Rarity of Jam: " + Math.round((actualValues[0] / maxValues[0]) * 100))
    console.log("Rarity of Mold: " + Math.round((actualValues[1] / maxValues[1]) * 100))

}

function gradient_c() {
    let refresh = 10; // Refresh rate in milli seconds
    mytime = setTimeout('gradient_ct()', refresh)
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
    time = setTimeout('backgroundMover()', refresh)
}
function backgroundMover() {
    backgroundNum += 0.02
    //console.log(backgroundNum)
    document.querySelector("body").style.backgroundPosition = backgroundNum + "rem 0"
    backgroundMove();
}