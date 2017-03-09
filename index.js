var persianize = require('persianize');
var changeCase = require('change-case');

var englishize_numbers = function (number) {
    number = number.toString();
    var res = '';
    for (var i = 0; i < number.length; i++) {
        var num = '۰۱۲۳۴۵۶۷۸۹'.indexOf(number[i]);
        if (num == -1) {
            return null;
        } else {
            res = res + num.toString();
        }
    }
    return res;
};

var persianize_numbers = function (number) {
    number = number.toString();
    var res = '';
    for (var i = 0; i < number.length; i++) {
        var num = '۰۱۲۳۴۵۶۷۸۹' [number[i]];
        if (num == -1) {
            return null;
        } else {
            res = res + num.toString();
        }
    }
    return res;
};

var languageDensity = function (str) {
    if (!str || str.length == 0) {
        return null;
    }
    var persianCount = 0;
    var numberCount = 0;
    var otherCount = 0;
    var length = 0;

    str = str.replace(/\s/g, '');

    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (c) {
            length++;
            if (c >= 'آ' && c <= 'ی') {
                persianCount++;
            } else if (c >= '0' && c <= '9') {
                numberCount++;
            } else {
                otherCount++;
            }
        }

    }

    return {
        persian: persianCount / length,
        number: numberCount / length,
        other: (length - persianCount - numberCount) / length
    }
};

var removeArabicChar = function (str) {
    return persianize.convert().removeArabicChar(str).get();
};

var removeSpecialChar = function (str) {
    return str.replace(/[^\w\s]/gi, '')
};

var titleCase = function (str) {
    if (str) {
        return changeCase.titleCase(str.trim());
    } else {
        return str;
    }
};

var removeRepeatedCharacters = function (str, n, options) {
    if (!str) {
        return str;
    }
    var c;
    var ret = '';
    var nth = 1;
    var lastChar;
    for (var i = 0; i < str.length; i++) {
        c = str[i];
        if (c == lastChar) {
            nth++;
        } else {
            nth = 1;
        }
        if (nth <= n || (options && options.keep_phonetic && nth == 2 && 'oeOE'.indexOf(c) > -1)) {
            ret += c;
        }
        lastChar = c;
    }
    return ret;
};

var combinePhonetics = function (str) {
    return str
        .replace(/\n/g, ' ')
        .replace(/آ/g, 'ا')
        .replace(/ض/g, 'ز')
        .replace(/ظ/g, 'ز')
        .replace(/ذ/g, 'ز')
        .replace(/ق/g, 'غ')
        .replace(/ط/g, 'ت')
        .replace(/ح/g, 'ه')
        .replace(/ة/g, 'ه')
        .replace(/ص/g, 'س')
        .replace(/ث/g, 'س')
        .replace(/ي/g, 'ی')
        .replace(/ئ/g, 'ی')
        .replace(/ك/g, 'ک')
        .replace(/ؤ/g, 'و')
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ')
        .replace(/\s+/g, ' ');
};

var nFormatter = function (num, digits) {
    if (num) {
        num = Math.round(num);
    }
    var si = [{
            value: 1E18,
            symbol: "E"
        }, {
            value: 1E15,
            symbol: "P"
        }, {
            value: 1E12,
            symbol: "T"
        }, {
            value: 1E9,
            symbol: "G"
        }, {
            value: 1E6,
            symbol: "M"
        }, {
            value: 1E3,
            symbol: "k"
        }],
        i;
    for (i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol;
        }
    }
    return num.toString();
};

var turk2English = function (turk) {
    if (turk && turk != '') {
        return turk
            .replace(/ü/g, "u")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ğ/g, "g")
            .replace(/ç/g, "c")
            .replace(/Ü/g, "U")
            .replace(/İ/g, "I")
            .replace(/Ö/g, "O")
            .replace(/Ü/g, "U")
            .replace(/Ş/g, "S")
            .replace(/Ğ/g, "G")
            .replace(/Ç/g, "C");
    } else {
        return turk;
    }
};

var mysql_real_escape_string = function (str) {
    if (typeof str == 'object') {
        return '';
    }
    if (str == null || str == undefined) {
        return str;
    } else {
        try {
            return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
                switch (char) {
                    case "\0":
                        return "\\0";
                    case "\x08":
                        return "\\b";
                    case "\x09":
                        return "\\t";
                    case "\x1a":
                        return "\\z";
                    case "\n":
                        return "\\n";
                    case "\r":
                        return "\\r";
                    case "\"":
                    case "'":
                    case "\\":
                    case "%":
                        return "\\" + char; // prepends a backslash to backslash, percent,
                    // and double/single quotes
                }
            });
        } catch (e) {
            console.log(e);
            console.log('str : ' + str.toString());
            return '';
        }
    }
};

var format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

var serialize = function (mixed_value) {
    var val, key, okey,
        ktype = '',
        vals = '',
        count = 0,
        _utf8Size = function (str) {
            var size = 0,
                i = 0,
                l = str.length,
                code = '';
            for (i = 0; i < l; i++) {
                code = str.charCodeAt(i);
                if (code < 0x0080) {
                    size += 1;
                } else if (code < 0x0800) {
                    size += 2;
                } else {
                    size += 3;
                }
            }
            return size;
        };
    _getType = function (inp) {
        var match, key, cons, types, type = typeof inp;

        if (type === 'object' && !inp) {
            return 'null';
        }
        if (type === 'object') {
            if (!inp.constructor) {
                return 'object';
            }
            cons = inp.constructor.toString();
            match = cons.match(/(\w+)\(/);
            if (match) {
                cons = match[1].toLowerCase();
            }
            types = ['boolean', 'number', 'string', 'array'];
            for (key in types) {
                if (cons == types[key]) {
                    type = types[key];
                    break;
                }
            }
        }
        return type;
    };
    type = _getType(mixed_value);

    switch (type) {
        case 'function':
            val = '';
            break;
        case 'boolean':
            val = 'b:' + (mixed_value ? '1' : '0');
            break;
        case 'number':
            val = (Math.round(mixed_value) == mixed_value ? 'i' : 'd') + ':' + mixed_value;
            break;
        case 'string':
            val = 's:' + _utf8Size(mixed_value) + ':"' + mixed_value + '"';
            break;
        case 'array':
        case 'object':
            val = 'a';
            /*
             if (type === 'object') {
             var objname = mixed_value.constructor.toString().match(/(\w+)\(\)/);
             if (objname == undefined) {
             return;
             }
             objname[1] = this.serialize(objname[1]);
             val = 'O' + objname[1].substring(1, objname[1].length - 1);
             }
             */

            for (key in mixed_value) {
                if (mixed_value.hasOwnProperty(key)) {
                    ktype = _getType(mixed_value[key]);
                    if (ktype === 'function') {
                        continue;
                    }

                    okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
                    vals += serialize(okey) + serialize(mixed_value[key]);
                    count++;
                }
            }
            val += ':' + count + ':{' + vals + '}';
            break;
        case 'undefined':
        // Fall-through
        default:
            // if the JS object has a property which contains a null value, the string cannot be unserialized by PHP
            val = 'N';
            break;
    }
    if (type !== 'object' && type !== 'array') {
        val += ';';
    }
    return val.replace(/};/g, '}');
};

module.exports = {
    englishize_numbers: englishize_numbers,
    persianize_numbers: persianize_numbers,
    languageDensity: languageDensity,
    removeArabicChar: removeArabicChar,
    removeSpecialChar: removeSpecialChar,
    titleCase: titleCase,
    removeRepeatedCharacters: removeRepeatedCharacters,
    combinePhonetics: combinePhonetics,
    nFormatter: nFormatter,
    turk2English: turk2English,
    mysql_real_escape_string: mysql_real_escape_string,
    format: format,
    serialize: serialize
};