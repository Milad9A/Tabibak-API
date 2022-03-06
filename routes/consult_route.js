const express = require('express')
const ConsultController = require('../controllers/consult_controller')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/is_admin')

const router = new express.Router()

router.post('/consults', auth, ConsultController.cerateConsult)

router.get('/consults', auth, isAdmin, ConsultController.getAllConsults)

router.get('/consults/me', auth, ConsultController.getMyConsults)

router.get('/consults/:id', auth, ConsultController.getConsult)

router.delete('/consults/:id', auth, ConsultController.deleteConsult)

module.exports = router
