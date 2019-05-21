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
    trigger: function(event) {
        let sound = this.properties.sound
        if(!sound) {
          this.logger.error("No sound property set")
          return
        }
        this.playSound(sound)
    }
})
