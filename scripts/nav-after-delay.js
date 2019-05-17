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
      e.props.startTime = e.time
    },
  
    tick: function(e) {
      
      //e.system.logger().log("time " , e.time - e.props.startTime)

      if ((e.time - e.props.startTime) > e.props.delay) {
        e.system.navigateScene(e.props.scene)
      }
    },
})
