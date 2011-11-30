const kURIPattern = {
  general: /^([a-z][a-z0-9]+\:)\/\/([a-z0-9;\/:@&=\+\$\.\-_\!~\*'\(\)%]+)([#\?].*)*$/i,
  base64: /^([a-z][a-z0-9]+\:)\/\/([a-z0-9\+\/]+=*)([#\?&].*)*$/i
};

function $extend(obj, ext) {
  for (var key in ext)
    if (!(obj.hasOwnProperty(key)))
      obj[key] = ext[key];
  return obj;
}

function $nop() {
}

function $false() {
  return false;
}

function $equal(x) {
  return x;
}

function $test(attname, node) {
  return node.hasAttribute(attname);
}

function $fix(attname, node) {
  node.setAttribute('href', node.getAttribute(attname));
  node.removeAttribute('oncontextmenu');
  node.removeAttribute('onclick');
}

function $decode(prelen, suflen, url) {
  var match = kURIPattern.base64.exec(url);
  if (match) {
    url = atob(match[2]);
#ifdef __BROWSER_FIREFOX
    return Su.ConvertToUnicode(url.substring(prelen, url.length - suflen));
#else
    return url.substring(prelen, url.length - suflen).replace(/[^\x20-\x7e]+/g, escape);
#endif
  }
  return url;
}

function generateTest(attname) {
  return function(node) {
    return $test(attname, node);
  };
}

function generateFix(attname) {
  return function(node) {
    return $fix(attname, node);
  };
}

function generateDecode(prelen, suflen) {
  return function(url) {
    return $decode(prelen, suflen, url);
  };
}
