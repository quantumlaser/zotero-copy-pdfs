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
  try {
    items.forEach(function(item) {
      alert(JSON.stringify(item));
      try {
        alert(JSON.stringify(item.attachments));
      } catch (e) {}
      try {
        if (item.isRegularItem()) {
          var attachments = item.getAttachments(false);
          for (var a in attachments) {
            var attachment = Zotero.Items.get(attachments[a]);
            if (attachment.attachmentMIMEType == 'application/pdf' ||
              attachment.attachmentMIMEType == 'text/html') {
              // fulltext.push(a_item.attachmentText);
              alert(JSON.stringify(attachment.path));
            }
          }
        }
      } catch (e) {}
      try {
        testItem(item);
      /*
      if (item.attachments) {
        for (var i in item.attachments) {
          var attachment = item.attachments[i];
          alert(attachment.localPath);
        }
      }
      */
      } catch (e) {}
    });
  } catch (e) { }
};

function testItem(item) {
  var attachmentString = "";

  for (var i in item.attachments) {
    var attachment = item.attachments[i];
    // Unfortunately, it looks like \{ in file field breaks BibTeX (0.99d)
    // even if properly backslash escaped, so we have to make sure that
    // it doesn't make it into this field at all
    var title = cleanFilePath(attachment.title);
    var path = null;

    if (Zotero.getOption("exportFileData") && attachment.saveFile &&
      attachment.mimeType == 'application/pdf') {
    //	path = cleanFilePath(attachment.defaultPath);
      path = "/pdfs/" + encodeFilePathComponent(title);
      attachment.saveFile(path, true);
    } else if (attachment.localPath) {
    //	path = cleanFilePath(attachment.localPath);
      path = "/pdfs/" + encodeFilePathComponent(title);
    }

    if (path) {
      attachmentString += ";" + encodeFilePathComponent(title)
        + ":" + encodeFilePathComponent(path)
        + ":" + encodeFilePathComponent(attachment.mimeType);
      alert(path);
    }
  }
}

function cleanFilePath(str) {
  return str.replace(/(?:\s*[{}]+)+\s*/g, ' ');
}

var filePathSpecialChars = '\\\\:;$'; // $ for Mendeley (see cleanFilePath for {})
var encodeFilePathRE = new RegExp('[' + filePathSpecialChars + ']', 'g');
function encodeFilePathComponent(value) {
  return value.replace(encodeFilePathRE, "\\$&");
}

function decodeFilePathComponent(value) {
  return value.replace(/\\([^A-Za-z0-9.])/g, "$1");
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', function(e) {
    Zotero.CopyPDFs.init();
  }, false);
}

module.exports = Zotero.CopyPDFs;
