
/*
 #title proximity event
 #description plays audio file when close enough to the target
*/
({
  enter: function(e) {
     e.logger.log("starting an animation")
  },
  onTick: function(e) {
    const cam = e.system.getCamera()
    const target = e.target
    const dist = cam.position.distanceTo(target.getPosition())
    let inside = e.system.getKeyValue('inside')
    //console.log("dist",dist, e.props.distance, inside)
    if(typeof inside === 'undefined') {
        //console.log("setting first inside")
        inside = dist < e.props.distance
        e.system.setKeyValue('inside',inside)
    }
    if(dist < e.props.distance && !inside) {
        inside = true
        e.system.setKeyValue('inside',inside)
        //console.log("went inside")
        e.system.sendMessage('enter',e.props.enterMessage)
        //e.system.getAsset('machines').play()
    } 
    if(dist >= e.props.distance && inside) {
        inside = false
        e.system.setKeyValue('inside',inside)
        //e.system.getAsset('machines').stop()
        e.system.sendMessage('exit',e.props.exitMessage)
        //console.log("went outside")
    }
  }
})
