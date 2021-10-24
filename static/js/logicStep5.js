// add console.log to check to see if our code is working
console.log("working");

//create tile layer for the background of our map
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

//create tile layer for the background of our map
let satellitestreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

//create base layer that holds both maps
let baseMaps = {
  "Streets": streets,
  "Satellite": satellitestreets
}

//earthquake layer for map
let earthquakes = new L.layerGroup();

//Define an object that contains overlays
let overlays = {
  Earthquakes: earthquakes
};

//create map object with a center and a zoom level
let map = L.map('mapid', {
    center: [
      39.5, -98.5
    ],
    zoom: 3,
    layers: [streets]
});

//pass our map layers into our layer control and add to map
L.control.layers(baseMaps, overlays).addTo(map);

//retrieve earthquake GeoJSON data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  //creating a geojson layer with retrieved data
  L.geoJson(data, {
    //turn each feature into a circleMarker
    pointToLayer: function(feature, latlng) {
      console.log(data);
      return L.circleMarker(latlng);
    },
  style: styleInfo,
  onEachFeature: function(feature, layer) {
    layer.bindPopup("Magniture: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
  }).addTo(earthquakes);
  var legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
     magnitudes = [0, 1, 2, 3, 4, 5],
     colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"      
    ];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
      console.log(colors[i]);
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);
earthquakes.addTo(map);

});

function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
};

function getRadius(magnitude) {
  if (magnitude == 0) {
    return 1;
  }
  return magnitude * 4;
};

function getColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  if (magnitude > 4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude > 2) {
    return "#eecc00";
  }
  if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
}