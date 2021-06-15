// define GeoJSON url for earthquake plates
var eqURL =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
console.log(eqURL)

// create earthquake layer group
var eq = L.layerGroup();

// street layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 10,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// create map giving layer group and street layer properties
var myMap = L.map("mapid", {
    center: [
        37.09, -95.71
    ],
    zoom: 2,
    layers: [streetmap, eq]
});

// D3 to pull in data
d3.json(eqURL, function(eqData){
    // set marker size by magnitude
    function markerSize(magnitude){
        return magnitude * 4;
    };
    
    // set marker color by depth
    function chooseColor(depth) {
        switch(true) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "orangered";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "gold";
            case depth > 10:
                return "yellow";
            default:
                return "lightgreen";
        }
    }

    // create GeoJSON layer of all points
    // each popup describes the place and time of earthquake
    L.geoJSON(eqData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng,
                //set style of marker based on properties.mag
                {
                    radius: markerSize(feature.properties.mag),
                    fillColor: chooseColor(feature.geometry.coordinates[2]),
                    fillOpacity: 0.7,
                    color: "black",
                    stroke: true,
                    weight: 0.5
                }
            );
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Location: "+feature.properties.place + "</h2><h2><p>Date: " + feature.properties.time + "</p><hr><p>Magnitude: " +feature.properties.mag + "</p>");
        }
    }).addTo(eq);
    // send earthquake layer to create Map function
    eq.addTo(myMap);
})