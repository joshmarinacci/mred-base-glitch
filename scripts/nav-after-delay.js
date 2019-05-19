/*
#title Navigate After Delay
#description wait for a certain amount of time and then transition
*/
({
    properties: {
        delay: {
            type:'number',
            value: 1,
        },
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
    enter: function (e) {
      this.properties.startTime = e.time
    },
  
    tick: function(e) {
      
      //this.logger.log("time " , e.time - e.props.startTime)

      if ((e.time - this.properties.startTime) > this.properties.delay) {
        this.navigateScene(this.properties.scene)
      }
    },
})
