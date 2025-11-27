import { create } from 'zustand';
import asyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (username, email, password) => {
        set({ isLoading: true });

        try {
            console.log('Registering user:', { username, email, password });
            const response = await fetch('http://192.168.1.65:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            console.log("🚀 ~ data:", response)
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Registration failed');
            await asyncStorage.setItem("user", JSON.stringify(data.user));
            await asyncStorage.setItem("token", data.token);
            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            console.error('Registration error:', error);
            return { success: false, message: error.message };
        }
    }
}));