MrEd: the Mixed Reality EDitor

to get started open the `show` menu above and choose `in a new window`.  This will open a new browser window/tab with
a page that just says 'edit'. Click on the edit link to get started.  

Now you can add new objects to your scene, attach behaviors, and preview your work in VR and AR.



=======

If you are viewing this file on Github and want to use it in Glitch, follow these steps.  

* click the `clone or download` button above and copy the https repo link into the clipboard.
* Go to Glitch.com and log in.
* create a new project. In the new project dropdown menu choose `Clone from git repo` then paste in the URL.
* Glitch will clone the repo and automatically install some of the required dependencies.  
* Open the glitch console and run `git submodule init` and `git submodule update` to fetch the appropriate version of the editor build
* Create a .env file at the top level, and add a password with the line `PASSWORD=mypassword`
* Your project is now set up.
* You can now create new documents, new behaviors, and upload assets. Once you are done anyone else can remix this
Glitch to use as a starting point.



To make updates to the `mred` and update this repo with the newer build of the editor follow these steps:

* Check out the `mred` repo in a new directory
* Install deps and build it
  * `npm install`
  *  _make changes_
  * `npm run build`
* Push the changes to `mred` back to github.
* Go to the Glitch console at update from the mred repository with `git submodule update --remote`.  Note, that you can change the submodule to point at a branch in the mred repository, or a fork of your own.  See [the git cookbook page on submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) for examples of using submodules effectively.

Alternatively
* Create a new Glitch from the repo following the instructions in the previous section
