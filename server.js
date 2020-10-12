const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: 123,
      name: 'Trevor',
      email: 'luper4@gmail.com',
      password: 'trev',
      entries: 0,
      joined: new Date(),
    },
    {
      id: 124,
      name: 'Kandace',
      email: 'kandace@gmail.com',
      password: '348',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.send(database.users);
});

//  Signin
app.post('/signin', (req, res) => {
  let found = false;
  database.users.forEach((user) => {
    if (req.body.email === user.email && req.body.password === user.password) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json('Error Logging in');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash);
  });
  if (email && password && name > '') {
    database.users.push({
      id: Math.floor(Math.random() * 10000000) + 1,
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date(),
    });
    res.json(database.users[database.users.length - 1]);
  } else {
    res.status(400).json('ERROR');
  }
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === Number(id)) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json('Not found');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json('Not found');
  }
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
});
