define(['require', 'jquery', 'ejs', 'structures/desktop-menu', 'i18n/i18n'], (require) => {
    const $ = require('jquery');
    const ejs = require('ejs');

    const contentTemplate = `
    <main class="p-0" role="main">
        <!-- Home -->
        <!-- Find Us -->
        <div class="row no-gutters" id="frame">
            <div
            class="d-none d-md-block"
            id="try-extra-dry">
                <div class="content row no-gutters py-2 pl-3">
                    <div class="col-auto mr-3">
                        <h2 class="text-left m-0"><%- tryExtraDryTitle %></h2>
                    </div>
                    <div class="col-auto">
                        <p class="m-0 text-white text-left"><%- tryExtraDryText %></p>
                    </div>
                </div>
            
                <img
                class="extra-dry-bottle"
                src="<%- img('try-extra-dry-min.png') %>">
            </div>

            <div class="frame-part top d-none d-md-block"></div>
            <div class="frame-part right d-none d-md-block"></div>
            <div class="frame-part bottom d-none d-md-block"></div>
            <div class="frame-part left d-none d-md-block"></div>
            <div class="helm right top d-none d-md-block"></div>
            <div class="helm right bottom d-none d-md-block"></div>
            <div class="helm left bottom d-none d-md-block"></div>
            <div class="helm left top d-none d-md-block"></div>
            <div class="sea">
                <div class="sea-waves">
                    <div class="wave"></div>            
                    <div class="wave"></div>            
                    <div class="wave"></div>            
                </div>
            </div>
            <a class="nav-btn left prev-page-btn">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </a>
            <a class="nav-btn right next-page-btn">
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <div class="col p-0">
                <div class="row mx-0" id="horizontal-slider">
                    <!-- Manifesto -->
                    <!-- Slow Carbonation -->
                    <!-- Cocktails -->
                </div>
            </div>
        </div>
        <!-- The Bottle -->
        <section id="navigation-tutorial" class="light-box page d-none">
            <div class="box row">
                <div class="col-auto d-flex justify-content-center align-items-center">
                    <a class="nav-btn left">
                        <i class="fa fa-chevron-left" aria-hidden="true"></i>
                    </a>
                </div>
                <div class="col d-flex justify-content-center align-items-center text-uppercase text-white navigation-tutorial-text">
                    <%- tutorialText %>
                </div>
                <div class="col-auto d-flex justify-content-center align-items-center">
                    <a class="nav-btn right">
                        <i class="fa fa-chevron-right" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </section>
    </main>`;

    // Renderização da página
    const i18n = require('i18n/i18n');
    const tutorialText = i18n[currentLanguage]['navigation-tutorial'];
    const tryExtraDryTitle = i18n[currentLanguage]['try-extra-dry-title'];
    const tryExtraDryText = i18n[currentLanguage]['try-extra-dry-text'];
    const img = require('common/utils').img;
    const contentTemplateData = {
        img,
        tryExtraDryText,
        tryExtraDryTitle,
        tutorialText,
    };
    const contentTemplateOptions = {};
    const contentHTML = ejs.render(contentTemplate, contentTemplateData, contentTemplateOptions);

    // Definições específicas da página
    const $content = $(contentHTML);

    // Frame Menu
    const desktopMenu = require('structures/desktop-menu')();

    $content
        .find('#frame')
        .prepend(desktopMenu);

    return $content[0];
});
