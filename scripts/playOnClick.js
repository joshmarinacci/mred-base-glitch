
/*
 #title click to play sound
 #description play the audio asset attached to this behavior
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
 
    click: function(e) {
        const sound = this.getObjectById(this.properties.sound)
        this.getAssetByTitle(sound.title).play()
    }
})
