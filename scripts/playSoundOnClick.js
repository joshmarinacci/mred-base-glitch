
/*
 #title Play Sound on Click
 #description Play the audio asset attached to this behavior
*/
({
    // defines a target property. must be a scene
    properties: {
        media: {
            type:'enum',
            title: 'sound',
            value: null,
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
