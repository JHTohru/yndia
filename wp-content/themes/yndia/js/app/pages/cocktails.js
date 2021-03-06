define(['require', 'jquery', 'ejs', 'data/cocktails', 'common/utils'], (require) => {
    const $ = require('jquery');
    let $cocktailsPage = null;
    let adjust$cocktailImageBGPosY = null;

    function buildPage() {
        const ejs = require('ejs');

        const cocktails = require('data/cocktails');
        const cocktailsPageTemplate = `
        <section id="cocktails" class="page col">
            <div class="page-container w-100 h-100">
                <% if (cocktails.length) { %>
                <div class="row no-gutters h-100">
                    <div id="cocktail-info" class="col-12 col-md-5">
                        <header id="cocktails-carousel" class="framed-title carousel slide mb-3" data-interval="false" data-wrap="false">
                            <a class="carousel-control carousel-control-prev" href="#cocktails-carousel" data-slide="prev">
                                <span></span>
                            </a>
                            <div class="carousel-inner framed-title-inner">
                            <% cocktails.forEach((cocktail, index) => { %>
                                <div class="carousel-item <%- index === 0 ? 'active' : '' %>">
                                    <h4 class="m-0"><%- cocktail.title %></h4>
                                </div>
                            <% }); %>
                            </div>
                            <a class="carousel-control carousel-control-next" href="#cocktails-carousel" data-slide="next">
                                <span></span>
                            </a>
                        </header>
                        <div id="cocktail-text-content" class="scroll-auto collapse show">
                            <div class="row no-gutters">
                                <div id="cocktail-specifications" class="col-12 p-0 mb-3">
                                    <%- activeCocktail.specifications %>
                                </div>
                                <div class="col-12 p-0 mb-3">
                                    <h6 class="text-uppercase">
                                        <a data-toggle="collapse" href="#cocktail-ingredients" aria-expanded="false" aria-controls="cocktail-ingredients">
                                            Ingredientes
                                        </a>
                                    </h6>
                                    <div id="cocktail-ingredients" class="collapse d-md-block mt-2">
                                        <%- activeCocktail.ingredients %>
                                    </div>
                                </div>
                                <div class="col-12 p-0">
                                    <h6 class="text-uppercase">
                                        <a data-toggle="collapse" href="#cocktail-directions" aria-expanded="false" aria-controls="cocktail-directions">
                                            Preparação
                                        </a>
                                    </h6>
                                    <div id="cocktail-directions" class="collapse d-md-block mt-2">
                                        <%- activeCocktail.directions %>
                                    </div>
                                </div>                    
                            </div>
                        </div>
                    </div>
                    <div id="cocktail-image" class="col-12 col-md-7">
                        <img src="<%- loadIMG(activeCocktail.image) %>">
                    </div>
                </div>
                <% } %>
            </div>
        </section>`;

        // Renderização da página
        const loadIMG = require('common/utils').loadIMG;

        const cocktailsPageTemplateData = {
            cocktails,
            activeCocktail: cocktails[0],
            loadIMG,
        };
        const cocktailsPageTemplateOptions = {};
        const cocktailsPageHTML = ejs.render(cocktailsPageTemplate, cocktailsPageTemplateData, cocktailsPageTemplateOptions);

        // Definições específicas da página
        $cocktailsPage = $(cocktailsPageHTML);
        const $cocktailTextContent = $cocktailsPage.find('#cocktail-text-content');
        const $cocktailImage = $cocktailsPage.find('#cocktail-image');

        let activeCocktailIndex = 0;

        adjust$cocktailImageBGPosY = $image => $cocktailImage.css({
            backgroundPositionY() {
                const height = $image.height() * .75
                    + parseInt($image.css('margin-bottom'))
                    + parseInt($image.css('margin-top'))
                    + parseInt($image.css('padding-top'))
                    + parseInt($image.css('padding-bottom'));

                return `${height}px`;
            },
        });

        $cocktailsPage
            .find('#cocktails-carousel')
            .on('slide.bs.carousel', (event) => {
                activeCocktailIndex = event.to;

                $cocktailTextContent.trigger('refresh.content');

                const $currentCocktailImage = $cocktailImage.children('img');
                const $newCocktailImage =
                    $('<img>')
                        .attr('src', cocktails[activeCocktailIndex].image)
                        .css({
                            position: 'absolute',
                            transform: 'translateY(-100vh)',
                        })
                        .insertBefore($currentCocktailImage[0]);

                $currentCocktailImage.fadeOut({
                    duration: 200,
                    always() {
                        $newCocktailImage.css({
                            position: '',
                            transform: '',
                        });

                        adjust$cocktailImageBGPosY($newCocktailImage);

                        $(this).remove();
                    },
                });
            });

        $cocktailTextContent
            .on('refresh.content', function() {
                $(this).slideUp({
                    always() {
                        $(this).find('#cocktail-specifications')
                            .html(cocktails[activeCocktailIndex].specifications);

                        $(this).find('#cocktail-ingredients')
                            .removeClass('show')
                            .addClass('hide')
                            .html(cocktails[activeCocktailIndex].ingredients);

                        $(this).find('#cocktail-directions')
                            .removeClass('show')
                            .addClass('hide')
                            .html(cocktails[activeCocktailIndex].directions);

                        $(this).slideDown(200);
                    },
                    duration: 200,
                });
            });

        const onCollapse = () => window.matchMedia('(max-width: 767px)').matches;

        $cocktailTextContent
            .find('#cocktail-specifications')
            .on('hidden.bs.collapse show.bs.collapse', onCollapse);

        $cocktailTextContent
            .find('#cocktail-ingredients')
            .on('hidden.bs.collapse show.bs.collapse', onCollapse);

        $cocktailTextContent
            .find('#cocktail-directions')
            .on('hidden.bs.collapse show.bs.collapse', onCollapse);

        $cocktailsPage
            .find('#cocktail-image img')
            .on({
                load() {
                    const interval = setInterval(() => {
                        if ($(this).height()) {
                            adjust$cocktailImageBGPosY($(this));

                            clearInterval(interval);
                        }
                    }, 10);
                },
            });

        $(window)
            .on('resize', () => adjust$cocktailImageBGPosY($cocktailsPage.find('#cocktail-image img')));

        return $cocktailsPage[0];
    }

    function turnOff() {
        $cocktailsPage.children('.page-container').hide();
    }

    function turnOn() {
        $cocktailsPage.children('.page-container').show();

        adjust$cocktailImageBGPosY($cocktailsPage.find('#cocktail-image img'));
    }

    return {
        buildPage,
        turnOn,
        turnOff,
        $el: $cocktailsPage,
    }
});
