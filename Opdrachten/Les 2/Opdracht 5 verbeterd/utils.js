var cmdGeo = cmdGeo || {};

(function() {
 	cmdGeo.debug = {
		// FUNCTIES VOOR DEBUGGING
		_geo_error_handler: function(code, message) {
			debug_message('geo.js error '+code+': '+message);		
		},		

		debug_message: function(message) {
			(customDebugging && debugId)?document.getElementById(debugId).innerHTML:console.log(message);
		},
		
		set_custom_debugging: function(debugId) {
		    debugId = this.debugId;
		    customDebugging = true;			
		}
	}

	// Je hoeft hier controller niet aan te roepen, aangezien je in het CMDAAN.js bestand al cmdGeo.debug aanroept in de controller.	
})();
