
	var difficulty=0;

	var score=0;

	var placecoords;

	var placetag;

	var game='';

	var gameid;

	var picsdisplayed=1;

	var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

	$('#gamezone').hide();

	$('#easy').click(function(){
		difficulty=1;
		$('#difficulty').html('fácil');

	});

	$('#normal').click(function(){
		difficulty=3;
		$('#difficulty').html('normal');
	});

	$('#hard').click(function(){
		difficulty=6;
		$('#difficulty').html('difícil');
	});

	$('#capitals').click(function(){
		game='Capitales.json';
		gameid=1;
		$('#game').html('Capitales');
	});

	$('#countries').click(function(){
		game='Paises.json';
		gameid=2;
		$('#game').html('Paises');
	});

	$('#monuments').click(function(){
		game='Monumentos.json';
		gameid=3;
		$('#game').html('Monumentos');
	});

	//OJO CAMBIAR 
	$('#abort').click(function(){
		window.location.reload();
	});

	$('#start').click(function(){
		if(difficulty===0||game===''){
			alert('Elige una dificultad y juego');
		}else{
			startGame();
		}
	});

	function startGame(){
		picsdisplayed=1;
		$(".carousel-inner").html('');
		$("#myCarousel").data("bs.carousel").options.interval = 6000/difficulty;          
		$('#begin').hide();
		$('#gamezone').show();
	    $.getJSON("juegos/"+game, function(data) {
	        var place = data.features[Math.floor(Math.random()*data.features.length)];
	        placecoords=place.geometry.coordinates;
	        placetag=place.properties.Name;
	        showPics(placetag,placecoords);
	        drawMap();
	    });
	}

	function showPics(tag,coords){
		$.getJSON(flickerAPI,{
			tags:tag,
			tagmode:"any",
			format:"json"
		})
		.done(function(data){
	        data = data.items.splice(0,10);
	        for(i=0; i<10 ; i++){
	            var html;
	            if(i===0){
	                html='<div class="item active">'
	                    html+='<img id="carousel0" src="'+data[i].media.m+'"width="100%" "height="360px">'
	                html+='</div>'
	            }else{
	                html='<div class="item">'
	                    html+='<img id="carousel'+i+'" src="'+data[i].media.m+'"width="100%" "height="360px">'
	                html+='</div>'
	            }
	            $(".carousel-inner").append(html);
	        } 
	    });
	}

	function drawMap(){
		var map = L.map('map').setView([40.2838, -3.8215], 13);
		
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		map.on('click', onMapClick);

	}

	function onMapClick(e) {         
	    var dist=e.latlng.distanceTo(L.latLng(placecoords[0], placecoords[1]))/1000;
	    score=dist*picsdisplayed;
	    showScore(dist);
	}

	function showScore(dist){
		$("#myCarousel").data("bs.carousel").options.interval = 0; 
		//$(".carousel-inner").html('');          
		$('#gamezone').hide();
		$('#gameover').html('<h1>'+'LUGAR: '+placetag+'<br>'+
			                'DISTANCIA: '+dist.toFixed(3)+' Km'+'<br>'+
			                'PUNTUACIÓN: '+score.toFixed(3)+'</h1>');
		saveHistory();
		$('#begin').show();
	}	

	function saveHistory(){
		var stateObj={
			name:game,
			date:new Date(),
			score:score,
			difficulty:difficulty
		}
		history.pushState(stateObj,'Adivina',location.href+game+difficulty);
		var html= '<a href="javascript:goTo('+gameid+','+difficulty+')">'+game+'Puntos: '+score+' Fecha:'+stateObj.date+'</a>'+'<br>';
		$('#history').append(html);	
	}
	//actualiza el numero de fotos mostradas
	$("#myCarousel").on("slid.bs.carousel",function(){
        picsdisplayed++;
        //alert(picsdisplayed);
	});


	function goTo(gameId,difficultY){

		if(gameId===1){
			gameid=gameId;
			difficulty=difficultY;
			game='Capitales.json';
		} else if(gameId===2){
			gameid=gameId;
			difficulty=difficultY;
			game='Paises.json';
		}else{
			gameid=gameId;
			difficulty=difficultY;
			game='Monumentos.json';
		}
		startGame();
	}