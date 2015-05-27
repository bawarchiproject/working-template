/* global RR: true, TweenMax: true, jQuery: true, Modernizr: true, jRespond: true, Expo: true */
/* jshint unused: false */

/* requestAnimationFrame Shim */
(function () {
    'use strict';

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            },
                    timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/* Ripple Effect */
function ripple(e, el){
    'use strict';

    var inc = 0;
    
    // create SVG element
    var dummy = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    dummy.setAttributeNS(null, 'version', '1.1');
    dummy.setAttributeNS(null, 'width', '100%');
    dummy.setAttributeNS(null, 'height', '100%');
    dummy.setAttributeNS(null, 'class', 'ripple ripple' + inc);

    var ripplePosX = e.pageX - el.parent().offset().left;
    var ripplePosY = e.pageY - el.parent().offset().top;

    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttributeNS(null, 'transform', 'translate(' + ripplePosX + ', ' + ripplePosY + ')');

    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttributeNS(null, 'cx', 0);
    circle.setAttributeNS(null, 'cy', 0);
    circle.setAttributeNS(null, 'r', parseInt(el.outerWidth() / 2) + 25 );

    dummy.appendChild(g);
    g.appendChild(circle);
    el.append(dummy);

    var $ripple = el.find('.ripple' + inc);

    TweenMax.from( $ripple.find('circle'), 1, { attr: { r: 0 }, opacity: 0.75, ease: Expo.easeOut, onComplete: function (){
            $ripple.remove();
        }
    });

    inc++;
}

(function($, undefined){
    'use strict';

    // document ready begin
    // Using the shorthand method to save characters
    $(function() {

        // Init Lazy Loading
        $('img.lazy').lazyload({
            effect : 'fadeIn'
        });

        /* Placeholder Alternative */
        (function (){
            if ( Modernizr.placeholder === true ){
                var $inputText = $('.input-txt');

                $inputText
                    .each(function () {
                        var $this = $(this);
                       $this.addClass('blur').prop('value' , $this.attr('placeholder'));
                    })
                    .on('focus', function (){
                        var $this = $(this);
                        if ( $this.val() ===  $this.attr('placeholder')) $this.val('').removeClass('blur');
                    })
                    .on('blur', function (){
                        var $this = $(this);
                        if ( $this.val() ===  '') $this.val($this.attr('placeholder')).addClass('blur');
                });
            }
        })();


        /* Backstretch Alternative */
        (function (){
            var $backStretch = $('.backstretch');

            $backStretch.each(function (){
                var $this = $(this);
                if(Modernizr.bgsizecover === true) {
                    $this.css({ 'background-image'  : 'url(' + $this.data('background') + ')' });
                } else {
                    // Do your alternative background cover magic
                }
            });
        })();


        /* JRespond Breakpoints */
        var jRes = jRespond([
            {
                label: 'mobile',
                enter: 0,
                exit: 767
            },{
                label: 'tablet',
                enter: 768,
                exit: 1023
            },{
                label: 'desktop',
                enter: 1024,
                exit: 10000
            }
        ]);

        /* JRespond Functions(Desktop) */
        jRes.addFunc({
            breakpoint: ['desktop'],
            enter: function() {
                RR.tableScrollbar.wrap();
            },
            exit: function (){
                RR.tableScrollbar.unwrap();
            }
        });

        /* JRespond Functions(Tablet) */
        jRes.addFunc({
            breakpoint: ['tablet'],
            enter: function() {
                RR.tableScrollbar.wrap();
            },
            exit: function() {
                RR.tableScrollbar.unwrap();
            }
        });


        /* JRespond Functions(Mobile) */
        jRes.addFunc({
            breakpoint: ['mobile'],
            enter: function() {
                RR.tableScrollbar.wrap();
            },
            exit: function() {
                RR.tableScrollbar.unwrap();
            }
        });

    });
}(jQuery));