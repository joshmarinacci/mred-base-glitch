/*
#title Play Sound on Trigger Event
#description play a sound on a trigger event
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
        this.logger.log("trigger called")
        if(!this.properties.sound) {
          this.logger.error("No sound property set")
          return
        }
        const sound = this.getObjectById(this.properties.sound)
        if(sound) {
          this.playSound(sound.title)
        } else {
          this.logger.error("No sound!")
        }
    }
})
