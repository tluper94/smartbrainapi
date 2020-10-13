const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

//Contollers imports
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const { db } = require('./controllers/database');
// Init  Express
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.json('It is working');
});
//  Handles signin requests
app.post('/signin', signin.handleSignin(db, bcrypt));
//Handles register requests
app.post('/register', register.handleRegister(db, bcrypt));
//Handles user profile requests
app.get('/profile/:id', profile.getUserProfile(db));
//Handles user image submits
app.put('/image', image.handleImage(db));
app.post('/imageurl', image.handleApiCall);
// Sets server to port 3000
app.listen(process.env.PORT || 3000, () => {
	console.log(`App is running on port 3000 ${process.env.PORT}`);
});
