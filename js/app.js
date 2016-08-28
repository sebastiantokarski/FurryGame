'use strict';
var self;

//------------------------------------------Furry------------------------------------------//
function Furry() {
    this.x = 0;
    this.y = 0;
    this.direction = 'right';
    this.currentPos = 0;
    this.oldPos = 0;
}

//------------------------------------------Coin------------------------------------------//
function Coin() {
    this.x = Math.floor(Math.random() * 10);
    this.y = Math.floor(Math.random() * 10);
    this.currentPos = this.x + this.y * 10;
}

//------------------------------------------Game------------------------------------------//
var Game = function () {

    // Elements from html
    this.board = document.querySelectorAll('#board div');
    this.scoreElement = document.querySelector('#score span');
    this.timerElement = document.querySelector('#time span');
    this.speedElement = document.querySelector('#speed span');
    this.gameOverElement = document.querySelector('.screen');
    this.playAgainElement = document.querySelector('#play-again');
    this.resultTableElement = document.querySelector('.header-right');
    this.markerElement = document.querySelector('#marker');

    // Create Furry and Coin
    this.furry = new Furry();
    this.coin = new Coin();

    // Add Furry and Coin to html
    this.addClass(this.coin, 'coin');
    this.addClass(this.furry, 'furry');

    this.pause = false; // If game is paused

    self = this;

    this.startGame();

};

Game.prototype.startGame = function () {

    // Add marker animation
    this.markerElement.style.animation = 'marker-go 65s linear';

    // Reset score and timer
    if (!this.pause) {
        this.scoreElement.innerHTML = 0;
        this.timerElement.innerHTML = 0;
        this.speedElement.innerHTML = 600;
    }

    // SetInterval timer
    this.timerInterval = setInterval(this.timer, 1000);

    // SetInterval game
    this.handler = setTimeout(this.tick, this.speedElement.innerHTML);

    // Keyboard listener
    document.addEventListener('keydown', this.keyboard);
};

Game.prototype.timer = function () {
    // + 1 sec
    ++self.timerElement.innerHTML;

    // If timer has some seconds do show with speedElement
    switch (self.timerElement.innerHTML) {
        case '5':
            self.speedElement.innerHTML = 500;
            self.speedElement.style.animation = 'show-speed 1.5s';
            break;
        case '10':
            self.speedElement.innerHTML = 400;
            self.speedElement.style.animation = 'show-speed1 1.5s';
            break;
        case '15':
            self.speedElement.innerHTML = 300;
            self.speedElement.style.animation = 'show-speed 1.5s';
            break;
        case '20':
            self.speedElement.innerHTML = 200;
            self.speedElement.style.animation = 'show-speed1 1.5s';
            break;
        case '30':
            self.speedElement.innerHTML = 120;
            self.speedElement.style.animation = 'show-speed 1.5s';
            break;
        case '40':
            self.speedElement.innerHTML = 90;
            self.speedElement.style.animation = 'show-speed1 1.5s';
            break;
        case '50':
            self.speedElement.innerHTML = 80;
            self.speedElement.style.animation = 'show-speed 1.5s';
            break;
        case '60':
            self.speedElement.innerHTML = 70;
            self.speedElement.style.animation = 'show-speed1 1.5s';
            break;
    }
};


Game.prototype.addClass = function (el, clas) {
    this.board[el.currentPos].classList.add(clas);
};

Game.prototype.removeClass = function (el, clas) {
    this.board[el.currentPos].classList.remove(clas);
};

// Which key was pressed
Game.prototype.keyboard = function (event) {
    var key = event.which;
    switch (key) {
        case 37: // ARROW LEFT
            self.furry.direction = 'left';
            break;
        case 38: // ARROW UP
            self.furry.direction = 'up';
            break;
        case 39: // ARROW RIGHT
            self.furry.direction = 'right';
            break;
        case 40: // ARROW DOWN
            self.furry.direction = 'down';
            break;
        case 80: // P
            if (self.pause) {

                // Change screen element settings
                self.gameOverElement.lastElementChild.innerHTML = 'GAME OVER';
                self.gameOverElement.lastElementChild.style.marginTop = '0';
                self.gameOverElement.firstElementChild.classList.remove('hide');
                self.gameOverElement.classList.add('hide');

                // Start the game
                self.startGame();

                // Add new keyframe in css for marker
                var cssAnimation = document.createElement('style');
                cssAnimation.type = 'text/css';
                var newKeyFrame = document.createTextNode('@keyframes marker-go1 {' +
                    ' 0% { top: ' + self.markerElement.style.top + 'vh; }' +
                    ' 100% { top: 20.5vh; }' + '}');
                cssAnimation.appendChild(newKeyFrame);
                document.getElementsByTagName("head")[0].appendChild(cssAnimation);

                // Start marker timeline from earlier position before pause
                self.markerElement.style.animation = 'marker-go1 ' + (65 - self.timerElement.innerHTML) + 's linear';

                // Change pause value - Now there isn't pause
                self.pause = false;
            } else {

                // Stop marker moving on timeline
                self.markerElement.style.animation = 'stop';
                self.markerElement.style.top = 90.5 - self.parseVh(self.timerElement.innerHTML) + 'vh';

                // Stop game
                clearTimeout(self.handler);
                clearInterval(self.timerInterval);

                // Show pause caption
                self.gameOverElement.lastElementChild.innerHTML = 'PAUSE';
                self.gameOverElement.lastElementChild.style.marginTop = '40vh';
                self.gameOverElement.firstElementChild.classList.add('hide');
                self.gameOverElement.classList.remove('hide');

                //Change pause value - Now there is pause
                self.pause = true;
            }
            break;
    }
};

Game.prototype.parseVh = function (val) {
    return ((val / 65 * 100) * 70) / 100;
};

Game.prototype.enterKey = function (event) {
    if (event.keyCode === 13) {
        self.playAgain();
    }
};

Game.prototype.check = function () {
    //------------------------------------------GAME OVER------------------------------------------//
    if (this.furry.x < 0 || this.furry.x > 9 || this.furry.y < 0 || this.furry.y > 9) {

        // Remove furry from html 
        this.removeClass(this.furry, 'furry');

        // Stop game
        clearTimeout(this.handler);
        clearInterval(this.timerInterval);
        document.removeEventListener('keydown', this.keyboard);
        document.querySelector('#marker').style.animation = 'stop';
        self.markerElement.style.top = 90.5 - self.parseVh(self.timerElement.innerHTML) + 'vh';

        // Show game over caption
        this.gameOverElement.classList.remove('hide');

        // Add new result to right side header
        var tab = this.resultTableElement.children;

        for (var i = 0; i < tab.length; i++) {
            if (tab[i].innerHTML === '') {
                this.addProp(tab[i], i + 1);
                break;
            } else if (this.scoreElement.innerHTML > tab[i].dataset.score || this.scoreElement.innerHTML === tab[i].dataset.score && this.timerElement.innerHTML < tab[i].dataset.time) {

                var newResult = document.createElement('h5');
                this.addProp(newResult, i);
                this.resultTableElement.insertBefore(newResult, tab[i]);

                // Correct all positions
                for (var j = 0; j < tab.length; j++) {
                    tab[j].dataset.position = j + 1;
                    if (tab[j].innerHTML !== '') {
                        tab[j].innerHTML = tab[j].dataset.position + '. ' + tab[j].innerHTML.slice(2);
                    }
                }
                if (tab.length > 3) {
                    this.resultTableElement.removeChild(tab[4]);
                }
                break;
            }
        }

        // Click on button or click enter to play again
        this.playAgainElement.addEventListener('click', this.playAgain);
        document.addEventListener('keydown', this.enterKey);

    } else {

        // Check if furry is on the same position as coin
        if (this.furry.x === this.coin.x && this.furry.y === this.coin.y) {
            // Add point and show it
            ++this.scoreElement.innerHTML;
            // Remove coin from board and add it again
            this.removeClass(this.coin, 'coin');
            this.coin = new Coin();
            this.addClass(this.coin, 'coin');
        }
        // Callback
        self.handler = setTimeout(self.tick, self.speedElement.innerHTML);
    }


};

Game.prototype.addProp = function (el, index) {
    el.dataset.position = index;
    el.dataset.score = this.scoreElement.innerHTML;
    el.dataset.time = this.timerElement.innerHTML;
    el.innerHTML = el.dataset.position + '. ' + el.dataset.score + ' points in ' + el.dataset.time + ' sec';
};

Game.prototype.render = function () {

    // Check if furry is on board and if furry is on the same position as coin
    self.check();

    // If there isn't game over or pause, move furry
    if (this.gameOverElement.classList.contains('hide')) {
        this.furry.currentPos = this.furry.x + this.furry.y * 10;
        this.board[this.furry.oldPos].classList.remove('furry');
        this.addClass(this.furry, 'furry');
        this.furry.oldPos = this.furry.currentPos;
    }

};

Game.prototype.tick = function () {

    switch (self.furry.direction) {
        case 'left':
            self.furry.x--;
            break;
        case 'up':
            self.furry.y--;
            break;
        case 'right':
            self.furry.x++;
            break;
        case 'down':
            self.furry.y++;
            break;
    }
    // Check function is in render, in check is callback to timeout
    self.render();
};

//------------------------------------------PLAY AGAIN------------------------------------------//
Game.prototype.playAgain = function () {

    // Remove enter listener
    document.removeEventListener('keydown', self.enterKey);

    // Hide game over caption
    self.gameOverElement.classList.add('hide');

    // Add Furry to html
    self.furry = new Furry();
    self.addClass(self.furry, 'furry');

    // Start the game
    self.startGame();
};


//------------------------------------------DOMContentLoaded------------------------------------------//
document.addEventListener('DOMContentLoaded', function () {

    setTimeout(function () {
        var game = new Game();
    }, 500);


});
