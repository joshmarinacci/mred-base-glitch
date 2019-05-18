/*
#title Click to Nav
#description adds click handler to navigate to a new scene
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
      this.fireEvent("wheee", {})
      this.navigateScene(props.scene)
    },
  
    wheee: function(e) {
      this.logger.log ("received event wheee");
    },
  
    message: function(e) {
      this.logger.log ("received message wheee");
    }
})
