define(['require', 'jquery', 'ejs', 'data/main-menu-mobile', 'data/languages-menu', 'data/social-menu'], (require) => {
    const $ = require('jquery');
    const ejs = require('ejs');
    const mobileNavigation = `
    <nav class="navbar navbar-expand-md d-md-none fixed-top p-0 bg-white text-uppercase text-center">
        <a id="mobile-menu-toggler" class="navbar-toggler py-3 mx-auto border-0" data-toggle="collapse" data-target="#mobile-menu" aria-controls="mobile-menu" aria-expanded="false" aria-label="Toggle navigation">Menu</a>
    
        <div class="collapse navbar-collapse" id="mobile-menu">
            <% if (languagesMenu.length) { %>
            <ul class="languages-menu nav justify-content-center">
                <% languagesMenu.forEach((lang) => { %>
                <li class="nav-item">
                    <a class="nav-link language-<%- lang.slug %>" href="<%- lang.url %>" title="<%- lang.name %>"><%- lang.slug %></a>
                </li>
                <% }); %>
            </ul>
            <% }
            if (mainMenu.length) { %>
            <ul class="main-menu navbar-nav mr-auto">
                <% mainMenu.forEach((menuItem) => { %>
                <li class="nav-item">
                    <a class="nav-link" href="<%- menuItem.url %>"><%- menuItem.title %></a>
                </li>
                <% }); %>
            </ul>
            <% }
            if (socialMenu.length) { %>
            <ul class="social-menu nav justify-content-center">
                <% socialMenu.forEach((social) => { %>
                <li class="nav-item">
                    <a class="nav-link px-1" href="<%- social.url %>" target="_blank">
                        <span class="fa <%- social.classes.join(' ') %>"></span>
                    </a>
                </li>
                <% }); %>
            </ul>
            <% } %>
        </div>
    </nav>`;

    //
    const mainMenu = require('data/main-menu-mobile');
    const languagesMenu = require('data/languages-menu');
    const socialMenu = require('data/social-menu');

    const mobileNavigationData = {
        mainMenu,
        languagesMenu,
        socialMenu,
    };
    const mobileNavigationOptions = {};
    const mobileNavigationHTML = ejs.render(mobileNavigation, mobileNavigationData, mobileNavigationOptions);

    //
    const $mobileNavigation = $(mobileNavigationHTML);

    $mobileNavigation
        .find('.navbar-toggler')
        .on({ click() {
            $($(this).data('target')).collapse('toggle');
        }, });

    $mobileNavigation
        .find('.navbar-collapse .nav-link')
        .on('click', () => $mobileNavigation.find('.navbar-collapse').collapse('hide'));

    return $mobileNavigation[0];
});
