/// <reference path="../bower_components/DefinitelyTyped/chrome/chrome.d.ts" />

declare module chrome.app {
    interface Iruntime {
        onLaunched : {
            addListener : (handler : Function) => any;
        }
    }
    interface Iwindow {
        create(path: string, param: {}, success: (win: HTMLIFrameElement) => any);
    }
    var runtime : Iruntime;
    var window : Iwindow;
}