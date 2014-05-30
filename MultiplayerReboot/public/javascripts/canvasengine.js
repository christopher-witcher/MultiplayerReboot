var canvasWidth = 1250;
var canvasHeight = 700;



    ////////////////////////////////////////////////////////////////
    /////Canvas Engine Here///////////////////
    //////////////////////////////////////////////////


    //////////////////////////////////////////////////
    ////////End Canvas Engine/////////////////////////
    //////////////////////////////////////////////////



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