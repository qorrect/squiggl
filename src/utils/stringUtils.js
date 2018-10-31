const lowerAlphaChars = 'abcdefghijklmnopqrstuvwxyz';
const upperAlphaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const specialChars = '!@$%^*';
const numericChars = '0123456789';
const crypto = require('crypto');
const _ = require('lodash');

function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function stripUserFromEmail(str) {
  const idx = str.indexOf('@');
  if (idx !== -1) {
    return str.substr(0, idx);
  }
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function collectionContainsPunctuation(list) {
  return list.some(p => containsPuncuation(p));
}

function containsPuncuation(str,  puncuation = '&!@#%^*()+?,<>{}[]|;"\'.') {

  const puncs = [...puncuation];

  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (puncs.indexOf(c) !== -1) {
      return true;
    }
  }
  return false;
}


const _createADPassword = _.partial(createPassword, 10, 5, 2, 2);

function createADPassword() {
  function isValid(p) {
    // Must start with a letter
    if (specialChars.indexOf(p[0]) !== -1) return false;
    // Must have no sequential characters
    for (let i = 0; i < (p.length - 1); i++) {
      if (p[i] === p[i + 1]) {
        return false;
      }
    }
    return true;
  }

  let pwd = _createADPassword();
  while (!isValid(pwd)) {
    pwd = _createADPassword();
  }
  return pwd;
}

function createPassword(_lowerAlpha = 5, numeric = 3, special = 1, uppercase = 1) {
  let ret = '';
  const lowerAlpha = Math.max(_lowerAlpha - 1, 0); // Subtract one for our manadatory first letter as alpha
  for (let i = 0; i < lowerAlpha; i++) {
    ret += lowerAlphaChars[randomInt(lowerAlphaChars.length)];
  }
  for (let i = 0; i < numeric; i++) {
    ret += numericChars[randomInt(numericChars.length)];
  }
  for (let i = 0; i < special; i++) {
    ret += specialChars[randomInt(specialChars.length)];
  }
  for (let i = 0; i < uppercase; i++) {
    ret += upperAlphaChars[randomInt(upperAlphaChars.length)];
  }
  return upperAlphaChars[randomInt(upperAlphaChars.length)] + shuffle([...ret]).reduce((acc, val) => acc + '' + val);
}
function trimLeftSlash(str, char = '/') { return trimLeft(str, char); }

function trimLeft(str, char) {
  if (str && _.isString(str)) {
    let i = 0;
    while (str[i++] === char && i < str.length) {
      continue;
    }
    return str.substr((i - 1));
  }
  else {
    return '';
  }
}

function trimRight(_str, ch) {
  let str = _str;
  for (let i = str.length - 1; i >= 0; i--) {
    if (ch !== str.charAt(i)) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
}
function nl2br(text) {
  return text.replace(/[\r\n|\n]/g,'<br/>');
}

function trimAll(list, toLowercase = false) {
  return list.map(x => toLowercase ? x.toString().toLowerCase().trim() : x.toString().trim());
}

function trimNewLines(str) {
  return str.replace(/\r?\n|\r/g, '');
}

function isAlpha(str) {
  return new RegExp(/^[a-z]+$/i).test(str);
}

function randomString(lowerAlpha = 4, numeric = 4) {
  let ret = '';
  for (let i = 0; i < numeric; i++) {
    ret += numericChars[randomInt(numericChars.length)];
  }
  for (let i = 0; i < lowerAlpha; i++) {
    ret += lowerAlphaChars[randomInt(lowerAlphaChars.length)];
  }
  return ret.toString();
}

function createHash(doc) {
  return crypto.createHash('md5').update(JSON.stringify(doc)).digest('hex');
}

function objectToString(doc, ignoreEmptyProperties = true) {
  let buffer = '';
  for (const k in doc) {
    if (ignoreEmptyProperties) {
      if (doc[k]) {
        buffer += `${k} = ${JSON.stringify(doc[k], null, 4)}`;
        buffer += '\r\n';
      }
    }
    else {
      buffer += `${k} = ${JSON.stringify(doc[k], null, 4)}`;
      buffer += '\r\n';
    }
  }
  return buffer;
}

function ensureStartsWith(str, ch='/') {
  if (str && str.length > 0) {
    if (str[0] !== ch) return ch + str;
    else return str;
  }
  else return '';
}

// Could use fancy currying here, but the code hints are just not as nice


function ensureEndsWith(str, end = '/') {
  if (str && !str.endsWith(end)) return str + end;
  else return str || '';
}

function sanitizeValue(str) {
  return str.trim().replace(/\s+/g, '_');
}

function getTodayKey(suffix = '') {
  const today = new Date();
  return today.getMonth() + '.' + today.getDate() + '.' + today.getFullYear() + suffix;
}

function getFGSubscriberKey() {
  const d = new Date();
  return `${d.getFullYear()}${d.getMonth()}${d.getDay()}${Date.now()}`;
}

module.exports = {
  randomString,
  createUserId: randomString,
  isNumeric,
  isAlpha,
  trimLeft,
  trimLeftSlash,
  ensureEndsWith,
  ensureEndsWithSlash: ensureEndsWith,
  shuffle,
  specialChars,
  upperAlphaChars,
  createHash,
  objectToString,
  createADPassword,
  createPassword,
  ensureStartsWith,
  ensureStartsWithSlash: ensureStartsWith,
  trimRight,
  sanitizeValue,
  getTodayKey,
  getFGSubscriberKey,
  stripUserFromEmail,
  trimAll,
  trimNewLines,
  containsPuncuation,
  collectionContainsPunctuation,
  nl2br
};
