var Linguadesk = {};

Linguadesk.locale = "en";
Linguadesk.Resources = {
    en: {
        "edit": "edit",
        "delete": "delete",
        "addTranslate": "add translate"
    },
    ru: {
        "edit": "редактировать",
        "delete": "удалить",
        "addTranslate": "добавить перевод"
    }
}

Linguadesk.WordList = function (settings) {
    this.dom = settings.dom;
    this.items = settings.items || [];
    this.init();
};

Linguadesk.WordList.prototype.init = function () {
    this.loadWordList(function() {
        this.render();
    }.bind(this));
};

Linguadesk.WordList.prototype.render = function () {
    if (this.dom) {
        for (var i = 0; i < this.items.length; i++) {
            this.dom.appendChild(this.items[i].getDom());
        }
    }
};

Linguadesk.WordList.prototype.loadWordList = function (cb) {
    var xhr = new XMLHttpRequest(),
        wordList = this.items;
            
        xhr.open("POST", '/api/boards/words/getall', true)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.onreadystatechange = function() {
            if (this.readyState !== 4) {
                return;
            }
            
            var answer = JSON.parse(this.responseText);
            
            if (!answer.error) {
                for (var i = 0; i < answer.words.length; i++) {
                    var newWord = new Linguadesk.Word(answer.words[i]);
                    wordList.push(newWord);
                }
                
                cb && cb(null, newWord);
            } else {
                cb && cb(answer.error, null);
            }
        };
        xhr.send();
};

Linguadesk.WordList.prototype.addWord = function (word, cb) {
    if (word) {
        var xhr = new XMLHttpRequest(),
            wordList = this.items;
            
        xhr.open("POST", '/api/boards/words/addword', true)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.onreadystatechange = function() {
            if (this.readyState !== 4) {
                return;
            }
            
            var answer = JSON.parse(this.responseText);
            
            if (!answer.error) {
                var newWord = new Linguadesk.Word(answer);
                wordList.push(newWord);
                cb(null, newWord);
            } else {
                cb(answer.error, null);
            }
        };
        xhr.send('newword=' + word);
    }
}

Linguadesk.Word = function (settings) {
    this.id = settings.id;
    this.original = settings.original;
    this.translate = Array.isArray(settings.translate) ? settings.translate : [];
    this.dom = null;
    this.originalDom = null;
    this.translateDom = null;
    
    this._editing = false;
    
    this.init();
};

Linguadesk.Word.prototype.getDom = function () {
    return this.dom;    
};

Linguadesk.Word.prototype.init = function () {
    var self = this;
    
    this.dom = document.createElement("div");
    this.originalDom = document.createElement("div");
    this.translateDom = document.createElement("div");
    this.translateList = document.createElement("div");
    this.translateVariants = document.createElement("div");
    this.addTranslateButton = document.createElement("span");
    this.translateInput = document.createElement("input");
    
    this.dom.classList.add("word");
    this.translateList.classList.add("translateList");
    this.originalDom.classList.add("origin");
    this.translateDom.classList.add("translateContainer");
    this.translateDom.classList.add("hidden");
    this.translateVariants.classList.add("translateVariants");
    this.translateInput.classList.add("translateInput");
    this.translateInput.classList.add("hidden");
    
    this.originalDom.textContent = this.original || "";
    this.updateTranslateList();
    this.translateInput.setAttribute("type", "text");
    this.addTranslateButton.classList.add("actionButton");
    this.addTranslateButton.classList.add("active");
    this.addTranslateButton.textContent = Linguadesk.Resources[Linguadesk.locale].addTranslate;
    
    this.originalDom.addEventListener("click", this.onOriginClick.bind(this));
    this.addTranslateButton.addEventListener("click", this.onTranslateClick.bind(this));
    this.translateVariants.addEventListener("click", function(event) {
        var variant = this.querySelector(".translateVariant:hover"),
            text = variant && variant.querySelector(".text");
            
        if (text) {
            self.translateInput.value = text.textContent;
        }
    });
    
    var tab = document.createElement("table"),
        tr = document.createElement("tr"),
        tdInput = document.createElement("td"),
        tdButton = document.createElement("td");
    
    tab.classList.add("translateTable");
    tdInput.appendChild(this.translateInput);
    tdButton.appendChild(this.addTranslateButton);
    tr.appendChild(tdInput);
    tr.appendChild(tdButton);
    tab.appendChild(tr);
    
    this.dom.appendChild(this.originalDom);
    this.translateDom.appendChild(this.translateList);
    this.translateDom.appendChild(tab);
    this.translateDom.appendChild(this.translateVariants);
    this.dom.appendChild(this.translateDom);
};

Linguadesk.Word.prototype.updateTranslateList = function () {
    this.translateList.innerHTML = "";
    for (var i=0; i<this.translate.length; i++) {
        var translate = document.createElement("div"),
            translateText = document.createElement("span"),
            editButton = document.createElement("span"),
            deleteButton = document.createElement("span");
            
        editButton.textContent = Linguadesk.Resources[Linguadesk.locale].edit;
        editButton.setAttribute("action", "edit");
        editButton.classList.add("actionButton");
        editButton.classList.add("inline");
        deleteButton.textContent = Linguadesk.Resources[Linguadesk.locale].delete;
        deleteButton.setAttribute("action", "delete");
        deleteButton.classList.add("actionButton");
        deleteButton.classList.add("inline");
        
        translate.classList.add("translate");
        translateText.textContent = this.translate[i];
        translate.appendChild(translateText);
        translate.appendChild(editButton);
        translate.appendChild(deleteButton);
        this.translateList.appendChild(translate);
    }    
};

Linguadesk.Word.prototype.addTranslate = function (translate) {
    var self = this;
    
    if (translate) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/boards/words/addtranslate', true)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.onreadystatechange = function() {
            if (this.readyState !== 4) {
                return;
            }
            
            var answer = JSON.parse(this.responseText);
            if (!answer.error) {
                self.translate.push(translate);
                self.updateTranslateList();
            }
        };
        xhr.send('word=' + this.original + '&translate=' + translate);
    }
};

Linguadesk.Word.prototype.onOriginClick = function () {
    this.translateDom.classList.toggle("hidden");
    this._editing = false;
    this.translateInput.classList.add("hidden");
    this.addTranslateButton.classList.remove("inline");
    this.translateVariants.innerHTML = "";
};

Linguadesk.Word.prototype.getYandexTranslateResult = function (direction, word, callback) {
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://translate.yandex.net/api/v1.5/tr.json/translate?" +
             "key=trnsl.1.1.20151010T223725Z.301f9ec722fe077c.5d4d67f6289d41fea329923b2db57651c3dccfec" +
             "&text=" + word +
             "&lang=" + direction, true
    );
    xhr.onreadystatechange = function() {
            if (this.readyState !== 4) {
                return;
            }
            
            var result = JSON.parse(this.responseText);
            if (result && result.code == 200) {
                return callback(result.text);
            }
    };
    xhr.send();
}

Linguadesk.Word.prototype.onTranslateClick = function () {
    if (!this._editing) {
        this.getYandexTranslateResult("en-ru", this.original, function(result) {
            for (var i=0; i<result.length; i++) {
                if (this.translate.indexOf(result[i]) === -1) {
                    var translateVariant = document.createElement("span"),
                        word = document.createElement("span"),
                        info = document.createElement("span"),
                        link = document.createElement("a");
                        
                    translateVariant.classList.add("translateVariant");
                    word.classList.add("text");
                    word.textContent = result[i];
                    info.textContent = " переведено сервисом";
                    link.textContent = ' "Яндекс.Переводчик"';
                    link.setAttribute("href", "http://translate.yandex.ru/");
                    link.setAttribute("target", "blank");
                    translateVariant.appendChild(word);
                    info.appendChild(link);
                    translateVariant.appendChild(info);
                    this.translateVariants.appendChild(translateVariant);
                    newVariants = true;
                }
            }
        }.bind(this));
        this.translateInput.focus();
    } else {
        if (this.translateInput.value) {
            this.addTranslate(this.translateInput.value);
            this.translateVariants.innerHTML = "";
        }
    }
    
    this._editing = !this._editing;
    this.translateInput.classList.toggle("hidden");
    this.addTranslateButton.classList.toggle("inline");
};

var wordList = new Linguadesk.WordList({
        dom: document.querySelector(".words")
    });