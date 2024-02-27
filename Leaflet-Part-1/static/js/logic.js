//Map
let myMap = L.map("map", {
    zoom: 3,
    center: [37,-95]
  });

//Create tile layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url).then(function(data) {
    function mapStyle(feature){
        return{
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    function mapColor(depth) {
        switch (true) {
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
    function mapRadius(mag){
        if (mag === 0){
            return 1;
        }
            return mag * 4;
    }
    L.geoJson(data, {
        pointToLayer: function (feature,latlng){
            return L.circleMarker(latlng);
        },
        style:mapStyle,
        onEachFeature: function(feature,layer){
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);
//Data points 
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"),
            depth = [-10, 10, 30, 50, 70, 90];
        //div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
        for (var i =0; i < depth.length; i++) {
            div.innerHTML += 
            '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + 
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
        return div;
};
    legend.addTo(myMap);
});