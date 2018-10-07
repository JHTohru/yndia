define([
    'require',
    'jquery',
    'structures/content',
    'structures/mobile-menu',
    'structures/desktop-menu',
    'pages/home',
    'pages/find-us',
    'pages/manifesto',
    'pages/slow-carbonation',
    'pages/cocktails',
    'pages/the-bottle',
    'common/preloadCSSIMGs',
    'common/utils',
    'common/navigation',
], (require) => {
    //
    const $ = require('jquery');

    // Site structures
    const mobileMenu = require('structures/mobile-menu');
    const content = require('structures/content');

    //
    const home = require('pages/home');
    const findUs = require('pages/find-us');
    const manifesto = require('pages/manifesto');
    const slowCarbonation = require('pages/slow-carbonation');
    const cocktails = require('pages/cocktails');
    const theBottle = require('pages/the-bottle');

    // Pages
    const homePage = home.buildPage();
    const findUsPage = findUs.buildPage();
    const manifestoPage = manifesto.buildPage();
    const slowCarbonationPage = slowCarbonation.buildPage();
    const cocktailsPage = cocktails.buildPage();
    const theBottlePage = theBottle.buildPage();

    // The Bottle Menu
    const theBottleMenu = require('structures/desktop-menu')();

    $(theBottleMenu).addClass('the-bottle-menu d-none');

    //
    $(content)
        .prepend(findUsPage)
        .append(homePage, theBottleMenu, theBottlePage)
        .find('#horizontal-slider')
        .append(manifestoPage, slowCarbonationPage, cocktailsPage);

    //
    const whenAllImagesAreLoaded = require('common/utils').whenAllImagesAreLoaded;
    whenAllImagesAreLoaded(() => showtime());

    //
    $(content)
        .find('.carousel')
        .each(function() {
            const $carouselItems = $(this).find('.carousel-item');
            const $activeCarouselItem = $carouselItems.filter('.active');
            const carouselItemsLength = $carouselItems.length;
            const activeCarouselItemIndex = $carouselItems.index($activeCarouselItem);

            if (activeCarouselItemIndex === 0) {
                $(content).find(`.carousel-control-prev[href="#${$(this).attr('id')}"]`).addClass('disabled');
            }

            if (activeCarouselItemIndex === carouselItemsLength - 1) {
                $(content).find(`.carousel-control-next[href="#${$(this).attr('id')}"]`).addClass('disabled');
            }
        })
        .on({ 'slide.bs.carousel'(event) {
            if (event.to === 0) {
                $(content).find(`.carousel-control-prev[href="#${$(this).attr('id')}"]`).addClass('disabled');
            } else {
                $(content).find(`.carousel-control-prev[href="#${$(this).attr('id')}"]`).removeClass('disabled');
            }

            if (event.to === $(this).find('.carousel-item').length - 1) {
                $(content).find(`.carousel-control-next[href="#${$(this).attr('id')}"]`).addClass('disabled');
            } else {
                $(content).find(`.carousel-control-next[href="#${$(this).attr('id')}"]`).removeClass('disabled');
            }
        }, });

    //
    const $body = $('body');

    const goToURL = require('common/navigation').goToURL;
    $body.prepend(mobileMenu, content)
        .find('a[href^="#"]')
        .on({ click(event) {
            event.preventDefault();
            goToURL($(this).attr('href'));
        }, });

    const goToPrevPage = require('common/navigation').goToPrevPage;
    $body.find('.prev-page-btn')
        .on({ click(event) {
            event.preventDefault();
            goToPrevPage();
        }});

    const goToNextPage = require('common/navigation').goToNextPage;
    $body.find('.next-page-btn')
        .on({ click(event) {
            event.preventDefault();
            goToNextPage();
        }});

    //
    const preloadCSSIMGs = require('common/preloadCSSIMGs');
    preloadCSSIMGs();

    const loadAllIMGs = require('common/utils').loadAllIMGs;
    loadAllIMGs();

    //
    const bootstrap = require('common/navigation').bootstrap;
    bootstrap();


});
