/**
 * Página de registro que valida y envía datos al backend
 * Usa react-hook-form con zod, axios para enviar datos y muestra mensajes de éxito o error
 */
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import axios from "axios";
import { useState, useEffect } from "react";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import './register.css';

const formSchema = z.object({
    email: z.string().email("Ingresa un correo electrónico válido"),
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

type FormData = z.infer<typeof formSchema>;

const RegisterPage = () => {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Cambiar el título dinámicamente
    useEffect(() => {
        document.title = 'Registro';
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        console.log('Formulario enviado:', data);
        
        try {
            const response = await axios.post('http://localhost:4000/api/auth/register', data);
            console.log('Respuesta del servidor:', response.data);
            setSuccess('Registro exitoso. Revisa tu correo electrónico para verificar la cuenta.');
            setError('');
        } catch (err: any) {
            console.error('Error en el registro:', err);
            setError(err.response?.data?.message || 'Error en el registro');
            setSuccess('');
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h1 className="text-2xl font-bold mb-6">Registro</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input 
                            placeholder="Correo electrónico" 
                            type="email" 
                            {...register('email')} 
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <Input 
                            placeholder="Nombre de usuario" 
                            type="text" 
                            {...register('username')} 
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <Input 
                            placeholder="Contraseña" 
                            type="password" 
                            {...register('password')} 
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <Input 
                            placeholder="Confirmar contraseña" 
                            type="password" 
                            {...register('confirmPassword')} 
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
                        {isSubmitting ? 'Registrando...' : 'Registrarse'}
                    </Button>
                </form>

                {success && <p className="text-green-600 mt-4">{success}</p>}
                {error && <p className="text-red-600 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default RegisterPage;