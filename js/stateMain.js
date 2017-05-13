var StateMain={    
    
   preload:function()
    {
        if (screen.width < 1024){
         game.scale.forceOrientation(true, false);	
       }
       game.load.spritesheet("dragon", "images/main/dragon.png", 120, 85, 4);
       game.load.image("background", "images/main/background.png");
    },
    
    create:function()
    {
    	//dragon
    	this.dragon=game.add.sprite(0,0,"dragon");
    	this.dragon.animations.add('fly', [0, 1, 2, 3], 12, true);
    	this.dragon.animations.play('fly');

    	//background
    	this.background = game.add.tileSprite(0, game.height-480, game.width, 480, 'background');

    	this.dragon.bringToTop();

    	this.background.autoScroll(-100, 0);

        this.setListeners();
    },

    setListeners: function() {
    	if (screen.width < 1024){
    		game.scale.enterIncorrectOrientation.add(this.wrongWay, this);
    		game.scale.leaveIncorrectOrientation.add(this.rightWay, this);
    	}
    	
    },
    wrongWay: function() {
    	console.log("wrongWay");
    	document.getElementById('wrongWay').style.display='block';
    },
    rightWay: function() {
    	console.log("rightWay");	
    	document.getElementById('wrongWay').style.display='none';
    },
    
    update:function()
    {       
        
    }    
    
}