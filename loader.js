(function () {
    function loadScriptAsync (resource) {
        var sNew = document.createElement("script");
        sNew.async = true;
        sNew.src = resource;
        var s0 = document.getElementsByTagName('script')[0];
        s0.parentNode.insertBefore(sNew, s0);
    }

    function loadScript (resource) {
        document.write('<script src="' + resource + '"></script>');
    }

    function loadStylesheet (resource) {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = resource;
        link.media = 'all';
        head.appendChild(link);
    }


    loadStylesheet("vex.css");
    loadStylesheet("vex-theme-default.css");
    loadStylesheet("https://cdnjs.cloudflare.com/ajax/libs/messenger/1.4.0/css/messenger.css");
    loadStylesheet("https://cdnjs.cloudflare.com/ajax/libs/messenger/1.4.0/css/messenger-theme-air.css");

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js");
    loadScript("https://cdn.firebase.com/js/client/2.2.1/firebase.js");
    loadScript("vex.combined.min.js");
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/messenger/1.4.0/js/messenger.min.js");
    loadScript("https://cdn.jsdelivr.net/lodash/3.5.0/lodash.compat.min.js");

    document.write("<script>vex.defaultOptions.className = 'vex-theme-default'; Messenger.options = { extraClasses: 'messenger-fixed messenger-on-top messenger-on-right', theme: 'air'};</script>");

    loadScript("core.js");
    loadScript("account.js");
    loadScript("utils.js");
})();
