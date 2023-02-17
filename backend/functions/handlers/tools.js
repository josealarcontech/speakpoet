const axios = require('axios')

exports.dictApi = async (request, response) => {
	const config = {
		headers:{
			'X-Api-Key': `${process.env.NET_NINJA_API_KEY}` // eslint-disable-line no-undef
		}
	}
	const url = 'https://api.api-ninjas.com/v1/dictionary?word=' + request.params.word
	try {
		const res = await axios.get(url, config)
		return response.json(res.data)
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error using tool' })
	}
}

exports.thesApi = async (request, response) => {
	const config = {
		headers:{
			'X-Api-Key': `${process.env.NET_NINJA_API_KEY}` // eslint-disable-line no-undef
		}
	}
	const url = 'https://api.api-ninjas.com/v1/thesaurus?word=' + request.params.word
	try {
		const res = await axios.get(url, config)
		return response.json(res.data)
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error using tool' })
	}
}

exports.randApi = async (request, response) => {
	const config = {
		headers:{
			'X-Api-Key': `${process.env.NET_NINJA_API_KEY}` // eslint-disable-line no-undef
		}
	}
	const url = 'https://api.api-ninjas.com/v1/randomword'
	try {
		const res = await axios.get(url, config)
		return response.json(res.data.word)
	} catch (error) {
		console.error(error)
		return response.status(500).json({ message: 'Error using tool' })
	}
}