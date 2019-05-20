// server.js
// where your node app starts


// init project
const express = require('express');
const fs = require('fs');
const paths = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const dir = 'docs';
const scripts_dir = 'scripts';

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));


console.log("the domains is", process.env.PROJECT_DOMAIN)

function parseId(req) {
    //strip out non-alphanumeric characters for safety
    return req.params.id.replace(/\W/g, '_')
}

function docPath(id) {
    return paths.join(__dirname, dir, id + '.json')
}

app.get("/info", (req,res) => {
    res.json({
        assetUpload:false,
        authentication:true,
        scriptEditing:true,
        passwordSupported:true,
        docDeleteSupported:true,
    })
})

const OWNER_USER = {
    username:'some-username'
}

function checkAuth(req,res,next) {
    if(req.query.password && req.query.password === process.env.PASSWORD) {
        const token=req.query.password
        req.username = OWNER_USER.username
        return next()
    }
    if(req.headers['access-key'] && req.headers['access-key'] === process.env.PASSWORD) {
        req.user = OWNER_USER
        req.username = OWNER_USER.username
        return next()
    }

    return res.json({success:false,message:'invalid access token, cannot find user'})
}

app.get("/userinfo", checkAuth, (req,res) => {
    res.json({
        success:true,
        username:req.username,
    })
})

function loadDocInfo(fname) {
    const fpath = paths.join(__dirname,dir,fname)
    const id = fname.substring(0,fname.length-'.json'.length)
    return new Promise((res,rej) => {
        fs.readFile(fpath,(e,contents) => {
            if(e) return rej(e)
            const content = JSON.parse(contents.toString())
            res({
                id:id,
                title:content.title
            })
        })
    })
}

function getDocList(cb) {
    return new Promise((res,rej) => {
        fs.readdir(paths.join(__dirname, dir),(e,files)=> {
            if (e) return rej(e)
            res(files)
        })
    }).then(files => {
        return Promise.all(files.map(name => loadDocInfo(name)))
    })
}

app.get('/doc/list',(req,res) => {
    getDocList().then(list => res.json(list))
})

app.get("/doc/:id", (req, res) => {
    const id = parseId(req)
    const pth = docPath(id)
    res.sendFile(pth)
})

function saveDoc(id,body) {
    console.log(`saving ${body.title}`)
    const data = JSON.stringify(body, null, '    ');
    return new Promise((res,rej) => {
        fs.writeFile(docPath(id),data,(err)=>{
            if(err) return rej(err)
            return res(id)
        })
    })
}

app.post("/doc/:id",checkAuth, (req, res) => {
    const id = parseId(req)
    saveDoc(id,req.body)
        .then(()=> res.json({success:true,message:"saved it!"}))
        .catch((e) =>  res.json({success:false,message:"could not save"}))
})

function deleteDoc(id) {
    return new Promise((res,rej)=>{
        const pth = docPath(id)
        console.log("deleting",id,pth)
        fs.unlink(pth,(err)=>{
            if(err) return rej(err)
            return res(id)
        })
    })
}
app.post('/doc/delete/:id', checkAuth, (req,res)=>{
    deleteDoc(parseId(req))
        .then(()=>res.json({success:true, script:id, message:'deleted'}))
        .catch((e)=> res.json({success:false, message:e}))
})


function supportedMimetype(type,name) {
    console.log('checking mimetype type',type,name)

    if(type === 'image/png') return true
    if(type === 'image/jpeg') return true
    if(type === 'image/gif') return true

    if(type === 'audio/mpeg') return true
    if(type === 'audio/aac') return true
    if(type === 'audio/wav') return true
    if(type === 'audio/x-wav') return true

    if(type === 'video/mp4') return true
    if(type === 'model/gltf-binary') return true
    return false
}

function fixMimetype(type, name) {
    if(name.toLowerCase().endsWith('.glb')) {
        console.log("setting .glb to model/gltf-binary")
        return 'model/gltf-binary'
    }
    return type
}
function listAssets() {
    return new Promise((res,rej)=>{
        fs.readFile(paths.join(process.cwd(),'.glitch-assets'),(err,buffer)=>{
            if(err) return rej(err)
            let assetsStr = buffer.toString()
            const assets = assetsStr
                .split("\n")
                .filter(str => str.trim().length > 0)
                .map(e => JSON.parse(e))
                .filter(e => !e.deleted)
            res(assets)
        })
        // let assetsStr = (fs.readFile(paths.join(process.cwd(),'.glitch-assets')).toString())
    })
}
app.get('/asset/list',(req,res) => {
    listAssets().then(assets => {
        assets = assets
            .map(el => {
                return {
                    kind:'asset',
                    id:el.uuid,
                    url:el.url,
                    mimeType:fixMimetype(el.type,el.name),
                    title:el.name,
                }
            })
            .filter(e => supportedMimetype(e.mimeType, e.title))
        console.log("final assets list", assets)
        res.json(assets)
    }).catch(()=>{
        console.log("problem loading assets. file missing? returning empty list")
        res.json([])
    })
})


function parseScriptMetadata(fpath) {
    return new Promise((res,rej) => {
        fs.readFile(fpath,(err,data)=>{
            const meta = {
                title:null,
                description:null,
            }
            if(!data) return res(meta)
            const contents = data.toString()
            //console.log("scanning",contents)
            const title = contents.match(/\#title(.*)/)
            //console.log("match",title)
            if(title) meta.title = title[1]
            const desc = contents.match(/\#description(.*)/)
            //console.log("match",desc)
            if(desc) meta.description = desc[1]
            res(meta)
        })
    })
}

function listScripts() {
    return new Promise((res,rej)=>{
        fs.readdir(paths.join(__dirname, scripts_dir),(e,files)=> {
            if(e) return rej(e)
            res(files)
        })
    })
}

app.get('/scripts/list',(req,res) => {
    listScripts()
        .then((files)=>{
            console.log("the project domain is",process.env.PROJECT_DOMAIN)
            Promise.all(files.map(fileName =>  {
                const fpath = paths.join(__dirname, scripts_dir,fileName)
                return parseScriptMetadata(fpath).then(meta => {
                    meta.name = fileName
                    meta.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me/scripts/${fileName}`
                    return meta
                })
        })).then(outs => {
            res.json(outs)
        }).catch(e => {
            return res.json({success:false})
        })
    })
})

app.get("/scripts/:id", (req, res) => {
    res.sendFile(paths.join(__dirname,scripts_dir,req.params.id))
})

function deleteScript(name) {
    const filePath = paths.join(__dirname,scripts_dir,name)
    return new Promise((res,rej)=>{
        console.log("deleting",filePath)
        fs.unlink(filePath,(err)=>{
            if(err) return rej(err)
            return res(name)
        })
    })
}
app.post('/scripts/delete/:name', checkAuth, (req,res)=>{
    deleteScript(req.params.name)
        .then(()=>{
            res.json({success:true, script:req.params.name, message:'deleted'})
        })
        .catch(e => res.json({success:false, message:e.message}))
})

function saveScript(name,req) {
    const filePath = paths.join(__dirname,scripts_dir,name)
    return new Promise((res,rej)=>{
        const file = fs.createWriteStream(filePath)
        req.on('data',(chunk) => file.write(chunk))
        req.on('end', () => {
            file.end()
            parseScriptMetadata(filePath).then((info)=>{
                res(info)
            })
        })
        req.on('error',(e)=>{
            rej(e)
        })
    })
}
app.post('/scripts/:name',checkAuth, (req,res)=>{
    saveScript(req.params.name,req)
        .then((script)=>res.json({success:true, script:script, message:'saved'}))
        .catch(e => res.json({success:false, message:e.message}))
})


// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
    getDocList().then(docs=>{
        const list = docs.map(doc => {
            return `
      <li>
          ${doc.title}
        <a class='edit'
href="./.build/?SERVER_URL=${process.env.PROJECT_DOMAIN}.glitch.me&mode=edit&doc=${doc.id}">
          edit
        </a>
        <a class='view'
href="./.build/?SERVER_URL=${process.env.PROJECT_DOMAIN}.glitch.me&mode=vrview&doc=${doc.id}">
          view
        </a>
      </li>
    `
        })
        response.send(`<html>
<head>
 <link rel='stylesheet' href="./frontpage.css">
</head>
<body>
<a href="./.build/?SERVER_URL=${process.env.PROJECT_DOMAIN}.glitch.me&mode=edit">make new project</a>
<h3>existing projects</h3>
<ul>
${list.join("")}
</ul>
</body>
<script>
if(navigator.xr) {
  document.body.classList.add('xrviewer')
}
</script>
</html>
`)
    })
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
