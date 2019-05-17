MrEd: the Mixed Reality EDitor

to get started open the `show` menu above and choose `in a new window`.  This will open a new browser window/tab with
a page that just says 'edit'. Click on the edit link to get started.  

Now you can add new objects to your scene, attach behaviors, and preview your work in VR and AR.



=======

If you are viewing this file on Github and want to use it in Glitch, follow these steps.  

* click the `clone or download` button above and copy the https repo link into the clipboard.
* Go to Glitch.com and log in.
* create a new project. In the new project dropdown menu choose `Clone from git repo` then paste in the URL.
* Glitch will clone the repo and automatically install the required dependencies.  Your project is now set up.
* You can now create new documents, new behaviors, and upload assets. Once you are done anyone else can remix this
Glitch to use as a starting point.



To update this repo with a newer build of the editor follow these steps:

* Check out the `general-editor` repo in a new directory
* Install deps and build it
  * `npm install`
  * `npm run build`
* Copy the built files to the `public/.build` directory in this repo. Notice the period before build. This makes 
the generated editor files be hidden in Glitch.
* Push the changes back to github. 
* Create a new Glitch from the repo following the instructions in the previous section


