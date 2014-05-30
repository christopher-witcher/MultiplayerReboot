var startingHeight = 435;
var worldWidth = 10000;
var canvasWidth = 1250;
var canvasHeight = 700;

    //This is the gameboard and contains everything which is used in the game.

    (function (exports) {
    var GameBoard = function () {
        this.players = [];
        this.running = false;
    }

    GameBoard.prototype.addPlayer = function (name) {
        var current = new RunBoy(canvasWidth, worldWidth, name);
        this.players.push(current);
    }

    GameBoard.prototype.getPlayer = function (name) {
        if (this.players[0].name === name) {
            return this.players[0];
        } else {
            return this.players[1];
        }
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
    function RunBoy(canvasWidth, worldWidth, the_name) {
        this.rewindFrame = null;
        this.x = 0;
        this.y = startingHeight
        this.name = the_name;
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
        this.collission = player.collission
        this.height = player.height
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