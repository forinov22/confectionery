/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username.
 *         password:
 *           type: string
 *           description: The user's password.
 *       example:
 *         username: john_doe
 *         password: secret_password
 * 
 * /api/auth/local:
 *   post:
 *     summary: Login with local credentials
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized - invalid credentials
 *
 * /api/auth/google:
 *   get:
 *     summary: Redirect to Google OAuth for authentication
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth login page
 *
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects on successful Google authentication
 *       401:
 *         description: Unauthorized - Google authentication failed
 */

const express = require('express');
const passport = require('passport');
const { loginLocal, googleAuth, googleAuthCallback, getUserSession } = require('../controllers/authController');

const router = express.Router();

router.get('/session', getUserSession)

router.post('/local', loginLocal);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), googleAuth);

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api/auth/login' }), googleAuthCallback);

router.get('/login', (req, res) => {
    // console.log(req)
    const errorMessage = req.session.messages ? req.session.messages[0] : 'Google authentication failed: Unknown error';
    res.status(401).send(`Login failed: ${errorMessage}`);
});

module.exports = router;
