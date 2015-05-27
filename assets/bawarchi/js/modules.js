/*! bawarchi 2015-05-26 */
/**
 * RR - Awesome Mobile Menu
 */
var RR = (function (parent, $){
    "use strict";

    var slider = $(".bxslider");

    var desktop = function (){
        slider = $(".bxslider").bxSlider({
            autoStart       : true,
            pager           : false,
            maxSlides       : 4,
            slideWidth      : 138,
            slideMargin     : 50,
            moveSlides      : 4,
            prevText        : "",
            nextText        : ""
        });
    };

    var tablet = function (){
        slider = $(".bxslider").bxSlider({
            autoStart       : true,
            pager           : false,
            maxSlides       : 4,
            slideWidth      : 138,
            slideMargin     : 25,
            moveSlides      : 4,
            prevText        : "",
            nextText        : ""
        });
    };

    var mobile = function (){
        slider = $(".bxslider").bxSlider({
            autoStart       : true,
            pager           : true,
            moveSlides      : 1,
            prevText        : "",
            nextText        : ""
        });
    };

    var destroy = function (){
        slider.destroySlider();
    };


    /**
     * Export module method
     */
    parent.bxSlider = {
        desktop: desktop,
        tablet: tablet,
        mobile: mobile,
        destroy: destroy
    };

    return parent;

}(RR || {}, jQuery));;/**
 * RR - Awesome Icon Animation
 */
var RR = (function (parent, $){
    'use strict';

    var $primaryNav = $('#primary-nav'),
        $lvl1 = $primaryNav.find('.lvl1'),
        $lvl2 = $primaryNav.find('.lvl2'),
        $lvl3 = $primaryNav.find('.lvl3'),
        $set = $lvl1.add( $lvl2 ).add( $lvl3 ),
        $tabHeight = $lvl1.find('li').height();

    var setup = function (){
        var $btn = $('.btn'),
            $hamburger = $('.icon-hamburger'),
            $hamCross = $('.icon-ham-cross'),
            $hamCrossAlt = $('.icon-ham-cross-alt'),
            $magnify = $('.icon-magnify'),
            $arrowToggle = $('.icon-arrow-toggle'),
            $plusMinus = $('.icon-plusminus-toggle');

        $btn.on('mouseover', function (e){
            var $this =  $(this),
                newHover = e.relatedTarget;

            if( newHover === $this[0] ) return;
            if( $.contains($this[0], newHover) ) return;
        }).on('mouseout', function (e){
            var $this =  $(this),
                newHover = e.relatedTarget;

            if( newHover === $this[0] ) return;
            if( $.contains($this[0], newHover) ) return;
        });

        $hamburger.on('mouseover', function (){
            var $this = $(this);

            if ( !$this.hasClass('active') ){
                TweenMax.to( $this.find('path:nth-child(1)'), 0.5, { y: -5, ease: Expo.easeOut });
                TweenMax.to( $this.find('path:nth-child(3)'), 0.5, { y: 5, ease: Expo.easeOut });
            }
        }).on('mouseout', function (){
            var $this = $(this);

            if ( !$this.hasClass('active') )
                TweenMax.to( $this.find('path:nth-child(1), path:nth-child(3)'), 0.5, { y: 0, ease: Expo.easeOut });
        });

        $hamCross.on('click', function (){
            var $this = $(this);

            if ( $this.hasClass('active') ){
                $this.removeClass('active');

                TweenMax.to( $this.find('path:nth-child(1)'), 0.5, { x: 0, y: 0, rotation: 0, ease: Expo.easeOut });
                TweenMax.to( $this.find('path:nth-child(2)'), 0.5, { opacity: 1, ease: Expo.easeOut });
                TweenMax.to( $this.find('path:nth-child(3)'), 0.5, { x: 0, y: 0, rotation: 0, ease: Expo.easeOut });
            } else {
                $this.addClass('active');

                TweenMax.to( $this.find('path:nth-child(1)'), 0.5, { x: 4, y: 0, rotation: 45, ease: Expo.easeOut });
                TweenMax.to( $this.find('path:nth-child(2)'), 0.5, { opacity: 0, ease: Expo.easeOut });
                TweenMax.to( $this.find('path:nth-child(3)'), 0.5, { x: 4, y: 0, rotation: -45, ease: Expo.easeOut });
            }
        });


        var tl = new TimelineMax();

        tl.to( $hamCross.find('path:nth-child(1)'), 0.2, { top: 4, ease: Expo.easeInOut });
        tl.to( $hamCross.find('path:nth-child(3)'), 0.2, { top: -4, ease: Expo.easeInOut }, '-=0.2');

        tl.to( $hamCross.find('path:nth-child(2)'), 0.2, { opacity: 0, ease: Expo.easeInOut });
        tl.to( $hamCross.find('path:nth-child(1)'), 0.2, { rotation: 45, ease: Expo.easeInOut }, '-=0.2');
        tl.to( $hamCross.find('path:nth-child(3)'), 0.2, { rotation: -45, ease: Expo.easeInOut }, '-=0.2');


        // Stop the Timeline at 0 else the animation will play after initiation
        tl.pause();

        $hamCrossAlt.on('click', function (){
            var $this = $(this);

            if ( $this.hasClass('active') ){
                $this.removeClass('active');

                TweenMax.to( $this.find('path:nth-child(1)'), 0.5, { rotation: 0, transformOrigin:"center center", ease: Expo.easeOut});
                TweenMax.to( $this.find('path:nth-child(3)'), 0.5, { rotation: 0, transformOrigin:"center center", ease: Expo.easeOut});

                TweenMax.to( $this.find('path:nth-child(1)'), 0.5, { x: 0, y: 0, rotation: 0, ease: Expo.easeOut, delay: 0.25 });
                TweenMax.to( $this.find('path:nth-child(2)'), 0.5, { opacity: 1, ease: Expo.easeOut, delay: 0.25 });
                TweenMax.to( $this.find('path:nth-child(3)'), 0.5, { x: 0, y: 0, rotation: 0, ease: Expo.easeOut, delay: 0.25 });
            } else {
                $this.addClass('active');

                TweenMax.to( $this.find('path:nth-child(1)'), 0.5, { x: 0, y: 10, ease: Expo.easeOut });
                TweenMax.to( $this.find('path:nth-child(3)'), 0.5, { x: 0, y: -10, ease: Expo.easeOut });

                TweenMax.to( $this.find('path:nth-child(1)'), 0.5, { rotation: 45, transformOrigin:"center center", ease: Expo.easeOut, delay: 0.25 });
                TweenMax.to( $this.find('path:nth-child(2)'), 0.5, { opacity: 0, ease: Expo.easeOut });
                TweenMax.to( $this.find('path:nth-child(3)'), 0.5, { rotation: -45, transformOrigin:"center center", ease: Expo.easeOut, delay: 0.25 });
            }
        });


        $magnify.on('mouseover', function (){
            var $this = $(this);

            TweenMax.to( $this.find('svg'), 0.5, { scale: 1, ease: Expo.easeOut });
            TweenMax.to( $this.find('path:nth-child(2), path:nth-child(3)'), 0.5, { rotation: 180, scale: 1, opacity: 1, transformOrigin:'50% 50%', ease: Expo.easeOut, delay: 0.1 });
        }).on('mouseout', function (){
            var $this = $(this);

            TweenMax.to( $this.find('svg'), 0.5, { scale: 0.75, ease: Expo.easeOut });
            TweenMax.to( $this.find('path:nth-child(2), path:nth-child(3)'), 0.5, { rotation: 0, scale: 0, opacity: 0, transformOrigin:'50% 50%', ease: Expo.easeOut, delay: 0.1 });
        });


        $arrowToggle.on('mouseover', function (){
            var $this = $(this);

            if ( $this.hasClass('active') )
                TweenMax.to( $this.find('svg'), 0.5, { y: -5, ease: Expo.EaseOut });
            else
                TweenMax.to( $this.find('svg'), 0.5, { y: 5, ease: Expo.EaseOut });
        }).on('mouseout', function (){
            var $this = $(this);

            if ( $this.hasClass('active') )
                TweenMax.to( $this.find('svg'), 0.5, { y: -0, ease: Expo.EaseOut });
            else
                TweenMax.to( $this.find('svg'), 0.5, { y: 0, ease: Expo.EaseOut });
        }).on('click', function(){
            var $this = $(this);

            if ( $this.hasClass('active') ){
                $this.removeClass('active');
                TweenMax.to( $this.find('svg'), 0.3, { y: 0, transformOrigin:'50% 50%', rotation: 0, ease: Expo.EaseOut });
            } else {
                $this.addClass('active');
                TweenMax.to( $this.find('svg'), 0.3, { y: 0, transformOrigin:'50% 50%', rotation: 180, ease: Expo.EaseOut });
            }
        });

        $plusMinus.on('mouseover', function (){
            var $this = $(this);

            // if ( !$this.hasClass('active') )
                TweenMax.staggerTo( $this.find('path'), 0.5, { rotation: 180, scale: 1, ease: Expo.easeOut }, 0.05 );
        }).on('mouseout', function (){
            var $this = $(this);

            // if ( !$this.hasClass('active') )
                TweenMax.staggerTo( $this.find('path'), 0.5, { rotation: 0, scale: 0.75, ease: Expo.easeOut }, 0.05 );
        }).on('click', function (){
            var $this = $(this);

            if ( $this.hasClass('active') ){
                $this.removeClass('active');
                TweenMax.staggerTo( $this.find('path'), 0.5, { rotation: 360, ease: Expo.easeOut }, 0.05 );
                TweenMax.to( $this.find('path:nth-child(1)'), 0.5, { opacity: 1, ease: Expo.easeOut });
            } else {
                $this.addClass('active');
                TweenMax.staggerTo( $this.find('path'), 0.5, { rotation: 0, ease: Expo.easeOut }, 0.05 );
                TweenMax.to( $this.find('path:nth-child(1)'), 0.5, { opacity: 0, ease: Expo.easeOut });
            }
        }).find('path').each(function (){
            TweenMax.to( $(this), 0.5, { scale: 0.75, transformOrigin:'50% 50%', ease: Expo.easeOut });
        });
    };

    // Export module method
    parent.iconAnimation = {
        setup: setup
    };

    return parent;

}(RR || {}, jQuery));

jQuery(function($){
    // Self-init Call
    RR.iconAnimation.setup();
});;/* global RR: true, TweenMax: true, TimelineMax: true, jQuery: true, ripple: true, Ease: true, Expo: true */
/* jshint unused: false */

/**
 * RR - Awesome Mobile Menu
 */
var RR = (function (parent, $){
    'use strict';

    var $primaryNav = $('#primary-nav'),
        $lvl1 = $primaryNav.find('.lvl1'),
        $lvl2 = $primaryNav.find('.lvl2'),
        $lvl3 = $primaryNav.find('.lvl3'),
        $set = $lvl1.add( $lvl2 ).add( $lvl3 ),
        $tabHeight = $lvl1.find('li').height(),
        isMobileDevice = $(window).width() < 768 ? 1 : 0;

    var setup = function (){
        var $mobileMenuMarkup = '<button class="menu mobile-only js-mobile-menu"><span class="line top"></span><span class="line mid"></span><span class="line bot"></span></button>',
            $subNavMarkup = '<button class="sub-nav js-sub-nav icon-arrow"><span class="vh">Sub-navigation</span></button>';


        // Insert Mobile Menu button after the logo on mobile
        $primaryNav.find('h1').after( $mobileMenuMarkup );


        // Insert Subnav Markup after Level 1 menu items
        $lvl1.find('ul').each(function (){
            $(this).before( $subNavMarkup );
        });


        // TimelineMax the menu-icon animation for easier control on Touch/Mouse Events
        var tl = new TimelineMax();

        tl.to( $primaryNav.find('.top'), 0.2, { top: 4, ease: Expo.easeInOut });
        tl.to( $primaryNav.find('.bot'), 0.2, { top: -10, ease: Expo.easeInOut }, '-=0.2');

        tl.to( $primaryNav.find('.mid'), 0.2, { opacity: 0, ease: Expo.easeInOut });
        tl.to( $primaryNav.find('.top'), 0.2, { rotation: 45, ease: Expo.easeInOut }, '-=0.2');
        tl.to( $primaryNav.find('.bot'), 0.2, { rotation: -45, ease: Expo.easeInOut }, '-=0.2');


        // Stop the Timeline at 0 else the animation will play after initiation
        tl.pause();


        // Declare Eventlisteners
        var $mobileMenu = $('.js-mobile-menu'),
            $subNav = $('.js-sub-nav'),
            $dropdownList = $primaryNav.find('ul li');

        $mobileMenu.on('click', function (){
            if ( !$primaryNav.hasClass('active') ) {
                $primaryNav.addClass('active');

                tl.play();

                $lvl1.slideDown(function (){
                    TweenMax.staggerTo( $lvl1.find('> li'), 2, { opacity: 1, top: 0, ease: Expo.easeOut }, 0.1 );
                });

                TweenMax.to( window, 0.75, { scrollTo: { y: 0, ease: Ease.easeInOut } } );
            } else {
                $primaryNav.removeClass('active');

                tl.reverse();

                $set
                    .slideUp()
                    .find('.icon-arrow.active')
                    .removeClass('active');

                TweenMax.staggerTo( $dropdownList, 0.5, { opacity: 0, top: -20, ease: Expo.easeOut }, 0.1 );

                TweenMax.to( window, 0.75, { scrollTo: { y: 0, ease: Ease.easeInOut } } );
            }
        });

        $subNav.on('touchend, click', function() {
            var $this = $(this),
                $parentIndex,
                $index;

            if ( $this.hasClass('active') ) {
                if ( $this.next().hasClass('lvl2') ) {
                    $this.removeClass('active')
                        .next()
                            .slideUp()
                            .find('.icon-arrow.active')
                                .removeClass('active')
                                    .next()
                                    .slideUp();

                    TweenMax.staggerTo( $lvl2.find('li'), 0.5, { opacity: 0, top: -20, ease: Expo.easeOut }, 0.1 );
                    TweenMax.to( window, 0.75, { scrollTo: { y: 0, ease: Ease.easeInOut } } );
                } else {
                    $index = $this.parent().parent().parent().index();

                    if ( $this.parent().parent().hasClass('lvl1') ){
                        $parentIndex = 0;
                    } else if ( $this.parent().parent().hasClass('lvl2') ){
                        $parentIndex = $this.parent().parent().parent().index();
                    } else {
                        $parentIndex = $this.parent().parent().index();
                    }

                    $this.removeClass('active')
                        .next()
                            .slideUp(function (){
                                TweenMax.to( window, 0.75, { scrollTo: { y: ($parentIndex * $tabHeight), ease: Ease.easeInOut } } );
                            });

                    TweenMax.staggerTo( $lvl3.find('li'), 0.5, { opacity: 0, top: -20, ease: Expo.easeOut }, 0.1 );
                }
            } else {
                if ($this.parent().parent().hasClass('lvl1')) {
                    $index = $this.parent().index();
                    $parentIndex = 0;

                    $lvl1.find('.icon-arrow.active').removeClass('active');
                    $lvl2.slideUp();
                    $lvl3.slideUp();

                    TweenMax.staggerTo( $lvl2.find('li'), 0.5, { opacity: 0, top: -20, ease: Expo.easeOut }, 0.1 );
                    TweenMax.staggerTo( $lvl3.find('li'), 0.5, { opacity: 0, top: -20, ease: Expo.easeOut }, 0.1 );
                } else if ($this.parent().parent().hasClass('lvl2')) {
                    $index = $this.parent().index();
                    $parentIndex = $this.parent().parent().parent().index() + 1;

                    $lvl2.find('.icon-arrow.active').removeClass('active');
                    $lvl3.slideUp();

                    TweenMax.staggerTo( $lvl3.find('li'), 0.5, { opacity: 0, top: -20, ease: Expo.easeOut }, 0.1 );
                } else {
                    $index = $this.parent().index();
                    $parentIndex = $this.parent().parent().index();
                }

                $this.addClass('active').next().slideDown(function (){
                    TweenMax.to( window, 0.75, { scrollTo: { y: $this.offset().top - $tabHeight, ease: Ease.easeInOut } } );
                    TweenMax.staggerTo( $this.next().find('> li'), 2, { opacity: 1, top: 0, ease: Expo.easeOut }, 0.1 );
                });
            }
        });


        // Primary Nav Mouse Listeners
        $primaryNav.on('mouseover', '.no-link', function (){
            var $this = $(this);

            if ( !isMobileDevice ){
                $this.next().next().stop( true, false ).slideDown();
            }
        }).on('mouseout', '.no-link', function (){
            var $this = $(this);

            if ( !isMobileDevice ){
                $this.next().next().stop( true, false ).slideUp();
            }
        }).on('click', '.no-link', function (e){
            e.preventDefault();
            var $this = $(this);

            if ( isMobileDevice ){
                $this.next().trigger('click');
            }

            ripple(e, $this);
        }).on('mouseover', '.lvl2 a', function (){
            var $this = $(this);

            $this.parent().parent().stop( true, false ).slideDown();
        }).on('mouseout', '.lvl2 a', function (){
            var $this = $(this);

            $this.parent().parent().stop( true, false ).slideUp();
        }).on('click', '.lvl2 a', function (e){
            var $this = $(this);

            if ( isMobileDevice ){
                $this.next().trigger('click');
            }

            ripple(e, $this);
        });
    };

    // Export module method
    parent.mobileMenu = {
        setup: setup
    };

    return parent;

}(RR || {}, jQuery));

jQuery(function($){
    // Self-init Call
    RR.mobileMenu.setup();
});;/**
 * Wrap all tables in a <div class='table-wrapper' />
 * Print table in PDF for mobile users (dependent on jspdf.custom.js)
 */
var RR = (function (parent, $) {
    'use strict';

    $.fn.hasHorizontalScrollBar = function() {
        return this.get(0).scrollWidth > this.width();
    };

    var wrap = function() {
        var $contentTable = $('.printableTable');

        if ( !$contentTable.parent().hasClass('table-wrapper') && $contentTable.parent().hasHorizontalScrollBar() ){
            $contentTable.pdfTable( 'init', {
                position: 'float', // top, bottom, float
                orientation: 'l',   // landscape (l), portrait (p)
                unit: 'pt',         // pt, mm, cm, in.
                format: 'a4',       // a3, a4, a5, letter, legal
                marginTop: 20,
                marginRight: 20,
                marginBottom: 20,
                marginLeft: 20,
            });
        }
    };

    var unwrap = function (){
        var $contentTable = $('.printableTable');

        $contentTable.pdfTable('destroy');
    };

    parent.tableScrollbar = {
        wrap: wrap,
        unwrap: unwrap
    };

    return parent;

}(RR || {}, jQuery));