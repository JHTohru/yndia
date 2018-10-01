define(['require', 'jquery', 'ejs', 'data/carbonation-elements', 'common/utils'], (require) => {
    const $ = require('jquery');
    let $slowCarbonationPage = null;

    function buildPage() {
        const ejs = require('ejs');

        const carbonationElements = require('data/carbonation-elements');
        let activeCarbonationElement = carbonationElements[0];
        const slowCarbonationPageTemplate = `
            <section id="slow-carbonation" class="page col">
                <div class="w-100 h-100 page-container">
                    <div class="d-md-none">
                        <% if (carbonationElements.length) { %>
                        <div id="slow-carbonation-carousel" class="carousel slide" data-interval="false" data-wrap="false">
                            <div class="carousel-inner">
                                <% carbonationElements.forEach((carbonationElement, index) => { %>
                                <div class="slow-carbonation-element carousel-item <%- index === 0 ? 'active' : '' %>">
                                    <div class="row no-gutters">
                                        <div class="slow-carbonation-element-image col-12">
                                            <img src="<%- loadIMG(carbonationElement.image) %>">
                                        </div>
                                        <div class="slow-carbonation-element-text col-12">
                                            <h4 class="title"><%- carbonationElement.title %></h4>
                                            <div class="content scroll-auto"><%- carbonationElement.content %></div>
                                        </div>
                                    </div>
                                </div>
                                <% }); %>
                            </div>
                        </div>
                        <a class="left carousel-control carousel-control-prev" href="#slow-carbonation-carousel" data-slide="prev">
                            <span class="fa fa-chevron-left"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="right carousel-control carousel-control-next" href="#slow-carbonation-carousel" data-slide="next">
                            <span class="fa fa-chevron-right"></span>
                            <span class="sr-only">Next</span>
                        </a>
                        <% } %>
                    </div>
                    <div class="row no-gutters d-none d-md-flex h-100">
                        <div class="col-3">
                            <h2 class="text-left">
                                <span>Carbo&#8203;natação Lenta</span>
                            </h2>
                        </div>

                        <div class="col-7">
                            <div id="slow-carbonation-factory">
                                <a id="snail" class="factory-part active"></a>
                                <a id="hand" class="factory-part"></a>
                                <a id="balloon" class="factory-part"></a>
                                <div id="bubbles" class="factory-part"></div>
                                <a id="accordion-fish" class="factory-part"></a>
                                <div id="pipes" class="factory-part"></div>
                            </div>                        
                        </div>

                        <div class="col-2 align-self-end">
                            <div id="slow-carbonation-info">
                                <% if (carbonationElements.length) { %>
                                <div class="slow-carbonation-info-wrapper">
                                    <h4 class="title"><%- activeCarbonationElement.title %></h4>
                                    <div class="text-content"><%- activeCarbonationElement.content %></div>
                                </div>
                                <% } %>
                            </div>
                        </div>
                    </div>
                </div>
            </section>`;

        // Renderização da página
        const loadIMG = require('common/utils').loadIMG;

        const slowCarbonationPageTemplateData = {
            carbonationElements,
            activeCarbonationElement,
            loadIMG,
        };
        const slowCarbonationPageTemplateOptions = {};
        const slowCarbonationPageHTML = ejs.render(slowCarbonationPageTemplate, slowCarbonationPageTemplateData, slowCarbonationPageTemplateOptions);

        // Definições específicas da página
        $slowCarbonationPage = $(slowCarbonationPageHTML);

        $slowCarbonationPage
            .find('a.factory-part')
            .on({ click () {
                    $slowCarbonationPage.find('.factory-part').removeClass('active');

                    $(this).addClass('active');

                    const activeElement = carbonationElements.find((c) => { return c.id === $(this).attr('id'); });
                    const $carbonationInfo = $slowCarbonationPage.find('#slow-carbonation-info');

                    $carbonationInfo.fadeOut({
                        always () {
                            $(this).find('.title').html(activeElement.title);
                            $(this).find('.text-content').html(activeElement.content);
                            $(this).fadeIn();
                        },
                    });
                }});

        return $slowCarbonationPage[0];
    }

    function turnOff() {
        $slowCarbonationPage.children('.page-container').hide();
    }

    function turnOn() {
        $slowCarbonationPage.children('.page-container').show();
    }

    return {
        buildPage,
        turnOff,
        turnOn,
        $el: $slowCarbonationPage,
    }
});
