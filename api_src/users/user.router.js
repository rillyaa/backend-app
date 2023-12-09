// const { Router } = require('express');
const {
  createUser,
  getUserByID,
  getUsers,
  updateUser,
  deleteUser,
  login
} = require('../users/user.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/token_validation')

router.get('/users', checkToken, getUsers); // getalluser
router.get('/users/:id', checkToken, getUserByID);
router.patch('/users/update/:id', checkToken, updateUser);
router.delete('/users/delete/:id', checkToken, deleteUser);

router.post('/register', createUser);
router.post('/login', login);

module.exports = router;
