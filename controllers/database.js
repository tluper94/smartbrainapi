const knex = require('knex');

const db = knex({
	client: 'pg',
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

module.exports = {
	db: db
};
