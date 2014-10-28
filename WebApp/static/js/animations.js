var 	article = document.querySelector('article');
var		h1 = document.querySelector('h1');
var 	h2 = document.querySelector('h2');
var 	section = document.querySelector('section');
var 	movieGenresList = document.getElementById('movieGenresList');

// var filter = new Hammer(filterToggle);

// filter.on('tap', function(ev) {
// 	movieGenresList.classList.toggle('filterOptionsDropIn');
// });

var filterToggle = document.getElementById('filterToggle');
var myElement = document.getElementById('myElement');

var mc = new Hammer(filterToggle);

mc.on("panleft panright tap press", function(ev) {
    // myElement.textContent = ev.type +" gesture detected.";
    // h2.classList.toggle('small');
    movieGenresList.classList.toggle('filterOptionsDropIn');
    movieGenresList.style.display == "block" ? movieGenresList.style.display = "none" : 
	movieGenresList.style.display = "block"; 
});


// var naarMenu = document.getElementById('naarMenu')

// naarMenu.addEventListener('click', function(){
// 	if(window.scrollY!=0) {
//     	setTimeout(function() {
//        		window.scrollTo(0,window.scrollY-30);
//     	}, 100);
//    }

// })


// function scrollToTop(scrollDuration) {
//     var scrollStep = -window.scrollY / (scrollDuration / 15),
//         scrollInterval = setInterval(function(){
//         if ( window.scrollY != 0 ) {
//             window.scrollBy( 0, scrollStep );
//         }
//         else clearInterval(scrollInterval); 
//     },15);	
// }

function scrollToTop(scrollDuration) {
const   scrollHeight = window.scrollY,
        scrollStep = Math.PI / ( scrollDuration / 15 ),
        cosParameter = scrollHeight / 2;
var     scrollCount = 0,
        scrollMargin,
        scrollInterval = setInterval( function() {
            if ( window.scrollY != 0 ) {
                scrollCount = scrollCount + 1;  
                scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
                window.scrollTo( 0, ( scrollHeight - scrollMargin ) );
            } 
            else clearInterval(scrollInterval); 
        }, 15 );
}