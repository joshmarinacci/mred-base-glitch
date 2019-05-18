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
      this.startTime = e.time
    },
  
    tick: function(e) {
      var props = this.properties   
      //this.logger().log("time " , e.time - this.startTime)

      if ((e.time - this.startTime) > props.delay) {
        this.navigateScene(props.scene)
      }
    },
})
