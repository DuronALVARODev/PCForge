// Configuración de seguridad centralizada para PCForge
// Aquí puedes definir y exportar objetos de configuración para CORS, Helmet, Rate Limit, etc.

// Ejemplo de plantilla:
// module.exports = {
//   cors: { /* ... */ },
//   helmet: { /* ... */ },
//   rateLimit: { /* ... */ },
// };

module.exports = {
    // Configuración de JWT (JSON Web Tokens)
    jwt: {
        accessTokenExpiry: '15m',           // Token de acceso corto para mayor seguridad
        refreshTokenExpiry: '7d',           // Token de renovación más largo
        issuer: 'PCForge',                  // Emisor del token
        audience: 'PCForge-Users',          // Audiencia del token
        algorithm: 'HS256'                  // Algoritmo de firma
    },

    // Configuración de contraseñas
    password: {
        minLength: 8,                       // Longitud mínima
        maxLength: 128,                     // Longitud máxima para evitar ataques DoS
        requireUppercase: true,             // Requerir mayúsculas
        requireLowercase: true,             // Requerir minúsculas
        requireNumbers: true,               // Requerir números
        requireSpecialChars: true,          // Requerir caracteres especiales
        saltRounds: 12,                     // Rondas de salt para bcrypt
        preventCommonPasswords: true,       // Prevenir contraseñas comunes
        preventUserInfoInPassword: true     // Prevenir información del usuario en la contraseña
    },

    // Configuración de rate limiting (limitación de velocidad)
    rateLimit: {
        login: {
            windowMs: 15 * 60 * 1000,       // 15 minutos
            max: 5,                         // máximo 5 intentos
            skipSuccessfulRequests: true,   // No contar intentos exitosos
            message: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.'
        },
        register: {
            windowMs: 60 * 60 * 1000,       // 1 hora
            max: 3,                         // máximo 3 registros
            skipSuccessfulRequests: true,
            message: 'Demasiados intentos de registro. Intenta de nuevo en 1 hora.'
        },
        api: {
            windowMs: 15 * 60 * 1000,       // 15 minutos
            max: 100,                       // máximo 100 requests
            message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.'
        },
        emailVerification: {
            windowMs: 60 * 60 * 1000,       // 1 hora
            max: 10,                        // máximo 10 intentos
            message: 'Demasiados intentos de verificación. Intenta de nuevo en 1 hora.'
        },
        passwordReset: {
            windowMs: 60 * 60 * 1000,       // 1 hora
            max: 3,                         // máximo 3 intentos
            message: 'Demasiados intentos de reset de contraseña. Intenta de nuevo en 1 hora.'
        }
    },

    // Configuración de cookies seguras
    cookies: {
        httpOnly: true,                     // Prevenir acceso desde JavaScript
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax', // Protección CSRF
        path: '/',                          // Ruta de las cookies
        domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
        maxAge: {
            accessToken: 15 * 60 * 1000,    // 15 minutos
            refreshToken: 7 * 24 * 60 * 60 * 1000 // 7 días
        }
    },

    // Configuración de CORS (Cross-Origin Resource Sharing)
    cors: {
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'http://localhost:4000',
            'https://pc-forge-smoky.vercel.app'
        ],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Set-Cookie'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        maxAge: 86400,                      // 24 horas
        preflightContinue: false,
        optionsSuccessStatus: 204
    },

    // Configuración de Helmet (headers de seguridad)
    helmet: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:", "http://localhost:4000", "http://localhost:3000", "https://pcforge-backend.onrender.com", "https://pc-forge-smoky.vercel.app"],
                connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000', "http://localhost:4000", "https://pc-forge-smoky.vercel.app", "https://pcforge-backend.onrender.com"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
                workerSrc: ["'self'"],
                manifestSrc: ["'self'"]
            },
        },
        hsts: {
            maxAge: 31536000,               // 1 año
            includeSubDomains: true,
            preload: true
        },
        noSniff: true,                      // Prevenir MIME type sniffing
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        frameguard: { action: 'deny' },     // Prevenir clickjacking
        xssFilter: true,                    // Filtro XSS básico
        hidePoweredBy: true                 // Ocultar header X-Powered-By
    },

    // Configuración de validación de inputs
    validation: {
        email: {
            maxLength: 254,                 // RFC 5321 limit
            requireValidFormat: true,
            allowDisposable: false          // No permitir emails desechables
        },
        username: {
            minLength: 3,
            maxLength: 30,
            allowedChars: /^[a-zA-Z0-9_-]+$/,
            noLeadingTrailingDash: true,
            noConsecutiveDashes: true       // No permitir guiones consecutivos
        },
        token: {
            length: 64,                     // 32 bytes en hex
            format: /^[a-fA-F0-9]{64}$/,
            expiry: 24 * 60 * 60 * 1000     // 24 horas
        },
        sanitization: {
            maxLength: 1000,                // Longitud máxima para cualquier input
            stripHtml: true,                // Remover HTML
            normalizeWhitespace: true       // Normalizar espacios en blanco
        }
    },

    // Configuración de logging de seguridad
    logging: {
        securityEvents: true,               // Log de eventos de seguridad
        slowRequests: {
            enabled: true,
            threshold: 5000                 // 5 segundos
        },
        suspiciousPaths: true,              // Log de rutas sospechosas
        failedLogins: true,                 // Log de logins fallidos
        rateLimitViolations: true,          // Log de violaciones de rate limit
        sqlInjectionAttempts: true,         // Log de intentos de SQL injection
        xssAttempts: true                   // Log de intentos de XSS
    },

    // Configuración de bloqueo de cuentas
    accountLockout: {
        maxAttempts: 5,                     // Máximo 5 intentos fallidos
        lockoutDuration: 15 * 60 * 1000,    // 15 minutos de bloqueo
        resetAfterSuccess: true,            // Resetear contador después de login exitoso
        progressiveDelay: true,             // Delay progresivo entre intentos
        notifyOnLockout: true               // Notificar al usuario del bloqueo
    },

    // Configuración de tokens de verificación
    verification: {
        tokenExpiry: 24 * 60 * 60 * 1000,   // 24 horas
        maxResendAttempts: 3,               // Máximo 3 reenvíos
        resendCooldown: 5 * 60 * 1000       // 5 minutos entre reenvíos
    },

    // Configuración de sesiones
    session: {
        maxConcurrentSessions: 5,           // Máximo 5 sesiones concurrentes
        sessionTimeout: 30 * 60 * 1000,     // 30 minutos de inactividad
        regenerateOnLogin: true,            // Regenerar ID de sesión en login
        secureSession: true                 // Usar configuración segura de sesión
    },

    // Configuración de auditoría
    audit: {
        enabled: true,                      // Habilitar auditoría
        logUserActions: true,               // Log de acciones del usuario
        logAdminActions: true,              // Log de acciones administrativas
        logDataAccess: true,                // Log de acceso a datos sensibles
        retentionDays: 90                   // Retener logs por 90 días
    }
}; 