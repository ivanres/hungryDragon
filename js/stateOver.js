var StateOver={    
    
   preload:function()
    {
       game.load.spritesheet("buttons", "images/ui/buttons.png", 265, 75);
    },
    
    create:function()
    {
        this.buttonPlayAgain = game.add.button(game.world.centerX, game.world.centerY + 100, "buttons", this.replay, this, 0, 1, 0);
        this.buttonPlayAgain.anchor.set(0.5, 0.5);

    },
    replay: function(){
    	game.state.start("StateMain");
    },
    update:function()
    {       
        
    }    
    
}