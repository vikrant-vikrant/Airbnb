let mapkey = mapToken;
let mapId = styleID;
let url = `https://api.tomtom.com/style/2/custom/style/${mapId}/drafts/0.json?key=${mapkey}`;
const map = new maplibregl.Map({
  container: "map",
  style: url,
  center: coordinates,
  zoom: 12,
});
