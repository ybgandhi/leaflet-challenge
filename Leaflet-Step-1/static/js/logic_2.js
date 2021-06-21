// define GeoJSON url for earthquake plates
var eqURL =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
console.log(eqURL)

//
var eq = L.layerGroup();
console.log(eq);;

// street layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  //tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "light-v10",
  accessToken: API_KEY
});

console.log(streetmap);

// create map giving layer group and street layer properties
var myMap = L.map("map-id", {
    center: [37.09, -95.71],
    zoom: 2 ,
    layers: [streetmap]
});

console.log(myMap);

