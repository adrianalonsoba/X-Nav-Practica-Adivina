jQuery(document).ready(function() {

	var map = L.map('map').setView([40.2838, -3.8215], 13);
	
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);


	var marker = L.marker([40.2838, -3.8215]).addTo(map);

	marker.bindPopup("<b>Esto es el aulario III de la URJC</b><br>I am a popup.").openPopup();

	function onMapClick(e) {
	    var marker = L.marker(e.latlng).addTo(map);
	    marker.bindPopup("<b>Coordenadas</b><br>"+e.latlng).openPopup();
	}

	map.on('click', onMapClick);

	map.locate({setView: true, maxZoom: 16});

	function onLocationFound(e) {
	    var radius = e.accuracy / 2;

	    L.marker(e.latlng).addTo(map)
	        .bindPopup("You are within " + radius + " meters from this point").openPopup();

	    L.circle(e.latlng, radius).addTo(map);
	}

	map.on('locationfound', onLocationFound);

	function onLocationError(e) {
	    alert(e.message);
	}

	map.on('locationerror', onLocationError);
});