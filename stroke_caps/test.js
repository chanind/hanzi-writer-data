let data;

fetch('/data/all.json').then(res => res.json()).then(res => {
  data = res;
  console.log('loaded!');
});

const getPossibleClipPoints = (pathString) => {
  const pointStrings = pathString.match(/\d+ \d+ L \d+ \d+/ig);
  if (!pointStrings) return [];
  return pointStrings.map(pointString => {
    const parts = pointString.split(/\sL?\s?/).map(p => parseInt(p, 10));
    return [{x: parts[0], y: parts[1]}, {x: parts[2], y: parts[3]}];
  });
};

const CLIP_THRESH = 2;
const COS_SIM_THRESH = 0.95;

const getClipData = (char) => {
  const strokes = data[char].strokes;
  const outlines = strokes.map(stroke => getOutlinePoints(stroke));
  const clipData = {
    char: char,
    strokes: strokes,
    clipped: [],
  };

  strokes.forEach((stroke, i) => {
    const strokeOutline = outlines[i];
    const possibleClipPoints = getPossibleClipPoints(stroke);
    possibleClipPoints.forEach(clipPoint => {
      const cosSim0 = getCosSimAroundPoint(clipPoint[0], strokeOutline);
      const cosSim1 = getCosSimAroundPoint(clipPoint[1], strokeOutline);
      console.log('stroke', i, 'cos sims: ', cosSim0, cosSim1);
      if (cosSim0 > COS_SIM_THRESH && cosSim1 > COS_SIM_THRESH) return;
      outlines.forEach((otherOutline, j) => {
        if (i === j) return;
        const dist0 = distToPath(clipPoint[0], otherOutline);
        const dist1 = distToPath(clipPoint[1], otherOutline);
        if (
          dist0 <= CLIP_THRESH && dist1 <= CLIP_THRESH
        ) {
          clipData.clipped.push({
            stroke: i,
            clippedBy: j,
            at: clipPoint,
          });
        }
      });
    });
  });

  return clipData;
};

function createElm(elmType) {
  return document.createElementNS('http://www.w3.org/2000/svg', elmType);
}

function removeElm(elm) {
  elm.parentNode.removeChild(elm);
}

function attr(elm, name, value) {
  elm.setAttributeNS(null, name, value);
}

const dist = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
const norm = (vect) => dist(vect, {x: 0, y: 0});
const subtract = (p1, p2) => ({x: p1.x - p2.x, y: p1.y - p2.y});

const getOutlinePoints = (pathString, count = 5000) => {
  const path = createElm('path');
  attr(path, 'd', pathString);
  const delta = path.getTotalLength() / count;
  const outline = [];
  for (let i = 0; i < count; i++) {
    const svgPoint = path.getPointAtLength(i * delta);
    outline.push({x: svgPoint.x, y: svgPoint.y});
  }
  return outline;
};

const getCosSimAroundPoint = (point, pathOutline) => {
  // if this is 1, the point is on a flat line.
  const dists = pathOutline.map(outlinePoint => dist(point, outlinePoint));
  const min = Math.min(...dists);
  const pointIndex = dists.indexOf(min);
  const preIndex = (pathOutline.length + pointIndex - 5) % pathOutline.length;
  const postIndex = (pathOutline.length + pointIndex + 5) % pathOutline.length;
  const vect1 = subtract(pathOutline[pointIndex], pathOutline[preIndex]);
  const vect2 = subtract(pathOutline[postIndex], pathOutline[pointIndex]);
  return (vect1.x * vect2.x + vect1.y * vect2.y) / (norm(vect1) * norm(vect2));
}

const distToPath = (point, pathOutline) => {
  const dists = pathOutline.map(outlinePoint => dist(point, outlinePoint));
  return Math.min(...dists);
};


