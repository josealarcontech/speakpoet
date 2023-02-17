const { admin } = require('./admin')

module.exports = async (request, response, next) => {
	let idToken
	if(request.headers.authorization && request.headers.authorization.startsWith('Bearer ')){
		idToken = request.headers.authorization.split('Bearer ')[1]
	} else {
		console.error('Incorrect token format')
		return response.status(403).json({ error: 'Unauthorized' })
	}
	try {
		const decodedToken =  await admin.auth().verifyIdToken(idToken)
		request.user = decodedToken
		return next()
	} catch (error) {
		console.error('Error while verifying token', error)
		return response.status(403).json({ message: 'Unauthorized' })
	}
}