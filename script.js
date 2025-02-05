const fromText = document.querySelector(".from-text"),
      toText = document.querySelector(".to-text"),
      exchangeIcon = document.querySelector(".exchange"),
      selectTag = document.querySelectorAll("select"),
      icons = document.querySelectorAll(".row i"),
      translateBtn = document.querySelector("button");

// Populate select dropdowns with languages
selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        let selected = "";
        if (id === 0 && country_code === "en-GB") {
            selected = "selected";
        } else if (id === 1 && country_code === "hi-IN") {
            selected = "selected";
        }
        const option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Exchange text and language selection
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempLang;
});

// Clear to-text when from-text is empty
fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});

// Translate button click event
translateBtn.addEventListener("click", () => {
    let text = fromText.value,
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            toText.value = data.responseData.translatedText;
        })
        .catch(err => {
            console.error("Error fetching translation:", err);
            toText.value = "Translation failed.";
        });
});

// Handle copy and speech synthesis
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("fa-copy")) {
            if (target.id === "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if (target.id === "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
