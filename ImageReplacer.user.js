// ==UserScript==
// @name         Image Replacer
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/ImageReplacer/raw/master/ImageReplacer.user.js
// @version      1.0
// @description  Replace selected images with other images.
// @author       LenAnderson
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

var subs = JSON.parse(GM_getValue('image-replacer') || '[]');
subs.forEach(function(it) {
    Array.prototype.forEach.call(document.querySelectorAll('img[src="' + it + '"]'), replace);
});

Array.prototype.forEach.call(document.querySelectorAll('img'), function(img) {
    img.addEventListener('contextmenu', function(evt) {
        if (evt.ctrlKey) {
            evt.preventDefault();
            if (img.getAttribute('data-image-replacer')) {
                if (confirm('Do you want to stop replacing this image?')) {
                    subs.splice(subs.lastIndexOf(img.src), 1);
                    GM_setValue('image-replacer', JSON.stringify(subs));
                    Array.prototype.forEach.call(document.querySelectorAll('img[data-image-replacer-original="' + img.getAttribute('data-image-replacer-original') + '"]'), unreplace);
                }
            } else if (confirm('Do you want to replace this image?')) {
                subs.push(img.getAttribute('src'));
                GM_setValue('image-replacer', JSON.stringify(subs));
                Array.prototype.forEach.call(document.querySelectorAll('img[src="' + img.getAttribute('src') + '"]'), replace);
            }
        }
    });
});

function replace(img) {
    img.setAttribute('data-image-replacer', '//www.illmurray.com/g/');
    img.setAttribute('data-image-replacer-original', img.src);
    img.src = location.protocol + '//www.fillmurray.com/g/' + (img.width || img.offsetWidth) + '/' + (img.height || img.offsetHeight);
}
function unreplace(img) {
    img.src = img.getAttribute('data-image-replacer-original');
    img.removeAttribute('data-image-replacer');
    img.removeAttribute('data-image-replacer-original');
}
