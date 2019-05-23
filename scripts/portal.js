
/*
#title portal
#description shows a view to another scene
*/

({
    properties: {
        color: {
            type:'string',
            value: "white",
        },
        width: {
            type:'number',
            value: 4,
        },
        height: {
            type:'number',
            value: 4,
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

    start: function (e) {

      
      
        ////////////////////////////////////////////////////////////////////////////////
        // REFLECTOR
        ////////////////////////////////////////////////////////////////////////////////      
      

        let THREE = this.globals.THREE
      
        //
        // Build a constructor that can be invoked later by user
        //
        THREE.Reflector = function ( geometry, options ) {

            let scope = this

            // glue for threejs class injection
            THREE.Mesh.call( scope, geometry );
            scope.type = 'Reflector';
          
            // caller option handling
            options = options || {};
            var color = ( options.color !== undefined ) ? new THREE.Color( options.color ) : new THREE.Color( 0x7F7F7F );
            var textureWidth = options.textureWidth || 512;
            var textureHeight = options.textureHeight || 512;
            var clipBias = options.clipBias || 0;
            var shader = options.shader || THREE.Reflector.ReflectorShader;
            var recursion = options.recursion !== undefined ? options.recursion : 1;

            // Build a few static variables to avoid thrashing memory at runtime
            var reflectorPlane = new THREE.Plane();
            var normal = new THREE.Vector3();
            var reflectorWorldPosition = new THREE.Vector3();
            var cameraWorldPosition = new THREE.Vector3();
            var scratchMatrix = new THREE.Matrix4();
            var lookAtPosition = new THREE.Vector3( 0, 0, - 1 );
            var clipPlane = new THREE.Vector4();
            var viewport = new THREE.Vector4();
            var view = new THREE.Vector3();
            var target = new THREE.Vector3();
            var q = new THREE.Vector4();
            var size = new THREE.Vector2();
            var textureMatrix = new THREE.Matrix4();
            var virtualCamera = new THREE.PerspectiveCamera();

            // Build a texture to render into
            var parameters = {
              minFilter: THREE.LinearFilter,
              magFilter: THREE.LinearFilter,
              format: THREE.RGBFormat,
              stencilBuffer: false
            }
            var renderTarget = this.renderTarget = new THREE.WebGLRenderTarget(
              textureWidth,
              textureHeight,
              parameters
            )
            if ( ! THREE.Math.isPowerOfTwo( textureWidth ) || ! THREE.Math.isPowerOfTwo( textureHeight ) ) {
              renderTarget.texture.generateMipmaps = false;
            }

            // After the target texture is rendered it needs to pretend it is a material so threejs can paint it
            var material = new THREE.ShaderMaterial( {
              uniforms: THREE.UniformsUtils.clone( shader.uniforms ),
              fragmentShader: shader.fragmentShader,
              vertexShader: shader.vertexShader
            } );
            material.uniforms[ "tDiffuse" ].value = renderTarget.texture;
            material.uniforms[ "color" ].value = color;
            material.uniforms[ "textureMatrix" ].value = textureMatrix;
            scope.material = material;
          
            // Every frame when painting this object, quickly go ahead and remake the texture based on a portal camera view
            scope.onBeforeRender = function ( renderer, portalParentScene, camera ) {

                // IGNORE supplied scene - the goal is to paint a specified scene
                let scene = options.scene
              
                // number of bounces - may be less useful for portals than mirrors?
                if ( 'recursion' in camera.userData ) {
                  if ( camera.userData.recursion === recursion ) return;
                  camera.userData.recursion ++;
                }

                // get portal position
                reflectorWorldPosition.setFromMatrixPosition( scope.matrixWorld )

                // get camera position
                cameraWorldPosition.setFromMatrixPosition( camera.matrixWorld )

                // get direction of portal
                scratchMatrix.extractRotation( scope.matrixWorld )
                normal.set( 0, 0, 1 )
                normal.applyMatrix4( scratchMatrix )

                // get a ray between portal and camera
                view.subVectors( reflectorWorldPosition, cameraWorldPosition )

                // Avoid rendering when reflector is facing away from player
                if ( view.dot( normal ) > 0 ) return;

                // TODO a bit wasteful of cpu
                virtualCamera = camera.clone()

                // get the camera to be relative to the portal
                let portalInverse = scratchMatrix.getInverse(scope.matrixWorld)
                virtualCamera.applyMatrix(portalInverse)
                // get the camera to be relative to the target scene
                if(!scene.matrixWorld) alert("error")
                let sceneInverse = scratchMatrix.getInverse(scene.matrixWorld)
                virtualCamera.applyMatrix(sceneInverse)

                // Update the texture matrix
                textureMatrix.set(
                  0.5, 0.0, 0.0, 0.5,
                  0.0, 0.5, 0.0, 0.5,
                  0.0, 0.0, 0.5, 0.5,
                  0.0, 0.0, 0.0, 1.0
                );
                textureMatrix.multiply( virtualCamera.projectionMatrix );
                textureMatrix.multiply( virtualCamera.matrixWorldInverse );
                textureMatrix.multiply( scope.matrixWorld );

                // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
                // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
                reflectorPlane.setFromNormalAndCoplanarPoint( normal, reflectorWorldPosition );
                reflectorPlane.applyMatrix4( virtualCamera.matrixWorldInverse );

                clipPlane.set( reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant );

                var projectionMatrix = virtualCamera.projectionMatrix;

                q.x = ( Math.sign( clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
                q.y = ( Math.sign( clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
                q.z = - 1.0;
                q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

                // Calculate the scaled plane vector
                clipPlane.multiplyScalar( 2.0 / clipPlane.dot( q ) );

                // Replacing the third row of the projection matrix
                projectionMatrix.elements[ 2 ] = clipPlane.x;
                projectionMatrix.elements[ 6 ] = clipPlane.y;
                projectionMatrix.elements[ 10 ] = clipPlane.z + 1.0 - clipBias;
                projectionMatrix.elements[ 14 ] = clipPlane.w;

                // Render everything except portal
                scope.visible = false;

                //////////////////////////////////////////////////
                // Make the target scene visible and add some lights to it as well
                // TODO remove this lighting hack later on once it's more clear why this is not being lit
                //////////////////////////////////////////////////

                let currentSceneVisible = scene.visible
                let portalParentSceneVisible = portalParentScene.visible
                scene.visible = true
                portalParentScene.visible = false
                if(!scope.somelight) {
                  scope.somelight = new THREE.PointLight(0xffffff, 1, 1000)
                  scope.somelight.intensity = 10
                  scope.anotherlight = new THREE.DirectionalLight()
                }                      
                scene.add(scope.somelight)
                scene.add(scope.anotherlight)

                // Render to the texture
                {
                    // Save state
                    var currentRenderTarget = renderer.getRenderTarget();
                    var currentVrEnabled = renderer.vr.enabled;
                    var currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

                    // Render to buffer
                    // note - renderer must also be passed the renderTarget as well as renderer.setRenderTarget() - anselm
                    //scene.background = new THREE.Color( 1, 0, 0 );
                    renderer.vr.enabled = false; // Avoid camera modification and recursion
                    renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows
                    renderer.setRenderTarget( renderTarget )
                    renderer.setClearColor( 0xff00ff )
                    renderer.clear()
                    renderer.render( scene, virtualCamera, renderTarget )

                    // Restore
                    renderer.vr.enabled = currentVrEnabled
                    renderer.shadowMap.autoUpdate = currentShadowAutoUpdate
                    renderer.setRenderTarget( currentRenderTarget )
                }

                ////////////////////////////////////////////////////////////
                // Undo changes to scenes
                ////////////////////////////////////////////////////////////

                scene.visible = currentSceneVisible
                portalParentScene.visible = portalParentSceneVisible
                scene.remove(scope.somelight)
                scene.remove(scope.anotherlight)  

                // Restore viewport
                var bounds = camera.bounds;
                if ( bounds !== undefined ) {
                  renderer.getSize( size );
                  var pixelRatio = renderer.getPixelRatio();
                  viewport.x = bounds.x * size.width * pixelRatio;
                  viewport.y = bounds.y * size.height * pixelRatio;
                  viewport.z = bounds.z * size.width * pixelRatio;
                  viewport.w = bounds.w * size.height * pixelRatio;
                  renderer.state.viewport( viewport );
                }
                // allow this object to render with its mirror material now
                scope.visible = true;

            }

        }

        //
        // Attach a copy shader to the Reflector which makes the texture present as a material to threejs
        // (this is done prior to allowing users to use the reflector itself)
        //
      
        THREE.Reflector.prototype = Object.create( THREE.Mesh.prototype );
        THREE.Reflector.prototype.constructor = THREE.Reflector;
        THREE.Reflector.ReflectorShader = {
          uniforms: {
            'color': {type: 'c',value: null},
            'tDiffuse': {type: 't',value: null},
            'textureMatrix': {type: 'm4',value: null}
          },
          vertexShader: [
            'uniform mat4 textureMatrix;',
            'varying vec4 vUv;',
            'void main() {',
            '	vUv = textureMatrix * vec4( position, 1.0 );',
            '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
          ].join( '\n' ),
          fragmentShader: [
            'uniform vec3 color;',
            'uniform sampler2D tDiffuse;',
            'varying vec4 vUv;',
            'float blendOverlay( float base, float blend ) {',
            '	return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );',
            '}',
            'vec3 blendOverlay( vec3 base, vec3 blend ) {',
            '	return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );',
            '}',
            'void main() {',
            '	vec4 base = texture2DProj( tDiffuse, vUv );',
            '	gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );',
            '}'
          ].join( '\n' )
        }


      
      
        //////////////////////////////////////////////////////////////////////////////////
        // NORMAL START LOGIC
        /////////////////////////////////////////////////////////////////////////////////
      
        // find scene in question
        const scene = this.getThreeObjectById(this.properties.scene)
        if(!scene) {
          this.logger.error("no scene on portal")
          return
        }

        // manufacture a plane for the portal.
        // TODO arguably the caller could have made this in userland
        let width = this.properties.width || 4
        let height = this.properties.height || 4
        let color = this.properties.color || "white"
        var geometry = new THREE.PlaneBufferGeometry( width, height )
        let portal = this.portal = new THREE.Reflector( geometry, {
          scene:scene,
          clipBias: 0.003,
          textureWidth: 512,
          textureHeight: 512,
          color: color,
          recursion: 1
        } )
        e.target.add(portal)
 
    },
  
    tick: function(e) {
    },

})
