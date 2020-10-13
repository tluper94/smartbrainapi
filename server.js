const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '348q5oET',
    database : 'smart-brain'
  }
})

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
});

//  Signin
app.post('/signin', (req, res) => {
  const {email, password} = req.body;
  if(email && password > '') {
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if(isValid){
        db.select('*').from('users')
        .where('email', '=', email)
        .then(user => {
          res.json(user[0]);
        })
        .catch(err => res.status(400).json('Unable to get user'));
      }else{
        res.status(400).json('Incorrect email or password');
      }
    })
    .catch(err => res.status(400).json('Incorrect email or password'));
  }else{
    res.status(400).json('Incorrect email or password');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  if(email&& name&& password > ''){
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginemail =>{
      return trx('users')
      .returning('*')
      .insert({
        email: loginemail[0],
        name: name,
         joined: new Date()
      })
      .then(user => {
          res.json(user[0]);
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
    })
    .catch(err => res.status(400).json('Unable to register'))
  }else{
    res.status(400).json('Invalid Details');
  }
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
  .then(user => {
    if(user.length){
      res.json(user[0])
    }else{
      res.status(400).json('Not Found');
    }
  })
  .catch(err => res.status(400).json('Error getting profile'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries);
  })
  .catch(err => res.status(400).json('Unable to get entries'));
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
});
