$(document).ready(function() {

	var currentSlide = parseInt(getUrlParameter('slide'));
	var lastslide = 6;
	var isUserInteracted = false;
	/* var backgroundAudio = new Audio('audios/backgroundmusic.mp3');
	var narrationAudios = [
	  new Audio('audios/audio1.mp3'),
	  new Audio('audios/audio2.mp3'),
	  new Audio('audios/audio3.mp3'),
	  new Audio('audios/audio4.mp3'),
	  new Audio('audios/audio5.mp3'),
	  new Audio('audios/audio6.mp3')
	]; */

	// Create an AudioContext for managing audio playback
	//var context = new (window.AudioContext || window.webkitAudioContext)();

	// Create a Howl instance for the background audio
	var backgroundAudio = new Howl({
		src: ['audios/backgroundmusic.mp3'],
		autoplay: true,
		loop: true,
		volume: 0.5
	});

	var narrationAudios = [
		new Howl({src: ['audios/audio1.mp3']}),
		new Howl({src: ['audios/audio2.mp3']}),
		new Howl({src: ['audios/audio3.mp3']}),
		new Howl({src: ['audios/audio4.mp3']}),
		new Howl({src: ['audios/audio5.mp3']}),
		new Howl({src: ['audios/audio6.mp3']}),
	];

	var audio5 = new Audio('audios/audio5.mp3');

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
	}, 900);
  
	// Show the current slide and hide the rest
	showSlide(currentSlide);
  
	// On click of the "Get Started" button on the first slide, go to the next slide
	$('#slide1 .start-button').on('click', function() {
	  	isUserInteracted = true;

	  	/* var buffer1 = audioContext.createBuffer(1, 1, 22050);
		var source = audioContext.createBufferSource();
		source.buffer = buffer1;
		source.connect(audioContext.destination);
		source.start(0); */

		if (backgroundAudio.currentTime < 0) {
			backgroundAudio.play();
		}
		
		setTimeout(function() {
			showSlide(currentSlide + 1);
		}, 900);
		
	  
	});
	
	/* $('#slide2 button').on('click', function() {
	  	isUserInteracted = true;

		if (backgroundAudio.currentTime < 0) {
			backgroundAudio.play();
		}
		currentSlide = 3;
		showSlide(3);	  
	}); */
	// On click of the "Get Started" button on the first slide, go to the next slide
	$('.sudden-start .start-button').on('click', function() {
		isUserInteracted = true;

		/* var buffer2 = audioContext.createBuffer(1, 1, 22050);
		var source = audioContext.createBufferSource();
		source.buffer = buffer2;
		source.connect(audioContext.destination);
		source.start(0); */

		if (backgroundAudio.currentTime < 0) {
			backgroundAudio.play();
		}
		$('.sudden-start').hide();
		/* setTimeout(function() {
			playNarrationAudio(currentSlide);
		}, 900); */

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
	
	var audioLastPos = 0;

	video.onplay = function() {
        // Pause all sounds when video plays
		backgroundAudio.pause();
		narrationAudios[currentSlide - 1].pause();	
		if (!audio5.ended) {	
			audioLastPos = ( audio5.currentTime > 0 ) ? audio5.currentTime : narrationAudios[currentSlide - 1].seek();
			audio5.pause();
		}
      };

      video.onpause = function() {		
        // Resume all sounds when video pauses
		backgroundAudio.play();
		if (!audio5.ended && currentSlide == 5) {
			audio5.currentTime = audioLastPos;
			audio5.play();
		}
		//narrationAudios[currentSlide - 1].seek(audioLastPos);
		
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
	  if(currentSlide == 1 || currentSlide == 2) {
		$('.menu').hide();
	  }
	  else {
		$('.menu').show();
	  }
	  

	  //playNarrationAudio(slideNumber);
	  setTimeout(function() {
		playNarrationAudio(slideNumber);
	  }, 500);

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
	  /* narrationAudios.forEach(function(audio) {
		audio.pause();
		audio.currentTime = 0;
	  }); */
	  
	  audio5.pause();
	  video.pause();
	  
	  for (var i = 0; i < narrationAudios.length; i++) {
        if (narrationAudios[i].playing()) {
          narrationAudios[i].stop();
        }
      }
	  narrationAudios[slideNumber - 1].play();
	}
  
	// Function to pause all audio
	function pauseAudio() {
	  backgroundAudio.pause();
	  /* narrationAudios.forEach(function(audio) {
		audio.pause();
	  }); */
	  for (var i = 0; i < narrationAudios.length; i++) {
        if (narrationAudios[i].playing()) {
          narrationAudios[i].pause();
        }
      }
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


	//----------------------------------------------------------------------------------------

	//session store
	$('.save-name').on('click', function(){
		var person_name = $('input[name="person-name"]').val();
		sessionStorage.setItem("person_name", person_name);
		let person_real_name = sessionStorage.getItem("person_name")? sessionStorage.getItem("person_name") : "John";
		$('.person_name_session').text(person_real_name);
	});
  
  });
  
  
