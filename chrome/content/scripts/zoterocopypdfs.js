if (typeof Zotero === 'undefined') {
    Zotero = {};
}
Zotero.CopyPDFs = {};


Zotero.CopyPDFs.init = function() {
    //Zotero.CopyPDFs.resetState();

    stringBundle = document.getElementById('zoterocopypdfs-bundle');
    Zotero.CopyPDFs.captchaString = 'Please enter the Captcha on the page that will now open and then re-try updating the citations, or wait a while to get unblocked by Google if the Captcha is not present.';
    Zotero.CopyPDFs.citedPrefixString = ''
        if (stringBundle != null) {
            Zotero.CopyPDFs.captchaString = stringBundle.getString('captchaString');
        }

    // Register the callback in Zotero as an item observer
    var notifierID = Zotero.Notifier.registerObserver(
            Zotero.CopyPDFs.notifierCallback, ['item']);

    // Unregister callback when the window closes (important to avoid a memory leak)
    window.addEventListener('unload', function(e) {
        Zotero.Notifier.unregisterObserver(notifierID);
    }, false);
};

Zotero.CopyPDFs.copyPDFsAll = function(){
    //window.open('http://baidu.com');
    alert('CopyPDFs All!');
};

Zotero.CopyPDFs.copyPDFsSelected = function(){
    //window.open('http://baidu.com');
    alert('CopyPDFs!');
};

if (typeof window !== 'undefined') {
    window.addEventListener('load', function(e) {
        Zotero.CopyPDFs.init();
    }, false);
}

module.exports = Zotero.CopyPDFs;
