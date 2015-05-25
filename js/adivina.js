    var coorElegidas = "";
    var coorSolucion = "";
    var juegoElegido = "";
    var dificultad;
    var dificultadTexto = "";
    var capitales = "";
    var museos = "";
    var actores = "";
    var lugar = "";
    var fotos = 0;
    var map;
    var mapInicio = true;
    var intervalOn = false;
    var numeroJuego = 1;
    var repetido = false;
    var actual;
     //preparar la pantalla de dificultad
    function eligeDificultad() {
        $("#info").hide();
        $("#dificultad").show();
    };


    function comenzarJuego(){
    	$("#dificultad").hide();
    	$("#fotos").show();
    	if (juegoElegido === "Capitales") 
    		juegoCapitales();
        if (juegoElegido === "Museos") 
            juegoMuseos();
        if (juegoElegido === "Actores") 
            juegoActores();
    };

    //juego de capitales
    function juegoCapitales(){  
    	alert("Comienza el juego de Capitales!");   
        if(capitales == ""){
            $.getJSON("juegos/capitales.json", function(data) { 
                capitales = data;
                mostrarFotos(capitales);
            });    
        }else{
            mostrarFotos(capitales);
        }         
    };

    //juego de museos
    function juegoMuseos(){  
        alert("Comienza el juego de Museos!");   
        if(museos == ""){
            $.getJSON("juegos/museos.json", function(data) { 
                museos = data;
                mostrarFotos(museos);
            });    
        }else{
            mostrarFotos(museos);
        }         
    };

    //juego de actores
    function juegoActores(){  
        alert("Comienza el juego de Actores!");   
        if(actores == ""){
console.log("pido json");
            $.getJSON("juegos/actores.json", function(data) { 
console.log("pedido json");
                actores = data;
                mostrarFotos(actores);
            });    
        }else{
console.log("else");
            mostrarFotos(actores);
        }         
    };

    function mostrarFotos(juego){
    	var i = Math.floor(Math.random() * juego.features.length);
        
        //coordenadas del lugar del json
        coorSolucion = juego.features[i].geometry.coordinates;
console.log("mostrarFotos"); 
        //lugar sacado del json
        lugar =  juego.features[i].properties.name;
    	var urlFlickr = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + lugar + "&tagmode=any&format=json&jsoncallback=?";
        $.getJSON(urlFlickr, function(data) {
        	i = 0;
        	interval = setInterval(function(){
        		hayintervalo = true;
    			var imagen = "<img src="+ data.items[i].media.m +" style='width: 100%; height: 360px;'>";
    			$('#fotos').html(imagen);
                if(i == data.items.length - 1)
    					i = 0;
    			else
    				i++;
            	fotos++;     
   		   }, dificultad);  
            intervalOn = true;
    	});
    };

	function calcularDistancia(e){

        var radio     = 6378.137;                         
        var distLat = ((coorSolucion[0] - e.latlng.lat) * Math.PI) /180;
		var distLong = ((coorSolucion[1] - e.latlng.lng) * Math.PI) /180;

        var a = Math.sin(distLat/2)*Math.sin(distLat/2) + Math.cos((e.latlng.lat*Math.PI)/180)
			* Math.cos((coorSolucion[0] * Math.PI)/180) * Math.sin(distLong/2) *Math.sin(distLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var distancia = radio * c;

        return distancia.toFixed(2);                     
    };

    function guardarPartida(puntos){
        if (repetido==true){
            window.history.go(actual);
        }
        var stateObj = {juego: juegoElegido, dif: dificultad, difTexto: dificultadTexto, puntos: puntos};
        window.history.pushState(stateObj, "ADIVINA", juegoElegido);
        var info = "<li onclick='recuperarJuego("+numeroJuego+")'> Juego: " + juegoElegido + 
        ", Dificultad: " + dificultadTexto + ", Puntos: " + puntos + "</li>";
        
        $("#historialInfo").append(info);   
        numeroJuego++;
    };

    function recuperarJuego(pagina){
        repetido = true;
        actual = numeroJuego-pagina;
        window.history.go(pagina-numeroJuego+1);
    };

    

$(document).ready(function() {
	$("#fotos").hide();
	$("#dificultad").hide();
    $("#resultado").hide();
    $("#historialInfo").hide();

	ponerMapa();

//mirar a ver que hacemos con esto

	function onMapClick(e) {
        if (intervalOn){
		  clearInterval(interval);
          intervalOn = false;
        }
		var distancia = calcularDistancia(e);
		var puntos = (fotos * distancia);      
        $("#solucion").html("<p>"+lugar+"</p>");
        $("#distancia").html("<p>"+distancia+"</p>");
        $("#puntos").html("<p>"+puntos+"</p>");
		$("#fotos").hide();
        $("#resultado").show();
		L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)

        guardarPartida(puntos);
	}
	

	// Seleccionada dificultad
	$("#facil").click(function(){
        dificultadTexto = "Facil"
        $("#dificultadElegida").html("<p>Fácil</p>");
        $("#dificultadElegida").show();
		dificultad = 4000;
		comenzarJuego();
	});

	$("#medio").click(function(){
        dificultadTexto = "Medio"
        $("#dificultadElegida").html("<p>Medio</p>");
        $("#dificultadElegida").show();
		dificultad = 3000;
		comenzarJuego();
	});

	$("#dificil").click(function(){
        dificultadTexto = "Dificil"
        $("#dificultadElegida").html("<p>Dificil</p>");
        $("#dificultadElegida").show();
		dificultad = 2000;
		comenzarJuego();
	});

	$("#experto").click(function(){
        dificultadTexto = "Experto"
        $("#dificultadElegida").html("<p>Experto</p>");
        $("#dificultadElegida").show();
		dificultad = 1000;
		comenzarJuego();
	});

    $("#historial").click(function(){
        $("#fotos").hide();
        $("#dificultad").hide();
        $("#juegoElegido").hide();
        $("#dificultadElegida").hide();
        $("#resultado").hide();
        $("#info").hide();
        $("#historialInfo").show();  
    });

	    //Elegido juego capitales    
    $("#capitales").click(function(){
        resetDatos();
    	juegoElegido = "Capitales";
        $("#juegoElegido").html("<p>"+juegoElegido+"</p>");
        $("#juegoElegido").show();
        eligeDificultad();
        alert("Elige la dificultad");
    });

    $("#museos").click(function(){
        resetDatos();
        juegoElegido = "Museos";
        $("#juegoElegido").html("<p>"+juegoElegido+"</p>");
        $("#juegoElegido").show();
        eligeDificultad();
        alert("Elige la dificultad");
    });

    $("#actores").click(function(){
        resetDatos();
        juegoElegido = "Actores";
        $("#juegoElegido").html("<p>"+juegoElegido+"</p>");
        $("#juegoElegido").show();
        eligeDificultad();
        alert("Elige la dificultad");
    });

    $("#parar").click(function(){
        if (intervalOn){
          clearInterval(interval);
          intervalOn = false;
        }
        guardarPartida("Sin finalizar");
    });

    function resetDatos(){
        $("#fotos").hide();
        $("#dificultad").hide();
        $("#juegoElegido").hide();
        $("#dificultadElegida").hide();
        $("#resultado").hide();
        $("#historialInfo").hide();
        coorElegidas = "";
        coorSolucion = "";
        juegoElegido = "";
        dificultad = "";
        lugar = "";
        fotos = 0;
        dificultadTexto = "";
        ponerMapa();
    };

    window.onpopstate = function(event) {
console.log("onpopstate");
        if (repetido == true) {
            repetido = false;
            resetDatos();
            juegoElegido = event.state.juego;
            dificultad = event.state.dif;
            dificultadTexto = event.state.difTexto;
            $("#juegoElegido").html("<p>"+juegoElegido+"</p>");
            $("#juegoElegido").show();
            $("#dificultadElegida").html("<p>"+dificultadTexto+"</p>");
            $("#dificultadElegida").show();        
            comenzarJuego();
        }
    }
    function ponerMapa(){
        if(mapInicio == false)
            map.remove();
        mapInicio = false;        
        map = L.map('map').setView([40.2838, -3.8215],2);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.control.scale().addTo(map);
        map.on('click', onMapClick);
    };
});
