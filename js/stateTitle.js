var StateTitle={    
    
   preload:function()
    {
       game.load.spritesheet("buttons", "images/ui/buttons.png", 265, 75);
    },
    
    create:function()
    {
        this.buttonStart = game.add.button(game.world.centerX, game.world.centerY + 100, "buttons", this.startGame, this, 6, 7, 6);
        this.buttonStart.anchor.set(0.5, 0.5);
    },

    startGame: function() {
		game.state.start("StateMain");
    },
    
    update:function()
    {       
        
    }    
    
}