# scripting cheat sheet

* get an object in the scene with getObjectById() or getObjectByTitle()
* the event has a ‘system’ property which gives you access to lots of things.
* the event has a target property which is the object the event happened on. In most cases this will be the object the behavior is added to
* event
	* type
	* system
	* props: properties of the 
	* target:  the ThreeJS object this behavior is attached to
	* graphTarget: the graph document object this behavior is attached to
* behaviors known events:
	* init() called on system start, even if you aren’t in the current scene
	* onEnter()
	* onExit()
	* onClick()
	* onMessage()
	* onTick()
	* stop() called when the system stops
* system methods
	* getCurrentScene()
	* getScene(name)
	* getObject(name)
	* getObjectById(id)
	* getAsset(name)
	* navigateScene(id)
	* playSound(id)
	* getCamera()
	* setKeyValue()
	* getKeyValue()
	* hasKeyValue()
	* isAR()
	* sendMessage(name, payload) sends message to the event’s target
	* getTweenManager()
* Asset object, returned by getAsset(name)
	* play()
	* stop()
* ThreeJS object returned by getObject(name) and event targets
	* properties
		* position
		* rotation
		* visible

Properties for behaviors are specified as a map of key names to prop definitions. The definitions look like this:
```
properties: {
	//a number property
	distance: { 
		type:'number',  //the type
		value:2,  //initial value
	},

  //a string
	enterMessage: {
		type:'string',
		title:'enter message',
		value:'entered',
	},

  // a reference to another node
	exitMessage: {
		type:'enum',
		value:null,
		hints: {
			type:'node',
			nodeType:'scene'
		}
	},

	//a reference to a video asset
	video: {
		type:'enum',
		value:null,
		hints: {
			type:'video'
		}
	},

},
```

## Examples
```
//move object two meters to the right when it is clicked
onClick(e) {
   e.target.position.x += 2
}
//spin target object using configurable speed
onTick(e) {
	e.target.rotation.y += e.props.speed
}
//listen for proximity event and start particles
onMessage(e) {
	if(e.type === 'proximity-enter') {
		e.system.getObject('fountain').start()
  }
}
//when scene enters, rotate target 4 times then play a sound
onEnter(e) {
	e.system.getTweenManager().prop({
		target: e.target.rotation
		property: 'y',
		duration: 2.0,
		from: 0,
		to: toRadians(360)
		loop: 4,
  }).action(()=>{
		e.system.getAsset('chime').play()
  }).start()
}
```



## Global Functions
* toRadians(degrees)
* 


