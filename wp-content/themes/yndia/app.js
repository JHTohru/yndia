requirejs.config({
    baseUrl,
    paths: {
        app: 'js/app/',
        lib: 'js/lib/',
        i18n: 'js/app/i18n/',
        pages: 'js/app/pages/',
        common: 'js/app/common/',
        plugins: 'js/app/plugins',
        structures: 'js/app/structures/',
        bootstrap: 'js/lib/bootstrap.min',
        ejs: 'js/lib/ejs.min',
        jquery: 'js/lib/jquery-3.2.1.min',
        popper: 'js/lib/popper.min',
    },
    shim: {
        'popper': {
            'deps': ['jquery'],
            'exports': 'Popper',
        },
        'bootstrap': {
            'deps': ['jquery', 'popper'],
        }
    },
});

require(['jquery', 'popper'], ($, popper) => {
    window.Popper = popper;

    require(['bootstrap']);

    const defaultRequestOptions = {
        type: 'get',
        data: {
            orderby: 'date',
            order: 'asc',
            lang: currentLanguage,
        },
    };

    const apiURL = `${siteUrl}/wp-json/wp/v2`;

    $.when(
        $.getJSON(Object.assign({}, defaultRequestOptions, { url: `${apiURL}/menus/main-menu-desktop` })),
        $.getJSON(Object.assign({}, defaultRequestOptions, { url: `${apiURL}/menus/main-menu-mobile` })),
        $.getJSON(Object.assign({}, defaultRequestOptions, { url: `${apiURL}/menus/social-menu` })),
        $.getJSON({ type: 'get', url: `${apiURL}/menus/languages-menu` }),
        $.getJSON(Object.assign({}, defaultRequestOptions, { url: `${apiURL}/label-elements` })),
        $.getJSON(Object.assign({}, defaultRequestOptions, { url: `${apiURL}/retailers` })),
        $.getJSON(Object.assign({}, defaultRequestOptions, { url: `${apiURL}/carbonation-elements`, data: { ...defaultRequestOptions.data, order: 'desc' }, })),
        $.getJSON(Object.assign({}, defaultRequestOptions, { url : `${apiURL}/manifestos` })),
        $.getJSON(Object.assign({}, defaultRequestOptions, { url: `${apiURL}/bottle-labels` })),
        $.getJSON(Object.assign({}, defaultRequestOptions, { url: `${apiURL}/cocktails` })),
        $.ajax(`${baseUrl}/css/style.css`),
    ).then((
        mainMenuDesktopRes,
        mainMenuMobileRes,
        socialMenuRes,
        languagesMenuRes,
        labelElementsRes,
        retailersRes,
        carbonationElementsRes,
        manifestosRes,
        bottleLabelsRes,
        cocktailsRes,
        styleSheetRes,
        ) => {
            define('data/main-menu-desktop', [], () => {
                if (mainMenuDesktopRes[0]) {
                    return mainMenuDesktopRes[0].map((item) => {
                        return {
                            title: item.title,
                            url: item.url,
                        };
                    });
                }

                return [];
            });
            define('data/main-menu-mobile', [], () => {
                if (mainMenuMobileRes[0]) {
                    return mainMenuMobileRes[0].map((item) => {
                        return {
                            title: item.title,
                            url: item.url,
                        };
                    });
                }

                return [];
            });
            define('data/social-menu', [], () => {
                if (socialMenuRes[0]) {
                    return socialMenuRes[0].map((d) => {
                        return {
                            title: d.title,
                            url: d.url,
                            classes: d.classes,
                        };
                    });
                }

                return [];
            });
            define('data/languages-menu', [], () => {
                if (languagesMenuRes[0]) {
                    return Object.values(languagesMenuRes[0]).map((d) => {
                        return {
                            name: d.name,
                            slug: d.slug,
                            url: d.url,
                        };
                    });
                }

                return [];
            });
            define('data/label-elements', [], () => {
                if (labelElementsRes[0]) {
                    return labelElementsRes[0].map((d) => {
                        return {
                            id: d.label_element_id,
                            title: d.title.rendered,
                            content: d.content.rendered,
                            classicImage: d.label_element_classic_image,
                            extraDryImage: d.label_element_extradry_image,
                        };
                    });
                }

                return [];
            });
            define('data/retailers', [], () => {
                if (retailersRes[0]) {
                    return retailersRes[0].map((d) => {
                        return {
                            name: d.title.rendered,
                            address1: d.retailer_address_1,
                            address2: d.retailer_address_2,
                        };
                    });
                }

                return [];
            });
            define('data/carbonation-elements', [], () => {
                if (carbonationElementsRes[0]) {
                    return carbonationElementsRes[0].map((d) => {
                        return {
                            id: d.carbonation_element_id,
                            title: d.title.rendered,
                            content: d.content.rendered,
                            image: d.carbonation_element_image,
                        };
                    });
                }

                return [];
            });
            define('data/manifestos', [], () => {
                if (manifestosRes[0]) {
                    return manifestosRes[0].map((d) => {
                        return {
                            title: d.title.rendered,
                            content: d.content.rendered,
                            image: d.manifesto_image,
                        };
                    });
                }

                return [];
            });
            define('data/bottle-labels', [], () => {
                if (bottleLabelsRes[0]) {
                    return bottleLabelsRes[0].map((d) => {
                        return {
                            id: d.bottle_label_id,
                            name: d.title.rendered,
                            contentTitle: d.bottle_label_title,
                            contentText: d.content.rendered,
                            image: d.bottle_label_image,
                        };
                    });
                }

                return [];
            });
            define('data/cocktails', [], () => {
                if (cocktailsRes[0]) {
                    return cocktailsRes[0].map((d) => {
                        const data = {
                            title: d.title.rendered,
                            specifications: d.cocktail_specifications,
                            ingredients: d.cocktail_ingredients,
                            directions: d.cocktail_directions,
                            image: d.cocktail_image,
                        };

                        return data;
                    });
                }

                return [];
            });
            define('data/styleSheet', [], () => {
                if (styleSheetRes[0]) {
                    return styleSheetRes[0];
                }
            });

            require(['app/main']);
        });
});
