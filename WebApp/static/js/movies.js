// console.log("Hello world!");

// Namespace
// Dit hoef je maar 1 keer te noteren, maar zorg er dan voor dat het in het .js bestand staat dat eerst wordt aangeroepen in de HTML.
// Je kunt het ook meerdere keren noteren, want hij controleert zelf of moviesApp al bestaat of niet.

// Hij plaatst alles waar je moviesApp voor zet in het moviesApp object.
// Een globale variabele. Als hij bestaat, dan is het wat het is, anders is het een leeg object
var moviesApp = moviesApp || {};

// Self invoking anonymous function = naamloze functie die zichzelf uitvoert
// Alles wat binnen die functie bestaat is afgeschermd van wat er buiten gebeurt --> code komt niet in conflict met elkaar
(function() {

	// Controller object
	moviesApp.controller = {
		init: function() {

			// Stap 2: config.init wordt aangeroepen vanuit controller
			moviesApp.config.init();			
			// Stap 3: router.init wordt aangeroepen vanuit controller
			moviesApp.router.init();
			// Stap 4: sections object wordt aangeroepen vanuit controller
			moviesApp.sections.init();
		}
	};

	// Router object
	// Maakt verschillende routes binnen je pagina aan
	moviesApp.router = {
		init: function() {
			routie({
			    'about': function() {
			    	console.log("About route is aangeklikt");
			    	// Als 'about' de route is:
			    	// Spreek toggle method aan en geef de parameter de waarde van de section id
			    	moviesApp.sections.toggle("contentAbout");
			    },
			    'movies': function() {
			    	console.log("Movies route is aangeklikt");
			    	// Als 'movies' de route is:
			    	// Spreek toggle method aan en geef de parameter de waarde van de section id
			    	moviesApp.sections.toggle("contentMovies");
			    },
			    // Als je niet 'about' of 'movies' achter de link hebt gezet, laat hij altijd movies zien.
			    '*': function() {
			    	console.log("Geen route is aangeklikt");
			    	// Spreek toggle method aan en geef de parameter de waarde van de section id
			    	moviesApp.sections.toggle("contentMovies");
			    }			    
			});			
		}
	};

	// Content object - Hier plaats je alle content
	moviesApp.content = {
		about: {
			title: 'About this app',
			// description: 'Beschrijving paragraaf'
			descriptions: [ 
				{
					description: 'Beschrijving paragraaf 1'
				}, 
				{
					description: 'Beschrijving paragraaf 2'
				}, 
				{
					description: 'Beschrijving paragraaf 3'
				}, 
				{
			  		description: 'Beschrijving paragraaf 4'
				}        
			]			
		},

		// Movies array met daar in:
		// Voor elke film een object met properties
		movies: [
			{
				title: 'Shawshank Redemption',
				releaseDate: 'Release date: 14 October 1994',
				description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
				cover: 'images/shawshank-redemption.jpg'
			},
			{
				title: 'The Godfather',
				releaseDate: 'Release date: 24 March 1972',
				description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
				cover: 'images/the-godfather.jpg'
			},
			{
				title: 'Pulp Fiction',
				releaseDate: 'Release date: 14 October 1994',
				description: "The lives of two mob hit men, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
				cover: 'images/pulp-fiction.jpg'
			},
			{
				title: 'The Dark Knight',
				releaseDate: 'Release date: 18 July 2008',
				description: 'When Batman, Gordon and Harvey Dent launch an assault on the mob, they let the clown out of the box, the Joker, bent on turning Gotham on itself and bringing any heroes down to his level.',
				cover: 'images/the-dark-knight.jpg'
			}			
		]
	};

	// Sections object - Hier render je de content naar de DOM, door middel van Transparency
	moviesApp.sections = {
		init: function() {
			// Hier roep ik onderstaande about & movies methods op
			this.about();
			this.movies();			
		},
		about: function() {
			// Data uit about object in content object wordt naar de DOM gestuurd
			Transparency.render(document.getElementById('contentAbout'), moviesApp.content.about);
		},		
		movies: function() {
			// Data uit movies object in content object wordt naar de DOM gestuurd
			//Transparency.render(document.getElementById('movieCollection'), moviesApp.content.movies, moviesApp.config.moviesDirectives);

			// Als de data al in de local storage staat
			if(localStorage.getItem('movies')) {
				console.log('local');

				var movieData = localStorage.getItem('movies');

				// Tekst wordt omgezet in objecten
				console.log(JSON.parse(movieData));
				// Wordt de data uit de local storage in de HTML gezet.
				Transparency.render(document.getElementById('movieCollection'), movieData, moviesApp.config.moviesDirectives);
				
				// Log parsed JSON, --> er worden weer javascript objects van gemaakt van de tekst
				//console.log('parsed response', movieData);	
			}

			// Als de data nog niet in de local storage staat, wordt het opgehaald van de API en wordt het alsnog in de local storage gezet.
			else {
				console.log('external');
				// XHR object wordt hier gebruikt om de data van de API te halen.
				moviesApp.config.xhr.trigger('GET', 'http://dennistel.nl/movies', function(response) {

					// Als het nog niet in de local storage staat, wordt het er alsnog ingezet.
					localStorage.setItem('movies', response);
			
					// Variabele movieData is gelijk aan de JSON parse
					var movieData = JSON.parse(response);

					// Log JSON response text --> terug als tekst
					//console.log ('responseText', response);

					// Log parsed JSON, --> er worden weer javascript objects van gemaakt van de tekst
					//console.log('parsed response', movieData);			

					// movieData = data uit API, wordt in de HTML geplaatst
					Transparency.render(document.getElementById('movieCollection'), movieData, moviesApp.config.moviesDirectives);
				});
			}
		},

		toggle: function(section) {
			// removeClassActiveFromSections functie in utils object wordt aangeroepen
			moviesApp.utils.removeClassActiveFromSections();

			// Geef de class 'active' aan de section die als parameter wordt meegegeven aan de toggle functie.
			document.querySelector('#' + section).classList.add("active");
		}		
	};

	moviesApp.utils = {
		// Bij alle sections wordt de class 'active' verwijderd, zodat er maar 1 section tegelijk de class 'active' heeft
		removeClassActiveFromSections: function() {
			// Zoek alle sections in de HTML
			var allSections = document.getElementsByTagName('section');

			// Loopt door alle sections in de HTML, daar wordt bij alle sections de class 'active' verwijderd
	        for(var i = 0; i < allSections.length; i++) {
	            allSections[i].classList.remove('active');
	        }			
		}
	}

	// Config object, iets wat je vooraf wilt aanroepen voor de app start
	moviesApp.config = {
		init: function() {
			// Roept transparency functie binnen eigen object aan
			// Binnen zelfde object kun je met this. aanspreken.			
			this.transparency();
		},
		// Dit zorgt ervoor dat er door transparency gekeken wordt naar data-name
		transparency: function() {
			Transparency.matcher = function(element, key) {
			  return element.el.getAttribute('data-name') == key;
			};			
		},
		// Wordt aangeroepen vanuit transparency (moviesApp.sections)		
		moviesDirectives: {
			// Dit zorgt ervoor dat de waarde van cover in het src="" attribuut terecht komt.
			cover: {
				src: function(params) {
					return this.cover;
				}
			}
		},

		// XHR object
		xhr: {
			trigger: function (type, url, success, data) {
				var req = new XMLHttpRequest;
				req.open(type, url, true);

				req.setRequestHeader('Content-type','application/json');

				type === 'POST' ? req.send(data) : req.send(null);

				req.onreadystatechange = function() {
					if (req.readyState === 4) {
						if (req.status === 200 || req.status === 201) {
							success(req.responseText);
						}
					}
				}
			}
		}				
	}	

	// Stap 1: Hij start controller.init
	moviesApp.controller.init();
})();