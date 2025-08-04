
const { PrismaClient } = require("@prisma/client");
const bycrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendVerificationEmail } = require ("../utils/mailer");
const jwt = require("jsonwebtoken");
const { isValidEmail, isValidUsername, isStrongPassword, sanitizeInput } = require("../utils/validateInput");
const prisma = new PrismaClient();

// Cambiar la contraseña de un usuario autenticado
async function changeUserPassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('USER_NOT_FOUND');
    const valid = await securePasswordCompare(currentPassword, user.passwordHash || user.password);
    if (!valid) throw new Error('INCORRECT_PASSWORD');
    const newHash = await bycrypt.hash(newPassword, 12);
    await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash }
    });
    // Opcional: invalidar refreshToken para forzar re-login en otros dispositivos
    await invalidateUserTokens(userId);
    return true;
}



// Función para generar tokens seguros
function generateSecureToken() {
    return crypto.randomBytes(32).toString("hex");
}

// Función para comparar contraseñas de forma segura (timing attack protection)
async function securePasswordCompare(password, hash) {
    try {
        return await bycrypt.compare(password, hash);
    } catch (error) {
        // En caso de error, hacer una comparación falsa para evitar timing attacks
        await bycrypt.compare('dummy', '$2a$12$dummyhash');
        return false;
    }
}

async function registerUser(email, username, password) {
    const existingUser = await prisma.user.findFirst({ 
        where: { OR: [{ email }, { username }] } 
    });
    if (existingUser) throw new Error ("EMAIL_OR_USERNAME_EXISTS");
    const passwordHash = await bycrypt.hash(password, 12);
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); //24h
    const newUser = await prisma.user.create({
        data:{
            email,
            username,
            passwordHash,
            verificationToken: token,
            tokenExpiry,
            // El rol por defecto es 'user', Prisma lo asigna automáticamente
        },
    });
    await sendVerificationEmail(email, token);
    return newUser;
}

async function loginUser(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('El usuario no existe');
    if (!user.isVerified) throw new Error('La cuenta no ha sido verificada');
    const valid = await bycrypt.compare(password, user.password || user.passwordHash);
    if (!valid) throw new Error('Contraseña incorrecta');
    // Generar tokens
    const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    // Guardar refreshToken en DB
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });
    return { accessToken, refreshToken };
}

async function refreshUserToken(refreshToken) {
    try {
        // Verificar el refreshToken
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        // Buscar el usuario y verificar que el refreshToken coincida
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user || user.refreshToken !== refreshToken) {
            throw new Error('Refresh token inválido');
        }
        // Generar nuevos tokens
        const newAccessToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        const newRefreshToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );
        // Actualizar el refreshToken en la base de datos
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken }
        });
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
        throw new Error('Token de renovación inválido');
    }
}

// Función para invalidar todos los tokens de un usuario
async function invalidateUserTokens(userId) {
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null }
    });
}

async function deleteUserAccount(userId, password) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('USER_NOT_FOUND');
    const valid = await bycrypt.compare(password, user.passwordHash || user.password);
    if (!valid) throw new Error('INCORRECT_PASSWORD');
    // Eliminar builds del usuario (si existen)
    await prisma.build.deleteMany({ where: { userId } });
    // Eliminar usuario
    await prisma.user.delete({ where: { id: userId } });
    return true;
}
module.exports = { 
    registerUser, 
    loginUser, 
    refreshUserToken, 
    invalidateUserTokens,
    generateSecureToken,
    changeUserPassword,
    deleteUserAccount
};
