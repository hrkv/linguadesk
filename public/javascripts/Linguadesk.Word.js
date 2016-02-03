Linguadesk.Word = function (settings) {
    this.id = settings.id;
    this.original = settings.original;
    this.translate = Array.isArray(settings.translate) ? settings.translate : [];
    this.dom = null;
    this.view = null;
    this.originalDom = null;
    this.translateDom = null;
    
    this._editing = false;
    
    this.init();
};

Linguadesk.Word.prototype.getView = function () {
    return this.view;    
};

Linguadesk.Word.prototype.init = function () {
    var self = this;
    
    this.view = $("<div>", { class: "word" });
    this.originalDom = $("<div>", { class: "origin", text: this.original || "" });
    this.translateDom = $("<div>", { class: "translateContainer hidden" });
    this.translateList = $("<div>", { class: "translateList"});
    this.translateVariants = $("<div>", { class: "translateVariants" });
    this.addTranslateButton = $("<span>", { class: "actionButton active", text: Linguadesk.Resources[Linguadesk.locale].addTranslate });
    this.translateInput = $("<input>", { class: "translateInput hidden", type: "text" });
    
    this.updateTranslateList();
    
    this.translateList.click(this.onTranslateListAction.bind(this));
    this.originalDom.click(this.onOriginClick.bind(this));
    this.addTranslateButton.click(this.onTranslateClick.bind(this));
    this.translateVariants.click(function(event) {
        var variant = $(".translateVariant:hover .text");
        if (variant.length) {
            self.translateInput.val(variant.text());
        }
    });
    
    this.view
        .append(this.originalDom)
        .append(
            this.translateDom
                .append(this.translateList)
                .append(
                    $("<table>", { class: "translateTable" }).append(
                        $("<tr>")
                            .append($("<td>").append(this.translateInput))
                            .append($("<td>").append(this.addTranslateButton))
                    )
                )
                .append(this.translateVariants)
        );
};

Linguadesk.Word.prototype.updateTranslateList = function () {
    this.translateList.innerHTML = "";
    for (var i=0; i<this.translate.length; i++) {
        this.translateList.append(this.createTranslateVariant(this.translate[i]));
    }    
};

Linguadesk.Word.prototype.createTranslateVariant = function (translate, edit) {
    var textContent = edit ?
            $("<input>", { type: "text", oldValue: translate, value: translate, class: "translateText translateInput" }) :
            $("<span>", { text: translate, class: "translateText" }),
        firstButton = $("<span>", {
            text: Linguadesk.Resources[Linguadesk.locale][edit ? "save" : "edit"],
            action: edit ? "save" : "edit",
            class: "actionButton inline" }),
        secondButton = $("<span>", {
            text: Linguadesk.Resources[Linguadesk.locale][edit ? "cancel" : "delete"],
            action: edit ? "cancel" : "delete",
            class: "actionButton inline" });
        
    return $("<table>", { class: "translateListItem" }).append(
                $("<tr>").append(
                    $("<td>").append(textContent)
                ).append(
                    $("<td>").append(firstButton)
                ).append(
                    $("<td>").append(secondButton)
                )
            );
};

Linguadesk.Word.prototype.onTranslateListAction = function (event) {
    var button = $(event.target),
        translateNode = button.closest(".translateListItem"),
        textNode = translateNode.find(".translateText");
        
    switch (button.attr("action")) {
        case "edit":
            translateNode.replaceWith(this.createTranslateVariant(textNode.text(), true));
            break;
        case "delete":
            Linguadesk.API.Words.Translate.delete(this.original, textNode.text(), function (data) {
                this.translate.splice(1, this.translate.indexOf(textNode.text()));
                this.updateTranslateList();
            }.bind(this))
            break;
        case "save":
            Linguadesk.API.Words.Translate.update(textNode.attr("oldValue"), textNode.val(), function () {
                translateNode.replaceWith(this.createTranslateVariant(textNode.val()));
            }.bind(this));
            break;
        case "cancel":
            translateNode.replaceWith(this.createTranslateVariant(textNode.val()));
            break;
    }
};

Linguadesk.Word.prototype.onOriginClick = function () {
    this.translateDom.toggleClass("hidden");
    this._editing = false;
    this.translateInput.addClass("hidden");
    this.addTranslateButton.removeClass("inline");
    this.translateVariants.empty();
};

Linguadesk.Word.prototype.onTranslateClick = function () {
    if (!this._editing) {
        Linguadesk.API.Words.Utils.getTranslateVariant(this.original, "en-ru", function(err, result) {
            if (!err && result) {
                for (var i=0; i<result.text.length; i++) {
                    if (this.translate.indexOf(result.text[i]) === -1) {
                        this.translateVariants.append(
                            $("<span>", { class: "translateVariant" })
                                .append($("<span>", { class: "text", text: result.text[1] }))
                                .append($("<span>", { text: " переведено сервисом" }))
                                .append($("<a>", {
                                    text: ' "Яндекс.Переводчик"',
                                    href: "http://translate.yandex.ru/",
                                    target: "blank"
                                }))
                        );
                    }
                }
            }
        }.bind(this));
        this.translateInput.focus();
    } else {
        Linguadesk.API.Words.Translate.add(this.original, this.translateInput.val(), function (data) {
            this.translate.push(translate);
            this.updateTranslateList();
            this.translateVariants.empty();
        }.bind(this));
    }
    
    this._editing = !this._editing;
    this.translateInput.toggleClass("hidden");
    this.addTranslateButton.toggleClass("inline");
};