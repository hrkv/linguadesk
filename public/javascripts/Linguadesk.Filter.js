Linguadesk.Filter = function (settings) {
    this.sortState = settings.sortState;
    this.events = settings.events;
    this.dom = settings.dom;
    this.view = null;
    this.init();
};
Linguadesk.Filter.Sorting = {
    All: "All",
    Translated: "Translated",
    Untranslated: "Untranslated"
};
Linguadesk.Filter.Events = {
    SortStateChanged: "SortStateChanged"    
};

Linguadesk.Filter.prototype.init = function () {
    this.view = $("<div>", { class: "wordsfilter" });
    this.view
        .append($("<span>", {
            id: "allwordsradio",
            text: "all",
            class: "radiolabel"
        }))
        .append($("<span>"), { class: "separator" })
        .append($("<span>", {
            id: "translatedradio",
            text: "translated",
            class: "radiolabel"
        }))
        .append($("<span>"), { class: "separator" })
        .append($("<label>", {
            id: "untranslatedradio",
            text: "untranslated",
            class: "radiolabel"
        }));
    if (this.dom) {
        this.dom.append(this.view);
    }
};

Linguadesk.Filter.prototype.getView = function () {
    return this.view;    
};

Linguadesk.Filter.prototype.fireEvent = function (event, args) {
    var handlers = this.events[event];
    if (handlers) {
        if (Array.isArray(handlers)) {
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].call(this, args);
            }
        } else {
            handlers.call(this, args);
        }
    }
};

Linguadesk.Filter.prototype.setSortState = function (value) {
    this.sortState = value;
    this.view.find(".radiolabel").removeClass("checked");
    switch (value) {
        case Linguadesk.Filter.Sorting.All:
            this.view.find("#allwordsradio").addClass("checked");
            break;
        case Linguadesk.Filter.Sorting.Translated:
            this.view.find("#translatedradio").addClass("checked");
            break;
        case Linguadesk.Filter.Sorting.Untranslated:
            this.view.find("#untranslatedradio").addClass("checked");
            break;
    }
    this.fireEvent(Linguadesk.Filter.Events.SortStateChanged);
};