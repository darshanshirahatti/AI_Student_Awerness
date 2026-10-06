const express = require('express');
const router = express.Router();
const { getCertificates, getCertificateById, verifyCertificate } = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCertificates);
router.get('/verify/:certificateId', verifyCertificate);
router.get('/:id', getCertificateById);

module.exports = router;
