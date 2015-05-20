jQuery(document).ready(function() {

	var difficulty=0;

	var score=0;

	var placecoords;

	var placetag;

	var picsdisplayed=1;

	var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";



	$('#goinit').click(function(){
		picsdisplayed=1;
		difficulty=0;
		score=0;
		$('#begin').show();
		alert('!!!!!!!!!');
	});


	$('#myCarousel').hide();
	$('#map').hide();
	$('#gameover').hide();

	$('#easy').click(function(){
		difficulty=1;
	});

	$('#normal').click(function(){
		difficulty=3;
	});

	$('#hard').click(function(){
		difficulty=6;
	});


	$('#start').click(function(){
		if(difficulty===0){
			alert('Elige una dificultad');
		}else{
			$("#myCarousel").data("bs.carousel").options.interval = 6000/difficulty;           
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

	function drawMap(){
		var map = L.map('map').setView([40.2838, -3.8215], 13);
		
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		function onMapClick(e) {
			$("#myCarousel").data("bs.carousel").options.interval = 0;           
		    var marker = L.marker(e.latlng).addTo(map);
		    marker.bindPopup("<b>Coordenadas</b><br>"+e.latlng).openPopup();
		    var dist=e.latlng.distanceTo(L.latLng(placecoords[0], placecoords[1]))/1000;
		    score=dist*picsdisplayed;
		    //alert("clic:"+e.latlng+" \norigen:"+L.latLng(placecoords[0], placecoords[1])+"\ndistancia:"+dist+'km'+'\nsitio:'+placetag+'\npuntuacion:'+score);
		    showScore(dist);

		}

		function showScore(dist){
			$('#myCarousel').hide();
			$('#map').hide();
			
			$('#gameover').html('<h1>'+'LUGAR: '+placetag+'<br>'+
				                'DISTANCIA: '+dist.toFixed(3)+' Km'+'<br>'+
				                'PUNTUACIÓN: '+score.toFixed(3)+'</h1>'+'<br>'+
				                '<p><a  id="goinit" class="btn btn-lg btn-success" href="#" role="button">Volver a empezar</a></p>');
			$('#gameover').show();
			$('#goinit').click(function(){
				picsdisplayed=1;
				difficulty=0;
				score=0;
				$('#gameover').html('');
				$(".carousel-inner").html('');
				$('#begin').show();
			});
		}

		map.on('click', onMapClick);

	}

});