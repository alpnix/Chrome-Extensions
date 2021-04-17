const boxes = document.querySelector(".boxes");

// array remove function
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


chrome.storage.sync.get(["wordsData"], function(result) {
    if (!result.wordsData) {
        console.log("no result");
        return;
    }

    console.log(result.wordsData);

    result.wordsData.forEach(wordData => {
        console.log(wordData);
        let newBox = getNewBox(wordData);

        boxes.appendChild(newBox);
    });
})

// helper functions

function getNewBox(data) {

    let newBox = document.createElement("div");
    newBox.classList.add("box");

    newBox.innerHTML = `
        <div class="date subtitle">${data.date}</div>
        <div class="word-info">
            <div class="word">${data.word}</div>
            <div class="form subtitle">${data.form}</div>
        </div>
        <div class="def">${data.definition}</div>`

    return newBox;
}