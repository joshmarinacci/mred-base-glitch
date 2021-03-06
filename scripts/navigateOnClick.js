/*
#title Navigate on Click
#description Navigate to a new scene on click
*/
({
    // defines a target property. must be a scene
    properties: {
        scene: {
            type:'enum',
            title: 'target scene',
            value:null,
            hints: {
                type:'node',
                nodeType:'scene'
            }
        },
    },
     
    //called when object is clicked on
    click: function(e) {
        var props = this.properties
        this.logger.log("navigate to ", props.scene)
        this.navigateScene(props.scene)
      }
})
