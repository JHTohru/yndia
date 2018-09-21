define(['require', 'jquery', 'ejs', 'data/manifestos', 'common/utils'], (require) => {
    const $ = require('jquery');
    let $manifestoPage = null;

    function buildPage() {
        const ejs = require('ejs');

        const manifestos = require('data/manifestos');
        const manifestoPageTemplate = `
        <section id="manifesto" class="page col">
            <div class="page-container w-100 h-100">
                <% if (manifestos.length) { %>
                <div id="manifesto-carousel" class="carousel slide" data-interval="false" data-wrap="false">
                    <div class="carousel-inner">
                        <% manifestos.forEach((manifesto, index) => { %>
                        <div class="carousel-item <%- index === 0 ? 'active' : '' %>">
                            <div class="row no-gutters">
                                <div class="manifesto-image col-md-6 d-none d-md-block">
                                    <img src="<%- loadIMG(manifesto.image) %>">                    
                                </div>
                                <div class="manifesto-text-content col-12 col-md-6">
                                    <h6>Manifesto</h6>
                                    <h2><%- manifesto.title %></h2>
                                    <div class="scroll-auto">
                                        <%- manifesto.content %>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <% }); %>
                    </div>
            
                    <a class="left carousel-control carousel-control-prev d-md-none" href="#manifesto-carousel" data-slide="prev">
                        <span class="fa fa-chevron-left"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="right carousel-control carousel-control-next d-md-none" href="#manifesto-carousel" data-slide="next">
                        <span class="fa fa-chevron-right"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
                <% } %>
            </div>
        </section>`;

        // Renderização da página
        const loadIMG = require('common/utils').loadIMG;

        const manifestoPageTemplateData = {
            manifestos,
            loadIMG,
        };
        const manifestoPageTemplateOptions = {};
        const manifestoPageHTML = ejs.render(manifestoPageTemplate, manifestoPageTemplateData, manifestoPageTemplateOptions);

        // Definições específicas da página
        $manifestoPage = $(manifestoPageHTML);

        $manifestoPage.find('#manifesto-carousel').on('slide.bs.carousel', function (event) {
            if (event.to === 0) {
                $('#frame > .nav-btn.left').addClass('up');
            } else {
                $('#frame > .nav-btn.left').removeClass('up');
            }
        });

        return $manifestoPage[0];
    }

    function turnOn() {
        $manifestoPage.children('.page-container').show();
    }

    function turnOff() {
        $manifestoPage.children('.page-container').hide();
    }

    return {
        buildPage,
        turnOff,
        turnOn,
        $el: $manifestoPage,
    }
});
