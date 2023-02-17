const { db } = require('../util/admin')

exports.getAllTags = async (request, response) => {
	try {
		let types = []
		const querySnapshot = await db.collection('tags').get()
		querySnapshot.forEach((doc) => {
			types.push({
				...doc.data(),
				uid: doc.id
			})
		})
		return response.json(types)
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error getting all tags' })
	}
}  