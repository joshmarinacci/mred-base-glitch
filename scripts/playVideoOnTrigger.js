
/*
 #title Play Video on Click
 #description Play the video asset attached to this behavior
*/
({
    // defines a target property. must be a scene
    properties: {
        media: {
            type:'enum',
            title: 'video',
            value: null,
            hints: {
              type:'video',
            }
        },
    },
 
    click: function(e) {
        const video = this.getObjectById(this.properties.video)
        this.getAssetByTitle(video.title).play()
    }
})
