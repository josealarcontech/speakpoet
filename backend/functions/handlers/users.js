const { db, admin } = require('../util/admin')
const config = require('./../util/config')
const firebase = require('firebase/app')
firebase.initializeApp(config)
require('firebase/auth')
const noImg = 'no-img.png'

exports.createUser = async (request, response) => {
	const baseURL = process.env.FUNCTIONS_EMULATOR ? 'http://127.0.0.1:9199' : 'https://firebasestorage.googleapis.com' // eslint-disable-line no-undef
	try {
		const body = JSON.parse(request.body)
		const newUser = {
			email: body.email,
			name: body.name,
			lastname:body.lastname,
			imageUrl: `${baseURL}/v0/b/${config.storageBucket}/o/${noImg}?alt=media&token=943e8f51-ca3f-44d8-bec8-6a5733ebc18c`,
			createdDate: new Date().toISOString(),
			alias: body.alias
		}
		
		const userId = body.uid
		await db.collection('users').doc(userId).set(newUser)
		let uncategorizedGenre, uncategorizedType
		const querySnapshot = await db.collection('tags').where('name', '==', 'Uncategorized').get()
		querySnapshot.forEach((doc) => {
			let data = {...doc.data(), uid: doc.id}
			data.category === 'genre' ? uncategorizedGenre = data : uncategorizedType = data
		})
		await db.collection('users').doc(userId).collection('folders').add({
			name: 'My Art',
			genre: {...uncategorizedGenre},
			type: {...uncategorizedType}
		})
		return response.status(201).json({ 
			imageUrl: newUser.imageUrl,
			alias: body.alias,
			email: body.email
		})
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error creating user' })
	}
}

exports.loginUser = async (request, response) => {
	try {
		const body = JSON.parse(request.body)
		const userId = body.uid
		const doc = await db.collection('users').doc(userId).get()
		const user = doc.data()
		return response.json({ 
			imageUrl: user.imageUrl,
			alias: user.alias,
			email: user.email
		})
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error logging in user' })
	}
}

exports.editUser = async (request, response) => {
	try {
		const body = JSON.parse(request.body)
		await db.collection('users').doc(request.user.user_id).update({
			name: body.name,
			lastname: body.lastname
		})
		return response.json({ message: 'success' })
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error editing user' })
	}
}

exports.getUser = async (request, response) => {
	try {
		const doc = await db.collection('users').doc(request.user.user_id).get()
		return response.json(doc.data())
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error getting user' })
	}
}

exports.checkForAlias = async (request, response) => {
	try {
		const querySnapshot = await db.collection('users').where('alias','==',request.params.handle).get()
		return response.json({ aliasFound: !querySnapshot.empty })
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error locating alias' })
	}
}

exports.uploadImage = (req, res) => {
	const path = require('path')
	const os = require('os')
	const fs = require('fs')
	const busboy = require('busboy')
	const { v4: uuidv4 } = require('uuid')
	const bb = busboy({ headers: req.headers })

	let imageToBeUploaded = {}
	let imageFileName
	// String for image token
	let generatedToken = uuidv4()

	bb.on('file', (name, file, info) => {
		const { filename, encoding, mimeType } = info // eslint-disable-line no-unused-vars
		if (mimeType !== 'image/jpeg' && mimeType !== 'image/png' && mimeType !== 'image/jpg') {
			return res.status(400).json({ error: 'Wrong file type submitted' })
		}
		// my.image.png => ['my', 'image', 'png']
		const imageExtension = filename.split('.')[filename.split('.').length - 1]
		// 32756238461724837.png
		imageFileName = `${Math.round(
			Math.random() * 1000000000000
		).toString()}.${imageExtension}`
		const filepath = path.join(os.tmpdir(), imageFileName)
		imageToBeUploaded = { filepath, mimeType }
		file.pipe(fs.createWriteStream(filepath))
	})
	bb.on('close', async () => {
		try {
			await admin.storage().bucket().upload(imageToBeUploaded.filepath, {
				resumable: false,
				metadata: {
					metadata: {
						contentType: imageToBeUploaded.mimeType,
						//Generate token to be appended to imageUrl
						firebaseStorageDownloadTokens: generatedToken,
					},
				},
			})
			const doc = await db.doc(`/users/${req.user.user_id}`).get()
			const data = doc.data()
			if(!data.imageUrl.includes('no-img.png')) await admin.storage().bucket().file(data.profileFilename).delete()
			const baseURL = process.env.FUNCTIONS_EMULATOR ? 'http://127.0.0.1:9199' : 'https://firebasestorage.googleapis.com' // eslint-disable-line no-undef
			// UNCOMMENT FOR BETTER STORAGE RULES
			const imageUrl = `${baseURL}/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}` 
			// const imageUrl = `${baseURL}/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
			await db.doc(`/users/${req.user.user_id}`).update({
				imageUrl: imageUrl,
				profileFilename: imageFileName
			})
			return res.json({ imageUrl })
		} catch (error) {
			console.error(error)
			return res.status(500).json({ message: 'Error uploading profile image' })
		}			
	})
	bb.end(req.rawBody)
}