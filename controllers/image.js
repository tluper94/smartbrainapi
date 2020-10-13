const Clarifai = require('clarifai');

const app = new Clarifai.App({
	apiKey: '4a863d5a12c547b0b5a7514674726bd7'
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => res.status(400).json('Invalid image'));
};

const handleImage = (db) => (req, res) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => {
			res.json(entries);
		})
		.catch((err) => res.status(400).json('Unable to get entries'));
};

module.exports = {
	handleImage,
	handleApiCall
};
