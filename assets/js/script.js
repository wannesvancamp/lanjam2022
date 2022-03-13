document.addEventListener("DOMContentLoaded", init)

function init() {
    calculate()
}

function calculate() {
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

function calculateRarityJam() {
    let maximum = 41
    let now = 3
}