/*
#title Wheee
#description logs something when you get a wheee event
*/
({
    properties: {
        print: {
            type:'string',
          title: "text to log:",
            value: "",
          hints: {
                multiline:true,
            }

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
