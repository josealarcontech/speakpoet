const { db } = require('../util/admin')

exports.getArt = async (request, response) => {
	try {
		const doc = await db.collection('art').doc(request.params.uid).get()
		const art = doc.data()
		const artFolder = await art.folder.get()
		art.folder = artFolder.data()
		art.folder.uid = art.folderId
		return response.json(art)
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error getting art' })
	}
}

exports.getFolderArt = async (request, response) => {
	try {
		const folder = {}
		let works = []
		const querySnapshot = await db.collection('art').where('folderId','==',request.params.uid).get()
		querySnapshot.forEach((doc) => {
			works.push({
				...doc.data(),
				uid: doc.id
			})
		})
		const fol = await db.collection('users').doc(request.user.uid).collection('folders').doc(request.params.uid).get()
		folder.works = works
		folder.info = fol.data()
		return response.json(folder)
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error getting folder art' })
	}
}

exports.editArt = async (request, response) => {
	try {
		let body = JSON.parse(request.body)
		const toUpdate = {
			name: body.name,
			lastEditDate: new Date().toISOString(),
			genre: body.genre,
			type: body.type,
			folder: db.collection('users').doc(request.user.uid).collection('folders').doc(body.folderId),
			folderId: body.folderId,
			content: body.content
		}
		delete toUpdate.folder.genre
		delete toUpdate.folder.type
		delete toUpdate.folder.uid
		delete toUpdate.genre.category
		delete toUpdate.type.category
		await db.collection('art').doc(request.params.uid).update(toUpdate)
		return response.json({ message: 'success' })
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error editing art' })
	}
}

exports.addArt = async (request, response) => {
	try {
		let body = JSON.parse(request.body)
		const toAdd = {
			name: body.name,
			lastEditDate: new Date().toISOString(),
			createdDate: new Date().toISOString(),
			ownerId: request.user.uid,
			public: false,
			genre: body.genre,
			type: body.type,
			folder: db.collection('users').doc(request.user.uid).collection('folders').doc(body.folder.uid),
			folderId: body.folder.uid,
			content: body.content
		}
		delete toAdd.folder.genre
		delete toAdd.folder.type
		delete toAdd.genre.category
		delete toAdd.type.category
		const docref = await db.collection('art').add(toAdd)
		return response.json( docref.id )
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error adding art' })
	}
}

exports.deleteArt = async (request, response) => {
	try {
		await db.collection('art').doc(request.params.uid).delete()
		return response.json({ message: 'success' })
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error deleting art' })
	}
}