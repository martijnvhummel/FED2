// ## 4.1: Local Scope
function() {
	var iterator = 'iterator';

	var min = 0;

	var max = 10;
}

// ## 4.2: Global scope

var iterator = 'iterator';

var min = 0;

var max = 10;

// ## 4.3: Closure
// Normaal gesproken wordt er 'iets' gedaan/aangemaakt binnen een functie.
// Deze data wil je terug krijgen (return), omdat je er anders niets aan hebt.
// Een closure is een functie binnen een functie, welke toegang heeft tot de variabelen en parameters van de omhullende functie
// De closure functie kan de uitkomst van de omhullende functie returnen
// Code voorbeeld:

var Naam = function(voornaam, achternaam) {
	var intro = "Mijn naam is ";

	return function() {
		return console.log(intro + voornaam + " " + achternaam); 
	}
}

Naam("Martijn", "van Hummel");
