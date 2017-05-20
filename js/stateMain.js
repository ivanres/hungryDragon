var StateMain={    
    
   preload:function()
    {
        if (screen.width < 1024){
         game.scale.forceOrientation(true, false);	
       }
       game.load.spritesheet("dragon", "images/main/dragon.png", 120, 85, 4);
     
       game.load.image("background", "images/main/background.png");
       game.load.spritesheet("candy", "images/main/candy.png", 52, 50, 8);
       game.load.image("balloon", "images/main/thought.png");
       game.load.spritesheet("soundButtons", "images/ui/soundButtons.png", 44, 44, 4);

       game.load.audio("burp", "sounds/burp.mp3");
       game.load.audio("gulp", "sounds/gulp.mp3");
       game.load.audio("backgroundMusic", "sounds/background.mp3");
    },
    
    create:function()
    {

        this.score = 0;
        this.backgroundMusicPlaying = false;

    	game.physics.startSystem(Phaser.Physics.ARCADE);

    	this.top = 0;
    	this.bottom = game.height-85-70+8;

    	//sounds
    	this.burp = game.add.audio("burp");
    	this.gulp = game.add.audio("gulp");
    	this.backgroundMusic = game.add.audio("backgroundMusic");
    	this.backgroundMusic.volume = .5;
    	this.backgroundMusic.loop = true;

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

        //thought
        this.balloonGroup = game.add.group();
        this.balloon=game.add.sprite(0,0,"balloon");
        this.think=game.add.sprite(36,26, "candy");
        this.balloonGroup.add(this.balloon);
        this.balloonGroup.add(this.think);
        this.balloonGroup.scale.x=.5;
        this.balloonGroup.scale.y=.5;
        this.balloonGroup.x=50;

        //text
        this.scoreText=game.add.text(game.world.centerX, 60 , this.score);
        this.scoreText.fill="#000000";
        this.scoreText.fontSize=64;
        this.scoreText.anchor.set(0.5, 0.5);

        this.scoreLabel=game.add.text(game.world.centerX, 20 , "SCORE");
        this.scoreLabel.fill="#000000";
        this.scoreLabel.fontSize=32;
        this.scoreLabel.anchor.set(0.5, 0.5);


        // game.physics.enable([this.dragon, this.candies], Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this.dragon);
    	game.physics.arcade.enable(this.candies);
    	this.dragon.body.gravity.y=500;
    	this.dragon.body.immovable = true;

    	//sound buttons
    	this.btnMusic=game.add.sprite(20,20,"soundButtons");
    	this.btnSound=game.add.sprite(70,20,"soundButtons");
    	this.btnMusic.frame=2;

        this.setListeners();
        this.resetThink();

        this.updateButtons();
        this.updateMusic();
    },

    setListeners: function() {
    	if (screen.width < 1024){
    		game.scale.enterIncorrectOrientation.add(this.wrongWay, this);
    		game.scale.leaveIncorrectOrientation.add(this.rightWay, this);
    	}
    	game.time.events.loop(Phaser.Timer.SECOND, this.fireCandy, this); //Use `add` for one off timer

    	this.btnSound.inputEnabled = true;
    	this.btnSound.events.onInputDown.add(this.toggleSound, this);

    	this.btnMusic.inputEnabled = true;
    	this.btnMusic.events.onInputDown.add(this.toggleMusic, this);

    	
    },
    toggleSound: function() {
    	soundOn = !soundOn;
    	this.updateButtons();
    },
    toggleMusic: function() {
    	musicOn = !musicOn;
    	this.updateButtons();
    	this.updateMusic();
    },
    updateMusic: function() {
    	if (musicOn){
    		if (!this.backgroundMusicPlaying){
    			this.backgroundMusicPlaying = true;
    			this.backgroundMusic.play();
    		}
    	}
    	else {
    		this.backgroundMusicPlaying = false;
    		this.backgroundMusic.stop();
    	}
    },
    updateButtons: function() {
    	this.btnSound.frame = soundOn? 0 : 1;
    	this.btnMusic.frame = musicOn? 2 : 3;
    	
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
    onEat: function (dragon, candy) {
        if (this.think.frame == candy.frame){
            candy.kill(); //Removes candy from the stage    
            this.resetThink();
            this.score++;
            this.scoreText.text = this.score;
            if (soundOn){
            	this.gulp.play();
            }
        } else{
        	this.backgroundMusic.stop();
        	if (soundOn){
            	this.burp.play();
            }
            candy.kill();
            game.state.start("StateOver");
            
        }
    	
    },
    resetThink: function(){
        var n = game.rnd.integerInRange(0, 7);
        this.think.frame = n;
    },
    update:function()
    {       
    	game.physics.arcade.collide(this.dragon, this.candies, null, this.onEat, this);

        this.balloonGroup.y = this.dragon.y-60;

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