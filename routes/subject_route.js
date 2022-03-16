const express = require('express');
const SubjectController = require('../controllers/subject_controller');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/is_admin');

const router = new express.Router();

router.post('/subjects', auth, isAdmin, SubjectController.createSubject);

router.get('/subjects', SubjectController.getAllSubjects);

router.get('/subjects/:id', SubjectController.getSubject);

router.patch('/subjects/:id', auth, isAdmin, SubjectController.updateSubject);

router.delete('/subjects/:id', auth, isAdmin, SubjectController.deleteSubject);

module.exports = router;
