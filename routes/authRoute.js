const express = require('express');
const { login, register, updateUser, getUsers, deleteUser } = require('../controllers/auth')
const authMiddleWare = require('../middleware/authMiddleware')
const testUser = require('../middleware/testUser')

const router = express.Router();

router.post('/login', login)
router.post('/register', register)
router.patch('/updateUser', authMiddleWare, testUser, updateUser)
router.get('/users', getUsers)
router.delete('/users/:id', deleteUser)

module.exports = router;