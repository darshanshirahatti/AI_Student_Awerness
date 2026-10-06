const User = require('../models/User');

exports.saveSafetyScore = async (req, res, next) => {
    try {
        const score = Number(req.body.score);
        if (!Number.isInteger(score) || score < 0 || score > 100) {
            return res.status(400).json({ success: false, message: 'Safety score must be a whole number from 0 to 100.' });
        }
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { safetyScore: score } },
            { new: true, runValidators: true }
        ).select('safetyScore');
        if (!user) return res.status(404).json({ success: false, message: 'Student profile not found.' });
        res.json({ success: true, data: { safetyScore: user.safetyScore } });
    } catch (error) {
        next(error);
    }
};
