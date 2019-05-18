//move object two meters to the right when it is clicked
click(evt) {
   evt.target.position.x += 2
}
//spin target object using configurable speed
tick(evt) {
	e.target.rotation.y += this.properties.speed
}
//listen for proximity event and start particles
message(evt) {
	if(e.type === 'proximity-enter') {
		this.getObjectByTitle('fountain').start()
  }
}
//when scene enters, rotate target 4 times then play a sound
enter(evt) {
	this.tween.prop({
		target: e.target.rotation
		property: 'y',
		duration: 2.0,
		from: 0,
		to: toRadians(360)
		loop: 4,
  }).action(()=>{
		this.getAssetByTitle('chime').play()
  }).start()
}
