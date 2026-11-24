import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// El panel compilado lo sirve el backend en http://localhost:3000/admin/
export default defineConfig({
    base: '/admin/',
    plugins: [react(), tailwindcss()],
    server: {
        // En desarrollo (npm run dev) la API y los recursos del expediente se piden al backend
        proxy: {
            '/api': 'http://localhost:3000',
            '/assets': 'http://localhost:3000'
        }
    }
});
