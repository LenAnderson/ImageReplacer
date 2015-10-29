// ==UserScript==
// @name         Image Replacer
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/ImageReplacer/raw/master/ImageReplacer.user.js
// @version      1.2
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
    img.addEventListener('contextmenu', listener);
});

function listener(evt) {
    if (evt.ctrlKey) {
        evt.preventDefault();
        if (this.getAttribute('data-image-replacer')) {
            if (confirm('Do you want to stop replacing this image?')) {
                subs.splice(subs.lastIndexOf(this.src), 1);
                GM_setValue('image-replacer', JSON.stringify(subs));
                Array.prototype.forEach.call(document.querySelectorAll('img[data-image-replacer-original="' + this.getAttribute('data-image-replacer-original') + '"]'), unreplace);
            }
        } else if (confirm('Do you want to replace this image?')) {
            subs.push(this.getAttribute('src'));
            GM_setValue('image-replacer', JSON.stringify(subs));
            Array.prototype.forEach.call(document.querySelectorAll('img[src="' + this.getAttribute('src') + '"]'), replace);
        }
    }
}

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


var mo = new MutationObserver(function(muts) {
    muts.forEach(function(mut) {
        Array.prototype.forEach.call(mut.addedNodes, function(node) {
            if (node instanceof HTMLElement) {
                if (node.tagName == 'IMG') {
                    node.addEventListener('contextmenu', listener);
                    if (subs.lastIndexOf(node.getAttribute('src')) != -1) {
                        replace(node);
                    }
                } else {
                    Array.prototype.forEach.call(node.querySelectorAll('img'), function(img) {
                        img.addEventListener('contextmenu', listener);
                        if (subs.lastIndexOf(img.getAttribute('src')) != -1) {
                            replace(img);
                        }
                    });
                }
            }
        });
    });
});
mo.observe(document.body, {childList: true, subtree: true});
