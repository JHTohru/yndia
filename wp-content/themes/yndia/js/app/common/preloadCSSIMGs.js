define(['require', 'data/styleSheet', 'common/utils'], (require) => {
    const stylesheet = require('data/styleSheet');
    const img = require('common/utils').img;

    return function preloadCSSIMGs() {
        const imgsFolder = 'images/';
        const urlRegExp = /url\(([^)]+)\)/g;
        let match;

        while (match = urlRegExp.exec(stylesheet)) {
            const str = match[1].replace(/['"]+/g, '');

            if (str.indexOf(imgsFolder) > -1) {
                const splitStr = str.split(imgsFolder);
                const fileName = splitStr[splitStr.length - 1];

                img(fileName);
            }
        }
    };
});
