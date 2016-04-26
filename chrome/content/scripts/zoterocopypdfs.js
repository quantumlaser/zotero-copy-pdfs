if (typeof Zotero === 'undefined') {
  Zotero = {};
}
Zotero.CopyPDFs = {};

Zotero.CopyPDFs.init = function() {
    // Zotero.CopyPDFs.resetState();

  var stringBundle = document.getElementById('zoterocopypdfs-bundle');
  Zotero.CopyPDFs.captchaString = 'Please enter the Captcha on the page' +
    'that will now open and then re-try updating the citations, or wait a' +
    ' while to get unblocked by Google if the Captcha is not present.';
  Zotero.CopyPDFs.citedPrefixString = '';
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

Zotero.CopyPDFs.copyPDFsAll = function() {
    // window.open('http://baidu.com');
  alert('CopyPDFs All!');
  var items = [];
  Zotero.Items.getAll().forEach(function(item) {
    if (item.isRegularItem() && !item.isCollection()) {
      var libraryId = item.getField('libraryID');
      if (libraryId == null ||
            libraryId == '' ||
            Zotero.Libraries.isEditable(libraryId)) {
        items.push(item);
      }
    }
  });
  Zotero.CopyPDFs.copyPDFsItems(items);
};

Zotero.CopyPDFs.copyPDFsSelectedEntity = function(libraryId) {
    // window.open('http://baidu.com');
  alert('CopyPDFs Selected Entity!');
  if (!ZoteroPane.canEdit()) {
    ZoteroPane.displayCannotEditLibraryMessage();
    return;
  }

  var collection = ZoteroPane.getSelectedCollection();
  var group = ZoteroPane.getSelectedGroup();
  var items = [];
  if (collection) {
    collection.getChildren(true, false, 'item').forEach(function(item) {
      items.push(Zotero.Items.get(item.id));
    });
    Zotero.CopyPDFs.copyPDFsItems(items);
  } else if (group) {
    if (!group.editable) {
      alert("This group is not editable!");
      return;
    }
    // var items = [];
    group.getCollections().forEach(function(collection) {
      collection.getChildren(true, false, 'item').forEach(function(item) {
        items.push(Zotero.Items.get(item.id));
      });
    });
    Zotero.CopyPDFs.copyPDFsItems(items);
  } else {
    Zotero.CopyPDFs.copyPDFsAll();
  }
};

Zotero.CopyPDFs.copyPDFsSelectedItems = function() {
    // window.open('http://baidu.com');
  alert('CopyPDFs Selected Items!');
  Zotero.CopyPDFs.copyPDFsItems(ZoteroPane.getSelectedItems());
};

Zotero.CopyPDFs.copyPDFsItems = function(items) {
  alert('Get All Selected Items!');
};

if (typeof window !== 'undefined') {
  window.addEventListener('load', function(e) {
    Zotero.CopyPDFs.init();
  }, false);
}

module.exports = Zotero.CopyPDFs;
