jQuery(document).ready(function() {

	var difficulty=0;

	var timer;

	var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";


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
			startGame();
			//drawMap();


		}
	});

	function showPics(tag,coords){
		console.log('TAG='+tag);
		$.getJSON(flickerAPI,{
			tags:tag,
			tagmode:"any",
			format:"json"
		})
		.done(function(data){
	        data = data.items.splice(0,20);
	        for(i=0; i<20 ; i++){
	            var html="";
	            if(i===0){
	                html='<div class="item active">'
	                    html+='<img id="car0" src="'+data[i].media.m+'"width="100%">'
	                html+='</div>'
	            }else{
	                html='<div class="item">'
	                    html+='<img id="car'+i+'" src="'+data[i].media.m+'"width="100%">'
	                html+='</div>'
	            }
	            $(".carousel-inner").append(html);
	        } 
	    });
	}

	function startGame(){
	    $.getJSON("juegos/Capitales.json", function(data) {
	        console.log(data.type);
	        var place = data.features[Math.floor(Math.random()*data.features.length)];
	        var placecoords=place.geometry.coordinates;
	        var placetag=place.properties.Name;
	        console.log(place.id);
	        console.log(placetag);
	        console.log(placecoords[0]);
	        showPics(placetag,placecoords);
	    });
	    drawMap();

	}


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