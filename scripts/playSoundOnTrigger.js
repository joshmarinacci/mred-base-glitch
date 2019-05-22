/*
#title Play Sound on Trigger Event
#description Play a sound on a "trigger" event
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
        this.logger.error("received trigger, playing sound")

        let sound = this.properties.sound
        if(!sound) {
          this.logger.error("No sound property set")
          return
        }
        this.playMedia(sound)
    }
})