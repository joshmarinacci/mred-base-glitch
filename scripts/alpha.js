/*
#title alpha
#description have transparency
*/
({
    properties: {
        alpha: {
            type:'number',
            value: 0.5,
        }
    },
    start: function (event) {
      if(!event.target.material) return
      event.target.material.transparent = true
      event.target.material.opacity = this.properties.alpha
      event.target.material.needsUpdate = true
    },
})
