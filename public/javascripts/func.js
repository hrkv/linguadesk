document.querySelector("#addword").addEventListener("click", function() {
    var newWordInput = document.querySelector("#newword"),
        newWord =  newWordInput && newWordInput.value;
        
    if (newWord) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/boards/addword', true)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.onreadystatechange = function() {
            if (this.readyState !== 4) {
                return;
            }
            
            var answer = JSON.parse(this.responseText),
                wordsContainer = window.document.querySelector(".words"),
                wordContainer = document.createElement("div");
            
            if (!answer.error) {
                wordContainer.className = "word";
                wordContainer.textContent = newWord;
                wordsContainer.appendChild(wordContainer);
            }
        };
        xhr.send('newword=' + encodeURIComponent(newWord));
    }
});