document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/api';
    const investigacionId = localStorage.getItem('investigacionId');

    // 1. Proteger la ruta: si no hay ID, lo devolvemos al login
    if (!investigacionId) {
        window.location.href = 'index.html';
        return;
    }

    async function cargarProgreso() {
        try {
            
            const response = await fetch(`${API_BASE_URL}/progresos/${investigacionId}`);
            
            if (response.ok) {
                const data = await response.json();
                
                const porcentaje = data.porcentajeCompletado || 0; 
                actualizarProgreso(porcentaje);
            }
        } catch (error) {
            console.error("Error cargando el progreso:", error);
        }
    }

    window.actualizarProgreso = function(porcentaje) {
        const barra = document.getElementById('investigationProgress');
        const texto = document.getElementById('progressText');
        barra.style.width = `${porcentaje}%`;
        texto.textContent = `${porcentaje}%`;
    };

    // Inicializamos
    cargarProgreso();

    // --- LÓGICA DEL CRONÓMETRO ---
    let timeElapsed = 0;
    const chronometerDisplay = document.getElementById('chronometer');
    
    function formatTime(seconds) {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    setInterval(() => {
        timeElapsed++;
        chronometerDisplay.textContent = formatTime(timeElapsed);
    }, 1000);

    // --- BOTÓN DE PISTAS ---
    document.querySelector('.btn-clues').addEventListener('click', () => {
        console.log(`Solicitando pista para la investigación: ${investigacionId}`);
        
    });
});