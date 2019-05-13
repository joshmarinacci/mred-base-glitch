
/*
 #title toggle music
 #description does something
*/
({
  onMessage: function(e) {
      console.log("got a message",e)
      if(e.message === 'play') {
          e.system.getAsset('sugar.mp3').play()
      }
      if(e.message === 'stop') {
          e.system.getAsset('sugar.mp3').stop()
      }
  },
})
