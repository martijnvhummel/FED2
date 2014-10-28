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
				'home': function() {
					console.log("Home route is aangeklikt");
					moviesApp.sections.home();
					moviesApp.sections.toggle("contentHome");
				},

			    'about': function() {
			    	console.log("About route is aangeklikt");
			    	// Als 'about' de route is:
			    	// Spreek toggle method aan en geef de parameter de waarde van de section id
			    	moviesApp.sections.toggle("contentAbout");
			    },
			    'spinner': function() {
			    	moviesApp.sections.toggle('contentLoader');
			    },			    
			    'movies': function() {
			    	console.log("Movies route is aangeklikt");

			    	moviesApp.sections.toggle('contentLoader');

			    	// Time delay, zodat de spinner wordt getoond.
			    	setTimeout(function(){
				    	moviesApp.sections.movies();
				    	// Als 'movies' de route is:
				    	// Spreek toggle method aan en geef de parameter de waarde van de section id
				    	moviesApp.sections.toggle("contentMovies");
			    	}, 2000);

			    },
			    // 'movies/details/:id': function(id) {
			    // 	console.log("Movie detailspagina aangeklikt");

			    // 	moviesApp.sections.details(id);
			    // 	moviesApp.sections.toggle("detailPagina");
			    // }, 
			    'movies/details/:title': function(title) {
			    	console.log("Movie detailspagina aangeklikt");

			    	moviesApp.sections.details(title);
			    	moviesApp.sections.toggle("detailPagina");
			    }, 			    
			    'movies/genre/:genre': function(genre) {
			    	console.log("Genre is aangeklikt")

			    	moviesApp.sections.movies(genre);
			    	moviesApp.sections.toggle("contentMovies");
			    },
			    // Als je niet 'about' of 'movies' achter de link hebt gezet, laat hij altijd movies zien.
			    '*': function() {
			    	console.log("Geen route is aangeklikt");	    	
			    	// Spreek toggle method aan en geef de parameter de waarde van de section id
			    	// Time delay, zodat de spinner wordt getoond.
				    	// moviesApp.sections.movies();
				    	// Als 'movies' de route is:
				    	// Spreek toggle method aan en geef de parameter de waarde van de section id
				    	// moviesApp.sections.toggle("contentMovies");
				    moviesApp.sections.home();
			    	moviesApp.sections.toggle("contentHome");
			    }
			});			
		}
	};

	// Content object - Hier plaats je alle content
	moviesApp.content = {
		home: {
			title: 'Bekijk het aanbod van Your Favourite Movies'
		},

		about: {
			title: 'About this app',
			// description: 'Beschrijving paragraaf'
			descriptions: [ 
				{
					description: 'Bekijk de leukste films gewoon thuis!'
				}, 
				{
					description: 'Bepaal welke films jij wilt zien.'
				}, 
				{
					description: 'Vind informatie over jouw favoriete films en acteurs.'
				}       
			]			
		}
	};

	// Sections object - Hier render je de content naar de DOM, door middel van Transparency
	moviesApp.sections = {
		init: function() {
			// Hier roep ik onderstaande about & movies methods op
			this.about();
			// this.movies();			
		},

		home: function() {
			Transparency.render(document.getElementById('contentHome'), moviesApp.content.home);
		},
		about: function() {
			// Data uit about object in content object wordt naar de DOM gestuurd
			Transparency.render(document.getElementById('contentAbout'), moviesApp.content.about);
		},	
		movies: function(genre) {
			// Data uit movies object in content object wordt naar de DOM gestuurd
			//Transparency.render(document.getElementById('movieCollection'), moviesApp.content.movies, moviesApp.config.moviesDirectives);

			// Als de data al in de local storage staat, wordt de data uit localstorage in de DOM geplaatst.
			if(localStorage.getItem('movies')) {
				console.log('local');

				// movieData staat gelijk aan de data die uit de local storage wordt gehaald, geparsed: in daadwerkelijke objects
				var movieData = JSON.parse(localStorage.getItem('movies'));

				// Als er een genre is opgegeven, anders laat hij geen films zien als er geen genre is. 
				if(genre != undefined) {
					// Filter op movieData
					// Moviedata is alle films, movie is 1 film
					//_.filter loopt door alle films en zet dit in var movie
					movieData =	_.filter(movieData, function(movie) {
						// Vergelijkt of het 1 van de genres van een film (movie.genres) overeenkomt met het genre dat is meegegeven in de routie route (genre)
						return _.contains(movie.genres, genre);
					});
				}		

				// Data wordt in DOM gezet
				Transparency.render(document.getElementById('movieCollection'), movieData, moviesApp.config.moviesDirectives);
				
				// Log parsed JSON, --> er worden weer javascript objects van gemaakt van de tekst
				//console.log('parsed response', movieData);	
			}

			// Als de data nog niet in de local storage staat, wordt het opgehaald van de API en wordt het alsnog in de local storage gezet.
			else {
				console.log('external');
				// XHR object wordt hier gebruikt om de data van de API te halen.
				moviesApp.config.xhr.trigger('GET', 'http://dennistel.nl/movies', function(response) {					

					// De respons (in tekst) wordt gemanipuleerd in manipulateMovieData
					moviesApp.utils.manipulateMovieData(response);

					// Haalt de data weer uit de localstorage (geparsed)
					var movieData = JSON.parse(localStorage.getItem('movies'));

					if(genre != undefined) {
						// Filter op movieData
						// Moviedata is alle films, movie is 1 film
						//_.filter loopt door alle films en zet dit in var movie
						movieData =	_.filter(movieData, function(movie) {
							// Vergelijkt of het 1 van de genres van een film (movie.genres) overeenkomt met het genre dat is meegegeven in de routie route (genre)
							return _.contains(movie.genres, genre);
						});
					}						

					// movieData = data uit API, wordt in de DOM geplaatst
					Transparency.render(document.getElementById('movieCollection'), movieData, moviesApp.config.moviesDirectives);
				});
			}
		},
		details: function (title) {
			// 	var movieData = JSON.parse(localStorage.getItem('movies'));

			if(localStorage.getItem('movies')) {

				// 	// Data uit about object in content object wordt naar de DOM gestuurd
				// 	Transparency.render(document.getElementById('movieCollection'), movieData, moviesApp.config.moviesDirectives);
					var movieData = JSON.parse(localStorage.getItem('movies'));	

					// Detailpagina filter: bekijkt of ingevoerde title in de router overeenkomt met de titel van de url v
					if(title != undefined) {
						console.log("Er is een movie id meegegeven.");
						movieData =	_.filter(movieData, function(movie) {
							return movie.title.replace(/\s+/g, '-').toLowerCase() == title;
						});
						Transparency.render(document.getElementById('detailPagina'), movieData, moviesApp.config.moviesDirectives);
						console.log(movieData);					
					}
			} else {
				moviesApp.config.xhr.trigger('GET', 'http://dennistel.nl/movies', function(response) {					

					// De respons (in tekst) wordt gemanipuleerd in manipulateMovieData
					moviesApp.utils.manipulateMovieData(response);

					// Haalt de data weer uit de localstorage (geparsed)
					var movieData = JSON.parse(localStorage.getItem('movies'));			

					// Detailpagina filter: bekijkt of ingevoerde title in de router overeenkomt met de titel van de url v
					if(title != undefined) {
						console.log("Er is een movie id meegegeven.");
						movieData =	_.filter(movieData, function(movie) {
							return movie.title.replace(/\s+/g, '-').toLowerCase() == title;
						});
						Transparency.render(document.getElementById('detailPagina'), movieData, moviesApp.config.moviesDirectives);
						console.log(movieData);					
					}

					// movieData = data uit API, wordt in de DOM geplaatst
					Transparency.render(document.getElementById('detailPagina'), movieData, moviesApp.config.moviesDirectives);
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
		},
		// Data manipulatie
		manipulateMovieData: function(response) {
			// Parset de data, waardoor het gemanipuleerd kan worden
			var movieData = JSON.parse(response);

			// Zorgt ervoor dat review gemiddelde wordt getoond en dat de directors achter elkaar (kunnen) worden gezet.
			movieData =	_.map(movieData, function(movie, i) {
				movie.reviews = _.reduce(movie.reviews, function(memo, review) {
					return memo + review.score;
				}, 0) / movie.reviews.length;
				movie.directors = _.reduce(movie.directors, function(memo, director) {
					return memo + director.name + ' ';
				}, '')
				return movie;
			}, 0);

			// Sorteert de films op filmnaam door middel van underscore.js
			movieData = _.sortBy(movieData, function(movie) {
				return movie.title;
			});

			// Zet de data in de local storage
			// De gemanipuleerde data moet worden omgezet in tekst, om opgeslagen te worden in de local storage.
			localStorage.setItem('movies', JSON.stringify(movieData));
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
			},

			// De tekst "Reviewscijfer: " komt voor het gemiddelde cijfer te staan.
			reviews: {
				text: function() {
					return "Cijfer: " + this.reviews;	
				}
			},

			// De tekst "Regisseur(s) " komt voor de naam/namen van de regisseur(s) te staan.
			directors: {
				text: function() {
					return "Regisseur(s): " + this.directors;
				}
			},

			// Naar actors binnen de movie
			actors: {
				// De url_photo komt in de src van het HTML element terecht.
				url_photo: {
					src: function(params) {
						return this.url_photo;
					}
				},
				// De url_character komt in de href van de HTML link te staan.
				url_character: {
					href: function(params) {
						return this.url_character;
					},
					// text: function(params) {
					// 	return "Meer info over " + this.character;
					// }
					text: function(params) {
						return params.value;
					}
				},
				// De url_profile komt in de href van de HTML link te staan.
				url_profile: {
					href: function(params) {
						return this.url_profile;
					},
					// text: function(params) {
					// 	return "Meer info over " + this.actor_name;
					// }
					text: function(params) {
						return params.value;
					}
				}								
			},

			url: {
				href: function(params) {
					return params.value + this.title.replace(/\s+/g, '-').toLowerCase();
				},
				text: function(params) {
					return params.value;
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