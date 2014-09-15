// Namespace
// Dit hoef je maar 1 keer te noteren, maar zorg er dan voor dat het in het .js bestand staat dat eerst wordt aangeroepen in de HTML.
// Je kunt het ook meerdere keren noteren, want hij controleert zelf of cmdGeo al bestaat of niet.
// Hij plaatst alles waar je cmdGeo. voor zet in het cmdGeo object.
var cmdGeo = cmdGeo || {};

(function() {

	// Variable declaration
    cmdGeo.SANDBOX = 'SANDBOX';
    cmdGeo.LINEAIR = 'LINEAIR';
    cmdGeo.GPS_AVAILABLE = 'GPS_AVAILABLE';
    cmdGeo.GPS_UNAVAILABLE = 'GPS_UNAVAILABLE';
    cmdGeo.POSITION_UPDATED = 'POSITION_UPDATED';
    cmdGeo.REFRESH_RATE = 1000;
    cmdGeo.currentPosition = currentPositionMarker = customDebugging = debugId = map = interval =intervalCounter = updateMap = false;
    cmdGeo.locatieRij = markerRij = [];

	// We maken hier een namespace aan: een globale variabele
	cmdGeo.controller = {
		init: function() {
			cmdGeo.gps.init();
			cmdGeo.map.init();
			cmdGeo.debug.init();
		}
	};

	//Eerst was dit var gps = { }, maar nu door var cmdGEo... wordt het cmdGeo.gps
	cmdGeo.gps = {
		// Test of GPS beschikbaar is (via geo.js) en vuur een event af
		init: function() {
		    debug_message("Controleer of GPS beschikbaar is...");

		    ET.addListener(GPS_AVAILABLE, _start_interval);
		    ET.addListener(GPS_UNAVAILABLE, function(){debug_message('GPS is niet beschikbaar.')});

		    (geo_position_js.init())?ET.fire(GPS_AVAILABLE):ET.fire(GPS_UNAVAILABLE);			
		},

		// Start een interval welke op basis van REFRESH_RATE de positie updated
		startInterval: function() {
		    debug_message("GPS is beschikbaar, vraag positie.");
		    _update_position();
		    interval = self.setInterval(_update_position, REFRESH_RATE);
		    ET.addListener(POSITION_UPDATED, _check_locations);
		},

		// Vraag de huidige positie aan geo.js, stel een callback in voor het resultaat
		updatePosition: function() {
		    intervalCounter++;
		    geo_position_js.getCurrentPosition(_set_position, _geo_error_handler, {enableHighAccuracy:true});
		},

		// Callback functie voor het instellen van de huidige positie, vuurt een event af
		setPosition: function() {
		    currentPosition = position;
		    ET.fire("POSITION_UPDATED");
		    debug_message(intervalCounter+" positie lat:"+position.coords.latitude+" long:"+position.coords.longitude);
		},

		// Controleer de locaties en verwijs naar een andere pagina als we op een locatie zijn

		checkLocations: function(event) {
		    // Liefst buiten google maps om... maar helaas, ze hebben alle coole functies
		    for (var i = 0; i < locaties.length; i++) {
		        var locatie = {coords:{latitude: locaties[i][3],longitude: locaties[i][4]}};

		        if(_calculate_distance(locatie, currentPosition)<locaties[i][2]){

		            // Controle of we NU op die locatie zijn, zo niet gaan we naar de betreffende page
		            if(window.location!=locaties[i][1] && localStorage[locaties[i][0]]=="false"){
		                // Probeer local storage, als die bestaat incrementeer de locatie
		                try {
		                    (localStorage[locaties[i][0]]=="false")?localStorage[locaties[i][0]]=1:localStorage[locaties[i][0]]++;
		                } catch(error) {
		                    debug_message("Localstorage kan niet aangesproken worden: "+error);
		                }

						// TODO: Animeer de betreffende marker

		                window.location = locaties[i][1];
		                debug_message("Speler is binnen een straal van "+ locaties[i][2] +" meter van "+locaties[i][0]);
		            }
		        }
		    }
		},

		// Bereken het verchil in meters tussen twee punten
		calculateDistance: function(p1, p2) {
		    var pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude);
		    var pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude);
		    return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0);
		}	
	};

 	cmdGeo.map = {
		// GOOGLE MAPS FUNCTIES
		/**
		 * generate_map(myOptions, canvasId)
		 *  roept op basis van meegegeven opties de google maps API aan
		 *  om een kaart te genereren en plaatst deze in het HTML element
		 *  wat aangeduid wordt door het meegegeven id.
		 *
		 *  @param myOptions:object - een object met in te stellen opties
		 *      voor de aanroep van de google maps API, kijk voor een over-
		 *      zicht van mogelijke opties op http://
		 *  @param canvasID:string - het id van het HTML element waar de
		 *      kaart in ge-rendered moet worden, <div> of <canvas>
		 */
		generate: function(myOptions, canvasId) {
			// TODO: Kan ik hier asynchroon nog de google maps api aanroepen? dit scheelt calls
		    debug_message("Genereer een Google Maps kaart en toon deze in #"+canvasId)
		    map = new google.maps.Map(document.getElementById(canvasId), myOptions);

		    var routeList = [];
		    // Voeg de markers toe aan de map afhankelijk van het tourtype
		    debug_message("Locaties intekenen, tourtype is: "+tourType);
		    for (var i = 0; i < locaties.length; i++) {

		        // Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locaties toe
		        try {
		            (localStorage.visited==undefined||isNumber(localStorage.visited))?localStorage[locaties[i][0]]=false:null;
		        } catch (error) {
		            debug_message("Localstorage kan niet aangesproken worden: "+error);
		        }

		        var markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4]);
		        routeList.push(markerLatLng);

		        markerRij[i] = {};
		        for (var attr in locatieMarker) {
		            markerRij[i][attr] = locatieMarker[attr];
		        }
		        markerRij[i].scale = locaties[i][2]/3;

		        var marker = new google.maps.Marker({
		            position: markerLatLng,
		            map: map,
		            icon: markerRij[i],
		            title: locaties[i][0]
		        });
		    }
			// TODO: Kleur aanpassen op het huidige punt van de tour
		    if(tourType == LINEAIR){
		        // Trek lijnen tussen de punten
		        debug_message("Route intekenen");
		        var route = new google.maps.Polyline({
		            clickable: false,
		            map: map,
		            path: routeList,
		            strokeColor: 'Black',
		            strokeOpacity: .6,
		            strokeWeight: 3
		        });

		    }

		    // Voeg de locatie van de persoon door
		    currentPositionMarker = new google.maps.Marker({
		        position: kaartOpties.center,
		        map: map,
		        icon: positieMarker,
		        title: 'U bevindt zich hier'
		    });

		    // Zorg dat de kaart geupdated wordt als het POSITION_UPDATED event afgevuurd wordt
		    ET.addListener(POSITION_UPDATED, update_positie);
		},

        isNumber: function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

		// Update de positie van de gebruiker op de kaart
		updatePosition: function(event) {
		    // use currentPosition to center the map
		    var newPos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
		    map.setCenter(newPos);
	        currentPositionMarker.setPosition(newPos);
		}
	};

	// Hiermee start je de init
	cmdGeo.controller.init();

})();
