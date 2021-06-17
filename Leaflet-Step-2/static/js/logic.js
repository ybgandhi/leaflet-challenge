// define GeoJSON url for earthquake plates
var eqURL =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
console.log(eqURL);
var tectonicplatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log(tectonicplatesURL);

// create earthquake layer group
var eq = L.layerGroup();
var tectonicplates = L.layerGroup();

// tile layers
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors,<a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

// street layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });

var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

var baseMaps = {
    "Satellite Map": satellite,
    "Grayscale Map": streetmap,
    "Outdoors Maps": outdoors,
    "Dark Map": darkMap
};

var overlayMaps {
    "Earthquakes": eq,
    "Tectonic Plates" tectonicplates
};

// create map giving layer group and street layer properties
var myMap = L.map("mapid", {
    center: [
        37.09, -95.71
    ],
    zoom: 2 ,
    layers: [streetmap, eq]
});

// Control layer passed in baseMaps and overlayMaps
// add layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

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

    // get tectonic plate using GeoJSON using tectonic plate url
    d3.json(tectonicplatesURL, function(data){
        L.geoJSON(data, {
            color: "orange",
            weight: 2
        }).addTo(tectonicplates);
        tectonicplates.addTo(myMap);
    });
    
    // add legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUntil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
    for (var i =0; i < depth.length; i++){
        div.innerHTML +=
        '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i+1] ? '&ndash;' +depth[i+1]+ '<br>': '+');
        }
        return div;
    };
    legend.addTo(myMap);
});