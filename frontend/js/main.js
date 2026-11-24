loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById('username').value.trim();

        if (!usernameInput) {
            alert("El nombre de usuario es obligatorio");
            return;
        }

        try {

            const response = await fetch('http://localhost:3000/api/investigaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify({ nombreUsuario: usernameInput }) 
            });
            
            const data = await response.json();

            // El servidor reconoce el usuario del administrador: va a su panel en lugar del juego
            if (response.ok && data.rol === 'administrador') {
                localStorage.clear();
                sessionStorage.setItem('adminUsuario', usernameInput); // se borra al cerrar la pestaña
                window.location.href = '/admin/'; // panel en React (admin-react)
                return;
            }

            if (response.ok) {

                localStorage.clear(); // descarta datos de una partida anterior
                localStorage.setItem('investigacionId', data.investigacion.id);
                localStorage.setItem('nombreJugador', usernameInput);
                
                // Redirigimos al tablero
                window.location.href = 'tablero.html';
            } else {
                alert(`Error al iniciar: ${data.mensaje}`);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor backend.");
        }
    });