/*
#title Play Sound on event
#description play a sound on a "trigger" event
*/
({
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
        if(!this.properties.sound) {
          this.logger.error("No sound property set")
          return
        }
        const sound = this.getObjectById(this.properties.sound)
        if(sound) {
          this.manager.sgp.playMediaAsset(sound)
        } else {
          this.logger.error("No sound!")
        }
    }
})
