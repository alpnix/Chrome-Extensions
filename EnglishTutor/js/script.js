var boxes = document.querySelector(".boxes");

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

// if you want to restart the list
// chrome.storage.sync.set({"wordsData": []});


chrome.storage.sync.get(["wordsData"], function(result) {
    if (!result.wordsData) {
        console.log("no result");
        return;
    }

    result.wordsData.forEach(wordInfo => {

        let wordData = getData(wordInfo.word);
        wordData.then(res => {
            if (!res) {
                return false;
            }
    
            let data = {
                date: wordInfo.date,
                word: res[0].word,
                form: res[0].meanings[0].partOfSpeech,
                definition: res[0].meanings[0].definitions[0].definition
            }

            if (data) {
                let newBox = getNewBox(data);
                boxes.appendChild(newBox);
            }
            })
    });
})

// helper functions

function getNewBox(data) {

    let newBox = document.createElement("div");
    newBox.classList.add("box");
    let dictUrl = `https://dictionary.cambridge.org/dictionary/english/${data.word}`

    newBox.innerHTML = `
        <div class="date subtitle">${data.date}</div>
        <div class="word-info">
            <div class="word">${data.word}</div>
            <div class="form subtitle">${data.form}</div>
        </div>
        <div class="def">${data.definition}</div>
        <div class="buttons">
        <a href="${dictUrl}" class="btn more-info">More Info</a>
        <button data-word="${data.word}" class="btn delete">Delete</button>
        </div>`

    return newBox;
}

function getData(searchable) {
    var queryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en_US/${searchable}`

    const wordData = fetch(queryUrl)
    .then(res => {
        if (res.ok) {
            return res.json()
        } else {
            return false;
        }
    })

    .catch(error => console.log(error))

    return wordData;
    
}

// events 


setTimeout(() => {
    var deleteBtns = document.querySelectorAll("button.delete");

    console.log(deleteBtns);
    for (const btn of deleteBtns) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            e.target.parentElement.parentElement.style.display = "none";
            chrome.storage.sync.get("wordsData", function(wordsData) {
                let words = wordsData.wordsData;

                for (let i = 0; i < deleteBtns.length; i++) {
                    if (e.target = deleteBtns[i]) {
                        var index = i;
                    }
                }
                words = words.splice(index,1);
                chrome.storage.sync.set({"wordsData": words})
            })    
        });
    }
},1600)

