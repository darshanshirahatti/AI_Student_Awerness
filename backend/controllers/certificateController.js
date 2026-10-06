const Certificate = require('../models/Certificate');

// @desc    Get all certificates for a user
// @route   GET /api/certificates
// @access  Private
exports.getCertificates = async (req, res, next) => {
    try {
        const certs = await Certificate.find({ userId: req.user._id }).sort({ issuedAt: -1 });
        res.json({ success: true, data: certs });
    } catch (error) {
        next(error);
    }
};

// @desc    Get specific certificate by ID
// @route   GET /api/certificates/:id
// @access  Public
exports.getCertificateById = async (req, res, next) => {
    try {
        const cert = await Certificate.findOne({ certificateId: req.params.id });
        if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
        res.json({ success: true, data: cert });
    } catch (error) {
        next(error);
    }
};

exports.verifyCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
            .select('studentName score percentage grade issuedAt certificateId issuedBy verificationUrl')
            .lean();
        if (!certificate) return res.json({ success: true, valid: false, certificate: null });
        res.json({
            success: true,
            valid: true,
            certificate: {
                studentName: certificate.studentName,
                score: certificate.score,
                percentage: certificate.percentage,
                grade: certificate.grade,
                date: certificate.issuedAt,
                certificateId: certificate.certificateId,
                issuedBy: certificate.issuedBy,
                verificationUrl: certificate.verificationUrl
            }
        });
    } catch (error) {
        next(error);
    }
};
