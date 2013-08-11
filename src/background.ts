/// <reference path="../bower_components/DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../typings/chromeapp.d.ts" />

declare var frontend;

chrome.app.runtime.onLaunched.addListener(function () {
    if (frontend) {
        frontend.focus();
        return;
    }
    chrome.app.window.create('/html/frontend.html', {
        'id' : 'frontend',
        'defaultWidth' : 500,
        'defaultHeight' : 300,
        'defaultLeft' : 0,
        'defaultTop' : 0,
        'hidden' : true
    }, function(win) {
        frontend = win;
        frontend.onClosed.addListener(function () {
            (<any>frontend.contentWindow).windowClose();
            frontend = undefined;
        });
        (<any>frontend.contentWindow.document).addEventListenr('DOMContentLoaded', function () {
            frontend.focus();
            frontend.show();
        });
    });
});
