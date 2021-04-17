var colorInput = document.querySelector("#fontColor")
var btnChange = document.querySelector("#buttonChange")
var inputs = document.querySelectorAll("input")

var color = colorInput.value;

function changeInputColors(inputs, newColor) {
    for (const input of inputs) {
        input.style.color = newColor
    }
}
function changeInputBackgrounds(inputs,color) {
    for (const input of inputs) {
        input.style.backgroundColor = color
    }    
}

changeInputColors(inputs,color,"black")
changeInputBackgrounds(inputs,color)

colorInput.addEventListener("change", function() {
    var color = this.value;
    let red = color[1]
    let green = color[3]
    let blue = color[5]
    if (red >= "8" && green >= "8" && blue >= "8") {
        changeInputColors(inputs,"black")
    }
    else {
        changeInputColors(inputs, "white")
    }
    changeInputBackgrounds(inputs,color)
})

btnChange.addEventListener("click", function() {
    var color = colorInput.value;
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {todo:"changeColor",clickedColor: color})
    })
    console.log(color)
})