var startingHeight = 435;
var worldWidth = 10000;
var canvasWidth = 1250;
var canvasHeight = 700;
var player_one = new RunBoy(canvasWidth, canvasHeight);
var player_two = new RunBoy(canvasWidth, canvasHeight);
var moveDistance = 7;
    //This is the gameboard and contains everything which is used in the game.

    (function (exports) {
    var GameBoard = function () {
        this.players = [];
        this.running = false;
    }

    GameBoard.prototype.addPlayer = function (name) {
        var current = new RunBoy(canvasWidth, worldWidth, name);
        console.log(current);
        if (this.players.length === 0) {
            this.players.push(name);
            player_one.setName(name);
        } else {
            this.players.push(name);
            player_two.setName(name);
        }

        
    }

    GameBoard.prototype.getPlayer = function (name) {
        if (this.players[0] === name) {
            console.log(player_one);
            return player_one.currentState();
        } else {
            return player_two.currentState();
        }
    }

    GameBoard.prototype.move = function (game) {
        var current;
        if (this.players[0] === game.name) {
            current = player_one;
        } else {
            current = player_two;
        }
        current.move(game);
    }

    

    exports.GameBoard = GameBoard;
    })(typeof global === "undefined" ? window : exports);

    

    //A class for the bounding box of collision detection.
    function BoundingBox(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.left = x;
        this.top = y;
        this.right = this.left + width;
        this.bottom = this.top + height;
    }

    //checks if this bounding box collided with the other.
    BoundingBox.prototype.collide = function (oth) {

        if (oth == null) { //DO NOT CHANGE TO ===
            return null;
        }

        if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) {
            return true;
        }

        return false;
    };

    BoundingBox.prototype.equals = function (oth) {

        return this.x === oth.x && this.y === oth.y && this.width === oth.width && this.height === oth.height;

    }



    //Sets up different animation of runboy and initializes the controls
    function RunBoy(canvasWidth, worldWidth) {
        this.direction = true;
        this.rewindFrame = null;
        this.x = 0;
        this.y = startingHeight;
        this.jumping = false;
        this.running = false;
        this.runningJump = false;
        this.standing = true;
        this.falling = false;
        this.canPass = true;
        this.landed = false;
        this.collission = false;
        this.height = 0;
        this.baseHeight = startingHeight;
        this.canvasWidth = canvasWidth;
        this.worldWidth = worldWidth;
        this.worldX = this.x;
        //this.worldX = 8100;
        this.worldY = this.y;
        this.boundingbox = new BoundingBox(this.x, this.y, 90, 145); //145
        //when its null I'm not currently on a platform.
        this.currentPlatform = null;
        //keeps track of where the bounding box's bottom was before it changed. should be when falling.
        this.lastBottom = this.boundingbox.bottom;
        this.lastTop = this.boundingbox.top;

        //stores character's rewindStack
        this.myRewindStack = [];
        this.rewinding = false;
        //this.game = game;
        this.lastFrame = null;
        // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.rewindCount = 0;
        // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    }

    RunBoy.prototype.setName = function(the_name){
        this.name = the_name;
    }

    RunBoy.prototype.currentState = function () {
        var output = {
        direction:  this.direction,
        x: this.x,
        y: this.y,
        name: this.name,
        jumping: this.jumping,
        running: this.running,
        runningJump: this.runningJump,
        standing: this.standing,
        falling: this.falling,
        canPass: this.canPass,
        landed: this.landed,
        collission: this.collission,
        height: this.height,
        baseHeight: this.baseHeight,
        canvasWidth: this.canvasWidth,
        worldWidth: this.worldWidth,
        worldX: this.worldX,
        //this.worldX = 8100;
        worldY: this.worldY,
        boundingbox: {
            x: this.boundingbox.x,
            y: this.boundingbox.y,
            width: this.boundingbox.width,
            height: this.boundingbox.height
        },
        //when its null I'm not currently on a platform.
        currentPlatform: this.currentPlatform,
        //keeps track of where the bounding box's bottom was before it changed. should be when falling.
        lastBottom: this.lastBottom,
        lastTop: this.lastTop,

        //stores character's rewindStack
        myRewindStack: this.myRewindStack,
        rewinding: this.rewinding,
        //this.game = game;
        lastFrame: this.lastFrame,
        // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        rewindCound: this.rewindCount
        }

        return output;
    }

    //This information is to update all the current information of the player
    RunBoy.prototype.update = function(player) {
        this.rewindFrame = player.rewindFrame;
        this.x = player.x;
        this.y = player.y;
        //this.name = the_name;
        this.jumping = player.jumping;
        this.running = player.running;
        this.runningJump = player.runningJump;
        this.standing = player.standing;
        this.falling = player.falling;
        this.canPass = player.canPass;
        this.landed = player.landed;
        this.collission = player.collission;
        this.height = player.height;
        //this.baseHeight = startingHeight;
        //this.canvasWidth = canvasWidth;
        //this.worldWidth = worldWidth;
        this.worldX = player.worldX;
        //this.worldX = 8100;
        this.worldY = player.worldY;
        this.boundingbox = new BoundingBox(player.boundingbox.x, player.boundingbox.y,
            player.boundingbox.width, player.boundingbox.height); //145
        //when its null I'm not currently on a platform.
        this.currentPlatform = player.currentPlatform;
        //keeps track of where the bounding box's bottom was before it changed. should be when falling.
        this.lastBottom = player.lastBottom;
        this.lastTop = player.lastTop;

        //stores character's rewindStack
        this.myRewindStack = player.myRewindStack;
        this.rewinding = player.rewinding;
        //this.game = game;
        this.lastFrame = player.lastFrame;
        // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.rewindCount = player.rewindCount;
        // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    }

    //The update method for run boy
    //has the controls for when he will run and jump and will move the player across the screen.
    RunBoy.prototype.move = function (game) {
        this.game = game;
        if (game.running === false) {
            return this.game;
        }

        // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (this.rewinding === true) {

            this.boundingbox = new BoundingBox(this.lastFrame.canvasX, this.lastFrame.canvasY, this.boundingbox.width, this.boundingbox.height);
            return this.game;

        } else if (this.myRewindStack.length === 0 && this.rewindCount > 0) {
            ///////////////////////////////////////////////
            //var rwSound = document.getElementById('rewindSound');
            //rwSound.pause();
            //rwSound.currentTime = 0;
            ///////////////////////////////////////////////
            this.x = this.lastFrame.canvasX;
            this.worldX = this.lastFrame.worldX;
            this.direction = this.lastFrame.direction;

            if (this.lastFrame.currentPlatform != null) {
                this.currentPlatform = this.lastFrame.currentPlatform;
                this.y = (this.currentPlatform.boundingBox.top - 3) - this.boundingbox.height;
                this.worldY = this.lastFrame.worldY;

            } else {
                this.y = this.lastFrame.canvasY;
                this.worldY = this.lastFrame.worldY;
            }

            // 5/30 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            this.baseHeight = this.y;

            // de-activate keydown Listeners while jumping or falling, otherwise activate them
            if (this.falling || this.jumping || this.runningJump) {
                this.game.addListeners = false;
            } else {
                this.game.addListeners = true;
            }
            // 5/30 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            return this.game;
        }
        // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var maxHeight = 300;
        var tempX = this.x;
        var tempWorldX = this.worldX;
        var tempY = this.y;

        /*
         * Falling
         */
        if (this.currentPlatform === null && this.y !== startingHeight && !this.runningJump && !this.jumping) {
            this.falling = true;
            //var prevY = this.y;
            this.y = this.y + moveDistance;
            this.canvasMove();

            if (this.y > startingHeight) {
                this.y = startingHeight;
                this.falling = false;
                this.standing = true;
                this.baseHeight = this.y;
                this.falling = false;
            }

            this.lastBottom = this.boundingbox.bottom;
            this.lastTop = this.boundingbox.top;
            this.boundingbox = new BoundingBox(this.x, this.y, this.boundingbox.width, this.boundingbox.height);

        }

            /*
             * Running and Jumping
             */


            // !!!!!!!!!!!!Changed to to a else if!!! 5/24/2014
        else if ((this.game.space && (this.game.rightArrow || this.game.leftArrow)) || this.runningJump) {
            this.runningJump = true;
            this.jumping = false;
            this.running = false;
            this.standing = false;
            var done = false;

            if (direction) { // Right

                var duration = this.jumpRight.elapsedTime + this.game.clockTick; //the duration of the jump.
                if (duration > this.jumpRight.totalTime / 2) {
                    duration = this.jumpRight.totalTime - duration;
                }
                duration = duration / this.jumpRight.totalTime;
                this.height = (4 * duration - 4 * duration * duration) * maxHeight + 17;

                if (this.jumpRight.isDone()) {
                    done = true;
                    this.jumpRight.elapsedTime = 0;
                    this.runningJump = false;
                }

            } else { // Left

                var duration = this.jumpLeft.elapsedTime + this.game.clockTick;
                if (duration > this.jumpLeft.totalTime / 2) {
                    duration = this.jumpLeft.totalTime - duration;
                }
                duration = duration / this.jumpLeft.totalTime;

                this.height = (4 * duration - 4 * duration * duration) * maxHeight + 17;

                if (this.jumpLeft.isDone()) {
                    done = true;
                    this.jumpLeft.elapsedTime = 0;
                    this.runningJump = false;
                }
            }

            this.canvasMove();
            this.game.space = false; //stop Runboy from jumping continuously
            if (done) {
                this.y = this.baseHeight;
            }
            else {
                this.y = this.baseHeight - this.height / 2;
            }
            this.didICollide();

            if (this.landed) {
                if (direction) {
                    this.jumpRight.elapsedTime = 0;
                    this.x = this.x - moveDistance;
                }
                else {
                    this.jumpLeft.elapsedTime = 0;
                    this.x = this.x + moveDistance;
                }
                this.baseHeight = this.y;
                this.runningJump = false;
                this.y = tempY;
            }
            this.lastBottom = this.boundingbox.bottom;
            this.lastTop = this.boundingbox.top;
            this.boundingbox = new BoundingBox(this.x, this.y, this.boundingbox.width, this.boundingbox.height);

            /*
             * Standing and Jumping
             */
        } else if ((this.game.space && this.standing) || this.jumping) {
            this.jumping = true;
            this.runningJump = false;
            this.running = false;
            this.standing = false;
            this.game.isRightArrowUp = true;
            this.game.isLeftArrowUp = true;
            this.game.rightArrow = false;
            this.game.leftArrow = false;

            if (direction) { // Right
                var duration = this.jumpRight.elapsedTime + this.game.clockTick; //the duration of the jump.
                if (duration > this.jumpRight.totalTime / 2) {
                    duration = this.jumpRight.totalTime - duration;
                }
                duration = duration / this.jumpRight.totalTime;
                this.height = (4 * duration - 4 * duration * duration) * maxHeight + 17;

                this.lastBottom = this.boundingbox.bottom;
                this.y = this.baseHeight - this.height / 2;

                if (this.jumpRight.isDone()) {
                    this.y = this.baseHeight;
                    this.jumpRight.elapsedTime = 0;
                    this.jumping = false;
                }

                this.lastBottom = this.boundingbox.bottom;
                this.lastTop = this.boundingbox.top;
                this.boundingbox = new BoundingBox(this.x, this.y, this.boundingbox.width, this.boundingbox.height);

            } else { // Left

                var duration = this.jumpLeft.elapsedTime + this.game.clockTick;
                if (duration > this.jumpLeft.totalTime / 2) {
                    duration = this.jumpLeft.totalTime - duration;
                }
                duration = duration / this.jumpLeft.totalTime;
                this.height = (4 * duration - 4 * duration * duration) * maxHeight + 17;

                this.lastBottom = this.boundingbox.bottom;
                this.lastTop = this.boundingbox.top;
                this.y = this.baseHeight - this.height / 2;

                if (this.jumpLeft.isDone()) {
                    this.y = this.baseHeight;
                    this.jumpLeft.elapsedTime = 0;
                    this.jumping = false;
                }

                this.lastBottom = this.boundingbox.bottom;
                this.lastTop = this.boundingbox.top;
                this.boundingbox = new BoundingBox(this.x - moveDistance, this.y, this.boundingbox.width, this.boundingbox.height);
            }

            if (this.landed) {
                if (this.direction) {
                    this.jumpRight.elapsedTime = 0;
                    this.x = this.x - moveDistance;
                }
                else {
                    this.jumpLeft.elapsedTime = 0;
                    this.x = this.x + moveDistance;
                }
                this.baseHeight = this.y;
                this.jumping = false;
                this.y = tempY;
            }

            this.game.space = false; //stop Runboy from jumping continuously

            /*
             * Running Right
             */
        } else if (this.game.rightArrow) {
            this.running = true;
            this.standing = false;
            this.jumping = false;
            this.runningJump = false;
            var tempX = this.x;
            this.canvasMove();
            this.lastBottom = this.boundingbox.bottom;
            this.lastTop = this.boundingbox.top;
            if (this.x > tempX) {
                this.boundingbox = new BoundingBox(this.x, this.y, this.boundingbox.width, this.boundingbox.height);
            } else {//for when the world x moves but running boy doesn't move?
                this.boundingbox = new BoundingBox(this.x + moveDistance, this.y, this.boundingbox.width, this.boundingbox.height);
            }

            /*
             * Running Left
             */
        } else if (this.game.leftArrow) {
            this.running = true;
            this.standing = false;
            this.jumping = false;
            this.runningJump = false;
            var tempX = this.x;
            this.canvasMove();
            this.lastBottom = this.boundingbox.bottom;
            this.lastTop = this.boundingbox.top;
            if (this.x < tempX) {
                this.boundingbox = new BoundingBox(this.x, this.y, this.boundingbox.width, this.boundingbox.height);
            } else {//for when the world x moves but running boy doesn't move?
                this.boundingbox = new BoundingBox(this.x - moveDistance, this.y, this.boundingbox.width, this.boundingbox.height);
            }

            /*
             * Standing
             */
        } else if (!this.game.leftArrow && !this.game.rightArrow && !this.game.space) {
            this.standing = true;
            this.lastBottom = this.boundingbox.bottom;
            this.lastTop = this.boundingbox.top;
            this.boundingbox = new BoundingBox(this.x, this.y, 80, this.boundingbox.height);
        }

        this.didICollide();

        if (!this.canPass) {
            this.worldX = tempWorldX;
            this.x = tempX;
            this.boundingbox = new BoundingBox(this.x, this.y, this.boundingbox.width, this.boundingbox.height);
        }
            //If I can pass then I must not have a current platform near me to collide with, so make sure current platform doesn't exist.
        else if (!this.collission) {
            this.currentPlatform = null;
        }

        // de-activate keydown Listeners while jumping or falling, otherwise activate them
        if (this.falling || this.jumping || this.runningJump) {
            this.game.addListeners = false;
        } else {
            this.game.addListeners = true;
        }

        return this.game;
    };

    /*
* Determines whether RunBoy moves on the canvas, in the world, or both.
*/
    RunBoy.prototype.canvasMove = function () {
        var canvasMidpoint = this.canvasWidth / 2;

        if (direction) {
            if ((this.worldX < canvasMidpoint) || ((this.worldX >= this.worldWidth - canvasMidpoint) &&
                (this.x + 90 <= this.canvasWidth - moveDistance))) {
                this.x += moveDistance;
                this.worldX += moveDistance;

            } else if (this.worldX >= this.worldWidth) { // he's at the right edge of the world and canvas
                this.worldX = this.worldWidth;

            } else { // he's in the middle of the canvas facing right
                this.worldX += moveDistance;
            }

        } else {
            if (this.worldX < canvasMidpoint && (this.x >= moveDistance) || (this.worldX > this.worldWidth - canvasMidpoint)) {
                this.x -= moveDistance;
                this.worldX -= moveDistance;

            } else if (this.x <= 0 || this.worldX <= 0) { // he's at the left edge of the world and canvas
                this.worldX = 0;
                this.x = 0;

            } else { // he's in the middle of the canvas facing left
                this.worldX -= moveDistance;
            }
        }
    };


    RunBoy.prototype.moveRewind = function () {
        var canvasMidpoint = this.canvasWidth / 2;

        if (this.worldX < canvasMidpoint || this.worldX > (this.worldWidth - canvasMidpoint)) {
            this.x = this.lastFrame.canvasX;
            this.worldX = this.lastFrame.worldX; //-= moveDistance;

        } else if (this.x <= 0 || this.worldX <= 0) { // he's at the left edge of the world and canvas
            this.worldX = 0;
            this.x = 0;

        } else { // he's in the middle of the canvas facing left
            this.worldX = this.lastFrame.worldX;
            //this.x = this.lastFrame.worldX;
        }

        this.y = this.lastFrame.canvasY;

        this.direction = this.rewindFrame.direction;
        this.falling = this.rewindFrame.falling;
        this.jumping = this.rewindFrame.jumping;
        this.runningJump = this.rewindFrame.runningJump;
        this.currentPlatform = this.rewindFrame.currentPlatform;
        this.worldY = this.lastFrame.worldY;
    }


    RunBoy.prototype.didICollide = function () {
    
        this.canPass = true;
        this.landed = false;
        this.collission = false;

        for (var i = 0; i < this.game.entities.length; i++) {

            var entity = this.game.entities[i];
            var result = this.boundingbox.collide(entity.boundingBox);



            if (result && !entity.removeFromWorld && entity instanceof Item) {
                // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                document.getElementById('itemSound').play();
                // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                entity.removeFromWorld = true;
                this.game.score += entity.points;
                this.game.numItems++;
                document.getElementById("score").innerHTML = this.game.score;
            }
            else if (result && entity instanceof FinishLine) {
                this.game.running = false;
            }
            else if (result && entity instanceof Enemy) {
                // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var rwSound = document.getElementById('rewindSound');
                //rwSound.loop = 'true';
                rwSound.play();
                this.rewindCount++;
                // 5/28 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                this.rewindMe();
                //console.log(entity.boundingbox.x);
            }
            else if (result && entity instanceof Platform) {

                this.collission = true;

                //check if I landed on a platform first
                if (entity.boundingBox.top > this.lastBottom && !this.landed) { //put in separate if state and change landed.
                    this.currentPlatform = entity;
                    this.landed = result;

                    // He landed on a platform while falling
                    if (this.falling) {
                        this.falling = false;
                        this.standing = true;
                        this.jumping = false;
                        this.runningJump = false;
                        this.baseHeight = this.y;
                    }

                }
                else if (entity.boundingBox.bottom < this.lastTop && !this.landed) {
                    this.landed = result;
                }
                else if (this.canPass && (this.currentPlatform == null || entity.y < this.currentPlatform.y)) {
                    this.canPass = !result;
                }

            }
        }
    }

    //Adds Each frame to rewind stack
    RunBoy.prototype.addRewindFrame = function (clipX, clipY, frameWidth, frameHeight) {
        if (this.myRewindStack.length >= 600) {
            this.myRewindStack.shift();
        }
        var finalIndex = this.myRewindStack.length - 1;
        var last = this.myRewindStack[finalIndex];
        var current = {
            canvasX: Math.floor(this.x), canvasY: Math.floor(this.y), worldX: Math.floor(this.worldX), worldY: Math.floor(this.worldY),
            clipX: clipX, clipY: clipY,
            frameWidth: frameWidth, frameHeight: frameHeight, direction: direction ? true : false, falling: this.falling,
            jumping: this.jumping, runningJump: this.runningJump, running: this.running, boundingbox: this.boundingbox,
            currentPlatform: this.currentPlatform
        };
        this.lastFrame = current;
        this.myRewindStack.push(current);

    }