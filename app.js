//state object
var state = {
	questions : {
		1: {
			question: "What is the best dog breed?",
			answers: ['Bulldog', 'Chihuahua', 'Corn Dog', 'Dachshund']
		},
		2: {
			question: "If it snorts and drools and has a curly nub of tail, what is it?",
			answers: ['Bulldog', 'Porky the Pig', 'Wilbur', 'Overcaffeinated Programmer']
		},
		3: {
			question: "Which football team won the 2016 AFL Grand Finals?",
			answers: ['Bulldogs', 'Kangaroos', 'Wallabies', 'Tigers']
		},
		4: {
			question: "Which animal is more handsome than Oscar the Grouch?",
			answers: ['Bulldog', 'Anteater', 'Platypus', 'Big Bird']
		},
		5: {
			question: "Which pet should be named after the Greek god Jupiter?",
			answers: ['Bulldog', 'Platypus', 'Dire Canary', 'Pet Rock']
		},
		6: {
			question: "Who's the boss?",
			answers: ['Bulldog', 'Human', 'President Obama', 'Queen Elizabeth']
		},
		7: {
			question: "Which is the most popular dog breed in Los Angeles?",
			answers: ['Bulldog', 'Shitzu', 'Yorkie', 'Labradoodle']
		},
		8: {
			question: "Who's the most stubborn of all?",
			answers: ['Bulldog', 'The Grinch', 'Ebenezer Scrooge', 'Pet Rock']
		},
		9: {
			question: "Who you gonna call?",
			answers: ['Bulldog', 'Ghostbuster', 'The Police', 'Wonder Woman']
		},
		10: {
			question: "Which animal was bred to fight bulls dating back to the 1200s in England?",
			answers: ['Bulldog', 'Platypus', 'Potbelly Pig', 'Star Nosed Mole']
		}
	},
}


// functions to modify state and render into DOM
// check user submitted answer against correct answer
function evaluateResults(selected, state) {
	var currentQuestion = state.currentQuestion;
	var correctAnswer = state.questions[currentQuestion].answers[0];

	// update score accordingly
	if (selected === correctAnswer) {
		state.score++;
		return true;
	} else {
		state.incorrect++;
		return false;
	}
}

// create or reset state variables tracking state of game
function resetState(state) {
	state.score = 0;
	state.incorrect = 0;
	state.currentQuestion = 1;
	state.firstTry = true;
	state.unselectedNextFirstClick = true;
}

// update DOM with current game state with answers displayed in random order
function renderQuestion(state) {
	var currentQuestion = state.currentQuestion;
	var randomizeAnswers = shuffle(state.questions[currentQuestion].answers);
	$('.quiz>p').text(state.questions[currentQuestion].question);
	var answersHtml = randomizeAnswers.map(function(answer) {
		return '<div class="answer">' + answer + '</div>';
	});
	$('.answer_container').html(answersHtml);
}

// shuffles question order
function shuffle(array) {
	var a = array.slice();
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}

// update DOM fields with current state data
function renderProgress(state) {
	$('#current_question').text(state.currentQuestion);
	$('.score').text(state.score);
	$('#incorrect').text(state.incorrect);
}


//event listeners
// clicking start button displays quiz with game state reset
$('.start').on('click', function(event) {
	event.preventDefault();
	$('.starter').addClass('hidden');
	$('.finish').addClass('hidden');
	$('.quiz').removeClass('hidden');
	$('.response').remove();
	resetState(state);
	renderQuestion(state);
	renderProgress(state);
	$('.total-questions').text(Object.keys(state.questions).length);
});

// clicking an answer causes selected answer to be checked against correct answer, with game state updated accordingly
// only one answer may be selected per question
$('.quiz').on('click', '.answer', function(event) {
	event.preventDefault();

	// only one try allowed per question
	if(state.firstTry == true){
		var selected = $(this).text();
		$('.response').remove();
		if (evaluateResults(selected, state)) {
			$('.quiz').append('<h3 class="response">Correct! Select next to continue.</h3>')
		} else {
			$('.quiz').append('<h3 class="response">Incorrect. Select next to continue.</h3>')
		}
		state.firstTry = false;
		renderProgress(state);
	} else {
		$('.response').text('My bulldog can take a quiz better than you! Select next to continue.');
	}
});

// clicking next button will move game to the next question, if there is one
// user must have selected an answer
// if no questions remain, finish page is displayed
$('.footer').on('click', '.next', function(event){
	event.preventDefault();

	// check that user has selected an answer before continuing game
	if(state.firstTry) {
		// check that this is the first time user has clicked next without selecting an answer
		if(state.unselectedNextFirstClick){
			state.unselectedNextFirstClick = false;
			return $('.quiz').append('<h3 class="response">Quit drooling on yourself and select a response to continue!</h3>');
		}
	}

	// check for end of quiz, displaying finish page if game complete
	if(state.currentQuestion == Object.keys(state.questions).length) {
		$('.quiz').addClass('hidden');
		$('.finish').removeClass('hidden');
	} else {

		// move on to next question, reseting tracking for whether user has selected an answer
		state.currentQuestion++;
		$('.response').remove();
		state.firstTry = true;
		state.unselectedNextFirstClick = true;
		renderQuestion(state);
		renderProgress(state);
	}
});
