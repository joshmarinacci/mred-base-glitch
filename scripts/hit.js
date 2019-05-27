/*
 #title hit maker
 #description update an objects local anchor
*/
({
  properties: {
    velocity: { 
      type:'number', 
      title: 'speed', 
      value:0.001, 
    },
  },
  start: function(e) {
  },
  tick: function(e) {
  },
  click: function(e) {
      // find an object that is hopefully an anchor and update its anchor
      // I'm just using an arbitrary click on some other object to fire the event as a test - this wouldn't make any sense in real life
      let node = this.getThreeObjectByTitle("localanchor 0")
      if(node) {
          this.sgp.startLocalAnchor({node:node,screenx:0,screeny:0})
      }
  },
  tick: function(e) {
      let node = this.getThreeObjectByTitle("localanchor 0")
      if(node) node.visible = true
  }
})
