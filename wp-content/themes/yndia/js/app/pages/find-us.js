define(['require', 'jquery', 'ejs', 'common/utils', 'structures/desktop-menu', 'data/retailers'], (require) => {
    const $ = require('jquery');
    let $findUsPage = null;

    function buildPage() {
        const ejs = require('ejs');
        const findUsPageTemplate = `
            <section id="find-us" class="page row no-gutters">
                <div class="find-us-wrapper col d-flex flex-column align-items-center p-0">
                    <div id="clouds">
                        <img class="cloud" src="<%- img('passing-white-cloud-1.svg') %>">
                        <img class="cloud" src="<%- img('passing-dark-cloud-1.svg') %>">
                        <img class="cloud" src="<%- img('passing-white-cloud-2.svg') %>">
                        <img class="cloud" src="<%- img('passing-dark-cloud-2.svg') %>">
                        <img class="cloud" src="<%- img('passing-white-cloud-1.svg') %>">
                        <img class="cloud" src="<%- img('passing-dark-cloud-1.svg') %>">
                        <img class="cloud" src="<%- img('passing-white-cloud-2.svg') %>">
                        <img class="cloud" src="<%- img('passing-dark-cloud-2.svg') %>">
                    </div>
                    <a class="nav-btn up prev-page-btn" href="#home">
                        <i class="fa fa-chevron-up"></i>
                    </a>
                    <div id="retailers-carousel">
                        <div class="frame-part top border-left-0"></div>
                        <div class="frame-part right border-top-0"></div>
                        <div class="frame-part bottom border-right-0"></div>
                        <div class="frame-part left border-bottom-0"></div>
                        <div id="desktop-retailers-carousel" class="carousel slide d-none d-md-block" data-interval="false" data-wrap="false">
                            <div class="carousel-inner">
                                <% if(retailers.length) {
                                    retailers.forEach((retailer, index) => { %>
                                <div class="carousel-item <%- index === 0 ? 'active' : '' %>">
                                    <div class="row no-gutters w-100 h-100 align-items-center">
                                        <div class="retailer col-12">
                                            <h5 class="mb-1"><%- retailer.name %></h5>
                                            <p><%- retailer.address1 %></p>
                                            <p><%- retailer.address2 %></p>
                                        </div>
                                    </div>
                                </div>
                                <%  });
                                   }%>
                            </div>
                            <a class="carousel-control carousel-control-prev" href="#desktop-retailers-carousel" data-slide="prev">
                                <img class="w-50" src="<%- img('left-arrow.svg') %>"/>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="carousel-control carousel-control-next" href="#desktop-retailers-carousel" data-slide="next">
                                <img class="w-50" src="<%- img('right-arrow.svg') %>"/>
                                <span class="sr-only">Next</span>
                            </a>
                        </div>
                        <div id="mobile-retailers-carousel" class="carousel slide d-md-none" data-interval="false" data-wrap="false">
                            <div class="carousel-inner">
                            <% if (retailers.length) {
                                for (let i = 0; i < retailers.length; ) { %>
                                <div class="carousel-item <%- i === 0 ? 'active' : '' %>">
                                    <div class="row no-gutters w-100 h-100 align-items-center">
                                    <% for (let j = 0; j < 2 && i < retailers.length; j += 1) {
                                        const retailer = retailers[i]; %>
                                        <div class="retailer col-12">
                                            <h5 class="mb-1"><%- retailer.name %></h5>
                                            <p><%- retailer.address1 %></p>
                                            <p><%- retailer.address2 %></p>
                                        </div>
                                    <% i += 1; } %>
                                    </div>
                                </div>
                            <% }
                                }%>
                            </div>
                            <a class="carousel-control carousel-control-prev" href="#mobile-retailers-carousel" data-slide="prev">
                                <span class="fa fa-chevron-up"></span>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="carousel-control carousel-control-next" href="#mobile-retailers-carousel" data-slide="next">
                                <span class="fa fa-chevron-down"></span>
                                <span class="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
                    <a class="nav-btn down next-page-btn">
                        <i class="fa fa-chevron-down"></i>
                    </a>
                    <div class="static-white-clouds position-absolute w-100">
                        <img src="<%- img('yndia-flecha.svg') %>" />
                    </div>
                    <embed src="<%- img('starry-sky.svg') %>" type="image/svg+xml">
                </div>
            </section>`;

        const img = require('common/utils').img;
        const retailers = require('data/retailers');
        // Renderização da página
        const findUsPageTemplateData = {
            retailers,
            img,
        };
        const findUsPageTemplateOptions = {};
        const findUsPageHTML = ejs.render(findUsPageTemplate, findUsPageTemplateData, findUsPageTemplateOptions);

        // Definições específicas da página
        $findUsPage = $(findUsPageHTML);

        // Menu
        const desktopMenu = require('structures/desktop-menu')();

        $findUsPage
            .prepend(desktopMenu);

        return $findUsPage[0];
    }

    function turnOff() {
        $findUsPage.hide();
    }

    function turnOn() {
        $findUsPage.show();
    }

    return {
        buildPage,
        turnOff,
        turnOn,
        $el: $findUsPage,
    }
});
