/*! bawarchi 2015-05-26 */
/*! jRespond.js v 0.10 | Author: Jeremy Fields [jeremy.fields@viget.com], 2013 | License: MIT */

// Universal Module Definition
;(function (window, name, fn) {
    // Node module pattern
    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = fn;
    } else {
        // browser
        window[name] = fn;

        // AMD definition
        if (typeof define === "function" && define.amd) {
            define(name, [], function (module) {
                return fn;
            });
        }
    }
}(this, 'jRespond', function(win,doc,undefined) {

    'use strict';

    return function(breakpoints) {

        // array for registered functions
        var mediaListeners = [];

        // array that corresponds to mediaListeners and holds the current on/off state
        var mediaInit = [];

        // array of media query breakpoints; adjust as needed
        var mediaBreakpoints = breakpoints;

        // store the current breakpoint
        var curr = '';

        // the previous breakpoint
        var prev = '';

        // window resize event timer stuff
        var resizeTimer;
        var resizeW = 0;
        var resizeTmrFast = 100;
        var resizeTmrSlow = 500;
        var resizeTmrSpd = resizeTmrSlow;

        // cross browser window width
        var winWidth = function() {

            var w = 0;

            // IE
            if (typeof( window.innerWidth ) != 'number') {

                if (!(document.documentElement.clientWidth === 0)) {

                    // strict mode
                    w = document.documentElement.clientWidth;
                } else {

                    // quirks mode
                    w = document.body.clientWidth;
                }
            } else {

                // w3c
                w = window.innerWidth;
            }

            return w;
        };

        // determine input type
        var addFunction = function(elm) {
            if (elm.length === undefined) {
                addToStack(elm);
            } else {
                for (var i = 0; i < elm.length; i++) {
                    addToStack(elm[i]);
                }
            }
        };

        // send media to the mediaListeners array
        var addToStack = function(elm) {
            var brkpt = elm['breakpoint'];
            var entr = elm['enter'] || undefined;

            // add function to stack
            mediaListeners.push(elm);

            // add corresponding entry to mediaInit
            mediaInit.push(false);

            if (testForCurr(brkpt)) {
                if (entr !== undefined) {
                    entr.call(null, {entering : curr, exiting : prev});
                }
                mediaInit[(mediaListeners.length - 1)] = true;
            }
        };

        // loops through all registered functions and determines what should be fired
        var cycleThrough = function() {

            var enterArray = [];
            var exitArray = [];

            for (var i = 0; i < mediaListeners.length; i++) {
                var brkpt = mediaListeners[i]['breakpoint'];
                var entr = mediaListeners[i]['enter'] || undefined;
                var exit = mediaListeners[i]['exit'] || undefined;

                if (brkpt === '*') {
                    if (entr !== undefined) {
                        enterArray.push(entr);
                    }
                    if (exit !== undefined) {
                        exitArray.push(exit);
                    }
                } else if (testForCurr(brkpt)) {
                    if (entr !== undefined && !mediaInit[i]) {
                        enterArray.push(entr);
                    }
                    mediaInit[i] = true;
                } else {
                    if (exit !== undefined && mediaInit[i]) {
                        exitArray.push(exit);
                    }
                    mediaInit[i] = false;
                }
            }

            var eventObject = {
                entering : curr,
                exiting : prev
            };

            // loop through exit functions to call
            for (var j = 0; j < exitArray.length; j++) {
                exitArray[j].call(null, eventObject);
            }

            // then loop through enter functions to call
            for (var k = 0; k < enterArray.length; k++) {
                enterArray[k].call(null, eventObject);
            }
        };

        // checks for the correct breakpoint against the mediaBreakpoints list
        var returnBreakpoint = function(width) {

            var foundBrkpt = false;

            // look for existing breakpoint based on width
            for (var i = 0; i < mediaBreakpoints.length; i++) {

                // if registered breakpoint found, break out of loop
                if (width >= mediaBreakpoints[i]['enter'] && width <= mediaBreakpoints[i]['exit']) {
                    foundBrkpt = true;

                    break;
                }
            }

            // if breakpoint is found and it's not the current one
            if (foundBrkpt && curr !== mediaBreakpoints[i]['label']) {
                prev = curr;
                curr = mediaBreakpoints[i]['label'];

                // run the loop
                cycleThrough();

            // or if no breakpoint applies
            } else if (!foundBrkpt && curr !== '') {
                curr = '';

                // run the loop
                cycleThrough();
            }

        };

        // takes the breakpoint/s arguement from an object and tests it against the current state
        var testForCurr = function(elm) {

            // if there's an array of breakpoints
            if (typeof elm === 'object') {
                if (elm.join().indexOf(curr) >= 0) {
                    return true;
                }

            // if the string is '*' then run at every breakpoint
            } else if (elm === '*') {
                return true;

            // or if it's a single breakpoint
            } else if (typeof elm === 'string') {
                if (curr === elm) {
                    return true;
                }
            }
        };

        // self-calling function that checks the browser width and delegates if it detects a change
        var checkResize = function() {

            // get current width
            var w = winWidth();

            // if there is a change speed up the timer and fire the returnBreakpoint function
            if (w !== resizeW) {
                resizeTmrSpd = resizeTmrFast;

                returnBreakpoint(w);

            // otherwise keep on keepin' on
            } else {
                resizeTmrSpd = resizeTmrSlow;
            }

            resizeW = w;

            // calls itself on a setTimeout
            setTimeout(checkResize, resizeTmrSpd);
        };
        checkResize();

        // return
        return {
            addFunc: function(elm) { addFunction(elm); },
            getBreakpoint: function() { return curr; }
        };

    };

}(this,this.document)));;(function( $ ){
    /**
     * Creates new jsPDF document object instance.
     *
     * @class
     * @param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
     * @param unit        Measurement unit to be used when coordinates are specified.
     *                    One of "pt" (points), "mm" (Default), "cm", "in"
     * @param format      One of 'pageFormats' as shown below, default: a4
     * @returns {jsPDF}
     * @name jsPDF
     */
    var jsPDF = (function(global) {
        'use strict';

        var pdfVersion = '1.3',
            pageFormats = { // Size in pt of various paper formats
                'a0'  : [2383.94, 3370.39], 'a1'  : [1683.78, 2383.94],
                'a2'  : [1190.55, 1683.78], 'a3'  : [ 841.89, 1190.55],
                'a4'  : [ 595.28,  841.89], 'a5'  : [ 419.53,  595.28],
                'a6'  : [ 297.64,  419.53], 'a7'  : [ 209.76,  297.64],
                'a8'  : [ 147.40,  209.76], 'a9'  : [ 104.88,  147.40],
                'a10' : [  73.70,  104.88], 'b0'  : [2834.65, 4008.19],
                'b1'  : [2004.09, 2834.65], 'b2'  : [1417.32, 2004.09],
                'b3'  : [1000.63, 1417.32], 'b4'  : [ 708.66, 1000.63],
                'b5'  : [ 498.90,  708.66], 'b6'  : [ 354.33,  498.90],
                'b7'  : [ 249.45,  354.33], 'b8'  : [ 175.75,  249.45],
                'b9'  : [ 124.72,  175.75], 'b10' : [  87.87,  124.72],
                'c0'  : [2599.37, 3676.54], 'c1'  : [1836.85, 2599.37],
                'c2'  : [1298.27, 1836.85], 'c3'  : [ 918.43, 1298.27],
                'c4'  : [ 649.13,  918.43], 'c5'  : [ 459.21,  649.13],
                'c6'  : [ 323.15,  459.21], 'c7'  : [ 229.61,  323.15],
                'c8'  : [ 161.57,  229.61], 'c9'  : [ 113.39,  161.57],
                'c10' : [  79.37,  113.39], 'dl'  : [ 311.81,  623.62],
                'letter'            : [612,   792],
                'government-letter' : [576,   756],
                'legal'             : [612,  1008],
                'junior-legal'      : [576,   360],
                'ledger'            : [1224,  792],
                'tabloid'           : [792,  1224],
                'credit-card'       : [153,   243]
            };

        /**
         * jsPDF's Internal PubSub Implementation.
         * See mrrio.github.io/jsPDF/doc/symbols/PubSub.html
         * Backward compatible rewritten on 2014 by
         * Diego Casorran, https://github.com/diegocr
         *
         * @class
         * @name PubSub
         */
        function PubSub(context) {
            var topics = {};

            this.subscribe = function(topic, callback, once) {
                if(typeof callback !== 'function') {
                    return false;
                }

                if(!topics.hasOwnProperty(topic)) {
                    topics[topic] = {};
                }

                var id = Math.random().toString(35);
                topics[topic][id] = [callback,!!once];

                return id;
            };

            this.unsubscribe = function(token) {
                for(var topic in topics) {
                    if(topics[topic][token]) {
                        delete topics[topic][token];
                        return true;
                    }
                }
                return false;
            };

            this.publish = function(topic) {
                if(topics.hasOwnProperty(topic)) {
                    var args = Array.prototype.slice.call(arguments, 1), idr = [];

                    for(var id in topics[topic]) {
                        var sub = topics[topic][id];
                        try {
                            sub[0].apply(context, args);
                        } catch(ex) {
                            if(global.console) {
                                console.error('jsPDF PubSub Error', ex.message, ex);
                            }
                        }
                        if(sub[1]) idr.push(id);
                    }
                    if(idr.length) idr.forEach(this.unsubscribe);
                }
            };
        }

        /**
         * @constructor
         * @private
         */
        function jsPDF(orientation, unit, format, compressPdf) {
            var options = {};

            if (typeof orientation === 'object') {
                options = orientation;

                orientation = options.orientation;
                unit = options.unit || unit;
                format = options.format || format;
                compressPdf = options.compress || options.compressPdf || compressPdf;
            }

            // Default options
            unit        = unit || 'mm';
            format      = format || 'a4';
            orientation = ('' + (orientation || 'P')).toLowerCase();

            var format_as_string = ('' + format).toLowerCase(),
                compress = !!compressPdf && typeof Uint8Array === 'function',
                textColor            = options.textColor  || '0 g',
                drawColor            = options.drawColor  || '0 G',
                activeFontSize       = options.fontSize   || 16,
                lineHeightProportion = options.lineHeight || 1.15,
                lineWidth            = options.lineWidth  || 0.200025, // 2mm
                objectNumber =  2,  // 'n' Current object number
                outToPages   = !1,  // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
                offsets      = [],  // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
                fonts        = {},  // collection of font objects, where key is fontKey - a dynamically created label for a given font.
                fontmap      = {},  // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
                activeFontKey,      // will be string representing the KEY of the font as combination of fontName + fontStyle
                k,                  // Scale factor
                tmp,
                page = 0,
                currentPage,
                pages = [],
                pagedim = {},
                content = [],
                lineCapID = 0,
                lineJoinID = 0,
                content_length = 0,
                pageWidth,
                pageHeight,
                pageMode,
                zoomMode,
                layoutMode,
                documentProperties = {
                    'title'    : '',
                    'subject'  : '',
                    'author'   : '',
                    'keywords' : '',
                    'creator'  : ''
                },
                API = {},
                events = new PubSub(API),

            /////////////////////
            // Private functions
            /////////////////////
            f2 = function(number) {
                return number.toFixed(2); // Ie, %.2f
            },
            f3 = function(number) {
                return number.toFixed(3); // Ie, %.3f
            },
            padd2 = function(number) {
                return ('0' + parseInt(number)).slice(-2);
            },
            out = function(string) {
                if (outToPages) {
                    /* set by beginPage */
                    pages[currentPage].push(string);
                } else {
                    // +1 for '\n' that will be used to join 'content'
                    content_length += string.length + 1;
                    content.push(string);
                }
            },
            newObject = function() {
                // Begin a new object
                objectNumber++;
                offsets[objectNumber] = content_length;
                out(objectNumber + ' 0 obj');
                return objectNumber;
            },
            putStream = function(str) {
                out('stream');
                out(str);
                out('endstream');
            },
            putPages = function() {
                var n,p,arr,i,deflater,adler32,adler32cs,wPt,hPt;

                adler32cs = global.adler32cs || jsPDF.adler32cs;
                if (compress && typeof adler32cs === 'undefined') {
                    compress = false;
                }

                // outToPages = false as set in endDocument(). out() writes to content.

                for (n = 1; n <= page; n++) {
                    newObject();
                    wPt = (pageWidth = pagedim[n].width) * k;
                    hPt = (pageHeight = pagedim[n].height) * k;
                    out('<</Type /Page');
                    out('/Parent 1 0 R');
                    out('/Resources 2 0 R');
                    out('/MediaBox [0 0 ' + f2(wPt) + ' ' + f2(hPt) + ']');
                    out('/Contents ' + (objectNumber + 1) + ' 0 R>>');
                    out('endobj');

                    // Page content
                    p = pages[n].join('\n');
                    newObject();
                    if (compress) {
                        arr = [];
                        i = p.length;
                        while(i--) {
                            arr[i] = p.charCodeAt(i);
                        }
                        adler32 = adler32cs.from(p);
                        deflater = new Deflater(6);
                        deflater.append(new Uint8Array(arr));
                        p = deflater.flush();
                        arr = new Uint8Array(p.length + 6);
                        arr.set(new Uint8Array([120, 156])),
                        arr.set(p, 2);
                        arr.set(new Uint8Array([adler32 & 0xFF, (adler32 >> 8) & 0xFF, (adler32 >> 16) & 0xFF, (adler32 >> 24) & 0xFF]), p.length+2);
                        p = String.fromCharCode.apply(null, arr);
                        out('<</Length ' + p.length + ' /Filter [/FlateDecode]>>');
                    } else {
                        out('<</Length ' + p.length + '>>');
                    }
                    putStream(p);
                    out('endobj');
                }
                offsets[1] = content_length;
                out('1 0 obj');
                out('<</Type /Pages');
                var kids = '/Kids [';
                for (i = 0; i < page; i++) {
                    kids += (3 + 2 * i) + ' 0 R ';
                }
                out(kids + ']');
                out('/Count ' + page);
                out('>>');
                out('endobj');
            },
            putFont = function(font) {
                font.objectNumber = newObject();
                out('<</BaseFont/' + font.PostScriptName + '/Type/Font');
                if (typeof font.encoding === 'string') {
                    out('/Encoding/' + font.encoding);
                }
                out('/Subtype/Type1>>');
                out('endobj');
            },
            putFonts = function() {
                for (var fontKey in fonts) {
                    if (fonts.hasOwnProperty(fontKey)) {
                        putFont(fonts[fontKey]);
                    }
                }
            },
            putXobjectDict = function() {
                // Loop through images, or other data objects
                events.publish('putXobjectDict');
            },
            putResourceDictionary = function() {
                out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
                out('/Font <<');

                // Do this for each font, the '1' bit is the index of the font
                for (var fontKey in fonts) {
                    if (fonts.hasOwnProperty(fontKey)) {
                        out('/' + fontKey + ' ' + fonts[fontKey].objectNumber + ' 0 R');
                    }
                }
                out('>>');
                out('/XObject <<');
                putXobjectDict();
                out('>>');
            },
            putResources = function() {
                putFonts();
                events.publish('putResources');
                // Resource dictionary
                offsets[2] = content_length;
                out('2 0 obj');
                out('<<');
                putResourceDictionary();
                out('>>');
                out('endobj');
                events.publish('postPutResources');
            },
            addToFontDictionary = function(fontKey, fontName, fontStyle) {
                // this is mapping structure for quick font key lookup.
                // returns the KEY of the font (ex: "F1") for a given
                // pair of font name and type (ex: "Arial". "Italic")
                if (!fontmap.hasOwnProperty(fontName)) {
                    fontmap[fontName] = {};
                }
                fontmap[fontName][fontStyle] = fontKey;
            },
            /**
             * FontObject describes a particular font as member of an instnace of jsPDF
             *
             * It's a collection of properties like 'id' (to be used in PDF stream),
             * 'fontName' (font's family name), 'fontStyle' (font's style variant label)
             *
             * @class
             * @public
             * @property id {String} PDF-document-instance-specific label assinged to the font.
             * @property PostScriptName {String} PDF specification full name for the font
             * @property encoding {Object} Encoding_name-to-Font_metrics_object mapping.
             * @name FontObject
             */
            addFont = function(PostScriptName, fontName, fontStyle, encoding) {
                var fontKey = 'F' + (Object.keys(fonts).length + 1).toString(10),
                // This is FontObject
                font = fonts[fontKey] = {
                    'id'             : fontKey,
                    'PostScriptName' : PostScriptName,
                    'fontName'       : fontName,
                    'fontStyle'      : fontStyle,
                    'encoding'       : encoding,
                    'metadata'       : {}
                };
                addToFontDictionary(fontKey, fontName, fontStyle);
                events.publish('addFont', font);

                return fontKey;
            },
            addFonts = function() {

                var HELVETICA     = 'helvetica',
                    TIMES         = 'times',
                    COURIER       = 'courier',
                    NORMAL        = 'normal',
                    BOLD          = 'bold',
                    ITALIC        = 'italic',
                    BOLD_ITALIC   = 'bolditalic',
                    encoding      = 'StandardEncoding',
                    standardFonts = [
                        ['Helvetica', HELVETICA, NORMAL],
                        ['Helvetica-Bold', HELVETICA, BOLD],
                        ['Helvetica-Oblique', HELVETICA, ITALIC],
                        ['Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC],
                        ['Courier', COURIER, NORMAL],
                        ['Courier-Bold', COURIER, BOLD],
                        ['Courier-Oblique', COURIER, ITALIC],
                        ['Courier-BoldOblique', COURIER, BOLD_ITALIC],
                        ['Times-Roman', TIMES, NORMAL],
                        ['Times-Bold', TIMES, BOLD],
                        ['Times-Italic', TIMES, ITALIC],
                        ['Times-BoldItalic', TIMES, BOLD_ITALIC]
                    ];

                for (var i = 0, l = standardFonts.length; i < l; i++) {
                    var fontKey = addFont(
                            standardFonts[i][0],
                            standardFonts[i][1],
                            standardFonts[i][2],
                            encoding);

                    // adding aliases for standard fonts, this time matching the capitalization
                    var parts = standardFonts[i][0].split('-');
                    addToFontDictionary(fontKey, parts[0], parts[1] || '');
                }
                events.publish('addFonts', { fonts : fonts, dictionary : fontmap });
            },
            SAFE = function __safeCall(fn) {
                fn.foo = function __safeCallWrapper() {
                    try {
                        return fn.apply(this, arguments);
                    } catch (e) {
                        var stack = e.stack || '';
                        if(~stack.indexOf(' at ')) stack = stack.split(' at ')[1];
                        var m = 'Error in function ' + stack.split('\n')[0].split('<')[0] + ': ' + e.message;
                        if(global.console) {
                            global.console.error(m, e);
                            if(global.alert) alert(m);
                        } else {
                            throw new Error(m);
                        }
                    }
                };
                fn.foo.bar = fn;
                return fn.foo;
            },
            to8bitStream = function(text, flags) {
            /**
             * PDF 1.3 spec:
             * "For text strings encoded in Unicode, the first two bytes must be 254 followed by
             * 255, representing the Unicode byte order marker, U+FEFF. (This sequence conflicts
             * with the PDFDocEncoding character sequence thorn ydieresis, which is unlikely
             * to be a meaningful beginning of a word or phrase.) The remainder of the
             * string consists of Unicode character codes, according to the UTF-16 encoding
             * specified in the Unicode standard, version 2.0. Commonly used Unicode values
             * are represented as 2 bytes per character, with the high-order byte appearing first
             * in the string."
             *
             * In other words, if there are chars in a string with char code above 255, we
             * recode the string to UCS2 BE - string doubles in length and BOM is prepended.
             *
             * HOWEVER!
             * Actual *content* (body) text (as opposed to strings used in document properties etc)
             * does NOT expect BOM. There, it is treated as a literal GID (Glyph ID)
             *
             * Because of Adobe's focus on "you subset your fonts!" you are not supposed to have
             * a font that maps directly Unicode (UCS2 / UTF16BE) code to font GID, but you could
             * fudge it with "Identity-H" encoding and custom CIDtoGID map that mimics Unicode
             * code page. There, however, all characters in the stream are treated as GIDs,
             * including BOM, which is the reason we need to skip BOM in content text (i.e. that
             * that is tied to a font).
             *
             * To signal this "special" PDFEscape / to8bitStream handling mode,
             * API.text() function sets (unless you overwrite it with manual values
             * given to API.text(.., flags) )
             * flags.autoencode = true
             * flags.noBOM = true
             *
             * ===================================================================================
             * `flags` properties relied upon:
             *   .sourceEncoding = string with encoding label.
             *                     "Unicode" by default. = encoding of the incoming text.
             *                     pass some non-existing encoding name
             *                     (ex: 'Do not touch my strings! I know what I am doing.')
             *                     to make encoding code skip the encoding step.
             *   .outputEncoding = Either valid PDF encoding name
             *                     (must be supported by jsPDF font metrics, otherwise no encoding)
             *                     or a JS object, where key = sourceCharCode, value = outputCharCode
             *                     missing keys will be treated as: sourceCharCode === outputCharCode
             *   .noBOM
             *       See comment higher above for explanation for why this is important
             *   .autoencode
             *       See comment higher above for explanation for why this is important
             */

                var i,l,sourceEncoding,encodingBlock,outputEncoding,newtext,isUnicode,ch,bch;

                flags = flags || {};
                sourceEncoding = flags.sourceEncoding || 'Unicode';
                outputEncoding = flags.outputEncoding;

                // This 'encoding' section relies on font metrics format
                // attached to font objects by, among others,
                // "Willow Systems' standard_font_metrics plugin"
                // see jspdf.plugin.standard_font_metrics.js for format
                // of the font.metadata.encoding Object.
                // It should be something like
                //   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
                //   .widths = {0:width, code:width, ..., 'fof':divisor}
                //   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
                if ((flags.autoencode || outputEncoding) &&
                    fonts[activeFontKey].metadata &&
                    fonts[activeFontKey].metadata[sourceEncoding] &&
                    fonts[activeFontKey].metadata[sourceEncoding].encoding) {
                    encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

                    // each font has default encoding. Some have it clearly defined.
                    if (!outputEncoding && fonts[activeFontKey].encoding) {
                        outputEncoding = fonts[activeFontKey].encoding;
                    }

                    // Hmmm, the above did not work? Let's try again, in different place.
                    if (!outputEncoding && encodingBlock.codePages) {
                        outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
                    }

                    if (typeof outputEncoding === 'string') {
                        outputEncoding = encodingBlock[outputEncoding];
                    }
                    // we want output encoding to be a JS Object, where
                    // key = sourceEncoding's character code and
                    // value = outputEncoding's character code.
                    if (outputEncoding) {
                        isUnicode = false;
                        newtext = [];
                        for (i = 0, l = text.length; i < l; i++) {
                            ch = outputEncoding[text.charCodeAt(i)];
                            if (ch) {
                                newtext.push(
                                    String.fromCharCode(ch));
                            } else {
                                newtext.push(
                                    text[i]);
                            }

                            // since we are looping over chars anyway, might as well
                            // check for residual unicodeness
                            if (newtext[i].charCodeAt(0) >> 8) {
                                /* more than 255 */
                                isUnicode = true;
                            }
                        }
                        text = newtext.join('');
                    }
                }

                i = text.length;
                // isUnicode may be set to false above. Hence the triple-equal to undefined
                while (isUnicode === undefined && i !== 0) {
                    if (text.charCodeAt(i - 1) >> 8) {
                        /* more than 255 */
                        isUnicode = true;
                    }
                    i--;
                }
                if (!isUnicode) {
                    return text;
                }

                newtext = flags.noBOM ? [] : [254, 255];
                for (i = 0, l = text.length; i < l; i++) {
                    ch = text.charCodeAt(i);
                    bch = ch >> 8; // divide by 256
                    if (bch >> 8) {
                        /* something left after dividing by 256 second time */
                        throw new Error('Character at position ' + i + ' of string ' + 
                            text + ' exceeds 16bits. Cannot be encoded into UCS-2 BE');
                    }
                    newtext.push(bch);
                    newtext.push(ch - (bch << 8));
                }
                return String.fromCharCode.apply(undefined, newtext);
            },
            pdfEscape = function(text, flags) {
                /**
                 * Replace '/', '(', and ')' with pdf-safe versions
                 *
                 * Doing to8bitStream does NOT make this PDF display unicode text. For that
                 * we also need to reference a unicode font and embed it - royal pain in the rear.
                 *
                 * There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
                 * which JavaScript Strings are happy to provide. So, while we still cannot display
                 * 2-byte characters property, at least CONDITIONALLY converting (entire string containing)
                 * 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
                 * is still parseable.
                 * This will allow immediate support for unicode in document properties strings.
                 */
                return to8bitStream(text, flags).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
            },
            putInfo = function() {
                out('/Producer (jsPDF ' + jsPDF.version + ')');
                for(var key in documentProperties) {
                    if(documentProperties.hasOwnProperty(key) && documentProperties[key]) {
                        out('/'+key.substr(0,1).toUpperCase() + key.substr(1) +
                            ' (' + pdfEscape(documentProperties[key]) + ')');
                    }
                }
                var created  = new Date(),
                    tzoffset = created.getTimezoneOffset(),
                    tzsign   = tzoffset < 0 ? '+' : '-',
                    tzhour   = Math.floor(Math.abs(tzoffset / 60)),
                    tzmin    = Math.abs(tzoffset % 60),
                    tzstr    = [tzsign, padd2(tzhour), '\'', padd2(tzmin), '\''].join('');
                out(['/CreationDate (D:',
                        created.getFullYear(),
                        padd2(created.getMonth() + 1),
                        padd2(created.getDate()),
                        padd2(created.getHours()),
                        padd2(created.getMinutes()),
                        padd2(created.getSeconds()), tzstr, ')'].join(''));
            },
            putCatalog = function() {
                out('/Type /Catalog');
                out('/Pages 1 0 R');
                // PDF13ref Section 7.2.1
                if (!zoomMode) zoomMode = 'fullwidth';
                switch(zoomMode) {
                    case 'fullwidth'  : out('/OpenAction [3 0 R /FitH null]');       break;
                    case 'fullheight' : out('/OpenAction [3 0 R /FitV null]');       break;
                    case 'fullpage'   : out('/OpenAction [3 0 R /Fit]');             break;
                    case 'original'   : out('/OpenAction [3 0 R /XYZ null null 1]'); break;
                    default:
                        var pcn = '' + zoomMode;
                        if (pcn.substr(pcn.length-1) === '%')
                            zoomMode = parseInt(zoomMode) / 100;
                        if (typeof zoomMode === 'number') {
                            out('/OpenAction [3 0 R /XYZ null null '+f2(zoomMode)+']');
                        }
                }
                if (!layoutMode) layoutMode = 'continuous';
                switch(layoutMode) {
                    case 'continuous' : out('/PageLayout /OneColumn');      break;
                    case 'single'     : out('/PageLayout /SinglePage');     break;
                    case 'two':
                    case 'twoleft'    : out('/PageLayout /TwoColumnLeft');  break;
                    case 'tworight'   : out('/PageLayout /TwoColumnRight'); break;
                }
                if (pageMode) {
                    /**
                     * A name object specifying how the document should be displayed when opened:
                     * UseNone      : Neither document outline nor thumbnail images visible -- DEFAULT
                     * UseOutlines  : Document outline visible
                     * UseThumbs    : Thumbnail images visible
                     * FullScreen   : Full-screen mode, with no menu bar, window controls, or any other window visible
                     */
                    out('/PageMode /' + pageMode);
                }
                events.publish('putCatalog');
            },
            putTrailer = function() {
                out('/Size ' + (objectNumber + 1));
                out('/Root ' + objectNumber + ' 0 R');
                out('/Info ' + (objectNumber - 1) + ' 0 R');
            },
            beginPage = function(width,height) {
                // Dimensions are stored as user units and converted to points on output
                var orientation = typeof height === 'string' && height.toLowerCase();
                if (typeof width === 'string') {
                    var format = width.toLowerCase();
                    if (pageFormats.hasOwnProperty(format)) {
                        width  = pageFormats[format][0] / k;
                        height = pageFormats[format][1] / k;
                    }
                }
                if (Array.isArray(width)) {
                    height = width[1];
                    width = width[0];
                }
                if (orientation) {
                    switch(orientation.substr(0,1)) {
                        case 'l': if (height > width ) orientation = 's'; break;
                        case 'p': if (width > height ) orientation = 's'; break;
                    }
                    if (orientation === 's') { tmp = width; width = height; height = tmp; }
                }
                outToPages = true;
                pages[++page] = [];
                pagedim[page] = {
                    width  : Number(width)  || pageWidth,
                    height : Number(height) || pageHeight
                };
                _setPage(page);
            },
            _addPage = function() {
                beginPage.apply(this, arguments);
                // Set line width
                out(f2(lineWidth * k) + ' w');
                // Set draw color
                out(drawColor);
                // resurrecting non-default line caps, joins
                if (lineCapID !== 0) {
                    out(lineCapID + ' J');
                }
                if (lineJoinID !== 0) {
                    out(lineJoinID + ' j');
                }
                events.publish('addPage', { pageNumber : page });
            },
            _setPage = function(n) {
                if (n > 0 && n <= page) {
                    currentPage = n;
                    pageWidth = pagedim[n].width;
                    pageHeight = pagedim[n].height;
                }
            },
            /**
             * Returns a document-specific font key - a label assigned to a
             * font name + font type combination at the time the font was added
             * to the font inventory.
             *
             * Font key is used as label for the desired font for a block of text
             * to be added to the PDF document stream.
             * @private
             * @function
             * @param fontName {String} can be undefined on "falthy" to indicate "use current"
             * @param fontStyle {String} can be undefined on "falthy" to indicate "use current"
             * @returns {String} Font key.
             */
            getFont = function(fontName, fontStyle) {
                var key;

                fontName  = fontName  !== undefined ? fontName  : fonts[activeFontKey].fontName;
                fontStyle = fontStyle !== undefined ? fontStyle : fonts[activeFontKey].fontStyle;

                try {
                 // get a string like 'F3' - the KEY corresponding tot he font + type combination.
                    key = fontmap[fontName][fontStyle];
                } catch (e) {}

                if (!key) {
                    throw new Error('Unable to look up font label for font \'' + fontName + ', ' + 
                        fontStyle + '. Refer to getFontList() for available fonts.');
                }
                return key;
            },
            buildDocument = function() {

                outToPages = false; // switches out() to content
                objectNumber = 2;
                content = [];
                offsets = [];

                // putHeader()
                out('%PDF-' + pdfVersion);

                putPages();

                putResources();

                // Info
                newObject();
                out('<<');
                putInfo();
                out('>>');
                out('endobj');

                // Catalog
                newObject();
                out('<<');
                putCatalog();
                out('>>');
                out('endobj');

                // Cross-ref
                var o = content_length, i, p = '0000000000';
                out('xref');
                out('0 ' + (objectNumber + 1));
                out(p+' 65535 f ');
                for (i = 1; i <= objectNumber; i++) {
                    out((p + offsets[i]).slice(-10) + ' 00000 n ');
                }
                // Trailer
                out('trailer');
                out('<<');
                putTrailer();
                out('>>');
                out('startxref');
                out(o);
                out('%%EOF');

                outToPages = true;

                return content.join('\n');
            },
            getStyle = function(style) {
                // see path-painting operators in PDF spec
                var op = 'S'; // stroke
                if (style === 'F') {
                    op = 'f'; // fill
                } else if (style === 'FD' || style === 'DF') {
                    op = 'B'; // both
                } else if (style === 'f' || style === 'f*' || style === 'B' || style === 'B*') {
                    /*
                    Allow direct use of these PDF path-painting operators:
                    - f fill using nonzero winding number rule
                    - f*    fill using even-odd rule
                    - B fill then stroke with fill using non-zero winding number rule
                    - B*    fill then stroke with fill using even-odd rule
                    */
                    op = style;
                }
                return op;
            },
            getArrayBuffer = function() {
                var data = buildDocument(), len = data.length,
                    ab = new ArrayBuffer(len), u8 = new Uint8Array(ab);

                while(len--) u8[len] = data.charCodeAt(len);
                return ab;
            },
            getBlob = function() {
                return new Blob([getArrayBuffer()], { type : 'application/pdf' });
            },
            /**
             * Generates the PDF document.
             *
             * If `type` argument is undefined, output is raw body of resulting PDF returned as a string.
             *
             * @param {String} type A string identifying one of the possible output types.
             * @param {Object} options An object providing some additional signalling to PDF generator.
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name output
             */
            output = SAFE(function(type, options) {
                var datauri = ('' + type).substr(0,6) === 'dataur' ? 'data:application/pdf;base64,'+btoa(buildDocument()):0;

                switch (type) {
                    case undefined:
                        return buildDocument();
                    case 'save':
                        if (navigator.getUserMedia) {
                            if (global.URL === undefined || global.URL.createObjectURL === undefined) {
                                return API.output('dataurlnewwindow');
                            }
                        }
                        saveAs(getBlob(), options);
                        if(typeof saveAs.unload === 'function') {
                            if(global.setTimeout) {
                                setTimeout(saveAs.unload,911);
                            }
                        }
                        break;
                    case 'arraybuffer':
                        return getArrayBuffer();
                    case 'blob':
                        return getBlob();
                    case 'bloburi':
                    case 'bloburl':
                        // User is responsible of calling revokeObjectURL
                        return global.URL && global.URL.createObjectURL(getBlob()) || void 0;
                    case 'datauristring':
                    case 'dataurlstring':
                        return datauri;
                    case 'dataurlnewwindow':
                        var nW = global.open(datauri);
                        if (nW || typeof safari === 'undefined') return nW;
                        /* pass through */
                    case 'datauri':
                    case 'dataurl':
                        return global.document.location.href = datauri;
                    default:
                        throw new Error('Output type "' + type + '" is not supported.');
                }
                // @TODO: Add different output options
            });

            switch (unit) {
                case 'pt':  k = 1;          break;
                case 'mm':  k = 72 / 25.4;  break;
                case 'cm':  k = 72 / 2.54;  break;
                case 'in':  k = 72;         break;
                case 'px':  k = 96 / 72;    break;
                case 'pc':  k = 12;         break;
                case 'em':  k = 12;         break;
                case 'ex':  k = 6;          break;
                default:
                    throw ('Invalid unit: ' + unit);
            }

            //---------------------------------------
            // Public API

            /**
             * Object exposing internal API to plugins
             * @public
             */
            API.internal = {
                'pdfEscape' : pdfEscape,
                'getStyle' : getStyle,
                /**
                 * Returns {FontObject} describing a particular font.
                 * @public
                 * @function
                 * @param fontName {String} (Optional) Font's family name
                 * @param fontStyle {String} (Optional) Font's style variation name (Example:"Italic")
                 * @returns {FontObject}
                 */
                'getFont' : function() {
                    return fonts[getFont.apply(API, arguments)];
                },
                'getFontSize' : function() {
                    return activeFontSize;
                },
                'getLineHeight' : function() {
                    return activeFontSize * lineHeightProportion;
                },
                'write' : function(string1 /*, string2, string3, etc */) {
                    out(arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, ' '));
                },
                'getCoordinateString' : function(value) {
                    return f2(value * k);
                },
                'getVerticalCoordinateString' : function(value) {
                    return f2((pageHeight - value) * k);
                },
                'collections' : {},
                'newObject' : newObject,
                'putStream' : putStream,
                'events' : events,
                // ratio that you use in multiplication of a given "size" number to arrive to 'point'
                // units of measurement.
                // scaleFactor is set at initialization of the document and calculated against the stated
                // default measurement units for the document.
                // If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
                // through multiplication.
                'scaleFactor' : k,
                'pageSize' : {
                    get width() {
                        return pageWidth;
                    },
                    get height() {
                        return pageHeight;
                    }
                },
                'output' : function(type, options) {
                    return output(type, options);
                },
                'getNumberOfPages' : function() {
                    return pages.length - 1;
                },
                'pages' : pages
            };

            /**
             * Adds (and transfers the focus to) new page to the PDF document.
             * @function
             * @returns {jsPDF}
             *
             * @methodOf jsPDF#
             * @name addPage
             */
            API.addPage = function() {
                _addPage.apply(this, arguments);
                return this;
            };
            API.setPage = function() {
                _setPage.apply(this, arguments);
                return this;
            };
            API.setDisplayMode = function(zoom, layout, pmode) {
                zoomMode   = zoom;
                layoutMode = layout;
                pageMode   = pmode;
                return this;
            },

            /**
             * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
             *
             * @function
             * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
             * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
             * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
             * @param {Object} flags Collection of settings signalling how the text must be encoded. Defaults are sane. If you think you want to pass some flags, you likely can read the source.
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name text
             */
            API.text = function(text, x, y, flags, angle) {
                /**
                 * Inserts something like this into PDF
                 *   BT
                 *    /F1 16 Tf  % Font name + size
                 *    16 TL % How many units down for next line in multiline text
                 *    0 g % color
                 *    28.35 813.54 Td % position
                 *    (line one) Tj
                 *    T* (line two) Tj
                 *    T* (line three) Tj
                 *   ET
                 */
                function ESC(s) {
                    s = s.split('\t').join(Array(options.TabLen||9).join(' '));
                    return pdfEscape(s, flags);
                }

                // Pre-August-2012 the order of arguments was function(x, y, text, flags)
                // in effort to make all calls have similar signature like
                //   function(data, coordinates... , miscellaneous)
                // this method had its args flipped.
                // code below allows backward compatibility with old arg order.
                if (typeof text === 'number') {
                    tmp = y;
                    y = x;
                    x = text;
                    text = tmp;
                }

                // If there are any newlines in text, we assume
                // the user wanted to print multiple lines, so break the
                // text up into an array.  If the text is already an array,
                // we assume the user knows what they are doing.
                if (typeof text === 'string' && text.match(/[\n\r]/)) {
                    text = text.split(/\r\n|\r|\n/g);
                }
                if (typeof flags === 'number') {
                    angle = flags;
                    flags = null;
                }
                var xtra = '',mode = 'Td', todo;
                if (angle) {
                    angle *= (Math.PI / 180);
                    var c = Math.cos(angle),
                    s = Math.sin(angle);
                    xtra = [f2(c), f2(s), f2(s * -1), f2(c), ''].join(' ');
                    mode = 'Tm';
                }
                flags = flags || {};
                if (!('noBOM' in flags))
                    flags.noBOM = true;
                if (!('autoencode' in flags))
                    flags.autoencode = true;

                if (typeof text === 'string') {
                    text = ESC(text);
                } else if (text instanceof Array) {
                    // we don't want to destroy  original text array, so cloning it
                    var sa = text.concat(), da = [], len = sa.length;
                    // we do array.join('text that must not be PDFescaped")
                    // thus, pdfEscape each component separately
                    while (len--) {
                        da.push(ESC(sa.shift()));
                    }
                    var linesLeft = Math.ceil((pageHeight - y) * k / (activeFontSize * lineHeightProportion));
                    if (0 <= linesLeft && linesLeft < da.length + 1) {
                        todo = da.splice(linesLeft-1);
                    }
                    text = da.join(") Tj\nT* (");
                } else {
                    throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
                }
                // Using "'" ("go next line and render text" mark) would save space but would complicate our rendering code, templates

                // BT .. ET does NOT have default settings for Tf. You must state that explicitely every time for BT .. ET
                // if you want text transformation matrix (+ multiline) to work reliably (which reads sizes of things from font declarations)
                // Thus, there is NO useful, *reliable* concept of "default" font for a page.
                // The fact that "default" (reuse font used before) font worked before in basic cases is an accident
                // - readers dealing smartly with brokenness of jsPDF's markup.
                out(
                    'BT\n/' +
                    activeFontKey + ' ' + activeFontSize + ' Tf\n' +     // font face, style, size
                    (activeFontSize * lineHeightProportion) + ' TL\n' +  // line spacing
                    textColor +
                    '\n' + xtra + f2(x * k) + ' ' + f2((pageHeight - y) * k) + ' ' + mode + '\n(' +
                    text +
                    ') Tj\nET');

                if (todo) {
                    this.addPage();
                    this.text( todo, x, activeFontSize * 1.7 / k);
                }

                return this;
            };

            API.lstext = function(text, x, y, spacing) {
                for (var i = 0, len = text.length ; i < len; i++, x += spacing) this.text(text[i], x, y);
            };

            API.line = function(x1, y1, x2, y2) {
                return this.lines([[x2 - x1, y2 - y1]], x1, y1);
            };

            API.clip = function() {
                // By patrick-roberts, github.com/MrRio/jsPDF/issues/328
                // Call .clip() after calling .rect() with a style argument of null
                out('W'); // clip
                out('S'); // stroke path; necessary for clip to work
            };

            /**
             * Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
             * All data points in `lines` are relative to last line origin.
             * `x`, `y` become x1,y1 for first line / curve in the set.
             * For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
             * For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.
             *
             * @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, 10) // line, line, bezier curve, line
             * @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
             * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
             * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
             * @param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
             * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
             * @param {Boolean} closed If true, the path is closed with a straight line from the end of the last curve to the starting point.
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name lines
             */
            API.lines = function(lines, x, y, scale, style, closed) {
                var scalex,scaley,i,l,leg,x2,y2,x3,y3,x4,y4;

                // Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
                // in effort to make all calls have similar signature like
                //   function(content, coordinateX, coordinateY , miscellaneous)
                // this method had its args flipped.
                // code below allows backward compatibility with old arg order.
                if (typeof lines === 'number') {
                    tmp = y;
                    y = x;
                    x = lines;
                    lines = tmp;
                }

                scale = scale || [1, 1];

                // starting point
                out(f3(x * k) + ' ' + f3((pageHeight - y) * k) + ' m ');

                scalex = scale[0];
                scaley = scale[1];
                l = lines.length;
                //, x2, y2 // bezier only. In page default measurement "units", *after* scaling
                //, x3, y3 // bezier only. In page default measurement "units", *after* scaling
                // ending point for all, lines and bezier. . In page default measurement "units", *after* scaling
                x4 = x; // last / ending point = starting point for first item.
                y4 = y; // last / ending point = starting point for first item.

                for (i = 0; i < l; i++) {
                    leg = lines[i];
                    if (leg.length === 2) {
                        // simple line
                        x4 = leg[0] * scalex + x4; // here last x4 was prior ending point
                        y4 = leg[1] * scaley + y4; // here last y4 was prior ending point
                        out(f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' l');
                    } else {
                        // bezier curve
                        x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
                        y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
                        x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
                        y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
                        x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
                        y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
                        out(
                            f3(x2 * k) + ' ' +
                            f3((pageHeight - y2) * k) + ' ' +
                            f3(x3 * k) + ' ' +
                            f3((pageHeight - y3) * k) + ' ' +
                            f3(x4 * k) + ' ' +
                            f3((pageHeight - y4) * k) + ' c');
                    }
                }

                if (closed) {
                    out(' h');
                }

                // stroking / filling / both the path
                if (style !== null) {
                    out(getStyle(style));
                }
                return this;
            };

            /**
             * Adds a rectangle to PDF
             *
             * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
             * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
             * @param {Number} w Width (in units declared at inception of PDF document)
             * @param {Number} h Height (in units declared at inception of PDF document)
             * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name rect
             */
            API.rect = function(x, y, w, h, style) {
                var op = getStyle(style);
                out([
                        f2(x * k),
                        f2((pageHeight - y) * k),
                        f2(w * k),
                        f2(-h * k),
                        're'
                    ].join(' '));

                if (style !== null) {
                    out(getStyle(style));
                }

                return this;
            };

            /**
             * Adds a triangle to PDF
             *
             * @param {Number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
             * @param {Number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
             * @param {Number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
             * @param {Number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
             * @param {Number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
             * @param {Number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
             * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name triangle
             */
            API.triangle = function(x1, y1, x2, y2, x3, y3, style) {
                this.lines(
                    [
                        [x2 - x1, y2 - y1], // vector to point 2
                        [x3 - x2, y3 - y2], // vector to point 3
                        [x1 - x3, y1 - y3]// closing vector back to point 1
                    ],
                    x1,
                    y1, // start of path
                    [1, 1],
                    style,
                    true);
                return this;
            };

            /**
             * Adds a rectangle with rounded corners to PDF
             *
             * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
             * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
             * @param {Number} w Width (in units declared at inception of PDF document)
             * @param {Number} h Height (in units declared at inception of PDF document)
             * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
             * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
             * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name roundedRect
             */
            API.roundedRect = function(x, y, w, h, rx, ry, style) {
                var MyArc = 4 / 3 * (Math.SQRT2 - 1);
                this.lines(
                    [
                        [(w - 2 * rx), 0],
                        [(rx * MyArc), 0, rx, ry - (ry * MyArc), rx, ry],
                        [0, (h - 2 * ry)],
                        [0, (ry * MyArc),  - (rx * MyArc), ry, -rx, ry],
                        [(-w + 2 * rx), 0],
                        [ - (rx * MyArc), 0, -rx,  - (ry * MyArc), -rx, -ry],
                        [0, (-h + 2 * ry)],
                        [0,  - (ry * MyArc), (rx * MyArc), -ry, rx, -ry]
                    ],
                    x + rx,
                    y, // start of path
                    [1, 1],
                    style);
                return this;
            };

            /**
             * Adds an ellipse to PDF
             *
             * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
             * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
             * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
             * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
             * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name ellipse
             */
            API.ellipse = function(x, y, rx, ry, style) {
                var lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
                    ly = 4 / 3 * (Math.SQRT2 - 1) * ry;

                out([
                        f2((x + rx) * k),
                        f2((pageHeight - y) * k),
                        'm',
                        f2((x + rx) * k),
                        f2((pageHeight - (y - ly)) * k),
                        f2((x + lx) * k),
                        f2((pageHeight - (y - ry)) * k),
                        f2(x * k),
                        f2((pageHeight - (y - ry)) * k),
                        'c'
                    ].join(' '));
                out([
                        f2((x - lx) * k),
                        f2((pageHeight - (y - ry)) * k),
                        f2((x - rx) * k),
                        f2((pageHeight - (y - ly)) * k),
                        f2((x - rx) * k),
                        f2((pageHeight - y) * k),
                        'c'
                    ].join(' '));
                out([
                        f2((x - rx) * k),
                        f2((pageHeight - (y + ly)) * k),
                        f2((x - lx) * k),
                        f2((pageHeight - (y + ry)) * k),
                        f2(x * k),
                        f2((pageHeight - (y + ry)) * k),
                        'c'
                    ].join(' '));
                out([
                        f2((x + lx) * k),
                        f2((pageHeight - (y + ry)) * k),
                        f2((x + rx) * k),
                        f2((pageHeight - (y + ly)) * k),
                        f2((x + rx) * k),
                        f2((pageHeight - y) * k),
                        'c'
                    ].join(' '));

                if (style !== null) {
                    out(getStyle(style));
                }

                return this;
            };

            /**
             * Adds an circle to PDF
             *
             * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
             * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
             * @param {Number} r Radius (in units declared at inception of PDF document)
             * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name circle
             */
            API.circle = function(x, y, r, style) {
                return this.ellipse(x, y, r, r, style);
            };

            /**
             * Adds a properties to the PDF document
             *
             * @param {Object} A property_name-to-property_value object structure.
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name setProperties
             */
            API.setProperties = function(properties) {
                // copying only those properties we can render.
                for (var property in documentProperties) {
                    if (documentProperties.hasOwnProperty(property) && properties[property]) {
                        documentProperties[property] = properties[property];
                    }
                }
                return this;
            };

            /**
             * Sets font size for upcoming text elements.
             *
             * @param {Number} size Font size in points.
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name setFontSize
             */
            API.setFontSize = function(size) {
                activeFontSize = size;
                return this;
            };

            /**
             * Sets text font face, variant for upcoming text elements.
             * See output of jsPDF.getFontList() for possible font names, styles.
             *
             * @param {String} fontName Font name or family. Example: "times"
             * @param {String} fontStyle Font style or variant. Example: "italic"
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name setFont
             */
            API.setFont = function(fontName, fontStyle) {
                activeFontKey = getFont(fontName, fontStyle);
                // if font is not found, the above line blows up and we never go further
                return this;
            };

            /**
             * Switches font style or variant for upcoming text elements,
             * while keeping the font face or family same.
             * See output of jsPDF.getFontList() for possible font names, styles.
             *
             * @param {String} style Font style or variant. Example: "italic"
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name setFontStyle
             */
            API.setFontStyle = API.setFontType = function(style) {
                activeFontKey = getFont(undefined, style);
                // if font is not found, the above line blows up and we never go further
                return this;
            };

            /**
             * Returns an object - a tree of fontName to fontStyle relationships available to
             * active PDF document.
             *
             * @public
             * @function
             * @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
             * @methodOf jsPDF#
             * @name getFontList
             */
            API.getFontList = function() {
                // TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
                var list = {},fontName,fontStyle,tmp;

                for (fontName in fontmap) {
                    if (fontmap.hasOwnProperty(fontName)) {
                        list[fontName] = tmp = [];
                        for (fontStyle in fontmap[fontName]) {
                            if (fontmap[fontName].hasOwnProperty(fontStyle)) {
                                tmp.push(fontStyle);
                            }
                        }
                    }
                }

                return list;
            };

            /**
             * Sets line width for upcoming lines.
             *
             * @param {Number} width Line width (in units declared at inception of PDF document)
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name setLineWidth
             */
            API.setLineWidth = function(width) {
                out((width * k).toFixed(2) + ' w');
                return this;
            };

            /**
             * Sets the stroke color for upcoming elements.
             *
             * Depending on the number of arguments given, Gray, RGB, or CMYK
             * color space is implied.
             *
             * When only ch1 is given, "Gray" color space is implied and it
             * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
             * if values are communicated as String types, or in range from 0 (black)
             * to 255 (white) if communicated as Number type.
             * The RGB-like 0-255 range is provided for backward compatibility.
             *
             * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
             * value must be in the range from 0.00 (minimum intensity) to to 1.00
             * (max intensity) if values are communicated as String types, or
             * from 0 (min intensity) to to 255 (max intensity) if values are communicated
             * as Number types.
             * The RGB-like 0-255 range is provided for backward compatibility.
             *
             * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
             * value must be a in the range from 0.00 (0% concentration) to to
             * 1.00 (100% concentration)
             *
             * Because JavaScript treats fixed point numbers badly (rounds to
             * floating point nearest to binary representation) it is highly advised to
             * communicate the fractional numbers as String types, not JavaScript Number type.
             *
             * @param {Number|String} ch1 Color channel value
             * @param {Number|String} ch2 Color channel value
             * @param {Number|String} ch3 Color channel value
             * @param {Number|String} ch4 Color channel value
             *
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name setDrawColor
             */
            API.setDrawColor = function(ch1, ch2, ch3, ch4) {
                var color;
                if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
                    // Gray color space.
                    if (typeof ch1 === 'string') {
                        color = ch1 + ' G';
                    } else {
                        color = f2(ch1 / 255) + ' G';
                    }
                } else if (ch4 === undefined) {
                    // RGB
                    if (typeof ch1 === 'string') {
                        color = [ch1, ch2, ch3, 'RG'].join(' ');
                    } else {
                        color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'RG'].join(' ');
                    }
                } else {
                    // CMYK
                    if (typeof ch1 === 'string') {
                        color = [ch1, ch2, ch3, ch4, 'K'].join(' ');
                    } else {
                        color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'K'].join(' ');
                    }
                }

                out(color);
                return this;
            };

            /**
             * Sets the fill color for upcoming elements.
             *
             * Depending on the number of arguments given, Gray, RGB, or CMYK
             * color space is implied.
             *
             * When only ch1 is given, "Gray" color space is implied and it
             * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
             * if values are communicated as String types, or in range from 0 (black)
             * to 255 (white) if communicated as Number type.
             * The RGB-like 0-255 range is provided for backward compatibility.
             *
             * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
             * value must be in the range from 0.00 (minimum intensity) to to 1.00
             * (max intensity) if values are communicated as String types, or
             * from 0 (min intensity) to to 255 (max intensity) if values are communicated
             * as Number types.
             * The RGB-like 0-255 range is provided for backward compatibility.
             *
             * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
             * value must be a in the range from 0.00 (0% concentration) to to
             * 1.00 (100% concentration)
             *
             * Because JavaScript treats fixed point numbers badly (rounds to
             * floating point nearest to binary representation) it is highly advised to
             * communicate the fractional numbers as String types, not JavaScript Number type.
             *
             * @param {Number|String} ch1 Color channel value
             * @param {Number|String} ch2 Color channel value
             * @param {Number|String} ch3 Color channel value
             * @param {Number|String} ch4 Color channel value
             *
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name setFillColor
             */
            API.setFillColor = function(ch1, ch2, ch3, ch4) {
                var color;

                if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
                    // Gray color space.
                    if (typeof ch1 === 'string') {
                        color = ch1 + ' g';
                    } else {
                        color = f2(ch1 / 255) + ' g';
                    }
                } else if (ch4 === undefined) {
                    // RGB
                    if (typeof ch1 === 'string') {
                        color = [ch1, ch2, ch3, 'rg'].join(' ');
                    } else {
                        color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'rg'].join(' ');
                    }
                } else {
                    // CMYK
                    if (typeof ch1 === 'string') {
                        color = [ch1, ch2, ch3, ch4, 'k'].join(' ');
                    } else {
                        color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'k'].join(' ');
                    }
                }

                out(color);
                return this;
            };

            /**
             * Sets the text color for upcoming elements.
             * If only one, first argument is given,
             * treats the value as gray-scale color value.
             *
             * @param {Number} r Red channel color value in range 0-255 or {String} r color value in hexadecimal, example: '#FFFFFF'
             * @param {Number} g Green channel color value in range 0-255
             * @param {Number} b Blue channel color value in range 0-255
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name setTextColor
             */
            API.setTextColor = function(r, g, b) {
                if ((typeof r === 'string') && /^#[0-9A-Fa-f]{6}$/.test(r)) {
                    var hex = parseInt(r.substr(1), 16);
                    r = (hex >> 16) & 255;
                    g = (hex >> 8) & 255;
                    b = (hex & 255);
                }

                if ((r === 0 && g === 0 && b === 0) || (typeof g === 'undefined')) {
                    textColor = f3(r / 255) + ' g';
                } else {
                    textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
                }
                return this;
            };

            /**
             * Is an Object providing a mapping from human-readable to
             * integer flag values designating the varieties of line cap
             * and join styles.
             *
             * @returns {Object}
             * @fieldOf jsPDF#
             * @name CapJoinStyles
             */
            API.CapJoinStyles = {
                0 : 0,
                'butt' : 0,
                'but' : 0,
                'miter' : 0,
                1 : 1,
                'round' : 1,
                'rounded' : 1,
                'circle' : 1,
                2 : 2,
                'projecting' : 2,
                'project' : 2,
                'square' : 2,
                'bevel' : 2
            };

            /**
             * Sets the line cap styles
             * See {jsPDF.CapJoinStyles} for variants
             *
             * @param {String|Number} style A string or number identifying the type of line cap
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name setLineCap
             */
            API.setLineCap = function(style) {
                var id = this.CapJoinStyles[style];
                if (id === undefined) {
                    throw new Error('Line cap style of \'' + style + '\' is not recognized. See or extend .CapJoinStyles property for valid styles');
                }
                lineCapID = id;
                out(id + ' J');

                return this;
            };

            /**
             * Sets the line join styles
             * See {jsPDF.CapJoinStyles} for variants
             *
             * @param {String|Number} style A string or number identifying the type of line join
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name setLineJoin
             */
            API.setLineJoin = function(style) {
                var id = this.CapJoinStyles[style];
                if (id === undefined) {
                    throw new Error('Line join style of \'' + style + '\' is not recognized. See or extend .CapJoinStyles property for valid styles');
                }
                lineJoinID = id;
                out(id + ' j');

                return this;
            };

            // Output is both an internal (for plugins) and external function
            API.output = output;

            /**
             * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf')
             * @param  {String} filename The filename including extension.
             *
             * @function
             * @returns {jsPDF}
             * @methodOf jsPDF#
             * @name save
             */
            API.save = function(filename) {
                API.output('save', filename);
            };

            // applying plugins (more methods) ON TOP of built-in API.
            // this is intentional as we allow plugins to override
            // built-ins
            for (var plugin in jsPDF.API) {
                if (jsPDF.API.hasOwnProperty(plugin)) {
                    if (plugin === 'events' && jsPDF.API.events.length) {
                        (function(events, newEvents) {

                            // jsPDF.API.events is a JS Array of Arrays
                            // where each Array is a pair of event name, handler
                            // Events were added by plugins to the jsPDF instantiator.
                            // These are always added to the new instance and some ran
                            // during instantiation.
                            var eventname,handler_and_args,i;

                            for (i = newEvents.length - 1; i !== -1; i--) {
                                // subscribe takes 3 args: 'topic', function, runonce_flag
                                // if undefined, runonce is false.
                                // users can attach callback directly,
                                // or they can attach an array with [callback, runonce_flag]
                                // that's what the "apply" magic is for below.
                                eventname = newEvents[i][0];
                                handler_and_args = newEvents[i][1];
                                events.subscribe.apply(
                                    events,
                                    [eventname].concat(
                                        typeof handler_and_args === 'function' ?
                                            [handler_and_args] : handler_and_args));
                            }
                        }(events, jsPDF.API.events));
                    } else {
                        API[plugin] = jsPDF.API[plugin];
                    }
                }
            }

            //////////////////////////////////////////////////////
            // continuing initialization of jsPDF Document object
            //////////////////////////////////////////////////////
            // Add the first page automatically
            addFonts();
            activeFontKey = 'F1';
            _addPage(format, orientation);

            events.publish('initialized');
            return API;
        }

        /**
         * jsPDF.API is a STATIC property of jsPDF class.
         * jsPDF.API is an object you can add methods and properties to.
         * The methods / properties you add will show up in new jsPDF objects.
         *
         * One property is prepopulated. It is the 'events' Object. Plugin authors can add topics,
         * callbacks to this object. These will be reassigned to all new instances of jsPDF.
         * Examples:
         * jsPDF.API.events['initialized'] = function(){ 'this' is API object }
         * jsPDF.API.events['addFont'] = function(added_font_object){ 'this' is API object }
         *
         * @static
         * @public
         * @memberOf jsPDF
         * @name API
         *
         * @example
         * jsPDF.API.mymethod = function(){
         *   // 'this' will be ref to internal API object. see jsPDF source
         *   // , so you can refer to built-in methods like so:
         *   //     this.line(....)
         *   //     this.text(....)
         * }
         * var pdfdoc = new jsPDF()
         * pdfdoc.mymethod() // <- !!!!!!
         */
        jsPDF.API = {events:[]};
        jsPDF.version = '1.0.272-debug 2014-09-29T15:09:diegocr';

        if (typeof define === 'function' && define.amd) {
            define('jsPDF', function() {
                return jsPDF;
            });
        } else {
            global.jsPDF = jsPDF;
        }
        return jsPDF;
    }(typeof self !== 'undefined' && self || typeof window !== 'undefined' && window || this));
    /**
     * jsPDF addHTML PlugIn
     * Copyright (c) 2014 Diego Casorran
     *
     * Licensed under the MIT License.
     * http://opensource.org/licenses/mit-license
     */

    (function (jsPDFAPI) {
        'use strict';

        /**
         * Renders an HTML element to canvas object which added as an image to the PDF
         *
         * This PlugIn requires html2canvas: https://github.com/niklasvh/html2canvas
         *            OR rasterizeHTML: https://github.com/cburgmer/rasterizeHTML.js
         *
         * @public
         * @function
         * @param element {Mixed} HTML Element, or anything supported by html2canvas.
         * @param x {Number} starting X coordinate in jsPDF instance's declared units.
         * @param y {Number} starting Y coordinate in jsPDF instance's declared units.
         * @param options {Object} Additional options, check the code below.
         * @param callback {Function} to call when the rendering has finished.
         *
         * NOTE: Every parameter is optional except 'element' and 'callback', in such
         *       case the image is positioned at 0x0 covering the whole PDF document
         *       size. Ie, to easily take screenshoots of webpages saving them to PDF.
         */
        jsPDFAPI.addHTML = function (element, x, y, options, callback) {
            // 'use strict';

            if(typeof html2canvas === 'undefined' && typeof rasterizeHTML === 'undefined')
                throw new Error('You need either ' + 
                    'https://github.com/niklasvh/html2canvas' + 
                    ' or https://github.com/cburgmer/rasterizeHTML.js');

            if(typeof x !== 'number') {
                options = x;
                callback = y;
            }

            if(typeof options === 'function') {
                callback = options;
                options = null;
            }

            var I = this.internal, K = I.scaleFactor, W = I.pageSize.width, H = I.pageSize.height;

            options = options || {};
            options.onrendered = function(obj) {
                x = parseInt(x) || 0;
                y = parseInt(y) || 0;
                var dim = options.dim || {};
                var h = dim.h || 0;
                var w = dim.w || Math.min(W,obj.width/K) - x;

                var format = 'JPEG';
                if(options.format)
                    format = options.format;

                if(obj.height > H && options.pagesplit) {
                    var crop = function() {
                        var cy = 0;
                        while(1) {
                            var canvas = document.createElement('canvas');
                            canvas.width = Math.min(W*K,obj.width);
                            canvas.height = Math.min(H*K,obj.height-cy);
                            var ctx = canvas.getContext('2d');
                            ctx.drawImage(obj,0,cy,obj.width,canvas.height,0,0,canvas.width,canvas.height);
                            var args = [canvas, x,cy?0:y,canvas.width/K,canvas.height/K, format,null,'SLOW'];
                            this.addImage.apply(this, args);
                            cy += canvas.height;
                            if(cy >= obj.height) break;
                            this.addPage();
                        }
                        callback(w,cy,null,args);
                    }.bind(this);

                    if(obj.nodeName === 'CANVAS') {
                        var img = new Image();
                        img.onload = crop;
                        img.src = obj.toDataURL('image/png');
                        obj = img;
                    } else {
                        crop();
                    }
                } else {
                    var alias = Math.random().toString(35);
                    var args = [obj, x,y,w,h, format,alias,'SLOW'];

                    this.addImage.apply(this, args);

                    callback(w,h,alias,args);
                }
            }.bind(this);

            if(typeof html2canvas !== 'undefined' && !options.rstz) {
                return html2canvas(element, options);
            }

            if(typeof rasterizeHTML !== 'undefined') {
                var meth = 'drawDocument';
                if(typeof element === 'string') {
                    meth = /^http/.test(element) ? 'drawURL' : 'drawHTML';
                }
                options.width = options.width || (W*K);
                return rasterizeHTML[meth](element, void 0, options).then(function(r) {
                    options.onrendered(r.image);
                }, function(e) {
                    callback(null,e);
                });
            }

            return null;
        };
    })(jsPDF.API);
    /** @preserve
     * jsPDF addImage plugin
     * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
     *               2013 Chris Dowling, https://github.com/gingerchris
     *               2013 Trinh Ho, https://github.com/ineedfat
     *               2013 Edwin Alejandro Perez, https://github.com/eaparango
     *               2013 Norah Smith, https://github.com/burnburnrocket
     *               2014 Diego Casorran, https://github.com/diegocr
     *               2014 James Robb, https://github.com/jamesbrobb
     *
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */

    ;(function(jsPDFAPI) {
        'use strict';

        var namespace = 'addImage_',
            supported_image_types = ['jpeg', 'jpg', 'png'];

        // Image functionality ported from pdf.js
        var putImage = function(img) {

            var objectNumber = this.internal.newObject(),
                out = this.internal.write,
                putStream = this.internal.putStream;

            img.n = objectNumber;

            out('<</Type /XObject');
            out('/Subtype /Image');
            out('/Width ' + img.w);
            out('/Height ' + img.h);
            
            if (img.cs === this.color_spaces.INDEXED) {
                out('/ColorSpace [/Indexed /DeviceRGB ' +
                        // if an indexed png defines more than one colour with transparency, we've created a smask
                        (img.pal.length / 3 - 1) + ' ' + ('smask' in img ? objectNumber + 2 : objectNumber + 1) +
                        ' 0 R]');
            } else {
                out('/ColorSpace /' + img.cs);
                if (img.cs === this.color_spaces.DEVICE_CMYK) {
                    out('/Decode [1 0 1 0 1 0 1 0]');
                }
            }
            out('/BitsPerComponent ' + img.bpc);
            if ('f' in img) {
                out('/Filter /' + img.f);
            }
            if ('dp' in img) {
                out('/DecodeParms <<' + img.dp + '>>');
            }
            if ('trns' in img && img.trns.constructor == Array) {
                var trns = '',
                    i = 0,
                    len = img.trns.length;
                for (; i < len; i++)
                    trns += (img.trns[i] + ' ' + img.trns[i] + ' ');
                out('/Mask [' + trns + ']');
            }
            if ('smask' in img) {
                out('/SMask ' + (objectNumber + 1) + ' 0 R');
            }
            out('/Length ' + img.data.length + '>>');

            putStream(img.data);

            out('endobj');

            // Soft mask
            if ('smask' in img) {
                var dp = '/Predictor 15 /Colors 1 /BitsPerComponent ' + img.bpc + ' /Columns ' + img.w;
                var smask = {'w': img.w, 'h': img.h, 'cs': 'DeviceGray', 'bpc': img.bpc, 'dp': dp, 'data': img.smask};
                if ('f' in img)
                    smask.f = img.f;
                putImage.call(this, smask);
            }

            //Palette
            if (img.cs === this.color_spaces.INDEXED) {

                this.internal.newObject();
                //out('<< /Filter / ' + img.f +' /Length ' + img.pal.length + '>>');
                //putStream(zlib.compress(img.pal));
                out('<< /Length ' + img.pal.length + '>>');
                putStream(this.arrayBufferToBinaryString(new Uint8Array(img.pal)));
                out('endobj');
            }
        },
        putResourcesCallback = function() {
            var images = this.internal.collections[namespace + 'images'];
            for ( var i in images ) {
                putImage.call(this, images[i]);
            }
        },
        putXObjectsDictCallback = function(){
            var images = this.internal.collections[namespace + 'images'],
                out = this.internal.write,
                image;
            for (var i in images) {
                image = images[i];
                out('/I' + image.i, image.n, '0', 'R');
            }
        },
        checkCompressValue = function(value) {
            if(value && typeof value === 'string')
                value = value.toUpperCase();
            return value in jsPDFAPI.image_compression ? value : jsPDFAPI.image_compression.NONE;
        },
        getImages = function() {
            var images = this.internal.collections[namespace + 'images'];
            //first run, so initialise stuff
            if(!images) {
                this.internal.collections[namespace + 'images'] = images = {};
                this.internal.events.subscribe('putResources', putResourcesCallback);
                this.internal.events.subscribe('putXobjectDict', putXObjectsDictCallback);
            }

            return images;
        },
        getImageIndex = function(images) {
            var imageIndex = 0;

            if (images){
                // this is NOT the first time this method is ran on this instance of jsPDF object.
                imageIndex = Object.keys ?
                Object.keys(images).length :
                (function(o){
                    var i = 0;
                    for (var e in o){
                        if (o.hasOwnProperty(e)){i++; }}
                    return i
                })(images);
            }

            return imageIndex;
        },
        notDefined = function(value) {
            return typeof value === 'undefined' || value === null;
        },
        generateAliasFromData = function(data) {
            return typeof data === 'string' && jsPDFAPI.sHashCode(data);
        },
        doesNotSupportImageType = function(type) {
            return supported_image_types.indexOf(type) === -1;
        },
        processMethodNotEnabled = function(type) {
            return typeof jsPDFAPI['process' + type.toUpperCase()] !== 'function';
        },
        isDOMElement = function(object) {
            return typeof object === 'object' && object.nodeType === 1;
        },
        createDataURIFromElement = function(element, format, angle) {

            //if element is an image which uses data url defintion, just return the dataurl
            if (element.nodeName === 'IMG' && element.hasAttribute('src')) {
                var src = ''+element.getAttribute('src');
                if (!angle && src.indexOf('data:image/') === 0) return src;

                // only if the user doesn't care about a format
                if (!format && /\.png(?:[?#].*)?$/i.test(src)) format = 'png';
            }

            if ( element.nodeName === 'CANVAS' ) {
                var canvas = element;
            } else {
                var canvas = document.createElement('canvas');
                canvas.width = element.clientWidth || element.width;
                canvas.height = element.clientHeight || element.height;

                var ctx = canvas.getContext('2d');
                if (!ctx) {
                    throw ('addImage requires canvas to be supported by browser.');
                }
                if (angle) {
                    var x, y, b, c, s, w, h, to_radians = Math.PI/180, angleInRadians;

                    if (typeof angle === 'object') {
                        x = angle.x;
                        y = angle.y;
                        b = angle.bg;
                        angle = angle.angle;
                    }
                    angleInRadians = angle*to_radians;
                    c = Math.abs(Math.cos(angleInRadians));
                    s = Math.abs(Math.sin(angleInRadians));
                    w = canvas.width;
                    h = canvas.height;
                    canvas.width = h * s + w * c;
                    canvas.height = h * c + w * s;

                    if (isNaN(x)) x = canvas.width / 2;
                    if (isNaN(y)) y = canvas.height / 2;

                    ctx.clearRect(0,0,canvas.width, canvas.height);
                    ctx.fillStyle = b || 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angleInRadians);
                    ctx.drawImage(element, -(w/2), -(h/2));
                    ctx.rotate(-angleInRadians);
                    ctx.translate(-x, -y);
                    ctx.restore();
                } else {
                    ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
                }
            }
            return canvas.toDataURL((''+format).toLowerCase() == 'png' ? 'image/png' : 'image/jpeg');
        },
        checkImagesForAlias = function(alias, images) {
            var cached_info;
            if(images) {
                for(var e in images) {
                    if(alias === images[e].alias) {
                        cached_info = images[e];
                        break;
                    }
                }
            }
            return cached_info;
        },
        determineWidthAndHeight = function(w, h, info) {
            if (!w && !h) {
                w = -96;
                h = -96;
            }
            if (w < 0) {
                w = (-1) * info.w * 72 / w / this.internal.scaleFactor;
            }
            if (h < 0) {
                h = (-1) * info.h * 72 / h / this.internal.scaleFactor;
            }
            if (w === 0) {
                w = h * info.w / info.h;
            }
            if (h === 0) {
                h = w * info.h / info.w;
            }

            return [w, h];
        },
        writeImageToPDF = function(x, y, w, h, info, index, images) {
            var dims = determineWidthAndHeight.call(this, w, h, info),
                coord = this.internal.getCoordinateString,
                vcoord = this.internal.getVerticalCoordinateString;

            w = dims[0];
            h = dims[1];

            images[index] = info;

            this.internal.write(
                'q',
                coord(w),
                '0 0',
                coord(h), // TODO: check if this should be shifted by vcoord,
                coord(x),
                vcoord(y + h),
                'cm /I'+info.i,
                'Do Q'
            );
        };

        /**
         * COLOR SPACES
         */
        jsPDFAPI.color_spaces = {
            DEVICE_RGB:'DeviceRGB',
            DEVICE_GRAY:'DeviceGray',
            DEVICE_CMYK:'DeviceCMYK',
            CAL_GREY:'CalGray',
            CAL_RGB:'CalRGB',
            LAB:'Lab',
            ICC_BASED:'ICCBased',
            INDEXED:'Indexed',
            PATTERN:'Pattern',
            SEPERATION:'Seperation',
            DEVICE_N:'DeviceN'
        };

        /**
         * DECODE METHODS
         */
        jsPDFAPI.decode = {
            DCT_DECODE:'DCTDecode',
            FLATE_DECODE:'FlateDecode',
            LZW_DECODE:'LZWDecode',
            JPX_DECODE:'JPXDecode',
            JBIG2_DECODE:'JBIG2Decode',
            ASCII85_DECODE:'ASCII85Decode',
            ASCII_HEX_DECODE:'ASCIIHexDecode',
            RUN_LENGTH_DECODE:'RunLengthDecode',
            CCITT_FAX_DECODE:'CCITTFaxDecode'
        };

        /**
         * IMAGE COMPRESSION TYPES
         */
        jsPDFAPI.image_compression = {
            NONE: 'NONE',
            FAST: 'FAST',
            MEDIUM: 'MEDIUM',
            SLOW: 'SLOW'
        };

        jsPDFAPI.sHashCode = function(str) {
            return Array.prototype.reduce && str.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
        };

        jsPDFAPI.isString = function(object) {
            return typeof object === 'string';
        };

        /**
         * Strips out and returns info from a valid base64 data URI
         * @param {String[dataURI]} a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
         * @returns an Array containing the following
         * [0] the complete data URI
         * [1] <MIME-type>
         * [2] format - the second part of the mime-type i.e 'png' in 'image/png'
         * [4] <data>
         */
        jsPDFAPI.extractInfoFromBase64DataURI = function(dataURI) {
            return /^data:([\w]+?\/([\w]+?));base64,(.+?)$/g.exec(dataURI);
        };

        /**
         * Check to see if ArrayBuffer is supported
         */
        jsPDFAPI.supportsArrayBuffer = function() {
            return typeof ArrayBuffer !== 'undefined' && typeof Uint8Array !== 'undefined';
        };

        /**
         * Tests supplied object to determine if ArrayBuffer
         * @param {Object[object]}
         */
        jsPDFAPI.isArrayBuffer = function(object) {
            if(!this.supportsArrayBuffer())
                return false;
            return object instanceof ArrayBuffer;
        };

        /**
         * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
         * @param {Object[object]}
         */
        jsPDFAPI.isArrayBufferView = function(object) {
            if(!this.supportsArrayBuffer())
                return false;
            if(typeof Uint32Array === 'undefined')
                return false;
            return (object instanceof Int8Array ||
                    object instanceof Uint8Array ||
                    (typeof Uint8ClampedArray !== 'undefined' && object instanceof Uint8ClampedArray) ||
                    object instanceof Int16Array ||
                    object instanceof Uint16Array ||
                    object instanceof Int32Array ||
                    object instanceof Uint32Array ||
                    object instanceof Float32Array ||
                    object instanceof Float64Array );
        };

        /**
         * Exactly what it says on the tin
         */
        jsPDFAPI.binaryStringToUint8Array = function(binary_string) {
            /*
             * not sure how efficient this will be will bigger files. Is there a native method?
             */
            var len = binary_string.length;
            var bytes = new Uint8Array( len );
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes;
        };

        /**
         * @see this discussion
         * http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
         *
         * As stated, i imagine the method below is highly inefficent for large files.
         *
         * Also of note from Mozilla,
         *
         * "However, this is slow and error-prone, due to the need for multiple conversions (especially if the binary data is not actually byte-format data, but, for example, 32-bit integers or floats)."
         *
         * https://developer.mozilla.org/en-US/Add-ons/Code_snippets/StringView
         *
         * Although i'm strugglig to see how StringView solves this issue? Doesn't appear to be a direct method for conversion?
         *
         * Async method using Blob and FileReader could be best, but i'm not sure how to fit it into the flow?
         */
        jsPDFAPI.arrayBufferToBinaryString = function(buffer) {
            if(this.isArrayBuffer(buffer))
                buffer = new Uint8Array(buffer);

            var binary_string = '';
            var len = buffer.byteLength;
            for (var i = 0; i < len; i++) {
                binary_string += String.fromCharCode(buffer[i]);
            }
            return binary_string;
            /*
             * Another solution is the method below - convert array buffer straight to base64 and then use atob
             */
            //return atob(this.arrayBufferToBase64(buffer));
        };

        /**
         * Converts an ArrayBuffer directly to base64
         *
         * Taken from here
         *
         * http://jsperf.com/encoding-xhr-image-data/31
         *
         * Need to test if this is a better solution for larger files
         *
         */
        jsPDFAPI.arrayBufferToBase64 = function(arrayBuffer) {
            var base64    = '',
                encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

                bytes         = new Uint8Array(arrayBuffer),
                byteLength    = bytes.byteLength,
                byteRemainder = byteLength % 3,
                mainLength    = byteLength - byteRemainder,

                a, b, c, d,
                chunk;

            // Main loop deals with bytes in chunks of 3
            for (var i = 0; i < mainLength; i = i + 3) {
                // Combine the three bytes into a single integer
                chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

                // Use bitmasks to extract 6-bit segments from the triplet
                a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
                b = (chunk & 258048)   >> 12; // 258048   = (2^6 - 1) << 12
                c = (chunk & 4032)     >>  6; // 4032     = (2^6 - 1) << 6
                d = chunk & 63;               // 63       = 2^6 - 1

                // Convert the raw binary segments to the appropriate ASCII encoding
                base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
            }

            // Deal with the remaining bytes and padding
            if (byteRemainder == 1) {
                chunk = bytes[mainLength];

                a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

                // Set the 4 least significant bits to zero
                b = (chunk & 3)   << 4; // 3   = 2^2 - 1

                base64 += encodings[a] + encodings[b] + '==';
            } else if (byteRemainder == 2) {
                chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

                a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
                b = (chunk & 1008)  >>  4; // 1008  = (2^6 - 1) << 4

                // Set the 2 least significant bits to zero
                c = (chunk & 15)    <<  2; // 15    = 2^4 - 1

                base64 += encodings[a] + encodings[b] + encodings[c] + '=';
            }

            return base64;
        };

        jsPDFAPI.createImageInfo = function(data, wd, ht, cs, bpc, f, imageIndex, alias, dp, trns, pal, smask) {
            var info = {
                    alias:alias,
                    w : wd,
                    h : ht,
                    cs : cs,
                    bpc : bpc,
                    i : imageIndex,
                    data : data
                    // n: objectNumber will be added by putImage code
                };

            if(f) info.f = f;
            if(dp) info.dp = dp;
            if(trns) info.trns = trns;
            if(pal) info.pal = pal;
            if(smask) info.smask = smask;

            return info;
        };

        jsPDFAPI.addImage = function(imageData, format, x, y, w, h, alias, compression, rotation) {
            // 'use strict'

            if(typeof format !== 'string') {
                var tmp = h;
                h = w;
                w = y;
                y = x;
                x = format;
                format = tmp;
            }

            if (typeof imageData === 'object' && !isDOMElement(imageData) && 'imageData' in imageData) {
                var options = imageData;

                imageData = options.imageData;
                format = options.format || format;
                x = options.x || x || 0;
                y = options.y || y || 0;
                w = options.w || w;
                h = options.h || h;
                alias = options.alias || alias;
                compression = options.compression || compression;
                rotation = options.rotation || options.angle || rotation;
            }

            if (isNaN(x) || isNaN(y))
            {
                console.error('jsPDF.addImage: Invalid coordinates', arguments);
                throw new Error('Invalid coordinates passed to jsPDF.addImage');
            }

            var images = getImages.call(this), info;

            if (!(info = checkImagesForAlias(imageData, images))) {
                var dataAsBinaryString;

                if(isDOMElement(imageData))
                    imageData = createDataURIFromElement(imageData, format, rotation);

                if(notDefined(alias))
                    alias = generateAliasFromData(imageData);

                if (!(info = checkImagesForAlias(alias, images))) {

                    if(this.isString(imageData)) {

                        var base64Info = this.extractInfoFromBase64DataURI(imageData);

                        if(base64Info) {

                            format = base64Info[2];
                            imageData = atob(base64Info[3]);//convert to binary string

                        } else {

                            if (imageData.charCodeAt(0) === 0x89 &&
                                imageData.charCodeAt(1) === 0x50 &&
                                imageData.charCodeAt(2) === 0x4e &&
                                imageData.charCodeAt(3) === 0x47  )  format = 'png';
                        }
                    }
                    format = (format || 'JPEG').toLowerCase();

                    if(doesNotSupportImageType(format))
                        throw new Error('addImage currently only supports formats ' + supported_image_types + ', not \''+format+'\'');

                    if(processMethodNotEnabled(format))
                        throw new Error('please ensure that the plugin for \''+format+'\' support is added');

                    /**
                     * need to test if it's more efficent to convert all binary strings
                     * to TypedArray - or should we just leave and process as string?
                     */
                    if(this.supportsArrayBuffer()) {
                        dataAsBinaryString = imageData;
                        imageData = this.binaryStringToUint8Array(imageData);
                    }

                    info = this['process' + format.toUpperCase()](
                        imageData,
                        getImageIndex(images),
                        alias,
                        checkCompressValue(compression),
                        dataAsBinaryString
                    );

                    if(!info)
                        throw new Error('An unkwown error occurred whilst processing the image');
                }
            }

            writeImageToPDF.call(this, x, y, w, h, info, info.i, images);

            return this;
        };

        /**
         * JPEG SUPPORT
         **/

        //takes a string imgData containing the raw bytes of
        //a jpeg image and returns [width, height]
        //Algorithm from: http://www.64lines.com/jpeg-width-height
        var getJpegSize = function(imgData) {
            // 'use strict'
            var width, height, numcomponents;
            // Verify we have a valid jpeg header 0xff,0xd8,0xff,0xe0,?,?,'J','F','I','F',0x00
            if (!imgData.charCodeAt(0) === 0xff ||
                !imgData.charCodeAt(1) === 0xd8 ||
                !imgData.charCodeAt(2) === 0xff ||
                !imgData.charCodeAt(3) === 0xe0 ||
                !imgData.charCodeAt(6) === 'J'.charCodeAt(0) ||
                !imgData.charCodeAt(7) === 'F'.charCodeAt(0) ||
                !imgData.charCodeAt(8) === 'I'.charCodeAt(0) ||
                !imgData.charCodeAt(9) === 'F'.charCodeAt(0) ||
                !imgData.charCodeAt(10) === 0x00) {
                    throw new Error('getJpegSize requires a binary string jpeg file')
            }
            var blockLength = imgData.charCodeAt(4)*256 + imgData.charCodeAt(5);
            var i = 4, len = imgData.length;
            while ( i < len ) {
                i += blockLength;
                if (imgData.charCodeAt(i) !== 0xff) {
                    throw new Error('getJpegSize could not find the size of the image');
                }
                if (imgData.charCodeAt(i+1) === 0xc0 || //(SOF) Huffman  - Baseline DCT
                    imgData.charCodeAt(i+1) === 0xc1 || //(SOF) Huffman  - Extended sequential DCT
                    imgData.charCodeAt(i+1) === 0xc2 || // Progressive DCT (SOF2)
                    imgData.charCodeAt(i+1) === 0xc3 || // Spatial (sequential) lossless (SOF3)
                    imgData.charCodeAt(i+1) === 0xc4 || // Differential sequential DCT (SOF5)
                    imgData.charCodeAt(i+1) === 0xc5 || // Differential progressive DCT (SOF6)
                    imgData.charCodeAt(i+1) === 0xc6 || // Differential spatial (SOF7)
                    imgData.charCodeAt(i+1) === 0xc7) {
                    height = imgData.charCodeAt(i+5)*256 + imgData.charCodeAt(i+6);
                    width = imgData.charCodeAt(i+7)*256 + imgData.charCodeAt(i+8);
                    numcomponents = imgData.charCodeAt(i+9);
                    return [width, height, numcomponents];
                } else {
                    i += 2;
                    blockLength = imgData.charCodeAt(i)*256 + imgData.charCodeAt(i+1)
                }
            }
        },
        getJpegSizeFromBytes = function(data) {

            var hdr = (data[0] << 8) | data[1];

            if(hdr !== 0xFFD8)
                throw new Error('Supplied data is not a JPEG');

            var len = data.length,
                block = (data[4] << 8) + data[5],
                pos = 4,
                bytes, width, height, numcomponents;

            while(pos < len) {
                pos += block;
                bytes = readBytes(data, pos);
                block = (bytes[2] << 8) + bytes[3];
                if((bytes[1] === 0xC0 || bytes[1] === 0xC2) && bytes[0] === 0xFF && block > 7) {
                    bytes = readBytes(data, pos + 5);
                    width = (bytes[2] << 8) + bytes[3];
                    height = (bytes[0] << 8) + bytes[1];
                    numcomponents = bytes[4];
                    return {width:width, height:height, numcomponents: numcomponents};
                }

                pos+=2;
            }

            throw new Error('getJpegSizeFromBytes could not find the size of the image');
        },
        readBytes = function(data, offset) {
            return data.subarray(offset, offset+ 5);
        };

        jsPDFAPI.processJPEG = function(data, index, alias, compression, dataAsBinaryString) {
            // 'use strict'
            var colorSpace = this.color_spaces.DEVICE_RGB,
                filter = this.decode.DCT_DECODE,
                bpc = 8,
                dims;

            if(this.isString(data)) {
                dims = getJpegSize(data);
                return this.createImageInfo(data, dims[0], dims[1], dims[3] == 1 ? this.color_spaces.DEVICE_GRAY:colorSpace, bpc, filter, index, alias);
            }

            if(this.isArrayBuffer(data))
                data = new Uint8Array(data);

            if(this.isArrayBufferView(data)) {

                dims = getJpegSizeFromBytes(data);

                // if we already have a stored binary string rep use that
                data = dataAsBinaryString || this.arrayBufferToBinaryString(data);

                return this.createImageInfo(data, dims.width, dims.height, dims.numcomponents == 1 ? this.color_spaces.DEVICE_GRAY:colorSpace, bpc, filter, index, alias);
            }

            return null;
        };

        jsPDFAPI.processJPG = function(/*data, index, alias, compression, dataAsBinaryString*/) {
            return this.processJPEG.apply(this, arguments);
        };

    })(jsPDF.API);
    
    (function (jsPDFAPI) {
        'use strict';

        jsPDFAPI.autoPrint = function () {
            // 'use strict'
            var refAutoPrintTag;

            this.internal.events.subscribe('postPutResources', function () {
                refAutoPrintTag = this.internal.newObject();
                    this.internal.write('<< /S/Named /Type/Action /N/Print >>', 'endobj');
            });

            this.internal.events.subscribe('putCatalog', function () {
                this.internal.write('/OpenAction ' + refAutoPrintTag + ' 0' + ' R');
            });
            return this;
        };
    })(jsPDF.API);
    /** ====================================================================
     * jsPDF Cell plugin
     * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
     *               2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
     *               2013 Lee Driscoll, https://github.com/lsdriscoll
     *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
     *               2014 James Hall, james@parall.ax
     *               2014 Diego Casorran, https://github.com/diegocr
     *
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     * ====================================================================
     */

    (function (jsPDFAPI) {
        'use strict';
        /*jslint browser:true */
        /*global document: false, jsPDF */

        var fontName,
            fontSize,
            fontStyle,
            padding = 3,
            margin = 13,
            headerFunction,
            lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined },
            pages = 1,
            setLastCellPosition = function (x, y, w, h, ln) {
                lastCellPos = { 'x': x, 'y': y, 'w': w, 'h': h, 'ln': ln };
            },
            getLastCellPosition = function () {
                return lastCellPos;
            },
            NO_MARGINS = {left:0, top:0, bottom: 0};

        jsPDFAPI.setHeaderFunction = function (func) {
            headerFunction = func;
        };

        jsPDFAPI.getTextDimensions = function (txt) {
            fontName = this.internal.getFont().fontName;
            fontSize = this.table_font_size || this.internal.getFontSize();
            fontStyle = this.internal.getFont().fontStyle;
            // 1 pixel = 0.264583 mm and 1 mm = 72/25.4 point
            var px2pt = 0.264583 * 72 / 25.4,
                dimensions,
                text;

            text = document.createElement('font');
            text.id = 'jsPDFCell';
            text.style.fontStyle = fontStyle;
            text.style.fontName = fontName;
            text.style.fontSize = fontSize + 'pt';
            text.textContent = txt;

            document.body.appendChild(text);

            dimensions = { w: (text.offsetWidth + 1) * px2pt, h: (text.offsetHeight + 1) * px2pt};

            document.body.removeChild(text);

            return dimensions;
        };

        jsPDFAPI.cellAddPage = function () {
            var margins = this.margins || NO_MARGINS;

            this.addPage();

            setLastCellPosition(margins.left, margins.top, undefined, undefined);
            //setLastCellPosition(undefined, undefined, undefined, undefined, undefined);
            pages += 1;
        };

        jsPDFAPI.cellInitialize = function () {
            lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined };
            pages = 1;
        };

        jsPDFAPI.cell = function (x, y, w, h, txt, ln, align) {
            var curCell = getLastCellPosition();

            // If this is not the first cell, we must change its position
            if (curCell.ln !== undefined) {
                if (curCell.ln === ln) {
                    //Same line
                    x = curCell.x + curCell.w;
                    y = curCell.y;
                } else {
                    //New line
                    var margins = this.margins || NO_MARGINS;
                    if ((curCell.y + curCell.h + h + margin) >= this.internal.pageSize.height - margins.bottom) {
                        this.cellAddPage();
                        if (this.printHeaders && this.tableHeaderRow) {
                            this.printHeaderRow(ln, true);
                        }
                    }
                    //We ignore the passed y: the lines may have diferent heights
                    y = (getLastCellPosition().y + getLastCellPosition().h);

                }
            }

            if (txt[0] !== undefined) {
                if (this.printingHeaderRow) {
                    this.rect(x, y, w, h, 'FD');
                } else {
                    this.rect(x, y, w, h);
                }
                if (align === 'right') {
                    if (txt instanceof Array) {
                        for(var i = 0; i<txt.length; i++) {
                            var currentLine = txt[i];
                            var textSize = this.getStringUnitWidth(currentLine) * this.internal.getFontSize();
                            this.text(currentLine, x + w - textSize - padding, y + this.internal.getLineHeight()*(i+1));
                        }
                    }
                } else {
                    this.text(txt, x + padding, y + this.internal.getLineHeight());
                }
            }
            setLastCellPosition(x, y, w, h, ln);
            return this;
        };

        /**
         * Return the maximum value from an array
         * @param array
         * @param comparisonFn
         * @returns {*}
         */
        jsPDFAPI.arrayMax = function (array, comparisonFn) {
            var max = array[0],
                i,
                ln,
                item;

            for (i = 0, ln = array.length; i < ln; i += 1) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(max, item) === -1) {
                        max = item;
                    }
                } else {
                    if (item > max) {
                        max = item;
                    }
                }
            }

            return max;
        };

        /**
         * Create a table from a set of data.
         * @param {Integer} [x] : left-position for top-left corner of table
         * @param {Integer} [y] top-position for top-left corner of table
         * @param {Object[]} [data] As array of objects containing key-value pairs corresponding to a row of data.
         * @param {String[]} [headers] Omit or null to auto-generate headers at a performance cost

         * @param {Object} [config.printHeaders] True to print column headers at the top of every page
         * @param {Object} [config.autoSize] True to dynamically set the column widths to match the widest cell value
         * @param {Object} [config.margins] margin values for left, top, bottom, and width
         * @param {Object} [config.fontSize] Integer fontSize to use (optional)
         */

        jsPDFAPI.table = function (x,y, data, headers, config) {
            if (!data) {
                throw 'No data for PDF table';
            }

            var headerNames = [],
                headerPrompts = [],
                header,
                i,
                ln,
                cln,
                columnMatrix = {},
                columnWidths = {},
                columnData,
                column,
                columnMinWidths = [],
                j,
                tableHeaderConfigs = [],
                model,
                jln,
                func,

            //set up defaults. If a value is provided in config, defaults will be overwritten:
               autoSize        = false,
               printHeaders    = true,
               fontSize        = 12,
               margins         = NO_MARGINS;

               margins.width = this.internal.pageSize.width;

            if (config) {
            //override config defaults if the user has specified non-default behavior:
                if(config.autoSize === true) {
                    autoSize = true;
                }
                if(config.printHeaders === false) {
                    printHeaders = false;
                }
                if(config.fontSize){
                    fontSize = config.fontSize;
                }
                if(config.margins){
                    margins = config.margins;
                }
            }

            /**
             * @property {Number} lnMod
             * Keep track of the current line number modifier used when creating cells
             */
            this.lnMod = 0;
            lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined },
            pages = 1;

            this.printHeaders = printHeaders;
            this.margins = margins;
            this.setFontSize(fontSize);
            this.table_font_size = fontSize;

            // Set header values
            if (headers === undefined || (headers === null)) {
                // No headers defined so we derive from data
                headerNames = Object.keys(data[0]);

            } else if (headers[0] && (typeof headers[0] !== 'string')) {
                var px2pt = 0.264583 * 72 / 25.4;

                // Split header configs into names and prompts
                for (i = 0, ln = headers.length; i < ln; i += 1) {
                    header = headers[i];
                    headerNames.push(header.name);
                    headerPrompts.push(header.prompt);
                    columnWidths[header.name] = header.width *px2pt;
                }

            } else {
                headerNames = headers;
            }

            if (autoSize) {
                // Create a matrix of columns e.g., {column_title: [row1_Record, row2_Record]}
                func = function (rec) {
                    return rec[header];
                };

                for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                    header = headerNames[i];

                    columnMatrix[header] = data.map(
                        func
                    );

                    // get header width
                    columnMinWidths.push(this.getTextDimensions(headerPrompts[i] || header).w);
                    column = columnMatrix[header];

                    // get cell widths
                    for (j = 0, cln = column.length; j < cln; j += 1) {
                        columnData = column[j];
                        columnMinWidths.push(this.getTextDimensions(columnData).w);
                    }

                    // get final column width
                    columnWidths[header] = jsPDFAPI.arrayMax(columnMinWidths);
                }
            }

            // -- Construct the table

            if (printHeaders) {
                var lineHeight = this.calculateLineHeight(headerNames, columnWidths, headerPrompts.length?headerPrompts:headerNames);

                // Construct the header row
                for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                    header = headerNames[i];
                    tableHeaderConfigs.push([x, y, columnWidths[header], lineHeight, String(headerPrompts.length ? headerPrompts[i] : header)]);
                }

                // Store the table header config
                this.setTableHeaderRow(tableHeaderConfigs);

                // Print the header for the start of the table
                this.printHeaderRow(1, false);
            }

            // Construct the data rows
            for (i = 0, ln = data.length; i < ln; i += 1) {
                var lineHeight;
                model = data[i];
                lineHeight = this.calculateLineHeight(headerNames, columnWidths, model);

                for (j = 0, jln = headerNames.length; j < jln; j += 1) {
                    header = headerNames[j];
                    this.cell(x, y, columnWidths[header], lineHeight, model[header], i + 2, header.align);
                }
            }
            this.lastCellPos = lastCellPos;
            this.table_x = x;
            this.table_y = y;
            return this;
        };
        /**
         * Calculate the height for containing the highest column
         * @param {String[]} headerNames is the header, used as keys to the data
         * @param {Integer[]} columnWidths is size of each column
         * @param {Object[]} model is the line of data we want to calculate the height of
         */
        jsPDFAPI.calculateLineHeight = function (headerNames, columnWidths, model) {
            var header, lineHeight = 0;
            for (var j = 0; j < headerNames.length; j++) {
                header = headerNames[j];
                model[header] = this.splitTextToSize(String(model[header]), columnWidths[header] - padding);
                var h = this.internal.getLineHeight() * model[header].length + padding;
                if (h > lineHeight)
                    lineHeight = h;
            }
            return lineHeight;
        };

        /**
         * Store the config for outputting a table header
         * @param {Object[]} config
         * An array of cell configs that would define a header row: Each config matches the config used by jsPDFAPI.cell
         * except the ln parameter is excluded
         */
        jsPDFAPI.setTableHeaderRow = function (config) {
            this.tableHeaderRow = config;
        };

        /**
         * Output the store header row
         * @param lineNumber The line number to output the header at
         */
        jsPDFAPI.printHeaderRow = function (lineNumber, new_page) {
            if (!this.tableHeaderRow) {
                throw 'Property tableHeaderRow does not exist.';
            }

            var tableHeaderCell,
                tmpArray,
                i,
                ln;

            this.printingHeaderRow = true;
            if (headerFunction !== undefined) {
                var position = headerFunction(this, pages);
                setLastCellPosition(position[0], position[1], position[2], position[3], -1);
            }
            this.setFontStyle('bold');
            var tempHeaderConf = [];
            for (i = 0, ln = this.tableHeaderRow.length; i < ln; i += 1) {
                this.setFillColor(200,200,200);

                tableHeaderCell = this.tableHeaderRow[i];
                if (new_page) {
                    tableHeaderCell[1] = this.margins && this.margins.top || 0;
                    tempHeaderConf.push(tableHeaderCell);
                }
                tmpArray = [].concat(tableHeaderCell);
                this.cell.apply(this, tmpArray.concat(lineNumber));
            }
            if (tempHeaderConf.length > 0){
                this.setTableHeaderRow(tempHeaderConf);
            }
            this.setFontStyle('normal');
            this.printingHeaderRow = false;
        };

    })(jsPDF.API);
    /** @preserve
     * jsPDF fromHTML plugin. BETA stage. API subject to change. Needs browser
     * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
     *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
     *               2014 Diego Casorran, https://github.com/diegocr
     *               2014 Daniel Husar, https://github.com/danielhusar
     *               2014 Wolfgang Gassler, https://github.com/woolfg
     *
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     * ====================================================================
     */

    (function (jsPDFAPI) {
        // 'use strict';
        var clone,
            DrillForContent,
            FontNameDB,
            FontStyleMap,
            FontWeightMap,
            FloatMap,
            ClearMap,
            GetCSS,
            PurgeWhiteSpace,
            Renderer,
            ResolveFont,
            ResolveUnitedNumber,
            UnitedNumberMap,
            elementHandledElsewhere,
            images,
            loadImgs,
            checkForFooter,
            process,
            tableToJson;
            clone = (function () {
                return function (obj) {
                    Clone.prototype = obj;
                    return new Clone();
                };
            function Clone() {}
        })();
        PurgeWhiteSpace = function (array) {
            var fragment,
            i,
            l,
            lTrimmed,
            r,
            rTrimmed,
            trailingSpace;
            i = 0;
            l = array.length;
            fragment = void 0;
            lTrimmed = false;
            rTrimmed = false;
            while (!lTrimmed && i !== l) {
                fragment = array[i] = array[i].trimLeft();
                if (fragment) {
                    lTrimmed = true;
                }
                i++;
            }
            i = l - 1;
            while (l && !rTrimmed && i !== -1) {
                fragment = array[i] = array[i].trimRight();
                if (fragment) {
                    rTrimmed = true;
                }
                i--;
            }
            r = /\s+$/g;
            trailingSpace = true;
            i = 0;
            while (i !== l) {
                fragment = array[i].replace(/\s+/g, ' ');
                if (trailingSpace) {
                    fragment = fragment.trimLeft();
                }
                if (fragment) {
                    trailingSpace = r.test(fragment);
                }
                array[i] = fragment;
                i++;
            }
            return array;
        };
        Renderer = function (pdf, x, y, settings) {
            this.pdf = pdf;
            this.x = x;
            this.y = y;
            this.settings = settings;
            //list of functions which are called after each element-rendering process
            this.watchFunctions = [];
            this.init();
            return this;
        };
        ResolveFont = function (css_font_family_string) {
            var name,
            part,
            parts;
            name = void 0;
            parts = css_font_family_string.split(',');
            part = parts.shift();
            while (!name && part) {
                name = FontNameDB[part.trim().toLowerCase()];
                part = parts.shift();
            }
            return name;
        };
        ResolveUnitedNumber = function (css_line_height_string) {

            //IE8 issues
            css_line_height_string = css_line_height_string === 'auto' ? '0px' : css_line_height_string;
            if (css_line_height_string.indexOf('em') > -1 && !isNaN(Number(css_line_height_string.replace('em', '')))) {
                css_line_height_string = Number(css_line_height_string.replace('em', '')) * 18.719 + 'px';
            }
            if (css_line_height_string.indexOf('pt') > -1 && !isNaN(Number(css_line_height_string.replace('pt', '')))) {
                css_line_height_string = Number(css_line_height_string.replace('pt', '')) * 1.333 + 'px';
            }

            var normal,
            undef,
            value;
            undef = void 0;
            normal = 16.00;
            value = UnitedNumberMap[css_line_height_string];
            if (value) {
                return value;
            }
            value = {
                'xx-small'  :  9,
                'x-small'   : 11,
                small       : 13,
                medium      : 16,
                large       : 19,
                'x-large'   : 23,
                'xx-large'  : 28,
                auto        :  0
            }[{ css_line_height_string : css_line_height_string }];

            if (value !== undef) {
                return UnitedNumberMap[css_line_height_string] = value / normal;
            }
            if (value = parseFloat(css_line_height_string)) {
                return UnitedNumberMap[css_line_height_string] = value / normal;
            }
            value = css_line_height_string.match(/([\d\.]+)(px)/);
            if (value.length === 3) {
                return UnitedNumberMap[css_line_height_string] = parseFloat(value[1]) / normal;
            }
            return UnitedNumberMap[css_line_height_string] = 1;
        };
        GetCSS = function (element) {
            var css,tmp,computedCSSElement;
            computedCSSElement = (function (el) {
                var compCSS;
                compCSS = (function (el) {
                    if (document.defaultView && document.defaultView.getComputedStyle) {
                        return document.defaultView.getComputedStyle(el, null);
                    } else if (el.currentStyle) {
                        return el.currentStyle;
                    } else {
                        return el.style;
                    }
                })(el);
                return function (prop) {
                    prop = prop.replace(/-\D/g, function (match) {
                        return match.charAt(1).toUpperCase();
                    });
                    return compCSS[prop];
                };
            })(element);
            css = {};
            tmp = void 0;
            css['font-family'] = ResolveFont(computedCSSElement('font-family')) || 'times';
            css['font-style'] = FontStyleMap[computedCSSElement('font-style')] || 'normal';
            css['text-align'] = TextAlignMap[computedCSSElement('text-align')] || 'left';
            tmp = FontWeightMap[computedCSSElement('font-weight')] || 'normal';
            if (tmp === 'bold') {
                if (css['font-style'] === 'normal') {
                    css['font-style'] = tmp;
                } else {
                    css['font-style'] = tmp + css['font-style'];
                }
            }
            css['font-size'] = ResolveUnitedNumber(computedCSSElement('font-size')) || 1;
            css['line-height'] = ResolveUnitedNumber(computedCSSElement('line-height')) || 1;
            css['display'] = (computedCSSElement('display') === 'inline' ? 'inline' : 'block');

            tmp = (css['display'] === 'block');
            css['margin-top']     = tmp && ResolveUnitedNumber(computedCSSElement('margin-top'))     || 0;
            css['margin-bottom']  = tmp && ResolveUnitedNumber(computedCSSElement('margin-bottom'))  || 0;
            css['padding-top']    = tmp && ResolveUnitedNumber(computedCSSElement('padding-top'))    || 0;
            css['padding-bottom'] = tmp && ResolveUnitedNumber(computedCSSElement('padding-bottom')) || 0;
            css['margin-left']    = tmp && ResolveUnitedNumber(computedCSSElement('margin-left'))    || 0;
            css['margin-right']   = tmp && ResolveUnitedNumber(computedCSSElement('margin-right'))   || 0;
            css['padding-left']   = tmp && ResolveUnitedNumber(computedCSSElement('padding-left'))   || 0;
            css['padding-right']  = tmp && ResolveUnitedNumber(computedCSSElement('padding-right'))  || 0;

            //float and clearing of floats
            css['float'] = FloatMap[computedCSSElement('cssFloat')] || 'none';
            css['clear'] = ClearMap[computedCSSElement('clear')] || 'none';
            return css;
        };
        elementHandledElsewhere = function (element, renderer, elementHandlers) {
            var handlers,
            i,
            isHandledElsewhere,
            l,
            t;
            isHandledElsewhere = false;
            i = void 0;
            l = void 0;
            t = void 0;
            handlers = elementHandlers['#' + element.id];
            if (handlers) {
                if (typeof handlers === 'function') {
                    isHandledElsewhere = handlers(element, renderer);
                } else {
                    i = 0;
                    l = handlers.length;
                    while (!isHandledElsewhere && i !== l) {
                        isHandledElsewhere = handlers[i](element, renderer);
                        i++;
                    }
                }
            }
            handlers = elementHandlers[element.nodeName];
            if (!isHandledElsewhere && handlers) {
                if (typeof handlers === 'function') {
                    isHandledElsewhere = handlers(element, renderer);
                } else {
                    i = 0;
                    l = handlers.length;
                    while (!isHandledElsewhere && i !== l) {
                        isHandledElsewhere = handlers[i](element, renderer);
                        i++;
                    }
                }
            }
            return isHandledElsewhere;
        };
        tableToJson = function (table, renderer) {
            var data,
            headers,
            i,
            j,
            rowData,
            tableRow,
            table_obj,
            table_with,
            cell,
            marginLeft = renderer.pdf.margins_doc.left ? renderer.pdf.margins_doc.left : 0,
            marginRight = renderer.pdf.margins_doc.right ? renderer.pdf.margins_doc.right : 0,
            pageSizeWidth = renderer.pdf.internal.pageSize.width,
            l;
            data = [];
            headers = [];
            i = 0;
            l = table.rows[0].cells.length;

            table_with = ((((pageSizeWidth * 96) / 72 ) - marginLeft - marginRight) / l) - 2;

            while (i < l) {

                cell = table.rows[0].cells[i];
                headers[i] = {
                    name : cell.textContent.toLowerCase().replace(/\s+/g, ''),
                    prompt : cell.textContent.replace(/\r?\n/g, ''),
                    width : table_with
                    // width : (cell.clientWidth / table_with) * renderer.pdf.internal.pageSize.width
                };
                i++;
            }
            i = 1;
            while (i < table.rows.length) {
                tableRow = table.rows[i];
                rowData = {};
                j = 0;
                while (j < tableRow.cells.length) {
                    rowData[headers[j].name] = tableRow.cells[j].textContent.replace(/\r?\n/g, '');
                    j++;
                }
                data.push(rowData);
                i++;
            }
            return table_obj = {
                rows : data,
                headers : headers
            };
        };
        var SkipNode = {
            SCRIPT   : 1,
            STYLE    : 1,
            NOSCRIPT : 1,
            OBJECT   : 1,
            EMBED    : 1,
            SELECT   : 1
        };
        var listCount = 1;
        DrillForContent = function (element, renderer, elementHandlers) {
            var cn,
            cns,
            fragmentCSS,
            i,
            isBlock,
            l,
            px2pt,
            table2json,
            cb;
            cns = element.childNodes;
            cn = void 0;
            fragmentCSS = GetCSS(element);
            isBlock = fragmentCSS.display === 'block';
            if (isBlock) {
                renderer.setBlockBoundary();
                renderer.setBlockStyle(fragmentCSS);
            }
            px2pt = 0.264583 * 72 / 25.4;
            i = 0;
            l = cns.length;
            while (i < l) {
                cn = cns[i];
                if (typeof cn === 'object') {

                    //execute all watcher functions to e.g. reset floating
                    renderer.executeWatchFunctions(cn);

                    /*** HEADER rendering **/
                    if (cn.nodeType === 1 && cn.nodeName === 'HEADER') {
                        var header = cn;
                        //store old top margin
                        var oldMarginTop = renderer.pdf.margins_doc.top;
                        //subscribe for new page event and render header first on every page
                        renderer.pdf.internal.events.subscribe('addPage', function (pageInfo) {
                            //set current y position to old margin
                            renderer.y = oldMarginTop;
                            //render all child nodes of the header element
                            DrillForContent(header, renderer, elementHandlers);
                            //set margin to old margin + rendered header + 10 space to prevent overlapping
                            //important for other plugins (e.g. table) to start rendering at correct position after header
                            renderer.pdf.margins_doc.top = renderer.y + 10;
                            renderer.y += 10;
                        }, false);
                    }

                    if (cn.nodeType === 8 && cn.nodeName === '#comment') {
                        if (~cn.textContent.indexOf('ADD_PAGE')) {
                            renderer.pdf.addPage();
                            renderer.y = renderer.pdf.margins_doc.top;
                        }

                    } else if (cn.nodeType === 1 && !SkipNode[cn.nodeName]) {
                        /*** IMAGE RENDERING ***/
                        var cached_image;
                        if (cn.nodeName === 'IMG') {
                            var url = cn.getAttribute('src');
                            cached_image = images[renderer.pdf.sHashCode(url) || url];
                        }
                        if (cached_image) {
                            if ((renderer.pdf.internal.pageSize.height - renderer.pdf.margins_doc.bottom < renderer.y + cn.height) && (renderer.y > renderer.pdf.margins_doc.top)) {
                                renderer.pdf.addPage();
                                renderer.y = renderer.pdf.margins_doc.top;
                                //check if we have to set back some values due to e.g. header rendering for new page
                                renderer.executeWatchFunctions(cn);
                            }

                            var imagesCSS = GetCSS(cn);
                            var imageX = renderer.x;
                            var fontToUnitRatio = 12 / renderer.pdf.internal.scaleFactor;

                            //define additional paddings, margins which have to be taken into account for margin calculations
                            var additionalSpaceLeft = (imagesCSS['margin-left'] + imagesCSS['padding-left'])*fontToUnitRatio;
                            var additionalSpaceRight = (imagesCSS['margin-right'] + imagesCSS['padding-right'])*fontToUnitRatio;
                            var additionalSpaceTop = (imagesCSS['margin-top'] + imagesCSS['padding-top'])*fontToUnitRatio;
                            var additionalSpaceBottom = (imagesCSS['margin-bottom'] + imagesCSS['padding-bottom'])*fontToUnitRatio;

                            //if float is set to right, move the image to the right border
                            //add space if margin is set
                            if (imagesCSS['float'] !== undefined && imagesCSS['float'] === 'right') {
                                imageX += renderer.settings.width - cn.width - additionalSpaceRight;
                            } else {
                                imageX +=  additionalSpaceLeft;
                            }

                            renderer.pdf.addImage(cached_image, imageX, renderer.y + additionalSpaceTop, cn.width, cn.height);
                            cached_image = undefined;
                            //if the float prop is specified we have to float the text around the image
                            if (imagesCSS['float'] === 'right' || imagesCSS['float'] === 'left') {
                                //add functiont to set back coordinates after image rendering
                                renderer.watchFunctions.push((function(diffX , thresholdY, diffWidth, el) {
                                    //undo drawing box adaptions which were set by floating
                                    if (renderer.y >= thresholdY) {
                                        renderer.x += diffX;
                                        renderer.settings.width += diffWidth;
                                        return true;
                                    } else if(el && el.nodeType === 1 && !SkipNode[el.nodeName] && renderer.x+el.width > (renderer.pdf.margins_doc.left + renderer.pdf.margins_doc.width)) {
                                        renderer.x += diffX;
                                        renderer.y = thresholdY;
                                        renderer.settings.width += diffWidth;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }).bind(this, (imagesCSS['float'] === 'left') ? -cn.width-additionalSpaceLeft-additionalSpaceRight : 0, renderer.y+cn.height+additionalSpaceTop+additionalSpaceBottom, cn.width));
                                //reset floating by clear:both divs
                                //just set cursorY after the floating element
                                renderer.watchFunctions.push((function(yPositionAfterFloating, pages, el) {
                                    if (renderer.y < yPositionAfterFloating && pages === renderer.pdf.internal.getNumberOfPages()) {
                                        if (el.nodeType === 1 && GetCSS(el).clear === 'both') {
                                            renderer.y = yPositionAfterFloating;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    } else {
                                        return true;
                                    }
                                }).bind(this, renderer.y+cn.height, renderer.pdf.internal.getNumberOfPages()));

                                //if floating is set we decrease the available width by the image width
                                renderer.settings.width -= cn.width+additionalSpaceLeft+additionalSpaceRight;
                                //if left just add the image width to the X coordinate
                                if (imagesCSS['float'] === 'left') {
                                    renderer.x += cn.width+additionalSpaceLeft+additionalSpaceRight;
                                }
                            } else {
                            //if no floating is set, move the rendering cursor after the image height
                                renderer.y += cn.height + additionalSpaceBottom;
                            }

                        /*** TABLE RENDERING ***/
                        } else if (cn.nodeName === 'TABLE') {
                            table2json = tableToJson(cn, renderer);
                            renderer.y += 10;
                            renderer.pdf.table(renderer.x, renderer.y, table2json.rows, table2json.headers, {
                                autoSize : false,
                                printHeaders : true,
                                margins : renderer.pdf.margins_doc
                            });
                            renderer.y = renderer.pdf.lastCellPos.y + renderer.pdf.lastCellPos.h + 20;
                        } else if (cn.nodeName === 'OL' || cn.nodeName === 'UL') {
                            listCount = 1;
                            if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
                                DrillForContent(cn, renderer, elementHandlers);
                            }
                            renderer.y += 10;
                        } else if (cn.nodeName === 'LI') {
                            var temp = renderer.x;
                            renderer.x += cn.parentNode.nodeName === 'UL' ? 22 : 10;
                            renderer.y += 3;
                            if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
                                DrillForContent(cn, renderer, elementHandlers);
                            }
                            renderer.x = temp;
                        } else if (cn.nodeName === 'BR') {
                            renderer.y += fragmentCSS['font-size'] * renderer.pdf.internal.scaleFactor;
                        } else {
                            if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
                                DrillForContent(cn, renderer, elementHandlers);
                            }
                        }
                    } else if (cn.nodeType === 3) {
                        var value = cn.nodeValue;
                        if (cn.nodeValue && cn.parentNode.nodeName === 'LI') {
                            if (cn.parentNode.parentNode.nodeName === 'OL') {
                                value = listCount++ + '. ' + value;
                            } else {
                                var fontPx = fragmentCSS['font-size'] * 16;
                                var radius = 2;
                                if (fontPx > 20) {
                                    radius = 3;
                                }
                                cb = function (x, y) {
                                    this.pdf.circle(x, y, radius, 'FD');
                                };
                            }
                        }
                        renderer.addText(value, fragmentCSS);
                    } else if (typeof cn === 'string') {
                        renderer.addText(cn, fragmentCSS);
                    }
                }
                i++;
            }

            if (isBlock) {
                return renderer.setBlockBoundary(cb);
            }
        };
        images = {};
        loadImgs = function (element, renderer, elementHandlers, cb) {
            var imgs = element.getElementsByTagName('img'),
            l = imgs.length, found_images,
            x = 0;
            function done() {
                renderer.pdf.internal.events.publish('imagesLoaded');
                cb(found_images);
            }
            function loadImage(url, width, height) {
                if (!url)
                    return;
                var img = new Image();
                found_images = ++x;
                img.crossOrigin = '';
                img.onerror = img.onload = function () {
                    if(img.complete) {
                        //to support data urls in images, set width and height
                        //as those values are not recognized automatically
                        if (img.src.indexOf('data:image/') === 0) {
                            img.width = width || img.width || 0;
                            img.height = height || img.height || 0;
                        }
                        //if valid image add to known images array
                        if (img.width + img.height) {
                            var hash = renderer.pdf.sHashCode(url) || url;
                            images[hash] = images[hash] || img;
                        }
                    }
                    if(!--x) {
                        done();
                    }
                };
                img.src = url;
            }
            while (l--)
                loadImage(imgs[l].getAttribute('src'),imgs[l].width,imgs[l].height);
            return x || done();
        };
        checkForFooter = function (elem, renderer, elementHandlers) {
            //check if we can found a <footer> element
            var footer = elem.getElementsByTagName('footer');
            if (footer.length > 0) {

                footer = footer[0];

                //bad hack to get height of footer
                //creat dummy out and check new y after fake rendering
                var oldOut = renderer.pdf.internal.write;
                var oldY = renderer.y;
                renderer.pdf.internal.write = function () {};
                DrillForContent(footer, renderer, elementHandlers);
                var footerHeight = Math.ceil(renderer.y - oldY) + 5;
                renderer.y = oldY;
                renderer.pdf.internal.write = oldOut;

                //add 20% to prevent overlapping
                renderer.pdf.margins_doc.bottom += footerHeight;

                //Create function render header on every page
                var renderFooter = function (pageInfo) {
                    var pageNumber = pageInfo !== undefined ? pageInfo.pageNumber : 1;
                    //set current y position to old margin
                    var oldPosition = renderer.y;
                    //render all child nodes of the header element
                    renderer.y = renderer.pdf.internal.pageSize.height - renderer.pdf.margins_doc.bottom;
                    renderer.pdf.margins_doc.bottom -= footerHeight;

                    //check if we have to add page numbers
                    var spans = footer.getElementsByTagName('span');
                    for (var i = 0; i < spans.length; ++i) {
                        //if we find some span element with class pageCounter, set the page
                        if ((" " + spans[i].className + " ").replace(/[\n\t]/g, ' ').indexOf(' pageCounter ') > -1) {
                            spans[i].innerHTML = pageNumber;
                        }
                        //if we find some span element with class totalPages, set a variable which is replaced after rendering of all pages
                        if ((' ' + spans[i].className + ' ').replace(/[\n\t]/g, ' ').indexOf(' totalPages ') > -1) {
                            spans[i].innerHTML = '###jsPDFVarTotalPages###';
                        }
                    }

                    //render footer content
                    DrillForContent(footer, renderer, elementHandlers);
                    //set bottom margin to previous height including the footer height
                    renderer.pdf.margins_doc.bottom += footerHeight;
                    //important for other plugins (e.g. table) to start rendering at correct position after header
                    renderer.y = oldPosition;
                };

                //check if footer contains totalPages which shoudl be replace at the disoposal of the document
                var spans = footer.getElementsByTagName('span');
                for (var i = 0; i < spans.length; ++i) {
                    if ((' ' + spans[i].className + ' ').replace(/[\n\t]/g, ' ').indexOf(' totalPages ') > -1) {
                        renderer.pdf.internal.events.subscribe('htmlRenderingFinished', renderer.pdf.putTotalPages.bind(renderer.pdf, '###jsPDFVarTotalPages###'), true);
                    }
                }

                //register event to render footer on every new page
                renderer.pdf.internal.events.subscribe('addPage', renderFooter, false);
                //render footer on first page
                renderFooter();

                //prevent footer rendering
                SkipNode['FOOTER'] = 1;
            }
        };
        process = function (pdf, element, x, y, settings, callback) {
            if (!element)
                return false;
            if (typeof element !== "string" && !element.parentNode)
                element = '' + element.innerHTML;
            if (typeof element === "string") {
                element = (function (element) {
                    var $frame,
                    $hiddendiv,
                    framename,
                    visuallyhidden;
                    framename = "jsPDFhtmlText" + Date.now().toString() + (Math.random() * 1000).toFixed(0);
                    visuallyhidden = "position: absolute !important;" + "clip: rect(1px 1px 1px 1px); /* IE6, IE7 */" + "clip: rect(1px, 1px, 1px, 1px);" + "padding:0 !important;" + "border:0 !important;" + "height: 1px !important;" + "width: 1px !important; " + "top:auto;" + "left:-100px;" + "overflow: hidden;";
                    $hiddendiv = document.createElement('div');
                    $hiddendiv.style.cssText = visuallyhidden;
                    $hiddendiv.innerHTML = "<iframe style=\"height:1px;width:1px\" name=\"" + framename + "\" />";
                    document.body.appendChild($hiddendiv);
                    $frame = window.frames[framename];
                    $frame.document.body.innerHTML = element;
                    return $frame.document.body;
                })(element.replace(/<\/?script[^>]*?>/gi, ''));
            }
            var r = new Renderer(pdf, x, y, settings), out;

            // 1. load images
            // 2. prepare optional footer elements
            // 3. render content
            loadImgs.call(this, element, r, settings.elementHandlers, function (found_images) {
                checkForFooter( element, r, settings.elementHandlers);
                DrillForContent(element, r, settings.elementHandlers);
                //send event dispose for final taks (e.g. footer totalpage replacement)
                r.pdf.internal.events.publish('htmlRenderingFinished');
                out = r.dispose();
                if (typeof callback === 'function') callback(out);
                else if (found_images) console.error('jsPDF Warning: rendering issues? provide a callback to fromHTML!');
            });
            return out || {x: r.x, y:r.y};
        };
        Renderer.prototype.init = function () {
            this.paragraph = {
                text : [],
                style : []
            };
            return this.pdf.internal.write("q");
        };
        Renderer.prototype.dispose = function () {
            this.pdf.internal.write("Q");
            return {
                x : this.x,
                y : this.y,
                ready:true
            };
        };

        //Checks if we have to execute some watcher functions
        //e.g. to end text floating around an image
        Renderer.prototype.executeWatchFunctions = function(el) {
            var ret = false;
            var narray = [];
            if (this.watchFunctions.length > 0) {
                for(var i=0; i< this.watchFunctions.length; ++i) {
                    if (this.watchFunctions[i](el) === true) {
                        ret = true;
                    } else {
                        narray.push(this.watchFunctions[i]);
                    }
                }
                this.watchFunctions = narray;
            }
            return ret;
        };

        Renderer.prototype.splitFragmentsIntoLines = function (fragments, styles) {
            var currentLineLength,
            defaultFontSize,
            ff,
            fontMetrics,
            fontMetricsCache,
            fragment,
            fragmentChopped,
            fragmentLength,
            fragmentSpecificMetrics,
            fs,
            k,
            line,
            lines,
            maxLineLength,
            style;
            defaultFontSize = 12;
            k = this.pdf.internal.scaleFactor;
            fontMetricsCache = {};
            ff = void 0;
            fs = void 0;
            fontMetrics = void 0;
            fragment = void 0;
            style = void 0;
            fragmentSpecificMetrics = void 0;
            fragmentLength = void 0;
            fragmentChopped = void 0;
            line = [];
            lines = [line];
            currentLineLength = 0;
            maxLineLength = this.settings.width;
            while (fragments.length) {
                fragment = fragments.shift();
                style = styles.shift();
                if (fragment) {
                    ff = style["font-family"];
                    fs = style["font-style"];
                    fontMetrics = fontMetricsCache[ff + fs];
                    if (!fontMetrics) {
                        fontMetrics = this.pdf.internal.getFont(ff, fs).metadata.Unicode;
                        fontMetricsCache[ff + fs] = fontMetrics;
                    }
                    fragmentSpecificMetrics = {
                        widths : fontMetrics.widths,
                        kerning : fontMetrics.kerning,
                        fontSize : style["font-size"] * defaultFontSize,
                        textIndent : currentLineLength
                    };
                    fragmentLength = this.pdf.getStringUnitWidth(fragment, fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
                    if (currentLineLength + fragmentLength > maxLineLength) {
                        fragmentChopped = this.pdf.splitTextToSize(fragment, maxLineLength, fragmentSpecificMetrics);
                        line.push([fragmentChopped.shift(), style]);
                        while (fragmentChopped.length) {
                            line = [[fragmentChopped.shift(), style]];
                            lines.push(line);
                        }
                        currentLineLength = this.pdf.getStringUnitWidth(line[0][0], fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
                    } else {
                        line.push([fragment, style]);
                        currentLineLength += fragmentLength;
                    }
                }
            }

            //if text alignment was set, set margin/indent of each line
            if (style['text-align'] !== undefined && (style['text-align'] === 'center' || style['text-align'] === 'right' || style['text-align'] === 'justify')) {
                for (var i = 0; i < lines.length; ++i) {
                    var length = this.pdf.getStringUnitWidth(lines[i][0][0], fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
                    //if there is more than on line we have to clone the style object as all lines hold a reference on this object
                    if (i > 0) {
                        lines[i][0][1] = clone(lines[i][0][1]);
                    }
                    var space = (maxLineLength - length);

                    if (style['text-align'] === 'right') {
                        lines[i][0][1]['margin-left'] = space;
                        //if alignment is not right, it has to be center so split the space to the left and the right
                    } else if (style['text-align'] === 'center') {
                        lines[i][0][1]['margin-left'] = space / 2;
                        //if justify was set, calculate the word spacing and define in by using the css property
                    } else if (style['text-align'] === 'justify') {
                        var countSpaces = lines[i][0][0].split(' ').length - 1;
                        lines[i][0][1]['word-spacing'] = space / countSpaces;
                        //ignore the last line in justify mode
                        if (i === (lines.length - 1)) {
                            lines[i][0][1]['word-spacing'] = 0;
                        }
                    }
                }
            }

            return lines;
        };
        Renderer.prototype.RenderTextFragment = function (text, style) {
            var defaultFontSize,
            font,
            maxLineHeight;

            maxLineHeight = 0;
            defaultFontSize = 12;

            if (this.pdf.internal.pageSize.height - this.pdf.margins_doc.bottom < this.y + this.pdf.internal.getFontSize()) {
                this.pdf.internal.write("ET", "Q");
                this.pdf.addPage();
                this.y = this.pdf.margins_doc.top;
                this.pdf.internal.write("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");
                //move cursor by one line on new page
                maxLineHeight = Math.max(maxLineHeight, style["line-height"], style["font-size"]);
                this.pdf.internal.write(0, (-1 * defaultFontSize * maxLineHeight).toFixed(2), "Td");
            }

            font = this.pdf.internal.getFont(style["font-family"], style["font-style"]);

            //set the word spacing for e.g. justify style
            if (style['word-spacing'] !== undefined && style['word-spacing'] > 0) {
                this.pdf.internal.write(style['word-spacing'].toFixed(2), "Tw");
            }

            this.pdf.internal.write("/" + font.id, (defaultFontSize * style["font-size"]).toFixed(2), "Tf", "(" + this.pdf.internal.pdfEscape(text) + ") Tj");

            //set the word spacing back to neutral => 0
            if (style['word-spacing'] !== undefined) {
                this.pdf.internal.write(0, "Tw");
            }
        };
        Renderer.prototype.renderParagraph = function (cb) {
            var blockstyle,
            defaultFontSize,
            fontToUnitRatio,
            fragments,
            i,
            l,
            line,
            lines,
            maxLineHeight,
            out,
            paragraphspacing_after,
            paragraphspacing_before,
            priorblockstype,
            styles,
            fontSize;
            fragments = PurgeWhiteSpace(this.paragraph.text);
            styles = this.paragraph.style;
            blockstyle = this.paragraph.blockstyle;
            priorblockstype = this.paragraph.blockstyle || {};
            this.paragraph = {
                text : [],
                style : [],
                blockstyle : {},
                priorblockstyle : blockstyle
            };
            if (!fragments.join("").trim()) {
                return;
            }
            lines = this.splitFragmentsIntoLines(fragments, styles);
            line = void 0;
            maxLineHeight = void 0;
            defaultFontSize = 12;
            fontToUnitRatio = defaultFontSize / this.pdf.internal.scaleFactor;
            paragraphspacing_before = (Math.max((blockstyle["margin-top"] || 0) - (priorblockstype["margin-bottom"] || 0), 0) + (blockstyle["padding-top"] || 0)) * fontToUnitRatio;
            paragraphspacing_after = ((blockstyle["margin-bottom"] || 0) + (blockstyle["padding-bottom"] || 0)) * fontToUnitRatio;
            out = this.pdf.internal.write;
            i = void 0;
            l = void 0;
            this.y += paragraphspacing_before;
            out("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");

            //stores the current indent of cursor position
            var currentIndent = 0;

            while (lines.length) {
                line = lines.shift();
                maxLineHeight = 0;
                i = 0;
                l = line.length;
                while (i !== l) {
                    if (line[i][0].trim()) {
                        maxLineHeight = Math.max(maxLineHeight, line[i][1]["line-height"], line[i][1]["font-size"]);
                        fontSize = line[i][1]["font-size"] * 7;
                    }
                    i++;
                }
                //if we have to move the cursor to adapt the indent
                var indentMove = 0;
                //if a margin was added (by e.g. a text-alignment), move the cursor
                if (line[0][1]["margin-left"] !== undefined && line[0][1]["margin-left"] > 0) {
                    wantedIndent = this.pdf.internal.getCoordinateString(line[0][1]["margin-left"]);
                    indentMove = wantedIndent - currentIndent;
                    currentIndent = wantedIndent;
                }
                //move the cursor
                out(indentMove, (-1 * defaultFontSize * maxLineHeight).toFixed(2), "Td");
                i = 0;
                l = line.length;
                while (i !== l) {
                    if (line[i][0]) {
                        this.RenderTextFragment(line[i][0], line[i][1]);
                    }
                    i++;
                }
                this.y += maxLineHeight * fontToUnitRatio;

                //if some watcher function was executed sucessful, so e.g. margin and widths were changed,
                //reset line drawing and calculate position and lines again
                //e.g. to stop text floating around an image
                if (this.executeWatchFunctions(line[0][1]) && lines.length > 0) {
                    var localFragments = [];
                    var localStyles = [];
                    //create fragement array of
                    lines.forEach(function(localLine) {
                        var i = 0;
                        var l = localLine.length;
                        while (i !== l) {
                            if (localLine[i][0]) {
                                localFragments.push(localLine[i][0]+' ');
                                localStyles.push(localLine[i][1]);
                            }
                            ++i;
                        }
                    });
                    //split lines again due to possible coordinate changes
                    lines = this.splitFragmentsIntoLines(PurgeWhiteSpace(localFragments), localStyles);
                    //reposition the current cursor
                    out("ET", "Q");
                    out("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");
                }

            }
            if (cb && typeof cb === "function") {
                cb.call(this, this.x - 9, this.y - fontSize / 2);
            }
            out("ET", "Q");
            return this.y += paragraphspacing_after;
        };
        Renderer.prototype.setBlockBoundary = function (cb) {
            return this.renderParagraph(cb);
        };
        Renderer.prototype.setBlockStyle = function (css) {
            return this.paragraph.blockstyle = css;
        };
        Renderer.prototype.addText = function (text, css) {
            this.paragraph.text.push(text);
            return this.paragraph.style.push(css);
        };
        FontNameDB = {
            helvetica         : "helvetica",
            "sans-serif"      : "helvetica",
            "times new roman" : "times",
            serif             : "times",
            times             : "times",
            monospace         : "courier",
            courier           : "courier"
        };
        FontWeightMap = {
            100 : "normal",
            200 : "normal",
            300 : "normal",
            400 : "normal",
            500 : "bold",
            600 : "bold",
            700 : "bold",
            800 : "bold",
            900 : "bold",
            normal  : "normal",
            bold    : "bold",
            bolder  : "bold",
            lighter : "normal"
        };
        FontStyleMap = {
            normal  : "normal",
            italic  : "italic",
            oblique : "italic"
        };
        TextAlignMap = {
            left    : "left",
            right   : "right",
            center  : "center",
            justify : "justify"
        };
        FloatMap = {
            none : 'none',
            right: 'right',
            left: 'left'
        };
        ClearMap = {
          none : 'none',
          both : 'both'
        };
        UnitedNumberMap = {
            normal : 1
        };
        /**
         * Converts HTML-formatted text into formatted PDF text.
         *
         * Notes:
         * 2012-07-18
         * Plugin relies on having browser, DOM around. The HTML is pushed into dom and traversed.
         * Plugin relies on jQuery for CSS extraction.
         * Targeting HTML output from Markdown templating, which is a very simple
         * markup - div, span, em, strong, p. No br-based paragraph separation supported explicitly (but still may work.)
         * Images, tables are NOT supported.
         *
         * @public
         * @function
         * @param HTML {String or DOM Element} HTML-formatted text, or pointer to DOM element that is to be rendered into PDF.
         * @param x {Number} starting X coordinate in jsPDF instance's declared units.
         * @param y {Number} starting Y coordinate in jsPDF instance's declared units.
         * @param settings {Object} Additional / optional variables controlling parsing, rendering.
         * @returns {Object} jsPDF instance
         */
        jsPDFAPI.fromHTML = function (HTML, x, y, settings, callback, margins) {
            "use strict";

            this.margins_doc = margins || {
                top : 0,
                bottom : 0
            };
            if (!settings)
                settings = {};
            if (!settings.elementHandlers)
                settings.elementHandlers = {};

            return process(this, HTML, isNaN(x) ? 4 : x, isNaN(y) ? 4 : y, settings, callback);
        };
    })(jsPDF.API);
    /** ====================================================================
     * jsPDF JavaScript plugin
     * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
     *
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     * ====================================================================
     */

    /*global jsPDF */

    (function (jsPDFAPI) {
        'use strict';
        var jsNamesObj, jsJsObj, text;
        jsPDFAPI.addJS = function (txt) {
            text = txt;
            this.internal.events.subscribe(
                'postPutResources',
                function (txt) {
                    jsNamesObj = this.internal.newObject();
                    this.internal.write('<< /Names [(EmbeddedJS) ' + (jsNamesObj + 1) + ' 0 R] >>', 'endobj');
                    jsJsObj = this.internal.newObject();
                    this.internal.write('<< /S /JavaScript /JS (', text, ') >>', 'endobj');
                }
            );
            this.internal.events.subscribe(
                'putCatalog',
                function () {
                    if (jsNamesObj !== undefined && jsJsObj !== undefined) {
                        this.internal.write('/Names <</JavaScript ' + jsNamesObj + ' 0 R>>');
                    }
                }
            );
            return this;
        };
    }(jsPDF.API));
    /**@preserve
     *  ====================================================================
     * jsPDF PNG PlugIn
     * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
     *
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     * ====================================================================
     */

    (function(jsPDFAPI) {
    'use strict'

        /*
         * @see http://www.w3.org/TR/PNG-Chunks.html
         *
         Color    Allowed      Interpretation
         Type     Bit Depths

           0       1,2,4,8,16  Each pixel is a grayscale sample.

           2       8,16        Each pixel is an R,G,B triple.

           3       1,2,4,8     Each pixel is a palette index;
                               a PLTE chunk must appear.

           4       8,16        Each pixel is a grayscale sample,
                               followed by an alpha sample.

           6       8,16        Each pixel is an R,G,B triple,
                               followed by an alpha sample.
        */

        /*
         * PNG filter method types
         *
         * @see http://www.w3.org/TR/PNG-Filters.html
         * @see http://www.libpng.org/pub/png/book/chapter09.html
         *
         * This is what the value 'Predictor' in decode params relates to
         *
         * 15 is "optimal prediction", which means the prediction algorithm can change from line to line.
         * In that case, you actually have to read the first byte off each line for the prediction algorthim (which should be 0-4, corresponding to PDF 10-14) and select the appropriate unprediction algorithm based on that byte.
         *
           0       None
           1       Sub
           2       Up
           3       Average
           4       Paeth
         */

        var doesNotHavePngJS = function() {
            return typeof PNG !== 'function' || typeof FlateStream !== 'function';
        },
        canCompress = function(value) {
            return value !== jsPDFAPI.image_compression.NONE && hasCompressionJS();
        },
        hasCompressionJS = function() {
            var inst = typeof Deflater === 'function';
            if(!inst)
                throw new Error("requires deflate.js for compression")
            return inst;
        },
        compressBytes = function(bytes, lineLength, colorsPerPixel, compression) {

            var level = 5,
                filter_method = filterUp;

            switch(compression) {

                case jsPDFAPI.image_compression.FAST:

                    level = 3;
                    filter_method = filterSub;
                    break;

                case jsPDFAPI.image_compression.MEDIUM:

                    level = 6;
                    filter_method = filterAverage;
                    break;

                case jsPDFAPI.image_compression.SLOW:

                    level = 9;
                    filter_method = filterPaeth;//uses to sum to choose best filter for each line
                    break;
            }

            bytes = applyPngFilterMethod(bytes, lineLength, colorsPerPixel, filter_method);

            var header = new Uint8Array(createZlibHeader(level));
            var checksum = adler32(bytes);

            var deflate = new Deflater(level);
            var a = deflate.append(bytes);
            var cBytes = deflate.flush();

            var len = header.length + a.length + cBytes.length;

            var cmpd = new Uint8Array(len + 4);
            cmpd.set(header);
            cmpd.set(a, header.length);
            cmpd.set(cBytes, header.length + a.length);

            cmpd[len++] = (checksum >>> 24) & 0xff;
            cmpd[len++] = (checksum >>> 16) & 0xff;
            cmpd[len++] = (checksum >>> 8) & 0xff;
            cmpd[len++] = checksum & 0xff;

            return jsPDFAPI.arrayBufferToBinaryString(cmpd);
        },
        createZlibHeader = function(bytes, level){
            /*
             * @see http://www.ietf.org/rfc/rfc1950.txt for zlib header
             */
            var cm = 8;
            var cinfo = Math.LOG2E * Math.log(0x8000) - 8;
            var cmf = (cinfo << 4) | cm;

            var hdr = cmf << 8;
            var flevel = Math.min(3, ((level - 1) & 0xff) >> 1);

            hdr |= (flevel << 6);
            hdr |= 0;//FDICT
            hdr += 31 - (hdr % 31);

            return [cmf, (hdr & 0xff) & 0xff];
        },
        adler32 = function(array, param) {
            var adler = 1;
            var s1 = adler & 0xffff,
                s2 = (adler >>> 16) & 0xffff;
            var len = array.length;
            var tlen;
            var i = 0;

            while (len > 0) {
              tlen = len > param ? param : len;
              len -= tlen;
              do {
                s1 += array[i++];
                s2 += s1;
              } while (--tlen);

              s1 %= 65521;
              s2 %= 65521;
            }

            return ((s2 << 16) | s1) >>> 0;
        },
        applyPngFilterMethod = function(bytes, lineLength, colorsPerPixel, filter_method) {
            var lines = bytes.length / lineLength,
                result = new Uint8Array(bytes.length + lines),
                filter_methods = getFilterMethods(),
                i = 0, line, prevLine, offset;

            for(; i < lines; i++) {
                offset = i * lineLength;
                line = bytes.subarray(offset, offset + lineLength);

                if(filter_method) {
                    result.set(filter_method(line, colorsPerPixel, prevLine), offset + i);

                }else{

                    var j = 0,
                        len = filter_methods.length,
                        results = [];

                    for(; j < len; j++)
                        results[j] = filter_methods[j](line, colorsPerPixel, prevLine);

                    var ind = getIndexOfSmallestSum(results.concat());

                    result.set(results[ind], offset + i);
                }

                prevLine = line;
            }

            return result;
        },
        filterNone = function(line, colorsPerPixel, prevLine) {
            /*var result = new Uint8Array(line.length + 1);
            result[0] = 0;
            result.set(line, 1);*/

            var result = Array.apply([], line);
            result.unshift(0);

            return result;
        },
        filterSub = function(line, colorsPerPixel, prevLine) {
            var result = [],
                i = 0,
                len = line.length,
                left;

            result[0] = 1;

            for(; i < len; i++) {
                left = line[i - colorsPerPixel] || 0;
                result[i + 1] = (line[i] - left + 0x0100) & 0xff;
            }

            return result;
        },
        filterUp = function(line, colorsPerPixel, prevLine) {
            var result = [],
                i = 0,
                len = line.length,
                up;

            result[0] = 2;

            for(; i < len; i++) {
                up = prevLine && prevLine[i] || 0;
                result[i + 1] = (line[i] - up + 0x0100) & 0xff;
            }

            return result;
        },
        filterAverage = function(line, colorsPerPixel, prevLine) {
            var result = [],
                i = 0,
                len = line.length,
                left,
                up;

            result[0] = 3;

            for(; i < len; i++) {
                left = line[i - colorsPerPixel] || 0;
                up = prevLine && prevLine[i] || 0;
                result[i + 1] = (line[i] + 0x0100 - ((left + up) >>> 1)) & 0xff;
            }

            return result;
        },
        filterPaeth = function(line, colorsPerPixel, prevLine) {
            var result = [],
                i = 0,
                len = line.length,
                left,
                up,
                upLeft,
                paeth;

            result[0] = 4;

            for(; i < len; i++) {
                left = line[i - colorsPerPixel] || 0;
                up = prevLine && prevLine[i] || 0;
                upLeft = prevLine && prevLine[i - colorsPerPixel] || 0;
                paeth = paethPredictor(left, up, upLeft);
                result[i + 1] = (line[i] - paeth + 0x0100) & 0xff;
            }

            return result;
        },
        paethPredictor = function(left, up, upLeft) {

            var p = left + up - upLeft,
                pLeft = Math.abs(p - left),
                pUp = Math.abs(p - up),
                pUpLeft = Math.abs(p - upLeft);

            return (pLeft <= pUp && pLeft <= pUpLeft) ? left : (pUp <= pUpLeft) ? up : upLeft;
        },
        getFilterMethods = function() {
            return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
        },
        getIndexOfSmallestSum = function(arrays) {
            var i = 0,
                len = arrays.length,
                sum, min, ind;

            while(i < len) {
                sum = absSum(arrays[i].slice(1));

                if(sum < min || !min) {
                    min = sum;
                    ind = i;
                }

                i++;
            }

            return ind;
        },
        absSum = function(array) {
            var i = 0,
                len = array.length,
                sum = 0;

            while(i < len)
                sum += Math.abs(array[i++]);

            return sum;
        },
        logImg = function(img) {
            console.log("width: " + img.width);
            console.log("height: " + img.height);
            console.log("bits: " + img.bits);
            console.log("colorType: " + img.colorType);
            console.log("transparency:");
            console.log(img.transparency);
            console.log("text:");
            console.log(img.text);
            console.log("compressionMethod: " + img.compressionMethod);
            console.log("filterMethod: " + img.filterMethod);
            console.log("interlaceMethod: " + img.interlaceMethod);
            console.log("imgData:");
            console.log(img.imgData);
            console.log("palette:");
            console.log(img.palette);
            console.log("colors: " + img.colors);
            console.log("colorSpace: " + img.colorSpace);
            console.log("pixelBitlength: " + img.pixelBitlength);
            console.log("hasAlphaChannel: " + img.hasAlphaChannel);
        };




        jsPDFAPI.processPNG = function(imageData, imageIndex, alias, compression, dataAsBinaryString) {
            'use strict'

            var colorSpace = this.color_spaces.DEVICE_RGB,
                decode = this.decode.FLATE_DECODE,
                bpc = 8,
                img, dp, trns,
                colors, pal, smask;

        /*  if(this.isString(imageData)) {

            }*/

            if(this.isArrayBuffer(imageData))
                imageData = new Uint8Array(imageData);

            if(this.isArrayBufferView(imageData)) {

                if(doesNotHavePngJS())
                    throw new Error("PNG support requires png.js and zlib.js");

                img = new PNG(imageData);
                imageData = img.imgData;
                bpc = img.bits;
                colorSpace = img.colorSpace;
                colors = img.colors;

                //logImg(img);

                /*
                 * colorType 6 - Each pixel is an R,G,B triple, followed by an alpha sample.
                 *
                 * colorType 4 - Each pixel is a grayscale sample, followed by an alpha sample.
                 *
                 * Extract alpha to create two separate images, using the alpha as a sMask
                 */
                if([4,6].indexOf(img.colorType) !== -1) {

                    /*
                     * processes 8 bit RGBA and grayscale + alpha images
                     */
                    if(img.bits === 8) {

                        var pixelsArrayType = window['Uint' + img.pixelBitlength + 'Array'],
                            pixels = new pixelsArrayType(img.decodePixels().buffer),
                            len = pixels.length,
                            imgData = new Uint8Array(len * img.colors),
                            alphaData = new Uint8Array(len),
                            pDiff = img.pixelBitlength - img.bits,
                            i = 0, n = 0, pixel, pbl;

                        for(; i < len; i++) {
                            pixel = pixels[i];
                            pbl = 0;

                            while(pbl < pDiff) {

                                imgData[n++] = ( pixel >>> pbl ) & 0xff;
                                pbl = pbl + img.bits;
                            }

                            alphaData[i] = ( pixel >>> pbl ) & 0xff;
                        }
                    }

                    /*
                     * processes 16 bit RGBA and grayscale + alpha images
                     */
                    if(img.bits === 16) {

                        var pixels = new Uint32Array(img.decodePixels().buffer),
                            len = pixels.length,
                            imgData = new Uint8Array((len * (32 / img.pixelBitlength) ) * img.colors),
                            alphaData = new Uint8Array(len * (32 / img.pixelBitlength) ),
                            hasColors = img.colors > 1,
                            i = 0, n = 0, a = 0, pixel;

                        while(i < len) {
                            pixel = pixels[i++];

                            imgData[n++] = (pixel >>> 0) & 0xFF;

                            if(hasColors) {
                                imgData[n++] = (pixel >>> 16) & 0xFF;

                                pixel = pixels[i++];
                                imgData[n++] = (pixel >>> 0) & 0xFF;
                            }

                            alphaData[a++] = (pixel >>> 16) & 0xFF;
                        }

                        bpc = 8;
                    }

                    if(canCompress(compression)) {

                        imageData = compressBytes(imgData, img.width * img.colors, img.colors, compression);
                        smask = compressBytes(alphaData, img.width, 1, compression);

                    }else{

                        imageData = imgData;
                        smask = alphaData;
                        decode = null;
                    }
                }

                /*
                 * Indexed png. Each pixel is a palette index.
                 */
                if(img.colorType === 3) {

                    colorSpace = this.color_spaces.INDEXED;
                    pal = img.palette;

                    if(img.transparency.indexed) {

                        var trans = img.transparency.indexed;

                        var total = 0,
                            i = 0,
                            len = trans.length;

                        for(; i<len; ++i)
                            total += trans[i];

                        total = total / 255;

                        /*
                         * a single color is specified as 100% transparent (0),
                         * so we set trns to use a /Mask with that index
                         */
                        if(total === len - 1 && trans.indexOf(0) !== -1) {
                            trns = [trans.indexOf(0)];

                        /*
                         * there's more than one colour within the palette that specifies
                         * a transparency value less than 255, so we unroll the pixels to create an image sMask
                         */
                        }else if(total !== len){

                            var pixels = img.decodePixels(),
                                alphaData = new Uint8Array(pixels.length),
                                i = 0,
                                len = pixels.length;

                            for(; i < len; i++)
                                alphaData[i] = trans[pixels[i]];

                            smask = compressBytes(alphaData, img.width, 1);
                        }
                    }
                }

                if(decode === this.decode.FLATE_DECODE)
                    dp = '/Predictor 15 /Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
                else
                    //remove 'Predictor' as it applies to the type of png filter applied to its IDAT - we only apply with compression
                    dp = '/Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;

                if(this.isArrayBuffer(imageData) || this.isArrayBufferView(imageData))
                    imageData = this.arrayBufferToBinaryString(imageData);

                if(smask && this.isArrayBuffer(smask) || this.isArrayBufferView(smask))
                    smask = this.arrayBufferToBinaryString(smask);

                return this.createImageInfo(imageData, img.width, img.height, colorSpace,
                                            bpc, decode, imageIndex, alias, dp, trns, pal, smask);
            }

            throw new Error("Unsupported PNG image data, try using JPEG instead.");
        }

    })(jsPDF.API)
    /** @preserve
    jsPDF Silly SVG plugin
    Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
    */
    /**
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     * ====================================================================
     */

    ;(function(jsPDFAPI) {
    'use strict'

    /**
    Parses SVG XML and converts only some of the SVG elements into
    PDF elements.

    Supports:
     paths

    @public
    @function
    @param
    @returns {Type}
    */
    jsPDFAPI.addSVG = function(svgtext, x, y, w, h) {
        // 'this' is _jsPDF object returned when jsPDF is inited (new jsPDF())

        var undef

        if (x === undef || y === undef) {
            throw new Error("addSVG needs values for 'x' and 'y'");
        }

        function InjectCSS(cssbody, document) {
            var styletag = document.createElement('style');
            styletag.type = 'text/css';
            if (styletag.styleSheet) {
                // ie
                styletag.styleSheet.cssText = cssbody;
            } else {
                // others
                styletag.appendChild(document.createTextNode(cssbody));
            }
            document.getElementsByTagName("head")[0].appendChild(styletag);
        }

        function createWorkerNode(document){

            var frameID = 'childframe' // Date.now().toString() + '_' + (Math.random() * 100).toString()
            , frame = document.createElement('iframe')

            InjectCSS(
                '.jsPDF_sillysvg_iframe {display:none;position:absolute;}'
                , document
            )

            frame.name = frameID
            frame.setAttribute("width", 0)
            frame.setAttribute("height", 0)
            frame.setAttribute("frameborder", "0")
            frame.setAttribute("scrolling", "no")
            frame.setAttribute("seamless", "seamless")
            frame.setAttribute("class", "jsPDF_sillysvg_iframe")

            document.body.appendChild(frame)

            return frame
        }

        function attachSVGToWorkerNode(svgtext, frame){
            var framedoc = ( frame.contentWindow || frame.contentDocument ).document
            framedoc.write(svgtext)
            framedoc.close()
            return framedoc.getElementsByTagName('svg')[0]
        }

        function convertPathToPDFLinesArgs(path){
            'use strict'
            // we will use 'lines' method call. it needs:
            // - starting coordinate pair
            // - array of arrays of vector shifts (2-len for line, 6 len for bezier)
            // - scale array [horizontal, vertical] ratios
            // - style (stroke, fill, both)

            var x = parseFloat(path[1])
            , y = parseFloat(path[2])
            , vectors = []
            , position = 3
            , len = path.length

            while (position < len){
                if (path[position] === 'c'){
                    vectors.push([
                        parseFloat(path[position + 1])
                        , parseFloat(path[position + 2])
                        , parseFloat(path[position + 3])
                        , parseFloat(path[position + 4])
                        , parseFloat(path[position + 5])
                        , parseFloat(path[position + 6])
                    ])
                    position += 7
                } else if (path[position] === 'l') {
                    vectors.push([
                        parseFloat(path[position + 1])
                        , parseFloat(path[position + 2])
                    ])
                    position += 3
                } else {
                    position += 1
                }
            }
            return [x,y,vectors]
        }

        var workernode = createWorkerNode(document)
        , svgnode = attachSVGToWorkerNode(svgtext, workernode)
        , scale = [1,1]
        , svgw = parseFloat(svgnode.getAttribute('width'))
        , svgh = parseFloat(svgnode.getAttribute('height'))

        if (svgw && svgh) {
            // setting both w and h makes image stretch to size.
            // this may distort the image, but fits your demanded size
            if (w && h) {
                scale = [w / svgw, h / svgh]
            }
            // if only one is set, that value is set as max and SVG
            // is scaled proportionately.
            else if (w) {
                scale = [w / svgw, w / svgw]
            } else if (h) {
                scale = [h / svgh, h / svgh]
            }
        }

        var i, l, tmp
        , linesargs
        , items = svgnode.childNodes
        for (i = 0, l = items.length; i < l; i++) {
            tmp = items[i]
            if (tmp.tagName && tmp.tagName.toUpperCase() === 'PATH') {
                linesargs = convertPathToPDFLinesArgs( tmp.getAttribute("d").split(' ') )
                // path start x coordinate
                linesargs[0] = linesargs[0] * scale[0] + x // where x is upper left X of image
                // path start y coordinate
                linesargs[1] = linesargs[1] * scale[1] + y // where y is upper left Y of image
                // the rest of lines are vectors. these will adjust with scale value auto.
                this.lines.call(
                    this
                    , linesargs[2] // lines
                    , linesargs[0] // starting x
                    , linesargs[1] // starting y
                    , scale
                )
            }
        }

        // clean up
        // workernode.parentNode.removeChild(workernode)

        return this
    }

    })(jsPDF.API);
    /** @preserve
     * jsPDF split_text_to_size plugin - MIT license.
     * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
     *               2014 Diego Casorran, https://github.com/diegocr
     */
    /**
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     * ====================================================================
     */

    ;(function(API) {
    'use strict'

    /**
    Returns an array of length matching length of the 'word' string, with each
    cell ocupied by the width of the char in that position.

    @function
    @param word {String}
    @param widths {Object}
    @param kerning {Object}
    @returns {Array}
    */
    var getCharWidthsArray = API.getCharWidthsArray = function(text, options){

        if (!options) {
            options = {}
        }

        var widths = options.widths ? options.widths : this.internal.getFont().metadata.Unicode.widths
        , widthsFractionOf = widths.fof ? widths.fof : 1
        , kerning = options.kerning ? options.kerning : this.internal.getFont().metadata.Unicode.kerning
        , kerningFractionOf = kerning.fof ? kerning.fof : 1

        // console.log("widths, kergnings", widths, kerning)

        var i, l
        , char_code
        , prior_char_code = 0 // for kerning
        , default_char_width = widths[0] || widthsFractionOf
        , output = []

        for (i = 0, l = text.length; i < l; i++) {
            char_code = text.charCodeAt(i)
            output.push(
                ( widths[char_code] || default_char_width ) / widthsFractionOf +
                ( kerning[char_code] && kerning[char_code][prior_char_code] || 0 ) / kerningFractionOf
            )
            prior_char_code = char_code
        }

        return output
    }
    var getArraySum = function(array){
        var i = array.length
        , output = 0
        while(i){
            ;i--;
            output += array[i]
        }
        return output
    }
    /**
    Returns a widths of string in a given font, if the font size is set as 1 point.

    In other words, this is "proportional" value. For 1 unit of font size, the length
    of the string will be that much.

    Multiply by font size to get actual width in *points*
    Then divide by 72 to get inches or divide by (72/25.6) to get 'mm' etc.

    @public
    @function
    @param
    @returns {Type}
    */
    var getStringUnitWidth = API.getStringUnitWidth = function(text, options) {
        return getArraySum(getCharWidthsArray.call(this, text, options))
    }

    /**
    returns array of lines
    */
    var splitLongWord = function(word, widths_array, firstLineMaxLen, maxLen){
        var answer = []

        // 1st, chop off the piece that can fit on the hanging line.
        var i = 0
        , l = word.length
        , workingLen = 0
        while (i !== l && workingLen + widths_array[i] < firstLineMaxLen){
            workingLen += widths_array[i]
            ;i++;
        }
        // this is first line.
        answer.push(word.slice(0, i))

        // 2nd. Split the rest into maxLen pieces.
        var startOfLine = i
        workingLen = 0
        while (i !== l){
            if (workingLen + widths_array[i] > maxLen) {
                answer.push(word.slice(startOfLine, i))
                workingLen = 0
                startOfLine = i
            }
            workingLen += widths_array[i]
            ;i++;
        }
        if (startOfLine !== i) {
            answer.push(word.slice(startOfLine, i))
        }

        return answer
    }

    // Note, all sizing inputs for this function must be in "font measurement units"
    // By default, for PDF, it's "point".
    var splitParagraphIntoLines = function(text, maxlen, options){
        // at this time works only on Western scripts, ones with space char
        // separating the words. Feel free to expand.

        if (!options) {
            options = {}
        }

        var line = []
        , lines = [line]
        , line_length = options.textIndent || 0
        , separator_length = 0
        , current_word_length = 0
        , word
        , widths_array
        , words = text.split(' ')
        , spaceCharWidth = getCharWidthsArray(' ', options)[0]
        , i, l, tmp, lineIndent

        if(options.lineIndent === -1) {
            lineIndent = words[0].length +2;
        } else {
            lineIndent = options.lineIndent || 0;
        }
        if(lineIndent) {
            var pad = Array(lineIndent).join(" "), wrds = [];
            words.map(function(wrd) {
                wrd = wrd.split(/\s*\n/);
                if(wrd.length > 1) {
                    wrds = wrds.concat(wrd.map(function(wrd, idx) {
                        return (idx && wrd.length ? "\n":"") + wrd;
                    }));
                } else {
                    wrds.push(wrd[0]);
                }
            });
            words = wrds;
            lineIndent = getStringUnitWidth(pad, options);
        }

        for (i = 0, l = words.length; i < l; i++) {
            var force = 0;

            word = words[i]
            if(lineIndent && word[0] == "\n") {
                word = word.substr(1);
                force = 1;
            }
            widths_array = getCharWidthsArray(word, options)
            current_word_length = getArraySum(widths_array)

            if (line_length + separator_length + current_word_length > maxlen || force) {
                if (current_word_length > maxlen) {
                    // this happens when you have space-less long URLs for example.
                    // we just chop these to size. We do NOT insert hiphens
                    tmp = splitLongWord(word, widths_array, maxlen - (line_length + separator_length), maxlen)
                    // first line we add to existing line object
                    line.push(tmp.shift()) // it's ok to have extra space indicator there
                    // last line we make into new line object
                    line = [tmp.pop()]
                    // lines in the middle we apped to lines object as whole lines
                    while(tmp.length){
                        lines.push([tmp.shift()]) // single fragment occupies whole line
                    }
                    current_word_length = getArraySum( widths_array.slice(word.length - line[0].length) )
                } else {
                    // just put it on a new line
                    line = [word]
                }

                // now we attach new line to lines
                lines.push(line)
                line_length = current_word_length + lineIndent
                separator_length = spaceCharWidth

            } else {
                line.push(word)

                line_length += separator_length + current_word_length
                separator_length = spaceCharWidth
            }
        }

        if(lineIndent) {
            var postProcess = function(ln, idx) {
                return (idx ? pad : '') + ln.join(" ");
            };
        } else {
            var postProcess = function(ln) { return ln.join(" ")};
        }

        return lines.map(postProcess);
    }

    /**
    Splits a given string into an array of strings. Uses 'size' value
    (in measurement units declared as default for the jsPDF instance)
    and the font's "widths" and "Kerning" tables, where availabe, to
    determine display length of a given string for a given font.

    We use character's 100% of unit size (height) as width when Width
    table or other default width is not available.

    @public
    @function
    @param text {String} Unencoded, regular JavaScript (Unicode, UTF-16 / UCS-2) string.
    @param size {Number} Nominal number, measured in units default to this instance of jsPDF.
    @param options {Object} Optional flags needed for chopper to do the right thing.
    @returns {Array} with strings chopped to size.
    */
    API.splitTextToSize = function(text, maxlen, options) {
        'use strict'

        if (!options) {
            options = {}
        }

        var fsize = options.fontSize || this.internal.getFontSize()
        , newOptions = (function(options){
            var widths = {0:1}
            , kerning = {}

            if (!options.widths || !options.kerning) {
                var f = this.internal.getFont(options.fontName, options.fontStyle)
                , encoding = 'Unicode'
                // NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
                // Actual JavaScript-native String's 16bit char codes used.
                // no multi-byte logic here

                if (f.metadata[encoding]) {
                    return {
                        widths: f.metadata[encoding].widths || widths
                        , kerning: f.metadata[encoding].kerning || kerning
                    }
                }
            } else {
                return  {
                    widths: options.widths
                    , kerning: options.kerning
                }
            }

            // then use default values
            return  {
                widths: widths
                , kerning: kerning
            }
        }).call(this, options)

        // first we split on end-of-line chars
        var paragraphs
        if(Array.isArray(text)) {
            paragraphs = text;
        } else {
            paragraphs = text.split(/\r?\n/);
        }

        // now we convert size (max length of line) into "font size units"
        // at present time, the "font size unit" is always 'point'
        // 'proportional' means, "in proportion to font size"
        var fontUnit_maxLen = 1.0 * this.internal.scaleFactor * maxlen / fsize
        // at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
        // this may change in the future?
        // until then, proportional_maxlen is likely to be in 'points'

        // If first line is to be indented (shorter or longer) than maxLen
        // we indicate that by using CSS-style "text-indent" option.
        // here it's in font units too (which is likely 'points')
        // it can be negative (which makes the first line longer than maxLen)
        newOptions.textIndent = options.textIndent ?
            options.textIndent * 1.0 * this.internal.scaleFactor / fsize :
            0
        newOptions.lineIndent = options.lineIndent;

        var i, l
        , output = []
        for (i = 0, l = paragraphs.length; i < l; i++) {
            output = output.concat(
                splitParagraphIntoLines(
                    paragraphs[i]
                    , fontUnit_maxLen
                    , newOptions
                )
            )
        }

        return output
    }

    })(jsPDF.API);
    /** @preserve
    jsPDF standard_fonts_metrics plugin
    Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
    MIT license.
    */
    /**
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     * ====================================================================
     */

    ;(function(API) {
    'use strict'

    /*
    # reference (Python) versions of 'compress' and 'uncompress'
    # only 'uncompress' function is featured lower as JavaScript
    # if you want to unit test "roundtrip", just transcribe the reference
    # 'compress' function from Python into JavaScript

    def compress(data):

        keys =   '0123456789abcdef'
        values = 'klmnopqrstuvwxyz'
        mapping = dict(zip(keys, values))
        vals = []
        for key in data.keys():
            value = data[key]
            try:
                keystring = hex(key)[2:]
                keystring = keystring[:-1] + mapping[keystring[-1:]]
            except:
                keystring = key.join(["'","'"])
                #print('Keystring is %s' % keystring)

            try:
                if value < 0:
                    valuestring = hex(value)[3:]
                    numberprefix = '-'
                else:
                    valuestring = hex(value)[2:]
                    numberprefix = ''
                valuestring = numberprefix + valuestring[:-1] + mapping[valuestring[-1:]]
            except:
                if type(value) == dict:
                    valuestring = compress(value)
                else:
                    raise Exception("Don't know what to do with value type %s" % type(value))

            vals.append(keystring+valuestring)

        return '{' + ''.join(vals) + '}'

    def uncompress(data):

        decoded = '0123456789abcdef'
        encoded = 'klmnopqrstuvwxyz'
        mapping = dict(zip(encoded, decoded))

        sign = +1
        stringmode = False
        stringparts = []

        output = {}

        activeobject = output
        parentchain = []

        keyparts = ''
        valueparts = ''

        key = None

        ending = set(encoded)

        i = 1
        l = len(data) - 1 # stripping starting, ending {}
        while i != l: # stripping {}
            # -, {, }, ' are special.

            ch = data[i]
            i += 1

            if ch == "'":
                if stringmode:
                    # end of string mode
                    stringmode = False
                    key = ''.join(stringparts)
                else:
                    # start of string mode
                    stringmode = True
                    stringparts = []
            elif stringmode == True:
                #print("Adding %s to stringpart" % ch)
                stringparts.append(ch)

            elif ch == '{':
                # start of object
                parentchain.append( [activeobject, key] )
                activeobject = {}
                key = None
                #DEBUG = True
            elif ch == '}':
                # end of object
                parent, key = parentchain.pop()
                parent[key] = activeobject
                key = None
                activeobject = parent
                #DEBUG = False

            elif ch == '-':
                sign = -1
            else:
                # must be number
                if key == None:
                    #debug("In Key. It is '%s', ch is '%s'" % (keyparts, ch))
                    if ch in ending:
                        #debug("End of key")
                        keyparts += mapping[ch]
                        key = int(keyparts, 16) * sign
                        sign = +1
                        keyparts = ''
                    else:
                        keyparts += ch
                else:
                    #debug("In value. It is '%s', ch is '%s'" % (valueparts, ch))
                    if ch in ending:
                        #debug("End of value")
                        valueparts += mapping[ch]
                        activeobject[key] = int(valueparts, 16) * sign
                        sign = +1
                        key = None
                        valueparts = ''
                    else:
                        valueparts += ch

                #debug(activeobject)

        return output

    */

    /**
    Uncompresses data compressed into custom, base16-like format.
    @public
    @function
    @param
    @returns {Type}
    */
    var uncompress = function(data){

        var decoded = '0123456789abcdef'
        , encoded = 'klmnopqrstuvwxyz'
        , mapping = {}

        for (var i = 0; i < encoded.length; i++){
            mapping[encoded[i]] = decoded[i]
        }

        var undef
        , output = {}
        , sign = 1
        , stringparts // undef. will be [] in string mode

        , activeobject = output
        , parentchain = []
        , parent_key_pair
        , keyparts = ''
        , valueparts = ''
        , key // undef. will be Truthy when Key is resolved.
        , datalen = data.length - 1 // stripping ending }
        , ch

        i = 1 // stripping starting {

        while (i != datalen){
            // - { } ' are special.

            ch = data[i]
            i += 1

            if (ch == "'"){
                if (stringparts){
                    // end of string mode
                    key = stringparts.join('')
                    stringparts = undef
                } else {
                    // start of string mode
                    stringparts = []
                }
            } else if (stringparts){
                stringparts.push(ch)
            } else if (ch == '{'){
                // start of object
                parentchain.push( [activeobject, key] )
                activeobject = {}
                key = undef
            } else if (ch == '}'){
                // end of object
                parent_key_pair = parentchain.pop()
                parent_key_pair[0][parent_key_pair[1]] = activeobject
                key = undef
                activeobject = parent_key_pair[0]
            } else if (ch == '-'){
                sign = -1
            } else {
                // must be number
                if (key === undef) {
                    if (mapping.hasOwnProperty(ch)){
                        keyparts += mapping[ch]
                        key = parseInt(keyparts, 16) * sign
                        sign = +1
                        keyparts = ''
                    } else {
                        keyparts += ch
                    }
                } else {
                    if (mapping.hasOwnProperty(ch)){
                        valueparts += mapping[ch]
                        activeobject[key] = parseInt(valueparts, 16) * sign
                        sign = +1
                        key = undef
                        valueparts = ''
                    } else {
                        valueparts += ch
                    }
                }
            }
        } // end while

        return output
    }

    // encoding = 'Unicode'
    // NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE. NO clever BOM behavior
    // Actual 16bit char codes used.
    // no multi-byte logic here

    // Unicode characters to WinAnsiEncoding:
    // {402: 131, 8211: 150, 8212: 151, 8216: 145, 8217: 146, 8218: 130, 8220: 147, 8221: 148, 8222: 132, 8224: 134, 8225: 135, 8226: 149, 8230: 133, 8364: 128, 8240:137, 8249: 139, 8250: 155, 710: 136, 8482: 153, 338: 140, 339: 156, 732: 152, 352: 138, 353: 154, 376: 159, 381: 142, 382: 158}
    // as you can see, all Unicode chars are outside of 0-255 range. No char code conflicts.
    // this means that you can give Win cp1252 encoded strings to jsPDF for rendering directly
    // as well as give strings with some (supported by these fonts) Unicode characters and
    // these will be mapped to win cp1252
    // for example, you can send char code (cp1252) 0x80 or (unicode) 0x20AC, getting "Euro" glyph displayed in both cases.

    var encodingBlock = {
        'codePages': ['WinAnsiEncoding']
        , 'WinAnsiEncoding': uncompress("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")
    }
    , encodings = {'Unicode':{
        'Courier': encodingBlock
        , 'Courier-Bold': encodingBlock
        , 'Courier-BoldOblique': encodingBlock
        , 'Courier-Oblique': encodingBlock
        , 'Helvetica': encodingBlock
        , 'Helvetica-Bold': encodingBlock
        , 'Helvetica-BoldOblique': encodingBlock
        , 'Helvetica-Oblique': encodingBlock
        , 'Times-Roman': encodingBlock
        , 'Times-Bold': encodingBlock
        , 'Times-BoldItalic': encodingBlock
        , 'Times-Italic': encodingBlock
    //  , 'Symbol'
    //  , 'ZapfDingbats'
    }}
    /**
    Resources:
    Font metrics data is reprocessed derivative of contents of
    "Font Metrics for PDF Core 14 Fonts" package, which exhibits the following copyright and license:

    Copyright (c) 1989, 1990, 1991, 1992, 1993, 1997 Adobe Systems Incorporated. All Rights Reserved.

    This file and the 14 PostScript(R) AFM files it accompanies may be used,
    copied, and distributed for any purpose and without charge, with or without
    modification, provided that all copyright notices are retained; that the AFM
    files are not distributed without this file; that all modifications to this
    file or any of the AFM files are prominently noted in the modified file(s);
    and that this paragraph is not modified. Adobe Systems has no responsibility
    or obligation to support the use of the AFM files.

    */
    , fontMetrics = {'Unicode':{
        // all sizing numbers are n/fontMetricsFractionOf = one font size unit
        // this means that if fontMetricsFractionOf = 1000, and letter A's width is 476, it's
        // width is 476/1000 or 47.6% of its height (regardless of font size)
        // At this time this value applies to "widths" and "kerning" numbers.

        // char code 0 represents "default" (average) width - use it for chars missing in this table.
        // key 'fof' represents the "fontMetricsFractionOf" value

        'Courier-Oblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
        , 'Times-BoldItalic': uncompress("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}")
        , 'Helvetica-Bold': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}")
        , 'Courier': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
        , 'Courier-BoldOblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
        , 'Times-Bold': uncompress("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}")
        //, 'Symbol': uncompress("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}")
        , 'Helvetica': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
        , 'Helvetica-BoldOblique': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}")
        //, 'ZapfDingbats': uncompress("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}")
        , 'Courier-Bold': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
        , 'Times-Italic': uncompress("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}")
        , 'Times-Roman': uncompress("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}")
        , 'Helvetica-Oblique': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
    }};

    /*
    This event handler is fired when a new jsPDF object is initialized
    This event handler appends metrics data to standard fonts within
    that jsPDF instance. The metrics are mapped over Unicode character
    codes, NOT CIDs or other codes matching the StandardEncoding table of the
    standard PDF fonts.
    Future:
    Also included is the encoding maping table, converting Unicode (UCS-2, UTF-16)
    char codes to StandardEncoding character codes. The encoding table is to be used
    somewhere around "pdfEscape" call.
    */

    API.events.push([
        'addFonts'
        ,function(fontManagementObjects) {
            // fontManagementObjects is {
            //  'fonts':font_ID-keyed hash of font objects
            //  , 'dictionary': lookup object, linking ["FontFamily"]['Style'] to font ID
            //}
            var font
            , fontID
            , metrics
            , unicode_section
            , encoding = 'Unicode'
            , encodingBlock

            for (fontID in fontManagementObjects.fonts){
                if (fontManagementObjects.fonts.hasOwnProperty(fontID)) {
                    font = fontManagementObjects.fonts[fontID]

                    // // we only ship 'Unicode' mappings and metrics. No need for loop.
                    // // still, leaving this for the future.

                    // for (encoding in fontMetrics){
                    //  if (fontMetrics.hasOwnProperty(encoding)) {

                            metrics = fontMetrics[encoding][font.PostScriptName]
                            if (metrics) {
                                if (font.metadata[encoding]) {
                                    unicode_section = font.metadata[encoding]
                                } else {
                                    unicode_section = font.metadata[encoding] = {}
                                }

                                unicode_section.widths = metrics.widths
                                unicode_section.kerning = metrics.kerning
                            }
                    //  }
                    // }
                    // for (encoding in encodings){
                    //  if (encodings.hasOwnProperty(encoding)) {
                            encodingBlock = encodings[encoding][font.PostScriptName]
                            if (encodingBlock) {
                                if (font.metadata[encoding]) {
                                    unicode_section = font.metadata[encoding]
                                } else {
                                    unicode_section = font.metadata[encoding] = {}
                                }

                                unicode_section.encoding = encodingBlock
                                if (encodingBlock.codePages && encodingBlock.codePages.length) {
                                    font.encoding = encodingBlock.codePages[0]
                                }
                            }
                    //  }
                    // }
                }
            }
        }
    ]) // end of adding event handler

    })(jsPDF.API);
    /** ====================================================================
     * jsPDF total_pages plugin
     * Copyright (c) 2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
     *
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     * ====================================================================
     */

    (function(jsPDFAPI) {
    'use strict';

    jsPDFAPI.putTotalPages = function(pageExpression) {
        'use strict';
            var replaceExpression = new RegExp(pageExpression, 'g');
            for (var n = 1; n <= this.internal.getNumberOfPages(); n++) {
                for (var i = 0; i < this.internal.pages[n].length; i++)
                   this.internal.pages[n][i] = this.internal.pages[n][i].replace(replaceExpression, this.internal.getNumberOfPages());
            }
        return this;
    };

    })(jsPDF.API);
    /* Blob.js
     * A Blob implementation.
     * 2014-07-24
     *
     * By Eli Grey, http://eligrey.com
     * By Devin Samarin, https://github.com/dsamarin
     * License: X11/MIT
     *   See https://github.com/eligrey/Blob.js/blob/master/LICENSE.md
     */

    /*global self, unescape */
    /*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
      plusplus: true */

    /*! @source http://purl.eligrey.com/github/Blob.js/blob/master/Blob.js */

    (function (view) {
        "use strict";

        view.URL = view.URL || view.webkitURL;

        if (view.Blob && view.URL) {
            try {
                new Blob;
                return;
            } catch (e) {}
        }

        // Internally we use a BlobBuilder implementation to base Blob off of
        // in order to support older browsers that only have BlobBuilder
        var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || (function(view) {
            var
                  get_class = function(object) {
                    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
                }
                , FakeBlobBuilder = function BlobBuilder() {
                    this.data = [];
                }
                , FakeBlob = function Blob(data, type, encoding) {
                    this.data = data;
                    this.size = data.length;
                    this.type = type;
                    this.encoding = encoding;
                }
                , FBB_proto = FakeBlobBuilder.prototype
                , FB_proto = FakeBlob.prototype
                , FileReaderSync = view.FileReaderSync
                , FileException = function(type) {
                    this.code = this[this.name = type];
                }
                , file_ex_codes = (
                      "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR "
                    + "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
                ).split(" ")
                , file_ex_code = file_ex_codes.length
                , real_URL = view.URL || view.webkitURL || view
                , real_create_object_URL = real_URL.createObjectURL
                , real_revoke_object_URL = real_URL.revokeObjectURL
                , URL = real_URL
                , btoa = view.btoa
                , atob = view.atob

                , ArrayBuffer = view.ArrayBuffer
                , Uint8Array = view.Uint8Array

                , origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/
            ;
            FakeBlob.fake = FB_proto.fake = true;
            while (file_ex_code--) {
                FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
            }
            // Polyfill URL
            if (!real_URL.createObjectURL) {
                URL = view.URL = function(uri) {
                    var
                          uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
                        , uri_origin
                    ;
                    uri_info.href = uri;
                    if (!("origin" in uri_info)) {
                        if (uri_info.protocol.toLowerCase() === "data:") {
                            uri_info.origin = null;
                        } else {
                            uri_origin = uri.match(origin);
                            uri_info.origin = uri_origin && uri_origin[1];
                        }
                    }
                    return uri_info;
                };
            }
            URL.createObjectURL = function(blob) {
                var
                      type = blob.type
                    , data_URI_header
                ;
                if (type === null) {
                    type = "application/octet-stream";
                }
                if (blob instanceof FakeBlob) {
                    data_URI_header = "data:" + type;
                    if (blob.encoding === "base64") {
                        return data_URI_header + ";base64," + blob.data;
                    } else if (blob.encoding === "URI") {
                        return data_URI_header + "," + decodeURIComponent(blob.data);
                    } if (btoa) {
                        return data_URI_header + ";base64," + btoa(blob.data);
                    } else {
                        return data_URI_header + "," + encodeURIComponent(blob.data);
                    }
                } else if (real_create_object_URL) {
                    return real_create_object_URL.call(real_URL, blob);
                }
            };
            URL.revokeObjectURL = function(object_URL) {
                if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
                    real_revoke_object_URL.call(real_URL, object_URL);
                }
            };
            FBB_proto.append = function(data/*, endings*/) {
                var bb = this.data;
                // decode data to a binary string
                if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
                    var
                          str = ""
                        , buf = new Uint8Array(data)
                        , i = 0
                        , buf_len = buf.length
                    ;
                    for (; i < buf_len; i++) {
                        str += String.fromCharCode(buf[i]);
                    }
                    bb.push(str);
                } else if (get_class(data) === "Blob" || get_class(data) === "File") {
                    if (FileReaderSync) {
                        var fr = new FileReaderSync;
                        bb.push(fr.readAsBinaryString(data));
                    } else {
                        // async FileReader won't work as BlobBuilder is sync
                        throw new FileException("NOT_READABLE_ERR");
                    }
                } else if (data instanceof FakeBlob) {
                    if (data.encoding === "base64" && atob) {
                        bb.push(atob(data.data));
                    } else if (data.encoding === "URI") {
                        bb.push(decodeURIComponent(data.data));
                    } else if (data.encoding === "raw") {
                        bb.push(data.data);
                    }
                } else {
                    if (typeof data !== "string") {
                        data += ""; // convert unsupported types to strings
                    }
                    // decode UTF-16 to binary string
                    bb.push(unescape(encodeURIComponent(data)));
                }
            };
            FBB_proto.getBlob = function(type) {
                if (!arguments.length) {
                    type = null;
                }
                return new FakeBlob(this.data.join(""), type, "raw");
            };
            FBB_proto.toString = function() {
                return "[object BlobBuilder]";
            };
            FB_proto.slice = function(start, end, type) {
                var args = arguments.length;
                if (args < 3) {
                    type = null;
                }
                return new FakeBlob(
                      this.data.slice(start, args > 1 ? end : this.data.length)
                    , type
                    , this.encoding
                );
            };
            FB_proto.toString = function() {
                return "[object Blob]";
            };
            FB_proto.close = function() {
                this.size = 0;
                delete this.data;
            };
            return FakeBlobBuilder;
        }(view));

        view.Blob = function(blobParts, options) {
            var type = options ? (options.type || "") : "";
            var builder = new BlobBuilder();
            if (blobParts) {
                for (var i = 0, len = blobParts.length; i < len; i++) {
                    builder.append(blobParts[i]);
                }
            }
            return builder.getBlob(type);
        };
    }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content || this));
    /* FileSaver.js
     * A saveAs() FileSaver implementation.
     * 2014-08-29
     *
     * By Eli Grey, http://eligrey.com
     * License: X11/MIT
     *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
     */

    /*global self */
    /*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

    /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

    var saveAs = saveAs
      // IE 10+ (native saveAs)
      || (typeof navigator !== "undefined" &&
          navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
      // Everyone else
      || (function(view) {
        "use strict";
        // IE <10 is explicitly unsupported
        if (typeof navigator !== "undefined" &&
            /MSIE [1-9]\./.test(navigator.userAgent)) {
            return;
        }
        var
              doc = view.document
              // only get URL when necessary in case Blob.js hasn't overridden it yet
            , get_URL = function() {
                return view.URL || view.webkitURL || view;
            }
            , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
            , can_use_save_link = "download" in save_link
            , click = function(node) {
                var event = doc.createEvent("MouseEvents");
                event.initMouseEvent(
                    "click", true, false, view, 0, 0, 0, 0, 0
                    , false, false, false, false, 0, null
                );
                node.dispatchEvent(event);
            }
            , webkit_req_fs = view.webkitRequestFileSystem
            , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
            , throw_outside = function(ex) {
                (view.setImmediate || view.setTimeout)(function() {
                    throw ex;
                }, 0);
            }
            , force_saveable_type = "application/octet-stream"
            , fs_min_size = 0
            // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 for
            // the reasoning behind the timeout and revocation flow
            , arbitrary_revoke_timeout = 10
            , revoke = function(file) {
                var revoker = function() {
                    if (typeof file === "string") { // file is an object URL
                        get_URL().revokeObjectURL(file);
                    } else { // file is a File
                        file.remove();
                    }
                };
                if (view.chrome) {
                    revoker();
                } else {
                    setTimeout(revoker, arbitrary_revoke_timeout);
                }
            }
            , dispatch = function(filesaver, event_types, event) {
                event_types = [].concat(event_types);
                var i = event_types.length;
                while (i--) {
                    var listener = filesaver["on" + event_types[i]];
                    if (typeof listener === "function") {
                        try {
                            listener.call(filesaver, event || filesaver);
                        } catch (ex) {
                            throw_outside(ex);
                        }
                    }
                }
            }
            , FileSaver = function(blob, name) {
                // First try a.download, then web filesystem, then object URLs
                var
                      filesaver = this
                    , type = blob.type
                    , blob_changed = false
                    , object_url
                    , target_view
                    , dispatch_all = function() {
                        dispatch(filesaver, "writestart progress write writeend".split(" "));
                    }
                    // on any filesys errors revert to saving with object URLs
                    , fs_error = function() {
                        // don't create more object URLs than needed
                        if (blob_changed || !object_url) {
                            object_url = get_URL().createObjectURL(blob);
                        }
                        if (target_view) {
                            target_view.location.href = object_url;
                        } else {
                            var new_tab = view.open(object_url, "_blank");
                            if (new_tab == undefined && typeof safari !== "undefined") {
                                //Apple do not allow window.open, see http://bit.ly/1kZffRI
                                view.location.href = object_url
                            }
                        }
                        filesaver.readyState = filesaver.DONE;
                        dispatch_all();
                        revoke(object_url);
                    }
                    , abortable = function(func) {
                        return function() {
                            if (filesaver.readyState !== filesaver.DONE) {
                                return func.apply(this, arguments);
                            }
                        };
                    }
                    , create_if_not_found = {create: true, exclusive: false}
                    , slice
                ;
                filesaver.readyState = filesaver.INIT;
                if (!name) {
                    name = "download";
                }
                if (can_use_save_link) {
                    object_url = get_URL().createObjectURL(blob);
                    save_link.href = object_url;
                    save_link.download = name;
                    click(save_link);
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                    revoke(object_url);
                    return;
                }
                // Object and web filesystem URLs have a problem saving in Google Chrome when
                // viewed in a tab, so I force save with application/octet-stream
                // http://code.google.com/p/chromium/issues/detail?id=91158
                // Update: Google errantly closed 91158, I submitted it again:
                // https://code.google.com/p/chromium/issues/detail?id=389642
                if (view.chrome && type && type !== force_saveable_type) {
                    slice = blob.slice || blob.webkitSlice;
                    blob = slice.call(blob, 0, blob.size, force_saveable_type);
                    blob_changed = true;
                }
                // Since I can't be sure that the guessed media type will trigger a download
                // in WebKit, I append .download to the filename.
                // https://bugs.webkit.org/show_bug.cgi?id=65440
                if (webkit_req_fs && name !== "download") {
                    name += ".download";
                }
                if (type === force_saveable_type || webkit_req_fs) {
                    target_view = view;
                }
                if (!req_fs) {
                    fs_error();
                    return;
                }
                fs_min_size += blob.size;
                req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
                    fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
                        var save = function() {
                            dir.getFile(name, create_if_not_found, abortable(function(file) {
                                file.createWriter(abortable(function(writer) {
                                    writer.onwriteend = function(event) {
                                        target_view.location.href = file.toURL();
                                        filesaver.readyState = filesaver.DONE;
                                        dispatch(filesaver, "writeend", event);
                                        revoke(file);
                                    };
                                    writer.onerror = function() {
                                        var error = writer.error;
                                        if (error.code !== error.ABORT_ERR) {
                                            fs_error();
                                        }
                                    };
                                    "writestart progress write abort".split(" ").forEach(function(event) {
                                        writer["on" + event] = filesaver["on" + event];
                                    });
                                    writer.write(blob);
                                    filesaver.abort = function() {
                                        writer.abort();
                                        filesaver.readyState = filesaver.DONE;
                                    };
                                    filesaver.readyState = filesaver.WRITING;
                                }), fs_error);
                            }), fs_error);
                        };
                        dir.getFile(name, {create: false}, abortable(function(file) {
                            // delete file if it already exists
                            file.remove();
                            save();
                        }), abortable(function(ex) {
                            if (ex.code === ex.NOT_FOUND_ERR) {
                                save();
                            } else {
                                fs_error();
                            }
                        }));
                    }), fs_error);
                }), fs_error);
            }
            , FS_proto = FileSaver.prototype
            , saveAs = function(blob, name) {
                return new FileSaver(blob, name);
            }
        ;
        FS_proto.abort = function() {
            var filesaver = this;
            filesaver.readyState = filesaver.DONE;
            dispatch(filesaver, "abort");
        };
        FS_proto.readyState = FS_proto.INIT = 0;
        FS_proto.WRITING = 1;
        FS_proto.DONE = 2;

        FS_proto.error =
        FS_proto.onwritestart =
        FS_proto.onprogress =
        FS_proto.onwrite =
        FS_proto.onabort =
        FS_proto.onerror =
        FS_proto.onwriteend =
            null;

        return saveAs;
    }(
           typeof self !== "undefined" && self
        || typeof window !== "undefined" && window
        || this.content
    ));
    // `self` is undefined in Firefox for Android content script context
    // while `this` is nsIContentFrameMessageManager
    // with an attribute `content` that corresponds to the window

    if (typeof module !== "undefined" && module !== null) {
      module.exports = saveAs;
    } else if ((typeof define !== "undefined" && 0)) {
      define([], function() {
        return saveAs;
      });
    }
    /*
     * Copyright (c) 2012 chick307 <chick307@gmail.com>
     *
     * Licensed under the MIT License.
     * http://opensource.org/licenses/mit-license
     */

    void function(global, callback) {
        if (typeof module === 'object') {
            module.exports = callback();
        } else if (0 === 'function') {
            define(callback);
        } else {
            global.adler32cs = callback();
        }
    }(jsPDF, function() {
        var _hasArrayBuffer = typeof ArrayBuffer === 'function' &&
            typeof Uint8Array === 'function';

        var _Buffer = null, _isBuffer = (function() {
            if (!_hasArrayBuffer)
                return function _isBuffer() { return false };

            try {
                var buffer = require('buffer');
                if (typeof buffer.Buffer === 'function')
                    _Buffer = buffer.Buffer;
            } catch (error) {}

            return function _isBuffer(value) {
                return value instanceof ArrayBuffer ||
                    _Buffer !== null && value instanceof _Buffer;
            };
        }());

        var _utf8ToBinary = (function() {
            if (_Buffer !== null) {
                return function _utf8ToBinary(utf8String) {
                    return new _Buffer(utf8String, 'utf8').toString('binary');
                };
            } else {
                return function _utf8ToBinary(utf8String) {
                    return unescape(encodeURIComponent(utf8String));
                };
            }
        }());

        var MOD = 65521;

        var _update = function _update(checksum, binaryString) {
            var a = checksum & 0xFFFF, b = checksum >>> 16;
            for (var i = 0, length = binaryString.length; i < length; i++) {
                a = (a + (binaryString.charCodeAt(i) & 0xFF)) % MOD;
                b = (b + a) % MOD;
            }
            return (b << 16 | a) >>> 0;
        };

        var _updateUint8Array = function _updateUint8Array(checksum, uint8Array) {
            var a = checksum & 0xFFFF, b = checksum >>> 16;
            for (var i = 0, length = uint8Array.length, x; i < length; i++) {
                a = (a + uint8Array[i]) % MOD;
                b = (b + a) % MOD;
            }
            return (b << 16 | a) >>> 0
        };

        var exports = {};

        var Adler32 = exports.Adler32 = (function() {
            var ctor = function Adler32(checksum) {
                if (!(this instanceof ctor)) {
                    throw new TypeError(
                        'Constructor cannot called be as a function.');
                }
                if (!isFinite(checksum = checksum == null ? 1 : +checksum)) {
                    throw new Error(
                        'First arguments needs to be a finite number.');
                }
                this.checksum = checksum >>> 0;
            };

            var proto = ctor.prototype = {};
            proto.constructor = ctor;

            ctor.from = function(from) {
                from.prototype = proto;
                return from;
            }(function from(binaryString) {
                if (!(this instanceof ctor)) {
                    throw new TypeError(
                        'Constructor cannot called be as a function.');
                }
                if (binaryString == null)
                    throw new Error('First argument needs to be a string.');
                this.checksum = _update(1, binaryString.toString());
            });

            ctor.fromUtf8 = function(fromUtf8) {
                fromUtf8.prototype = proto;
                return fromUtf8;
            }(function fromUtf8(utf8String) {
                if (!(this instanceof ctor)) {
                    throw new TypeError(
                        'Constructor cannot called be as a function.');
                }
                if (utf8String == null)
                    throw new Error('First argument needs to be a string.');
                var binaryString = _utf8ToBinary(utf8String.toString());
                this.checksum = _update(1, binaryString);
            });

            if (_hasArrayBuffer) {
                ctor.fromBuffer = function(fromBuffer) {
                    fromBuffer.prototype = proto;
                    return fromBuffer;
                }(function fromBuffer(buffer) {
                    if (!(this instanceof ctor)) {
                        throw new TypeError(
                            'Constructor cannot called be as a function.');
                    }
                    if (!_isBuffer(buffer))
                        throw new Error('First argument needs to be ArrayBuffer.');
                    var array = new Uint8Array(buffer);
                    return this.checksum = _updateUint8Array(1, array);
                });
            }

            proto.update = function update(binaryString) {
                if (binaryString == null)
                    throw new Error('First argument needs to be a string.');
                binaryString = binaryString.toString();
                return this.checksum = _update(this.checksum, binaryString);
            };

            proto.updateUtf8 = function updateUtf8(utf8String) {
                if (utf8String == null)
                    throw new Error('First argument needs to be a string.');
                var binaryString = _utf8ToBinary(utf8String.toString());
                return this.checksum = _update(this.checksum, binaryString);
            };

            if (_hasArrayBuffer) {
                proto.updateBuffer = function updateBuffer(buffer) {
                    if (!_isBuffer(buffer))
                        throw new Error('First argument needs to be ArrayBuffer.');
                    var array = new Uint8Array(buffer);
                    return this.checksum = _updateUint8Array(this.checksum, array);
                };
            }

            proto.clone = function clone() {
                return new Adler32(this.checksum);
            };

            return ctor;
        }());

        exports.from = function from(binaryString) {
            if (binaryString == null)
                throw new Error('First argument needs to be a string.');
            return _update(1, binaryString.toString());
        };

        exports.fromUtf8 = function fromUtf8(utf8String) {
            if (utf8String == null)
                throw new Error('First argument needs to be a string.');
            var binaryString = _utf8ToBinary(utf8String.toString());
            return _update(1, binaryString);
        };

        if (_hasArrayBuffer) {
            exports.fromBuffer = function fromBuffer(buffer) {
                if (!_isBuffer(buffer))
                    throw new Error('First argument need to be ArrayBuffer.');
                var array = new Uint8Array(buffer);
                return _updateUint8Array(1, array);
            };
        }

        return exports;
    });
    /*
     Deflate.js - https://github.com/gildas-lormeau/zip.js
     Copyright (c) 2013 Gildas Lormeau. All rights reserved.

     Redistribution and use in source and binary forms, with or without
     modification, are permitted provided that the following conditions are met:

     1. Redistributions of source code must retain the above copyright notice,
     this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in
     the documentation and/or other materials provided with the distribution.

     3. The names of the authors may not be used to endorse or promote products
     derived from this software without specific prior written permission.

     THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
     INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
     FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
     INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
     INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
     LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
     OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
     LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
     EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */

    /*
     * This program is based on JZlib 1.0.2 ymnk, JCraft,Inc.
     * JZlib is based on zlib-1.1.3, so all credit should go authors
     * Jean-loup Gailly(jloup@gzip.org) and Mark Adler(madler@alumni.caltech.edu)
     * and contributors of zlib.
     */

    var Deflater = (function(obj) {

        // Global

        var MAX_BITS = 15;
        var D_CODES = 30;
        var BL_CODES = 19;

        var LENGTH_CODES = 29;
        var LITERALS = 256;
        var L_CODES = (LITERALS + 1 + LENGTH_CODES);
        var HEAP_SIZE = (2 * L_CODES + 1);

        var END_BLOCK = 256;

        // Bit length codes must not exceed MAX_BL_BITS bits
        var MAX_BL_BITS = 7;

        // repeat previous bit length 3-6 times (2 bits of repeat count)
        var REP_3_6 = 16;

        // repeat a zero length 3-10 times (3 bits of repeat count)
        var REPZ_3_10 = 17;

        // repeat a zero length 11-138 times (7 bits of repeat count)
        var REPZ_11_138 = 18;

        // The lengths of the bit length codes are sent in order of decreasing
        // probability, to avoid transmitting the lengths for unused bit
        // length codes.

        var Buf_size = 8 * 2;

        // JZlib version : "1.0.2"
        var Z_DEFAULT_COMPRESSION = -1;

        // compression strategy
        var Z_FILTERED = 1;
        var Z_HUFFMAN_ONLY = 2;
        var Z_DEFAULT_STRATEGY = 0;

        var Z_NO_FLUSH = 0;
        var Z_PARTIAL_FLUSH = 1;
        var Z_FULL_FLUSH = 3;
        var Z_FINISH = 4;

        var Z_OK = 0;
        var Z_STREAM_END = 1;
        var Z_NEED_DICT = 2;
        var Z_STREAM_ERROR = -2;
        var Z_DATA_ERROR = -3;
        var Z_BUF_ERROR = -5;

        // Tree

        // see definition of array dist_code below
        var _dist_code = [ 0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
                10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
                12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
                13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
                14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
                14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 16, 17, 18, 18, 19, 19,
                20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
                26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27,
                27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
                28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29,
                29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
                29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29 ];

        function Tree() {
            var that = this;

            // dyn_tree; // the dynamic tree
            // max_code; // largest code with non zero frequency
            // stat_desc; // the corresponding static tree

            // Compute the optimal bit lengths for a tree and update the total bit
            // length
            // for the current block.
            // IN assertion: the fields freq and dad are set, heap[heap_max] and
            // above are the tree nodes sorted by increasing frequency.
            // OUT assertions: the field len is set to the optimal bit length, the
            // array bl_count contains the frequencies for each bit length.
            // The length opt_len is updated; static_len is also updated if stree is
            // not null.
            function gen_bitlen(s) {
                var tree = that.dyn_tree;
                var stree = that.stat_desc.static_tree;
                var extra = that.stat_desc.extra_bits;
                var base = that.stat_desc.extra_base;
                var max_length = that.stat_desc.max_length;
                var h; // heap index
                var n, m; // iterate over the tree elements
                var bits; // bit length
                var xbits; // extra bits
                var f; // frequency
                var overflow = 0; // number of elements with bit length too large

                for (bits = 0; bits <= MAX_BITS; bits++)
                    s.bl_count[bits] = 0;

                // In a first pass, compute the optimal bit lengths (which may
                // overflow in the case of the bit length tree).
                tree[s.heap[s.heap_max] * 2 + 1] = 0; // root of the heap

                for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
                    n = s.heap[h];
                    bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
                    if (bits > max_length) {
                        bits = max_length;
                        overflow++;
                    }
                    tree[n * 2 + 1] = bits;
                    // We overwrite tree[n*2+1] which is no longer needed

                    if (n > that.max_code)
                        continue; // not a leaf node

                    s.bl_count[bits]++;
                    xbits = 0;
                    if (n >= base)
                        xbits = extra[n - base];
                    f = tree[n * 2];
                    s.opt_len += f * (bits + xbits);
                    if (stree)
                        s.static_len += f * (stree[n * 2 + 1] + xbits);
                }
                if (overflow === 0)
                    return;

                // This happens for example on obj2 and pic of the Calgary corpus
                // Find the first bit length which could increase:
                do {
                    bits = max_length - 1;
                    while (s.bl_count[bits] === 0)
                        bits--;
                    s.bl_count[bits]--; // move one leaf down the tree
                    s.bl_count[bits + 1] += 2; // move one overflow item as its brother
                    s.bl_count[max_length]--;
                    // The brother of the overflow item also moves one step up,
                    // but this does not affect bl_count[max_length]
                    overflow -= 2;
                } while (overflow > 0);

                for (bits = max_length; bits !== 0; bits--) {
                    n = s.bl_count[bits];
                    while (n !== 0) {
                        m = s.heap[--h];
                        if (m > that.max_code)
                            continue;
                        if (tree[m * 2 + 1] != bits) {
                            s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
                            tree[m * 2 + 1] = bits;
                        }
                        n--;
                    }
                }
            }

            // Reverse the first len bits of a code, using straightforward code (a
            // faster
            // method would use a table)
            // IN assertion: 1 <= len <= 15
            function bi_reverse(code, // the value to invert
            len // its bit length
            ) {
                var res = 0;
                do {
                    res |= code & 1;
                    code >>>= 1;
                    res <<= 1;
                } while (--len > 0);
                return res >>> 1;
            }

            // Generate the codes for a given tree and bit counts (which need not be
            // optimal).
            // IN assertion: the array bl_count contains the bit length statistics for
            // the given tree and the field len is set for all tree elements.
            // OUT assertion: the field code is set for all tree elements of non
            // zero code length.
            function gen_codes(tree, // the tree to decorate
            max_code, // largest code with non zero frequency
            bl_count // number of codes at each bit length
            ) {
                var next_code = []; // next code value for each
                // bit length
                var code = 0; // running code value
                var bits; // bit index
                var n; // code index
                var len;

                // The distribution counts are first used to generate the code values
                // without bit reversal.
                for (bits = 1; bits <= MAX_BITS; bits++) {
                    next_code[bits] = code = ((code + bl_count[bits - 1]) << 1);
                }

                // Check that the bit counts in bl_count are consistent. The last code
                // must be all ones.
                // Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
                // "inconsistent bit counts");
                // Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

                for (n = 0; n <= max_code; n++) {
                    len = tree[n * 2 + 1];
                    if (len === 0)
                        continue;
                    // Now reverse the bits
                    tree[n * 2] = bi_reverse(next_code[len]++, len);
                }
            }

            // Construct one Huffman tree and assigns the code bit strings and lengths.
            // Update the total bit length for the current block.
            // IN assertion: the field freq is set for all tree elements.
            // OUT assertions: the fields len and code are set to the optimal bit length
            // and corresponding code. The length opt_len is updated; static_len is
            // also updated if stree is not null. The field max_code is set.
            that.build_tree = function(s) {
                var tree = that.dyn_tree;
                var stree = that.stat_desc.static_tree;
                var elems = that.stat_desc.elems;
                var n, m; // iterate over heap elements
                var max_code = -1; // largest code with non zero frequency
                var node; // new node being created

                // Construct the initial heap, with least frequent element in
                // heap[1]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
                // heap[0] is not used.
                s.heap_len = 0;
                s.heap_max = HEAP_SIZE;

                for (n = 0; n < elems; n++) {
                    if (tree[n * 2] !== 0) {
                        s.heap[++s.heap_len] = max_code = n;
                        s.depth[n] = 0;
                    } else {
                        tree[n * 2 + 1] = 0;
                    }
                }

                // The pkzip format requires that at least one distance code exists,
                // and that at least one bit should be sent even if there is only one
                // possible code. So to avoid special checks later on we force at least
                // two codes of non zero frequency.
                while (s.heap_len < 2) {
                    node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
                    tree[node * 2] = 1;
                    s.depth[node] = 0;
                    s.opt_len--;
                    if (stree)
                        s.static_len -= stree[node * 2 + 1];
                    // node is 0 or 1 so it does not have extra bits
                }
                that.max_code = max_code;

                // The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
                // establish sub-heaps of increasing lengths:

                for (n = Math.floor(s.heap_len / 2); n >= 1; n--)
                    s.pqdownheap(tree, n);

                // Construct the Huffman tree by repeatedly combining the least two
                // frequent nodes.

                node = elems; // next internal node of the tree
                do {
                    // n = node of least frequency
                    n = s.heap[1];
                    s.heap[1] = s.heap[s.heap_len--];
                    s.pqdownheap(tree, 1);
                    m = s.heap[1]; // m = node of next least frequency

                    s.heap[--s.heap_max] = n; // keep the nodes sorted by frequency
                    s.heap[--s.heap_max] = m;

                    // Create a new node father of n and m
                    tree[node * 2] = (tree[n * 2] + tree[m * 2]);
                    s.depth[node] = Math.max(s.depth[n], s.depth[m]) + 1;
                    tree[n * 2 + 1] = tree[m * 2 + 1] = node;

                    // and insert the new node in the heap
                    s.heap[1] = node++;
                    s.pqdownheap(tree, 1);
                } while (s.heap_len >= 2);

                s.heap[--s.heap_max] = s.heap[1];

                // At this point, the fields freq and dad are set. We can now
                // generate the bit lengths.

                gen_bitlen(s);

                // The field len is now set, we can generate the bit codes
                gen_codes(tree, that.max_code, s.bl_count);
            };

        }

        Tree._length_code = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16,
                16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20,
                20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
                22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
                25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
                26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28 ];

        Tree.base_length = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0 ];

        Tree.base_dist = [ 0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384,
                24576 ];

        // Mapping from a distance to a distance code. dist is the distance - 1 and
        // must not have side effects. _dist_code[256] and _dist_code[257] are never
        // used.
        Tree.d_code = function(dist) {
            return ((dist) < 256 ? _dist_code[dist] : _dist_code[256 + ((dist) >>> 7)]);
        };

        // extra bits for each length code
        Tree.extra_lbits = [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0 ];

        // extra bits for each distance code
        Tree.extra_dbits = [ 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13 ];

        // extra bits for each bit length code
        Tree.extra_blbits = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7 ];

        Tree.bl_order = [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];

        // StaticTree

        function StaticTree(static_tree, extra_bits, extra_base, elems, max_length) {
            var that = this;
            that.static_tree = static_tree;
            that.extra_bits = extra_bits;
            that.extra_base = extra_base;
            that.elems = elems;
            that.max_length = max_length;
        }

        StaticTree.static_ltree = [ 12, 8, 140, 8, 76, 8, 204, 8, 44, 8, 172, 8, 108, 8, 236, 8, 28, 8, 156, 8, 92, 8, 220, 8, 60, 8, 188, 8, 124, 8, 252, 8, 2, 8,
                130, 8, 66, 8, 194, 8, 34, 8, 162, 8, 98, 8, 226, 8, 18, 8, 146, 8, 82, 8, 210, 8, 50, 8, 178, 8, 114, 8, 242, 8, 10, 8, 138, 8, 74, 8, 202, 8, 42,
                8, 170, 8, 106, 8, 234, 8, 26, 8, 154, 8, 90, 8, 218, 8, 58, 8, 186, 8, 122, 8, 250, 8, 6, 8, 134, 8, 70, 8, 198, 8, 38, 8, 166, 8, 102, 8, 230, 8,
                22, 8, 150, 8, 86, 8, 214, 8, 54, 8, 182, 8, 118, 8, 246, 8, 14, 8, 142, 8, 78, 8, 206, 8, 46, 8, 174, 8, 110, 8, 238, 8, 30, 8, 158, 8, 94, 8,
                222, 8, 62, 8, 190, 8, 126, 8, 254, 8, 1, 8, 129, 8, 65, 8, 193, 8, 33, 8, 161, 8, 97, 8, 225, 8, 17, 8, 145, 8, 81, 8, 209, 8, 49, 8, 177, 8, 113,
                8, 241, 8, 9, 8, 137, 8, 73, 8, 201, 8, 41, 8, 169, 8, 105, 8, 233, 8, 25, 8, 153, 8, 89, 8, 217, 8, 57, 8, 185, 8, 121, 8, 249, 8, 5, 8, 133, 8,
                69, 8, 197, 8, 37, 8, 165, 8, 101, 8, 229, 8, 21, 8, 149, 8, 85, 8, 213, 8, 53, 8, 181, 8, 117, 8, 245, 8, 13, 8, 141, 8, 77, 8, 205, 8, 45, 8,
                173, 8, 109, 8, 237, 8, 29, 8, 157, 8, 93, 8, 221, 8, 61, 8, 189, 8, 125, 8, 253, 8, 19, 9, 275, 9, 147, 9, 403, 9, 83, 9, 339, 9, 211, 9, 467, 9,
                51, 9, 307, 9, 179, 9, 435, 9, 115, 9, 371, 9, 243, 9, 499, 9, 11, 9, 267, 9, 139, 9, 395, 9, 75, 9, 331, 9, 203, 9, 459, 9, 43, 9, 299, 9, 171, 9,
                427, 9, 107, 9, 363, 9, 235, 9, 491, 9, 27, 9, 283, 9, 155, 9, 411, 9, 91, 9, 347, 9, 219, 9, 475, 9, 59, 9, 315, 9, 187, 9, 443, 9, 123, 9, 379,
                9, 251, 9, 507, 9, 7, 9, 263, 9, 135, 9, 391, 9, 71, 9, 327, 9, 199, 9, 455, 9, 39, 9, 295, 9, 167, 9, 423, 9, 103, 9, 359, 9, 231, 9, 487, 9, 23,
                9, 279, 9, 151, 9, 407, 9, 87, 9, 343, 9, 215, 9, 471, 9, 55, 9, 311, 9, 183, 9, 439, 9, 119, 9, 375, 9, 247, 9, 503, 9, 15, 9, 271, 9, 143, 9,
                399, 9, 79, 9, 335, 9, 207, 9, 463, 9, 47, 9, 303, 9, 175, 9, 431, 9, 111, 9, 367, 9, 239, 9, 495, 9, 31, 9, 287, 9, 159, 9, 415, 9, 95, 9, 351, 9,
                223, 9, 479, 9, 63, 9, 319, 9, 191, 9, 447, 9, 127, 9, 383, 9, 255, 9, 511, 9, 0, 7, 64, 7, 32, 7, 96, 7, 16, 7, 80, 7, 48, 7, 112, 7, 8, 7, 72, 7,
                40, 7, 104, 7, 24, 7, 88, 7, 56, 7, 120, 7, 4, 7, 68, 7, 36, 7, 100, 7, 20, 7, 84, 7, 52, 7, 116, 7, 3, 8, 131, 8, 67, 8, 195, 8, 35, 8, 163, 8,
                99, 8, 227, 8 ];

        StaticTree.static_dtree = [ 0, 5, 16, 5, 8, 5, 24, 5, 4, 5, 20, 5, 12, 5, 28, 5, 2, 5, 18, 5, 10, 5, 26, 5, 6, 5, 22, 5, 14, 5, 30, 5, 1, 5, 17, 5, 9, 5,
                25, 5, 5, 5, 21, 5, 13, 5, 29, 5, 3, 5, 19, 5, 11, 5, 27, 5, 7, 5, 23, 5 ];

        StaticTree.static_l_desc = new StaticTree(StaticTree.static_ltree, Tree.extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);

        StaticTree.static_d_desc = new StaticTree(StaticTree.static_dtree, Tree.extra_dbits, 0, D_CODES, MAX_BITS);

        StaticTree.static_bl_desc = new StaticTree(null, Tree.extra_blbits, 0, BL_CODES, MAX_BL_BITS);

        // Deflate

        var MAX_MEM_LEVEL = 9;
        var DEF_MEM_LEVEL = 8;

        function Config(good_length, max_lazy, nice_length, max_chain, func) {
            var that = this;
            that.good_length = good_length;
            that.max_lazy = max_lazy;
            that.nice_length = nice_length;
            that.max_chain = max_chain;
            that.func = func;
        }

        var STORED = 0;
        var FAST = 1;
        var SLOW = 2;
        var config_table = [ new Config(0, 0, 0, 0, STORED), new Config(4, 4, 8, 4, FAST), new Config(4, 5, 16, 8, FAST), new Config(4, 6, 32, 32, FAST),
                new Config(4, 4, 16, 16, SLOW), new Config(8, 16, 32, 32, SLOW), new Config(8, 16, 128, 128, SLOW), new Config(8, 32, 128, 256, SLOW),
                new Config(32, 128, 258, 1024, SLOW), new Config(32, 258, 258, 4096, SLOW) ];

        var z_errmsg = [ "need dictionary", // Z_NEED_DICT
        // 2
        "stream end", // Z_STREAM_END 1
        "", // Z_OK 0
        "", // Z_ERRNO (-1)
        "stream error", // Z_STREAM_ERROR (-2)
        "data error", // Z_DATA_ERROR (-3)
        "", // Z_MEM_ERROR (-4)
        "buffer error", // Z_BUF_ERROR (-5)
        "",// Z_VERSION_ERROR (-6)
        "" ];

        // block not completed, need more input or more output
        var NeedMore = 0;

        // block flush performed
        var BlockDone = 1;

        // finish started, need only more output at next deflate
        var FinishStarted = 2;

        // finish done, accept no more input or output
        var FinishDone = 3;

        // preset dictionary flag in zlib header
        var PRESET_DICT = 0x20;

        var INIT_STATE = 42;
        var BUSY_STATE = 113;
        var FINISH_STATE = 666;

        // The deflate compression method
        var Z_DEFLATED = 8;

        var STORED_BLOCK = 0;
        var STATIC_TREES = 1;
        var DYN_TREES = 2;

        var MIN_MATCH = 3;
        var MAX_MATCH = 258;
        var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

        function smaller(tree, n, m, depth) {
            var tn2 = tree[n * 2];
            var tm2 = tree[m * 2];
            return (tn2 < tm2 || (tn2 == tm2 && depth[n] <= depth[m]));
        }

        function Deflate() {

            var that = this;
            var strm; // pointer back to this zlib stream
            var status; // as the name implies
            // pending_buf; // output still pending
            var pending_buf_size; // size of pending_buf
            // pending_out; // next pending byte to output to the stream
            // pending; // nb of bytes in the pending buffer
            var method; // STORED (for zip only) or DEFLATED
            var last_flush; // value of flush param for previous deflate call

            var w_size; // LZ77 window size (32K by default)
            var w_bits; // log2(w_size) (8..16)
            var w_mask; // w_size - 1

            var window;
            // Sliding window. Input bytes are read into the second half of the window,
            // and move to the first half later to keep a dictionary of at least wSize
            // bytes. With this organization, matches are limited to a distance of
            // wSize-MAX_MATCH bytes, but this ensures that IO is always
            // performed with a length multiple of the block size. Also, it limits
            // the window size to 64K, which is quite useful on MSDOS.
            // To do: use the user input buffer as sliding window.

            var window_size;
            // Actual size of window: 2*wSize, except when the user input buffer
            // is directly used as sliding window.

            var prev;
            // Link to older string with same hash index. To limit the size of this
            // array to 64K, this link is maintained only for the last 32K strings.
            // An index in this array is thus a window index modulo 32K.

            var head; // Heads of the hash chains or NIL.

            var ins_h; // hash index of string to be inserted
            var hash_size; // number of elements in hash table
            var hash_bits; // log2(hash_size)
            var hash_mask; // hash_size-1

            // Number of bits by which ins_h must be shifted at each input
            // step. It must be such that after MIN_MATCH steps, the oldest
            // byte no longer takes part in the hash key, that is:
            // hash_shift * MIN_MATCH >= hash_bits
            var hash_shift;

            // Window position at the beginning of the current output block. Gets
            // negative when the window is moved backwards.

            var block_start;

            var match_length; // length of best match
            var prev_match; // previous match
            var match_available; // set if previous match exists
            var strstart; // start of string to insert
            var match_start; // start of matching string
            var lookahead; // number of valid bytes ahead in window

            // Length of the best match at previous step. Matches not greater than this
            // are discarded. This is used in the lazy match evaluation.
            var prev_length;

            // To speed up deflation, hash chains are never searched beyond this
            // length. A higher limit improves compression ratio but degrades the speed.
            var max_chain_length;

            // Attempt to find a better match only when the current match is strictly
            // smaller than this value. This mechanism is used only for compression
            // levels >= 4.
            var max_lazy_match;

            // Insert new strings in the hash table only if the match length is not
            // greater than this length. This saves time but degrades compression.
            // max_insert_length is used only for compression levels <= 3.

            var level; // compression level (1..9)
            var strategy; // favor or force Huffman coding

            // Use a faster search when the previous match is longer than this
            var good_match;

            // Stop searching when current match exceeds this
            var nice_match;

            var dyn_ltree; // literal and length tree
            var dyn_dtree; // distance tree
            var bl_tree; // Huffman tree for bit lengths

            var l_desc = new Tree(); // desc for literal tree
            var d_desc = new Tree(); // desc for distance tree
            var bl_desc = new Tree(); // desc for bit length tree

            // that.heap_len; // number of elements in the heap
            // that.heap_max; // element of largest frequency
            // The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
            // The same heap array is used to build all trees.

            // Depth of each subtree used as tie breaker for trees of equal frequency
            that.depth = [];

            var l_buf; // index for literals or lengths */

            // Size of match buffer for literals/lengths. There are 4 reasons for
            // limiting lit_bufsize to 64K:
            // - frequencies can be kept in 16 bit counters
            // - if compression is not successful for the first block, all input
            // data is still in the window so we can still emit a stored block even
            // when input comes from standard input. (This can also be done for
            // all blocks if lit_bufsize is not greater than 32K.)
            // - if compression is not successful for a file smaller than 64K, we can
            // even emit a stored file instead of a stored block (saving 5 bytes).
            // This is applicable only for zip (not gzip or zlib).
            // - creating new Huffman trees less frequently may not provide fast
            // adaptation to changes in the input data statistics. (Take for
            // example a binary file with poorly compressible code followed by
            // a highly compressible string table.) Smaller buffer sizes give
            // fast adaptation but have of course the overhead of transmitting
            // trees more frequently.
            // - I can't count above 4
            var lit_bufsize;

            var last_lit; // running index in l_buf

            // Buffer for distances. To simplify the code, d_buf and l_buf have
            // the same number of elements. To use different lengths, an extra flag
            // array would be necessary.

            var d_buf; // index of pendig_buf

            // that.opt_len; // bit length of current block with optimal trees
            // that.static_len; // bit length of current block with static trees
            var matches; // number of string matches in current block
            var last_eob_len; // bit length of EOB code for last block

            // Output buffer. bits are inserted starting at the bottom (least
            // significant bits).
            var bi_buf;

            // Number of valid bits in bi_buf. All bits above the last valid bit
            // are always zero.
            var bi_valid;

            // number of codes at each bit length for an optimal tree
            that.bl_count = [];

            // heap used to build the Huffman trees
            that.heap = [];

            dyn_ltree = [];
            dyn_dtree = [];
            bl_tree = [];

            function lm_init() {
                var i;
                window_size = 2 * w_size;

                head[hash_size - 1] = 0;
                for (i = 0; i < hash_size - 1; i++) {
                    head[i] = 0;
                }

                // Set the default configuration parameters:
                max_lazy_match = config_table[level].max_lazy;
                good_match = config_table[level].good_length;
                nice_match = config_table[level].nice_length;
                max_chain_length = config_table[level].max_chain;

                strstart = 0;
                block_start = 0;
                lookahead = 0;
                match_length = prev_length = MIN_MATCH - 1;
                match_available = 0;
                ins_h = 0;
            }

            function init_block() {
                var i;
                // Initialize the trees.
                for (i = 0; i < L_CODES; i++)
                    dyn_ltree[i * 2] = 0;
                for (i = 0; i < D_CODES; i++)
                    dyn_dtree[i * 2] = 0;
                for (i = 0; i < BL_CODES; i++)
                    bl_tree[i * 2] = 0;

                dyn_ltree[END_BLOCK * 2] = 1;
                that.opt_len = that.static_len = 0;
                last_lit = matches = 0;
            }

            // Initialize the tree data structures for a new zlib stream.
            function tr_init() {

                l_desc.dyn_tree = dyn_ltree;
                l_desc.stat_desc = StaticTree.static_l_desc;

                d_desc.dyn_tree = dyn_dtree;
                d_desc.stat_desc = StaticTree.static_d_desc;

                bl_desc.dyn_tree = bl_tree;
                bl_desc.stat_desc = StaticTree.static_bl_desc;

                bi_buf = 0;
                bi_valid = 0;
                last_eob_len = 8; // enough lookahead for inflate

                // Initialize the first block of the first file:
                init_block();
            }

            // Restore the heap property by moving down the tree starting at node k,
            // exchanging a node with the smallest of its two sons if necessary,
            // stopping
            // when the heap property is re-established (each father smaller than its
            // two sons).
            that.pqdownheap = function(tree, // the tree to restore
            k // node to move down
            ) {
                var heap = that.heap;
                var v = heap[k];
                var j = k << 1; // left son of k
                while (j <= that.heap_len) {
                    // Set j to the smallest of the two sons:
                    if (j < that.heap_len && smaller(tree, heap[j + 1], heap[j], that.depth)) {
                        j++;
                    }
                    // Exit if v is smaller than both sons
                    if (smaller(tree, v, heap[j], that.depth))
                        break;

                    // Exchange v with the smallest son
                    heap[k] = heap[j];
                    k = j;
                    // And continue down the tree, setting j to the left son of k
                    j <<= 1;
                }
                heap[k] = v;
            };

            // Scan a literal or distance tree to determine the frequencies of the codes
            // in the bit length tree.
            function scan_tree(tree,// the tree to be scanned
            max_code // and its largest code of non zero frequency
            ) {
                var n; // iterates over all tree elements
                var prevlen = -1; // last emitted length
                var curlen; // length of current code
                var nextlen = tree[0 * 2 + 1]; // length of next code
                var count = 0; // repeat count of the current code
                var max_count = 7; // max repeat count
                var min_count = 4; // min repeat count

                if (nextlen === 0) {
                    max_count = 138;
                    min_count = 3;
                }
                tree[(max_code + 1) * 2 + 1] = 0xffff; // guard

                for (n = 0; n <= max_code; n++) {
                    curlen = nextlen;
                    nextlen = tree[(n + 1) * 2 + 1];
                    if (++count < max_count && curlen == nextlen) {
                        continue;
                    } else if (count < min_count) {
                        bl_tree[curlen * 2] += count;
                    } else if (curlen !== 0) {
                        if (curlen != prevlen)
                            bl_tree[curlen * 2]++;
                        bl_tree[REP_3_6 * 2]++;
                    } else if (count <= 10) {
                        bl_tree[REPZ_3_10 * 2]++;
                    } else {
                        bl_tree[REPZ_11_138 * 2]++;
                    }
                    count = 0;
                    prevlen = curlen;
                    if (nextlen === 0) {
                        max_count = 138;
                        min_count = 3;
                    } else if (curlen == nextlen) {
                        max_count = 6;
                        min_count = 3;
                    } else {
                        max_count = 7;
                        min_count = 4;
                    }
                }
            }

            // Construct the Huffman tree for the bit lengths and return the index in
            // bl_order of the last bit length code to send.
            function build_bl_tree() {
                var max_blindex; // index of last bit length code of non zero freq

                // Determine the bit length frequencies for literal and distance trees
                scan_tree(dyn_ltree, l_desc.max_code);
                scan_tree(dyn_dtree, d_desc.max_code);

                // Build the bit length tree:
                bl_desc.build_tree(that);
                // opt_len now includes the length of the tree representations, except
                // the lengths of the bit lengths codes and the 5+5+4 bits for the
                // counts.

                // Determine the number of bit length codes to send. The pkzip format
                // requires that at least 4 bit length codes be sent. (appnote.txt says
                // 3 but the actual value used is 4.)
                for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
                    if (bl_tree[Tree.bl_order[max_blindex] * 2 + 1] !== 0)
                        break;
                }
                // Update opt_len to include the bit length tree and counts
                that.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;

                return max_blindex;
            }

            // Output a byte on the stream.
            // IN assertion: there is enough room in pending_buf.
            function put_byte(p) {
                that.pending_buf[that.pending++] = p;
            }

            function put_short(w) {
                put_byte(w & 0xff);
                put_byte((w >>> 8) & 0xff);
            }

            function putShortMSB(b) {
                put_byte((b >> 8) & 0xff);
                put_byte((b & 0xff) & 0xff);
            }

            function send_bits(value, length) {
                var val, len = length;
                if (bi_valid > Buf_size - len) {
                    val = value;
                    // bi_buf |= (val << bi_valid);
                    bi_buf |= ((val << bi_valid) & 0xffff);
                    put_short(bi_buf);
                    bi_buf = val >>> (Buf_size - bi_valid);
                    bi_valid += len - Buf_size;
                } else {
                    // bi_buf |= (value) << bi_valid;
                    bi_buf |= (((value) << bi_valid) & 0xffff);
                    bi_valid += len;
                }
            }

            function send_code(c, tree) {
                var c2 = c * 2;
                send_bits(tree[c2] & 0xffff, tree[c2 + 1] & 0xffff);
            }

            // Send a literal or distance tree in compressed form, using the codes in
            // bl_tree.
            function send_tree(tree,// the tree to be sent
            max_code // and its largest code of non zero frequency
            ) {
                var n; // iterates over all tree elements
                var prevlen = -1; // last emitted length
                var curlen; // length of current code
                var nextlen = tree[0 * 2 + 1]; // length of next code
                var count = 0; // repeat count of the current code
                var max_count = 7; // max repeat count
                var min_count = 4; // min repeat count

                if (nextlen === 0) {
                    max_count = 138;
                    min_count = 3;
                }

                for (n = 0; n <= max_code; n++) {
                    curlen = nextlen;
                    nextlen = tree[(n + 1) * 2 + 1];
                    if (++count < max_count && curlen == nextlen) {
                        continue;
                    } else if (count < min_count) {
                        do {
                            send_code(curlen, bl_tree);
                        } while (--count !== 0);
                    } else if (curlen !== 0) {
                        if (curlen != prevlen) {
                            send_code(curlen, bl_tree);
                            count--;
                        }
                        send_code(REP_3_6, bl_tree);
                        send_bits(count - 3, 2);
                    } else if (count <= 10) {
                        send_code(REPZ_3_10, bl_tree);
                        send_bits(count - 3, 3);
                    } else {
                        send_code(REPZ_11_138, bl_tree);
                        send_bits(count - 11, 7);
                    }
                    count = 0;
                    prevlen = curlen;
                    if (nextlen === 0) {
                        max_count = 138;
                        min_count = 3;
                    } else if (curlen == nextlen) {
                        max_count = 6;
                        min_count = 3;
                    } else {
                        max_count = 7;
                        min_count = 4;
                    }
                }
            }

            // Send the header for a block using dynamic Huffman trees: the counts, the
            // lengths of the bit length codes, the literal tree and the distance tree.
            // IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
            function send_all_trees(lcodes, dcodes, blcodes) {
                var rank; // index in bl_order

                send_bits(lcodes - 257, 5); // not +255 as stated in appnote.txt
                send_bits(dcodes - 1, 5);
                send_bits(blcodes - 4, 4); // not -3 as stated in appnote.txt
                for (rank = 0; rank < blcodes; rank++) {
                    send_bits(bl_tree[Tree.bl_order[rank] * 2 + 1], 3);
                }
                send_tree(dyn_ltree, lcodes - 1); // literal tree
                send_tree(dyn_dtree, dcodes - 1); // distance tree
            }

            // Flush the bit buffer, keeping at most 7 bits in it.
            function bi_flush() {
                if (bi_valid == 16) {
                    put_short(bi_buf);
                    bi_buf = 0;
                    bi_valid = 0;
                } else if (bi_valid >= 8) {
                    put_byte(bi_buf & 0xff);
                    bi_buf >>>= 8;
                    bi_valid -= 8;
                }
            }

            // Send one empty static block to give enough lookahead for inflate.
            // This takes 10 bits, of which 7 may remain in the bit buffer.
            // The current inflate code requires 9 bits of lookahead. If the
            // last two codes for the previous block (real code plus EOB) were coded
            // on 5 bits or less, inflate may have only 5+3 bits of lookahead to decode
            // the last real code. In this case we send two empty static blocks instead
            // of one. (There are no problems if the previous block is stored or fixed.)
            // To simplify the code, we assume the worst case of last real code encoded
            // on one bit only.
            function _tr_align() {
                send_bits(STATIC_TREES << 1, 3);
                send_code(END_BLOCK, StaticTree.static_ltree);

                bi_flush();

                // Of the 10 bits for the empty block, we have already sent
                // (10 - bi_valid) bits. The lookahead for the last real code (before
                // the EOB of the previous block) was thus at least one plus the length
                // of the EOB plus what we have just sent of the empty static block.
                if (1 + last_eob_len + 10 - bi_valid < 9) {
                    send_bits(STATIC_TREES << 1, 3);
                    send_code(END_BLOCK, StaticTree.static_ltree);
                    bi_flush();
                }
                last_eob_len = 7;
            }

            // Save the match info and tally the frequency counts. Return true if
            // the current block must be flushed.
            function _tr_tally(dist, // distance of matched string
            lc // match length-MIN_MATCH or unmatched char (if dist==0)
            ) {
                var out_length, in_length, dcode;
                that.pending_buf[d_buf + last_lit * 2] = (dist >>> 8) & 0xff;
                that.pending_buf[d_buf + last_lit * 2 + 1] = dist & 0xff;

                that.pending_buf[l_buf + last_lit] = lc & 0xff;
                last_lit++;

                if (dist === 0) {
                    // lc is the unmatched char
                    dyn_ltree[lc * 2]++;
                } else {
                    matches++;
                    // Here, lc is the match length - MIN_MATCH
                    dist--; // dist = match distance - 1
                    dyn_ltree[(Tree._length_code[lc] + LITERALS + 1) * 2]++;
                    dyn_dtree[Tree.d_code(dist) * 2]++;
                }

                if ((last_lit & 0x1fff) === 0 && level > 2) {
                    // Compute an upper bound for the compressed length
                    out_length = last_lit * 8;
                    in_length = strstart - block_start;
                    for (dcode = 0; dcode < D_CODES; dcode++) {
                        out_length += dyn_dtree[dcode * 2] * (5 + Tree.extra_dbits[dcode]);
                    }
                    out_length >>>= 3;
                    if ((matches < Math.floor(last_lit / 2)) && out_length < Math.floor(in_length / 2))
                        return true;
                }

                return (last_lit == lit_bufsize - 1);
                // We avoid equality with lit_bufsize because of wraparound at 64K
                // on 16 bit machines and because stored blocks are restricted to
                // 64K-1 bytes.
            }

            // Send the block data compressed using the given Huffman trees
            function compress_block(ltree, dtree) {
                var dist; // distance of matched string
                var lc; // match length or unmatched char (if dist === 0)
                var lx = 0; // running index in l_buf
                var code; // the code to send
                var extra; // number of extra bits to send

                if (last_lit !== 0) {
                    do {
                        dist = ((that.pending_buf[d_buf + lx * 2] << 8) & 0xff00) | (that.pending_buf[d_buf + lx * 2 + 1] & 0xff);
                        lc = (that.pending_buf[l_buf + lx]) & 0xff;
                        lx++;

                        if (dist === 0) {
                            send_code(lc, ltree); // send a literal byte
                        } else {
                            // Here, lc is the match length - MIN_MATCH
                            code = Tree._length_code[lc];

                            send_code(code + LITERALS + 1, ltree); // send the length
                            // code
                            extra = Tree.extra_lbits[code];
                            if (extra !== 0) {
                                lc -= Tree.base_length[code];
                                send_bits(lc, extra); // send the extra length bits
                            }
                            dist--; // dist is now the match distance - 1
                            code = Tree.d_code(dist);

                            send_code(code, dtree); // send the distance code
                            extra = Tree.extra_dbits[code];
                            if (extra !== 0) {
                                dist -= Tree.base_dist[code];
                                send_bits(dist, extra); // send the extra distance bits
                            }
                        } // literal or match pair ?

                        // Check that the overlay between pending_buf and d_buf+l_buf is
                        // ok:
                    } while (lx < last_lit);
                }

                send_code(END_BLOCK, ltree);
                last_eob_len = ltree[END_BLOCK * 2 + 1];
            }

            // Flush the bit buffer and align the output on a byte boundary
            function bi_windup() {
                if (bi_valid > 8) {
                    put_short(bi_buf);
                } else if (bi_valid > 0) {
                    put_byte(bi_buf & 0xff);
                }
                bi_buf = 0;
                bi_valid = 0;
            }

            // Copy a stored block, storing first the length and its
            // one's complement if requested.
            function copy_block(buf, // the input data
            len, // its length
            header // true if block header must be written
            ) {
                bi_windup(); // align on byte boundary
                last_eob_len = 8; // enough lookahead for inflate

                if (header) {
                    put_short(len);
                    put_short(~len);
                }

                that.pending_buf.set(window.subarray(buf, buf + len), that.pending);
                that.pending += len;
            }

            // Send a stored block
            function _tr_stored_block(buf, // input block
            stored_len, // length of input block
            eof // true if this is the last block for a file
            ) {
                send_bits((STORED_BLOCK << 1) + (eof ? 1 : 0), 3); // send block type
                copy_block(buf, stored_len, true); // with header
            }

            // Determine the best encoding for the current block: dynamic trees, static
            // trees or store, and output the encoded block to the zip file.
            function _tr_flush_block(buf, // input block, or NULL if too old
            stored_len, // length of input block
            eof // true if this is the last block for a file
            ) {
                var opt_lenb, static_lenb;// opt_len and static_len in bytes
                var max_blindex = 0; // index of last bit length code of non zero freq

                // Build the Huffman trees unless a stored block is forced
                if (level > 0) {
                    // Construct the literal and distance trees
                    l_desc.build_tree(that);

                    d_desc.build_tree(that);

                    // At this point, opt_len and static_len are the total bit lengths
                    // of
                    // the compressed block data, excluding the tree representations.

                    // Build the bit length tree for the above two trees, and get the
                    // index
                    // in bl_order of the last bit length code to send.
                    max_blindex = build_bl_tree();

                    // Determine the best encoding. Compute first the block length in
                    // bytes
                    opt_lenb = (that.opt_len + 3 + 7) >>> 3;
                    static_lenb = (that.static_len + 3 + 7) >>> 3;

                    if (static_lenb <= opt_lenb)
                        opt_lenb = static_lenb;
                } else {
                    opt_lenb = static_lenb = stored_len + 5; // force a stored block
                }

                if ((stored_len + 4 <= opt_lenb) && buf != -1) {
                    // 4: two words for the lengths
                    // The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
                    // Otherwise we can't have processed more than WSIZE input bytes
                    // since
                    // the last block flush, because compression would have been
                    // successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
                    // transform a block into a stored block.
                    _tr_stored_block(buf, stored_len, eof);
                } else if (static_lenb == opt_lenb) {
                    send_bits((STATIC_TREES << 1) + (eof ? 1 : 0), 3);
                    compress_block(StaticTree.static_ltree, StaticTree.static_dtree);
                } else {
                    send_bits((DYN_TREES << 1) + (eof ? 1 : 0), 3);
                    send_all_trees(l_desc.max_code + 1, d_desc.max_code + 1, max_blindex + 1);
                    compress_block(dyn_ltree, dyn_dtree);
                }

                // The above check is made mod 2^32, for files larger than 512 MB
                // and uLong implemented on 32 bits.

                init_block();

                if (eof) {
                    bi_windup();
                }
            }

            function flush_block_only(eof) {
                _tr_flush_block(block_start >= 0 ? block_start : -1, strstart - block_start, eof);
                block_start = strstart;
                strm.flush_pending();
            }

            // Fill the window when the lookahead becomes insufficient.
            // Updates strstart and lookahead.
            //
            // IN assertion: lookahead < MIN_LOOKAHEAD
            // OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
            // At least one byte has been read, or avail_in === 0; reads are
            // performed for at least two bytes (required for the zip translate_eol
            // option -- not supported here).
            function fill_window() {
                var n, m;
                var p;
                var more; // Amount of free space at the end of the window.

                do {
                    more = (window_size - lookahead - strstart);

                    // Deal with !@#$% 64K limit:
                    if (more === 0 && strstart === 0 && lookahead === 0) {
                        more = w_size;
                    } else if (more == -1) {
                        // Very unlikely, but possible on 16 bit machine if strstart ==
                        // 0
                        // and lookahead == 1 (input done one byte at time)
                        more--;

                        // If the window is almost full and there is insufficient
                        // lookahead,
                        // move the upper half to the lower one to make room in the
                        // upper half.
                    } else if (strstart >= w_size + w_size - MIN_LOOKAHEAD) {
                        window.set(window.subarray(w_size, w_size + w_size), 0);

                        match_start -= w_size;
                        strstart -= w_size; // we now have strstart >= MAX_DIST
                        block_start -= w_size;

                        // Slide the hash table (could be avoided with 32 bit values
                        // at the expense of memory usage). We slide even when level ==
                        // 0
                        // to keep the hash table consistent if we switch back to level
                        // > 0
                        // later. (Using level 0 permanently is not an optimal usage of
                        // zlib, so we don't care about this pathological case.)

                        n = hash_size;
                        p = n;
                        do {
                            m = (head[--p] & 0xffff);
                            head[p] = (m >= w_size ? m - w_size : 0);
                        } while (--n !== 0);

                        n = w_size;
                        p = n;
                        do {
                            m = (prev[--p] & 0xffff);
                            prev[p] = (m >= w_size ? m - w_size : 0);
                            // If n is not on any hash chain, prev[n] is garbage but
                            // its value will never be used.
                        } while (--n !== 0);
                        more += w_size;
                    }

                    if (strm.avail_in === 0)
                        return;

                    // If there was no sliding:
                    // strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
                    // more == window_size - lookahead - strstart
                    // => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
                    // => more >= window_size - 2*WSIZE + 2
                    // In the BIG_MEM or MMAP case (not yet supported),
                    // window_size == input_size + MIN_LOOKAHEAD &&
                    // strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
                    // Otherwise, window_size == 2*WSIZE so more >= 2.
                    // If there was sliding, more >= WSIZE. So in all cases, more >= 2.

                    n = strm.read_buf(window, strstart + lookahead, more);
                    lookahead += n;

                    // Initialize the hash value now that we have some input:
                    if (lookahead >= MIN_MATCH) {
                        ins_h = window[strstart] & 0xff;
                        ins_h = (((ins_h) << hash_shift) ^ (window[strstart + 1] & 0xff)) & hash_mask;
                    }
                    // If the whole input has less than MIN_MATCH bytes, ins_h is
                    // garbage,
                    // but this is not important since only literal bytes will be
                    // emitted.
                } while (lookahead < MIN_LOOKAHEAD && strm.avail_in !== 0);
            }

            // Copy without compression as much as possible from the input stream,
            // return
            // the current block state.
            // This function does not insert new strings in the dictionary since
            // uncompressible data is probably not useful. This function is used
            // only for the level=0 compression option.
            // NOTE: this function should be optimized to avoid extra copying from
            // window to pending_buf.
            function deflate_stored(flush) {
                // Stored blocks are limited to 0xffff bytes, pending_buf is limited
                // to pending_buf_size, and each stored block has a 5 byte header:

                var max_block_size = 0xffff;
                var max_start;

                if (max_block_size > pending_buf_size - 5) {
                    max_block_size = pending_buf_size - 5;
                }

                // Copy as much as possible from input to output:
                while (true) {
                    // Fill the window as much as possible:
                    if (lookahead <= 1) {
                        fill_window();
                        if (lookahead === 0 && flush == Z_NO_FLUSH)
                            return NeedMore;
                        if (lookahead === 0)
                            break; // flush the current block
                    }

                    strstart += lookahead;
                    lookahead = 0;

                    // Emit a stored block if pending_buf will be full:
                    max_start = block_start + max_block_size;
                    if (strstart === 0 || strstart >= max_start) {
                        // strstart === 0 is possible when wraparound on 16-bit machine
                        lookahead = (strstart - max_start);
                        strstart = max_start;

                        flush_block_only(false);
                        if (strm.avail_out === 0)
                            return NeedMore;

                    }

                    // Flush if we may have to slide, otherwise block_start may become
                    // negative and the data will be gone:
                    if (strstart - block_start >= w_size - MIN_LOOKAHEAD) {
                        flush_block_only(false);
                        if (strm.avail_out === 0)
                            return NeedMore;
                    }
                }

                flush_block_only(flush == Z_FINISH);
                if (strm.avail_out === 0)
                    return (flush == Z_FINISH) ? FinishStarted : NeedMore;

                return flush == Z_FINISH ? FinishDone : BlockDone;
            }

            function longest_match(cur_match) {
                var chain_length = max_chain_length; // max hash chain length
                var scan = strstart; // current string
                var match; // matched string
                var len; // length of current match
                var best_len = prev_length; // best match length so far
                var limit = strstart > (w_size - MIN_LOOKAHEAD) ? strstart - (w_size - MIN_LOOKAHEAD) : 0;
                var _nice_match = nice_match;

                // Stop when cur_match becomes <= limit. To simplify the code,
                // we prevent matches with the string of window index 0.

                var wmask = w_mask;

                var strend = strstart + MAX_MATCH;
                var scan_end1 = window[scan + best_len - 1];
                var scan_end = window[scan + best_len];

                // The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of
                // 16.
                // It is easy to get rid of this optimization if necessary.

                // Do not waste too much time if we already have a good match:
                if (prev_length >= good_match) {
                    chain_length >>= 2;
                }

                // Do not look for matches beyond the end of the input. This is
                // necessary
                // to make deflate deterministic.
                if (_nice_match > lookahead)
                    _nice_match = lookahead;

                do {
                    match = cur_match;

                    // Skip to next match if the match length cannot increase
                    // or if the match length is less than 2:
                    if (window[match + best_len] != scan_end || window[match + best_len - 1] != scan_end1 || window[match] != window[scan]
                            || window[++match] != window[scan + 1])
                        continue;

                    // The check at best_len-1 can be removed because it will be made
                    // again later. (This heuristic is not always a win.)
                    // It is not necessary to compare scan[2] and match[2] since they
                    // are always equal when the other bytes match, given that
                    // the hash keys are equal and that HASH_BITS >= 8.
                    scan += 2;
                    match++;

                    // We check for insufficient lookahead only every 8th comparison;
                    // the 256th check will be made at strstart+258.
                    do {
                    } while (window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match]
                            && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match]
                            && window[++scan] == window[++match] && window[++scan] == window[++match] && scan < strend);

                    len = MAX_MATCH - (strend - scan);
                    scan = strend - MAX_MATCH;

                    if (len > best_len) {
                        match_start = cur_match;
                        best_len = len;
                        if (len >= _nice_match)
                            break;
                        scan_end1 = window[scan + best_len - 1];
                        scan_end = window[scan + best_len];
                    }

                } while ((cur_match = (prev[cur_match & wmask] & 0xffff)) > limit && --chain_length !== 0);

                if (best_len <= lookahead)
                    return best_len;
                return lookahead;
            }

            // Compress as much as possible from the input stream, return the current
            // block state.
            // This function does not perform lazy evaluation of matches and inserts
            // new strings in the dictionary only for unmatched strings or for short
            // matches. It is used only for the fast compression options.
            function deflate_fast(flush) {
                // short hash_head = 0; // head of the hash chain
                var hash_head = 0; // head of the hash chain
                var bflush; // set if current block must be flushed

                while (true) {
                    // Make sure that we always have enough lookahead, except
                    // at the end of the input file. We need MAX_MATCH bytes
                    // for the next match, plus MIN_MATCH bytes to insert the
                    // string following the next match.
                    if (lookahead < MIN_LOOKAHEAD) {
                        fill_window();
                        if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
                            return NeedMore;
                        }
                        if (lookahead === 0)
                            break; // flush the current block
                    }

                    // Insert the string window[strstart .. strstart+2] in the
                    // dictionary, and set hash_head to the head of the hash chain:
                    if (lookahead >= MIN_MATCH) {
                        ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;

                        // prev[strstart&w_mask]=hash_head=head[ins_h];
                        hash_head = (head[ins_h] & 0xffff);
                        prev[strstart & w_mask] = head[ins_h];
                        head[ins_h] = strstart;
                    }

                    // Find the longest match, discarding those <= prev_length.
                    // At this point we have always match_length < MIN_MATCH

                    if (hash_head !== 0 && ((strstart - hash_head) & 0xffff) <= w_size - MIN_LOOKAHEAD) {
                        // To simplify the code, we prevent matches with the string
                        // of window index 0 (in particular we have to avoid a match
                        // of the string with itself at the start of the input file).
                        if (strategy != Z_HUFFMAN_ONLY) {
                            match_length = longest_match(hash_head);
                        }
                        // longest_match() sets match_start
                    }
                    if (match_length >= MIN_MATCH) {
                        // check_match(strstart, match_start, match_length);

                        bflush = _tr_tally(strstart - match_start, match_length - MIN_MATCH);

                        lookahead -= match_length;

                        // Insert new strings in the hash table only if the match length
                        // is not too large. This saves time but degrades compression.
                        if (match_length <= max_lazy_match && lookahead >= MIN_MATCH) {
                            match_length--; // string at strstart already in hash table
                            do {
                                strstart++;

                                ins_h = ((ins_h << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
                                // prev[strstart&w_mask]=hash_head=head[ins_h];
                                hash_head = (head[ins_h] & 0xffff);
                                prev[strstart & w_mask] = head[ins_h];
                                head[ins_h] = strstart;

                                // strstart never exceeds WSIZE-MAX_MATCH, so there are
                                // always MIN_MATCH bytes ahead.
                            } while (--match_length !== 0);
                            strstart++;
                        } else {
                            strstart += match_length;
                            match_length = 0;
                            ins_h = window[strstart] & 0xff;

                            ins_h = (((ins_h) << hash_shift) ^ (window[strstart + 1] & 0xff)) & hash_mask;
                            // If lookahead < MIN_MATCH, ins_h is garbage, but it does
                            // not
                            // matter since it will be recomputed at next deflate call.
                        }
                    } else {
                        // No match, output a literal byte

                        bflush = _tr_tally(0, window[strstart] & 0xff);
                        lookahead--;
                        strstart++;
                    }
                    if (bflush) {

                        flush_block_only(false);
                        if (strm.avail_out === 0)
                            return NeedMore;
                    }
                }

                flush_block_only(flush == Z_FINISH);
                if (strm.avail_out === 0) {
                    if (flush == Z_FINISH)
                        return FinishStarted;
                    else
                        return NeedMore;
                }
                return flush == Z_FINISH ? FinishDone : BlockDone;
            }

            // Same as above, but achieves better compression. We use a lazy
            // evaluation for matches: a match is finally adopted only if there is
            // no better match at the next window position.
            function deflate_slow(flush) {
                // short hash_head = 0; // head of hash chain
                var hash_head = 0; // head of hash chain
                var bflush; // set if current block must be flushed
                var max_insert;

                // Process the input block.
                while (true) {
                    // Make sure that we always have enough lookahead, except
                    // at the end of the input file. We need MAX_MATCH bytes
                    // for the next match, plus MIN_MATCH bytes to insert the
                    // string following the next match.

                    if (lookahead < MIN_LOOKAHEAD) {
                        fill_window();
                        if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
                            return NeedMore;
                        }
                        if (lookahead === 0)
                            break; // flush the current block
                    }

                    // Insert the string window[strstart .. strstart+2] in the
                    // dictionary, and set hash_head to the head of the hash chain:

                    if (lookahead >= MIN_MATCH) {
                        ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
                        // prev[strstart&w_mask]=hash_head=head[ins_h];
                        hash_head = (head[ins_h] & 0xffff);
                        prev[strstart & w_mask] = head[ins_h];
                        head[ins_h] = strstart;
                    }

                    // Find the longest match, discarding those <= prev_length.
                    prev_length = match_length;
                    prev_match = match_start;
                    match_length = MIN_MATCH - 1;

                    if (hash_head !== 0 && prev_length < max_lazy_match && ((strstart - hash_head) & 0xffff) <= w_size - MIN_LOOKAHEAD) {
                        // To simplify the code, we prevent matches with the string
                        // of window index 0 (in particular we have to avoid a match
                        // of the string with itself at the start of the input file).

                        if (strategy != Z_HUFFMAN_ONLY) {
                            match_length = longest_match(hash_head);
                        }
                        // longest_match() sets match_start

                        if (match_length <= 5 && (strategy == Z_FILTERED || (match_length == MIN_MATCH && strstart - match_start > 4096))) {

                            // If prev_match is also MIN_MATCH, match_start is garbage
                            // but we will ignore the current match anyway.
                            match_length = MIN_MATCH - 1;
                        }
                    }

                    // If there was a match at the previous step and the current
                    // match is not better, output the previous match:
                    if (prev_length >= MIN_MATCH && match_length <= prev_length) {
                        max_insert = strstart + lookahead - MIN_MATCH;
                        // Do not insert strings in hash table beyond this.

                        // check_match(strstart-1, prev_match, prev_length);

                        bflush = _tr_tally(strstart - 1 - prev_match, prev_length - MIN_MATCH);

                        // Insert in hash table all strings up to the end of the match.
                        // strstart-1 and strstart are already inserted. If there is not
                        // enough lookahead, the last two strings are not inserted in
                        // the hash table.
                        lookahead -= prev_length - 1;
                        prev_length -= 2;
                        do {
                            if (++strstart <= max_insert) {
                                ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
                                // prev[strstart&w_mask]=hash_head=head[ins_h];
                                hash_head = (head[ins_h] & 0xffff);
                                prev[strstart & w_mask] = head[ins_h];
                                head[ins_h] = strstart;
                            }
                        } while (--prev_length !== 0);
                        match_available = 0;
                        match_length = MIN_MATCH - 1;
                        strstart++;

                        if (bflush) {
                            flush_block_only(false);
                            if (strm.avail_out === 0)
                                return NeedMore;
                        }
                    } else if (match_available !== 0) {

                        // If there was no match at the previous position, output a
                        // single literal. If there was a match but the current match
                        // is longer, truncate the previous match to a single literal.

                        bflush = _tr_tally(0, window[strstart - 1] & 0xff);

                        if (bflush) {
                            flush_block_only(false);
                        }
                        strstart++;
                        lookahead--;
                        if (strm.avail_out === 0)
                            return NeedMore;
                    } else {
                        // There is no previous match to compare with, wait for
                        // the next step to decide.

                        match_available = 1;
                        strstart++;
                        lookahead--;
                    }
                }

                if (match_available !== 0) {
                    bflush = _tr_tally(0, window[strstart - 1] & 0xff);
                    match_available = 0;
                }
                flush_block_only(flush == Z_FINISH);

                if (strm.avail_out === 0) {
                    if (flush == Z_FINISH)
                        return FinishStarted;
                    else
                        return NeedMore;
                }

                return flush == Z_FINISH ? FinishDone : BlockDone;
            }

            function deflateReset(strm) {
                strm.total_in = strm.total_out = 0;
                strm.msg = null; //

                that.pending = 0;
                that.pending_out = 0;

                status = BUSY_STATE;

                last_flush = Z_NO_FLUSH;

                tr_init();
                lm_init();
                return Z_OK;
            }

            that.deflateInit = function(strm, _level, bits, _method, memLevel, _strategy) {
                if (!_method)
                    _method = Z_DEFLATED;
                if (!memLevel)
                    memLevel = DEF_MEM_LEVEL;
                if (!_strategy)
                    _strategy = Z_DEFAULT_STRATEGY;

                // byte[] my_version=ZLIB_VERSION;

                //
                // if (!version || version[0] != my_version[0]
                // || stream_size != sizeof(z_stream)) {
                // return Z_VERSION_ERROR;
                // }

                strm.msg = null;

                if (_level == Z_DEFAULT_COMPRESSION)
                    _level = 6;

                if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || _method != Z_DEFLATED || bits < 9 || bits > 15 || _level < 0 || _level > 9 || _strategy < 0
                        || _strategy > Z_HUFFMAN_ONLY) {
                    return Z_STREAM_ERROR;
                }

                strm.dstate = that;

                w_bits = bits;
                w_size = 1 << w_bits;
                w_mask = w_size - 1;

                hash_bits = memLevel + 7;
                hash_size = 1 << hash_bits;
                hash_mask = hash_size - 1;
                hash_shift = Math.floor((hash_bits + MIN_MATCH - 1) / MIN_MATCH);

                window = new Uint8Array(w_size * 2);
                prev = [];
                head = [];

                lit_bufsize = 1 << (memLevel + 6); // 16K elements by default

                // We overlay pending_buf and d_buf+l_buf. This works since the average
                // output size for (length,distance) codes is <= 24 bits.
                that.pending_buf = new Uint8Array(lit_bufsize * 4);
                pending_buf_size = lit_bufsize * 4;

                d_buf = Math.floor(lit_bufsize / 2);
                l_buf = (1 + 2) * lit_bufsize;

                level = _level;

                strategy = _strategy;
                method = _method & 0xff;

                return deflateReset(strm);
            };

            that.deflateEnd = function() {
                if (status != INIT_STATE && status != BUSY_STATE && status != FINISH_STATE) {
                    return Z_STREAM_ERROR;
                }
                // Deallocate in reverse order of allocations:
                that.pending_buf = null;
                head = null;
                prev = null;
                window = null;
                // free
                that.dstate = null;
                return status == BUSY_STATE ? Z_DATA_ERROR : Z_OK;
            };

            that.deflateParams = function(strm, _level, _strategy) {
                var err = Z_OK;

                if (_level == Z_DEFAULT_COMPRESSION) {
                    _level = 6;
                }
                if (_level < 0 || _level > 9 || _strategy < 0 || _strategy > Z_HUFFMAN_ONLY) {
                    return Z_STREAM_ERROR;
                }

                if (config_table[level].func != config_table[_level].func && strm.total_in !== 0) {
                    // Flush the last buffer:
                    err = strm.deflate(Z_PARTIAL_FLUSH);
                }

                if (level != _level) {
                    level = _level;
                    max_lazy_match = config_table[level].max_lazy;
                    good_match = config_table[level].good_length;
                    nice_match = config_table[level].nice_length;
                    max_chain_length = config_table[level].max_chain;
                }
                strategy = _strategy;
                return err;
            };

            that.deflateSetDictionary = function(strm, dictionary, dictLength) {
                var length = dictLength;
                var n, index = 0;

                if (!dictionary || status != INIT_STATE)
                    return Z_STREAM_ERROR;

                if (length < MIN_MATCH)
                    return Z_OK;
                if (length > w_size - MIN_LOOKAHEAD) {
                    length = w_size - MIN_LOOKAHEAD;
                    index = dictLength - length; // use the tail of the dictionary
                }
                window.set(dictionary.subarray(index, index + length), 0);

                strstart = length;
                block_start = length;

                // Insert all strings in the hash table (except for the last two bytes).
                // s->lookahead stays null, so s->ins_h will be recomputed at the next
                // call of fill_window.

                ins_h = window[0] & 0xff;
                ins_h = (((ins_h) << hash_shift) ^ (window[1] & 0xff)) & hash_mask;

                for (n = 0; n <= length - MIN_MATCH; n++) {
                    ins_h = (((ins_h) << hash_shift) ^ (window[(n) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
                    prev[n & w_mask] = head[ins_h];
                    head[ins_h] = n;
                }
                return Z_OK;
            };

            that.deflate = function(_strm, flush) {
                var i, header, level_flags, old_flush, bstate;

                if (flush > Z_FINISH || flush < 0) {
                    return Z_STREAM_ERROR;
                }

                if (!_strm.next_out || (!_strm.next_in && _strm.avail_in !== 0) || (status == FINISH_STATE && flush != Z_FINISH)) {
                    _strm.msg = z_errmsg[Z_NEED_DICT - (Z_STREAM_ERROR)];
                    return Z_STREAM_ERROR;
                }
                if (_strm.avail_out === 0) {
                    _strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
                    return Z_BUF_ERROR;
                }

                strm = _strm; // just in case
                old_flush = last_flush;
                last_flush = flush;

                // Write the zlib header
                if (status == INIT_STATE) {
                    header = (Z_DEFLATED + ((w_bits - 8) << 4)) << 8;
                    level_flags = ((level - 1) & 0xff) >> 1;

                    if (level_flags > 3)
                        level_flags = 3;
                    header |= (level_flags << 6);
                    if (strstart !== 0)
                        header |= PRESET_DICT;
                    header += 31 - (header % 31);

                    status = BUSY_STATE;
                    putShortMSB(header);
                }

                // Flush as much pending output as possible
                if (that.pending !== 0) {
                    strm.flush_pending();
                    if (strm.avail_out === 0) {
                        // console.log(" avail_out==0");
                        // Since avail_out is 0, deflate will be called again with
                        // more output space, but possibly with both pending and
                        // avail_in equal to zero. There won't be anything to do,
                        // but this is not an error situation so make sure we
                        // return OK instead of BUF_ERROR at next call of deflate:
                        last_flush = -1;
                        return Z_OK;
                    }

                    // Make sure there is something to do and avoid duplicate
                    // consecutive
                    // flushes. For repeated and useless calls with Z_FINISH, we keep
                    // returning Z_STREAM_END instead of Z_BUFF_ERROR.
                } else if (strm.avail_in === 0 && flush <= old_flush && flush != Z_FINISH) {
                    strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
                    return Z_BUF_ERROR;
                }

                // User must not provide more input after the first FINISH:
                if (status == FINISH_STATE && strm.avail_in !== 0) {
                    _strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
                    return Z_BUF_ERROR;
                }

                // Start a new block or continue the current one.
                if (strm.avail_in !== 0 || lookahead !== 0 || (flush != Z_NO_FLUSH && status != FINISH_STATE)) {
                    bstate = -1;
                    switch (config_table[level].func) {
                    case STORED:
                        bstate = deflate_stored(flush);
                        break;
                    case FAST:
                        bstate = deflate_fast(flush);
                        break;
                    case SLOW:
                        bstate = deflate_slow(flush);
                        break;
                    default:
                    }

                    if (bstate == FinishStarted || bstate == FinishDone) {
                        status = FINISH_STATE;
                    }
                    if (bstate == NeedMore || bstate == FinishStarted) {
                        if (strm.avail_out === 0) {
                            last_flush = -1; // avoid BUF_ERROR next call, see above
                        }
                        return Z_OK;
                        // If flush != Z_NO_FLUSH && avail_out === 0, the next call
                        // of deflate should use the same flush parameter to make sure
                        // that the flush is complete. So we don't have to output an
                        // empty block here, this will be done at next call. This also
                        // ensures that for a very small output buffer, we emit at most
                        // one empty block.
                    }

                    if (bstate == BlockDone) {
                        if (flush == Z_PARTIAL_FLUSH) {
                            _tr_align();
                        } else { // FULL_FLUSH or SYNC_FLUSH
                            _tr_stored_block(0, 0, false);
                            // For a full flush, this empty block will be recognized
                            // as a special marker by inflate_sync().
                            if (flush == Z_FULL_FLUSH) {
                                // state.head[s.hash_size-1]=0;
                                for (i = 0; i < hash_size/*-1*/; i++)
                                    // forget history
                                    head[i] = 0;
                            }
                        }
                        strm.flush_pending();
                        if (strm.avail_out === 0) {
                            last_flush = -1; // avoid BUF_ERROR at next call, see above
                            return Z_OK;
                        }
                    }
                }

                if (flush != Z_FINISH)
                    return Z_OK;
                return Z_STREAM_END;
            };
        }

        // ZStream

        function ZStream() {
            var that = this;
            that.next_in_index = 0;
            that.next_out_index = 0;
            // that.next_in; // next input byte
            that.avail_in = 0; // number of bytes available at next_in
            that.total_in = 0; // total nb of input bytes read so far
            // that.next_out; // next output byte should be put there
            that.avail_out = 0; // remaining free space at next_out
            that.total_out = 0; // total nb of bytes output so far
            // that.msg;
            // that.dstate;
        }

        ZStream.prototype = {
            deflateInit : function(level, bits) {
                var that = this;
                that.dstate = new Deflate();
                if (!bits)
                    bits = MAX_BITS;
                return that.dstate.deflateInit(that, level, bits);
            },

            deflate : function(flush) {
                var that = this;
                if (!that.dstate) {
                    return Z_STREAM_ERROR;
                }
                return that.dstate.deflate(that, flush);
            },

            deflateEnd : function() {
                var that = this;
                if (!that.dstate)
                    return Z_STREAM_ERROR;
                var ret = that.dstate.deflateEnd();
                that.dstate = null;
                return ret;
            },

            deflateParams : function(level, strategy) {
                var that = this;
                if (!that.dstate)
                    return Z_STREAM_ERROR;
                return that.dstate.deflateParams(that, level, strategy);
            },

            deflateSetDictionary : function(dictionary, dictLength) {
                var that = this;
                if (!that.dstate)
                    return Z_STREAM_ERROR;
                return that.dstate.deflateSetDictionary(that, dictionary, dictLength);
            },

            // Read a new buffer from the current input stream, update the
            // total number of bytes read. All deflate() input goes through
            // this function so some applications may wish to modify it to avoid
            // allocating a large strm->next_in buffer and copying from it.
            // (See also flush_pending()).
            read_buf : function(buf, start, size) {
                var that = this;
                var len = that.avail_in;
                if (len > size)
                    len = size;
                if (len === 0)
                    return 0;
                that.avail_in -= len;
                buf.set(that.next_in.subarray(that.next_in_index, that.next_in_index + len), start);
                that.next_in_index += len;
                that.total_in += len;
                return len;
            },

            // Flush as much pending output as possible. All deflate() output goes
            // through this function so some applications may wish to modify it
            // to avoid allocating a large strm->next_out buffer and copying into it.
            // (See also read_buf()).
            flush_pending : function() {
                var that = this;
                var len = that.dstate.pending;

                if (len > that.avail_out)
                    len = that.avail_out;
                if (len === 0)
                    return;

                // if (that.dstate.pending_buf.length <= that.dstate.pending_out || that.next_out.length <= that.next_out_index
                // || that.dstate.pending_buf.length < (that.dstate.pending_out + len) || that.next_out.length < (that.next_out_index +
                // len)) {
                // console.log(that.dstate.pending_buf.length + ", " + that.dstate.pending_out + ", " + that.next_out.length + ", " +
                // that.next_out_index + ", " + len);
                // console.log("avail_out=" + that.avail_out);
                // }

                that.next_out.set(that.dstate.pending_buf.subarray(that.dstate.pending_out, that.dstate.pending_out + len), that.next_out_index);

                that.next_out_index += len;
                that.dstate.pending_out += len;
                that.total_out += len;
                that.avail_out -= len;
                that.dstate.pending -= len;
                if (that.dstate.pending === 0) {
                    that.dstate.pending_out = 0;
                }
            }
        };

        // Deflater

        return function Deflater(level) {
            var that = this;
            var z = new ZStream();
            var bufsize = 512;
            var flush = Z_NO_FLUSH;
            var buf = new Uint8Array(bufsize);

            if (typeof level == "undefined")
                level = Z_DEFAULT_COMPRESSION;
            z.deflateInit(level);
            z.next_out = buf;

            that.append = function(data, onprogress) {
                var err, buffers = [], lastIndex = 0, bufferIndex = 0, bufferSize = 0, array;
                if (!data.length)
                    return;
                z.next_in_index = 0;
                z.next_in = data;
                z.avail_in = data.length;
                do {
                    z.next_out_index = 0;
                    z.avail_out = bufsize;
                    err = z.deflate(flush);
                    if (err != Z_OK)
                        throw "deflating: " + z.msg;
                    if (z.next_out_index)
                        if (z.next_out_index == bufsize)
                            buffers.push(new Uint8Array(buf));
                        else
                            buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
                    bufferSize += z.next_out_index;
                    if (onprogress && z.next_in_index > 0 && z.next_in_index != lastIndex) {
                        onprogress(z.next_in_index);
                        lastIndex = z.next_in_index;
                    }
                } while (z.avail_in > 0 || z.avail_out === 0);
                array = new Uint8Array(bufferSize);
                buffers.forEach(function(chunk) {
                    array.set(chunk, bufferIndex);
                    bufferIndex += chunk.length;
                });
                return array;
            };
            that.flush = function() {
                var err, buffers = [], bufferIndex = 0, bufferSize = 0, array;
                do {
                    z.next_out_index = 0;
                    z.avail_out = bufsize;
                    err = z.deflate(Z_FINISH);
                    if (err != Z_STREAM_END && err != Z_OK)
                        throw "deflating: " + z.msg;
                    if (bufsize - z.avail_out > 0)
                        buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
                    bufferSize += z.next_out_index;
                } while (z.avail_in > 0 || z.avail_out === 0);
                z.deflateEnd();
                array = new Uint8Array(bufferSize);
                buffers.forEach(function(chunk) {
                    array.set(chunk, bufferIndex);
                    bufferIndex += chunk.length;
                });
                return array;
            };
        };
    })(this);
    // Generated by CoffeeScript 1.4.0

    /*
    # PNG.js
    # Copyright (c) 2011 Devon Govett
    # MIT LICENSE
    #
    # Permission is hereby granted, free of charge, to any person obtaining a copy of this
    # software and associated documentation files (the "Software"), to deal in the Software
    # without restriction, including without limitation the rights to use, copy, modify, merge,
    # publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
    # to whom the Software is furnished to do so, subject to the following conditions:
    #
    # The above copyright notice and this permission notice shall be included in all copies or
    # substantial portions of the Software.
    #
    # THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
    # BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    # NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    # DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    # OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */


    (function(global) {
      var PNG;

      PNG = (function() {
        var APNG_BLEND_OP_OVER, APNG_BLEND_OP_SOURCE, APNG_DISPOSE_OP_BACKGROUND, APNG_DISPOSE_OP_NONE, APNG_DISPOSE_OP_PREVIOUS, makeImage, scratchCanvas, scratchCtx;

        PNG.load = function(url, canvas, callback) {
          var xhr,
            _this = this;
          if (typeof canvas === 'function') {
            callback = canvas;
          }
          xhr = new XMLHttpRequest;
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = function() {
            var data, png;
            data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
            png = new PNG(data);
            if (typeof (canvas != null ? canvas.getContext : void 0) === 'function') {
              png.render(canvas);
            }
            return typeof callback === "function" ? callback(png) : void 0;
          };
          return xhr.send(null);
        };

        APNG_DISPOSE_OP_NONE = 0;

        APNG_DISPOSE_OP_BACKGROUND = 1;

        APNG_DISPOSE_OP_PREVIOUS = 2;

        APNG_BLEND_OP_SOURCE = 0;

        APNG_BLEND_OP_OVER = 1;

        function PNG(data) {
          var chunkSize, colors, palLen, delayDen, delayNum, frame, i, index, key, section, palShort, text, _i, _j, _ref;
          this.data = data;
          this.pos = 8;
          this.palette = [];
          this.imgData = [];
          this.transparency = {};
          this.animation = null;
          this.text = {};
          frame = null;
          while (true) {
            chunkSize = this.readUInt32();
            section = ((function() {
              var _i, _results;
              _results = [];
              for (i = _i = 0; _i < 4; i = ++_i) {
                _results.push(String.fromCharCode(this.data[this.pos++]));
              }
              return _results;
            }).call(this)).join('');
            switch (section) {
              case 'IHDR':
                this.width = this.readUInt32();
                this.height = this.readUInt32();
                this.bits = this.data[this.pos++];
                this.colorType = this.data[this.pos++];
                this.compressionMethod = this.data[this.pos++];
                this.filterMethod = this.data[this.pos++];
                this.interlaceMethod = this.data[this.pos++];
                break;
              case 'acTL':
                this.animation = {
                  numFrames: this.readUInt32(),
                  numPlays: this.readUInt32() || Infinity,
                  frames: []
                };
                break;
              case 'PLTE':
                this.palette = this.read(chunkSize);
                break;
              case 'fcTL':
                if (frame) {
                  this.animation.frames.push(frame);
                }
                this.pos += 4;
                frame = {
                  width: this.readUInt32(),
                  height: this.readUInt32(),
                  xOffset: this.readUInt32(),
                  yOffset: this.readUInt32()
                };
                delayNum = this.readUInt16();
                delayDen = this.readUInt16() || 100;
                frame.delay = 1000 * delayNum / delayDen;
                frame.disposeOp = this.data[this.pos++];
                frame.blendOp = this.data[this.pos++];
                frame.data = [];
                break;
              case 'IDAT':
              case 'fdAT':
                if (section === 'fdAT') {
                  this.pos += 4;
                  chunkSize -= 4;
                }
                data = (frame != null ? frame.data : void 0) || this.imgData;
                for (i = _i = 0; 0 <= chunkSize ? _i < chunkSize : _i > chunkSize; i = 0 <= chunkSize ? ++_i : --_i) {
                  data.push(this.data[this.pos++]);
                }
                break;
              case 'tRNS':
                this.transparency = {};
                switch (this.colorType) {
                  case 3:
                    palLen = this.palette.length/3;
                    this.transparency.indexed = this.read(chunkSize);
                    if(this.transparency.indexed.length > palLen)
                        throw new Error('More transparent colors than palette size');
                    /*
                     * According to the PNG spec trns should be increased to the same size as palette if shorter
                     */
                    //palShort = 255 - this.transparency.indexed.length;
                    palShort = palLen - this.transparency.indexed.length;
                    if (palShort > 0) {
                      for (i = _j = 0; 0 <= palShort ? _j < palShort : _j > palShort; i = 0 <= palShort ? ++_j : --_j) {
                        this.transparency.indexed.push(255);
                      }
                    }
                    break;
                  case 0:
                    this.transparency.grayscale = this.read(chunkSize)[0];
                    break;
                  case 2:
                    this.transparency.rgb = this.read(chunkSize);
                }
                break;
              case 'tEXt':
                text = this.read(chunkSize);
                index = text.indexOf(0);
                key = String.fromCharCode.apply(String, text.slice(0, index));
                this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
                break;
              case 'IEND':
                if (frame) {
                  this.animation.frames.push(frame);
                }
                this.colors = (function() {
                  switch (this.colorType) {
                    case 0:
                    case 3:
                    case 4:
                      return 1;
                    case 2:
                    case 6:
                      return 3;
                  }
                }).call(this);
                this.hasAlphaChannel = (_ref = this.colorType) === 4 || _ref === 6;
                colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
                this.pixelBitlength = this.bits * colors;
                this.colorSpace = (function() {
                  switch (this.colors) {
                    case 1:
                      return 'DeviceGray';
                    case 3:
                      return 'DeviceRGB';
                  }
                }).call(this);
                this.imgData = new Uint8Array(this.imgData);
                return;
              default:
                this.pos += chunkSize;
            }
            this.pos += 4;
            if (this.pos > this.data.length) {
              throw new Error("Incomplete or corrupt PNG file");
            }
          }
          return;
        }

        PNG.prototype.read = function(bytes) {
          var i, _i, _results;
          _results = [];
          for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
            _results.push(this.data[this.pos++]);
          }
          return _results;
        };

        PNG.prototype.readUInt32 = function() {
          var b1, b2, b3, b4;
          b1 = this.data[this.pos++] << 24;
          b2 = this.data[this.pos++] << 16;
          b3 = this.data[this.pos++] << 8;
          b4 = this.data[this.pos++];
          return b1 | b2 | b3 | b4;
        };

        PNG.prototype.readUInt16 = function() {
          var b1, b2;
          b1 = this.data[this.pos++] << 8;
          b2 = this.data[this.pos++];
          return b1 | b2;
        };

        PNG.prototype.decodePixels = function(data) {
          var abyte, c, col, i, left, length, p, pa, paeth, pb, pc, pixelBytes, pixels, pos, row, scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;
          if (data == null) {
            data = this.imgData;
          }
          if (data.length === 0) {
            return new Uint8Array(0);
          }
          data = new FlateStream(data);
          data = data.getBytes();
          pixelBytes = this.pixelBitlength / 8;
          scanlineLength = pixelBytes * this.width;
          pixels = new Uint8Array(scanlineLength * this.height);
          length = data.length;
          row = 0;
          pos = 0;
          c = 0;
          while (pos < length) {
            switch (data[pos++]) {
              case 0:
                for (i = _i = 0; _i < scanlineLength; i = _i += 1) {
                  pixels[c++] = data[pos++];
                }
                break;
              case 1:
                for (i = _j = 0; _j < scanlineLength; i = _j += 1) {
                  abyte = data[pos++];
                  left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                  pixels[c++] = (abyte + left) % 256;
                }
                break;
              case 2:
                for (i = _k = 0; _k < scanlineLength; i = _k += 1) {
                  abyte = data[pos++];
                  col = (i - (i % pixelBytes)) / pixelBytes;
                  upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                  pixels[c++] = (upper + abyte) % 256;
                }
                break;
              case 3:
                for (i = _l = 0; _l < scanlineLength; i = _l += 1) {
                  abyte = data[pos++];
                  col = (i - (i % pixelBytes)) / pixelBytes;
                  left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                  upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                  pixels[c++] = (abyte + Math.floor((left + upper) / 2)) % 256;
                }
                break;
              case 4:
                for (i = _m = 0; _m < scanlineLength; i = _m += 1) {
                  abyte = data[pos++];
                  col = (i - (i % pixelBytes)) / pixelBytes;
                  left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                  if (row === 0) {
                    upper = upperLeft = 0;
                  } else {
                    upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                    upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)];
                  }
                  p = left + upper - upperLeft;
                  pa = Math.abs(p - left);
                  pb = Math.abs(p - upper);
                  pc = Math.abs(p - upperLeft);
                  if (pa <= pb && pa <= pc) {
                    paeth = left;
                  } else if (pb <= pc) {
                    paeth = upper;
                  } else {
                    paeth = upperLeft;
                  }
                  pixels[c++] = (abyte + paeth) % 256;
                }
                break;
              default:
                throw new Error("Invalid filter algorithm: " + data[pos - 1]);
            }
            row++;
          }
          return pixels;
        };

        PNG.prototype.decodePalette = function() {
          var c, i, length, palette, pos, ret, transparency, _i, _ref, _ref1;
          palette = this.palette;
          transparency = this.transparency.indexed || [];
          ret = new Uint8Array((transparency.length || 0) + palette.length);
          pos = 0;
          length = palette.length;
          c = 0;
          for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3) {
            ret[pos++] = palette[i];
            ret[pos++] = palette[i + 1];
            ret[pos++] = palette[i + 2];
            ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
          }
          return ret;
        };

        PNG.prototype.copyToImageData = function(imageData, pixels) {
          var alpha, colors, data, i, input, j, k, length, palette, v, _ref;
          colors = this.colors;
          palette = null;
          alpha = this.hasAlphaChannel;
          if (this.palette.length) {
            palette = (_ref = this._decodedPalette) != null ? _ref : this._decodedPalette = this.decodePalette();
            colors = 4;
            alpha = true;
          }
          data = imageData.data || imageData;
          length = data.length;
          input = palette || pixels;
          i = j = 0;
          if (colors === 1) {
            while (i < length) {
              k = palette ? pixels[i / 4] * 4 : j;
              v = input[k++];
              data[i++] = v;
              data[i++] = v;
              data[i++] = v;
              data[i++] = alpha ? input[k++] : 255;
              j = k;
            }
          } else {
            while (i < length) {
              k = palette ? pixels[i / 4] * 4 : j;
              data[i++] = input[k++];
              data[i++] = input[k++];
              data[i++] = input[k++];
              data[i++] = alpha ? input[k++] : 255;
              j = k;
            }
          }
        };

        PNG.prototype.decode = function() {
          var ret;
          ret = new Uint8Array(this.width * this.height * 4);
          this.copyToImageData(ret, this.decodePixels());
          return ret;
        };

        try {
            scratchCanvas = global.document.createElement('canvas');
            scratchCtx = scratchCanvas.getContext('2d');
        } catch(e) {
            return -1;
        }

        makeImage = function(imageData) {
          var img;
          scratchCtx.width = imageData.width;
          scratchCtx.height = imageData.height;
          scratchCtx.clearRect(0, 0, imageData.width, imageData.height);
          scratchCtx.putImageData(imageData, 0, 0);
          img = new Image;
          img.src = scratchCanvas.toDataURL();
          return img;
        };

        PNG.prototype.decodeFrames = function(ctx) {
          var frame, i, imageData, pixels, _i, _len, _ref, _results;
          if (!this.animation) {
            return;
          }
          _ref = this.animation.frames;
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            frame = _ref[i];
            imageData = ctx.createImageData(frame.width, frame.height);
            pixels = this.decodePixels(new Uint8Array(frame.data));
            this.copyToImageData(imageData, pixels);
            frame.imageData = imageData;
            _results.push(frame.image = makeImage(imageData));
          }
          return _results;
        };

        PNG.prototype.renderFrame = function(ctx, number) {
          var frame, frames, prev;
          frames = this.animation.frames;
          frame = frames[number];
          prev = frames[number - 1];
          if (number === 0) {
            ctx.clearRect(0, 0, this.width, this.height);
          }
          if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_BACKGROUND) {
            ctx.clearRect(prev.xOffset, prev.yOffset, prev.width, prev.height);
          } else if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_PREVIOUS) {
            ctx.putImageData(prev.imageData, prev.xOffset, prev.yOffset);
          }
          if (frame.blendOp === APNG_BLEND_OP_SOURCE) {
            ctx.clearRect(frame.xOffset, frame.yOffset, frame.width, frame.height);
          }
          return ctx.drawImage(frame.image, frame.xOffset, frame.yOffset);
        };

        PNG.prototype.animate = function(ctx) {
          var doFrame, frameNumber, frames, numFrames, numPlays, _ref,
            _this = this;
          frameNumber = 0;
          _ref = this.animation, numFrames = _ref.numFrames, frames = _ref.frames, numPlays = _ref.numPlays;
          return (doFrame = function() {
            var f, frame;
            f = frameNumber++ % numFrames;
            frame = frames[f];
            _this.renderFrame(ctx, f);
            if (numFrames > 1 && frameNumber / numFrames < numPlays) {
              return _this.animation._timeout = setTimeout(doFrame, frame.delay);
            }
          })();
        };

        PNG.prototype.stopAnimation = function() {
          var _ref;
          return clearTimeout((_ref = this.animation) != null ? _ref._timeout : void 0);
        };

        PNG.prototype.render = function(canvas) {
          var ctx, data;
          if (canvas._png) {
            canvas._png.stopAnimation();
          }
          canvas._png = this;
          canvas.width = this.width;
          canvas.height = this.height;
          ctx = canvas.getContext("2d");
          if (this.animation) {
            this.decodeFrames(ctx);
            return this.animate(ctx);
          } else {
            data = ctx.createImageData(this.width, this.height);
            this.copyToImageData(data, this.decodePixels());
            return ctx.putImageData(data, 0, 0);
          }
        };

        return PNG;

      })();

      global.PNG = PNG;

    })(typeof window !== "undefined" && window || this);
    /*
     * Extracted from pdf.js
     * https://github.com/andreasgal/pdf.js
     *
     * Copyright (c) 2011 Mozilla Foundation
     *
     * Contributors: Andreas Gal <gal@mozilla.com>
     *               Chris G Jones <cjones@mozilla.com>
     *               Shaon Barman <shaon.barman@gmail.com>
     *               Vivien Nicolas <21@vingtetun.org>
     *               Justin D'Arcangelo <justindarc@gmail.com>
     *               Yury Delendik
     *
     * Permission is hereby granted, free of charge, to any person obtaining a
     * copy of this software and associated documentation files (the "Software"),
     * to deal in the Software without restriction, including without limitation
     * the rights to use, copy, modify, merge, publish, distribute, sublicense,
     * and/or sell copies of the Software, and to permit persons to whom the
     * Software is furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
     * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
     * DEALINGS IN THE SOFTWARE.
     */

    var DecodeStream = (function() {
      function constructor() {
        this.pos = 0;
        this.bufferLength = 0;
        this.eof = false;
        this.buffer = null;
      }

      constructor.prototype = {
        ensureBuffer: function decodestream_ensureBuffer(requested) {
          var buffer = this.buffer;
          var current = buffer ? buffer.byteLength : 0;
          if (requested < current)
            return buffer;
          var size = 512;
          while (size < requested)
            size <<= 1;
          var buffer2 = new Uint8Array(size);
          for (var i = 0; i < current; ++i)
            buffer2[i] = buffer[i];
          return this.buffer = buffer2;
        },
        getByte: function decodestream_getByte() {
          var pos = this.pos;
          while (this.bufferLength <= pos) {
            if (this.eof)
              return null;
            this.readBlock();
          }
          return this.buffer[this.pos++];
        },
        getBytes: function decodestream_getBytes(length) {
          var pos = this.pos;

          if (length) {
            this.ensureBuffer(pos + length);
            var end = pos + length;

            while (!this.eof && this.bufferLength < end)
              this.readBlock();

            var bufEnd = this.bufferLength;
            if (end > bufEnd)
              end = bufEnd;
          } else {
            while (!this.eof)
              this.readBlock();

            var end = this.bufferLength;
          }

          this.pos = end;
          return this.buffer.subarray(pos, end);
        },
        lookChar: function decodestream_lookChar() {
          var pos = this.pos;
          while (this.bufferLength <= pos) {
            if (this.eof)
              return null;
            this.readBlock();
          }
          return String.fromCharCode(this.buffer[this.pos]);
        },
        getChar: function decodestream_getChar() {
          var pos = this.pos;
          while (this.bufferLength <= pos) {
            if (this.eof)
              return null;
            this.readBlock();
          }
          return String.fromCharCode(this.buffer[this.pos++]);
        },
        makeSubStream: function decodestream_makeSubstream(start, length, dict) {
          var end = start + length;
          while (this.bufferLength <= end && !this.eof)
            this.readBlock();
          return new Stream(this.buffer, start, length, dict);
        },
        skip: function decodestream_skip(n) {
          if (!n)
            n = 1;
          this.pos += n;
        },
        reset: function decodestream_reset() {
          this.pos = 0;
        }
      };

      return constructor;
    })();

    var FlateStream = (function() {
      if (typeof Uint32Array === 'undefined') {
        return undefined;
      }
      var codeLenCodeMap = new Uint32Array([
        16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
      ]);

      var lengthDecode = new Uint32Array([
        0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
        0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
        0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
        0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
      ]);

      var distDecode = new Uint32Array([
        0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
        0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
        0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
        0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
      ]);

      var fixedLitCodeTab = [new Uint32Array([
        0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
        0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
        0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
        0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
        0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
        0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
        0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
        0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
        0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
        0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
        0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
        0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
        0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
        0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
        0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
        0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
        0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
        0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
        0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
        0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
        0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
        0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
        0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
        0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
        0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
        0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
        0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
        0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
        0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
        0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
        0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
        0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
        0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
        0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
        0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
        0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
        0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
        0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
        0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
        0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
        0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
        0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
        0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
        0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
        0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
        0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
        0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
        0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
        0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
        0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
        0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
        0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
        0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
        0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
        0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
        0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
        0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
        0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
        0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
        0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
        0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
        0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
        0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
        0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
      ]), 9];

      var fixedDistCodeTab = [new Uint32Array([
        0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
        0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
        0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
        0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
      ]), 5];

      function error(e) {
          throw new Error(e)
      }

      function constructor(bytes) {
        //var bytes = stream.getBytes();
        var bytesPos = 0;

        var cmf = bytes[bytesPos++];
        var flg = bytes[bytesPos++];
        if (cmf == -1 || flg == -1)
          error('Invalid header in flate stream');
        if ((cmf & 0x0f) != 0x08)
          error('Unknown compression method in flate stream');
        if ((((cmf << 8) + flg) % 31) != 0)
          error('Bad FCHECK in flate stream');
        if (flg & 0x20)
          error('FDICT bit set in flate stream');

        this.bytes = bytes;
        this.bytesPos = bytesPos;

        this.codeSize = 0;
        this.codeBuf = 0;

        DecodeStream.call(this);
      }

      constructor.prototype = Object.create(DecodeStream.prototype);

      constructor.prototype.getBits = function(bits) {
        var codeSize = this.codeSize;
        var codeBuf = this.codeBuf;
        var bytes = this.bytes;
        var bytesPos = this.bytesPos;

        var b;
        while (codeSize < bits) {
          if (typeof (b = bytes[bytesPos++]) == 'undefined')
            error('Bad encoding in flate stream');
          codeBuf |= b << codeSize;
          codeSize += 8;
        }
        b = codeBuf & ((1 << bits) - 1);
        this.codeBuf = codeBuf >> bits;
        this.codeSize = codeSize -= bits;
        this.bytesPos = bytesPos;
        return b;
      };

      constructor.prototype.getCode = function(table) {
        var codes = table[0];
        var maxLen = table[1];
        var codeSize = this.codeSize;
        var codeBuf = this.codeBuf;
        var bytes = this.bytes;
        var bytesPos = this.bytesPos;

        while (codeSize < maxLen) {
          var b;
          if (typeof (b = bytes[bytesPos++]) == 'undefined')
            error('Bad encoding in flate stream');
          codeBuf |= (b << codeSize);
          codeSize += 8;
        }
        var code = codes[codeBuf & ((1 << maxLen) - 1)];
        var codeLen = code >> 16;
        var codeVal = code & 0xffff;
        if (codeSize == 0 || codeSize < codeLen || codeLen == 0)
          error('Bad encoding in flate stream');
        this.codeBuf = (codeBuf >> codeLen);
        this.codeSize = (codeSize - codeLen);
        this.bytesPos = bytesPos;
        return codeVal;
      };

      constructor.prototype.generateHuffmanTable = function(lengths) {
        var n = lengths.length;

        // find max code length
        var maxLen = 0;
        for (var i = 0; i < n; ++i) {
          if (lengths[i] > maxLen)
            maxLen = lengths[i];
        }

        // build the table
        var size = 1 << maxLen;
        var codes = new Uint32Array(size);
        for (var len = 1, code = 0, skip = 2;
             len <= maxLen;
             ++len, code <<= 1, skip <<= 1) {
          for (var val = 0; val < n; ++val) {
            if (lengths[val] == len) {
              // bit-reverse the code
              var code2 = 0;
              var t = code;
              for (var i = 0; i < len; ++i) {
                code2 = (code2 << 1) | (t & 1);
                t >>= 1;
              }

              // fill the table entries
              for (var i = code2; i < size; i += skip)
                codes[i] = (len << 16) | val;

              ++code;
            }
          }
        }

        return [codes, maxLen];
      };

      constructor.prototype.readBlock = function() {
        function repeat(stream, array, len, offset, what) {
          var repeat = stream.getBits(len) + offset;
          while (repeat-- > 0)
            array[i++] = what;
        }

        // read block header
        var hdr = this.getBits(3);
        if (hdr & 1)
          this.eof = true;
        hdr >>= 1;

        if (hdr == 0) { // uncompressed block
          var bytes = this.bytes;
          var bytesPos = this.bytesPos;
          var b;

          if (typeof (b = bytes[bytesPos++]) == 'undefined')
            error('Bad block header in flate stream');
          var blockLen = b;
          if (typeof (b = bytes[bytesPos++]) == 'undefined')
            error('Bad block header in flate stream');
          blockLen |= (b << 8);
          if (typeof (b = bytes[bytesPos++]) == 'undefined')
            error('Bad block header in flate stream');
          var check = b;
          if (typeof (b = bytes[bytesPos++]) == 'undefined')
            error('Bad block header in flate stream');
          check |= (b << 8);
          if (check != (~blockLen & 0xffff))
            error('Bad uncompressed block length in flate stream');

          this.codeBuf = 0;
          this.codeSize = 0;

          var bufferLength = this.bufferLength;
          var buffer = this.ensureBuffer(bufferLength + blockLen);
          var end = bufferLength + blockLen;
          this.bufferLength = end;
          for (var n = bufferLength; n < end; ++n) {
            if (typeof (b = bytes[bytesPos++]) == 'undefined') {
              this.eof = true;
              break;
            }
            buffer[n] = b;
          }
          this.bytesPos = bytesPos;
          return;
        }

        var litCodeTable;
        var distCodeTable;
        if (hdr == 1) { // compressed block, fixed codes
          litCodeTable = fixedLitCodeTab;
          distCodeTable = fixedDistCodeTab;
        } else if (hdr == 2) { // compressed block, dynamic codes
          var numLitCodes = this.getBits(5) + 257;
          var numDistCodes = this.getBits(5) + 1;
          var numCodeLenCodes = this.getBits(4) + 4;

          // build the code lengths code table
          var codeLenCodeLengths = Array(codeLenCodeMap.length);
          var i = 0;
          while (i < numCodeLenCodes)
            codeLenCodeLengths[codeLenCodeMap[i++]] = this.getBits(3);
          var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

          // build the literal and distance code tables
          var len = 0;
          var i = 0;
          var codes = numLitCodes + numDistCodes;
          var codeLengths = new Array(codes);
          while (i < codes) {
            var code = this.getCode(codeLenCodeTab);
            if (code == 16) {
              repeat(this, codeLengths, 2, 3, len);
            } else if (code == 17) {
              repeat(this, codeLengths, 3, 3, len = 0);
            } else if (code == 18) {
              repeat(this, codeLengths, 7, 11, len = 0);
            } else {
              codeLengths[i++] = len = code;
            }
          }

          litCodeTable =
            this.generateHuffmanTable(codeLengths.slice(0, numLitCodes));
          distCodeTable =
            this.generateHuffmanTable(codeLengths.slice(numLitCodes, codes));
        } else {
          error('Unknown block type in flate stream');
        }

        var buffer = this.buffer;
        var limit = buffer ? buffer.length : 0;
        var pos = this.bufferLength;
        while (true) {
          var code1 = this.getCode(litCodeTable);
          if (code1 < 256) {
            if (pos + 1 >= limit) {
              buffer = this.ensureBuffer(pos + 1);
              limit = buffer.length;
            }
            buffer[pos++] = code1;
            continue;
          }
          if (code1 == 256) {
            this.bufferLength = pos;
            return;
          }
          code1 -= 257;
          code1 = lengthDecode[code1];
          var code2 = code1 >> 16;
          if (code2 > 0)
            code2 = this.getBits(code2);
          var len = (code1 & 0xffff) + code2;
          code1 = this.getCode(distCodeTable);
          code1 = distDecode[code1];
          code2 = code1 >> 16;
          if (code2 > 0)
            code2 = this.getBits(code2);
          var dist = (code1 & 0xffff) + code2;
          if (pos + len >= limit) {
            buffer = this.ensureBuffer(pos + len);
            limit = buffer.length;
          }
          for (var k = 0; k < len; ++k, ++pos)
            buffer[pos] = buffer[pos - dist];
        }
      };

      return constructor;
    })();/**
     * JavaScript Polyfill functions for jsPDF
     * Collected from public resources by
     * https://github.com/diegocr
     */

    (function (global) {
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        if (typeof global.btoa === 'undefined') {
            global.btoa = function(data) {
                //  discuss at: http://phpjs.org/functions/base64_encode/
                // original by: Tyler Akins (http://rumkin.com)
                // improved by: Bayron Guevara
                // improved by: Thunder.m
                // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // improved by: Rafal Kukawski (http://kukawski.pl)
                // bugfixed by: Pellentesque Malesuada
                //   example 1: base64_encode('Kevin van Zonneveld');
                //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='

                var o1,o2,o3,h1,h2,h3,h4,bits,i = 0,ac = 0,enc = '',tmp_arr = [];

                if (!data) {
                    return data;
                }

                do { // pack three octets into four hexets
                    o1 = data.charCodeAt(i++);
                    o2 = data.charCodeAt(i++);
                    o3 = data.charCodeAt(i++);

                    bits = o1 << 16 | o2 << 8 | o3;

                    h1 = bits >> 18 & 0x3f;
                    h2 = bits >> 12 & 0x3f;
                    h3 = bits >> 6 & 0x3f;
                    h4 = bits & 0x3f;

                    // use hexets to index into b64, and append result to encoded string
                    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
                } while (i < data.length);

                enc = tmp_arr.join('');

                var r = data.length % 3;

                return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
            };
        }

        if (typeof global.atob === 'undefined') {
            global.atob = function(data) {
                //  discuss at: http://phpjs.org/functions/base64_decode/
                // original by: Tyler Akins (http://rumkin.com)
                // improved by: Thunder.m
                // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                //    input by: Aman Gupta
                //    input by: Brett Zamir (http://brett-zamir.me)
                // bugfixed by: Onno Marsman
                // bugfixed by: Pellentesque Malesuada
                // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                //   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
                //   returns 1: 'Kevin van Zonneveld'

                var o1,o2,o3,h1,h2,h3,h4,bits,i = 0,ac = 0,dec = '',tmp_arr = [];

                if (!data) {
                    return data;
                }

                data += '';

                do { // unpack four hexets into three octets using index points in b64
                    h1 = b64.indexOf(data.charAt(i++));
                    h2 = b64.indexOf(data.charAt(i++));
                    h3 = b64.indexOf(data.charAt(i++));
                    h4 = b64.indexOf(data.charAt(i++));

                    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                    o1 = bits >> 16 & 0xff;
                    o2 = bits >> 8 & 0xff;
                    o3 = bits & 0xff;

                    if (h3 == 64) {
                        tmp_arr[ac++] = String.fromCharCode(o1);
                    } else if (h4 == 64) {
                        tmp_arr[ac++] = String.fromCharCode(o1, o2);
                    } else {
                        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                    }
                } while (i < data.length);

                dec = tmp_arr.join('');

                return dec;
            };
        }

        if (!Array.prototype.map) {
            Array.prototype.map = function(fun /*, thisArg */) {
                if (this === void 0 || this === null || typeof fun !== "function")
                    throw new TypeError();

                var t = Object(this), len = t.length >>> 0, res = new Array(len);
                var thisArg = arguments.length > 1 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    // NOTE: Absolute correctness would demand Object.defineProperty
                    //       be used.  But this method is fairly new, and failure is
                    //       possible only if Object.prototype or Array.prototype
                    //       has a property |i| (very unlikely), so use a less-correct
                    //       but more portable alternative.
                    if (i in t)
                        res[i] = fun.call(thisArg, t[i], i, t);
                }

                return res;
            };
        }


        if(!Array.isArray) {
            Array.isArray = function(arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }

        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function(fun, thisArg) {
                "use strict";

                if (this === void 0 || this === null || typeof fun !== "function")
                    throw new TypeError();

                var t = Object(this), len = t.length >>> 0;
                for (var i = 0; i < len; i++) {
                    if (i in t)
                        fun.call(thisArg, t[i], i, t);
                }
            };
        }

        if (!Object.keys) {
            Object.keys = (function () {
                'use strict';

                var hasOwnProperty = Object.prototype.hasOwnProperty,
                    hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                    dontEnums = ['toString','toLocaleString','valueOf','hasOwnProperty',
                        'isPrototypeOf','propertyIsEnumerable','constructor'],
                    dontEnumsLength = dontEnums.length;

                return function (obj) {
                    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                        throw new TypeError();
                    }
                    var result = [], prop, i;

                    for (prop in obj) {
                        if (hasOwnProperty.call(obj, prop)) {
                            result.push(prop);
                        }
                    }

                    if (hasDontEnumBug) {
                        for (i = 0; i < dontEnumsLength; i++) {
                            if (hasOwnProperty.call(obj, dontEnums[i])) {
                                result.push(dontEnums[i]);
                            }
                        }
                    }
                    return result;
                };
            }());
        }

        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g, '');
            };
        }
        if (!String.prototype.trimLeft) {
            String.prototype.trimLeft = function() {
                return this.replace(/^\s+/g, "");
            };
        }
        if (!String.prototype.trimRight) {
            String.prototype.trimRight = function() {
                return this.replace(/\s+$/g, "");
            };
        }
    })(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this);

    var methods = {
        init : function( el, options ) {
            var el = el,
                settings = $.extend({
                // These are the defaults.
                position: 'bottom', // top, bottom, float
                orientation: 'l',
                unit: 'pt',
                format: 'a4',
                marginTop: 20,
                marginRight: 20,
                marginBottom: 20,
                marginLeft: 20
            }, options );

            $('body').on('click', '.js-print-table', function (){
                var pdfTitle = el.data('title');

                // PDF Settings to churn out jsPDF('orientation', 'unit', 'format');
                var pdf = new jsPDF(settings.orientation, settings.unit, settings.format);
                var source = el.parent()[0];

                // Margins to set on the paper
                var margins = {
                    top: settings.marginTop,
                    bottom: settings.marginBottom,
                    left: settings.marginLeft,
                    right: settings.marginRight,
                    width: '100%'
                };

                // Where the magic happens
                pdf.fromHTML(
                    source,
                    margins.left,
                    margins.top, {
                        'width': margins.width,
                    },
                    function (dispose) {
                        // save the pdf
                        pdf.save( pdfTitle + '.pdf');
                    },
                    margins
                );
            });

            var _position = settings.position.toLowerCase();
            switch ( _position ){
                case 'bottom':
                    return el.wrap( '<div class="table-wrapper"></div>' )
                        .parent()
                            .after('<button class="btn-print js-print-table" >Print Table</button>');
                    break;
                case 'top':
                    return el.wrap( '<div class="table-wrapper"></div>' )
                        .parent()
                            .before('<button class="btn-print js-print-table" >Print Table</button>');
                    break;
                case 'float':
                    return el.wrap( '<div class="table-wrapper"></div>' )
                        .parent().prepend('<button class="btn-print icon icon-print js-print-table" ></button>')
                        .parent().find('button').pin({
                            containerSelector: '.table-wrapper',
                            padding: { top: 45 }
                        });
                    break;
            }
        },
        destroy : function( el ) {
            if ( !$('.table-wrapper').length ){
                return false;
            }

            $('body').unbind('click', '.js-print-table');
            el.unwrap()
                .prev().remove();
        },
        hasHorizontalScrollBar : function ( el ){
            return el.get(0).scrollWidth > el.width();
        }
    };

    $.fn.pdfTable = function( method, options ) {
        var el = this;

        switch ( method ) {
            case 'init' :
                methods.init( el, options );
                break;
            case 'hasHorizontalScrollBar':
                return methods.hasHorizontalScrollBar( el );
                break;
            case 'destroy':
                methods.destroy( el );
                break;
        }
    };

        /** @preserve
     * jsPDF - PDF Document creation from JavaScript
     * Version 1.0.272-git Built on 2014-09-29T15:09
     *                           CommitID d4770725ca
     *
     * Copyright (c) 2010-2014 James Hall, https://github.com/MrRio/jsPDF
     *               2010 Aaron Spike, https://github.com/acspike
     *               2012 Willow Systems Corporation, willow-systems.com
     *               2012 Pablo Hess, https://github.com/pablohess
     *               2012 Florian Jenett, https://github.com/fjenett
     *               2013 Warren Weckesser, https://github.com/warrenweckesser
     *               2013 Youssef Beddad, https://github.com/lifof
     *               2013 Lee Driscoll, https://github.com/lsdriscoll
     *               2013 Stefan Slonevskiy, https://github.com/stefslon
     *               2013 Jeremy Morel, https://github.com/jmorel
     *               2013 Christoph Hartmann, https://github.com/chris-rock
     *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
     *               2014 James Makes, https://github.com/dollaruw
     *               2014 Diego Casorran, https://github.com/diegocr
     *
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     *
     * Contributor(s):
     *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
     *    kim3er, mfo, alnorth,
     */

})( jQuery );;/*!
 * VERSION: 1.7.4
 * DATE: 2014-07-17
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";var t=document.documentElement,e=window,i=function(i,r){var s="x"===r?"Width":"Height",n="scroll"+s,o="client"+s,a=document.body;return i===e||i===t||i===a?Math.max(t[n],a[n])-(e["inner"+s]||Math.max(t[o],a[o])):i[n]-i["offset"+s]},r=_gsScope._gsDefine.plugin({propName:"scrollTo",API:2,version:"1.7.4",init:function(t,r,s){return this._wdw=t===e,this._target=t,this._tween=s,"object"!=typeof r&&(r={y:r}),this.vars=r,this._autoKill=r.autoKill!==!1,this.x=this.xPrev=this.getX(),this.y=this.yPrev=this.getY(),null!=r.x?(this._addTween(this,"x",this.x,"max"===r.x?i(t,"x"):r.x,"scrollTo_x",!0),this._overwriteProps.push("scrollTo_x")):this.skipX=!0,null!=r.y?(this._addTween(this,"y",this.y,"max"===r.y?i(t,"y"):r.y,"scrollTo_y",!0),this._overwriteProps.push("scrollTo_y")):this.skipY=!0,!0},set:function(t){this._super.setRatio.call(this,t);var r=this._wdw||!this.skipX?this.getX():this.xPrev,s=this._wdw||!this.skipY?this.getY():this.yPrev,n=s-this.yPrev,o=r-this.xPrev;this._autoKill&&(!this.skipX&&(o>7||-7>o)&&i(this._target,"x")>r&&(this.skipX=!0),!this.skipY&&(n>7||-7>n)&&i(this._target,"y")>s&&(this.skipY=!0),this.skipX&&this.skipY&&(this._tween.kill(),this.vars.onAutoKill&&this.vars.onAutoKill.apply(this.vars.onAutoKillScope||this._tween,this.vars.onAutoKillParams||[]))),this._wdw?e.scrollTo(this.skipX?r:this.x,this.skipY?s:this.y):(this.skipY||(this._target.scrollTop=this.y),this.skipX||(this._target.scrollLeft=this.x)),this.xPrev=this.x,this.yPrev=this.y}}),s=r.prototype;r.max=i,s.getX=function(){return this._wdw?null!=e.pageXOffset?e.pageXOffset:null!=t.scrollLeft?t.scrollLeft:document.body.scrollLeft:this._target.scrollLeft},s.getY=function(){return this._wdw?null!=e.pageYOffset?e.pageYOffset:null!=t.scrollTop?t.scrollTop:document.body.scrollTop:this._target.scrollTop},s._kill=function(t){return t.scrollTo_x&&(this.skipX=!0),t.scrollTo_y&&(this.skipY=!0),this._super._kill.call(this,t)}}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()();;/*!
 * VERSION: 1.16.0
 * DATE: 2015-03-01
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("TimelineMax",["TimelineLite","TweenLite","easing.Ease"],function(t,e,i){var s=function(e){t.call(this,e),this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._dirty=!0},r=1e-10,n=[],a=e._internals,o=a.lazyTweens,h=a.lazyRender,l=new i(null,null,1,0),_=s.prototype=new t;return _.constructor=s,_.kill()._gc=!1,s.version="1.16.0",_.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),t.prototype.invalidate.call(this)},_.addCallback=function(t,i,s,r){return this.add(e.delayedCall(0,t,s,r),i)},_.removeCallback=function(t,e){if(t)if(null==e)this._kill(null,t);else for(var i=this.getTweensOf(t,!1),s=i.length,r=this._parseTimeOrLabel(e);--s>-1;)i[s]._startTime===r&&i[s]._enabled(!1,!1);return this},_.removePause=function(e){return this.removeCallback(t._internals.pauseCallback,e)},_.tweenTo=function(t,i){i=i||{};var s,r,a,o={ease:l,useFrames:this.usesFrames(),immediateRender:!1};for(r in i)o[r]=i[r];return o.time=this._parseTimeOrLabel(t),s=Math.abs(Number(o.time)-this._time)/this._timeScale||.001,a=new e(this,s,o),o.onStart=function(){a.target.paused(!0),a.vars.time!==a.target.time()&&s===a.duration()&&a.duration(Math.abs(a.vars.time-a.target.time())/a.target._timeScale),i.onStart&&i.onStart.apply(i.onStartScope||a,i.onStartParams||n)},a},_.tweenFromTo=function(t,e,i){i=i||{},t=this._parseTimeOrLabel(t),i.startAt={onComplete:this.seek,onCompleteParams:[t],onCompleteScope:this},i.immediateRender=i.immediateRender!==!1;var s=this.tweenTo(e,i);return s.duration(Math.abs(s.vars.time-t)/this._timeScale||.001)},_.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,a,l,_,u,c,f=this._dirty?this.totalDuration():this._totalDuration,p=this._duration,m=this._time,d=this._totalTime,g=this._startTime,v=this._timeScale,y=this._rawPrevTime,T=this._paused,w=this._cycle;if(t>=f)this._locked||(this._totalTime=f,this._cycle=this._repeat),this._reversed||this._hasPausedChild()||(a=!0,_="onComplete",0===this._duration&&(0===t||0>y||y===r)&&y!==t&&this._first&&(u=!0,y>r&&(_="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,this._yoyo&&0!==(1&this._cycle)?this._time=t=0:(this._time=p,t=p+1e-4);else if(1e-7>t)if(this._locked||(this._totalTime=this._cycle=0),this._time=0,(0!==m||0===p&&y!==r&&(y>0||0>t&&y>=0)&&!this._locked)&&(_="onReverseComplete",a=this._reversed),0>t)this._active=!1,this._timeline.autoRemoveChildren&&this._reversed?(u=a=!0,_="onReverseComplete"):y>=0&&this._first&&(u=!0),this._rawPrevTime=t;else{if(this._rawPrevTime=p||!e||t||this._rawPrevTime===t?t:r,0===t&&a)for(s=this._first;s&&0===s._startTime;)s._duration||(a=!1),s=s._next;t=0,this._initted||(u=!0)}else 0===p&&0>y&&(u=!0),this._time=this._rawPrevTime=t,this._locked||(this._totalTime=t,0!==this._repeat&&(c=p+this._repeatDelay,this._cycle=this._totalTime/c>>0,0!==this._cycle&&this._cycle===this._totalTime/c&&this._cycle--,this._time=this._totalTime-this._cycle*c,this._yoyo&&0!==(1&this._cycle)&&(this._time=p-this._time),this._time>p?(this._time=p,t=p+1e-4):0>this._time?this._time=t=0:t=this._time));if(this._cycle!==w&&!this._locked){var b=this._yoyo&&0!==(1&w),x=b===(this._yoyo&&0!==(1&this._cycle)),P=this._totalTime,S=this._cycle,C=this._rawPrevTime,R=this._time;if(this._totalTime=w*p,w>this._cycle?b=!b:this._totalTime+=p,this._time=m,this._rawPrevTime=0===p?y-1e-4:y,this._cycle=w,this._locked=!0,m=b?0:p,this.render(m,e,0===p),e||this._gc||this.vars.onRepeat&&this.vars.onRepeat.apply(this.vars.onRepeatScope||this,this.vars.onRepeatParams||n),x&&(m=b?p+1e-4:-1e-4,this.render(m,!0,!1)),this._locked=!1,this._paused&&!T)return;this._time=R,this._totalTime=P,this._cycle=S,this._rawPrevTime=C}if(!(this._time!==m&&this._first||i||u))return d!==this._totalTime&&this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n)),void 0;if(this._initted||(this._initted=!0),this._active||!this._paused&&this._totalTime!==d&&t>0&&(this._active=!0),0===d&&this.vars.onStart&&0!==this._totalTime&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||n)),this._time>=m)for(s=this._first;s&&(l=s._next,!this._paused||T);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=l;else for(s=this._last;s&&(l=s._prev,!this._paused||T);)(s._active||m>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=l;this._onUpdate&&(e||(o.length&&h(),this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n))),_&&(this._locked||this._gc||(g===this._startTime||v!==this._timeScale)&&(0===this._time||f>=this.totalDuration())&&(a&&(o.length&&h(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[_]&&this.vars[_].apply(this.vars[_+"Scope"]||this,this.vars[_+"Params"]||n)))},_.getActive=function(t,e,i){null==t&&(t=!0),null==e&&(e=!0),null==i&&(i=!1);var s,r,n=[],a=this.getChildren(t,e,i),o=0,h=a.length;for(s=0;h>s;s++)r=a[s],r.isActive()&&(n[o++]=r);return n},_.getLabelAfter=function(t){t||0!==t&&(t=this._time);var e,i=this.getLabelsArray(),s=i.length;for(e=0;s>e;e++)if(i[e].time>t)return i[e].name;return null},_.getLabelBefore=function(t){null==t&&(t=this._time);for(var e=this.getLabelsArray(),i=e.length;--i>-1;)if(t>e[i].time)return e[i].name;return null},_.getLabelsArray=function(){var t,e=[],i=0;for(t in this._labels)e[i++]={time:this._labels[t],name:t};return e.sort(function(t,e){return t.time-e.time}),e},_.progress=function(t,e){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),e):this._time/this.duration()},_.totalProgress=function(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this._totalTime/this.totalDuration()},_.totalDuration=function(e){return arguments.length?-1===this._repeat?this:this.duration((e-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(t.prototype.totalDuration.call(this),this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat),this._totalDuration)},_.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!==(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},_.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},_.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},_.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},_.currentLabel=function(t){return arguments.length?this.seek(t,!0):this.getLabelBefore(this._time+1e-8)},s},!0),_gsScope._gsDefine("TimelineLite",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){e.call(this,t),this._labels={},this.autoRemoveChildren=this.vars.autoRemoveChildren===!0,this.smoothChildTiming=this.vars.smoothChildTiming===!0,this._sortChildren=!0,this._onUpdate=this.vars.onUpdate;var i,s,r=this.vars;for(s in r)i=r[s],h(i)&&-1!==i.join("").indexOf("{self}")&&(r[s]=this._swapSelfInParams(i));h(r.tweens)&&this.add(r.tweens,0,r.align,r.stagger)},r=1e-10,n=i._internals,a=s._internals={},o=n.isSelector,h=n.isArray,l=n.lazyTweens,_=n.lazyRender,u=[],c=_gsScope._gsDefine.globals,f=function(t){var e,i={};for(e in t)i[e]=t[e];return i},p=a.pauseCallback=function(t,e,i,s){var n,a=t._timeline,o=a._totalTime,h=t._startTime,l=t.ratio?r:0,_=t.ratio?0:r;if(e||!this._forcingPlayhead){for(a.pause(h),n=t._prev;n&&n._startTime===h;)n._rawPrevTime=_,n=n._prev;for(n=t._next;n&&n._startTime===h;)n._rawPrevTime=l,n=n._next;e&&e.apply(s||a,i||u),this._forcingPlayhead&&a.seek(o)}},m=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},d=s.prototype=new e;return s.version="1.16.0",d.constructor=s,d.kill()._gc=d._forcingPlayhead=!1,d.to=function(t,e,s,r){var n=s.repeat&&c.TweenMax||i;return e?this.add(new n(t,e,s),r):this.set(t,s,r)},d.from=function(t,e,s,r){return this.add((s.repeat&&c.TweenMax||i).from(t,e,s),r)},d.fromTo=function(t,e,s,r,n){var a=r.repeat&&c.TweenMax||i;return e?this.add(a.fromTo(t,e,s,r),n):this.set(t,r,n)},d.staggerTo=function(t,e,r,n,a,h,l,_){var u,c=new s({onComplete:h,onCompleteParams:l,onCompleteScope:_,smoothChildTiming:this.smoothChildTiming});for("string"==typeof t&&(t=i.selector(t)||t),t=t||[],o(t)&&(t=m(t)),n=n||0,0>n&&(t=m(t),t.reverse(),n*=-1),u=0;t.length>u;u++)r.startAt&&(r.startAt=f(r.startAt)),c.to(t[u],e,f(r),u*n);return this.add(c,a)},d.staggerFrom=function(t,e,i,s,r,n,a,o){return i.immediateRender=0!=i.immediateRender,i.runBackwards=!0,this.staggerTo(t,e,i,s,r,n,a,o)},d.staggerFromTo=function(t,e,i,s,r,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,this.staggerTo(t,e,s,r,n,a,o,h)},d.call=function(t,e,s,r){return this.add(i.delayedCall(0,t,e,s),r)},d.set=function(t,e,s){return s=this._parseTimeOrLabel(s,0,!0),null==e.immediateRender&&(e.immediateRender=s===this._time&&!this._paused),this.add(new i(t,0,e),s)},s.exportRoot=function(t,e){t=t||{},null==t.smoothChildTiming&&(t.smoothChildTiming=!0);var r,n,a=new s(t),o=a._timeline;for(null==e&&(e=!0),o._remove(a,!0),a._startTime=0,a._rawPrevTime=a._time=a._totalTime=o._time,r=o._first;r;)n=r._next,e&&r instanceof i&&r.target===r.vars.onComplete||a.add(r,r._startTime-r._delay),r=n;return o.add(a,0),a},d.add=function(r,n,a,o){var l,_,u,c,f,p;if("number"!=typeof n&&(n=this._parseTimeOrLabel(n,0,!0,r)),!(r instanceof t)){if(r instanceof Array||r&&r.push&&h(r)){for(a=a||"normal",o=o||0,l=n,_=r.length,u=0;_>u;u++)h(c=r[u])&&(c=new s({tweens:c})),this.add(c,l),"string"!=typeof c&&"function"!=typeof c&&("sequence"===a?l=c._startTime+c.totalDuration()/c._timeScale:"start"===a&&(c._startTime-=c.delay())),l+=o;return this._uncache(!0)}if("string"==typeof r)return this.addLabel(r,n);if("function"!=typeof r)throw"Cannot add "+r+" into the timeline; it is not a tween, timeline, function, or string.";r=i.delayedCall(0,r)}if(e.prototype.add.call(this,r,n),(this._gc||this._time===this._duration)&&!this._paused&&this._duration<this.duration())for(f=this,p=f.rawTime()>r._startTime;f._timeline;)p&&f._timeline.smoothChildTiming?f.totalTime(f._totalTime,!0):f._gc&&f._enabled(!0,!1),f=f._timeline;return this},d.remove=function(e){if(e instanceof t)return this._remove(e,!1);if(e instanceof Array||e&&e.push&&h(e)){for(var i=e.length;--i>-1;)this.remove(e[i]);return this}return"string"==typeof e?this.removeLabel(e):this.kill(null,e)},d._remove=function(t,i){e.prototype._remove.call(this,t,i);var s=this._last;return s?this._time>s._startTime+s._totalDuration/s._timeScale&&(this._time=this.duration(),this._totalTime=this._totalDuration):this._time=this._totalTime=this._duration=this._totalDuration=0,this},d.append=function(t,e){return this.add(t,this._parseTimeOrLabel(null,e,!0,t))},d.insert=d.insertMultiple=function(t,e,i,s){return this.add(t,e||0,i,s)},d.appendMultiple=function(t,e,i,s){return this.add(t,this._parseTimeOrLabel(null,e,!0,t),i,s)},d.addLabel=function(t,e){return this._labels[t]=this._parseTimeOrLabel(e),this},d.addPause=function(t,e,s,r){var n=i.delayedCall(0,p,["{self}",e,s,r],this);return n.data="isPause",this.add(n,t)},d.removeLabel=function(t){return delete this._labels[t],this},d.getLabelTime=function(t){return null!=this._labels[t]?this._labels[t]:-1},d._parseTimeOrLabel=function(e,i,s,r){var n;if(r instanceof t&&r.timeline===this)this.remove(r);else if(r&&(r instanceof Array||r.push&&h(r)))for(n=r.length;--n>-1;)r[n]instanceof t&&r[n].timeline===this&&this.remove(r[n]);if("string"==typeof i)return this._parseTimeOrLabel(i,s&&"number"==typeof e&&null==this._labels[i]?e-this.duration():0,s);if(i=i||0,"string"!=typeof e||!isNaN(e)&&null==this._labels[e])null==e&&(e=this.duration());else{if(n=e.indexOf("="),-1===n)return null==this._labels[e]?s?this._labels[e]=this.duration()+i:i:this._labels[e]+i;i=parseInt(e.charAt(n-1)+"1",10)*Number(e.substr(n+1)),e=n>1?this._parseTimeOrLabel(e.substr(0,n-1),0,s):this.duration()}return Number(e)+i},d.seek=function(t,e){return this.totalTime("number"==typeof t?t:this._parseTimeOrLabel(t),e!==!1)},d.stop=function(){return this.paused(!0)},d.gotoAndPlay=function(t,e){return this.play(t,e)},d.gotoAndStop=function(t,e){return this.pause(t,e)},d.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,n,a,o,h,c=this._dirty?this.totalDuration():this._totalDuration,f=this._time,p=this._startTime,m=this._timeScale,d=this._paused;if(t>=c)this._totalTime=this._time=c,this._reversed||this._hasPausedChild()||(n=!0,o="onComplete",0===this._duration&&(0===t||0>this._rawPrevTime||this._rawPrevTime===r)&&this._rawPrevTime!==t&&this._first&&(h=!0,this._rawPrevTime>r&&(o="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=c+1e-4;else if(1e-7>t)if(this._totalTime=this._time=0,(0!==f||0===this._duration&&this._rawPrevTime!==r&&(this._rawPrevTime>0||0>t&&this._rawPrevTime>=0))&&(o="onReverseComplete",n=this._reversed),0>t)this._active=!1,this._timeline.autoRemoveChildren&&this._reversed?(h=n=!0,o="onReverseComplete"):this._rawPrevTime>=0&&this._first&&(h=!0),this._rawPrevTime=t;else{if(this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,0===t&&n)for(s=this._first;s&&0===s._startTime;)s._duration||(n=!1),s=s._next;t=0,this._initted||(h=!0)}else this._totalTime=this._time=this._rawPrevTime=t;if(this._time!==f&&this._first||i||h){if(this._initted||(this._initted=!0),this._active||!this._paused&&this._time!==f&&t>0&&(this._active=!0),0===f&&this.vars.onStart&&0!==this._time&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||u)),this._time>=f)for(s=this._first;s&&(a=s._next,!this._paused||d);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;else for(s=this._last;s&&(a=s._prev,!this._paused||d);)(s._active||f>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;this._onUpdate&&(e||(l.length&&_(),this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||u))),o&&(this._gc||(p===this._startTime||m!==this._timeScale)&&(0===this._time||c>=this.totalDuration())&&(n&&(l.length&&_(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[o]&&this.vars[o].apply(this.vars[o+"Scope"]||this,this.vars[o+"Params"]||u)))}},d._hasPausedChild=function(){for(var t=this._first;t;){if(t._paused||t instanceof s&&t._hasPausedChild())return!0;t=t._next}return!1},d.getChildren=function(t,e,s,r){r=r||-9999999999;for(var n=[],a=this._first,o=0;a;)r>a._startTime||(a instanceof i?e!==!1&&(n[o++]=a):(s!==!1&&(n[o++]=a),t!==!1&&(n=n.concat(a.getChildren(!0,e,s)),o=n.length))),a=a._next;return n},d.getTweensOf=function(t,e){var s,r,n=this._gc,a=[],o=0;for(n&&this._enabled(!0,!0),s=i.getTweensOf(t),r=s.length;--r>-1;)(s[r].timeline===this||e&&this._contains(s[r]))&&(a[o++]=s[r]);return n&&this._enabled(!1,!0),a},d.recent=function(){return this._recent},d._contains=function(t){for(var e=t.timeline;e;){if(e===this)return!0;e=e.timeline}return!1},d.shiftChildren=function(t,e,i){i=i||0;for(var s,r=this._first,n=this._labels;r;)r._startTime>=i&&(r._startTime+=t),r=r._next;if(e)for(s in n)n[s]>=i&&(n[s]+=t);return this._uncache(!0)},d._kill=function(t,e){if(!t&&!e)return this._enabled(!1,!1);for(var i=e?this.getTweensOf(e):this.getChildren(!0,!0,!1),s=i.length,r=!1;--s>-1;)i[s]._kill(t,e)&&(r=!0);return r},d.clear=function(t){var e=this.getChildren(!1,!0,!0),i=e.length;for(this._time=this._totalTime=0;--i>-1;)e[i]._enabled(!1,!1);return t!==!1&&(this._labels={}),this._uncache(!0)},d.invalidate=function(){for(var e=this._first;e;)e.invalidate(),e=e._next;return t.prototype.invalidate.call(this)},d._enabled=function(t,i){if(t===this._gc)for(var s=this._first;s;)s._enabled(t,!0),s=s._next;return e.prototype._enabled.call(this,t,i)},d.totalTime=function(){this._forcingPlayhead=!0;var e=t.prototype.totalTime.apply(this,arguments);return this._forcingPlayhead=!1,e},d.duration=function(t){return arguments.length?(0!==this.duration()&&0!==t&&this.timeScale(this._duration/t),this):(this._dirty&&this.totalDuration(),this._duration)},d.totalDuration=function(t){if(!arguments.length){if(this._dirty){for(var e,i,s=0,r=this._last,n=999999999999;r;)e=r._prev,r._dirty&&r.totalDuration(),r._startTime>n&&this._sortChildren&&!r._paused?this.add(r,r._startTime-r._delay):n=r._startTime,0>r._startTime&&!r._paused&&(s-=r._startTime,this._timeline.smoothChildTiming&&(this._startTime+=r._startTime/this._timeScale),this.shiftChildren(-r._startTime,!1,-9999999999),n=0),i=r._startTime+r._totalDuration/r._timeScale,i>s&&(s=i),r=e;this._duration=this._totalDuration=s,this._dirty=!1}return this._totalDuration}return 0!==this.totalDuration()&&0!==t&&this.timeScale(this._totalDuration/t),this},d.paused=function(e){if(!e)for(var i=this._first,s=this._time;i;)i._startTime===s&&"isPause"===i.data&&(i._rawPrevTime=s),i=i._next;return t.prototype.paused.apply(this,arguments)},d.usesFrames=function(){for(var e=this._timeline;e._timeline;)e=e._timeline;return e===t._rootFramesTimeline},d.rawTime=function(){return this._paused?this._totalTime:(this._timeline.rawTime()-this._startTime)*this._timeScale},s},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(t){"use strict";var e=function(){return(_gsScope.GreenSockGlobals||_gsScope)[t]};"function"==typeof define&&define.amd?define(["TweenLite"],e):"undefined"!=typeof module&&module.exports&&(require("./TweenLite.js"),module.exports=e())}("TimelineMax");;/*!
 * VERSION: 1.15.0
 * DATE: 2014-12-03
 * UPDATES AND DOCS AT: http://www.greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("TweenMax",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},r=function(t,e,s){i.call(this,t,e,s),this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._dirty=!0,this.render=r.prototype.render},n=1e-10,a=i._internals,o=a.isSelector,h=a.isArray,l=r.prototype=i.to({},.1,{}),_=[];r.version="1.15.0",l.constructor=r,l.kill()._gc=!1,r.killTweensOf=r.killDelayedCallsTo=i.killTweensOf,r.getTweensOf=i.getTweensOf,r.lagSmoothing=i.lagSmoothing,r.ticker=i.ticker,r.render=i.render,l.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),i.prototype.invalidate.call(this)},l.updateTo=function(t,e){var s,r=this.ratio,n=this.vars.immediateRender||t.immediateRender;e&&this._startTime<this._timeline._time&&(this._startTime=this._timeline._time,this._uncache(!1),this._gc?this._enabled(!0,!1):this._timeline.insert(this,this._startTime-this._delay));for(s in t)this.vars[s]=t[s];if(this._initted||n)if(e)this._initted=!1,n&&this.render(0,!0,!0);else if(this._gc&&this._enabled(!0,!1),this._notifyPluginsOfEnabled&&this._firstPT&&i._onPluginEvent("_onDisable",this),this._time/this._duration>.998){var a=this._time;this.render(0,!0,!1),this._initted=!1,this.render(a,!0,!1)}else if(this._time>0||n){this._initted=!1,this._init();for(var o,h=1/(1-r),l=this._firstPT;l;)o=l.s+l.c,l.c*=h,l.s=o-l.c,l=l._next}return this},l.render=function(t,e,i){this._initted||0===this._duration&&this.vars.repeat&&this.invalidate();var s,r,o,h,l,u,p,c,f=this._dirty?this.totalDuration():this._totalDuration,m=this._time,d=this._totalTime,g=this._cycle,v=this._duration,y=this._rawPrevTime;if(t>=f?(this._totalTime=f,this._cycle=this._repeat,this._yoyo&&0!==(1&this._cycle)?(this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0):(this._time=v,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1),this._reversed||(s=!0,r="onComplete"),0===v&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(0===t||0>y||y===n)&&y!==t&&(i=!0,y>n&&(r="onReverseComplete")),this._rawPrevTime=c=!e||t||y===t?t:n)):1e-7>t?(this._totalTime=this._time=this._cycle=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==d||0===v&&y>0&&y!==n)&&(r="onReverseComplete",s=this._reversed),0>t&&(this._active=!1,0===v&&(this._initted||!this.vars.lazy||i)&&(y>=0&&(i=!0),this._rawPrevTime=c=!e||t||y===t?t:n)),this._initted||(i=!0)):(this._totalTime=this._time=t,0!==this._repeat&&(h=v+this._repeatDelay,this._cycle=this._totalTime/h>>0,0!==this._cycle&&this._cycle===this._totalTime/h&&this._cycle--,this._time=this._totalTime-this._cycle*h,this._yoyo&&0!==(1&this._cycle)&&(this._time=v-this._time),this._time>v?this._time=v:0>this._time&&(this._time=0)),this._easeType?(l=this._time/v,u=this._easeType,p=this._easePower,(1===u||3===u&&l>=.5)&&(l=1-l),3===u&&(l*=2),1===p?l*=l:2===p?l*=l*l:3===p?l*=l*l*l:4===p&&(l*=l*l*l*l),this.ratio=1===u?1-l:2===u?l:.5>this._time/v?l/2:1-l/2):this.ratio=this._ease.getRatio(this._time/v)),m===this._time&&!i&&g===this._cycle)return d!==this._totalTime&&this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_)),void 0;if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=m,this._totalTime=d,this._rawPrevTime=y,this._cycle=g,a.lazyTweens.push(this),this._lazy=[t,e],void 0;this._time&&!s?this.ratio=this._ease.getRatio(this._time/v):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==m&&t>=0&&(this._active=!0),0===d&&(2===this._initted&&t>0&&this._init(),this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._totalTime||0===v)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||_))),o=this._firstPT;o;)o.f?o.t[o.p](o.c*this.ratio+o.s):o.t[o.p]=o.c*this.ratio+o.s,o=o._next;this._onUpdate&&(0>t&&this._startAt&&this._startTime&&this._startAt.render(t,e,i),e||(this._totalTime!==d||s)&&this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_)),this._cycle!==g&&(e||this._gc||this.vars.onRepeat&&this.vars.onRepeat.apply(this.vars.onRepeatScope||this,this.vars.onRepeatParams||_)),r&&(!this._gc||i)&&(0>t&&this._startAt&&!this._onUpdate&&this._startTime&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||_),0===v&&this._rawPrevTime===n&&c!==n&&(this._rawPrevTime=0))},r.to=function(t,e,i){return new r(t,e,i)},r.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new r(t,e,i)},r.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new r(t,e,s)},r.staggerTo=r.allTo=function(t,e,n,a,l,u,p){a=a||0;var c,f,m,d,g=n.delay||0,v=[],y=function(){n.onComplete&&n.onComplete.apply(n.onCompleteScope||this,arguments),l.apply(p||this,u||_)};for(h(t)||("string"==typeof t&&(t=i.selector(t)||t),o(t)&&(t=s(t))),t=t||[],0>a&&(t=s(t),t.reverse(),a*=-1),c=t.length-1,m=0;c>=m;m++){f={};for(d in n)f[d]=n[d];f.delay=g,m===c&&l&&(f.onComplete=y),v[m]=new r(t[m],e,f),g+=a}return v},r.staggerFrom=r.allFrom=function(t,e,i,s,n,a,o){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,r.staggerTo(t,e,i,s,n,a,o)},r.staggerFromTo=r.allFromTo=function(t,e,i,s,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,r.staggerTo(t,e,s,n,a,o,h)},r.delayedCall=function(t,e,i,s,n){return new r(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,useFrames:n,overwrite:0})},r.set=function(t,e){return new r(t,0,e)},r.isTweening=function(t){return i.getTweensOf(t,!0).length>0};var u=function(t,e){for(var s=[],r=0,n=t._first;n;)n instanceof i?s[r++]=n:(e&&(s[r++]=n),s=s.concat(u(n,e)),r=s.length),n=n._next;return s},p=r.getAllTweens=function(e){return u(t._rootTimeline,e).concat(u(t._rootFramesTimeline,e))};r.killAll=function(t,i,s,r){null==i&&(i=!0),null==s&&(s=!0);var n,a,o,h=p(0!=r),l=h.length,_=i&&s&&r;for(o=0;l>o;o++)a=h[o],(_||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&(t?a.totalTime(a._reversed?0:a.totalDuration()):a._enabled(!1,!1))},r.killChildTweensOf=function(t,e){if(null!=t){var n,l,_,u,p,c=a.tweenLookup;if("string"==typeof t&&(t=i.selector(t)||t),o(t)&&(t=s(t)),h(t))for(u=t.length;--u>-1;)r.killChildTweensOf(t[u],e);else{n=[];for(_ in c)for(l=c[_].target.parentNode;l;)l===t&&(n=n.concat(c[_].tweens)),l=l.parentNode;for(p=n.length,u=0;p>u;u++)e&&n[u].totalTime(n[u].totalDuration()),n[u]._enabled(!1,!1)}}};var c=function(t,i,s,r){i=i!==!1,s=s!==!1,r=r!==!1;for(var n,a,o=p(r),h=i&&s&&r,l=o.length;--l>-1;)a=o[l],(h||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&a.paused(t)};return r.pauseAll=function(t,e,i){c(!0,t,e,i)},r.resumeAll=function(t,e,i){c(!1,t,e,i)},r.globalTimeScale=function(e){var s=t._rootTimeline,r=i.ticker.time;return arguments.length?(e=e||n,s._startTime=r-(r-s._startTime)*s._timeScale/e,s=t._rootFramesTimeline,r=i.ticker.frame,s._startTime=r-(r-s._startTime)*s._timeScale/e,s._timeScale=t._rootTimeline._timeScale=e,e):s._timeScale},l.progress=function(t){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),!1):this._time/this.duration()},l.totalProgress=function(t){return arguments.length?this.totalTime(this.totalDuration()*t,!1):this._totalTime/this.totalDuration()},l.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!==(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},l.duration=function(e){return arguments.length?t.prototype.duration.call(this,e):this._duration},l.totalDuration=function(t){return arguments.length?-1===this._repeat?this:this.duration((t-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat,this._dirty=!1),this._totalDuration)},l.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},l.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},l.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},r},!0),_gsScope._gsDefine("TimelineLite",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){e.call(this,t),this._labels={},this.autoRemoveChildren=this.vars.autoRemoveChildren===!0,this.smoothChildTiming=this.vars.smoothChildTiming===!0,this._sortChildren=!0,this._onUpdate=this.vars.onUpdate;var i,s,r=this.vars;for(s in r)i=r[s],o(i)&&-1!==i.join("").indexOf("{self}")&&(r[s]=this._swapSelfInParams(i));o(r.tweens)&&this.add(r.tweens,0,r.align,r.stagger)},r=1e-10,n=i._internals,a=n.isSelector,o=n.isArray,h=n.lazyTweens,l=n.lazyRender,_=[],u=_gsScope._gsDefine.globals,p=function(t){var e,i={};for(e in t)i[e]=t[e];return i},c=function(t,e,i,s){var r=t._timeline,n=r._totalTime;!e&&this._forcingPlayhead||r._rawPrevTime===t._startTime||(r.pause(t._startTime),e&&e.apply(s||r,i||_),this._forcingPlayhead&&r.seek(n))},f=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},m=s.prototype=new e;return s.version="1.15.0",m.constructor=s,m.kill()._gc=m._forcingPlayhead=!1,m.to=function(t,e,s,r){var n=s.repeat&&u.TweenMax||i;return e?this.add(new n(t,e,s),r):this.set(t,s,r)},m.from=function(t,e,s,r){return this.add((s.repeat&&u.TweenMax||i).from(t,e,s),r)},m.fromTo=function(t,e,s,r,n){var a=r.repeat&&u.TweenMax||i;return e?this.add(a.fromTo(t,e,s,r),n):this.set(t,r,n)},m.staggerTo=function(t,e,r,n,o,h,l,_){var u,c=new s({onComplete:h,onCompleteParams:l,onCompleteScope:_,smoothChildTiming:this.smoothChildTiming});for("string"==typeof t&&(t=i.selector(t)||t),t=t||[],a(t)&&(t=f(t)),n=n||0,0>n&&(t=f(t),t.reverse(),n*=-1),u=0;t.length>u;u++)r.startAt&&(r.startAt=p(r.startAt)),c.to(t[u],e,p(r),u*n);return this.add(c,o)},m.staggerFrom=function(t,e,i,s,r,n,a,o){return i.immediateRender=0!=i.immediateRender,i.runBackwards=!0,this.staggerTo(t,e,i,s,r,n,a,o)},m.staggerFromTo=function(t,e,i,s,r,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,this.staggerTo(t,e,s,r,n,a,o,h)},m.call=function(t,e,s,r){return this.add(i.delayedCall(0,t,e,s),r)},m.set=function(t,e,s){return s=this._parseTimeOrLabel(s,0,!0),null==e.immediateRender&&(e.immediateRender=s===this._time&&!this._paused),this.add(new i(t,0,e),s)},s.exportRoot=function(t,e){t=t||{},null==t.smoothChildTiming&&(t.smoothChildTiming=!0);var r,n,a=new s(t),o=a._timeline;for(null==e&&(e=!0),o._remove(a,!0),a._startTime=0,a._rawPrevTime=a._time=a._totalTime=o._time,r=o._first;r;)n=r._next,e&&r instanceof i&&r.target===r.vars.onComplete||a.add(r,r._startTime-r._delay),r=n;return o.add(a,0),a},m.add=function(r,n,a,h){var l,_,u,p,c,f;if("number"!=typeof n&&(n=this._parseTimeOrLabel(n,0,!0,r)),!(r instanceof t)){if(r instanceof Array||r&&r.push&&o(r)){for(a=a||"normal",h=h||0,l=n,_=r.length,u=0;_>u;u++)o(p=r[u])&&(p=new s({tweens:p})),this.add(p,l),"string"!=typeof p&&"function"!=typeof p&&("sequence"===a?l=p._startTime+p.totalDuration()/p._timeScale:"start"===a&&(p._startTime-=p.delay())),l+=h;return this._uncache(!0)}if("string"==typeof r)return this.addLabel(r,n);if("function"!=typeof r)throw"Cannot add "+r+" into the timeline; it is not a tween, timeline, function, or string.";r=i.delayedCall(0,r)}if(e.prototype.add.call(this,r,n),(this._gc||this._time===this._duration)&&!this._paused&&this._duration<this.duration())for(c=this,f=c.rawTime()>r._startTime;c._timeline;)f&&c._timeline.smoothChildTiming?c.totalTime(c._totalTime,!0):c._gc&&c._enabled(!0,!1),c=c._timeline;return this},m.remove=function(e){if(e instanceof t)return this._remove(e,!1);if(e instanceof Array||e&&e.push&&o(e)){for(var i=e.length;--i>-1;)this.remove(e[i]);return this}return"string"==typeof e?this.removeLabel(e):this.kill(null,e)},m._remove=function(t,i){e.prototype._remove.call(this,t,i);var s=this._last;return s?this._time>s._startTime+s._totalDuration/s._timeScale&&(this._time=this.duration(),this._totalTime=this._totalDuration):this._time=this._totalTime=this._duration=this._totalDuration=0,this},m.append=function(t,e){return this.add(t,this._parseTimeOrLabel(null,e,!0,t))},m.insert=m.insertMultiple=function(t,e,i,s){return this.add(t,e||0,i,s)},m.appendMultiple=function(t,e,i,s){return this.add(t,this._parseTimeOrLabel(null,e,!0,t),i,s)},m.addLabel=function(t,e){return this._labels[t]=this._parseTimeOrLabel(e),this},m.addPause=function(t,e,s,r){var n=i.delayedCall(0,c,["{self}",e,s,r],this);return n.data="isPause",this.add(n,t)},m.removeLabel=function(t){return delete this._labels[t],this},m.getLabelTime=function(t){return null!=this._labels[t]?this._labels[t]:-1},m._parseTimeOrLabel=function(e,i,s,r){var n;if(r instanceof t&&r.timeline===this)this.remove(r);else if(r&&(r instanceof Array||r.push&&o(r)))for(n=r.length;--n>-1;)r[n]instanceof t&&r[n].timeline===this&&this.remove(r[n]);if("string"==typeof i)return this._parseTimeOrLabel(i,s&&"number"==typeof e&&null==this._labels[i]?e-this.duration():0,s);if(i=i||0,"string"!=typeof e||!isNaN(e)&&null==this._labels[e])null==e&&(e=this.duration());else{if(n=e.indexOf("="),-1===n)return null==this._labels[e]?s?this._labels[e]=this.duration()+i:i:this._labels[e]+i;i=parseInt(e.charAt(n-1)+"1",10)*Number(e.substr(n+1)),e=n>1?this._parseTimeOrLabel(e.substr(0,n-1),0,s):this.duration()}return Number(e)+i},m.seek=function(t,e){return this.totalTime("number"==typeof t?t:this._parseTimeOrLabel(t),e!==!1)},m.stop=function(){return this.paused(!0)},m.gotoAndPlay=function(t,e){return this.play(t,e)},m.gotoAndStop=function(t,e){return this.pause(t,e)},m.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,n,a,o,u,p=this._dirty?this.totalDuration():this._totalDuration,c=this._time,f=this._startTime,m=this._timeScale,d=this._paused;if(t>=p?(this._totalTime=this._time=p,this._reversed||this._hasPausedChild()||(n=!0,o="onComplete",0===this._duration&&(0===t||0>this._rawPrevTime||this._rawPrevTime===r)&&this._rawPrevTime!==t&&this._first&&(u=!0,this._rawPrevTime>r&&(o="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=p+1e-4):1e-7>t?(this._totalTime=this._time=0,(0!==c||0===this._duration&&this._rawPrevTime!==r&&(this._rawPrevTime>0||0>t&&this._rawPrevTime>=0))&&(o="onReverseComplete",n=this._reversed),0>t?(this._active=!1,this._rawPrevTime>=0&&this._first&&(u=!0),this._rawPrevTime=t):(this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=0,this._initted||(u=!0))):this._totalTime=this._time=this._rawPrevTime=t,this._time!==c&&this._first||i||u){if(this._initted||(this._initted=!0),this._active||!this._paused&&this._time!==c&&t>0&&(this._active=!0),0===c&&this.vars.onStart&&0!==this._time&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||_)),this._time>=c)for(s=this._first;s&&(a=s._next,!this._paused||d);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;else for(s=this._last;s&&(a=s._prev,!this._paused||d);)(s._active||c>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;this._onUpdate&&(e||(h.length&&l(),this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_))),o&&(this._gc||(f===this._startTime||m!==this._timeScale)&&(0===this._time||p>=this.totalDuration())&&(n&&(h.length&&l(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[o]&&this.vars[o].apply(this.vars[o+"Scope"]||this,this.vars[o+"Params"]||_)))}},m._hasPausedChild=function(){for(var t=this._first;t;){if(t._paused||t instanceof s&&t._hasPausedChild())return!0;t=t._next}return!1},m.getChildren=function(t,e,s,r){r=r||-9999999999;for(var n=[],a=this._first,o=0;a;)r>a._startTime||(a instanceof i?e!==!1&&(n[o++]=a):(s!==!1&&(n[o++]=a),t!==!1&&(n=n.concat(a.getChildren(!0,e,s)),o=n.length))),a=a._next;return n},m.getTweensOf=function(t,e){var s,r,n=this._gc,a=[],o=0;for(n&&this._enabled(!0,!0),s=i.getTweensOf(t),r=s.length;--r>-1;)(s[r].timeline===this||e&&this._contains(s[r]))&&(a[o++]=s[r]);return n&&this._enabled(!1,!0),a},m.recent=function(){return this._recent},m._contains=function(t){for(var e=t.timeline;e;){if(e===this)return!0;e=e.timeline}return!1},m.shiftChildren=function(t,e,i){i=i||0;for(var s,r=this._first,n=this._labels;r;)r._startTime>=i&&(r._startTime+=t),r=r._next;if(e)for(s in n)n[s]>=i&&(n[s]+=t);return this._uncache(!0)},m._kill=function(t,e){if(!t&&!e)return this._enabled(!1,!1);for(var i=e?this.getTweensOf(e):this.getChildren(!0,!0,!1),s=i.length,r=!1;--s>-1;)i[s]._kill(t,e)&&(r=!0);return r},m.clear=function(t){var e=this.getChildren(!1,!0,!0),i=e.length;for(this._time=this._totalTime=0;--i>-1;)e[i]._enabled(!1,!1);return t!==!1&&(this._labels={}),this._uncache(!0)},m.invalidate=function(){for(var e=this._first;e;)e.invalidate(),e=e._next;return t.prototype.invalidate.call(this)},m._enabled=function(t,i){if(t===this._gc)for(var s=this._first;s;)s._enabled(t,!0),s=s._next;return e.prototype._enabled.call(this,t,i)},m.totalTime=function(){this._forcingPlayhead=!0;var e=t.prototype.totalTime.apply(this,arguments);return this._forcingPlayhead=!1,e},m.duration=function(t){return arguments.length?(0!==this.duration()&&0!==t&&this.timeScale(this._duration/t),this):(this._dirty&&this.totalDuration(),this._duration)},m.totalDuration=function(t){if(!arguments.length){if(this._dirty){for(var e,i,s=0,r=this._last,n=999999999999;r;)e=r._prev,r._dirty&&r.totalDuration(),r._startTime>n&&this._sortChildren&&!r._paused?this.add(r,r._startTime-r._delay):n=r._startTime,0>r._startTime&&!r._paused&&(s-=r._startTime,this._timeline.smoothChildTiming&&(this._startTime+=r._startTime/this._timeScale),this.shiftChildren(-r._startTime,!1,-9999999999),n=0),i=r._startTime+r._totalDuration/r._timeScale,i>s&&(s=i),r=e;this._duration=this._totalDuration=s,this._dirty=!1}return this._totalDuration}return 0!==this.totalDuration()&&0!==t&&this.timeScale(this._totalDuration/t),this},m.usesFrames=function(){for(var e=this._timeline;e._timeline;)e=e._timeline;return e===t._rootFramesTimeline},m.rawTime=function(){return this._paused?this._totalTime:(this._timeline.rawTime()-this._startTime)*this._timeScale},s},!0),_gsScope._gsDefine("TimelineMax",["TimelineLite","TweenLite","easing.Ease"],function(t,e,i){var s=function(e){t.call(this,e),this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._dirty=!0},r=1e-10,n=[],a=e._internals,o=a.lazyTweens,h=a.lazyRender,l=new i(null,null,1,0),_=s.prototype=new t;return _.constructor=s,_.kill()._gc=!1,s.version="1.15.0",_.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),t.prototype.invalidate.call(this)},_.addCallback=function(t,i,s,r){return this.add(e.delayedCall(0,t,s,r),i)},_.removeCallback=function(t,e){if(t)if(null==e)this._kill(null,t);else for(var i=this.getTweensOf(t,!1),s=i.length,r=this._parseTimeOrLabel(e);--s>-1;)i[s]._startTime===r&&i[s]._enabled(!1,!1);return this},_.tweenTo=function(t,i){i=i||{};var s,r,a,o={ease:l,overwrite:i.delay?2:1,useFrames:this.usesFrames(),immediateRender:!1};for(r in i)o[r]=i[r];return o.time=this._parseTimeOrLabel(t),s=Math.abs(Number(o.time)-this._time)/this._timeScale||.001,a=new e(this,s,o),o.onStart=function(){a.target.paused(!0),a.vars.time!==a.target.time()&&s===a.duration()&&a.duration(Math.abs(a.vars.time-a.target.time())/a.target._timeScale),i.onStart&&i.onStart.apply(i.onStartScope||a,i.onStartParams||n)},a},_.tweenFromTo=function(t,e,i){i=i||{},t=this._parseTimeOrLabel(t),i.startAt={onComplete:this.seek,onCompleteParams:[t],onCompleteScope:this},i.immediateRender=i.immediateRender!==!1;var s=this.tweenTo(e,i);return s.duration(Math.abs(s.vars.time-t)/this._timeScale||.001)},_.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,a,l,_,u,p,c=this._dirty?this.totalDuration():this._totalDuration,f=this._duration,m=this._time,d=this._totalTime,g=this._startTime,v=this._timeScale,y=this._rawPrevTime,T=this._paused,w=this._cycle;if(t>=c?(this._locked||(this._totalTime=c,this._cycle=this._repeat),this._reversed||this._hasPausedChild()||(a=!0,_="onComplete",0===this._duration&&(0===t||0>y||y===r)&&y!==t&&this._first&&(u=!0,y>r&&(_="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,this._yoyo&&0!==(1&this._cycle)?this._time=t=0:(this._time=f,t=f+1e-4)):1e-7>t?(this._locked||(this._totalTime=this._cycle=0),this._time=0,(0!==m||0===f&&y!==r&&(y>0||0>t&&y>=0)&&!this._locked)&&(_="onReverseComplete",a=this._reversed),0>t?(this._active=!1,y>=0&&this._first&&(u=!0),this._rawPrevTime=t):(this._rawPrevTime=f||!e||t||this._rawPrevTime===t?t:r,t=0,this._initted||(u=!0))):(0===f&&0>y&&(u=!0),this._time=this._rawPrevTime=t,this._locked||(this._totalTime=t,0!==this._repeat&&(p=f+this._repeatDelay,this._cycle=this._totalTime/p>>0,0!==this._cycle&&this._cycle===this._totalTime/p&&this._cycle--,this._time=this._totalTime-this._cycle*p,this._yoyo&&0!==(1&this._cycle)&&(this._time=f-this._time),this._time>f?(this._time=f,t=f+1e-4):0>this._time?this._time=t=0:t=this._time))),this._cycle!==w&&!this._locked){var x=this._yoyo&&0!==(1&w),b=x===(this._yoyo&&0!==(1&this._cycle)),P=this._totalTime,S=this._cycle,k=this._rawPrevTime,R=this._time;if(this._totalTime=w*f,w>this._cycle?x=!x:this._totalTime+=f,this._time=m,this._rawPrevTime=0===f?y-1e-4:y,this._cycle=w,this._locked=!0,m=x?0:f,this.render(m,e,0===f),e||this._gc||this.vars.onRepeat&&this.vars.onRepeat.apply(this.vars.onRepeatScope||this,this.vars.onRepeatParams||n),b&&(m=x?f+1e-4:-1e-4,this.render(m,!0,!1)),this._locked=!1,this._paused&&!T)return;this._time=R,this._totalTime=P,this._cycle=S,this._rawPrevTime=k}if(!(this._time!==m&&this._first||i||u))return d!==this._totalTime&&this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n)),void 0;if(this._initted||(this._initted=!0),this._active||!this._paused&&this._totalTime!==d&&t>0&&(this._active=!0),0===d&&this.vars.onStart&&0!==this._totalTime&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||n)),this._time>=m)for(s=this._first;s&&(l=s._next,!this._paused||T);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=l;else for(s=this._last;s&&(l=s._prev,!this._paused||T);)(s._active||m>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=l;this._onUpdate&&(e||(o.length&&h(),this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n))),_&&(this._locked||this._gc||(g===this._startTime||v!==this._timeScale)&&(0===this._time||c>=this.totalDuration())&&(a&&(o.length&&h(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[_]&&this.vars[_].apply(this.vars[_+"Scope"]||this,this.vars[_+"Params"]||n)))},_.getActive=function(t,e,i){null==t&&(t=!0),null==e&&(e=!0),null==i&&(i=!1);var s,r,n=[],a=this.getChildren(t,e,i),o=0,h=a.length;for(s=0;h>s;s++)r=a[s],r.isActive()&&(n[o++]=r);return n},_.getLabelAfter=function(t){t||0!==t&&(t=this._time);var e,i=this.getLabelsArray(),s=i.length;for(e=0;s>e;e++)if(i[e].time>t)return i[e].name;return null},_.getLabelBefore=function(t){null==t&&(t=this._time);for(var e=this.getLabelsArray(),i=e.length;--i>-1;)if(t>e[i].time)return e[i].name;return null},_.getLabelsArray=function(){var t,e=[],i=0;for(t in this._labels)e[i++]={time:this._labels[t],name:t};return e.sort(function(t,e){return t.time-e.time}),e},_.progress=function(t,e){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),e):this._time/this.duration()},_.totalProgress=function(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this._totalTime/this.totalDuration()},_.totalDuration=function(e){return arguments.length?-1===this._repeat?this:this.duration((e-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(t.prototype.totalDuration.call(this),this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat),this._totalDuration)},_.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!==(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},_.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},_.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},_.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},_.currentLabel=function(t){return arguments.length?this.seek(t,!0):this.getLabelBefore(this._time+1e-8)},s},!0),function(){var t=180/Math.PI,e=[],i=[],s=[],r={},n=_gsScope._gsDefine.globals,a=function(t,e,i,s){this.a=t,this.b=e,this.c=i,this.d=s,this.da=s-t,this.ca=i-t,this.ba=e-t},o=",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",h=function(t,e,i,s){var r={a:t},n={},a={},o={c:s},h=(t+e)/2,l=(e+i)/2,_=(i+s)/2,u=(h+l)/2,p=(l+_)/2,c=(p-u)/8;return r.b=h+(t-h)/4,n.b=u+c,r.c=n.a=(r.b+n.b)/2,n.c=a.a=(u+p)/2,a.b=p-c,o.b=_+(s-_)/4,a.c=o.a=(a.b+o.b)/2,[r,n,a,o]},l=function(t,r,n,a,o){var l,_,u,p,c,f,m,d,g,v,y,T,w,x=t.length-1,b=0,P=t[0].a;for(l=0;x>l;l++)c=t[b],_=c.a,u=c.d,p=t[b+1].d,o?(y=e[l],T=i[l],w=.25*(T+y)*r/(a?.5:s[l]||.5),f=u-(u-_)*(a?.5*r:0!==y?w/y:0),m=u+(p-u)*(a?.5*r:0!==T?w/T:0),d=u-(f+((m-f)*(3*y/(y+T)+.5)/4||0))):(f=u-.5*(u-_)*r,m=u+.5*(p-u)*r,d=u-(f+m)/2),f+=d,m+=d,c.c=g=f,c.b=0!==l?P:P=c.a+.6*(c.c-c.a),c.da=u-_,c.ca=g-_,c.ba=P-_,n?(v=h(_,P,g,u),t.splice(b,1,v[0],v[1],v[2],v[3]),b+=4):b++,P=m;c=t[b],c.b=P,c.c=P+.4*(c.d-P),c.da=c.d-c.a,c.ca=c.c-c.a,c.ba=P-c.a,n&&(v=h(c.a,P,c.c,c.d),t.splice(b,1,v[0],v[1],v[2],v[3]))},_=function(t,s,r,n){var o,h,l,_,u,p,c=[];if(n)for(t=[n].concat(t),h=t.length;--h>-1;)"string"==typeof(p=t[h][s])&&"="===p.charAt(1)&&(t[h][s]=n[s]+Number(p.charAt(0)+p.substr(2)));if(o=t.length-2,0>o)return c[0]=new a(t[0][s],0,0,t[-1>o?0:1][s]),c;for(h=0;o>h;h++)l=t[h][s],_=t[h+1][s],c[h]=new a(l,0,0,_),r&&(u=t[h+2][s],e[h]=(e[h]||0)+(_-l)*(_-l),i[h]=(i[h]||0)+(u-_)*(u-_));return c[h]=new a(t[h][s],0,0,t[h+1][s]),c},u=function(t,n,a,h,u,p){var c,f,m,d,g,v,y,T,w={},x=[],b=p||t[0];u="string"==typeof u?","+u+",":o,null==n&&(n=1);for(f in t[0])x.push(f);if(t.length>1){for(T=t[t.length-1],y=!0,c=x.length;--c>-1;)if(f=x[c],Math.abs(b[f]-T[f])>.05){y=!1;break}y&&(t=t.concat(),p&&t.unshift(p),t.push(t[1]),p=t[t.length-3])}for(e.length=i.length=s.length=0,c=x.length;--c>-1;)f=x[c],r[f]=-1!==u.indexOf(","+f+","),w[f]=_(t,f,r[f],p);for(c=e.length;--c>-1;)e[c]=Math.sqrt(e[c]),i[c]=Math.sqrt(i[c]);if(!h){for(c=x.length;--c>-1;)if(r[f])for(m=w[x[c]],v=m.length-1,d=0;v>d;d++)g=m[d+1].da/i[d]+m[d].da/e[d],s[d]=(s[d]||0)+g*g;for(c=s.length;--c>-1;)s[c]=Math.sqrt(s[c])}for(c=x.length,d=a?4:1;--c>-1;)f=x[c],m=w[f],l(m,n,a,h,r[f]),y&&(m.splice(0,d),m.splice(m.length-d,d));return w},p=function(t,e,i){e=e||"soft";var s,r,n,o,h,l,_,u,p,c,f,m={},d="cubic"===e?3:2,g="soft"===e,v=[];if(g&&i&&(t=[i].concat(t)),null==t||d+1>t.length)throw"invalid Bezier data";for(p in t[0])v.push(p);for(l=v.length;--l>-1;){for(p=v[l],m[p]=h=[],c=0,u=t.length,_=0;u>_;_++)s=null==i?t[_][p]:"string"==typeof(f=t[_][p])&&"="===f.charAt(1)?i[p]+Number(f.charAt(0)+f.substr(2)):Number(f),g&&_>1&&u-1>_&&(h[c++]=(s+h[c-2])/2),h[c++]=s;for(u=c-d+1,c=0,_=0;u>_;_+=d)s=h[_],r=h[_+1],n=h[_+2],o=2===d?0:h[_+3],h[c++]=f=3===d?new a(s,r,n,o):new a(s,(2*r+s)/3,(2*r+n)/3,n);h.length=c}return m},c=function(t,e,i){for(var s,r,n,a,o,h,l,_,u,p,c,f=1/i,m=t.length;--m>-1;)for(p=t[m],n=p.a,a=p.d-n,o=p.c-n,h=p.b-n,s=r=0,_=1;i>=_;_++)l=f*_,u=1-l,s=r-(r=(l*l*a+3*u*(l*o+u*h))*l),c=m*i+_-1,e[c]=(e[c]||0)+s*s},f=function(t,e){e=e>>0||6;var i,s,r,n,a=[],o=[],h=0,l=0,_=e-1,u=[],p=[];for(i in t)c(t[i],a,e);for(r=a.length,s=0;r>s;s++)h+=Math.sqrt(a[s]),n=s%e,p[n]=h,n===_&&(l+=h,n=s/e>>0,u[n]=p,o[n]=l,h=0,p=[]);return{length:l,lengths:o,segments:u}},m=_gsScope._gsDefine.plugin({propName:"bezier",priority:-1,version:"1.3.4",API:2,global:!0,init:function(t,e,i){this._target=t,e instanceof Array&&(e={values:e}),this._func={},this._round={},this._props=[],this._timeRes=null==e.timeResolution?6:parseInt(e.timeResolution,10);var s,r,n,a,o,h=e.values||[],l={},_=h[0],c=e.autoRotate||i.vars.orientToBezier;this._autoRotate=c?c instanceof Array?c:[["x","y","rotation",c===!0?0:Number(c)||0]]:null;for(s in _)this._props.push(s);for(n=this._props.length;--n>-1;)s=this._props[n],this._overwriteProps.push(s),r=this._func[s]="function"==typeof t[s],l[s]=r?t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)]():parseFloat(t[s]),o||l[s]!==h[0][s]&&(o=l);if(this._beziers="cubic"!==e.type&&"quadratic"!==e.type&&"soft"!==e.type?u(h,isNaN(e.curviness)?1:e.curviness,!1,"thruBasic"===e.type,e.correlate,o):p(h,e.type,l),this._segCount=this._beziers[s].length,this._timeRes){var m=f(this._beziers,this._timeRes);this._length=m.length,this._lengths=m.lengths,this._segments=m.segments,this._l1=this._li=this._s1=this._si=0,this._l2=this._lengths[0],this._curSeg=this._segments[0],this._s2=this._curSeg[0],this._prec=1/this._curSeg.length}if(c=this._autoRotate)for(this._initialRotations=[],c[0]instanceof Array||(this._autoRotate=c=[c]),n=c.length;--n>-1;){for(a=0;3>a;a++)s=c[n][a],this._func[s]="function"==typeof t[s]?t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)]:!1;s=c[n][2],this._initialRotations[n]=this._func[s]?this._func[s].call(this._target):this._target[s]}return this._startRatio=i.vars.runBackwards?1:0,!0},set:function(e){var i,s,r,n,a,o,h,l,_,u,p=this._segCount,c=this._func,f=this._target,m=e!==this._startRatio;if(this._timeRes){if(_=this._lengths,u=this._curSeg,e*=this._length,r=this._li,e>this._l2&&p-1>r){for(l=p-1;l>r&&e>=(this._l2=_[++r]););this._l1=_[r-1],this._li=r,this._curSeg=u=this._segments[r],this._s2=u[this._s1=this._si=0]}else if(this._l1>e&&r>0){for(;r>0&&(this._l1=_[--r])>=e;);0===r&&this._l1>e?this._l1=0:r++,this._l2=_[r],this._li=r,this._curSeg=u=this._segments[r],this._s1=u[(this._si=u.length-1)-1]||0,this._s2=u[this._si]}if(i=r,e-=this._l1,r=this._si,e>this._s2&&u.length-1>r){for(l=u.length-1;l>r&&e>=(this._s2=u[++r]););this._s1=u[r-1],this._si=r
}else if(this._s1>e&&r>0){for(;r>0&&(this._s1=u[--r])>=e;);0===r&&this._s1>e?this._s1=0:r++,this._s2=u[r],this._si=r}o=(r+(e-this._s1)/(this._s2-this._s1))*this._prec}else i=0>e?0:e>=1?p-1:p*e>>0,o=(e-i*(1/p))*p;for(s=1-o,r=this._props.length;--r>-1;)n=this._props[r],a=this._beziers[n][i],h=(o*o*a.da+3*s*(o*a.ca+s*a.ba))*o+a.a,this._round[n]&&(h=Math.round(h)),c[n]?f[n](h):f[n]=h;if(this._autoRotate){var d,g,v,y,T,w,x,b=this._autoRotate;for(r=b.length;--r>-1;)n=b[r][2],w=b[r][3]||0,x=b[r][4]===!0?1:t,a=this._beziers[b[r][0]],d=this._beziers[b[r][1]],a&&d&&(a=a[i],d=d[i],g=a.a+(a.b-a.a)*o,y=a.b+(a.c-a.b)*o,g+=(y-g)*o,y+=(a.c+(a.d-a.c)*o-y)*o,v=d.a+(d.b-d.a)*o,T=d.b+(d.c-d.b)*o,v+=(T-v)*o,T+=(d.c+(d.d-d.c)*o-T)*o,h=m?Math.atan2(T-v,y-g)*x+w:this._initialRotations[r],c[n]?f[n](h):f[n]=h)}}}),d=m.prototype;m.bezierThrough=u,m.cubicToQuadratic=h,m._autoCSS=!0,m.quadraticToCubic=function(t,e,i){return new a(t,(2*e+t)/3,(2*e+i)/3,i)},m._cssRegister=function(){var t=n.CSSPlugin;if(t){var e=t._internals,i=e._parseToProxy,s=e._setPluginRatio,r=e.CSSPropTween;e._registerComplexSpecialProp("bezier",{parser:function(t,e,n,a,o,h){e instanceof Array&&(e={values:e}),h=new m;var l,_,u,p=e.values,c=p.length-1,f=[],d={};if(0>c)return o;for(l=0;c>=l;l++)u=i(t,p[l],a,o,h,c!==l),f[l]=u.end;for(_ in e)d[_]=e[_];return d.values=f,o=new r(t,"bezier",0,0,u.pt,2),o.data=u,o.plugin=h,o.setRatio=s,0===d.autoRotate&&(d.autoRotate=!0),!d.autoRotate||d.autoRotate instanceof Array||(l=d.autoRotate===!0?0:Number(d.autoRotate),d.autoRotate=null!=u.end.left?[["left","top","rotation",l,!1]]:null!=u.end.x?[["x","y","rotation",l,!1]]:!1),d.autoRotate&&(a._transform||a._enableTransforms(!1),u.autoRotate=a._target._gsTransform),h._onInitTween(u.proxy,d,a._tween),o}})}},d._roundProps=function(t,e){for(var i=this._overwriteProps,s=i.length;--s>-1;)(t[i[s]]||t.bezier||t.bezierThrough)&&(this._round[i[s]]=e)},d._kill=function(t){var e,i,s=this._props;for(e in this._beziers)if(e in t)for(delete this._beziers[e],delete this._func[e],i=s.length;--i>-1;)s[i]===e&&s.splice(i,1);return this._super._kill.call(this,t)}}(),_gsScope._gsDefine("plugins.CSSPlugin",["plugins.TweenPlugin","TweenLite"],function(t,e){var i,s,r,n,a=function(){t.call(this,"css"),this._overwriteProps.length=0,this.setRatio=a.prototype.setRatio},o=_gsScope._gsDefine.globals,h={},l=a.prototype=new t("css");l.constructor=a,a.version="1.15.0",a.API=2,a.defaultTransformPerspective=0,a.defaultSkewType="compensated",l="px",a.suffixMap={top:l,right:l,bottom:l,left:l,width:l,height:l,fontSize:l,padding:l,margin:l,perspective:l,lineHeight:""};var _,u,p,c,f,m,d=/(?:\d|\-\d|\.\d|\-\.\d)+/g,g=/(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,v=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,y=/(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,T=/(?:\d|\-|\+|=|#|\.)*/g,w=/opacity *= *([^)]*)/i,x=/opacity:([^;]*)/i,b=/alpha\(opacity *=.+?\)/i,P=/^(rgb|hsl)/,S=/([A-Z])/g,k=/-([a-z])/gi,R=/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,A=function(t,e){return e.toUpperCase()},C=/(?:Left|Right|Width)/i,O=/(M11|M12|M21|M22)=[\d\-\.e]+/gi,D=/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,M=/,(?=[^\)]*(?:\(|$))/gi,z=Math.PI/180,I=180/Math.PI,E={},F=document,N=function(t){return F.createElementNS?F.createElementNS("http://www.w3.org/1999/xhtml",t):F.createElement(t)},L=N("div"),X=N("img"),U=a._internals={_specialProps:h},Y=navigator.userAgent,B=function(){var t=Y.indexOf("Android"),e=N("a");return p=-1!==Y.indexOf("Safari")&&-1===Y.indexOf("Chrome")&&(-1===t||Number(Y.substr(t+8,1))>3),f=p&&6>Number(Y.substr(Y.indexOf("Version/")+8,1)),c=-1!==Y.indexOf("Firefox"),(/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(Y)||/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(Y))&&(m=parseFloat(RegExp.$1)),e?(e.style.cssText="top:1px;opacity:.55;",/^0.55/.test(e.style.opacity)):!1}(),j=function(t){return w.test("string"==typeof t?t:(t.currentStyle?t.currentStyle.filter:t.style.filter)||"")?parseFloat(RegExp.$1)/100:1},q=function(t){window.console&&console.log(t)},V="",G="",W=function(t,e){e=e||L;var i,s,r=e.style;if(void 0!==r[t])return t;for(t=t.charAt(0).toUpperCase()+t.substr(1),i=["O","Moz","ms","Ms","Webkit"],s=5;--s>-1&&void 0===r[i[s]+t];);return s>=0?(G=3===s?"ms":i[s],V="-"+G.toLowerCase()+"-",G+t):null},Z=F.defaultView?F.defaultView.getComputedStyle:function(){},Q=a.getStyle=function(t,e,i,s,r){var n;return B||"opacity"!==e?(!s&&t.style[e]?n=t.style[e]:(i=i||Z(t))?n=i[e]||i.getPropertyValue(e)||i.getPropertyValue(e.replace(S,"-$1").toLowerCase()):t.currentStyle&&(n=t.currentStyle[e]),null==r||n&&"none"!==n&&"auto"!==n&&"auto auto"!==n?n:r):j(t)},$=U.convertToPixels=function(t,i,s,r,n){if("px"===r||!r)return s;if("auto"===r||!s)return 0;var o,h,l,_=C.test(i),u=t,p=L.style,c=0>s;if(c&&(s=-s),"%"===r&&-1!==i.indexOf("border"))o=s/100*(_?t.clientWidth:t.clientHeight);else{if(p.cssText="border:0 solid red;position:"+Q(t,"position")+";line-height:0;","%"!==r&&u.appendChild)p[_?"borderLeftWidth":"borderTopWidth"]=s+r;else{if(u=t.parentNode||F.body,h=u._gsCache,l=e.ticker.frame,h&&_&&h.time===l)return h.width*s/100;p[_?"width":"height"]=s+r}u.appendChild(L),o=parseFloat(L[_?"offsetWidth":"offsetHeight"]),u.removeChild(L),_&&"%"===r&&a.cacheWidths!==!1&&(h=u._gsCache=u._gsCache||{},h.time=l,h.width=100*(o/s)),0!==o||n||(o=$(t,i,s,r,!0))}return c?-o:o},H=U.calculateOffset=function(t,e,i){if("absolute"!==Q(t,"position",i))return 0;var s="left"===e?"Left":"Top",r=Q(t,"margin"+s,i);return t["offset"+s]-($(t,e,parseFloat(r),r.replace(T,""))||0)},K=function(t,e){var i,s,r={};if(e=e||Z(t,null))if(i=e.length)for(;--i>-1;)r[e[i].replace(k,A)]=e.getPropertyValue(e[i]);else for(i in e)r[i]=e[i];else if(e=t.currentStyle||t.style)for(i in e)"string"==typeof i&&void 0===r[i]&&(r[i.replace(k,A)]=e[i]);return B||(r.opacity=j(t)),s=Me(t,e,!1),r.rotation=s.rotation,r.skewX=s.skewX,r.scaleX=s.scaleX,r.scaleY=s.scaleY,r.x=s.x,r.y=s.y,Se&&(r.z=s.z,r.rotationX=s.rotationX,r.rotationY=s.rotationY,r.scaleZ=s.scaleZ),r.filters&&delete r.filters,r},J=function(t,e,i,s,r){var n,a,o,h={},l=t.style;for(a in i)"cssText"!==a&&"length"!==a&&isNaN(a)&&(e[a]!==(n=i[a])||r&&r[a])&&-1===a.indexOf("Origin")&&("number"==typeof n||"string"==typeof n)&&(h[a]="auto"!==n||"left"!==a&&"top"!==a?""!==n&&"auto"!==n&&"none"!==n||"string"!=typeof e[a]||""===e[a].replace(y,"")?n:0:H(t,a),void 0!==l[a]&&(o=new ce(l,a,l[a],o)));if(s)for(a in s)"className"!==a&&(h[a]=s[a]);return{difs:h,firstMPT:o}},te={width:["Left","Right"],height:["Top","Bottom"]},ee=["marginLeft","marginRight","marginTop","marginBottom"],ie=function(t,e,i){var s=parseFloat("width"===e?t.offsetWidth:t.offsetHeight),r=te[e],n=r.length;for(i=i||Z(t,null);--n>-1;)s-=parseFloat(Q(t,"padding"+r[n],i,!0))||0,s-=parseFloat(Q(t,"border"+r[n]+"Width",i,!0))||0;return s},se=function(t,e){(null==t||""===t||"auto"===t||"auto auto"===t)&&(t="0 0");var i=t.split(" "),s=-1!==t.indexOf("left")?"0%":-1!==t.indexOf("right")?"100%":i[0],r=-1!==t.indexOf("top")?"0%":-1!==t.indexOf("bottom")?"100%":i[1];return null==r?r="0":"center"===r&&(r="50%"),("center"===s||isNaN(parseFloat(s))&&-1===(s+"").indexOf("="))&&(s="50%"),e&&(e.oxp=-1!==s.indexOf("%"),e.oyp=-1!==r.indexOf("%"),e.oxr="="===s.charAt(1),e.oyr="="===r.charAt(1),e.ox=parseFloat(s.replace(y,"")),e.oy=parseFloat(r.replace(y,""))),s+" "+r+(i.length>2?" "+i[2]:"")},re=function(t,e){return"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2)):parseFloat(t)-parseFloat(e)},ne=function(t,e){return null==t?e:"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2))+e:parseFloat(t)},ae=function(t,e,i,s){var r,n,a,o,h=1e-6;return null==t?o=e:"number"==typeof t?o=t:(r=360,n=t.split("_"),a=Number(n[0].replace(y,""))*(-1===t.indexOf("rad")?1:I)-("="===t.charAt(1)?0:e),n.length&&(s&&(s[i]=e+a),-1!==t.indexOf("short")&&(a%=r,a!==a%(r/2)&&(a=0>a?a+r:a-r)),-1!==t.indexOf("_cw")&&0>a?a=(a+9999999999*r)%r-(0|a/r)*r:-1!==t.indexOf("ccw")&&a>0&&(a=(a-9999999999*r)%r-(0|a/r)*r)),o=e+a),h>o&&o>-h&&(o=0),o},oe={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},he=function(t,e,i){return t=0>t?t+1:t>1?t-1:t,0|255*(1>6*t?e+6*(i-e)*t:.5>t?i:2>3*t?e+6*(i-e)*(2/3-t):e)+.5},le=a.parseColor=function(t){var e,i,s,r,n,a;return t&&""!==t?"number"==typeof t?[t>>16,255&t>>8,255&t]:(","===t.charAt(t.length-1)&&(t=t.substr(0,t.length-1)),oe[t]?oe[t]:"#"===t.charAt(0)?(4===t.length&&(e=t.charAt(1),i=t.charAt(2),s=t.charAt(3),t="#"+e+e+i+i+s+s),t=parseInt(t.substr(1),16),[t>>16,255&t>>8,255&t]):"hsl"===t.substr(0,3)?(t=t.match(d),r=Number(t[0])%360/360,n=Number(t[1])/100,a=Number(t[2])/100,i=.5>=a?a*(n+1):a+n-a*n,e=2*a-i,t.length>3&&(t[3]=Number(t[3])),t[0]=he(r+1/3,e,i),t[1]=he(r,e,i),t[2]=he(r-1/3,e,i),t):(t=t.match(d)||oe.transparent,t[0]=Number(t[0]),t[1]=Number(t[1]),t[2]=Number(t[2]),t.length>3&&(t[3]=Number(t[3])),t)):oe.black},_e="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";for(l in oe)_e+="|"+l+"\\b";_e=RegExp(_e+")","gi");var ue=function(t,e,i,s){if(null==t)return function(t){return t};var r,n=e?(t.match(_e)||[""])[0]:"",a=t.split(n).join("").match(v)||[],o=t.substr(0,t.indexOf(a[0])),h=")"===t.charAt(t.length-1)?")":"",l=-1!==t.indexOf(" ")?" ":",",_=a.length,u=_>0?a[0].replace(d,""):"";return _?r=e?function(t){var e,p,c,f;if("number"==typeof t)t+=u;else if(s&&M.test(t)){for(f=t.replace(M,"|").split("|"),c=0;f.length>c;c++)f[c]=r(f[c]);return f.join(",")}if(e=(t.match(_e)||[n])[0],p=t.split(e).join("").match(v)||[],c=p.length,_>c--)for(;_>++c;)p[c]=i?p[0|(c-1)/2]:a[c];return o+p.join(l)+l+e+h+(-1!==t.indexOf("inset")?" inset":"")}:function(t){var e,n,p;if("number"==typeof t)t+=u;else if(s&&M.test(t)){for(n=t.replace(M,"|").split("|"),p=0;n.length>p;p++)n[p]=r(n[p]);return n.join(",")}if(e=t.match(v)||[],p=e.length,_>p--)for(;_>++p;)e[p]=i?e[0|(p-1)/2]:a[p];return o+e.join(l)+h}:function(t){return t}},pe=function(t){return t=t.split(","),function(e,i,s,r,n,a,o){var h,l=(i+"").split(" ");for(o={},h=0;4>h;h++)o[t[h]]=l[h]=l[h]||l[(h-1)/2>>0];return r.parse(e,o,n,a)}},ce=(U._setPluginRatio=function(t){this.plugin.setRatio(t);for(var e,i,s,r,n=this.data,a=n.proxy,o=n.firstMPT,h=1e-6;o;)e=a[o.v],o.r?e=Math.round(e):h>e&&e>-h&&(e=0),o.t[o.p]=e,o=o._next;if(n.autoRotate&&(n.autoRotate.rotation=a.rotation),1===t)for(o=n.firstMPT;o;){if(i=o.t,i.type){if(1===i.type){for(r=i.xs0+i.s+i.xs1,s=1;i.l>s;s++)r+=i["xn"+s]+i["xs"+(s+1)];i.e=r}}else i.e=i.s+i.xs0;o=o._next}},function(t,e,i,s,r){this.t=t,this.p=e,this.v=i,this.r=r,s&&(s._prev=this,this._next=s)}),fe=(U._parseToProxy=function(t,e,i,s,r,n){var a,o,h,l,_,u=s,p={},c={},f=i._transform,m=E;for(i._transform=null,E=e,s=_=i.parse(t,e,s,r),E=m,n&&(i._transform=f,u&&(u._prev=null,u._prev&&(u._prev._next=null)));s&&s!==u;){if(1>=s.type&&(o=s.p,c[o]=s.s+s.c,p[o]=s.s,n||(l=new ce(s,"s",o,l,s.r),s.c=0),1===s.type))for(a=s.l;--a>0;)h="xn"+a,o=s.p+"_"+h,c[o]=s.data[h],p[o]=s[h],n||(l=new ce(s,h,o,l,s.rxp[h]));s=s._next}return{proxy:p,end:c,firstMPT:l,pt:_}},U.CSSPropTween=function(t,e,s,r,a,o,h,l,_,u,p){this.t=t,this.p=e,this.s=s,this.c=r,this.n=h||e,t instanceof fe||n.push(this.n),this.r=l,this.type=o||0,_&&(this.pr=_,i=!0),this.b=void 0===u?s:u,this.e=void 0===p?s+r:p,a&&(this._next=a,a._prev=this)}),me=a.parseComplex=function(t,e,i,s,r,n,a,o,h,l){i=i||n||"",a=new fe(t,e,0,0,a,l?2:1,null,!1,o,i,s),s+="";var u,p,c,f,m,v,y,T,w,x,b,S,k=i.split(", ").join(",").split(" "),R=s.split(", ").join(",").split(" "),A=k.length,C=_!==!1;for((-1!==s.indexOf(",")||-1!==i.indexOf(","))&&(k=k.join(" ").replace(M,", ").split(" "),R=R.join(" ").replace(M,", ").split(" "),A=k.length),A!==R.length&&(k=(n||"").split(" "),A=k.length),a.plugin=h,a.setRatio=l,u=0;A>u;u++)if(f=k[u],m=R[u],T=parseFloat(f),T||0===T)a.appendXtra("",T,re(m,T),m.replace(g,""),C&&-1!==m.indexOf("px"),!0);else if(r&&("#"===f.charAt(0)||oe[f]||P.test(f)))S=","===m.charAt(m.length-1)?"),":")",f=le(f),m=le(m),w=f.length+m.length>6,w&&!B&&0===m[3]?(a["xs"+a.l]+=a.l?" transparent":"transparent",a.e=a.e.split(R[u]).join("transparent")):(B||(w=!1),a.appendXtra(w?"rgba(":"rgb(",f[0],m[0]-f[0],",",!0,!0).appendXtra("",f[1],m[1]-f[1],",",!0).appendXtra("",f[2],m[2]-f[2],w?",":S,!0),w&&(f=4>f.length?1:f[3],a.appendXtra("",f,(4>m.length?1:m[3])-f,S,!1)));else if(v=f.match(d)){if(y=m.match(g),!y||y.length!==v.length)return a;for(c=0,p=0;v.length>p;p++)b=v[p],x=f.indexOf(b,c),a.appendXtra(f.substr(c,x-c),Number(b),re(y[p],b),"",C&&"px"===f.substr(x+b.length,2),0===p),c=x+b.length;a["xs"+a.l]+=f.substr(c)}else a["xs"+a.l]+=a.l?" "+f:f;if(-1!==s.indexOf("=")&&a.data){for(S=a.xs0+a.data.s,u=1;a.l>u;u++)S+=a["xs"+u]+a.data["xn"+u];a.e=S+a["xs"+u]}return a.l||(a.type=-1,a.xs0=a.e),a.xfirst||a},de=9;for(l=fe.prototype,l.l=l.pr=0;--de>0;)l["xn"+de]=0,l["xs"+de]="";l.xs0="",l._next=l._prev=l.xfirst=l.data=l.plugin=l.setRatio=l.rxp=null,l.appendXtra=function(t,e,i,s,r,n){var a=this,o=a.l;return a["xs"+o]+=n&&o?" "+t:t||"",i||0===o||a.plugin?(a.l++,a.type=a.setRatio?2:1,a["xs"+a.l]=s||"",o>0?(a.data["xn"+o]=e+i,a.rxp["xn"+o]=r,a["xn"+o]=e,a.plugin||(a.xfirst=new fe(a,"xn"+o,e,i,a.xfirst||a,0,a.n,r,a.pr),a.xfirst.xs0=0),a):(a.data={s:e+i},a.rxp={},a.s=e,a.c=i,a.r=r,a)):(a["xs"+o]+=e+(s||""),a)};var ge=function(t,e){e=e||{},this.p=e.prefix?W(t)||t:t,h[t]=h[this.p]=this,this.format=e.formatter||ue(e.defaultValue,e.color,e.collapsible,e.multi),e.parser&&(this.parse=e.parser),this.clrs=e.color,this.multi=e.multi,this.keyword=e.keyword,this.dflt=e.defaultValue,this.pr=e.priority||0},ve=U._registerComplexSpecialProp=function(t,e,i){"object"!=typeof e&&(e={parser:i});var s,r,n=t.split(","),a=e.defaultValue;for(i=i||[a],s=0;n.length>s;s++)e.prefix=0===s&&e.prefix,e.defaultValue=i[s]||a,r=new ge(n[s],e)},ye=function(t){if(!h[t]){var e=t.charAt(0).toUpperCase()+t.substr(1)+"Plugin";ve(t,{parser:function(t,i,s,r,n,a,l){var _=o.com.greensock.plugins[e];return _?(_._cssRegister(),h[s].parse(t,i,s,r,n,a,l)):(q("Error: "+e+" js file not loaded."),n)}})}};l=ge.prototype,l.parseComplex=function(t,e,i,s,r,n){var a,o,h,l,_,u,p=this.keyword;if(this.multi&&(M.test(i)||M.test(e)?(o=e.replace(M,"|").split("|"),h=i.replace(M,"|").split("|")):p&&(o=[e],h=[i])),h){for(l=h.length>o.length?h.length:o.length,a=0;l>a;a++)e=o[a]=o[a]||this.dflt,i=h[a]=h[a]||this.dflt,p&&(_=e.indexOf(p),u=i.indexOf(p),_!==u&&(i=-1===u?h:o,i[a]+=" "+p));e=o.join(", "),i=h.join(", ")}return me(t,this.p,e,i,this.clrs,this.dflt,s,this.pr,r,n)},l.parse=function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(Q(t,this.p,r,!1,this.dflt)),this.format(e),n,a)},a.registerSpecialProp=function(t,e,i){ve(t,{parser:function(t,s,r,n,a,o){var h=new fe(t,r,0,0,a,2,r,!1,i);return h.plugin=o,h.setRatio=e(t,s,n._tween,r),h},priority:i})};var Te,we="scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),xe=W("transform"),be=V+"transform",Pe=W("transformOrigin"),Se=null!==W("perspective"),ke=U.Transform=function(){this.perspective=parseFloat(a.defaultTransformPerspective)||0,this.force3D=a.defaultForce3D!==!1&&Se?a.defaultForce3D||"auto":!1},Re=window.SVGElement,Ae=function(t,e,i){var s,r=F.createElementNS("http://www.w3.org/2000/svg",t),n=/([a-z])([A-Z])/g;for(s in i)r.setAttributeNS(null,s.replace(n,"$1-$2").toLowerCase(),i[s]);return e.appendChild(r),r},Ce=document.documentElement,Oe=function(){var t,e,i,s=m||/Android/i.test(Y)&&!window.chrome;return F.createElementNS&&!s&&(t=Ae("svg",Ce),e=Ae("rect",t,{width:100,height:50,x:100}),i=e.getBoundingClientRect().width,e.style[Pe]="50% 50%",e.style[xe]="scaleX(0.5)",s=i===e.getBoundingClientRect().width,Ce.removeChild(t)),s}(),De=function(t,e,i){var s=t.getBBox();e=se(e).split(" "),i.xOrigin=(-1!==e[0].indexOf("%")?parseFloat(e[0])/100*s.width:parseFloat(e[0]))+s.x,i.yOrigin=(-1!==e[1].indexOf("%")?parseFloat(e[1])/100*s.height:parseFloat(e[1]))+s.y},Me=U.getTransform=function(t,e,i,s){if(t._gsTransform&&i&&!s)return t._gsTransform;var n,o,h,l,_,u,p,c,f,m,d=i?t._gsTransform||new ke:new ke,g=0>d.scaleX,v=2e-5,y=1e5,T=Se?parseFloat(Q(t,Pe,e,!1,"0 0 0").split(" ")[2])||d.zOrigin||0:0,w=parseFloat(a.defaultTransformPerspective)||0;if(xe?o=Q(t,be,e,!0):t.currentStyle&&(o=t.currentStyle.filter.match(O),o=o&&4===o.length?[o[0].substr(4),Number(o[2].substr(4)),Number(o[1].substr(4)),o[3].substr(4),d.x||0,d.y||0].join(","):""),n=!o||"none"===o||"matrix(1, 0, 0, 1, 0, 0)"===o,d.svg=!!(Re&&"function"==typeof t.getBBox&&t.getCTM&&(!t.parentNode||t.parentNode.getBBox&&t.parentNode.getCTM)),d.svg&&(De(t,Q(t,Pe,r,!1,"50% 50%")+"",d),Te=a.useSVGTransformAttr||Oe,h=t.getAttribute("transform"),n&&h&&-1!==h.indexOf("matrix")&&(o=h,n=0)),!n){for(h=(o||"").match(/(?:\-|\b)[\d\-\.e]+\b/gi)||[],l=h.length;--l>-1;)_=Number(h[l]),h[l]=(u=_-(_|=0))?(0|u*y+(0>u?-.5:.5))/y+_:_;if(16===h.length){var x=h[8],b=h[9],P=h[10],S=h[12],k=h[13],R=h[14];d.zOrigin&&(R=-d.zOrigin,S=x*R-h[12],k=b*R-h[13],R=P*R+d.zOrigin-h[14]);var A,C,D,M,z,E=h[0],F=h[1],N=h[2],L=h[3],X=h[4],U=h[5],Y=h[6],B=h[7],j=h[11],q=Math.atan2(F,U);d.rotation=q*I,q&&(M=Math.cos(-q),z=Math.sin(-q),E=E*M+X*z,C=F*M+U*z,U=F*-z+U*M,Y=N*-z+Y*M,F=C),q=Math.atan2(x,E),d.rotationY=q*I,q&&(M=Math.cos(-q),z=Math.sin(-q),A=E*M-x*z,C=F*M-b*z,D=N*M-P*z,b=F*z+b*M,P=N*z+P*M,j=L*z+j*M,E=A,F=C,N=D),q=Math.atan2(Y,P),d.rotationX=q*I,q&&(M=Math.cos(-q),z=Math.sin(-q),A=X*M+x*z,C=U*M+b*z,D=Y*M+P*z,x=X*-z+x*M,b=U*-z+b*M,P=Y*-z+P*M,j=B*-z+j*M,X=A,U=C,Y=D),d.scaleX=(0|Math.sqrt(E*E+F*F)*y+.5)/y,d.scaleY=(0|Math.sqrt(U*U+b*b)*y+.5)/y,d.scaleZ=(0|Math.sqrt(Y*Y+P*P)*y+.5)/y,d.skewX=0,d.perspective=j?1/(0>j?-j:j):0,d.x=S,d.y=k,d.z=R}else if(!(Se&&!s&&h.length&&d.x===h[4]&&d.y===h[5]&&(d.rotationX||d.rotationY)||void 0!==d.x&&"none"===Q(t,"display",e))){var V=h.length>=6,G=V?h[0]:1,W=h[1]||0,Z=h[2]||0,$=V?h[3]:1;d.x=h[4]||0,d.y=h[5]||0,p=Math.sqrt(G*G+W*W),c=Math.sqrt($*$+Z*Z),f=G||W?Math.atan2(W,G)*I:d.rotation||0,m=Z||$?Math.atan2(Z,$)*I+f:d.skewX||0,Math.abs(m)>90&&270>Math.abs(m)&&(g?(p*=-1,m+=0>=f?180:-180,f+=0>=f?180:-180):(c*=-1,m+=0>=m?180:-180)),d.scaleX=p,d.scaleY=c,d.rotation=f,d.skewX=m,Se&&(d.rotationX=d.rotationY=d.z=0,d.perspective=w,d.scaleZ=1)}d.zOrigin=T;for(l in d)v>d[l]&&d[l]>-v&&(d[l]=0)}return i&&(t._gsTransform=d),d},ze=function(t){var e,i,s=this.data,r=-s.rotation*z,n=r+s.skewX*z,a=1e5,o=(0|Math.cos(r)*s.scaleX*a)/a,h=(0|Math.sin(r)*s.scaleX*a)/a,l=(0|Math.sin(n)*-s.scaleY*a)/a,_=(0|Math.cos(n)*s.scaleY*a)/a,u=this.t.style,p=this.t.currentStyle;if(p){i=h,h=-l,l=-i,e=p.filter,u.filter="";var c,f,d=this.t.offsetWidth,g=this.t.offsetHeight,v="absolute"!==p.position,y="progid:DXImageTransform.Microsoft.Matrix(M11="+o+", M12="+h+", M21="+l+", M22="+_,x=s.x+d*s.xPercent/100,b=s.y+g*s.yPercent/100;if(null!=s.ox&&(c=(s.oxp?.01*d*s.ox:s.ox)-d/2,f=(s.oyp?.01*g*s.oy:s.oy)-g/2,x+=c-(c*o+f*h),b+=f-(c*l+f*_)),v?(c=d/2,f=g/2,y+=", Dx="+(c-(c*o+f*h)+x)+", Dy="+(f-(c*l+f*_)+b)+")"):y+=", sizingMethod='auto expand')",u.filter=-1!==e.indexOf("DXImageTransform.Microsoft.Matrix(")?e.replace(D,y):y+" "+e,(0===t||1===t)&&1===o&&0===h&&0===l&&1===_&&(v&&-1===y.indexOf("Dx=0, Dy=0")||w.test(e)&&100!==parseFloat(RegExp.$1)||-1===e.indexOf("gradient("&&e.indexOf("Alpha"))&&u.removeAttribute("filter")),!v){var P,S,k,R=8>m?1:-1;for(c=s.ieOffsetX||0,f=s.ieOffsetY||0,s.ieOffsetX=Math.round((d-((0>o?-o:o)*d+(0>h?-h:h)*g))/2+x),s.ieOffsetY=Math.round((g-((0>_?-_:_)*g+(0>l?-l:l)*d))/2+b),de=0;4>de;de++)S=ee[de],P=p[S],i=-1!==P.indexOf("px")?parseFloat(P):$(this.t,S,parseFloat(P),P.replace(T,""))||0,k=i!==s[S]?2>de?-s.ieOffsetX:-s.ieOffsetY:2>de?c-s.ieOffsetX:f-s.ieOffsetY,u[S]=(s[S]=Math.round(i-k*(0===de||2===de?1:R)))+"px"}}},Ie=U.set3DTransformRatio=function(t){var e,i,s,r,n,a,o,h,l,_,u,p,f,m,d,g,v,y,T,w,x,b,P,S,k,R=this.data,A=this.t.style,C=R.rotation*z,O=R.scaleX,D=R.scaleY,M=R.scaleZ,I=R.x,E=R.y,F=R.z,N=R.perspective;if(!(1!==t&&0!==t||"auto"!==R.force3D||R.rotationY||R.rotationX||1!==M||N||F))return Ee.call(this,t),void 0;if(c){var L=1e-4;L>O&&O>-L&&(O=M=2e-5),L>D&&D>-L&&(D=M=2e-5),!N||R.z||R.rotationX||R.rotationY||(N=0)}if(C||R.skewX)y=Math.cos(C),T=Math.sin(C),e=y,n=T,R.skewX&&(C-=R.skewX*z,y=Math.cos(C),T=Math.sin(C),"simple"===R.skewType&&(w=Math.tan(R.skewX*z),w=Math.sqrt(1+w*w),y*=w,T*=w)),i=-T,a=y;else{if(!(R.rotationY||R.rotationX||1!==M||N||R.svg))return A[xe]=(R.xPercent||R.yPercent?"translate("+R.xPercent+"%,"+R.yPercent+"%) translate3d(":"translate3d(")+I+"px,"+E+"px,"+F+"px)"+(1!==O||1!==D?" scale("+O+","+D+")":""),void 0;e=a=1,i=n=0}u=1,s=r=o=h=l=_=p=f=m=0,d=N?-1/N:0,g=R.zOrigin,v=1e5,k=",",C=R.rotationY*z,C&&(y=Math.cos(C),T=Math.sin(C),l=u*-T,f=d*-T,s=e*T,o=n*T,u*=y,d*=y,e*=y,n*=y),C=R.rotationX*z,C&&(y=Math.cos(C),T=Math.sin(C),w=i*y+s*T,x=a*y+o*T,b=_*y+u*T,P=m*y+d*T,s=i*-T+s*y,o=a*-T+o*y,u=_*-T+u*y,d=m*-T+d*y,i=w,a=x,_=b,m=P),1!==M&&(s*=M,o*=M,u*=M,d*=M),1!==D&&(i*=D,a*=D,_*=D,m*=D),1!==O&&(e*=O,n*=O,l*=O,f*=O),g&&(p-=g,r=s*p,h=o*p,p=u*p+g),R.svg&&(r+=R.xOrigin-(R.xOrigin*e+R.yOrigin*i),h+=R.yOrigin-(R.xOrigin*n+R.yOrigin*a)),r=(w=(r+=I)-(r|=0))?(0|w*v+(0>w?-.5:.5))/v+r:r,h=(w=(h+=E)-(h|=0))?(0|w*v+(0>w?-.5:.5))/v+h:h,p=(w=(p+=F)-(p|=0))?(0|w*v+(0>w?-.5:.5))/v+p:p,S=R.xPercent||R.yPercent?"translate("+R.xPercent+"%,"+R.yPercent+"%) matrix3d(":"matrix3d(",S+=(0|e*v)/v+k+(0|n*v)/v+k+(0|l*v)/v,S+=k+(0|f*v)/v+k+(0|i*v)/v+k+(0|a*v)/v,S+=k+(0|_*v)/v+k+(0|m*v)/v+k+(0|s*v)/v,S+=k+(0|o*v)/v+k+(0|u*v)/v+k+(0|d*v)/v,S+=k+r+k+h+k+p+k+(N?1+-p/N:1)+")",A[xe]=S},Ee=U.set2DTransformRatio=function(t){var e,i,s,r,n,a,o,h,l,_,u,p=this.data,c=this.t,f=c.style,m=p.x,d=p.y;return!(p.rotationX||p.rotationY||p.z||p.force3D===!0||"auto"===p.force3D&&1!==t&&0!==t)||p.svg&&Te||!Se?(r=p.scaleX,n=p.scaleY,p.rotation||p.skewX||p.svg?(e=p.rotation*z,i=e-p.skewX*z,s=1e5,a=Math.cos(e)*r,o=Math.sin(e)*r,h=Math.sin(i)*-n,l=Math.cos(i)*n,p.svg&&(m+=p.xOrigin-(p.xOrigin*a+p.yOrigin*h),d+=p.yOrigin-(p.xOrigin*o+p.yOrigin*l),u=1e-6,u>m&&m>-u&&(m=0),u>d&&d>-u&&(d=0)),_=(0|a*s)/s+","+(0|o*s)/s+","+(0|h*s)/s+","+(0|l*s)/s+","+m+","+d+")",p.svg&&Te?c.setAttribute("transform","matrix("+_):f[xe]=(p.xPercent||p.yPercent?"translate("+p.xPercent+"%,"+p.yPercent+"%) matrix(":"matrix(")+_):f[xe]=(p.xPercent||p.yPercent?"translate("+p.xPercent+"%,"+p.yPercent+"%) matrix(":"matrix(")+r+",0,0,"+n+","+m+","+d+")",void 0):(this.setRatio=Ie,Ie.call(this,t),void 0)};l=ke.prototype,l.x=l.y=l.z=l.skewX=l.skewY=l.rotation=l.rotationX=l.rotationY=l.zOrigin=l.xPercent=l.yPercent=0,l.scaleX=l.scaleY=l.scaleZ=1,ve("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent",{parser:function(t,e,i,s,n,o,h){if(s._lastParsedTransform===h)return n;s._lastParsedTransform=h;var l,_,u,p,c,f,m,d=s._transform=Me(t,r,!0,h.parseTransform),g=t.style,v=1e-6,y=we.length,T=h,w={};if("string"==typeof T.transform&&xe)u=L.style,u[xe]=T.transform,u.display="block",u.position="absolute",F.body.appendChild(L),l=Me(L,null,!1),F.body.removeChild(L);else if("object"==typeof T){if(l={scaleX:ne(null!=T.scaleX?T.scaleX:T.scale,d.scaleX),scaleY:ne(null!=T.scaleY?T.scaleY:T.scale,d.scaleY),scaleZ:ne(T.scaleZ,d.scaleZ),x:ne(T.x,d.x),y:ne(T.y,d.y),z:ne(T.z,d.z),xPercent:ne(T.xPercent,d.xPercent),yPercent:ne(T.yPercent,d.yPercent),perspective:ne(T.transformPerspective,d.perspective)},m=T.directionalRotation,null!=m)if("object"==typeof m)for(u in m)T[u]=m[u];else T.rotation=m;"string"==typeof T.x&&-1!==T.x.indexOf("%")&&(l.x=0,l.xPercent=ne(T.x,d.xPercent)),"string"==typeof T.y&&-1!==T.y.indexOf("%")&&(l.y=0,l.yPercent=ne(T.y,d.yPercent)),l.rotation=ae("rotation"in T?T.rotation:"shortRotation"in T?T.shortRotation+"_short":"rotationZ"in T?T.rotationZ:d.rotation,d.rotation,"rotation",w),Se&&(l.rotationX=ae("rotationX"in T?T.rotationX:"shortRotationX"in T?T.shortRotationX+"_short":d.rotationX||0,d.rotationX,"rotationX",w),l.rotationY=ae("rotationY"in T?T.rotationY:"shortRotationY"in T?T.shortRotationY+"_short":d.rotationY||0,d.rotationY,"rotationY",w)),l.skewX=null==T.skewX?d.skewX:ae(T.skewX,d.skewX),l.skewY=null==T.skewY?d.skewY:ae(T.skewY,d.skewY),(_=l.skewY-d.skewY)&&(l.skewX+=_,l.rotation+=_)}for(Se&&null!=T.force3D&&(d.force3D=T.force3D,f=!0),d.skewType=T.skewType||d.skewType||a.defaultSkewType,c=d.force3D||d.z||d.rotationX||d.rotationY||l.z||l.rotationX||l.rotationY||l.perspective,c||null==T.scale||(l.scaleZ=1);--y>-1;)i=we[y],p=l[i]-d[i],(p>v||-v>p||null!=T[i]||null!=E[i])&&(f=!0,n=new fe(d,i,d[i],p,n),i in w&&(n.e=w[i]),n.xs0=0,n.plugin=o,s._overwriteProps.push(n.n));return p=T.transformOrigin,p&&d.svg&&(De(t,p,l),n=new fe(d,"xOrigin",d.xOrigin,l.xOrigin-d.xOrigin,n,-1,"transformOrigin"),n.b=d.xOrigin,n.e=n.xs0=l.xOrigin,n=new fe(d,"yOrigin",d.yOrigin,l.yOrigin-d.yOrigin,n,-1,"transformOrigin"),n.b=d.yOrigin,n.e=n.xs0=l.yOrigin,p="0px 0px"),(p||Se&&c&&d.zOrigin)&&(xe?(f=!0,i=Pe,p=(p||Q(t,i,r,!1,"50% 50%"))+"",n=new fe(g,i,0,0,n,-1,"transformOrigin"),n.b=g[i],n.plugin=o,Se?(u=d.zOrigin,p=p.split(" "),d.zOrigin=(p.length>2&&(0===u||"0px"!==p[2])?parseFloat(p[2]):u)||0,n.xs0=n.e=p[0]+" "+(p[1]||"50%")+" 0px",n=new fe(d,"zOrigin",0,0,n,-1,n.n),n.b=u,n.xs0=n.e=d.zOrigin):n.xs0=n.e=p):se(p+"",d)),f&&(s._transformType=d.svg&&Te||!c&&3!==this._transformType?2:3),n},prefix:!0}),ve("boxShadow",{defaultValue:"0px 0px 0px 0px #999",prefix:!0,color:!0,multi:!0,keyword:"inset"}),ve("borderRadius",{defaultValue:"0px",parser:function(t,e,i,n,a){e=this.format(e);var o,h,l,_,u,p,c,f,m,d,g,v,y,T,w,x,b=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],P=t.style;for(m=parseFloat(t.offsetWidth),d=parseFloat(t.offsetHeight),o=e.split(" "),h=0;b.length>h;h++)this.p.indexOf("border")&&(b[h]=W(b[h])),u=_=Q(t,b[h],r,!1,"0px"),-1!==u.indexOf(" ")&&(_=u.split(" "),u=_[0],_=_[1]),p=l=o[h],c=parseFloat(u),v=u.substr((c+"").length),y="="===p.charAt(1),y?(f=parseInt(p.charAt(0)+"1",10),p=p.substr(2),f*=parseFloat(p),g=p.substr((f+"").length-(0>f?1:0))||""):(f=parseFloat(p),g=p.substr((f+"").length)),""===g&&(g=s[i]||v),g!==v&&(T=$(t,"borderLeft",c,v),w=$(t,"borderTop",c,v),"%"===g?(u=100*(T/m)+"%",_=100*(w/d)+"%"):"em"===g?(x=$(t,"borderLeft",1,"em"),u=T/x+"em",_=w/x+"em"):(u=T+"px",_=w+"px"),y&&(p=parseFloat(u)+f+g,l=parseFloat(_)+f+g)),a=me(P,b[h],u+" "+_,p+" "+l,!1,"0px",a);return a},prefix:!0,formatter:ue("0px 0px 0px 0px",!1,!0)}),ve("backgroundPosition",{defaultValue:"0 0",parser:function(t,e,i,s,n,a){var o,h,l,_,u,p,c="background-position",f=r||Z(t,null),d=this.format((f?m?f.getPropertyValue(c+"-x")+" "+f.getPropertyValue(c+"-y"):f.getPropertyValue(c):t.currentStyle.backgroundPositionX+" "+t.currentStyle.backgroundPositionY)||"0 0"),g=this.format(e);if(-1!==d.indexOf("%")!=(-1!==g.indexOf("%"))&&(p=Q(t,"backgroundImage").replace(R,""),p&&"none"!==p)){for(o=d.split(" "),h=g.split(" "),X.setAttribute("src",p),l=2;--l>-1;)d=o[l],_=-1!==d.indexOf("%"),_!==(-1!==h[l].indexOf("%"))&&(u=0===l?t.offsetWidth-X.width:t.offsetHeight-X.height,o[l]=_?parseFloat(d)/100*u+"px":100*(parseFloat(d)/u)+"%");d=o.join(" ")}return this.parseComplex(t.style,d,g,n,a)},formatter:se}),ve("backgroundSize",{defaultValue:"0 0",formatter:se}),ve("perspective",{defaultValue:"0px",prefix:!0}),ve("perspectiveOrigin",{defaultValue:"50% 50%",prefix:!0}),ve("transformStyle",{prefix:!0}),ve("backfaceVisibility",{prefix:!0}),ve("userSelect",{prefix:!0}),ve("margin",{parser:pe("marginTop,marginRight,marginBottom,marginLeft")}),ve("padding",{parser:pe("paddingTop,paddingRight,paddingBottom,paddingLeft")}),ve("clip",{defaultValue:"rect(0px,0px,0px,0px)",parser:function(t,e,i,s,n,a){var o,h,l;return 9>m?(h=t.currentStyle,l=8>m?" ":",",o="rect("+h.clipTop+l+h.clipRight+l+h.clipBottom+l+h.clipLeft+")",e=this.format(e).split(",").join(l)):(o=this.format(Q(t,this.p,r,!1,this.dflt)),e=this.format(e)),this.parseComplex(t.style,o,e,n,a)}}),ve("textShadow",{defaultValue:"0px 0px 0px #999",color:!0,multi:!0}),ve("autoRound,strictUnits",{parser:function(t,e,i,s,r){return r}}),ve("border",{defaultValue:"0px solid #000",parser:function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(Q(t,"borderTopWidth",r,!1,"0px")+" "+Q(t,"borderTopStyle",r,!1,"solid")+" "+Q(t,"borderTopColor",r,!1,"#000")),this.format(e),n,a)},color:!0,formatter:function(t){var e=t.split(" ");return e[0]+" "+(e[1]||"solid")+" "+(t.match(_e)||["#000"])[0]}}),ve("borderWidth",{parser:pe("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}),ve("float,cssFloat,styleFloat",{parser:function(t,e,i,s,r){var n=t.style,a="cssFloat"in n?"cssFloat":"styleFloat";return new fe(n,a,0,0,r,-1,i,!1,0,n[a],e)}});var Fe=function(t){var e,i=this.t,s=i.filter||Q(this.data,"filter")||"",r=0|this.s+this.c*t;100===r&&(-1===s.indexOf("atrix(")&&-1===s.indexOf("radient(")&&-1===s.indexOf("oader(")?(i.removeAttribute("filter"),e=!Q(this.data,"filter")):(i.filter=s.replace(b,""),e=!0)),e||(this.xn1&&(i.filter=s=s||"alpha(opacity="+r+")"),-1===s.indexOf("pacity")?0===r&&this.xn1||(i.filter=s+" alpha(opacity="+r+")"):i.filter=s.replace(w,"opacity="+r))};ve("opacity,alpha,autoAlpha",{defaultValue:"1",parser:function(t,e,i,s,n,a){var o=parseFloat(Q(t,"opacity",r,!1,"1")),h=t.style,l="autoAlpha"===i;return"string"==typeof e&&"="===e.charAt(1)&&(e=("-"===e.charAt(0)?-1:1)*parseFloat(e.substr(2))+o),l&&1===o&&"hidden"===Q(t,"visibility",r)&&0!==e&&(o=0),B?n=new fe(h,"opacity",o,e-o,n):(n=new fe(h,"opacity",100*o,100*(e-o),n),n.xn1=l?1:0,h.zoom=1,n.type=2,n.b="alpha(opacity="+n.s+")",n.e="alpha(opacity="+(n.s+n.c)+")",n.data=t,n.plugin=a,n.setRatio=Fe),l&&(n=new fe(h,"visibility",0,0,n,-1,null,!1,0,0!==o?"inherit":"hidden",0===e?"hidden":"inherit"),n.xs0="inherit",s._overwriteProps.push(n.n),s._overwriteProps.push(i)),n}});var Ne=function(t,e){e&&(t.removeProperty?("ms"===e.substr(0,2)&&(e="M"+e.substr(1)),t.removeProperty(e.replace(S,"-$1").toLowerCase())):t.removeAttribute(e))},Le=function(t){if(this.t._gsClassPT=this,1===t||0===t){this.t.setAttribute("class",0===t?this.b:this.e);for(var e=this.data,i=this.t.style;e;)e.v?i[e.p]=e.v:Ne(i,e.p),e=e._next;1===t&&this.t._gsClassPT===this&&(this.t._gsClassPT=null)}else this.t.getAttribute("class")!==this.e&&this.t.setAttribute("class",this.e)};ve("className",{parser:function(t,e,s,n,a,o,h){var l,_,u,p,c,f=t.getAttribute("class")||"",m=t.style.cssText;if(a=n._classNamePT=new fe(t,s,0,0,a,2),a.setRatio=Le,a.pr=-11,i=!0,a.b=f,_=K(t,r),u=t._gsClassPT){for(p={},c=u.data;c;)p[c.p]=1,c=c._next;u.setRatio(1)}return t._gsClassPT=a,a.e="="!==e.charAt(1)?e:f.replace(RegExp("\\s*\\b"+e.substr(2)+"\\b"),"")+("+"===e.charAt(0)?" "+e.substr(2):""),n._tween._duration&&(t.setAttribute("class",a.e),l=J(t,_,K(t),h,p),t.setAttribute("class",f),a.data=l.firstMPT,t.style.cssText=m,a=a.xfirst=n.parse(t,l.difs,a,o)),a}});var Xe=function(t){if((1===t||0===t)&&this.data._totalTime===this.data._totalDuration&&"isFromStart"!==this.data.data){var e,i,s,r,n=this.t.style,a=h.transform.parse;if("all"===this.e)n.cssText="",r=!0;else for(e=this.e.split(" ").join("").split(","),s=e.length;--s>-1;)i=e[s],h[i]&&(h[i].parse===a?r=!0:i="transformOrigin"===i?Pe:h[i].p),Ne(n,i);r&&(Ne(n,xe),this.t._gsTransform&&delete this.t._gsTransform)}};for(ve("clearProps",{parser:function(t,e,s,r,n){return n=new fe(t,s,0,0,n,2),n.setRatio=Xe,n.e=e,n.pr=-10,n.data=r._tween,i=!0,n}}),l="bezier,throwProps,physicsProps,physics2D".split(","),de=l.length;de--;)ye(l[de]);l=a.prototype,l._firstPT=l._lastParsedTransform=l._transform=null,l._onInitTween=function(t,e,o){if(!t.nodeType)return!1;this._target=t,this._tween=o,this._vars=e,_=e.autoRound,i=!1,s=e.suffixMap||a.suffixMap,r=Z(t,""),n=this._overwriteProps;var h,l,c,m,d,g,v,y,T,w=t.style;if(u&&""===w.zIndex&&(h=Q(t,"zIndex",r),("auto"===h||""===h)&&this._addLazySet(w,"zIndex",0)),"string"==typeof e&&(m=w.cssText,h=K(t,r),w.cssText=m+";"+e,h=J(t,h,K(t)).difs,!B&&x.test(e)&&(h.opacity=parseFloat(RegExp.$1)),e=h,w.cssText=m),this._firstPT=l=this.parse(t,e,null),this._transformType){for(T=3===this._transformType,xe?p&&(u=!0,""===w.zIndex&&(v=Q(t,"zIndex",r),("auto"===v||""===v)&&this._addLazySet(w,"zIndex",0)),f&&this._addLazySet(w,"WebkitBackfaceVisibility",this._vars.WebkitBackfaceVisibility||(T?"visible":"hidden"))):w.zoom=1,c=l;c&&c._next;)c=c._next;
y=new fe(t,"transform",0,0,null,2),this._linkCSSP(y,null,c),y.setRatio=T&&Se?Ie:xe?Ee:ze,y.data=this._transform||Me(t,r,!0),n.pop()}if(i){for(;l;){for(g=l._next,c=m;c&&c.pr>l.pr;)c=c._next;(l._prev=c?c._prev:d)?l._prev._next=l:m=l,(l._next=c)?c._prev=l:d=l,l=g}this._firstPT=m}return!0},l.parse=function(t,e,i,n){var a,o,l,u,p,c,f,m,d,g,v=t.style;for(a in e)c=e[a],o=h[a],o?i=o.parse(t,c,a,this,i,n,e):(p=Q(t,a,r)+"",d="string"==typeof c,"color"===a||"fill"===a||"stroke"===a||-1!==a.indexOf("Color")||d&&P.test(c)?(d||(c=le(c),c=(c.length>3?"rgba(":"rgb(")+c.join(",")+")"),i=me(v,a,p,c,!0,"transparent",i,0,n)):!d||-1===c.indexOf(" ")&&-1===c.indexOf(",")?(l=parseFloat(p),f=l||0===l?p.substr((l+"").length):"",(""===p||"auto"===p)&&("width"===a||"height"===a?(l=ie(t,a,r),f="px"):"left"===a||"top"===a?(l=H(t,a,r),f="px"):(l="opacity"!==a?0:1,f="")),g=d&&"="===c.charAt(1),g?(u=parseInt(c.charAt(0)+"1",10),c=c.substr(2),u*=parseFloat(c),m=c.replace(T,"")):(u=parseFloat(c),m=d?c.substr((u+"").length)||"":""),""===m&&(m=a in s?s[a]:f),c=u||0===u?(g?u+l:u)+m:e[a],f!==m&&""!==m&&(u||0===u)&&l&&(l=$(t,a,l,f),"%"===m?(l/=$(t,a,100,"%")/100,e.strictUnits!==!0&&(p=l+"%")):"em"===m?l/=$(t,a,1,"em"):"px"!==m&&(u=$(t,a,u,m),m="px"),g&&(u||0===u)&&(c=u+l+m)),g&&(u+=l),!l&&0!==l||!u&&0!==u?void 0!==v[a]&&(c||"NaN"!=c+""&&null!=c)?(i=new fe(v,a,u||l||0,0,i,-1,a,!1,0,p,c),i.xs0="none"!==c||"display"!==a&&-1===a.indexOf("Style")?c:p):q("invalid "+a+" tween value: "+e[a]):(i=new fe(v,a,l,u-l,i,0,a,_!==!1&&("px"===m||"zIndex"===a),0,p,c),i.xs0=m)):i=me(v,a,p,c,!0,null,i,0,n)),n&&i&&!i.plugin&&(i.plugin=n);return i},l.setRatio=function(t){var e,i,s,r=this._firstPT,n=1e-6;if(1!==t||this._tween._time!==this._tween._duration&&0!==this._tween._time)if(t||this._tween._time!==this._tween._duration&&0!==this._tween._time||this._tween._rawPrevTime===-1e-6)for(;r;){if(e=r.c*t+r.s,r.r?e=Math.round(e):n>e&&e>-n&&(e=0),r.type)if(1===r.type)if(s=r.l,2===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2;else if(3===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3;else if(4===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4;else if(5===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4+r.xn4+r.xs5;else{for(i=r.xs0+e+r.xs1,s=1;r.l>s;s++)i+=r["xn"+s]+r["xs"+(s+1)];r.t[r.p]=i}else-1===r.type?r.t[r.p]=r.xs0:r.setRatio&&r.setRatio(t);else r.t[r.p]=e+r.xs0;r=r._next}else for(;r;)2!==r.type?r.t[r.p]=r.b:r.setRatio(t),r=r._next;else for(;r;)2!==r.type?r.t[r.p]=r.e:r.setRatio(t),r=r._next},l._enableTransforms=function(t){this._transform=this._transform||Me(this._target,r,!0),this._transformType=this._transform.svg&&Te||!t&&3!==this._transformType?2:3};var Ue=function(){this.t[this.p]=this.e,this.data._linkCSSP(this,this._next,null,!0)};l._addLazySet=function(t,e,i){var s=this._firstPT=new fe(t,e,0,0,this._firstPT,2);s.e=i,s.setRatio=Ue,s.data=this},l._linkCSSP=function(t,e,i,s){return t&&(e&&(e._prev=t),t._next&&(t._next._prev=t._prev),t._prev?t._prev._next=t._next:this._firstPT===t&&(this._firstPT=t._next,s=!0),i?i._next=t:s||null!==this._firstPT||(this._firstPT=t),t._next=e,t._prev=i),t},l._kill=function(e){var i,s,r,n=e;if(e.autoAlpha||e.alpha){n={};for(s in e)n[s]=e[s];n.opacity=1,n.autoAlpha&&(n.visibility=1)}return e.className&&(i=this._classNamePT)&&(r=i.xfirst,r&&r._prev?this._linkCSSP(r._prev,i._next,r._prev._prev):r===this._firstPT&&(this._firstPT=i._next),i._next&&this._linkCSSP(i._next,i._next._next,r._prev),this._classNamePT=null),t.prototype._kill.call(this,n)};var Ye=function(t,e,i){var s,r,n,a;if(t.slice)for(r=t.length;--r>-1;)Ye(t[r],e,i);else for(s=t.childNodes,r=s.length;--r>-1;)n=s[r],a=n.type,n.style&&(e.push(K(n)),i&&i.push(n)),1!==a&&9!==a&&11!==a||!n.childNodes.length||Ye(n,e,i)};return a.cascadeTo=function(t,i,s){var r,n,a,o=e.to(t,i,s),h=[o],l=[],_=[],u=[],p=e._internals.reservedProps;for(t=o._targets||o.target,Ye(t,l,u),o.render(i,!0),Ye(t,_),o.render(0,!0),o._enabled(!0),r=u.length;--r>-1;)if(n=J(u[r],l[r],_[r]),n.firstMPT){n=n.difs;for(a in s)p[a]&&(n[a]=s[a]);h.push(e.to(u[r],i,n))}return h},t.activate([a]),a},!0),function(){var t=_gsScope._gsDefine.plugin({propName:"roundProps",priority:-1,API:2,init:function(t,e,i){return this._tween=i,!0}}),e=t.prototype;e._onInitAllProps=function(){for(var t,e,i,s=this._tween,r=s.vars.roundProps instanceof Array?s.vars.roundProps:s.vars.roundProps.split(","),n=r.length,a={},o=s._propLookup.roundProps;--n>-1;)a[r[n]]=1;for(n=r.length;--n>-1;)for(t=r[n],e=s._firstPT;e;)i=e._next,e.pg?e.t._roundProps(a,!0):e.n===t&&(this._add(e.t,t,e.s,e.c),i&&(i._prev=e._prev),e._prev?e._prev._next=i:s._firstPT===e&&(s._firstPT=i),e._next=e._prev=null,s._propLookup[t]=o),e=i;return!1},e._add=function(t,e,i,s){this._addTween(t,e,i,i+s,e,!0),this._overwriteProps.push(e)}}(),_gsScope._gsDefine.plugin({propName:"attr",API:2,version:"0.3.3",init:function(t,e){var i,s,r;if("function"!=typeof t.setAttribute)return!1;this._target=t,this._proxy={},this._start={},this._end={};for(i in e)this._start[i]=this._proxy[i]=s=t.getAttribute(i),r=this._addTween(this._proxy,i,parseFloat(s),e[i],i),this._end[i]=r?r.s+r.c:e[i],this._overwriteProps.push(i);return!0},set:function(t){this._super.setRatio.call(this,t);for(var e,i=this._overwriteProps,s=i.length,r=1===t?this._end:t?this._proxy:this._start;--s>-1;)e=i[s],this._target.setAttribute(e,r[e]+"")}}),_gsScope._gsDefine.plugin({propName:"directionalRotation",version:"0.2.1",API:2,init:function(t,e){"object"!=typeof e&&(e={rotation:e}),this.finals={};var i,s,r,n,a,o,h=e.useRadians===!0?2*Math.PI:360,l=1e-6;for(i in e)"useRadians"!==i&&(o=(e[i]+"").split("_"),s=o[0],r=parseFloat("function"!=typeof t[i]?t[i]:t[i.indexOf("set")||"function"!=typeof t["get"+i.substr(3)]?i:"get"+i.substr(3)]()),n=this.finals[i]="string"==typeof s&&"="===s.charAt(1)?r+parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)):Number(s)||0,a=n-r,o.length&&(s=o.join("_"),-1!==s.indexOf("short")&&(a%=h,a!==a%(h/2)&&(a=0>a?a+h:a-h)),-1!==s.indexOf("_cw")&&0>a?a=(a+9999999999*h)%h-(0|a/h)*h:-1!==s.indexOf("ccw")&&a>0&&(a=(a-9999999999*h)%h-(0|a/h)*h)),(a>l||-l>a)&&(this._addTween(t,i,r,r+a,i),this._overwriteProps.push(i)));return!0},set:function(t){var e;if(1!==t)this._super.setRatio.call(this,t);else for(e=this._firstPT;e;)e.f?e.t[e.p](this.finals[e.p]):e.t[e.p]=this.finals[e.p],e=e._next}})._autoCSS=!0,_gsScope._gsDefine("easing.Back",["easing.Ease"],function(t){var e,i,s,r=_gsScope.GreenSockGlobals||_gsScope,n=r.com.greensock,a=2*Math.PI,o=Math.PI/2,h=n._class,l=function(e,i){var s=h("easing."+e,function(){},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,s},_=t.register||function(){},u=function(t,e,i,s){var r=h("easing."+t,{easeOut:new e,easeIn:new i,easeInOut:new s},!0);return _(r,t),r},p=function(t,e,i){this.t=t,this.v=e,i&&(this.next=i,i.prev=this,this.c=i.v-e,this.gap=i.t-t)},c=function(e,i){var s=h("easing."+e,function(t){this._p1=t||0===t?t:1.70158,this._p2=1.525*this._p1},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,r.config=function(t){return new s(t)},s},f=u("Back",c("BackOut",function(t){return(t-=1)*t*((this._p1+1)*t+this._p1)+1}),c("BackIn",function(t){return t*t*((this._p1+1)*t-this._p1)}),c("BackInOut",function(t){return 1>(t*=2)?.5*t*t*((this._p2+1)*t-this._p2):.5*((t-=2)*t*((this._p2+1)*t+this._p2)+2)})),m=h("easing.SlowMo",function(t,e,i){e=e||0===e?e:.7,null==t?t=.7:t>1&&(t=1),this._p=1!==t?e:0,this._p1=(1-t)/2,this._p2=t,this._p3=this._p1+this._p2,this._calcEnd=i===!0},!0),d=m.prototype=new t;return d.constructor=m,d.getRatio=function(t){var e=t+(.5-t)*this._p;return this._p1>t?this._calcEnd?1-(t=1-t/this._p1)*t:e-(t=1-t/this._p1)*t*t*t*e:t>this._p3?this._calcEnd?1-(t=(t-this._p3)/this._p1)*t:e+(t-e)*(t=(t-this._p3)/this._p1)*t*t*t:this._calcEnd?1:e},m.ease=new m(.7,.7),d.config=m.config=function(t,e,i){return new m(t,e,i)},e=h("easing.SteppedEase",function(t){t=t||1,this._p1=1/t,this._p2=t+1},!0),d=e.prototype=new t,d.constructor=e,d.getRatio=function(t){return 0>t?t=0:t>=1&&(t=.999999999),(this._p2*t>>0)*this._p1},d.config=e.config=function(t){return new e(t)},i=h("easing.RoughEase",function(e){e=e||{};for(var i,s,r,n,a,o,h=e.taper||"none",l=[],_=0,u=0|(e.points||20),c=u,f=e.randomize!==!1,m=e.clamp===!0,d=e.template instanceof t?e.template:null,g="number"==typeof e.strength?.4*e.strength:.4;--c>-1;)i=f?Math.random():1/u*c,s=d?d.getRatio(i):i,"none"===h?r=g:"out"===h?(n=1-i,r=n*n*g):"in"===h?r=i*i*g:.5>i?(n=2*i,r=.5*n*n*g):(n=2*(1-i),r=.5*n*n*g),f?s+=Math.random()*r-.5*r:c%2?s+=.5*r:s-=.5*r,m&&(s>1?s=1:0>s&&(s=0)),l[_++]={x:i,y:s};for(l.sort(function(t,e){return t.x-e.x}),o=new p(1,1,null),c=u;--c>-1;)a=l[c],o=new p(a.x,a.y,o);this._prev=new p(0,0,0!==o.t?o:o.next)},!0),d=i.prototype=new t,d.constructor=i,d.getRatio=function(t){var e=this._prev;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&e.t>=t;)e=e.prev;return this._prev=e,e.v+(t-e.t)/e.gap*e.c},d.config=function(t){return new i(t)},i.ease=new i,u("Bounce",l("BounceOut",function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}),l("BounceIn",function(t){return 1/2.75>(t=1-t)?1-7.5625*t*t:2/2.75>t?1-(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1-(7.5625*(t-=2.25/2.75)*t+.9375):1-(7.5625*(t-=2.625/2.75)*t+.984375)}),l("BounceInOut",function(t){var e=.5>t;return t=e?1-2*t:2*t-1,t=1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,e?.5*(1-t):.5*t+.5})),u("Circ",l("CircOut",function(t){return Math.sqrt(1-(t-=1)*t)}),l("CircIn",function(t){return-(Math.sqrt(1-t*t)-1)}),l("CircInOut",function(t){return 1>(t*=2)?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)})),s=function(e,i,s){var r=h("easing."+e,function(t,e){this._p1=t||1,this._p2=e||s,this._p3=this._p2/a*(Math.asin(1/this._p1)||0)},!0),n=r.prototype=new t;return n.constructor=r,n.getRatio=i,n.config=function(t,e){return new r(t,e)},r},u("Elastic",s("ElasticOut",function(t){return this._p1*Math.pow(2,-10*t)*Math.sin((t-this._p3)*a/this._p2)+1},.3),s("ElasticIn",function(t){return-(this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2))},.3),s("ElasticInOut",function(t){return 1>(t*=2)?-.5*this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2):.5*this._p1*Math.pow(2,-10*(t-=1))*Math.sin((t-this._p3)*a/this._p2)+1},.45)),u("Expo",l("ExpoOut",function(t){return 1-Math.pow(2,-10*t)}),l("ExpoIn",function(t){return Math.pow(2,10*(t-1))-.001}),l("ExpoInOut",function(t){return 1>(t*=2)?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))})),u("Sine",l("SineOut",function(t){return Math.sin(t*o)}),l("SineIn",function(t){return-Math.cos(t*o)+1}),l("SineInOut",function(t){return-.5*(Math.cos(Math.PI*t)-1)})),h("easing.EaseLookup",{find:function(e){return t.map[e]}},!0),_(r.SlowMo,"SlowMo","ease,"),_(i,"RoughEase","ease,"),_(e,"SteppedEase","ease,"),f},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(t,e){"use strict";var i=t.GreenSockGlobals=t.GreenSockGlobals||t;if(!i.TweenLite){var s,r,n,a,o,h=function(t){var e,s=t.split("."),r=i;for(e=0;s.length>e;e++)r[s[e]]=r=r[s[e]]||{};return r},l=h("com.greensock"),_=1e-10,u=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},p=function(){},c=function(){var t=Object.prototype.toString,e=t.call([]);return function(i){return null!=i&&(i instanceof Array||"object"==typeof i&&!!i.push&&t.call(i)===e)}}(),f={},m=function(s,r,n,a){this.sc=f[s]?f[s].sc:[],f[s]=this,this.gsClass=null,this.func=n;var o=[];this.check=function(l){for(var _,u,p,c,d=r.length,g=d;--d>-1;)(_=f[r[d]]||new m(r[d],[])).gsClass?(o[d]=_.gsClass,g--):l&&_.sc.push(this);if(0===g&&n)for(u=("com.greensock."+s).split("."),p=u.pop(),c=h(u.join("."))[p]=this.gsClass=n.apply(n,o),a&&(i[p]=c,"function"==typeof define&&define.amd?define((t.GreenSockAMDPath?t.GreenSockAMDPath+"/":"")+s.split(".").pop(),[],function(){return c}):s===e&&"undefined"!=typeof module&&module.exports&&(module.exports=c)),d=0;this.sc.length>d;d++)this.sc[d].check()},this.check(!0)},d=t._gsDefine=function(t,e,i,s){return new m(t,e,i,s)},g=l._class=function(t,e,i){return e=e||function(){},d(t,[],function(){return e},i),e};d.globals=i;var v=[0,0,1,1],y=[],T=g("easing.Ease",function(t,e,i,s){this._func=t,this._type=i||0,this._power=s||0,this._params=e?v.concat(e):v},!0),w=T.map={},x=T.register=function(t,e,i,s){for(var r,n,a,o,h=e.split(","),_=h.length,u=(i||"easeIn,easeOut,easeInOut").split(",");--_>-1;)for(n=h[_],r=s?g("easing."+n,null,!0):l.easing[n]||{},a=u.length;--a>-1;)o=u[a],w[n+"."+o]=w[o+n]=r[o]=t.getRatio?t:t[o]||new t};for(n=T.prototype,n._calcEnd=!1,n.getRatio=function(t){if(this._func)return this._params[0]=t,this._func.apply(null,this._params);var e=this._type,i=this._power,s=1===e?1-t:2===e?t:.5>t?2*t:2*(1-t);return 1===i?s*=s:2===i?s*=s*s:3===i?s*=s*s*s:4===i&&(s*=s*s*s*s),1===e?1-s:2===e?s:.5>t?s/2:1-s/2},s=["Linear","Quad","Cubic","Quart","Quint,Strong"],r=s.length;--r>-1;)n=s[r]+",Power"+r,x(new T(null,null,1,r),n,"easeOut",!0),x(new T(null,null,2,r),n,"easeIn"+(0===r?",easeNone":"")),x(new T(null,null,3,r),n,"easeInOut");w.linear=l.easing.Linear.easeIn,w.swing=l.easing.Quad.easeInOut;var b=g("events.EventDispatcher",function(t){this._listeners={},this._eventTarget=t||this});n=b.prototype,n.addEventListener=function(t,e,i,s,r){r=r||0;var n,h,l=this._listeners[t],_=0;for(null==l&&(this._listeners[t]=l=[]),h=l.length;--h>-1;)n=l[h],n.c===e&&n.s===i?l.splice(h,1):0===_&&r>n.pr&&(_=h+1);l.splice(_,0,{c:e,s:i,up:s,pr:r}),this!==a||o||a.wake()},n.removeEventListener=function(t,e){var i,s=this._listeners[t];if(s)for(i=s.length;--i>-1;)if(s[i].c===e)return s.splice(i,1),void 0},n.dispatchEvent=function(t){var e,i,s,r=this._listeners[t];if(r)for(e=r.length,i=this._eventTarget;--e>-1;)s=r[e],s&&(s.up?s.c.call(s.s||i,{type:t,target:i}):s.c.call(s.s||i))};var P=t.requestAnimationFrame,S=t.cancelAnimationFrame,k=Date.now||function(){return(new Date).getTime()},R=k();for(s=["ms","moz","webkit","o"],r=s.length;--r>-1&&!P;)P=t[s[r]+"RequestAnimationFrame"],S=t[s[r]+"CancelAnimationFrame"]||t[s[r]+"CancelRequestAnimationFrame"];g("Ticker",function(t,e){var i,s,r,n,h,l=this,u=k(),c=e!==!1&&P,f=500,m=33,d="tick",g=function(t){var e,a,o=k()-R;o>f&&(u+=o-m),R+=o,l.time=(R-u)/1e3,e=l.time-h,(!i||e>0||t===!0)&&(l.frame++,h+=e+(e>=n?.004:n-e),a=!0),t!==!0&&(r=s(g)),a&&l.dispatchEvent(d)};b.call(l),l.time=l.frame=0,l.tick=function(){g(!0)},l.lagSmoothing=function(t,e){f=t||1/_,m=Math.min(e,f,0)},l.sleep=function(){null!=r&&(c&&S?S(r):clearTimeout(r),s=p,r=null,l===a&&(o=!1))},l.wake=function(){null!==r?l.sleep():l.frame>10&&(R=k()-f+5),s=0===i?p:c&&P?P:function(t){return setTimeout(t,0|1e3*(h-l.time)+1)},l===a&&(o=!0),g(2)},l.fps=function(t){return arguments.length?(i=t,n=1/(i||60),h=this.time+n,l.wake(),void 0):i},l.useRAF=function(t){return arguments.length?(l.sleep(),c=t,l.fps(i),void 0):c},l.fps(t),setTimeout(function(){c&&(!r||5>l.frame)&&l.useRAF(!1)},1500)}),n=l.Ticker.prototype=new l.events.EventDispatcher,n.constructor=l.Ticker;var A=g("core.Animation",function(t,e){if(this.vars=e=e||{},this._duration=this._totalDuration=t||0,this._delay=Number(e.delay)||0,this._timeScale=1,this._active=e.immediateRender===!0,this.data=e.data,this._reversed=e.reversed===!0,j){o||a.wake();var i=this.vars.useFrames?B:j;i.add(this,i._time),this.vars.paused&&this.paused(!0)}});a=A.ticker=new l.Ticker,n=A.prototype,n._dirty=n._gc=n._initted=n._paused=!1,n._totalTime=n._time=0,n._rawPrevTime=-1,n._next=n._last=n._onUpdate=n._timeline=n.timeline=null,n._paused=!1;var C=function(){o&&k()-R>2e3&&a.wake(),setTimeout(C,2e3)};C(),n.play=function(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},n.pause=function(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},n.resume=function(t,e){return null!=t&&this.seek(t,e),this.paused(!1)},n.seek=function(t,e){return this.totalTime(Number(t),e!==!1)},n.restart=function(t,e){return this.reversed(!1).paused(!1).totalTime(t?-this._delay:0,e!==!1,!0)},n.reverse=function(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},n.render=function(){},n.invalidate=function(){return this._time=this._totalTime=0,this._initted=this._gc=!1,this._rawPrevTime=-1,(this._gc||!this.timeline)&&this._enabled(!0),this},n.isActive=function(){var t,e=this._timeline,i=this._startTime;return!e||!this._gc&&!this._paused&&e.isActive()&&(t=e.rawTime())>=i&&i+this.totalDuration()/this._timeScale>t},n._enabled=function(t,e){return o||a.wake(),this._gc=!t,this._active=this.isActive(),e!==!0&&(t&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!t&&this.timeline&&this._timeline._remove(this,!0)),!1},n._kill=function(){return this._enabled(!1,!1)},n.kill=function(t,e){return this._kill(t,e),this},n._uncache=function(t){for(var e=t?this:this.timeline;e;)e._dirty=!0,e=e.timeline;return this},n._swapSelfInParams=function(t){for(var e=t.length,i=t.concat();--e>-1;)"{self}"===t[e]&&(i[e]=this);return i},n.eventCallback=function(t,e,i,s){if("on"===(t||"").substr(0,2)){var r=this.vars;if(1===arguments.length)return r[t];null==e?delete r[t]:(r[t]=e,r[t+"Params"]=c(i)&&-1!==i.join("").indexOf("{self}")?this._swapSelfInParams(i):i,r[t+"Scope"]=s),"onUpdate"===t&&(this._onUpdate=e)}return this},n.delay=function(t){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+t-this._delay),this._delay=t,this):this._delay},n.duration=function(t){return arguments.length?(this._duration=this._totalDuration=t,this._uncache(!0),this._timeline.smoothChildTiming&&this._time>0&&this._time<this._duration&&0!==t&&this.totalTime(this._totalTime*(t/this._duration),!0),this):(this._dirty=!1,this._duration)},n.totalDuration=function(t){return this._dirty=!1,arguments.length?this.duration(t):this._totalDuration},n.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),this.totalTime(t>this._duration?this._duration:t,e)):this._time},n.totalTime=function(t,e,i){if(o||a.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(0>t&&!i&&(t+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var s=this._totalDuration,r=this._timeline;if(t>s&&!i&&(t=s),this._startTime=(this._paused?this._pauseTime:r._time)-(this._reversed?s-t:t)/this._timeScale,r._dirty||this._uncache(!1),r._timeline)for(;r._timeline;)r._timeline._time!==(r._startTime+r._totalTime)/r._timeScale&&r.totalTime(r._totalTime,!0),r=r._timeline}this._gc&&this._enabled(!0,!1),(this._totalTime!==t||0===this._duration)&&(this.render(t,e,!1),I.length&&q())}return this},n.progress=n.totalProgress=function(t,e){return arguments.length?this.totalTime(this.duration()*t,e):this._time/this.duration()},n.startTime=function(t){return arguments.length?(t!==this._startTime&&(this._startTime=t,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,t-this._delay)),this):this._startTime},n.endTime=function(t){return this._startTime+(0!=t?this.totalDuration():this.duration())/this._timeScale},n.timeScale=function(t){if(!arguments.length)return this._timeScale;if(t=t||_,this._timeline&&this._timeline.smoothChildTiming){var e=this._pauseTime,i=e||0===e?e:this._timeline.totalTime();this._startTime=i-(i-this._startTime)*this._timeScale/t}return this._timeScale=t,this._uncache(!1)},n.reversed=function(t){return arguments.length?(t!=this._reversed&&(this._reversed=t,this.totalTime(this._timeline&&!this._timeline.smoothChildTiming?this.totalDuration()-this._totalTime:this._totalTime,!0)),this):this._reversed},n.paused=function(t){if(!arguments.length)return this._paused;if(t!=this._paused&&this._timeline){o||t||a.wake();var e=this._timeline,i=e.rawTime(),s=i-this._pauseTime;!t&&e.smoothChildTiming&&(this._startTime+=s,this._uncache(!1)),this._pauseTime=t?i:null,this._paused=t,this._active=this.isActive(),!t&&0!==s&&this._initted&&this.duration()&&this.render(e.smoothChildTiming?this._totalTime:(i-this._startTime)/this._timeScale,!0,!0)}return this._gc&&!t&&this._enabled(!0,!1),this};var O=g("core.SimpleTimeline",function(t){A.call(this,0,t),this.autoRemoveChildren=this.smoothChildTiming=!0});n=O.prototype=new A,n.constructor=O,n.kill()._gc=!1,n._first=n._last=n._recent=null,n._sortChildren=!1,n.add=n.insert=function(t,e){var i,s;if(t._startTime=Number(e||0)+t._delay,t._paused&&this!==t._timeline&&(t._pauseTime=t._startTime+(this.rawTime()-t._startTime)/t._timeScale),t.timeline&&t.timeline._remove(t,!0),t.timeline=t._timeline=this,t._gc&&t._enabled(!0,!0),i=this._last,this._sortChildren)for(s=t._startTime;i&&i._startTime>s;)i=i._prev;return i?(t._next=i._next,i._next=t):(t._next=this._first,this._first=t),t._next?t._next._prev=t:this._last=t,t._prev=i,this._recent=t,this._timeline&&this._uncache(!0),this},n._remove=function(t,e){return t.timeline===this&&(e||t._enabled(!1,!0),t._prev?t._prev._next=t._next:this._first===t&&(this._first=t._next),t._next?t._next._prev=t._prev:this._last===t&&(this._last=t._prev),t._next=t._prev=t.timeline=null,t===this._recent&&(this._recent=this._last),this._timeline&&this._uncache(!0)),this},n.render=function(t,e,i){var s,r=this._first;for(this._totalTime=this._time=this._rawPrevTime=t;r;)s=r._next,(r._active||t>=r._startTime&&!r._paused)&&(r._reversed?r.render((r._dirty?r.totalDuration():r._totalDuration)-(t-r._startTime)*r._timeScale,e,i):r.render((t-r._startTime)*r._timeScale,e,i)),r=s},n.rawTime=function(){return o||a.wake(),this._totalTime};var D=g("TweenLite",function(e,i,s){if(A.call(this,i,s),this.render=D.prototype.render,null==e)throw"Cannot tween a null target.";this.target=e="string"!=typeof e?e:D.selector(e)||e;var r,n,a,o=e.jquery||e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType),h=this.vars.overwrite;if(this._overwrite=h=null==h?Y[D.defaultOverwrite]:"number"==typeof h?h>>0:Y[h],(o||e instanceof Array||e.push&&c(e))&&"number"!=typeof e[0])for(this._targets=a=u(e),this._propLookup=[],this._siblings=[],r=0;a.length>r;r++)n=a[r],n?"string"!=typeof n?n.length&&n!==t&&n[0]&&(n[0]===t||n[0].nodeType&&n[0].style&&!n.nodeType)?(a.splice(r--,1),this._targets=a=a.concat(u(n))):(this._siblings[r]=V(n,this,!1),1===h&&this._siblings[r].length>1&&W(n,this,null,1,this._siblings[r])):(n=a[r--]=D.selector(n),"string"==typeof n&&a.splice(r+1,1)):a.splice(r--,1);else this._propLookup={},this._siblings=V(e,this,!1),1===h&&this._siblings.length>1&&W(e,this,null,1,this._siblings);(this.vars.immediateRender||0===i&&0===this._delay&&this.vars.immediateRender!==!1)&&(this._time=-_,this.render(-this._delay))},!0),M=function(e){return e&&e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType)},z=function(t,e){var i,s={};for(i in t)U[i]||i in e&&"transform"!==i&&"x"!==i&&"y"!==i&&"width"!==i&&"height"!==i&&"className"!==i&&"border"!==i||!(!N[i]||N[i]&&N[i]._autoCSS)||(s[i]=t[i],delete t[i]);t.css=s};n=D.prototype=new A,n.constructor=D,n.kill()._gc=!1,n.ratio=0,n._firstPT=n._targets=n._overwrittenProps=n._startAt=null,n._notifyPluginsOfEnabled=n._lazy=!1,D.version="1.15.0",D.defaultEase=n._ease=new T(null,null,1,1),D.defaultOverwrite="auto",D.ticker=a,D.autoSleep=!0,D.lagSmoothing=function(t,e){a.lagSmoothing(t,e)},D.selector=t.$||t.jQuery||function(e){var i=t.$||t.jQuery;return i?(D.selector=i,i(e)):"undefined"==typeof document?e:document.querySelectorAll?document.querySelectorAll(e):document.getElementById("#"===e.charAt(0)?e.substr(1):e)};var I=[],E={},F=D._internals={isArray:c,isSelector:M,lazyTweens:I},N=D._plugins={},L=F.tweenLookup={},X=0,U=F.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1,lazy:1,onOverwrite:1},Y={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,"true":1,"false":0},B=A._rootFramesTimeline=new O,j=A._rootTimeline=new O,q=F.lazyRender=function(){var t,e=I.length;for(E={};--e>-1;)t=I[e],t&&t._lazy!==!1&&(t.render(t._lazy[0],t._lazy[1],!0),t._lazy=!1);I.length=0};j._startTime=a.time,B._startTime=a.frame,j._active=B._active=!0,setTimeout(q,1),A._updateRoot=D.render=function(){var t,e,i;if(I.length&&q(),j.render((a.time-j._startTime)*j._timeScale,!1,!1),B.render((a.frame-B._startTime)*B._timeScale,!1,!1),I.length&&q(),!(a.frame%120)){for(i in L){for(e=L[i].tweens,t=e.length;--t>-1;)e[t]._gc&&e.splice(t,1);0===e.length&&delete L[i]}if(i=j._first,(!i||i._paused)&&D.autoSleep&&!B._first&&1===a._listeners.tick.length){for(;i&&i._paused;)i=i._next;i||a.sleep()}}},a.addEventListener("tick",A._updateRoot);var V=function(t,e,i){var s,r,n=t._gsTweenID;if(L[n||(t._gsTweenID=n="t"+X++)]||(L[n]={target:t,tweens:[]}),e&&(s=L[n].tweens,s[r=s.length]=e,i))for(;--r>-1;)s[r]===e&&s.splice(r,1);return L[n].tweens},G=function(t,e,i,s){var r,n,a=t.vars.onOverwrite;return a&&(r=a(t,e,i,s)),a=D.onOverwrite,a&&(n=a(t,e,i,s)),r!==!1&&n!==!1},W=function(t,e,i,s,r){var n,a,o,h;if(1===s||s>=4){for(h=r.length,n=0;h>n;n++)if((o=r[n])!==e)o._gc||G(o,e)&&o._enabled(!1,!1)&&(a=!0);else if(5===s)break;return a}var l,u=e._startTime+_,p=[],c=0,f=0===e._duration;for(n=r.length;--n>-1;)(o=r[n])===e||o._gc||o._paused||(o._timeline!==e._timeline?(l=l||Z(e,0,f),0===Z(o,l,f)&&(p[c++]=o)):u>=o._startTime&&o._startTime+o.totalDuration()/o._timeScale>u&&((f||!o._initted)&&2e-10>=u-o._startTime||(p[c++]=o)));for(n=c;--n>-1;)if(o=p[n],2===s&&o._kill(i,t,e)&&(a=!0),2!==s||!o._firstPT&&o._initted){if(2!==s&&!G(o,e))continue;o._enabled(!1,!1)&&(a=!0)}return a},Z=function(t,e,i){for(var s=t._timeline,r=s._timeScale,n=t._startTime;s._timeline;){if(n+=s._startTime,r*=s._timeScale,s._paused)return-100;s=s._timeline}return n/=r,n>e?n-e:i&&n===e||!t._initted&&2*_>n-e?_:(n+=t.totalDuration()/t._timeScale/r)>e+_?0:n-e-_};n._init=function(){var t,e,i,s,r,n=this.vars,a=this._overwrittenProps,o=this._duration,h=!!n.immediateRender,l=n.ease;if(n.startAt){this._startAt&&(this._startAt.render(-1,!0),this._startAt.kill()),r={};for(s in n.startAt)r[s]=n.startAt[s];if(r.overwrite=!1,r.immediateRender=!0,r.lazy=h&&n.lazy!==!1,r.startAt=r.delay=null,this._startAt=D.to(this.target,0,r),h)if(this._time>0)this._startAt=null;else if(0!==o)return}else if(n.runBackwards&&0!==o)if(this._startAt)this._startAt.render(-1,!0),this._startAt.kill(),this._startAt=null;else{0!==this._time&&(h=!1),i={};for(s in n)U[s]&&"autoCSS"!==s||(i[s]=n[s]);if(i.overwrite=0,i.data="isFromStart",i.lazy=h&&n.lazy!==!1,i.immediateRender=h,this._startAt=D.to(this.target,0,i),h){if(0===this._time)return}else this._startAt._init(),this._startAt._enabled(!1),this.vars.immediateRender&&(this._startAt=null)}if(this._ease=l=l?l instanceof T?l:"function"==typeof l?new T(l,n.easeParams):w[l]||D.defaultEase:D.defaultEase,n.easeParams instanceof Array&&l.config&&(this._ease=l.config.apply(l,n.easeParams)),this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(t=this._targets.length;--t>-1;)this._initProps(this._targets[t],this._propLookup[t]={},this._siblings[t],a?a[t]:null)&&(e=!0);else e=this._initProps(this.target,this._propLookup,this._siblings,a);if(e&&D._onPluginEvent("_onInitAllProps",this),a&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),n.runBackwards)for(i=this._firstPT;i;)i.s+=i.c,i.c=-i.c,i=i._next;this._onUpdate=n.onUpdate,this._initted=!0},n._initProps=function(e,i,s,r){var n,a,o,h,l,_;if(null==e)return!1;E[e._gsTweenID]&&q(),this.vars.css||e.style&&e!==t&&e.nodeType&&N.css&&this.vars.autoCSS!==!1&&z(this.vars,e);for(n in this.vars){if(_=this.vars[n],U[n])_&&(_ instanceof Array||_.push&&c(_))&&-1!==_.join("").indexOf("{self}")&&(this.vars[n]=_=this._swapSelfInParams(_,this));else if(N[n]&&(h=new N[n])._onInitTween(e,this.vars[n],this)){for(this._firstPT=l={_next:this._firstPT,t:h,p:"setRatio",s:0,c:1,f:!0,n:n,pg:!0,pr:h._priority},a=h._overwriteProps.length;--a>-1;)i[h._overwriteProps[a]]=this._firstPT;(h._priority||h._onInitAllProps)&&(o=!0),(h._onDisable||h._onEnable)&&(this._notifyPluginsOfEnabled=!0)}else this._firstPT=i[n]=l={_next:this._firstPT,t:e,p:n,f:"function"==typeof e[n],n:n,pg:!1,pr:0},l.s=l.f?e[n.indexOf("set")||"function"!=typeof e["get"+n.substr(3)]?n:"get"+n.substr(3)]():parseFloat(e[n]),l.c="string"==typeof _&&"="===_.charAt(1)?parseInt(_.charAt(0)+"1",10)*Number(_.substr(2)):Number(_)-l.s||0;l&&l._next&&(l._next._prev=l)}return r&&this._kill(r,e)?this._initProps(e,i,s,r):this._overwrite>1&&this._firstPT&&s.length>1&&W(e,this,i,this._overwrite,s)?(this._kill(i,e),this._initProps(e,i,s,r)):(this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration)&&(E[e._gsTweenID]=!0),o)},n.render=function(t,e,i){var s,r,n,a,o=this._time,h=this._duration,l=this._rawPrevTime;if(t>=h)this._totalTime=this._time=h,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(s=!0,r="onComplete"),0===h&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(0===t||0>l||l===_&&"isPause"!==this.data)&&l!==t&&(i=!0,l>_&&(r="onReverseComplete")),this._rawPrevTime=a=!e||t||l===t?t:_);else if(1e-7>t)this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==o||0===h&&l>0&&l!==_)&&(r="onReverseComplete",s=this._reversed),0>t&&(this._active=!1,0===h&&(this._initted||!this.vars.lazy||i)&&(l>=0&&(l!==_||"isPause"!==this.data)&&(i=!0),this._rawPrevTime=a=!e||t||l===t?t:_)),this._initted||(i=!0);else if(this._totalTime=this._time=t,this._easeType){var u=t/h,p=this._easeType,c=this._easePower;(1===p||3===p&&u>=.5)&&(u=1-u),3===p&&(u*=2),1===c?u*=u:2===c?u*=u*u:3===c?u*=u*u*u:4===c&&(u*=u*u*u*u),this.ratio=1===p?1-u:2===p?u:.5>t/h?u/2:1-u/2}else this.ratio=this._ease.getRatio(t/h);if(this._time!==o||i){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=this._totalTime=o,this._rawPrevTime=l,I.push(this),this._lazy=[t,e],void 0;this._time&&!s?this.ratio=this._ease.getRatio(this._time/h):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==o&&t>=0&&(this._active=!0),0===o&&(this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._time||0===h)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||y))),n=this._firstPT;n;)n.f?n.t[n.p](n.c*this.ratio+n.s):n.t[n.p]=n.c*this.ratio+n.s,n=n._next;this._onUpdate&&(0>t&&this._startAt&&t!==-1e-4&&this._startAt.render(t,e,i),e||(this._time!==o||s)&&this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||y)),r&&(!this._gc||i)&&(0>t&&this._startAt&&!this._onUpdate&&t!==-1e-4&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||y),0===h&&this._rawPrevTime===_&&a!==_&&(this._rawPrevTime=0))}},n._kill=function(t,e,i){if("all"===t&&(t=null),null==t&&(null==e||e===this.target))return this._lazy=!1,this._enabled(!1,!1);e="string"!=typeof e?e||this._targets||this.target:D.selector(e)||e;var s,r,n,a,o,h,l,_,u;if((c(e)||M(e))&&"number"!=typeof e[0])for(s=e.length;--s>-1;)this._kill(t,e[s])&&(h=!0);else{if(this._targets){for(s=this._targets.length;--s>-1;)if(e===this._targets[s]){o=this._propLookup[s]||{},this._overwrittenProps=this._overwrittenProps||[],r=this._overwrittenProps[s]=t?this._overwrittenProps[s]||{}:"all";break}}else{if(e!==this.target)return!1;o=this._propLookup,r=this._overwrittenProps=t?this._overwrittenProps||{}:"all"}if(o){if(l=t||o,_=t!==r&&"all"!==r&&t!==o&&("object"!=typeof t||!t._tempKill),i&&(D.onOverwrite||this.vars.onOverwrite)){for(n in l)o[n]&&(u||(u=[]),u.push(n));
if(!G(this,i,e,u))return!1}for(n in l)(a=o[n])&&(a.pg&&a.t._kill(l)&&(h=!0),a.pg&&0!==a.t._overwriteProps.length||(a._prev?a._prev._next=a._next:a===this._firstPT&&(this._firstPT=a._next),a._next&&(a._next._prev=a._prev),a._next=a._prev=null),delete o[n]),_&&(r[n]=1);!this._firstPT&&this._initted&&this._enabled(!1,!1)}}return h},n.invalidate=function(){return this._notifyPluginsOfEnabled&&D._onPluginEvent("_onDisable",this),this._firstPT=this._overwrittenProps=this._startAt=this._onUpdate=null,this._notifyPluginsOfEnabled=this._active=this._lazy=!1,this._propLookup=this._targets?{}:[],A.prototype.invalidate.call(this),this.vars.immediateRender&&(this._time=-_,this.render(-this._delay)),this},n._enabled=function(t,e){if(o||a.wake(),t&&this._gc){var i,s=this._targets;if(s)for(i=s.length;--i>-1;)this._siblings[i]=V(s[i],this,!0);else this._siblings=V(this.target,this,!0)}return A.prototype._enabled.call(this,t,e),this._notifyPluginsOfEnabled&&this._firstPT?D._onPluginEvent(t?"_onEnable":"_onDisable",this):!1},D.to=function(t,e,i){return new D(t,e,i)},D.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new D(t,e,i)},D.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new D(t,e,s)},D.delayedCall=function(t,e,i,s,r){return new D(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,lazy:!1,useFrames:r,overwrite:0})},D.set=function(t,e){return new D(t,0,e)},D.getTweensOf=function(t,e){if(null==t)return[];t="string"!=typeof t?t:D.selector(t)||t;var i,s,r,n;if((c(t)||M(t))&&"number"!=typeof t[0]){for(i=t.length,s=[];--i>-1;)s=s.concat(D.getTweensOf(t[i],e));for(i=s.length;--i>-1;)for(n=s[i],r=i;--r>-1;)n===s[r]&&s.splice(i,1)}else for(s=V(t).concat(),i=s.length;--i>-1;)(s[i]._gc||e&&!s[i].isActive())&&s.splice(i,1);return s},D.killTweensOf=D.killDelayedCallsTo=function(t,e,i){"object"==typeof e&&(i=e,e=!1);for(var s=D.getTweensOf(t,e),r=s.length;--r>-1;)s[r]._kill(i,t)};var Q=g("plugins.TweenPlugin",function(t,e){this._overwriteProps=(t||"").split(","),this._propName=this._overwriteProps[0],this._priority=e||0,this._super=Q.prototype},!0);if(n=Q.prototype,Q.version="1.10.1",Q.API=2,n._firstPT=null,n._addTween=function(t,e,i,s,r,n){var a,o;return null!=s&&(a="number"==typeof s||"="!==s.charAt(1)?Number(s)-i:parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)))?(this._firstPT=o={_next:this._firstPT,t:t,p:e,s:i,c:a,f:"function"==typeof t[e],n:r||e,r:n},o._next&&(o._next._prev=o),o):void 0},n.setRatio=function(t){for(var e,i=this._firstPT,s=1e-6;i;)e=i.c*t+i.s,i.r?e=Math.round(e):s>e&&e>-s&&(e=0),i.f?i.t[i.p](e):i.t[i.p]=e,i=i._next},n._kill=function(t){var e,i=this._overwriteProps,s=this._firstPT;if(null!=t[this._propName])this._overwriteProps=[];else for(e=i.length;--e>-1;)null!=t[i[e]]&&i.splice(e,1);for(;s;)null!=t[s.n]&&(s._next&&(s._next._prev=s._prev),s._prev?(s._prev._next=s._next,s._prev=null):this._firstPT===s&&(this._firstPT=s._next)),s=s._next;return!1},n._roundProps=function(t,e){for(var i=this._firstPT;i;)(t[this._propName]||null!=i.n&&t[i.n.split(this._propName+"_").join("")])&&(i.r=e),i=i._next},D._onPluginEvent=function(t,e){var i,s,r,n,a,o=e._firstPT;if("_onInitAllProps"===t){for(;o;){for(a=o._next,s=r;s&&s.pr>o.pr;)s=s._next;(o._prev=s?s._prev:n)?o._prev._next=o:r=o,(o._next=s)?s._prev=o:n=o,o=a}o=e._firstPT=r}for(;o;)o.pg&&"function"==typeof o.t[t]&&o.t[t]()&&(i=!0),o=o._next;return i},Q.activate=function(t){for(var e=t.length;--e>-1;)t[e].API===Q.API&&(N[(new t[e])._propName]=t[e]);return!0},d.plugin=function(t){if(!(t&&t.propName&&t.init&&t.API))throw"illegal plugin definition.";var e,i=t.propName,s=t.priority||0,r=t.overwriteProps,n={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_roundProps",initAll:"_onInitAllProps"},a=g("plugins."+i.charAt(0).toUpperCase()+i.substr(1)+"Plugin",function(){Q.call(this,i,s),this._overwriteProps=r||[]},t.global===!0),o=a.prototype=new Q(i);o.constructor=a,a.API=t.API;for(e in n)"function"==typeof t[e]&&(o[n[e]]=t[e]);return a.version=t.version,Q.activate([a]),a},s=t._gsQueue){for(r=0;s.length>r;r++)s[r]();for(n in f)f[n].func||t.console.log("GSAP encountered missing dependency: com.greensock."+n)}o=!1}}("undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window,"TweenMax");;/**
 * BxSlider v4.1.1 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2013, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
!function(t){var e={},s={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",autoHover:!1,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){}};t.fn.bxSlider=function(n){if(0==this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var o={},r=this;e.el=this;var a=t(window).width(),l=t(window).height(),d=function(){o.settings=t.extend({},s,n),o.settings.slideWidth=parseInt(o.settings.slideWidth),o.children=r.children(o.settings.slideSelector),o.children.length<o.settings.minSlides&&(o.settings.minSlides=o.children.length),o.children.length<o.settings.maxSlides&&(o.settings.maxSlides=o.children.length),o.settings.randomStart&&(o.settings.startSlide=Math.floor(Math.random()*o.children.length)),o.active={index:o.settings.startSlide},o.carousel=o.settings.minSlides>1||o.settings.maxSlides>1,o.carousel&&(o.settings.preloadImages="all"),o.minThreshold=o.settings.minSlides*o.settings.slideWidth+(o.settings.minSlides-1)*o.settings.slideMargin,o.maxThreshold=o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin,o.working=!1,o.controls={},o.interval=null,o.animProp="vertical"==o.settings.mode?"top":"left",o.usingCSS=o.settings.useCSS&&"fade"!=o.settings.mode&&function(){var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var i in e)if(void 0!==t.style[e[i]])return o.cssPrefix=e[i].replace("Perspective","").toLowerCase(),o.animProp="-"+o.cssPrefix+"-transform",!0;return!1}(),"vertical"==o.settings.mode&&(o.settings.maxSlides=o.settings.minSlides),r.data("origStyle",r.attr("style")),r.children(o.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),c()},c=function(){r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'),o.viewport=r.parent(),o.loader=t('<div class="bx-loading" />'),o.viewport.prepend(o.loader),r.css({width:"horizontal"==o.settings.mode?100*o.children.length+215+"%":"auto",position:"relative"}),o.usingCSS&&o.settings.easing?r.css("-"+o.cssPrefix+"-transition-timing-function",o.settings.easing):o.settings.easing||(o.settings.easing="swing"),f(),o.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),o.viewport.parent().css({maxWidth:v()}),o.settings.pager||o.viewport.parent().css({margin:"0 auto 0px"}),o.children.css({"float":"horizontal"==o.settings.mode?"left":"none",listStyle:"none",position:"relative"}),o.children.css("width",u()),"horizontal"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginRight",o.settings.slideMargin),"vertical"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginBottom",o.settings.slideMargin),"fade"==o.settings.mode&&(o.children.css({position:"absolute",zIndex:0,display:"none"}),o.children.eq(o.settings.startSlide).css({zIndex:50,display:"block"})),o.controls.el=t('<div class="bx-controls" />'),o.settings.captions&&P(),o.active.last=o.settings.startSlide==x()-1,o.settings.video&&r.fitVids();var e=o.children.eq(o.settings.startSlide);"all"==o.settings.preloadImages&&(e=o.children),o.settings.ticker?o.settings.pager=!1:(o.settings.pager&&T(),o.settings.controls&&C(),o.settings.auto&&o.settings.autoControls&&E(),(o.settings.controls||o.settings.autoControls||o.settings.pager)&&o.viewport.after(o.controls.el)),g(e,h)},g=function(e,i){var s=e.find("img, iframe").length;if(0==s)return i(),void 0;var n=0;e.find("img, iframe").each(function(){t(this).one("load",function(){++n==s&&i()}).each(function(){this.complete&&t(this).load()})})},h=function(){if(o.settings.infiniteLoop&&"fade"!=o.settings.mode&&!o.settings.ticker){var e="vertical"==o.settings.mode?o.settings.minSlides:o.settings.maxSlides,i=o.children.slice(0,e).clone().addClass("bx-clone"),s=o.children.slice(-e).clone().addClass("bx-clone");r.append(i).prepend(s)}o.loader.remove(),S(),"vertical"==o.settings.mode&&(o.settings.adaptiveHeight=!0),o.viewport.height(p()),r.redrawSlider(),o.settings.onSliderLoad(o.active.index),o.initialized=!0,o.settings.responsive&&t(window).bind("resize",B),o.settings.auto&&o.settings.autoStart&&H(),o.settings.ticker&&L(),o.settings.pager&&I(o.settings.startSlide),o.settings.controls&&W(),o.settings.touchEnabled&&!o.settings.ticker&&O()},p=function(){var e=0,s=t();if("vertical"==o.settings.mode||o.settings.adaptiveHeight)if(o.carousel){var n=1==o.settings.moveSlides?o.active.index:o.active.index*m();for(s=o.children.eq(n),i=1;i<=o.settings.maxSlides-1;i++)s=n+i>=o.children.length?s.add(o.children.eq(i-1)):s.add(o.children.eq(n+i))}else s=o.children.eq(o.active.index);else s=o.children;return"vertical"==o.settings.mode?(s.each(function(){e+=t(this).outerHeight()}),o.settings.slideMargin>0&&(e+=o.settings.slideMargin*(o.settings.minSlides-1))):e=Math.max.apply(Math,s.map(function(){return t(this).outerHeight(!1)}).get()),e},v=function(){var t="100%";return o.settings.slideWidth>0&&(t="horizontal"==o.settings.mode?o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin:o.settings.slideWidth),t},u=function(){var t=o.settings.slideWidth,e=o.viewport.width();return 0==o.settings.slideWidth||o.settings.slideWidth>e&&!o.carousel||"vertical"==o.settings.mode?t=e:o.settings.maxSlides>1&&"horizontal"==o.settings.mode&&(e>o.maxThreshold||e<o.minThreshold&&(t=(e-o.settings.slideMargin*(o.settings.minSlides-1))/o.settings.minSlides)),t},f=function(){var t=1;if("horizontal"==o.settings.mode&&o.settings.slideWidth>0)if(o.viewport.width()<o.minThreshold)t=o.settings.minSlides;else if(o.viewport.width()>o.maxThreshold)t=o.settings.maxSlides;else{var e=o.children.first().width();t=Math.floor(o.viewport.width()/e)}else"vertical"==o.settings.mode&&(t=o.settings.minSlides);return t},x=function(){var t=0;if(o.settings.moveSlides>0)if(o.settings.infiniteLoop)t=o.children.length/m();else for(var e=0,i=0;e<o.children.length;)++t,e=i+f(),i+=o.settings.moveSlides<=f()?o.settings.moveSlides:f();else t=Math.ceil(o.children.length/f());return t},m=function(){return o.settings.moveSlides>0&&o.settings.moveSlides<=f()?o.settings.moveSlides:f()},S=function(){if(o.children.length>o.settings.maxSlides&&o.active.last&&!o.settings.infiniteLoop){if("horizontal"==o.settings.mode){var t=o.children.last(),e=t.position();b(-(e.left-(o.viewport.width()-t.width())),"reset",0)}else if("vertical"==o.settings.mode){var i=o.children.length-o.settings.minSlides,e=o.children.eq(i).position();b(-e.top,"reset",0)}}else{var e=o.children.eq(o.active.index*m()).position();o.active.index==x()-1&&(o.active.last=!0),void 0!=e&&("horizontal"==o.settings.mode?b(-e.left,"reset",0):"vertical"==o.settings.mode&&b(-e.top,"reset",0))}},b=function(t,e,i,s){if(o.usingCSS){var n="vertical"==o.settings.mode?"translate3d(0, "+t+"px, 0)":"translate3d("+t+"px, 0, 0)";r.css("-"+o.cssPrefix+"-transition-duration",i/1e3+"s"),"slide"==e?(r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),D()})):"reset"==e?r.css(o.animProp,n):"ticker"==e&&(r.css("-"+o.cssPrefix+"-transition-timing-function","linear"),r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),b(s.resetValue,"reset",0),N()}))}else{var a={};a[o.animProp]=t,"slide"==e?r.animate(a,i,o.settings.easing,function(){D()}):"reset"==e?r.css(o.animProp,t):"ticker"==e&&r.animate(a,speed,"linear",function(){b(s.resetValue,"reset",0),N()})}},w=function(){for(var e="",i=x(),s=0;i>s;s++){var n="";o.settings.buildPager&&t.isFunction(o.settings.buildPager)?(n=o.settings.buildPager(s),o.pagerEl.addClass("bx-custom-pager")):(n=s+1,o.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+s+'" class="bx-pager-link">'+n+"</a></div>"}o.pagerEl.html(e)},T=function(){o.settings.pagerCustom?o.pagerEl=t(o.settings.pagerCustom):(o.pagerEl=t('<div class="bx-pager" />'),o.settings.pagerSelector?t(o.settings.pagerSelector).html(o.pagerEl):o.controls.el.addClass("bx-has-pager").append(o.pagerEl),w()),o.pagerEl.delegate("a","click",q)},C=function(){o.controls.next=t('<a class="bx-next" href="">'+o.settings.nextText+"</a>"),o.controls.prev=t('<a class="bx-prev" href="">'+o.settings.prevText+"</a>"),o.controls.next.bind("click",y),o.controls.prev.bind("click",z),o.settings.nextSelector&&t(o.settings.nextSelector).append(o.controls.next),o.settings.prevSelector&&t(o.settings.prevSelector).append(o.controls.prev),o.settings.nextSelector||o.settings.prevSelector||(o.controls.directionEl=t('<div class="bx-controls-direction" />'),o.controls.directionEl.append(o.controls.prev).append(o.controls.next),o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))},E=function(){o.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+o.settings.startText+"</a></div>"),o.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+o.settings.stopText+"</a></div>"),o.controls.autoEl=t('<div class="bx-controls-auto" />'),o.controls.autoEl.delegate(".bx-start","click",k),o.controls.autoEl.delegate(".bx-stop","click",M),o.settings.autoControlsCombine?o.controls.autoEl.append(o.controls.start):o.controls.autoEl.append(o.controls.start).append(o.controls.stop),o.settings.autoControlsSelector?t(o.settings.autoControlsSelector).html(o.controls.autoEl):o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl),A(o.settings.autoStart?"stop":"start")},P=function(){o.children.each(function(){var e=t(this).find("img:first").attr("title");void 0!=e&&(""+e).length&&t(this).append('<div class="bx-caption"><span>'+e+"</span></div>")})},y=function(t){o.settings.auto&&r.stopAuto(),r.goToNextSlide(),t.preventDefault()},z=function(t){o.settings.auto&&r.stopAuto(),r.goToPrevSlide(),t.preventDefault()},k=function(t){r.startAuto(),t.preventDefault()},M=function(t){r.stopAuto(),t.preventDefault()},q=function(e){o.settings.auto&&r.stopAuto();var i=t(e.currentTarget),s=parseInt(i.attr("data-slide-index"));s!=o.active.index&&r.goToSlide(s),e.preventDefault()},I=function(e){var i=o.children.length;return"short"==o.settings.pagerType?(o.settings.maxSlides>1&&(i=Math.ceil(o.children.length/o.settings.maxSlides)),o.pagerEl.html(e+1+o.settings.pagerShortSeparator+i),void 0):(o.pagerEl.find("a").removeClass("active"),o.pagerEl.each(function(i,s){t(s).find("a").eq(e).addClass("active")}),void 0)},D=function(){if(o.settings.infiniteLoop){var t="";0==o.active.index?t=o.children.eq(0).position():o.active.index==x()-1&&o.carousel?t=o.children.eq((x()-1)*m()).position():o.active.index==o.children.length-1&&(t=o.children.eq(o.children.length-1).position()),"horizontal"==o.settings.mode?b(-t.left,"reset",0):"vertical"==o.settings.mode&&b(-t.top,"reset",0)}o.working=!1,o.settings.onSlideAfter(o.children.eq(o.active.index),o.oldIndex,o.active.index)},A=function(t){o.settings.autoControlsCombine?o.controls.autoEl.html(o.controls[t]):(o.controls.autoEl.find("a").removeClass("active"),o.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},W=function(){1==x()?(o.controls.prev.addClass("disabled"),o.controls.next.addClass("disabled")):!o.settings.infiniteLoop&&o.settings.hideControlOnEnd&&(0==o.active.index?(o.controls.prev.addClass("disabled"),o.controls.next.removeClass("disabled")):o.active.index==x()-1?(o.controls.next.addClass("disabled"),o.controls.prev.removeClass("disabled")):(o.controls.prev.removeClass("disabled"),o.controls.next.removeClass("disabled")))},H=function(){o.settings.autoDelay>0?setTimeout(r.startAuto,o.settings.autoDelay):r.startAuto(),o.settings.autoHover&&r.hover(function(){o.interval&&(r.stopAuto(!0),o.autoPaused=!0)},function(){o.autoPaused&&(r.startAuto(!0),o.autoPaused=null)})},L=function(){var e=0;if("next"==o.settings.autoDirection)r.append(o.children.clone().addClass("bx-clone"));else{r.prepend(o.children.clone().addClass("bx-clone"));var i=o.children.first().position();e="horizontal"==o.settings.mode?-i.left:-i.top}b(e,"reset",0),o.settings.pager=!1,o.settings.controls=!1,o.settings.autoControls=!1,o.settings.tickerHover&&!o.usingCSS&&o.viewport.hover(function(){r.stop()},function(){var e=0;o.children.each(function(){e+="horizontal"==o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)});var i=o.settings.speed/e,s="horizontal"==o.settings.mode?"left":"top",n=i*(e-Math.abs(parseInt(r.css(s))));N(n)}),N()},N=function(t){speed=t?t:o.settings.speed;var e={left:0,top:0},i={left:0,top:0};"next"==o.settings.autoDirection?e=r.find(".bx-clone").first().position():i=o.children.first().position();var s="horizontal"==o.settings.mode?-e.left:-e.top,n="horizontal"==o.settings.mode?-i.left:-i.top,a={resetValue:n};b(s,"ticker",speed,a)},O=function(){o.touch={start:{x:0,y:0},end:{x:0,y:0}},o.viewport.bind("touchstart",X)},X=function(t){if(o.working)t.preventDefault();else{o.touch.originalPos=r.position();var e=t.originalEvent;o.touch.start.x=e.changedTouches[0].pageX,o.touch.start.y=e.changedTouches[0].pageY,o.viewport.bind("touchmove",Y),o.viewport.bind("touchend",V)}},Y=function(t){var e=t.originalEvent,i=Math.abs(e.changedTouches[0].pageX-o.touch.start.x),s=Math.abs(e.changedTouches[0].pageY-o.touch.start.y);if(3*i>s&&o.settings.preventDefaultSwipeX?t.preventDefault():3*s>i&&o.settings.preventDefaultSwipeY&&t.preventDefault(),"fade"!=o.settings.mode&&o.settings.oneToOneTouch){var n=0;if("horizontal"==o.settings.mode){var r=e.changedTouches[0].pageX-o.touch.start.x;n=o.touch.originalPos.left+r}else{var r=e.changedTouches[0].pageY-o.touch.start.y;n=o.touch.originalPos.top+r}b(n,"reset",0)}},V=function(t){o.viewport.unbind("touchmove",Y);var e=t.originalEvent,i=0;if(o.touch.end.x=e.changedTouches[0].pageX,o.touch.end.y=e.changedTouches[0].pageY,"fade"==o.settings.mode){var s=Math.abs(o.touch.start.x-o.touch.end.x);s>=o.settings.swipeThreshold&&(o.touch.start.x>o.touch.end.x?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto())}else{var s=0;"horizontal"==o.settings.mode?(s=o.touch.end.x-o.touch.start.x,i=o.touch.originalPos.left):(s=o.touch.end.y-o.touch.start.y,i=o.touch.originalPos.top),!o.settings.infiniteLoop&&(0==o.active.index&&s>0||o.active.last&&0>s)?b(i,"reset",200):Math.abs(s)>=o.settings.swipeThreshold?(0>s?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto()):b(i,"reset",200)}o.viewport.unbind("touchend",V)},B=function(){var e=t(window).width(),i=t(window).height();(a!=e||l!=i)&&(a=e,l=i,r.redrawSlider())};return r.goToSlide=function(e,i){if(!o.working&&o.active.index!=e)if(o.working=!0,o.oldIndex=o.active.index,o.active.index=0>e?x()-1:e>=x()?0:e,o.settings.onSlideBefore(o.children.eq(o.active.index),o.oldIndex,o.active.index),"next"==i?o.settings.onSlideNext(o.children.eq(o.active.index),o.oldIndex,o.active.index):"prev"==i&&o.settings.onSlidePrev(o.children.eq(o.active.index),o.oldIndex,o.active.index),o.active.last=o.active.index>=x()-1,o.settings.pager&&I(o.active.index),o.settings.controls&&W(),"fade"==o.settings.mode)o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed),o.children.filter(":visible").fadeOut(o.settings.speed).css({zIndex:0}),o.children.eq(o.active.index).css("zIndex",51).fadeIn(o.settings.speed,function(){t(this).css("zIndex",50),D()});else{o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed);var s=0,n={left:0,top:0};if(!o.settings.infiniteLoop&&o.carousel&&o.active.last)if("horizontal"==o.settings.mode){var a=o.children.eq(o.children.length-1);n=a.position(),s=o.viewport.width()-a.outerWidth()}else{var l=o.children.length-o.settings.minSlides;n=o.children.eq(l).position()}else if(o.carousel&&o.active.last&&"prev"==i){var d=1==o.settings.moveSlides?o.settings.maxSlides-m():(x()-1)*m()-(o.children.length-o.settings.maxSlides),a=r.children(".bx-clone").eq(d);n=a.position()}else if("next"==i&&0==o.active.index)n=r.find("> .bx-clone").eq(o.settings.maxSlides).position(),o.active.last=!1;else if(e>=0){var c=e*m();n=o.children.eq(c).position()}if("undefined"!=typeof n){var g="horizontal"==o.settings.mode?-(n.left-s):-n.top;b(g,"slide",o.settings.speed)}}},r.goToNextSlide=function(){if(o.settings.infiniteLoop||!o.active.last){var t=parseInt(o.active.index)+1;r.goToSlide(t,"next")}},r.goToPrevSlide=function(){if(o.settings.infiniteLoop||0!=o.active.index){var t=parseInt(o.active.index)-1;r.goToSlide(t,"prev")}},r.startAuto=function(t){o.interval||(o.interval=setInterval(function(){"next"==o.settings.autoDirection?r.goToNextSlide():r.goToPrevSlide()},o.settings.pause),o.settings.autoControls&&1!=t&&A("stop"))},r.stopAuto=function(t){o.interval&&(clearInterval(o.interval),o.interval=null,o.settings.autoControls&&1!=t&&A("start"))},r.getCurrentSlide=function(){return o.active.index},r.getSlideCount=function(){return o.children.length},r.redrawSlider=function(){o.children.add(r.find(".bx-clone")).outerWidth(u()),o.viewport.css("height",p()),o.settings.ticker||S(),o.active.last&&(o.active.index=x()-1),o.active.index>=x()&&(o.active.last=!0),o.settings.pager&&!o.settings.pagerCustom&&(w(),I(o.active.index))},r.destroySlider=function(){o.initialized&&(o.initialized=!1,t(".bx-clone",this).remove(),o.children.each(function(){void 0!=t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!=t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),o.controls.el&&o.controls.el.remove(),o.controls.next&&o.controls.next.remove(),o.controls.prev&&o.controls.prev.remove(),o.pagerEl&&o.pagerEl.remove(),t(".bx-caption",this).remove(),o.controls.autoEl&&o.controls.autoEl.remove(),clearInterval(o.interval),o.settings.responsive&&t(window).unbind("resize",B))},r.reloadSlider=function(t){void 0!=t&&(n=t),r.destroySlider(),d()},d(),this}}(jQuery);;/*! Lazy Load 1.9.5 - MIT license - Copyright 2010-2015 Mika Tuupola */
!function(a,b,c,d){var e=a(b);a.fn.lazyload=function(f){function g(){var b=0;i.each(function(){var c=a(this);if(!j.skip_invisible||c.is(":visible"))if(a.abovethetop(this,j)||a.leftofbegin(this,j));else if(a.belowthefold(this,j)||a.rightoffold(this,j)){if(++b>j.failure_limit)return!1}else c.trigger("appear"),b=0})}var h,i=this,j={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:!1,appear:null,load:null,placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"};return f&&(d!==f.failurelimit&&(f.failure_limit=f.failurelimit,delete f.failurelimit),d!==f.effectspeed&&(f.effect_speed=f.effectspeed,delete f.effectspeed),a.extend(j,f)),h=j.container===d||j.container===b?e:a(j.container),0===j.event.indexOf("scroll")&&h.bind(j.event,function(){return g()}),this.each(function(){var b=this,c=a(b);b.loaded=!1,(c.attr("src")===d||c.attr("src")===!1)&&c.is("img")&&c.attr("src",j.placeholder),c.one("appear",function(){if(!this.loaded){if(j.appear){var d=i.length;j.appear.call(b,d,j)}a("<img />").bind("load",function(){var d=c.attr("data-"+j.data_attribute);c.hide(),c.is("img")?c.attr("src",d):c.css("background-image","url('"+d+"')"),c[j.effect](j.effect_speed),b.loaded=!0;var e=a.grep(i,function(a){return!a.loaded});if(i=a(e),j.load){var f=i.length;j.load.call(b,f,j)}}).attr("src",c.attr("data-"+j.data_attribute))}}),0!==j.event.indexOf("scroll")&&c.bind(j.event,function(){b.loaded||c.trigger("appear")})}),e.bind("resize",function(){g()}),/(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion)&&e.bind("pageshow",function(b){b.originalEvent&&b.originalEvent.persisted&&i.each(function(){a(this).trigger("appear")})}),a(c).ready(function(){g()}),this},a.belowthefold=function(c,f){var g;return g=f.container===d||f.container===b?(b.innerHeight?b.innerHeight:e.height())+e.scrollTop():a(f.container).offset().top+a(f.container).height(),g<=a(c).offset().top-f.threshold},a.rightoffold=function(c,f){var g;return g=f.container===d||f.container===b?e.width()+e.scrollLeft():a(f.container).offset().left+a(f.container).width(),g<=a(c).offset().left-f.threshold},a.abovethetop=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollTop():a(f.container).offset().top,g>=a(c).offset().top+f.threshold+a(c).height()},a.leftofbegin=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollLeft():a(f.container).offset().left,g>=a(c).offset().left+f.threshold+a(c).width()},a.inviewport=function(b,c){return!(a.rightoffold(b,c)||a.leftofbegin(b,c)||a.belowthefold(b,c)||a.abovethetop(b,c))},a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-screen":function(b){return a.rightoffold(b,{threshold:0})},"left-of-screen":function(b){return!a.rightoffold(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})},"above-the-fold":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-fold":function(b){return a.rightoffold(b,{threshold:0})},"left-of-fold":function(b){return!a.rightoffold(b,{threshold:0})}})}(jQuery,window,document);;(function(e){"use strict";e.fn.pin=function(t){var n=0,r=[],i=false,s=e(window);t=t||{};var o=function(){for(var n=0,o=r.length;n<o;n++){var u=r[n];if(t.minWidth&&s.width()<=t.minWidth){if(u.parent().is(".pin-wrapper")){u.unwrap()}u.css({width:"",left:"",top:"",position:""});if(t.activeClass){u.removeClass(t.activeClass)}i=true;continue}else{i=false}var a=t.containerSelector?u.closest(t.containerSelector):e(document.body);var f=u.offset();var l=a.offset();var c=u.offsetParent().offset();if(!u.parent().is(".pin-wrapper")){u.wrap("<div class='pin-wrapper'>")}var h=e.extend({top:0,bottom:0},t.padding||{});u.data("pin",{pad:h,from:(t.containerSelector?l.top:f.top)-h.top,to:l.top+a.height()-u.outerHeight()-h.bottom,end:l.top+a.height(),parentTop:c.top});u.css({width:u.outerWidth()});u.parent().css("height",u.outerHeight())}};var u=function(){if(i){return}n=s.scrollTop();var o=[];for(var u=0,a=r.length;u<a;u++){var f=e(r[u]),l=f.data("pin");if(!l){continue}o.push(f);var c=l.from-l.pad.bottom,h=l.to-l.pad.top;if(c+f.outerHeight()>l.end){f.css("position","");continue}if(c<n&&h>n){!(f.css("position")=="fixed")&&f.css({left:f.offset().left,top:l.pad.top}).css("position","fixed");if(t.activeClass){f.addClass(t.activeClass)}}else if(n>=h){f.css({left:"",top:h-l.parentTop+l.pad.top}).css("position","absolute");if(t.activeClass){f.addClass(t.activeClass)}}else{f.css({position:"",top:"",left:""});if(t.activeClass){f.removeClass(t.activeClass)}}}r=o};var a=function(){o();u()};this.each(function(){var t=e(this),n=e(this).data("pin")||{};if(n&&n.update){return}r.push(t);e("img",this).one("load",o);n.update=a;e(this).data("pin",n)});s.scroll(u);s.resize(function(){o()});o();s.load(a);return this}})(jQuery)