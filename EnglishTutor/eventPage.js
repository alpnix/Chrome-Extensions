// context menu options
var contextMenuItem = {
    "id": "getWord",
    "title": "getWord",
    "contexts": ["selection"]
};
// making the context menu appear on right click
chrome.contextMenus.create(contextMenuItem);
console.log("context menu created");

// initializing words list
var wordsData = [];

// adding an event listener for right click
chrome.contextMenus.onClicked.addListener(function(clickedData) {
    if (clickedData.menuItemId == "getWord" && clickedData.selectionText) {
        let word = getSearchableWord(clickedData.selectionText);
        let wordData = getData(word);
        console.log(wordData);

        if (wordData) {
            wordsData.push(wordData);
        } else {
            chrome.storage.sync.set({"wordsData": "hello world"}, () => {console.log("wordData is empty")})
        }

        chrome.storage.sync.set({"wordsData": wordsData}, function() {
            let notifOptions = {
                type: "basic",
                iconUrl: "../icons/logo.png",
                title: "More Than 10 Words",
                message: `By searching for ${clickedData.selectionText} you have learned more than 10 words`,
            }
            if (wordsData.length >= 10) {
                chrome.notifications.create("textNotif",notifOptions);
            }
        })
    }
})

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
    
    wordData.then(res => {
        if (!res) {
            return false;
        }
        let data = {
            date: new Date().toLocaleDateString(),
            word: res[0].word,
            form: res[0].meanings[0].partOfSpeech,
            definition: res[0].meanings[0].definitions[0].definition
        }
        return data;
    })
}

function getSearchableWord(text) {
    let searchable = text.trim();
    searchable = searchable.replace(" ", "-");

    return searchable;
}

