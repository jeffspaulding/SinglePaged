
$.extend($.easing,
{
    def: 'easeOutQuad',
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

(function( $ ) {

    var settings;
    var disableScrollFn = false;
    var navItems;
    var navs = {}, sections = {};

    $.fn.navScroller = function(options) {
        settings = $.extend({
            scrollToOffset: 170,
            scrollSpeed: 800,
            activateParentNode: true,
        }, options );
        navItems = this;

        //attatch click listeners
    	navItems.on('click', function(event){
    		event.preventDefault();
            var navID = $(this).attr("href").substring(1);
            disableScrollFn = true;
            activateNav(navID);
            populateDestinations(); //recalculate these!
        	$('html,body').animate({scrollTop: sections[navID] - settings.scrollToOffset},
                settings.scrollSpeed, "easeInOutExpo", function(){
                    disableScrollFn = false;
                }
            );
    	});

        //populate lookup of clicable elements and destination sections
        populateDestinations(); //should also be run on browser resize, btw

        // setup scroll listener
        $(document).scroll(function(){
            if (disableScrollFn) { return; }
            var page_height = $(window).height();
            var pos = $(this).scrollTop();
            for (i in sections) {
                if ((pos + settings.scrollToOffset >= sections[i]) && sections[i] < pos + page_height){
                    activateNav(i);
                }
            }
        });
    };

    function populateDestinations() {
        navItems.each(function(){
            var scrollID = $(this).attr('href').substring(1);
            navs[scrollID] = (settings.activateParentNode)? this.parentNode : this;
            sections[scrollID] = $(document.getElementById(scrollID)).offset().top;
        });
    }

    function activateNav(navID) {
        for (nav in navs) { $(navs[nav]).removeClass('active'); }
        $(navs[navID]).addClass('active');
    }
})( jQuery );


$(document).ready(function (){

    $('nav li a').navScroller();

    //section divider icon click gently scrolls to reveal the section
	$(".sectiondivider").on('click', function(event) {
    	$('html,body').animate({scrollTop: $(event.target.parentNode).offset().top - 50}, 400, "linear");
	});

    //links going to other sections nicely scroll
	$(".container a").each(function(){
        if ($(this).attr("href").charAt(0) == '#'){
            $(this).on('click', function(event) {
        		event.preventDefault();
                var target = $(event.target).closest("a");
                var targetHight =  $(target.attr("href")).offset().top
            	$('html,body').animate({scrollTop: targetHight - 170}, 800, "easeInOutExpo");
            });
        }
	});

    var trickerColors = ['#FFEB3B', '#E91E63', '#00BCD4', '#CDDC39', '#F44336', '#8BC34A', '#FFC107']
    var trickerCounter = 0;
    $(".tricker h2").each(function() {
        $(this).css('color', trickerColors[trickerCounter]);
        trickerCounter ++;
        if(trickerCounter == trickerColors.length) {
            trickerCounter = 0;
        }
    });
    // Rotating text by Ahmed Beheiry: https://codepen.io/ahmedbeheiry/pen/vgoeRv
    var duration = 3000;  // change this to change rotation time in milliseconds
    var current = 1;
    var tricker = $(".tricker");
    var height = tricker.height();
    var number = tricker.children().length;
    var first = tricker.children().first();

    setInterval(function() {
        var interv = current * -1 * height;
        first.css("margin-top", interv + "px");
        if (current == number) {
          first.css("margin-top", "0px");
          current = 1;
        } else {
          current++;
        }
    }, duration);

    // Resize the bookshelf to maintain aspect ratio
    var bookshelfHeight = $("#bookshelf").width() * 0.55;
    $("#bookshelf").css("height", bookshelfHeight);

    $(window).resize(function() {
        var bookshelfHeight = $("#bookshelf").width() * 0.55;
        $("#bookshelf").css("height", bookshelfHeight);
    });
});

