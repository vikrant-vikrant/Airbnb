let mapkey = mapToken;
let mapId = styleID;
let url = `https://api.tomtom.com/style/2/custom/style/${mapId}/drafts/0.json?key=${mapkey}`;
console.log(mapkey);
const map = new maplibregl.Map({
  container: "map",
  style: url,
  center: [77.209, 28.6139],
  zoom: 9,
});
