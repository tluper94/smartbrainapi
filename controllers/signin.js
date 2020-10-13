const handleSignin = (db, bcrypt) => (req, res) => {
	const { email, password } = req.body;
	if (email && password > '') {
		db.select('email', 'hash')
			.from('login')
			.where('email', '=', email)
			.then((data) => {
				const isValid = bcrypt.compareSync(password, data[0].hash);
				if (isValid) {
					db.select('*')
						.from('users')
						.where('email', '=', email)
						.then((user) => {
							res.json(user[0]);
						})
						.catch((err) => res.status(400).json('Unable to get user'));
				} else {
					res.status(400).json('Incorrect email or password');
				}
			})
			.catch((err) => res.status(400).json('Incorrect email or password'));
	} else {
		res.status(400).json('Incorrect email or password');
	}
};

module.exports = {
	handleSignin: handleSignin
};