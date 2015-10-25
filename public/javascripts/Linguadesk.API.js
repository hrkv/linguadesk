if (!Linguadesk) {
    Linguadesk = {};
}

Linguadesk.API = {
    Words: {
        add: function (word, cb) {
            if (word) {
                $.post('/api/boards/words/addword', { newword: word })
                .done(function(data) {
                    if (cb) {
                        data = JSON.parse(data);
                        cb(data.error, data);
                    }
                })
                .fail(function (jqXHR, status) {
                    if (cb) {
                        cb(status, null);
                    }
                });
            }
        },
        getAll: function (cb) {
            $.post('/api/boards/words/getall')
            .done(function(data) {
                if (cb) {
                    data = JSON.parse(data);
                    cb(data.error, data);
                }
            })
            .fail(function (jqXHR, status) {
                if (cb) {
                    cb(status, null);
                }
            });
        },
        Translate: {
            add: function (word, translate, cb) {
                if (word && translate) {
                    $.post('/api/boards/words/addtranslate', {
                        word: word,
                        translate: translate
                    })
                    .done(function(data) {
                        cb && cb(JSON.parse(data));
                    });
                }
            },
            delete: function (word, translate, cb) {
                if (word && translate) {
                    $.ajax({
                        method: 'DELETE',
                        url:'/api/boards/words/deletetranslate',
                        data: { word: word, translate: translate}
                    })
                    .done(function(data) {
                        cb && cb(JSON.parse(data));
                    });
                }
            },
            update: function(word, oldValue, newValue, cb) {
                if (word && oldValue && newValue) {
                    $.post('/api/boards/words/updatetranslate', {
                        word: word,
                        oldtranslate: oldValue,
                        newtranslate: newValue
                    })
                    .done(function(data) {
                        cb && cb(JSON.parse(data));
                    });
                }
            }
        },
        Utils: {
            getTranslateVariant: function (word, direction, cb) {
                if (word && direction) {
                    $.post('https://translate.yandex.net/api/v1.5/tr.json/translate', {
                        key: 'trnsl.1.1.20151010T223725Z.301f9ec722fe077c.5d4d67f6289d41fea329923b2db57651c3dccfec',
                        text: word,
                        lang: direction
                    })
                    .done(function(data) {
                        data = JSON.parse(data);
                        cb && cb(data.code !== 200, data);
                    });
                }              
            }
        }
    }    
};