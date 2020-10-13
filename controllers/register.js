const handleRegister = (db, bcrypt) => (req, res) => {
	const { email, name, password } = req.body;
	if (email && name && password > '') {
		const hash = bcrypt.hashSync(password);
		db.transaction((trx) => {
			trx.insert({
				hash: hash,
				email: email
			})
				.into('login')
				.returning('email')
				.then((loginemail) => {
					return trx('users')
						.returning('*')
						.insert({
							email: loginemail[0],
							name: name,
							joined: new Date()
						})
						.then((user) => {
							res.json(user[0]);
						})
						.then(trx.commit)
						.catch(trx.rollback);
				});
		}).catch((err) => res.status(400).json('Unable to register'));
	} else {
		res.status(400).json('Invalid Details');
	}
};

module.exports = {
	handleRegister: handleRegister
};
