const FBAuth = require('./util/fbAuth')
const functions = require('firebase-functions')
const app = require('express')()
const cors = require('cors')
app.use(cors())

const { getAllTags } = require('./handlers/tags')
const { createUser, loginUser, editUser, getUser, uploadImage, checkForAlias } = require('./handlers/users') 
const { getArt, editArt, addArt, getFolderArt, deleteArt } = require('./handlers/art')
const { getAllFolders, editFolder, addFolder, deleteFolder } = require('./handlers/folders')
const { dictApi, thesApi, randApi } = require('./handlers/tools')

app.get('/tags', FBAuth, getAllTags)

app.post('/signup', createUser)
app.post('/login', loginUser)
app.put('/user', FBAuth, editUser)
app.get('/user', FBAuth, getUser)
app.get('/alias/:handle', checkForAlias)

app.post('/profile', FBAuth, uploadImage)

app.get('/folders', FBAuth, getAllFolders)
app.put('/folders', FBAuth, editFolder)
app.post('/folders', FBAuth, addFolder)
app.delete('/folders/:uid', FBAuth, deleteFolder)

app.get('/art/:uid', FBAuth, getArt)
app.get('/folder_art/:uid', FBAuth, getFolderArt)
app.put('/art/:uid', FBAuth, editArt)
app.post('/art', FBAuth,  addArt)
app.delete('/art/:uid', FBAuth, deleteArt)

app.get('/tools/dict/:word', FBAuth, dictApi)
app.get('/tools/thes/:word', FBAuth, thesApi)
app.get('/tools/rand', FBAuth, randApi)


exports.api = functions.https.onRequest(app)
