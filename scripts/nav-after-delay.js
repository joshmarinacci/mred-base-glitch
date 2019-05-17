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
    tick: function(e) {
            e.system.logger().log("time " , e.props.scene)

      if (e.time > e.props.delay) {
        e.system.navigateScene(e.props.scene)
      }
    },
})
