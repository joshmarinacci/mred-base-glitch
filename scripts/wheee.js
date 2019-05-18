/*
#title Wheee
#description logs something when you get a wheee event
*/
({
    properties: {
        print: {
            type:'string',
            value: ""
        },
        capture: {
          type: 'boolean',
          value: false
        }
    },

    wheee: function(e) {
      let props = this.properties
      
      if (props.capture) {
        this.captureEvent()
      }
      this.logger.log("wheee: " + props.print)
    }
})
