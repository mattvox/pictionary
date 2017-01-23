var socket = io();

var pictionary = function() {
    var canvas, context;
    
    var guessBox = $('#guess input');
    
    var guessed = $('#guessed');
    
    var addGuess = function(guess) {
        guessed.text(guess);
    };

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }

        console.log(guessBox.val());
        addGuess(guessBox.val());
        socket.emit('guess', guessBox.val());
        
        guessBox.val('');
    };
    
    guessBox.on('keydown', onKeyDown);


    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    
    var drawing = false;
    
    canvas.on('mousedown', function() {
        drawing = true;
    })
    
    canvas.on('mouseup', function() {
        drawing = false;
    })
    
    canvas.on('mousemove', function(event) {
        if (drawing === true) {
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                            y: event.pageY - offset.top};

            draw(position);
            socket.emit('draw', position);
            
            
        } 
    });
    
    socket.on('draw', draw);
    socket.on('guess', addGuess);
};

$(document).ready(function() {
    pictionary();
});

