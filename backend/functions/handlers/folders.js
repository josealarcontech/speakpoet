const { db } = require('../util/admin')

exports.getAllFolders = async (request, response) => {
	try {
		let folders = []
		const querySnapshot = await db.collection('users').doc(request.user.uid).collection('folders').get()
		querySnapshot.forEach((doc) => {
			folders.push({...doc.data(), uid: doc.id})
		})
		return response.json(folders)
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error getting folders' })
	}
}

exports.addFolder = async (request, response) => {
	try {
		const body = JSON.parse(request.body)
		await db.collection('users').doc(request.user.uid).collection('folders').add(body)
		return response.json({ message: 'success' })
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error adding folder' })
	}
}

exports.editFolder = async (request, response) => {
	try {
		let body = JSON.parse(request.body)
		const uid = body.uid
		const toUpdate = {
			name: body.name,
			genre: body.genre,
			type: body.type
		}
		await db.collection('users').doc(request.user.user_id).collection('folders').doc(uid).update(toUpdate)
		return response.json({ message: 'success' })
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error editing folder' })
	}
}

exports.deleteFolder = async (request, response) => {
	try {
		const batch = db.batch()
		const querySnapshot = await db.collection('art').where('folderId','==',request.params.uid).get()
		querySnapshot.docs.forEach((doc) => {
			batch.delete(doc.ref)
		})
		await batch.commit()
		await db.collection('users').doc(request.user.uid).collection('folders').doc(request.params.uid).delete()
		return response.json({ message: 'success' })
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error deleting folder' })
	}
}