   //Por Mariano Martinez Robledo

    var coorElegidas = "";
    var coorSolucion = "";
    var juegoElegido = "";
    var dificultad;
    var dificultadTexto = "";
    var capitales = "";
    var museos = "";
    var monumentos = "";
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

    //comenzar el juego seleccionado
    function comenzarJuego(){
    	$("#dificultad").hide();
    	$("#fotos").show();
    	if (juegoElegido === "Capitales") 
    		juegoCapitales();
        if (juegoElegido === "Museos") 
            juegoMuseos();
        if (juegoElegido === "Monumentos") 
            juegoMonumentos();
    };

    //juego de capitales
    function juegoCapitales(){  
    	alert("Comienza el juego de Capitales!");   
        $.getJSON("http://mrobledo.github.io/X-Nav-Practica-Adivina/juegos/capitales.json", function(data) {
            capitales = data;
            mostrarFotos(capitales);
        });            
    };

    //juego de museos
    function juegoMuseos(){  
        alert("Comienza el juego de Museos!");   
        $.getJSON("http://mrobledo.github.io/X-Nav-Practica-Adivina/juegos/museos.json", function(data) { 
            museos = data;
            mostrarFotos(museos);
        });            
    };

    //juego de monumentos
    function juegoMonumentos(){  
        alert("Comienza el juego de Monumentos!");   
        $.getJSON("http://mrobledo.github.io/X-Nav-Practica-Adivina/juegos/monumentos.json", function(data) { 
            monumentos = data;
            mostrarFotos(monumentos);
        });    
    };


    //funcion para mostrar las fotos
    function mostrarFotos(juego){
    	var i = Math.floor(Math.random() * juego.features.length);
        
        //coordenadas del lugar del json
        coorSolucion = juego.features[i].geometry.coordinates;
        //lugar sacado del json
        lugar =  juego.features[i].properties.name;
    	var urlFlickr = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + lugar + "&tagmode=any&format=json&jsoncallback=?";
        $.getJSON(urlFlickr, function(data) {
        	i = 0;
        	interval = setInterval(function(){
        		intervalOn = true;
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

    //funcion para calcular la distancia entre la respuesta y la solucion
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

    //funcion para guardar los datos de la partida en el historial
    function guardarPartida(puntos){
        if (repetido==true){
            repetido = false;
            window.history.go(actual);
        }
        var stateObj = {juego: juegoElegido, dif: dificultad, difTexto: dificultadTexto, puntos: puntos};
        window.history.pushState(stateObj, "ADIVINA", juegoElegido+numeroJuego);
        var info = "<li onclick='recuperarJuego("+numeroJuego+")'> Juego: " + juegoElegido + 
        ", Dificultad: " + dificultadTexto + ", Puntos: " + puntos + "</li>";
        
        $("#historialInfo").append(info);   
        numeroJuego++;
    };

    //funcion para jugar una partida guardada en el historial
    function recuperarJuego(pagina){
        if((pagina+1) == numeroJuego){
            $("#juegoElegido").show();
            $("#dificultadElegida").show();        
            comenzarJuego();
        }
        else{
            repetido = true;
console.log("retrocedo: "+(pagina-numeroJuego+1));
            actual = numeroJuego-pagina-1;
            window.history.go(pagina-numeroJuego+1);
        }
    };

    
//empieza el programa cuando el dom este cargado
$(document).ready(function() {
	$("#fotos").hide();
	$("#dificultad").hide();
    $("#resultado").hide();
    $("#historialInfo").hide();
	ponerMapa();


    //funcion para programar el funcionamiento cuando clicamos el mapa
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
	

	// manejador para cuando clicamos el boton facil
	$("#facil").click(function(){
        dificultadTexto = "Facil"
        $("#dificultadElegida").html("<p>Fácil</p>");
        $("#dificultadElegida").show();
		dificultad = 4000;
		comenzarJuego();
	});

    // manejador para cuando clicamos el boton medio
	$("#medio").click(function(){
        dificultadTexto = "Medio"
        $("#dificultadElegida").html("<p>Medio</p>");
        $("#dificultadElegida").show();
		dificultad = 3000;
		comenzarJuego();
	});

    // manejador para cuando clicamos el boton dificil
	$("#dificil").click(function(){
        dificultadTexto = "Dificil"
        $("#dificultadElegida").html("<p>Dificil</p>");
        $("#dificultadElegida").show();
		dificultad = 2000;
		comenzarJuego();
	});

    // manejador para cuando clicamos el boton experto
	$("#experto").click(function(){
        dificultadTexto = "Experto"
        $("#dificultadElegida").html("<p>Experto</p>");
        $("#dificultadElegida").show();
		dificultad = 1000;
		comenzarJuego();
	});

    // manejador para cuando clicamos el boton historial, cargamos la pantalla historial
    $("#historial").click(function(){
        $("#fotos").hide();
        $("#dificultad").hide();
        $("#juegoElegido").hide();
        $("#dificultadElegida").hide();
        $("#resultado").hide();
        $("#info").hide();
        $("#historialInfo").show();  
    });

    //manejador para el boton capitales, cargamos datos de capitales y preparamos botones de dificultad   
    $("#capitales").click(function(){
        resetDatos();
    	juegoElegido = "Capitales";
        $("#juegoElegido").html("<p>"+juegoElegido+"</p>");
        $("#juegoElegido").show();
        eligeDificultad();
        alert("Elige la dificultad");
    });

    //manejdaro para el boton museos, cargamos datos de museos y preparamos botones de dificultad 
    $("#museos").click(function(){
        resetDatos();
        juegoElegido = "Museos";
        $("#juegoElegido").html("<p>"+juegoElegido+"</p>");
        $("#juegoElegido").show();
        eligeDificultad();
        alert("Elige la dificultad");
    });

    //manejador para el boton monumentos, cargamos datos de monumentos y preparamos botones de dificultad 
    $("#monumentos").click(function(){
        resetDatos();
        juegoElegido = "Monumentos";
        $("#juegoElegido").html("<p>"+juegoElegido+"</p>");
        $("#juegoElegido").show();
        eligeDificultad();
        alert("Elige la dificultad");
    });

    //manejador para el boton parar, para la partida y guardamos los datos
    $("#parar").click(function(){
        if (intervalOn){
          clearInterval(interval);
        intervalOn = false;
        }
        guardarPartida("Sin finalizar");
        $( "#historial" ).trigger( "click" );
    });

    //funcion para resetear los datos para una nueva partida
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

    //manejador que salta cuando llamamos a la funcion window.history.go()
    window.onpopstate = function(event) {
        if (repetido == true) {
            //repetido = false;
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

    //funcion para cargar el mapa en la pagina
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
