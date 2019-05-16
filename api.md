# scripting cheat sheet

* get an object in the scene with getObjectById() or getObjectByTitle()
* the event has a ‘system’ property which gives you access to lots of things.
* the event has a target property which is the object the event happened on. In most cases this will be the object the behavior is added to

#### event
	* *type*: the type of the event. `tick`, `exit`, etc.
	* *system*: a reference to the system object. See below for system methods.
	* *props*: properties of the target object 
	* *target*:  the ThreeJS object this behavior is attached to
	* *graphTarget*: the graph document object this behavior is attached to
	
#### behavior event handlers:
	* start() called on system start, even if you aren’t in the current scene
	* enter() called when entering a scene
	* exit() called when exiting a scene
	* message()
	* tick()
	* stop() called when the system stops
	
#### system methods
	* getCurrentScene(): a reference to the current scene
	* getScene(name): find any scene by its title
	* getObject(name): find any object by its title
	* getObjectById(id): find any object by its id
	* getAsset(name): find an asset by its title
	* navigateScene(id): navigate to a new scene, by id
	* playSound(id): play a sound by id
	* getCamera(): get a reference to the camera object
	* setKeyValue(key,value): set a keyvalue pair in storage. This is global for the whole app.
	* getKeyValue(key): return the value of the key in storage, if any.
	* hasKeyValue(key): returns true if the key is stored
	* sendMessage(name, payload) sends message to the event’s target
	* getTweenManager(): get a reference to the tween manager. See below for details
	
* Asset object, returned by getAsset(name)
	* play()
	* stop()

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
click(e) {
   e.target.position.x += 2
}
//spin target object using configurable speed
tick(e) {
	e.target.rotation.y += e.props.speed
}
//listen for proximity event and start particles
message(e) {
	if(e.type === 'proximity-enter') {
		e.system.getObject('fountain').start()
  }
}
//when scene enters, rotate target 4 times then play a sound
enter(e) {
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



The Tween API lets you create animations that are chained together in parallel or sequence.


### rotate the target object once
``` javascript
({
  // defines a target property. must be a scene
    enter: function(e) {
        const tw = e.system.getTweenManager()
        tw.prop({
            duration:1.0,
            target:e.target.rotation,
            property:'y',
            from:0,
            to:3.14*2,
            loop:1,
        }).start()
    },
})
```

### rotate the target object around y and also move x from -1 to 1, in sequence
``` javascript
({
  // defines a target property. must be a scene
    enter: function(e) {
        const tw = e.system.getTweenManager()
        tw.sequence()
            .then(tw.prop({
                duration:1.0,
                target:e.target.rotation,
                property:'y',
                from:0,
                to:3.14*2,
                loop:1,
            }))
            .then(tw.prop({
                duration:1.0,
                target:e.target.position,
                property:'x',
                from:-1,
                to:1,
            }))
            .start()
    },
})
```

### rotate the target object around y and also move x from -1 to 1, in parallel
``` javascript
({
  // defines a target property. must be a scene
    enter: function(e) {
        const tw = e.system.getTweenManager()
        tw.parallel()
            .and(tw.prop({
                duration:1.0,
                target:e.target.rotation,
                property:'y',
                from:0,
                to:3.14*2,
                loop:1,
            }))
            .and(tw.prop({
                duration:1.0,
                target:e.target.position,
                property:'x',
                from:-1,
                to:1,
            }))
            .start()
    },
})
```

### move the x from -1 to 1, then back, then print a message
``` javascript
({
  // defines a target property. must be a scene
    enter: function(e) {
        const tw = e.system.getTweenManager()
        tw.sequence()
            .then(tw.prop({
                duration:1.0,
                target:e.target.position,
                property:'x',
                from:-1,
                to:1,
                autoReverse:true,
            }))
            .then(()=> {
                e.logger.log("done here")
            })
            .start()
    },
})
```


