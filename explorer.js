var VERSION = '2.0';
var getCharDataUrl = (char) => `https://cdn.jsdelivr.net/npm/hanzi-writer-data@${VERSION}/${char}.json`;

function loadData(char, onLoad, onError) {
  var xhr = new XMLHttpRequest();
  if (xhr.overrideMimeType) {
    xhr.overrideMimeType('application/json');
  }
  xhr.open('GET', getCharDataUrl(char), true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4) return;
    if (xhr.status === 200) {
      onLoad(JSON.parse(xhr.responseText));
    } else if (onError) {
      onError(xhr);
    }
  };
  xhr.send(null);
};

function attr(elm, name, value) {
  elm.setAttributeNS(null, name, value);
}

function createElm(elmType) {
  return document.createElementNS('http://www.w3.org/2000/svg', elmType);
}

function renderCharacter(charData) {
  var target = document.querySelector('#target');
  document.body.classList.toggle('has-radical-data', !!charData.radStrokes);
  target.innerHTML = '';
  var svg = createElm('svg');
  attr(svg, 'width', '100%');
  attr(svg, 'height', '100%');
  target.appendChild(svg);
  var group = createElm('g');
  attr(group, 'transform', 'translate(0, 263.671875) scale(0.29296875, -0.29296875)');
  svg.appendChild(group);
  charData.strokes.forEach((stroke, i) => {
    var isRadical = (charData.radStrokes || []).indexOf(i) > -1;
    var path = createElm('path');
    attr(path, 'd', stroke);
    path.classList.toggle('radical-stroke', isRadical);
    group.appendChild(path);
  });
}

function updateClasses() {
  var target = document.querySelector('#target');
  var transparent = document.querySelector('#transparent').checked;
  var radical = document.querySelector('#radical').checked;
  target.classList.toggle('transparent-strokes', transparent);
  target.classList.toggle('color-radical', radical);
}

document.querySelectorAll('input[type=checkbox]').forEach(function(node) {
  node.addEventListener('change', updateClasses);
});

function renderLoadPath(char) {
  var cdnTarget = document.querySelector('#cdn-path');
  var url = getCharDataUrl(char)
  cdnTarget.innerHTML = `<a href="${url}" target="blank">${url}</a>`;

  var npmTarget = document.querySelector('#npm-path');
  npmTarget.innerHTML = `var charData = require('hanzi-writer-data/${char}.json');`;
}

function loadAndRender() {
  var char = document.querySelector('#char-input').value;
  loadData(char, function(charData) {
    renderCharacter(charData);
    renderLoadPath(char);
    window.location.hash = char.codePointAt(0);
  }, function(err) {
    console.error(err);
    alert(`Unable to load data for ${char}`);
  });
}

function setCharFromHash(defaultChar) {
  var hashChar = defaultChar;
  if (window.location.hash) {
    var codePoint = parseInt(window.location.hash.slice(1));
    if (!isNaN(codePoint)) {
      hashChar = String.fromCodePoint(codePoint);
    }
  }
  if (hashChar) {
    document.querySelector('#char-input').value = hashChar;
  }
}

setCharFromHash('我');
window.addEventListener('hashchange', function() {
  setCharFromHash(null);
  loadAndRender();
});
document.querySelector('#update-char').addEventListener('click', loadAndRender);
updateClasses();
loadAndRender();

