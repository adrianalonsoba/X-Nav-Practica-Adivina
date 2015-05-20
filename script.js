jQuery(document).ready(function() {

	var difficulty=0;

	var score=0;

	var placecoords;

	var placetag;

	var picsdisplayed=1;

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
	            var html;
	            if(i===0){
	                html='<div class="item active">'
	                    html+='<img id="carousel0" src="'+data[i].media.m+'"width="100%">'
	                html+='</div>'
	            }else{
	                html='<div class="item">'
	                    html+='<img id="carousel'+i+'" src="'+data[i].media.m+'"width="100%">'
	                html+='</div>'
	            }
				$("#myCarousel").data("bs.carousel").options.interval = 3000/difficulty;           
	            $(".carousel-inner").append(html);
	        } 
	    });
	}

	function startGame(){
	    $.getJSON("juegos/Capitales.json", function(data) {
	        console.log(data.type);
	        var place = data.features[Math.floor(Math.random()*data.features.length)];
	        placecoords=place.geometry.coordinates;
	        placetag=place.properties.Name;
	        console.log(place.id);
	        console.log(placetag);
	        console.log(placecoords[0]);

	        showPics(placetag,placecoords);
	    });
	    drawMap(); 
	}

	//actualiza el numero de fotos mostradas
	$("#myCarousel").on("slid.bs.carousel",function(){
        picsdisplayed++;
        //alert(picsdisplayed);
	});

	function Dist(lat1, lon1, lat2, lon2){
	  	rad = function(x) {return x*Math.PI/180;}
		  var R     = 6378.137;                          //Radio de la tierra en km
		  var dLat  = rad( lat2 - lat1 );
		  var dLong = rad( lon2 - lon1 );

		  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		  var d = R * c;

		  return d.toFixed(3);                      //Retorna tres decimales
	}

	function drawMap(){
		var map = L.map('map').setView([40.2838, -3.8215], 13);
		
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		function onMapClick(e) {
		    var marker = L.marker(e.latlng).addTo(map);
		    marker.bindPopup("<b>Coordenadas</b><br>"+e.latlng).openPopup();
		    var dist=e.latlng.distanceTo(L.latLng(placecoords[0], placecoords[1]))/1000;
		    alert("clic:"+e.latlng+" \norigen:"+L.latLng(placecoords[0], placecoords[1])+"\ndistancia:"+dist+'km'+
		    	        '\nsitio:'+placetag);
		}
		
		map.on('click', onMapClick);

		}

});