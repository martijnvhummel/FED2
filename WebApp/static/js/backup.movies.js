// console.log("Hello world!");

// Namespace
// Dit hoef je maar 1 keer te noteren, maar zorg er dan voor dat het in het .js bestand staat dat eerst wordt aangeroepen in de HTML.
// Je kunt het ook meerdere keren noteren, want hij controleert zelf of cmdGeo al bestaat of niet.
// Hij plaatst alles waar je cmdGeo. voor zet in het cmdGeo object.
var moviesApp = moviesApp || {};

(function() {

	// Controller object
	moviesApp.controller = {
		init: function() {

			Transparency.matcher = function(element, key) {
			  return element.el.getAttribute('data-name') == key;
			};

			// Stap 2: router.init wordt aangeroepen vanuit controller
			moviesApp.router.init();
			// Stap 3: sections object wordt aangeroepen vanuit controller
			moviesApp.sections.init();
		}
	};

	// Router object
	moviesApp.router = {
		init: function() {
			routie({
			    'about': function() {
			    	console.log("About route is aangeklikt");
			    },
			    'movies': function() {
			    	console.log("Movies route is aangeklikt");
			    }
			});			
		}
	};

	// Content object - Hier plaats je alle content
	moviesApp.content = {
		// Is dit goed genoteerd?
		moviesApp.about = {
			title: 'About this app',
			// description: 'Dit is een beschrijving van de about section.'
			description: [ 
				{
			  		'Beschrijving paragraaf 1'
				}, 
				{
			  		'Beschrijving paragraaf 2'
				},
				{
			  		'Beschrijving paragraaf 3'
				},
				{
			  		'Beschrijving paragraaf 4'
				}        
			]			
		},

		// Movies array met daar in:
		// Voor elke film een object met properties
		movies: [
			{
				title: 'Shawshank Redemption',
				releaseDate: '14 October 1994',
				description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
				cover: 'Green'
			},
			{
				title: 'The Godfather',
				releaseDate: '24 March 1972',
				description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
				cover: 'Blue'
			},
			{
				title: 'Pulp Fiction',
				releaseDate: '14 October 1994',
				description: "The lives of two mob hit men, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
				cover: 'Red'
			},
			{
				title: 'The Dark Knight',
				releaseDate: '18 July 2008',
				description: 'When Batman, Gordon and Harvey Dent launch an assault on the mob, they let the clown out of the box, the Joker, bent on turning Gotham on itself and bringing any heroes down to his level.',
				cover: 'Purple'
			}			
		]
	};

	// Sections object - Hier render je de content naar de DOM
	moviesApp.sections = {
		init: function() {
			// Hier roep ik onderstaande about & movies methods op
			moviesApp.sections.about();
			moviesApp.sections.movies();
			moviesApp.sections.toggle();			
		},
		about: function() {
			// Is dit goed???
			Transparency.render(document.getElementById('contentAbout'), moviesApp.content.about);
			
		},		
		movies: function() {
			// Is dit goed???
			Transparency.render(document.getElementById('contentMovies'), moviesApp.content.movies);					
		},
		toggle: function(section) {
			// if nav ul click --> add class .active?		
			var aboutLink = document.querySelectorAll('#aboutLink');
			var moviesLink = document.querySelectorAll('#moviesLink');
		}		
	};

	// Stap 1: Hij start controller.init
	moviesApp.controller.init();

})();