set "version=0.0.1"
set "name=zotero-copy-pdfs"
del builds\%name%-%version%-fx.xpi
rd /s/q builds\temp
mkdir builds\temp
mkdir builds\temp\chrome
xcopy /e chrome builds\temp\chrome
copy chrome.manifest builds\temp
copy install.rdf builds\temp
Wzzip -r -p builds\%name%-%version%-fx.xpi builds\temp
rd /s/q builds\temp
