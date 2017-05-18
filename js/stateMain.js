var StateMain={    
    
   preload:function()
    {
        if (screen.width < 1024){
         game.scale.forceOrientation(true, false);	
       }
       game.load.spritesheet("dragon", "images/main/dragon.png", 120, 85, 4);
     
       game.load.image("background", "images/main/background.png");
       game.load.spritesheet("candy", "images/main/candy.png", 52, 50, 8);
    },
    
    create:function()
    {
    	game.physics.startSystem(Phaser.Physics.ARCADE);

    	this.top = 0;
    	this.bottom = game.height-85-70+8;

    	//dragon
    	this.dragon=game.add.sprite(0,0,"dragon");
    	this.dragon.animations.add('fly', [0, 1, 2, 3], 12, true);
    	this.dragon.animations.play('fly');

    	//background
    	this.background = game.add.tileSprite(0, game.height-480, game.width, 480, 'background');

    	//IPAD FIX
    	if (screen.height>764){
    		this.background.y = game.world.centerY - this.background.height/2;
    		this.top = this.background.y;
    	}

    	this.dragon.bringToTop();
    	this.dragon.y = this.top;
    	

    	this.background.autoScroll(-100, 0);

    	//candies
    	this.candies=game.add.group();
    	this.candies.createMultiple(40, 'candy');
    	this.candies.setAll('checkWorldBounds', true);
    	this.candies.setAll('outOfBoundsKill', true);

    	game.physics.enable([this.dragon, this.candies], Phaser.Physics.ARCADE);
    	this.dragon.body.gravity.y=500;

        this.setListeners();
    },

    setListeners: function() {
    	if (screen.width < 1024){
    		game.scale.enterIncorrectOrientation.add(this.wrongWay, this);
    		game.scale.leaveIncorrectOrientation.add(this.rightWay, this);
    	}
    	game.time.events.loop(Phaser.Timer.SECOND, this.fireCandy, this); //Use `add` for one off timer
    	
    },
    fireCandy: function() {
    	var candy = this.candies.getFirstDead(); //First piece of candy that is not on screen/not active
    	var y = game.rnd.integerInRange(0, game.height-60);
    	var x = game.width-100;
    	var type=game.rnd.integerInRange(0,7);

    	candy.frame = type;
    	candy.reset(x, y);
    	candy.enabled = true;//No longer elegible for getFirstDead
    	candy.body.velocity.x=-200;
    },
    wrongWay: function() {
    	console.log("wrongWay");
    	document.getElementById('wrongWay').style.display='block';
    },
    rightWay: function() {
    	console.log("rightWay");	
    	document.getElementById('wrongWay').style.display='none';
    },
    flap:function() {
    	this.dragon.body.velocity.y=-200;
    },
    
    update:function()
    {       

    	if (game.input.activePointer.isDown){
    		this.flap();
    	}

    	if (this.dragon.y < this.top){
    		this.dragon.y = this.top;
    		//this.dragon.body.velocity.y=0;
    	}

        if (this.dragon.y > this.bottom){
        	this.dragon.y = this.bottom;
        	this.dragon.body.gravity.y = 0;
        }else {
        	this.dragon.body.gravity.y = 500;
        }
    }    
    
}