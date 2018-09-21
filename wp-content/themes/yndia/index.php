<?php $baseURL = get_template_directory_uri(); ?>
<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Site oficial da Yndiá Tônica">
    <meta name="author" content="beb0p">

    <title>Yndiá Tônica</title>

    <link rel="preload" href="<?php echo $GLOBALS['baseURL'] . '/css/fonts/ALTGOT2N.TTF'; ?>" as="font">
    <link rel="preload" href="<?php echo $GLOBALS['baseURL'] . '/css/loading.css'; ?>" as="style">
    <link rel="preload" href="<?php echo $GLOBALS['baseURL'] . '/images/yndia-logo.svg'; ?>" as="image">

    <link rel="stylesheet" href="<?php echo $GLOBALS['baseURL'] . '/css/loading.css'; ?>"/>

    <link rel="stylesheet" href="<?php echo $GLOBALS['baseURL'] . '/css/lib/bootstrap.min.css'; ?>">
    <link rel="stylesheet" href="<?php echo $GLOBALS['baseURL'] . '/css/lib/font-awesome.min.css'; ?>">
    <link rel="stylesheet" href="<?php echo $GLOBALS['baseURL'] . '/css/style.css'; ?>"/>
</head>
<body>
    <div id="loading">
        <div class="logo-wrapper">
            <img class="logo" src="<?php echo $GLOBALS['baseURL'] . '/images/yndia-logo.svg'; ?>" title="Yndiá Tônica">
        </div>
        <div class="feedback-wrapper">
            <div class="feedback">
                <div class="percent">0%</div>
                <div class="bubble"></div>
            </div>
        </div>
    </div>
    <script>
        const loadingPage = document.querySelector('#loading');
        let percent = 0;
        let factor = .25;

        function removeLoadingPage() {
            loadingPage.style.opacity = 0;

            setTimeout(() => loadingPage.parentNode.removeChild(loadingPage), 400);
        }

        function countdown() {
            const displayer = loadingPage.querySelector('.percent');
            const step = 100;

            let interval = setInterval(() => {
                displayer.innerHTML = `${parseInt(percent)}%`;

                if (percent === 100) {
                    clearInterval(interval);
                    removeLoadingPage();
                } else {
                    percent = Math.min(100, factor + percent);
                }
            }, step);
        }

        function showtime() {
            factor = (100 - percent) / 10;
        }

        window.onload = countdown;

        const baseUrl = '<?php echo $GLOBALS['baseURL']; ?>';
        const siteUrl = '<?php echo get_site_url(); ?>';
        const currentLanguage = '<?php echo($polylang->curlang->slug); ?>';
    </script>
    <script src="<?php echo $GLOBALS['baseURL'] . '/js/lib/require.js'; ?>"
            data-main="<?php echo $GLOBALS['baseURL'] . '/app.js'; ?>"></script>
</body>
</html>
