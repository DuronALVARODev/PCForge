const { deleteUserAccount } = require("../services/auth.service");
/**
 * Controlador para eliminar la cuenta de usuario
 */
const deleteAccount = async (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logSecurityEvent('DELETE_ACCOUNT_VALIDATION_ERROR', req.user?.id, clientIP, { userAgent, errors: errors.array() });
        return res.status(400).json({ message: 'Datos inválidos', errors: errors.array(), code: 'DELETE_ACCOUNT_VALIDATION_ERROR' });
    }
    try {
        let { password } = req.body;
        password = xss(password);
        await deleteUserAccount(req.user.id, password);
        logSecurityEvent('DELETE_ACCOUNT_SUCCESS', req.user?.id, clientIP, { userAgent });
        // Limpiar cookies
        const isProd = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProd ? true : false,
            sameSite: isProd ? 'Strict' : 'Lax',
            path: '/',
            domain: isProd ? process.env.COOKIE_DOMAIN : undefined
        };
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);
        res.status(200).json({ message: 'Cuenta eliminada exitosamente', code: 'DELETE_ACCOUNT_SUCCESS' });
    } catch (err) {
        logSecurityEvent('DELETE_ACCOUNT_ERROR', req.user?.id, clientIP, { userAgent, error: err.message });
        if (err.message === 'INCORRECT_PASSWORD') {
            return res.status(401).json({ message: 'La contraseña es incorrecta', code: 'DELETE_ACCOUNT_INCORRECT_PASSWORD' });
        }
        res.status(500).json({ message: 'Error interno del servidor', code: 'DELETE_ACCOUNT_INTERNAL_ERROR' });
    }
};
const { registerUser, changeUserPassword } = require ("../services/auth.service");
const { isValidEmail, isStrongPassword, isValidUsername, sanitizeInput } = require("../utils/validateInput");
const { loginUser } = require("../services/auth.service");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validationResult } = require('express-validator');
const xss = require('xss');
const { logSecurityEvent } = require("../utils/securityLog");

/**
 * Controlador para cambio de contraseña
 */
const changePassword = async (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logSecurityEvent('CHANGE_PASSWORD_VALIDATION_ERROR', req.user?.id, clientIP, { userAgent, errors: errors.array() });
        return res.status(400).json({ message: 'Datos inválidos', errors: errors.array(), code: 'CHANGE_PASSWORD_VALIDATION_ERROR' });
    }
    try {
        let { currentPassword, newPassword, confirmPassword } = req.body;
        currentPassword = xss(currentPassword);
        newPassword = xss(newPassword);
        confirmPassword = xss(confirmPassword);
        if (newPassword !== confirmPassword) {
            logSecurityEvent('CHANGE_PASSWORD_MISMATCH', req.user?.id, clientIP, { userAgent });
            return res.status(400).json({ message: 'Las contraseñas no coinciden', code: 'CHANGE_PASSWORD_MISMATCH' });
        }
        if (!isStrongPassword(newPassword)) {
            logSecurityEvent('CHANGE_PASSWORD_WEAK', req.user?.id, clientIP, { userAgent });
            return res.status(400).json({ message: 'La nueva contraseña no es lo suficientemente segura', code: 'CHANGE_PASSWORD_WEAK' });
        }
        await changeUserPassword(req.user.id, currentPassword, newPassword);
        logSecurityEvent('CHANGE_PASSWORD_SUCCESS', req.user?.id, clientIP, { userAgent });
        res.status(200).json({ message: 'Contraseña cambiada exitosamente', code: 'CHANGE_PASSWORD_SUCCESS' });
    } catch (err) {
        logSecurityEvent('CHANGE_PASSWORD_ERROR', req.user?.id, clientIP, { userAgent, error: err.message });
        if (err.message === 'INCORRECT_PASSWORD') {
            return res.status(401).json({ message: 'La contraseña actual es incorrecta', code: 'CHANGE_PASSWORD_INCORRECT' });
        }
        res.status(500).json({ message: 'Error interno del servidor', code: 'CHANGE_PASSWORD_INTERNAL_ERROR' });
    }
};



/**
 * Controlador de registro de usuario
 */
const register = async (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    // Validar errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logSecurityEvent('REGISTER_VALIDATION_ERROR', null, clientIP, { userAgent, errors: errors.array() });
        return res.status(400).json({ message: "Datos inválidos", errors: errors.array(), code: 'REGISTER_VALIDATION_ERROR' });
    }
    try {
        // Sanitizar y limpiar entrada
        let { email, username, password, confirmPassword } = req.body;
        email = xss(sanitizeInput(email)).toLowerCase();
        username = xss(sanitizeInput(username));
        // No sanitizar password, pero sí limpiar XSS
        password = xss(password);
        confirmPassword = xss(confirmPassword);

        // Validaciones adicionales personalizadas
        if (!isValidEmail(email)) {
            logSecurityEvent('REGISTER_INVALID_EMAIL', null, clientIP, { userAgent, email });
            return res.status(400).json({ message: "Formato de email inválido", code: 'REGISTER_INVALID_EMAIL' });
        }
        if (!isValidUsername(username)) {
            logSecurityEvent('REGISTER_INVALID_USERNAME', null, clientIP, { userAgent, username });
            return res.status(400).json({ message: "Nombre de usuario inválido. Debe tener entre 3 y 30 caracteres, solo letras, números, guiones y guiones bajos", code: 'REGISTER_INVALID_USERNAME' });
        }
        if (!isStrongPassword(password)) {
            logSecurityEvent('REGISTER_WEAK_PASSWORD', null, clientIP, { userAgent });
            return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial", code: 'REGISTER_WEAK_PASSWORD' });
        }
        if (password !== confirmPassword) {
            logSecurityEvent('REGISTER_PASSWORD_MISMATCH', null, clientIP, { userAgent });
            return res.status(400).json({ message: "Las contraseñas no coinciden", code: 'REGISTER_PASSWORD_MISMATCH' });
        }
        if (password.length > 128) {
            logSecurityEvent('REGISTER_PASSWORD_TOO_LONG', null, clientIP, { userAgent });
            return res.status(400).json({ message: "La contraseña es demasiado larga", code: 'REGISTER_PASSWORD_TOO_LONG' });
        }
        // Registrar usuario
        const user = await registerUser(email, username, password);
        logSecurityEvent('REGISTER_SUCCESS', user.id, clientIP, { userAgent, email });
        res.status(201).json({ message: "Usuario registrado correctamente. Revisa tu correo electrónico para verificar la cuenta.", userId: user.id, code: 'REGISTER_SUCCESS' });
    } catch (err) {
        if (err.message === "EMAIL_OR_USERNAME_EXISTS") {
            logSecurityEvent('REGISTER_DUPLICATE', null, clientIP, { userAgent, email: req.body.email });
            return res.status(409).json({ message: "Ya existe una cuenta con ese email o nombre de usuario", code: 'REGISTER_DUPLICATE' });
        }
        logSecurityEvent('REGISTER_ERROR', null, clientIP, { userAgent, error: err.message });
        console.error("Error en registro:", err);
        res.status(500).json({ message: "Error interno del servidor", code: 'REGISTER_INTERNAL_ERROR' });
    }
}

/**
 * Controlador de login de usuario
 */
const login = async (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    // Validar errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logSecurityEvent('LOGIN_VALIDATION_ERROR', null, clientIP, { userAgent, errors: errors.array() });
        return res.status(400).json({ message: "Datos inválidos", errors: errors.array(), code: 'LOGIN_VALIDATION_ERROR' });
    }
    try {
        let { email, password } = req.body;
        email = xss(sanitizeInput(email)).toLowerCase();
        password = xss(password);
        if (!isValidEmail(email)) {
            logSecurityEvent('LOGIN_INVALID_EMAIL', null, clientIP, { userAgent, email });
            return res.status(400).json({ message: "Formato de email inválido", code: 'LOGIN_INVALID_EMAIL' });
        }
        const tokens = await loginUser(email, password);
        // Obtener información del usuario para el log y respuesta
        const user = await prisma.user.findUnique({ where: { email }, select: { id: true, username: true, email: true, createdAt: true, role: true, isVerified: true } });
        logSecurityEvent('LOGIN_SUCCESS', user?.id, clientIP, { userAgent, email });
        // Opciones de cookie seguras (forzar secure: false y sameSite: 'lax' en desarrollo)
        const isProd = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProd ? true : false,
            sameSite: isProd ? 'Strict' : 'Lax',
            path: '/',
            domain: isProd ? process.env.COOKIE_DOMAIN : undefined
        };
        // Guardar tokens en cookies
        res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        // Devolver usuario (puedes omitir los tokens en el body si quieres máxima seguridad)
        res.json({ message: "Inicio de sesión exitoso", code: 'LOGIN_SUCCESS', user });
    } catch (error) {
        logSecurityEvent('LOGIN_FAILED', null, clientIP, { userAgent, email: req.body.email, error: error.message });
        console.error("Error en login:", error);
        res.status(401).json({ message: "Credenciales inválidas", code: 'LOGIN_INVALID_CREDENTIALS' });
    }
}

/**
 * Controlador para obtener datos del usuario autenticado
 */
const getMe = async (req, res) => {
    try {
        // El user ya viene del middleware authMiddleware
        const userData = {
            id: req.user.id,
            email: req.user.email,
            username: req.user.username,
            createdAt: req.user.createdAt,
            isVerified: req.user.isVerified,
            role: req.user.role
        };
        res.json(userData);
    } catch (error) {
        console.error("Error en getMe:", error);
        res.status(500).json({ message: "Error interno del servidor", code: 'GETME_INTERNAL_ERROR' });
    }
}

/**
 * Controlador de logout
 */
const logout = async (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    try {
        // Limpiar el refreshToken de la base de datos
        if (req.user?.id) {
            await prisma.user.update({ where: { id: req.user.id }, data: { refreshToken: null } });
            logSecurityEvent('LOGOUT_SUCCESS', req.user.id, clientIP, { userAgent });
        }
        // Configurar opciones de cookie para limpiar (igual que en login)
        const isProd = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProd ? true : false,
            sameSite: isProd ? 'Strict' : 'Lax',
            path: '/',
            domain: isProd ? process.env.COOKIE_DOMAIN : undefined
        };
        // Limpiar las cookies
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);
        res.json({ message: "Logout exitoso", code: 'LOGOUT_SUCCESS' });
    } catch (error) {
        logSecurityEvent('LOGOUT_ERROR', req.user?.id, clientIP, { userAgent, error: error.message });
        console.error("Error en logout:", error);
        res.status(500).json({ message: "Error interno del servidor", code: 'LOGOUT_INTERNAL_ERROR' });
    }
}

/**
 * Controlador para verificar validez de token
 */
const verifyToken = async (req, res) => {
    try {
        res.json({
            valid: true,
            user: {
                id: req.user.id,
                email: req.user.email,
                username: req.user.username,
                isVerified: req.user.isVerified
            },
            code: 'TOKEN_VALID'
        });
    } catch (error) {
        console.error("Error en verifyToken:", error);
        res.status(401).json({ error: 'Token inválido', code: 'TOKEN_INVALID' });
    }
}

/**
 * Controlador para refrescar tokens
 */
const refresh = async (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            logSecurityEvent('REFRESH_NO_TOKEN', null, clientIP, { userAgent });
            return res.status(401).json({ message: 'Refresh token no proporcionado', code: 'REFRESH_NO_TOKEN' });
        }
        const { refreshUserToken } = require('../services/auth.service');
        const tokens = await refreshUserToken(refreshToken);
        // Configurar cookies seguras
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
        };
        // Establecer las nuevas cookies
        res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        logSecurityEvent('REFRESH_SUCCESS', req.user?.id, clientIP, { userAgent });
        res.json({ message: 'Tokens renovados exitosamente', code: 'REFRESH_SUCCESS' });
    } catch (error) {
        logSecurityEvent('REFRESH_ERROR', req.user?.id, clientIP, { userAgent, error: error.message });
        console.error('Error en refresh:', error);
        res.status(401).json({ message: 'Token de renovación inválido', code: 'REFRESH_INVALID_TOKEN' });
    }
}
module.exports = { register, login, getMe, logout, verifyToken, refresh, changePassword, deleteAccount };