define(['require'], (require) => {
    const queuedIMGs = [];
    const loadedIMGs = [];

    function loadIMG(imgURL) {
        if (queuedIMGs.indexOf(imgURL) === -1) {
            queuedIMGs.push(imgURL);
        }

        return imgURL;
    }

    function loadAllIMGs() {
        queuedIMGs.forEach((imgURL) => {
            const img = new Image();

            img.addEventListener('load', () => loadedIMGs.push(imgURL));

            img.addEventListener('error', err => console.error(err));

            img.src = imgURL;
        });
    }

    function whenAllImagesAreLoaded(callback) {
        const loadedImagesChecker = setInterval(() => {
            if (queuedIMGs.length === loadedIMGs.length) {
                clearInterval(loadedImagesChecker);

                if ('function' === typeof callback) {
                    callback();
                }
            }
        }, 25);

        const suicide = setTimeout(() => {
            clearInterval(loadedImagesChecker);
            clearTimeout(suicide);

            if ('function' === typeof callback) {
                callback();
            }
        }, 20000);
    }

    function img(fileName) {
        const imgURL = require.toUrl(`images/${fileName}`);

        return loadIMG(imgURL);
    }

    return {
        loadIMG,
        loadAllIMGs,
        whenAllImagesAreLoaded,
        img,
    };
});
