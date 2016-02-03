Linguadesk.WordList = function (settings) {
    this.dom = settings.dom;
    this.items = settings.items || [];
    this.view = null;
    this.init();
};

Linguadesk.WordList.prototype.init = function () {
    var newWordInput = $("<input>", {
            class: "newwordinput",
            type: "text",
            placeholder: "new word"
        }),
        newWordButton = $("<input>", {
            class: "addword",
            type: "button",
            value: "add word"
        });
    
    this.view = $("<div>", { class: "words" });
    this.view
        .append($("<div>", { class: "newword" })
            .append(newWordButton)
            .append($("<div>", { class: "newwordcontainer" })
                .append(newWordInput)));
    newWordButton.click(function(){
        var newWord = newWordInput.val();
        if (newWord) {
            this.addWord(newWord, function(err, word) {
                if (!err) {
                    this.view.append(word.getView());
                }
            }.bind(this));
        }
    }.bind(this));
    this.loadWordList(function() {
        for (var i = 0; i < this.items.length; i++) {
            this.view.append(this.items[i].getView());
        }
    }.bind(this));
    
    if (this.dom) {
        this.dom.append(this.view);
    }
};

Linguadesk.WordList.prototype.getView = function () {
    return this.view;
};

Linguadesk.WordList.prototype.loadWordList = function (cb) {
    Linguadesk.API.Words.getAll(function(err, data) {
        if (!err) {
            for (var i = 0; i < data.words.length; i++) {
                this.items.push(new Linguadesk.Word(data.words[i]));
            }
            if (cb) {
                cb(null, data);
            }
        } else if (cb) {
            cb(err, null)
        }
    }.bind(this));
};

Linguadesk.WordList.prototype.addWord = function (word, cb) {
    Linguadesk.API.Words.add(word, function(err, data) {
        if (!err) {
            var newWord = new Linguadesk.Word(answer);
            this.items.push(newWord);
            if (cb) {
                cb(null, newWord);
            }
        } else if (cb) {
            cb(err, null);
        }
    });
}