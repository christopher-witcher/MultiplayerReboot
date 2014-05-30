var canvasWidth = 1250;
var canvasHeight = 700;


window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


    ////////////////////////////////////////////////////////////////
    /////Canvas Engine Here///////////////////
    //////////////////////////////////////////////////
function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.LeftLimit = null;
    this.rightLimit = null;
    this.canvasWidth = canvasWidth;
    this.viewPort = null;
    this.addListeners = true;
    this.score = 0;
    this.numItems = 0;
    this.running = true;
    this.finishLineCompleted = false;
    this.runInsideComplete = false;
    this.closeDoorCompleted = false;
    
}

GameEngine.prototype.init = function (ctx, name) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    //this.timer = new Timer();
    this.LeftLimit = 0;
    this.rightLimit = 1450;
    //document.getElementById("score").innerHTML = this.score;
    console.log('game initialized');
    console.log(this);
    this.name = name;
}


    //Sets up addListeners for input from the user.
GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top + 23; //canvas top is 23 pixels from top

        return { x: x, y: y };
    }

    var that = this;

    this.ctx.canvas.addEventListener("click", function (e) {
        that.click = getXandY(e);

        //GetButtonCoordinates();

        //function GetButtonCoordinates() {
        //    var button = document.getElementById("startButton");
        //    var p = GetScreenCoordinates(button);

        //    if (that.click.x > p.x && that.click.x < p.x + button.offsetWidth &&
        //        that.click.y > p.y && that.click.y < p.y + button.offsetHeight) {


        //        //button.setAttribute("hidden", true);
        //        ////button.setAttribute("disabled", true);
        //        //this.gameEngine.start();
        //    }
        //}
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        that.mouse = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("mouseleave", function (e) {
        that.mouse = null;
    }, false);

    this.ctx.canvas.addEventListener("mousewheel", function (e) {
        that.wheel = e;
        e.preventDefault();
    }, false);

    this.keyDown = function (e) {
        if (e.keyCode === 39) {
            that.rightArrow = true;
            that.isRightArrowUp = false;
            that.direction = true; // true = right
            
        }

        if (e.keyCode === 37) {
            that.leftArrow = true;
            that.isLeftArrowUp = false;
            that.direction = false; // false = left
        }

        if (e.keyCode === 32) {
            that.space = true;
            // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
           // document.getElementById("jumpSound").play();
            // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
        e.preventDefault();
       gameboard.move(that.currentState);
        socket.emit('keydown', that.currentState());
        
    }

    this.ctx.canvas.addEventListener("keydown", this.keyDown, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (e.keyCode === 39) {
            that.rightArrow = false;
            that.isRightArrowUp = true;
        }
        if (e.keyCode === 37) {
            that.leftArrow = false;
            that.isLeftArrowUp = true;
        }
        e.preventDefault();
        //GameBoard move method
        
        socket.emit('keyup', that.currentState());
    }, false);

    console.log('Input started');
}

GameEngine.prototype.currentState = function () {
    var output = {
        space: this.space,
        leftArrow: this.leftArrow,
        isLeftArrowUp: this.isLeftArrowUp, 
        direction: this.direction,
        rightArrow: this.rightArrow,
        isRightArrowUp: this.isRightArrowUp,
        name: this.name
    }

    return output;
}


    //////////////////////////////////////////////////
    ////////End Canvas Engine/////////////////////////
    //////////////////////////////////////////////////

    //Creates an animation to be created for the user.
function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
    this.completed = false;


}

    //Draws an image on the canvas
Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
            this.completed = true;
        }
    } else if (this.isDone()) {
        this.completed = true;
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    this.locX = x;
    this.locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    this.clipX = index * this.frameWidth + offset;
    this.clipY = vindex * this.frameHeight + this.startY;


    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  this.locX, this.locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);

}

    //
Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function RewindAnimation(spriteSheet, rewindStack) {
    this.spriteSheet = spriteSheet;
    this.myRewindStack = rewindStack;
    this.previousFrame = null;
    this.currentLineInterval = 0;
    this.movingUp = true;
}

RewindAnimation.prototype.drawFrame = function (tick, ctx, scaleBy) {

    if (this.myRewindStack.length > 0) {
        var current = this.myRewindStack.pop();

        ctx.drawImage(this.spriteSheet,
                         current.clipX, current.clipY, current.frameWidth, current.frameHeight,
                         current.canvasX, current.canvasY, current.frameWidth, current.frameHeight);
        this.previousFrame = current;
        ctx.drawImage(this.spriteSheet, 5565, 4550, 302, 310, 625, 250, 302 * .33, 310 * .33)

        for (var i = 1; i <= 10; i++) {
            if (this.currentLineInterval < 10 && this.movingUp) {
                this.currentLineInterval += 1;
            } else if (this.currentLineInterval >= 10 && this.movingUp) {
                this.movingUp = false;
                this.currentLineInterval -= 1;
            } else if (this.currentLineInterval > -10 && !this.movingUp) {
                this.currentLineInterval -= 1;
            } else {
                this.movingUp = true;
                this.currentLineInterval += 1;
            }
            ctx.strokeStyle = "#000";
            ctx.beginPath();
            ctx.moveTo(0, i * 70 + this.currentLineInterval);
            ctx.lineTo(canvasWidth, i * 70 + this.currentLineInterval);
            ctx.stroke();
        }

        return current;
    }


    return this.previousFrame;


}



    ////////////////////////////////////////////////////////////////
    ////////////Initialize Animations Here//////////////////////
    ///////////////////////////////////////////////////////////
RunBoy.prototype.initializeAnimation = function () {
    this.rightStanding = new Animation(ASSET_MANAGER.getAsset(heroSpriteSheet), 12, 6, 100, 150, 0.01, 1, true, false);
    this.leftStanding = new Animation(ASSET_MANAGER.getAsset(heroSpriteSheet), 0, 156, 100, 150, 0.01, 1, true, false);

    this.runRight = new Animation(ASSET_MANAGER.getAsset(heroSpriteSheet), 100, 0, 100, 150, 0.011, 120, true, false);

    this.runLeft = new Animation(ASSET_MANAGER.getAsset(heroSpriteSheet), 100, 160, 100, 150, 0.011, 120, true, false);

    this.jumpRight = new Animation(ASSET_MANAGER.getAsset(heroSpriteSheet), 10, 325, 114, 158, .015, 89, false);
    this.jumpLeft = new Animation(ASSET_MANAGER.getAsset(heroSpriteSheet), 10, 485, 114, 158, .015, 89, false);

    this.fallRight = new Animation(ASSET_MANAGER.getAsset(heroSpriteSheet), 10146, 336, 114, 160, 0.01, 1, true);
    this.fallLeft = new Animation(ASSET_MANAGER.getAsset(heroSpriteSheet), 10146, 496, 114, 148, 0.01, 1, true);
}
    //End of Game Animation