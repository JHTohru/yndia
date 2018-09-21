define(['require', 'jquery', 'plugins/sea-waves', 'ejs', 'common/navigation', 'common/utils'], (require) => {
    let seaWaves = null;
    let $homePage = null;

    function buildPage() {
        const $ = require('jquery');
        const ejs = require('ejs');
        const SeaWaves = require('plugins/sea-waves');
        const img = require('common/utils').img;

        const homePageTemplate = `
            <section id="home" class="page row no-gutters">
                <canvas class="position-absolute" id="sea-waves">Your browser doesn't support canvas</canvas>
                <div class="col-12 d-flex justify-content-center align-items-end">
                    <div class="home-logo">
                        <img src="<%- img('yndia-logo.svg') %>" class="yndia-logo position-relative" title="Yndiá Tônica">
                        <embed src="<%- img('mandala.svg') %>">
                    </div>
                </div>
                <div class="col-12 d-flex align-items-center justify-content-center w-100">
                    <a class="close-home-btn nav-btn">
                        <i class="fa fa-chevron-down" aria-hidden="true"></i>
                    </a>
                </div>
            </section>`;

        // Renderização da página
        const homePageTemplateData = {
            img,
        };
        const homePageTemplateOptions = {};
        const homePageHTML = ejs.render(homePageTemplate, homePageTemplateData, homePageTemplateOptions);

        // Definições específicas da página
        $homePage = $(homePageHTML);

        // Animação de fundo da Home
        seaWaves = new SeaWaves($homePage.find('#sea-waves')[0]);
        seaWaves.initializeCircleContainers();
        seaWaves.resume();

        const closeHome = require('common/navigation').closeHome;

        $homePage
            .find('.close-home-btn')
            .on({ click: () => closeHome() });

        return $homePage[0];
    }

    function turnOff() {
        seaWaves.pause();

        $homePage.hide();
    }

    function turnOn() {
        $homePage.show();

        seaWaves.resume();
    }

    return {
        buildPage,
        turnOff,
        turnOn,
    };
});
