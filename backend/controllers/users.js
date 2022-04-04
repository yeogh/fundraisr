const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const fetchedUsers = await User
    .find({})

  response.json(fetchedUsers);
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User
    .findById(request.params.id)
  
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password.length < 5) {
    return response.status(400).json({ error: "Minimum password length of 5 required"})
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    name: body.name,
    email: body.email,
    passwordHash,
    createdOn: new Date().toISOString() // create and turn into string
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

//edit details of user (not password)
usersRouter.put('/edit/:id', async (request, response) => {
  const body = request.body;
  const updatedUser = await User
    .findByIdAndUpdate(request.params.id, body, {new: true})

  if (updatedUser) {
    response.json(updatedUser)
  } else {
    response.status(404).end()
  }
})

usersRouter.put('/edit/password/:id', async (request, response) => {
  const password = request.body.password;
  if (password.length < 5) {
    return response.status(400).json({ error: "Minimum password length of 5 required"})
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const updatedUser = await User
    .findByIdAndUpdate(request.params.id, {passwordHash}, {new: true})
  
  if (updatedUser) {
    response.json(updatedUser)
  } else {
    response.status(404).end()
  }
})

usersRouter.delete('/:id', async (request, response) => {
  const deletedUser = await User.findByIdAndRemove(request.params.id);

  response.status(204).end()
})

module.exports = usersRouter