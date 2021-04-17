// context menu options
var contextMenuItem = {
    "id": "Search Word",
    "title": "Search Word",
    "contexts": ["selection"]
};
// making the context menu appear on right click
chrome.contextMenus.create(contextMenuItem);
console.log("context menu created");

// initializing words list
var words = [];

// adding an event listener for right click
chrome.contextMenus.onClicked.addListener(function(clickedData) {
    if (clickedData.menuItemId == "Search Word" && clickedData.selectionText) {

        var inList = false;
        let word = getSearchableWord(clickedData.selectionText)
        let date = new Date().toLocaleDateString();

        for (const wordObj of words) {
            if (word == wordObj.word) {
                var inList = true;
            }
        }

        if (word && !inList) {
            words.push({
                word: word,
                date: date
            });
        } 

        chrome.storage.sync.set({"wordsData": words}, function() {
            let notifOptions = {
                type: "basic",
                iconUrl: "../icons/logo.png",
                title: "More Than 10 Words",
                message: `By searching for ${clickedData.selectionText} you have learned more than 10 words`,
            }
            if (words.length >= 10) {
                chrome.notifications.create("textNotif",notifOptions);
            }
        })
    }
})


function getSearchableWord(text) {
    let searchable = text.trim();
    searchable = searchable.replace(" ", "-");

    return searchable;
}

