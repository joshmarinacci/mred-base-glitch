/*
#title Play Sound on event
#description play a sound on a "trigger" event
*/
({
<<<<<<< HEAD
  // defines a target property. must be a scene
  properties: {
      sound: {
          type:'enum',
              title: 'sound',
              value:null,
              hints: {
              type:'audio',
          }
      },
  },
  trigger: function(e) {
      let sound = this.properties.sound
      if(!sound) {
        this.logger.error("No sound property set")
        return
      }
      this.playMediaAsset(sound)
  }
=======
    // defines a target property. must be a scene
    properties: {
        sound: {
            type:'enum',
                title: 'sound',
                value:null,
                hints: {
                type:'audio',
            }
        },
    },
    trigger: function(e) {
        let sound = this.properties.sound
        if(!sound) {
          this.logger.error("No sound property set")
          return
        }
        this.playMediaAsset(sound)
    }
>>>>>>> upstream/master
})