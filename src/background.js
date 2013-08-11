chrome.app.runtime.onLaunched.addListener(function () {
    if (frontend) {
        frontend.focus();
        return;
    }
    chrome.app.window.create('/html/frontend.html', {
        'id': 'frontend',
        'defaultWidth': 500,
        'defaultHeight': 300,
        'defaultLeft': 0,
        'defaultTop': 0,
        'hidden': true
    }, function (win) {
        frontend = win;
        frontend.onClosed.addListener(function () {
            (frontend.contentWindow).windowClose();
            frontend = undefined;
        });
        (frontend.contentWindow.document).addEventListenr('DOMContentLoaded', function () {
            frontend.focus();
            frontend.show();
        });
    });
});
//@ sourceMappingURL=background.js.map
