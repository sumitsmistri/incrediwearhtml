/* $(document).ready(function() {
	var backgroundAudio = new Audio('backgroundmusic.mp3');
	var hasInteracted = false;

	// Play background audio on click of document
	$(document).on('click', function() {
		if (!hasInteracted) {
			hasInteracted = true;
			backgroundAudio.play();
		}
	});
	$("#next-page").on('click', function() {
		window.location.href = "page1.html";
	});

	// Play page audio after 1 second on page load
	if (sessionStorage.getItem('hasLoaded') === null) {
		setTimeout(function() {
			var pageNumber = $('body').data('page');
            console.log(pageNumber);
			var pageAudio = new Audio('audio' + pageNumber + '.mp3');
			pageAudio.play();
			backgroundAudio.play();
		}, 1000);
		sessionStorage.setItem('hasLoaded', 'true');
	}
}); */

$(document).ready(function() {

	var currentSlide = parseInt(getUrlParameter('slide'));
	var lastslide = 6;
	var isUserInteracted = false;
	var backgroundAudio = new Audio('audios/backgroundmusic.mp3');
	var narrationAudios = [
	  new Audio('audios/audio1.mp3'),
	  new Audio('audios/audio2.mp3'),
	  new Audio('audios/audio3.mp3'),
	  new Audio('audios/audio4.mp3'),
	  new Audio('audios/audio5.mp3'),
	  new Audio('audios/audio6.mp3')
	];
	var video = $("#jc_video")[0];
	var slideInterval;

	$('#jc_thumb').click(function(){
		video.play();
        $('#jc_thumb').hide();
	});
  
	// Set default slide number if not found or invalid
	if (isNaN(currentSlide) || currentSlide < 1 || currentSlide > lastslide) {
	  currentSlide = 1;
	}
  
	// Play background audio and narration audio after a delay on load
	setTimeout(function() {
	  if (!isUserInteracted) {
		//backgroundAudio.play();
		playNarrationAudio(currentSlide);
	  }
	  else {
		backgroundAudio.play();
		playNarrationAudio(currentSlide);
	  }
	}, 900);
  
	// Show the current slide and hide the rest
	showSlide(currentSlide);
  
	// On click of the "Get Started" button on the first slide, go to the next slide
	$('#slide1 .start-button').on('click', function() {
	  isUserInteracted = true;
	  backgroundAudio.play();
	  setTimeout(function() {
		showSlide(currentSlide + 1);
	  }, 900);
	  
	});
	// On click of the "Get Started" button on the first slide, go to the next slide
	$('.sudden-start .start-button').on('click', function() {
	  isUserInteracted = true;
	  backgroundAudio.play();
	  $('.sudden-start').hide();
	  setTimeout(function() {
		playNarrationAudio(currentSlide);
	  }, 900);

	  //autoplay on slides if having  data-nextslide attribute 
	  /* if($('#slide'+currentSlide).data('nextslide')) {
		console.log($('#slide'+currentSlide).data('nextslide'));
		if( isUserInteracted ) {
			setTimeout(function() {
				showSlide(currentSlide + 1);
			}, $('#slide'+currentSlide).data('nextslide'));			
		}
	  } */
	  resetSlideInterval();
	  
	});
  
	// On click of the previous button in the menu, go to the previous slide
	$('.prev-button').on('click', function() {
	  isUserInteracted = true;
	  showSlide(currentSlide - 1);
	});
  
	// On click of the next button in the menu, go to the next slide
	$('.next-button').on('click', function() {
	  isUserInteracted = true;
	  showSlide(currentSlide + 1);
	});

	video.onplay = function() {
        // Pause all sounds when video plays
        pauseAudio();
      };

      video.onpause = function() {
        // Resume all sounds when video pauses
		backgroundAudio.play();
		narrationAudios[currentSlide - 1].play();
      };
  
	// Toggle menu visibility and pause/resume audio on click of menu button
	/* $('.menu-button').on('click', function() {
	  isUserInteracted = true;
	  $('.menu').toggleClass('open');
	  if ($('.menu').hasClass('open')) {
		pauseAudio();
	  } else {
		resumeAudio();
	  }
	}); */


	  
	// Function to show a specific slide number
	function showSlide(slideNumber) {
	  if (slideNumber < 1 || slideNumber > lastslide) {
		return;
	  }
	  
	  currentSlide = slideNumber;
	  $('.slide:not(#slide' + slideNumber + ')').fadeOut(500);
	  $('#slide' + slideNumber).fadeIn(500);
	  $('.menu').removeClass('open');
	  // Update URL parameter
	  window.history.replaceState(null, null, '?slide=' + slideNumber);
	  // Play narration audio for the current slide
	  if(currentSlide > 1 && !isUserInteracted) {
		$('.sudden-start').show();
	  }
	  if(currentSlide == 1) {
		$('.menu').hide();
	  }
	  else {
		$('.menu').show();
	  }
	  playNarrationAudio(slideNumber);

	  //autoplay on slides if having  data-nextslide attribute 
	  /* if($('#slide'+slideNumber).data('nextslide')) {
		console.log($('#slide'+slideNumber).data('nextslide'));
		if( isUserInteracted ) {
			setTimeout(function() {
				showSlide(slideNumber + 1);
			}, $('#slide'+slideNumber).data('nextslide'));			
		}
	  } */

	  resetSlideInterval();

	}


	function resetSlideInterval() {
		clearInterval(slideInterval);
		var nextSlideTime = $('#slide'+currentSlide).data('nextslide');
		if (nextSlideTime && isUserInteracted ) {
			isUserInteracted = true;
			slideInterval = setInterval(function() {
				showSlide(currentSlide + 1);
			}, nextSlideTime);
		}
	  }
  
	// Function to play narration audio for the given slide number
	function playNarrationAudio(slideNumber) {
	  //pauseAudio();
	  narrationAudios.forEach(function(audio) {
		audio.pause();
		audio.currentTime = 0;
	  });
	  narrationAudios[slideNumber - 1].play();
	}
  
	// Function to pause all audio
	function pauseAudio() {
	  backgroundAudio.pause();
	  narrationAudios.forEach(function(audio) {
		audio.pause();
	  });
	}
  
	// Function to resume background audio if user has interacted
	function resumeAudio() {
	  if (isUserInteracted) {
		backgroundAudio.play();
		playNarrationAudio(currentSlide);
	  }
	}
  
	// Function to get URL parameter value
	function getUrlParameter(name) {
	  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	  var results = regex.exec(location.search);
	  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}
  
  });
  
  
