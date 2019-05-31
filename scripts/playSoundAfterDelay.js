/*
#title playSoundAfterDelay
#description after a certain delay, play a sound
*/
({
    properties: {
        delay: {
            type:'number',
            value: 1,
        },
        sound: {
            type:'enum',
                title: 'sound',
                value:null,
                hints: {
                type:'audio',
            }
        },
    },

    enter: function (e) {
      this.startTime = e.time
      e.target.visible = false    
      this.played = false
    },
  
    tick: function(e) {
      var props = this.properties  
      
      if (!this.played && (e.time - this.startTime) > props.delay) {
        let sound = props.sound
        this.played = true
        if(!sound) {
          this.logger.error("No sound property set")
          return
        }
        this.playMedia(sound)
      }
    }
})
