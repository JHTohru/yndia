define([
    'require',
    'data/main-menu-desktop',
    'pages/home',
    'pages/find-us',
    'pages/manifesto',
    'pages/slow-carbonation',
    'pages/cocktails',
    'pages/the-bottle',
], (require) => {
    const pages = require('data/main-menu-desktop');
    let activePage = null;
    let savedURL = '';
    let firstShow = true;

    function getPageByURL(url) {
        return pages.find(p => p.url === url);
    }

    function TransitionStage() {
        const fnQueue = [];

        this.add = (transitionFn) => {
            if (typeof transitionFn === 'function') {
                return  fnQueue.push(transitionFn);
            }

            return false;
        };

        this.execute = (nextStage) => {
            const queue = {};

            fnQueue.forEach(fn => $(queue).queue(fn));

            $(queue).queue((next) => {
                nextStage();

                return next();
            });
        };
    }

    function executeTransitionStages(transitionStages) {
        const queue = {};

        transitionStages.forEach((stage) => {
            if (stage instanceof TransitionStage) {
                $(queue).queue(stage.execute);
            }
        });
    }

    function isMobile() {
        return window.matchMedia('(max-width: 767px)').matches;
    }

    function goToURL(newURL) {
        const newActivePage = getPageByURL(newURL);

        if (!newActivePage || (activePage && newActivePage.url === activePage.url)) {
            return false;
        }

        const initialStage = new TransitionStage();

        initialStage.add((next) => {
            const $body = $('body');
            const pageId = newURL.split('#').pop();

            const formerBodyClasses = $body.attr('class');

            if (formerBodyClasses) {
                const formerActivePageMatches
                    = formerBodyClasses.match(/active-page-([a-z-]+)/i);

                if (formerActivePageMatches) {
                    $body.removeClass(formerActivePageMatches[0])
                }
            }

            const newActivePageClass = `active-page-${pageId}`;

            $body
                .addClass(newActivePageClass)
                .attr('data-active-page', pageId);

            if (newURL === '#home') {
                const uri = window.location.toString();

                if (uri.indexOf("#") > 0) {
                    const clean_uri = uri.substring(0, uri.indexOf("#"));

                    window.history.replaceState({}, document.title, clean_uri);
                }
            } else {
                const newHash = newURL !== '#home' ? newURL : '';

                window.history.pushState(null, null, newHash);
            }

            activePage = newActivePage;

            return next();
        });

        const finalStage = new TransitionStage();

        finalStage.add(next => next());

        const settingTransition = new TransitionStage();
        const beforeTransition = new TransitionStage();
        const duringTransition = new TransitionStage();
        const afterTransition = new TransitionStage();

        const home = require('pages/home');
        const findUs = require('pages/find-us');
        const manifesto = require('pages/manifesto');
        const slowCarbonation = require('pages/slow-carbonation');
        const cocktails = require('pages/cocktails');
        const theBottle = require('pages/the-bottle');

        const $home = $('#home');
        const $findUs = $('#find-us');
        const $frame = $('#frame');
        const $framePrevBtn = $frame.children('.nav-btn.left');
        const $frameNextBtn = $frame.children('.nav-btn.right');
        const $frameSea = $frame.find('.sea');
        const $horizontalSlider = $('#horizontal-slider');
        const $theBottle = $('#the-bottle');
        const $theBottleMenu = $('.the-bottle-menu');
        const $theBottleSea = $theBottle.find('.sea');

        const animDur = 200;
        const turnOffDelay = 200;
        const turnOnDelay = 35;

        if (newURL === '#home') {
            beforeTransition.add((next) => {
                home.turnOn();

                return setTimeout(() => next(), turnOnDelay);
            });

            duringTransition.add((next) => {
                $home.css('transform', 'translateY(0)');

                return setTimeout(() => next(), animDur);
            });
        } else if (newURL === '#find-us') {
            beforeTransition.add((next) => {
                findUs.turnOn();

                return setTimeout(() => next(), turnOnDelay);
            });
        } else if (newURL === '#manifesto' || newURL === '#slow-carbonation' || newURL === '#cocktails') {
            beforeTransition.add((next) => {
                $frame.show();

                return next();
            });

            beforeTransition.add((next) => {
                $frame.css('transform', 'translateY(0)');

                return next();
            });

            if (newURL === '#manifesto') {
                beforeTransition.add((next) => {
                    if ($('#manifesto-carousel').find('.carousel-item.active').is(':first-of-type')) {
                        $framePrevBtn.addClass('up');
                    }

                    return next();
                });

                beforeTransition.add((next) => {
                    manifesto.turnOn();

                    return setTimeout(() => next(), turnOnDelay);
                });
            } else if (newURL === '#slow-carbonation') {
                beforeTransition.add((next) => {
                    slowCarbonation.turnOn();

                    return setTimeout(() => next(), turnOnDelay);
                });
            } else if (newURL === '#cocktails') {
                settingTransition.add((next) => {
                    $frameNextBtn.addClass('down');

                    return next();
                });

                beforeTransition.add((next) => {
                    cocktails.turnOn();

                    return setTimeout(() => next(), turnOnDelay);
                });
            }
        } else if (newURL === '#the-bottle') {
            beforeTransition.add((next) => {
                theBottle.turnOn();

                return setTimeout(() => next(), turnOnDelay);
            });
        }

        if (activePage) {
            const formerURL = activePage.url;

            if (formerURL === '#home') {
                if (firstShow) {
                    firstShow = false;

                    if (!isMobile()) {
                        const $navigationTutorial = $('#navigation-tutorial');
                        const $tryExtraDry = $('#try-extra-dry');

                        settingTransition.add((next) => {
                            $navigationTutorial.removeClass('d-none');

                            return next();
                        });

                        finalStage.add((next) => {
                            $navigationTutorial.addClass('animated');

                            return setTimeout(() => next(), 5000);
                        });

                        finalStage.add((next) => {
                            $navigationTutorial.css('opacity', 0);

                            return setTimeout(() => next(), animDur);
                        });

                        finalStage.add((next) => {
                            $navigationTutorial.remove();

                            return next();
                        });

                        finalStage.add((next) => {
                            $tryExtraDry.addClass('expanded');

                            return setTimeout(() => next(), 2000);
                        });

                        finalStage.add((next) => {
                            $tryExtraDry.removeClass('expanded');

                            return next();
                        });
                    }
                }

                duringTransition.add((next) => {
                    $home.css('transform', 'translateY(-100vh)');

                    return setTimeout(() => next(), animDur);
                });

                afterTransition.add((next) => {
                    setTimeout(() => home.turnOff(), turnOffDelay);

                    return next();
                });

                if (newURL === '#find-us') {
                    settingTransition.add((next) => {
                        $findUs.css('transform', 'translateY(0)');

                        return next();
                    });
                } else if (newURL === '#manifesto' || newURL === '#slow-carbonation' || newURL === '#cocktails') {
                    settingTransition.add((next) => {
                        $frame.css('transform', 'translateY(0)');

                        return next();
                    });
                } else if (newURL === '#the-bottle') {
                    settingTransition.add((next) => {
                        $theBottle.css('transform', 'translateY(0)');

                        return next();
                    });

                    settingTransition.add((next) => {
                        $theBottleMenu.removeClass('d-none');

                        return next();
                    });

                    if (!isMobile()) {
                        beforeTransition.add((next) => {
                            $theBottle.scrollTop($theBottle[0].scrollHeight - $theBottle.height());

                            return next();
                        });
                    }
                }
            } else {
                if (formerURL === '#find-us') {
                    if (newURL !== '#home') {
                        if (!isMobile()) {
                            beforeTransition.add((next) => $findUs.animate(
                                { scrollTop: $findUs[0].scrollHeight + $findUs.height() },
                                { always: () => next() }
                            ));
                        }

                        afterTransition.add((next) => {
                            setTimeout(() => findUs.turnOff(), turnOffDelay);

                            return next();
                        });

                        if (newURL === '#manifesto' || newURL === '#slow-carbonation' || newURL === '#cocktails') {
                            duringTransition.add((next) => {
                                $findUs.css('transform', 'translateY(-100vh)');

                                return next();
                            });

                            settingTransition.add((next) => {
                                $frame.css('transform', 'translateY(100vh)');

                                return next();
                            });

                            duringTransition.add((next) => {
                                $frame.css('transform', 'translateY(0)');

                                return next();
                            });

                            if (newURL === '#manifesto') {
                                settingTransition.add((next) => {
                                    $framePrevBtn.removeClass('up');

                                    return next();
                                });
                            }
                        } else {
                            afterTransition.add((next) => {
                                $findUs.css('transform', 'translateY(-100vh)');

                                return next();
                            });
                        }
                    }
                } else if (formerURL === '#manifesto'|| formerURL === '#slow-carbonation' || formerURL === '#cocktails') {
                    if (newURL === '#manifesto') {
                        duringTransition.add((next) => {
                            $horizontalSlider.css('transform', 'translateX(0)');

                            return setTimeout(() => next(), animDur);
                        });
                    } else if (newURL === '#slow-carbonation') {
                        duringTransition.add((next) => {
                            $horizontalSlider.css('transform', 'translateX(-100vw)');

                            return setTimeout(() => next(), animDur);
                        });
                    } else if (newURL === '#cocktails') {
                        duringTransition.add((next) => {
                            $horizontalSlider.css('transform', 'translateX(-200vw)');

                            return setTimeout(() => next(), animDur);
                        });
                    }

                    if (formerURL === '#manifesto') {
                        afterTransition.add((next) => {
                            setTimeout(() => manifesto.turnOff(), turnOffDelay);

                            return next();
                        });
                    } else if (formerURL === '#slow-carbonation') {
                        afterTransition.add((next) => {
                            setTimeout(() => slowCarbonation.turnOff(), turnOffDelay);

                            return next();
                        });
                    } else if (formerURL === '#cocktails') {
                        afterTransition.add((next) => {
                            setTimeout(() => cocktails.turnOff(), turnOffDelay);

                            return next();
                        });

                        afterTransition.add((next) => {
                            $frameNextBtn.removeClass('down');

                            return next();
                        });
                    }

                    if (newURL !== '#manifesto' && newURL !== '#slow-carbonation' && newURL !== '#cocktails') {
                        afterTransition.add((next) => {
                            setTimeout(() => $frame.hide(), turnOffDelay);

                            return next();
                        });
                    }

                    if (newURL === '#find-us') {
                        duringTransition.add((next) => {
                            $frame.css('transform', 'translateY(100vh)');

                            return next();
                        });
                    } else if (newURL === '#the-bottle') {
                        beforeTransition.add((next) => {
                            $frameSea.css('transform', 'translateY(12vh)')

                            return setTimeout(() => next(), animDur);
                        });

                        afterTransition.add((next) => {
                            $frameSea.css('transform', 'translateY(0)');

                            return next();
                        });
                    }
                } else if (formerURL === '#the-bottle') {
                    if (newURL !== '#home') {
                        settingTransition.add((next) => {
                            $theBottleMenu.css('opacity', 0);

                            return next();
                        });

                        settingTransition.add((next) => {
                            $theBottleSea.removeClass('d-none');

                            return next();
                        });

                        if (!isMobile()) {
                            beforeTransition.add(next => $theBottle.animate(
                                { scrollTop: 0 },
                                { always: () => next() }
                            ));
                        }

                        beforeTransition.add((next) => {
                            $theBottle.css('overflow', 'visible');

                            return next();
                        });

                        duringTransition.add((next) => {
                            const animationDuration = 600;

                            $theBottle.css({
                                transformDuration: `${animationDuration}ms`,
                                transform: 'translateY(115vh)'
                            });

                            return setTimeout(() => next(), animationDuration);
                        });

                        afterTransition.add((next) => {
                            $theBottleMenu.addClass('d-none');

                            return next();
                        });

                        afterTransition.add((next) => {
                            $theBottle.css('overflow', '');

                            return next();
                        });

                        if (newURL === '#manifesto' || newURL === '#slow-carbonation' || newURL === '#cocktails') {
                            settingTransition.add((next) => {
                                $frameSea
                                    .addClass('d-none')
                                    .css('transform', 'translateY(12vh)')
                                    .removeClass('d-none');

                                return next();
                            });

                            afterTransition.add((next) => {
                                setTimeout(() => {
                                    $frameSea.css('transform', 'translateY(0)');
                                }, 200);

                                return next();
                            });
                        }
                    }

                    afterTransition.add((next) => {
                        setTimeout(() => theBottle.turnOff(), turnOffDelay);

                        return next();
                    });
                }

                if (newURL === '#find-us') {
                    beforeTransition.add((next) => {
                        $findUs.scrollTop($findUs[0].scrollHeight - $findUs.height());

                        return next();
                    });

                    duringTransition.add((next) => {
                        $findUs.css('transform', 'translateY(0)');

                        return setTimeout(() => next(), animDur);
                    });

                    if (!isMobile()) {
                        afterTransition.add(next => $findUs.animate(
                            { scrollTop: 0 },
                            { always: () => next() }
                        ));
                    }
                } else if (newURL === '#the-bottle') {
                    settingTransition.add((next) => {
                        $theBottle
                            .css({
                                transform: 'translateY(115vh)',
                                overflow: 'visible',
                            });

                        $theBottleSea.removeClass('d-none');

                        return next();
                    });

                    settingTransition.add((next) => {
                        $theBottleMenu
                            .removeClass('d-none')
                            .css('opacity', 0);

                        return next();
                    });

                    beforeTransition.add((next) => {
                        $theBottle.scrollTop(0);

                        return next();
                    });

                    duringTransition.add((next) => {
                        const animationDuration = 600;

                        $theBottle.css({
                            transitionDuration: `${animationDuration}ms`,
                            transform: 'translateY(100vh)',
                        });

                        return setTimeout(() => next(), animationDuration);
                    });

                    duringTransition.add((next) => {
                        const animationDuration = 800;

                        $theBottle.css({
                            transitionDuration: `${animationDuration}ms`,
                            transform: 'translateY(0)',
                        });

                        return setTimeout(() => next(), animationDuration);
                    });

                    afterTransition.add((next) => {
                        $theBottle.css('overflow', '');

                        $theBottleSea.addClass('d-none');

                        return next();
                    });

                    afterTransition.add((next) => {
                        $theBottleMenu.css('opacity', 1);

                        return next();
                    });

                    if (!isMobile()) {
                        afterTransition.add(next => $theBottle.animate(
                            { scrollTop: $theBottle[0].scrollHeight - $theBottle.height() },
                            {
                                always: () => next(),
                                duration: 600,
                            }
                        ));
                    }
                }
            }

            if (newURL === '#home') {
                savedURL = formerURL;
            } else if (newURL === '#manifesto' || newURL === '#slow-carbonation' || newURL === '#cocktails') {
                if (formerURL !== '#manifesto' && formerURL !== '#slow-carbonation' && formerURL !== '#cocktails') {
                    if (newURL === '#manifesto') {
                        settingTransition.add((next) => {
                            $horizontalSlider.css('transform', 'translateX(0)');

                            return next();
                        });
                    } else if (newURL === '#slow-carbonation') {
                        settingTransition.add((next) => {
                            $horizontalSlider.css('transform', 'translateX(-100vw)');

                            return next();
                        });
                    } else if (newURL === '#cocktails') {
                        settingTransition.add((next) => {
                            $horizontalSlider.css('transform', 'translateX(-200vw)');

                            return next();
                        });
                    }
                }
            }
        }

        return executeTransitionStages([
            initialStage,
            settingTransition,
            beforeTransition,
            duringTransition,
            afterTransition,
            finalStage,
        ]);
    }

    function closeHome() {
        goToURL(savedURL);
    }

    function goToPrevPage() {
        const activePageIndex = pages.indexOf(activePage);
        const $manifestoCarousel = $('#manifesto-carousel');

        if (activePage.url === '#manifesto') {
            if (!$manifestoCarousel.find('.carousel-item.active')
                .is($manifestoCarousel.find('.carousel-item:first-of-type'))) {
                return $manifestoCarousel.carousel('prev');
            }
        }

        if (activePageIndex > 0) {
            const prevPage = pages[activePageIndex - 1];

            if (prevPage.url === '#manifesto') {
                const lastItemIndex =
                    $manifestoCarousel
                        .find('.carousel-item:last-of-type')
                        .index();

                $manifestoCarousel.carousel(lastItemIndex);
            }

            return goToURL(prevPage.url)
        }
    }

    function goToNextPage() {
        const activePageIndex = pages.indexOf(activePage);
        const $manifestoCarousel = $('#manifesto-carousel');

        if (activePage.url === '#manifesto'
            && !$manifestoCarousel.find('.carousel-item.active')
                .is($manifestoCarousel.find('.carousel-item:last-of-type'))) {
                return $manifestoCarousel.carousel('next');
        }

        if (activePageIndex - 1 < pages.length) {
            const nextPage = pages[activePageIndex + 1];

            if (nextPage.url === '#manifesto') {
                $manifestoCarousel.carousel(0);
            }

            return goToURL(nextPage.url);
        }
    }

    function bootstrap() {
        require('pages/find-us').turnOff();
        require('pages/manifesto').turnOff();
        require('pages/slow-carbonation').turnOff();
        require('pages/cocktails').turnOff();
        require('pages/the-bottle').turnOff();
        $('#frame').hide();

        savedURL = '#manifesto';

        if (window.location.hash) {
            const newActivePage = getPageByURL(window.location.hash);

            if (newActivePage && newActivePage.url !== '#home') {
                savedURL = newActivePage.url;
            }
        }

        goToURL('#home');

        $('body').addClass(`current-language-${currentLanguage}`);

        // try-extra-dry

        $('#try-extra-dry').on('click', () => {
            console.log('a');

            $('body').addClass('extra-dry-label');

            return goToURL('#the-bottle');
        });
    }

    $(window).on({
        keydown: (event) => {
            const activeURL = activePage.url;
            const keyCode = event.keyCode;

            if ((keyCode === 39 || keyCode === 40) // Right and Down arrow keys
                && activeURL === '#home') {
                return closeHome();
            }

            if (keyCode === 38 // Up arrow key
                && (activeURL === '#find-us' || activeURL === '#manifesto' || activeURL === '#the-bottle')) {
                return goToPrevPage();
            } else if (keyCode === 40 // Down arrow key
                && (activeURL === '#find-us' || activeURL === '#cocktails')) {
                return goToNextPage();
            } else if (keyCode === 39) { // Right arrow key
                return goToNextPage();
            } else if (keyCode === 37) { // Left arrow key
                return goToPrevPage();
            }
        },
    });

    return {
        goToURL,
        closeHome,
        goToPrevPage,
        goToNextPage,
        bootstrap,
    };
});