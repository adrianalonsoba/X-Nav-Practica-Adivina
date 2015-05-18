jQuery(document).ready(function() {

	var difficulty=0;

	$('#myCarousel').hide();
	$('#map').hide();

	$('#easy').click(function(){
		difficulty=1;
	});

	$('#normal').click(function(){
		difficulty=2;
	});

	$('#hard').click(function(){
		difficulty=3;
	});


	$('#start').click(function(){
		if(difficulty===0){
			alert('Elige una dificultad');
		}else{
			$('#begin').hide();
			$('#myCarousel').show();
			$('#map').show();
			//startGame() drawmap dentro
			drawMap();
		}
	});


	function drawMap(){
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
		}

});