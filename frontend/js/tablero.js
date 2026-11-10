document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/api';
    const investigacionId = localStorage.getItem('investigacionId');
    const nombreJugador = localStorage.getItem('nombreJugador');

    if (!investigacionId) {
        window.location.href = 'index.html';
        return;
    }

    // Bienvenida al detective
    console.log(`Tablero iniciado para el detective: ${nombreJugador}`);
    document.getElementById('nombreDetective').textContent = nombreJugador || '—';

    // Todo texto que va a innerHTML pasa por aquí (el nombre del jugador lo escribe el usuario)
    function escapar(texto) {
        const div = document.createElement('div');
        div.textContent = texto == null ? '' : String(texto);
        return div.innerHTML;
    }

    function abrirModal(modal) {
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-active');
    }

    function cerrarModal(modal) {
        modal.classList.remove('modal-active');
        modal.classList.add('modal-hidden');
    }

    // Si la base se reinició (npm run db:reiniciar), la investigación guardada ya no existe
    function sesionPerdida() {
        alert('La investigación ya no existe en la base de datos (¿se reinició la base?). Inicia una nueva.');
        localStorage.clear();
        window.location.href = 'index.html';
    }

    // --- ESTADO DEL TABLERO ---
    let evidenciasActuales = [];
    let filtroActual = 'todas';
    let juegoFinalizado = false;

    function acertijoResuelto(acertijoId) {
        return evidenciasActuales.some(ev => ev.acertijo && ev.acertijo.id === acertijoId && ev.acertijo.resuelto);
    }

    // NUEVO = solo las evidencias del último desbloqueo (las iniciales si aún no hay acertijos resueltos).
    // shortcut: asume la cadena lineal de acertijos (ids crecientes); si se vuelven paralelos, guardar el orden de resolución.
    function ultimoAcertijoResuelto() {
        const ids = evidenciasActuales
            .filter(ev => ev.acertijo && ev.acertijo.resuelto)
            .map(ev => ev.acertijo.id);
        return ids.length ? Math.max(...ids) : null;
    }

    function esNueva(ev) {
        return ev.desbloqueadaPor === ultimoAcertijoResuelto();
    }

    // --- MÚSICA DE AMBIENTE ---
    // Cada ambiente suena en bucle desde que se desbloquea hasta que se resuelve el acertijo indicado
    // (el que queda pendiente en el momento en que aparece el audio).
    const AMBIENTES = { A07: 1, A06: 4, A08: 8 };
    const ambiente = new Audio();
    ambiente.loop = true;
    ambiente.volume = 0.35;
    let ambienteActual = null;
    let audioFinal = null;
    let esperandoInteraccion = false;

    function actualizarAmbiente() {
        const ev = evidenciasActuales.find(e =>
            e.codigo in AMBIENTES && !acertijoResuelto(AMBIENTES[e.codigo])
        );

        if (!ev || juegoFinalizado || audioFinal) {
            ambiente.pause();
            ambienteActual = null;
            return;
        }

        if (ambienteActual !== ev.codigo) {
            ambiente.src = ev.archivo;
            ambienteActual = ev.codigo;
        }

        // El navegador bloquea el sonido hasta que el jugador interactúa con la página
        ambiente.play().catch(() => {
            if (esperandoInteraccion) return;
            esperandoInteraccion = true;
            const reintentar = () => {
                esperandoInteraccion = false;
                document.removeEventListener('pointerdown', reintentar);
                document.removeEventListener('keydown', reintentar);
                actualizarAmbiente();
            };
            document.addEventListener('pointerdown', reintentar);
            document.addEventListener('keydown', reintentar);
        });
    }

    const ICONOS = { documento: '📄', fotografia: '📷', audio: '🎧' };
    const TIPOS = { documento: 'DOCUMENTO', fotografia: 'FOTOGRAFÍA', audio: 'GRABACIÓN DE AUDIO' };

    // --- PROGRESO ---
    async function cargarProgreso() {
        try {
            // POST recalcula y guarda el progreso con el estado actual del jugador
            const response = await fetch(`${API_BASE_URL}/investigaciones/${investigacionId}/progreso`, {
                method: 'POST'
            });
            if (response.status === 404) return sesionPerdida();
            if (response.ok) {
                const data = await response.json();
                console.log("Progreso cargado:", data);
                const progreso = data.progreso;

                timeElapsed = Math.floor((progreso.tiempoInvestigacion || 0) / 1000);
                chronometerDisplay.textContent = formatTime(timeElapsed);

                document.getElementById('statEvidencias').textContent =
                    `${progreso.evidenciasDesbloqueadas} / ${progreso.evidenciasTotales}`;
                document.getElementById('statAcertijos').textContent =
                    `${progreso.acertijosResueltos} / ${progreso.acertijosTotales}`;
                document.getElementById('statPistas').textContent = progreso.pistasUtilizadas;
                document.getElementById('statIntentos').textContent = progreso.intentosRealizados;
                document.getElementById('statEstado').textContent = progreso.estado.replace('_', ' ');

                juegoFinalizado = progreso.estado === 'FINALIZADA';
                actualizarProgreso(progreso.porcentajeCompletado || 0);
            }
        } catch (error) {
            console.error("Error cargando el progreso:", error);
        }
    }

    window.actualizarProgreso = function (porcentaje) {
        const barra = document.getElementById('investigationProgress');
        const texto = document.getElementById('progressText');
        barra.style.width = `${porcentaje}%`;
        texto.textContent = `${porcentaje}%`;

        // Si llega a 100 y no ha terminado, mostramos el botón de victoria
        console.log(`Progreso actualizado: ${porcentaje}%`);
        if (porcentaje >= 100 && !juegoFinalizado) {
            btnFinalizar.style.display = 'block';
            btnFinalizar.style.animation = 'pulse 1.5s infinite';
        }
    };

    // --- EVIDENCIAS ---
    async function cargarEvidencias() {
        try {
            const response = await fetch(`${API_BASE_URL}/investigaciones/${investigacionId}/evidencias`);
            if (response.status === 404) return sesionPerdida();
            if (response.ok) {
                const data = await response.json();
                evidenciasActuales = data.evidencias || [];
                renderizarCorcho(evidenciasActuales);
                actualizarObjetivo();
                actualizarAmbiente();
            } else {
                console.warn("No se pudieron cargar las evidencias.");
            }
        } catch (error) {
            console.error("Error conectando con evidencias:", error);
            document.querySelector('.corkboard').innerHTML =
                '<p class="empty-board-text">No se pudo conectar con el servidor.</p>';
        }
    }

    function actualizarObjetivo() {
        const objetivo = document.getElementById('objetivoActual');
        const pendiente = evidenciasActuales.find(ev => ev.acertijoPendiente);
        objetivo.innerHTML = pendiente
            ? `🧩 Acertijo pendiente en <strong>${escapar(pendiente.codigo)}</strong> · ${escapar(pendiente.acertijo.titulo)}`
            : '✔ Todos los acertijos resueltos';
    }

    function renderizarCorcho(evidencias) {
        const corcho = document.querySelector('.corkboard');
        corcho.innerHTML = ''; // Limpiamos el corcho antes de repintar

        const visibles = evidencias.filter(ev => filtroActual === 'todas' || ev.tipo === filtroActual);

        if (!visibles || visibles.length === 0) {
            corcho.innerHTML = '<p class="empty-board-text">No hay evidencias de este tipo todavía.</p>';
            return;
        }

        visibles.forEach((ev, index) => {
            const item = document.createElement('div');
            const estilo = ev.tipo === 'fotografia' ? 'photo-card' : ev.tipo === 'audio' ? 'audio-card' : 'post-it';
            item.className = `evidence-item ${estilo}${ev.acertijoPendiente ? ' has-riddle' : ''}`;
            item.dataset.evidencia = ev.id;
            item.tabIndex = 0;
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `${ev.codigo} ${ev.titulo}`);

            // Ligera rotación determinista para el efecto de corcho
            item.style.setProperty('--rot', `${((ev.id * 7) % 9) - 4}deg`);

            const nueva = esNueva(ev);
            const miniatura = ev.tipo === 'fotografia'
                ? `<img class="evidence-thumb" src="${escapar(ev.archivo)}" alt="${escapar(ev.titulo)}" loading="lazy">`
                : '';

            item.innerHTML = `
                ${nueva ? '<span class="badge-new">NUEVO</span>' : ''}
                <span class="evidence-code">${ICONOS[ev.tipo] || ''} ${escapar(ev.codigo)}</span>
                ${miniatura}
                <h4>${escapar(ev.titulo || ev.nombre || 'Evidencia')}</h4>
                ${ev.tipo !== 'fotografia' ? `<p>${escapar(ev.contenido || '...')}</p>` : ''}
                ${ev.acertijoPendiente ? `<button class="btn-resolver" data-acertijo="${ev.acertijo.id}">Resolver Acertijo</button>` : ''}
                ${ev.acertijo && ev.acertijo.resuelto ? '<span class="stamp-solved">RESUELTO</span>' : ''}
            `;

            corcho.appendChild(item);
        });
    }

    // Filtros del corcho
    document.querySelectorAll('.filter-btn').forEach(boton => {
        boton.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            boton.classList.add('active');
            filtroActual = boton.dataset.tipo;
            renderizarCorcho(evidenciasActuales);
        });
    });

    // --- VISOR DE EVIDENCIAS ---
    const modalEvidencia = document.getElementById('modalEvidencia');
    const visorContenido = document.getElementById('visorContenido');
    const visorAcertijo = document.getElementById('visorAcertijo');

    function abrirEvidencia(evidenciaId) {
        const ev = evidenciasActuales.find(e => e.id === Number(evidenciaId));
        if (!ev) return;

        document.getElementById('visorCodigo').textContent = ev.codigo;
        document.getElementById('visorTitulo').textContent = ev.titulo;
        document.getElementById('visorTipo').textContent = TIPOS[ev.tipo] || '';
        document.getElementById('visorDescripcion').textContent = ev.contenido;

        const ruta = escapar(ev.archivo);
        if (ev.tipo === 'fotografia') {
            visorContenido.innerHTML = `
                <a href="${ruta}" target="_blank" rel="noopener"><img src="${ruta}" alt="${escapar(ev.titulo)}"></a>
                <a class="viewer-link" href="${ruta}" target="_blank" rel="noopener">Ver a tamaño completo ↗</a>`;
        } else if (ev.tipo === 'documento') {
            visorContenido.innerHTML = `
                <iframe src="${ruta}#view=FitH" title="${escapar(ev.titulo)}"></iframe>
                <a class="viewer-link" href="${ruta}" target="_blank" rel="noopener">Abrir el PDF en otra pestaña ↗</a>`;
        } else {
            visorContenido.innerHTML = `
                <div class="tape-label">${escapar(ev.codigo)} · ${escapar(ev.titulo)}</div>
                <audio controls preload="metadata" src="${ruta}">Tu navegador no puede reproducir este audio.</audio>`;
            // Mientras se escucha una grabación, el ambiente se silencia
            visorContenido.querySelector('audio').addEventListener('play', () => ambiente.pause());
        }

        if (ev.acertijoPendiente) {
            visorAcertijo.innerHTML = `
                <strong>🧩 ${escapar(ev.acertijo.codigo)} · ${escapar(ev.acertijo.titulo)}</strong>
                <p>${escapar(ev.acertijo.pregunta)}</p>
                <button class="btn-resolver" data-acertijo="${ev.acertijo.id}">Resolver Acertijo</button>`;
        } else if (ev.acertijo && ev.acertijo.resuelto) {
            visorAcertijo.innerHTML = `<strong>✔ ${escapar(ev.acertijo.codigo)} resuelto</strong>`;
        } else {
            visorAcertijo.innerHTML = '';
        }

        abrirModal(modalEvidencia);
    }

    function cerrarVisor() {
        visorContenido.innerHTML = ''; // detiene audio/PDF
        cerrarModal(modalEvidencia);
        actualizarAmbiente();
    }

    document.querySelector('.close-evidencia-btn').addEventListener('click', cerrarVisor);
    visorAcertijo.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-resolver')) {
            cerrarVisor();
            abrirAcertijo(e.target.getAttribute('data-acertijo'));
        }
    });

    // --- DIARIO DEL DETECTIVE (REGISTRO DE PISTAS) ---
    const modalRegistro = document.getElementById('modalRegistro');
    const listaPistasContenedor = document.getElementById('listaPistasContenedor');
    const menuRegistro = document.querySelector('.menu-item.active'); // El que dice REGISTRO DE PISTAS

    async function abrirRegistroPistas(e) {
        if (e) e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/investigaciones/${investigacionId}/pistas-usadas`);

            if (response.ok) {
                const data = await response.json();

                listaPistasContenedor.innerHTML = ''; // Limpiamos la lista anterior

                if (data.pistasUsadas && data.pistasUsadas.length > 0) {
                    data.pistasUsadas.forEach((uso, index) => {
                        const div = document.createElement('div');
                        div.style.background = '#1a1a1a';
                        div.style.padding = '15px';
                        div.style.marginBottom = '10px';
                        div.style.borderLeft = '4px solid #ffb74d';
                        div.style.fontFamily = "'Courier Prime', monospace";

                        div.innerHTML = `
                            <strong style="color: #888; font-size: 0.8rem;">PISTA #${index + 1}${uso.acertijo ? ` · ${escapar(uso.acertijo)}` : ''}</strong>
                            <p style="margin-top: 5px; color: #ddd;">${escapar(uso.descripcion)}</p>
                        `;
                        listaPistasContenedor.appendChild(div);
                    });
                } else {
                    listaPistasContenedor.innerHTML = '<p style="text-align: center; color: #888;">Tu libreta está vacía. Aún no has solicitado pistas.</p>';
                }

                abrirModal(modalRegistro);
            }
        } catch (error) {
            console.error("Error solicitando registro de pistas:", error);
        }
    }

    if (menuRegistro) menuRegistro.addEventListener('click', abrirRegistroPistas);

    document.querySelector('.close-registro-btn').addEventListener('click', () => cerrarModal(modalRegistro));

    // --- ÍNDICE DE PRUEBAS ---
    const modalPruebas = document.getElementById('modalPruebas');

    function abrirIndicePruebas() {
        const tbody = document.getElementById('pruebasTableBody');
        const total = document.getElementById('statEvidencias').textContent.split('/')[1];
        document.getElementById('pruebasResumen').textContent =
            `${evidenciasActuales.length} de ${total ? total.trim() : '?'} evidencias desbloqueadas. Las demás aparecerán al resolver acertijos.`;

        tbody.innerHTML = evidenciasActuales.map(ev => `
            <tr data-evidencia="${ev.id}" tabindex="0">
                <td>${escapar(ev.codigo)}</td>
                <td>${escapar(ev.titulo)}${esNueva(ev) ? ' <span class="badge-new inline">NUEVO</span>' : ''}</td>
                <td>${ICONOS[ev.tipo] || ''}</td>
                <td>${ev.acertijo ? (ev.acertijo.resuelto ? '✔ ' : '🧩 ') + escapar(ev.acertijo.codigo) : '—'}</td>
            </tr>`).join('');

        abrirModal(modalPruebas);
    }

    document.getElementById('pruebasTableBody').addEventListener('click', (e) => {
        const fila = e.target.closest('tr[data-evidencia]');
        if (fila) {
            cerrarModal(modalPruebas);
            abrirEvidencia(fila.dataset.evidencia);
        }
    });
    document.querySelector('.close-pruebas-btn').addEventListener('click', () => cerrarModal(modalPruebas));

    // --- PERSONAS RELACIONADAS ---
    const modalSospechosos = document.getElementById('modalSospechosos');

    function abrirSospechosos() {
        const personas = evidenciasActuales.filter(ev => ev.perfil);
        document.getElementById('sospechososContenedor').innerHTML = personas.map(ev => `
            <article class="suspect-card" data-evidencia="${ev.id}" tabindex="0">
                <img src="${escapar(ev.archivo)}" alt="${escapar(ev.perfil.nombre)}">
                <h4>${escapar(ev.perfil.nombre)}</h4>
                <span>${escapar(ev.perfil.edad)} años · ${escapar(ev.codigo)}</span>
                <p>${escapar(ev.perfil.rol)}</p>
            </article>`).join('') +
            '<p class="index-summary">Otras personas aparecerán a medida que avance la investigación.</p>';
        abrirModal(modalSospechosos);
    }

    document.getElementById('sospechososContenedor').addEventListener('click', (e) => {
        const tarjeta = e.target.closest('[data-evidencia]');
        if (tarjeta) {
            cerrarModal(modalSospechosos);
            abrirEvidencia(tarjeta.dataset.evidencia);
        }
    });
    document.querySelector('.close-sospechosos-btn').addEventListener('click', () => cerrarModal(modalSospechosos));

    // --- CRONÓMETRO ---
    let timeElapsed = 0;
    const chronometerDisplay = document.getElementById('chronometer');

    function formatTime(seconds) {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    setInterval(() => {
        if (juegoFinalizado) return;
        timeElapsed++;
        chronometerDisplay.textContent = formatTime(timeElapsed);
    }, 1000);

    // --- MODAL DE ACERTIJOS ---
    const modal = document.getElementById('modalAcertijo');
    const formAcertijo = document.getElementById('formAcertijo');
    const feedbackMsg = document.getElementById('modalFeedback');
    const respuestaInput = document.getElementById('respuestaInput');
    let acertijoActivoId = null;

    function abrirAcertijo(acertijoId) {
        acertijoActivoId = acertijoId;
        const ev = evidenciasActuales.find(e => e.acertijo && e.acertijo.id === Number(acertijoId));

        document.getElementById('modalTitle').textContent = ev
            ? `${ev.acertijo.codigo} · ${ev.acertijo.titulo.toUpperCase()}`
            : 'RESOLVER ACERTIJO';
        document.getElementById('modalPregunta').textContent = ev
            ? ev.acertijo.pregunta
            : 'Introduce la respuesta descubierta en esta evidencia:';

        abrirModal(modal);
        respuestaInput.value = '';
        feedbackMsg.textContent = '';
        feedbackMsg.style.color = '';
        respuestaInput.focus();
    }

    // Clic en el corcho: botón de acertijo o abrir la evidencia
    const corcho = document.querySelector('.corkboard');
    corcho.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-resolver')) {
            abrirAcertijo(e.target.getAttribute('data-acertijo'));
            return;
        }
        const tarjeta = e.target.closest('.evidence-item');
        if (tarjeta) abrirEvidencia(tarjeta.dataset.evidencia);
    });
    corcho.addEventListener('keydown', (e) => {
        const tarjeta = e.target.closest('.evidence-item');
        if (tarjeta && e.target === tarjeta && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            abrirEvidencia(tarjeta.dataset.evidencia);
        }
    });

    document.querySelector('#modalAcertijo .close-btn').addEventListener('click', () => cerrarModal(modal));

    // Enviar la respuesta al backend
    formAcertijo.addEventListener('submit', async (e) => {
        e.preventDefault();
        const respuesta = respuestaInput.value.trim();

        try {
            const response = await fetch(`${API_BASE_URL}/investigaciones/${investigacionId}/acertijos/${acertijoActivoId}/resolver`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ respuesta: respuesta })
            });

            const data = await response.json();

            if (response.ok) {
                const nuevas = (data.evidencias || []).map(ev => ev.codigo).join(', ');
                feedbackMsg.className = 'feedback-msg feedback-success';
                feedbackMsg.style.color = '';
                feedbackMsg.textContent = `${data.mensaje}${nuevas ? ` (${nuevas})` : ''}`;

                setTimeout(async () => {
                    cerrarModal(modal);
                    await cargarProgreso();
                    await cargarEvidencias();
                    if (data.investigacionCompleta) cerrarCasoConGrabacion();
                }, 1800);
            } else {
                feedbackMsg.className = 'feedback-msg feedback-error';
                feedbackMsg.style.color = '';
                feedbackMsg.textContent = data.mensaje || 'Respuesta incorrecta.';
                respuestaInput.style.transform = "translateX(5px)";
                setTimeout(() => respuestaInput.style.transform = "translateX(0)", 100);
                cargarProgreso(); // actualiza el contador de intentos
            }
        } catch (error) {
            feedbackMsg.className = 'feedback-msg feedback-error';
            feedbackMsg.textContent = 'Error de comunicación con el servidor.';
        }
    });

    // --- SOLICITAR PISTA NUEVA ---
    document.getElementById('btnPedirPista').addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/investigaciones/${investigacionId}/acertijos/${acertijoActivoId}/pista`, {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {
                feedbackMsg.className = 'feedback-msg';
                feedbackMsg.style.color = '#ffc107'; // Texto amarillo para destacar que es una pista
                feedbackMsg.textContent = `🕵️ PISTA: ${data.pista.descripcion}`;
                cargarProgreso();
            } else {
                feedbackMsg.className = 'feedback-msg feedback-error';
                feedbackMsg.textContent = data.mensaje || 'No hay pistas disponibles para este acertijo.';
            }
        } catch (error) {
            feedbackMsg.className = 'feedback-msg feedback-error';
            feedbackMsg.textContent = 'Error al solicitar pista.';
        }
    });

    // --- LÓGICA DE FIN DE JUEGO Y RANKING ---
    const btnFinalizar = document.getElementById('btnFinalizar');
    const modalFinal = document.getElementById('modalFinal');
    const rankingTableBody = document.getElementById('rankingTableBody');

    // Registra el cierre en el backend (tiempo y ranking). Devuelve true si quedó finalizado.
    async function registrarFinal() {
        try {
            const responseFin = await fetch(`${API_BASE_URL}/investigaciones/${investigacionId}/finalizar`, {
                method: 'POST'
            });

            if (responseFin.ok) {
                juegoFinalizado = true;
                const dataFin = await responseFin.json();

                document.getElementById('mensajeVictoria').innerHTML = `
                    Has resuelto el misterio, detective <strong>${escapar(nombreJugador)}</strong>.<br>
                    Tiempo registrado: ${(dataFin.investigacion.tiempoUtilizado / 1000).toFixed(1)} segundos.
                `;

                const audioFinal = evidenciasActuales.find(ev => ev.codigo === 'A05');
                document.getElementById('audioCierre').innerHTML = audioFinal
                    ? `<span>🎧 ${escapar(audioFinal.codigo)} · ${escapar(audioFinal.titulo)}</span>
                       <audio controls preload="metadata" src="${escapar(audioFinal.archivo)}"></audio>`
                    : '';

                const responseRanking = await fetch(`${API_BASE_URL}/ranking`);
                if (responseRanking.ok) {
                    const dataRanking = await responseRanking.json();
                    renderizarRanking(dataRanking.ranking);
                }

                cargarProgreso();
                return true;
            }
            const err = await responseFin.json();
            alert(`Error al finalizar: ${err.mensaje}`);
        } catch (error) {
            console.error("Error al finalizar el caso:", error);
        }
        return false;
    }

    function mostrarFinal() {
        if (audioFinal) audioFinal.pause();
        btnFinalizar.style.display = 'none';
        abrirModal(modalFinal);
    }

    // Último acertijo: se cierra el caso (el tiempo no incluye la grabación), suena A05
    // y, cuando termina, se abre automáticamente la pantalla de caso cerrado.
    async function cerrarCasoConGrabacion() {
        if (juegoFinalizado || !(await registrarFinal())) return;

        const grabacion = evidenciasActuales.find(ev => ev.codigo === 'A05');
        if (!grabacion) return mostrarFinal();

        audioFinal = new Audio(grabacion.archivo);
        actualizarAmbiente(); // silencia cualquier ambiente
        audioFinal.addEventListener('ended', mostrarFinal);
        btnFinalizar.textContent = 'VER CIERRE DEL CASO'; // permite saltar la grabación
        btnFinalizar.style.display = 'block';
        document.getElementById('objetivoActual').textContent = '🎧 Reproduciendo: Grabación final de Daniel…';
        audioFinal.play().catch(mostrarFinal);
    }

    btnFinalizar.addEventListener('click', async () => {
        if (!juegoFinalizado && !(await registrarFinal())) return;
        mostrarFinal();
    });

    function renderizarRanking(listaRanking) {
        rankingTableBody.innerHTML = '';
        if (listaRanking.length === 0) {
            rankingTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:15px;">No hay registros.</td></tr>';
            return;
        }

        listaRanking.forEach((registro, index) => {
            const tr = document.createElement('tr');
            // Resaltar al jugador actual
            if (registro.nombreUsuario === nombreJugador) {
                tr.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
                tr.style.fontWeight = 'bold';
            }

            tr.innerHTML = `
                <td style="padding: 10px 5px; border-bottom: 1px solid #333;">#${index + 1}</td>
                <td style="padding: 10px 5px; border-bottom: 1px solid #333;">${escapar(registro.nombreUsuario)}</td>
                <td style="padding: 10px 5px; border-bottom: 1px solid #333; text-align: right;">${(registro.tiempoTotal / 1000).toFixed(1)}s</td>
            `;
            rankingTableBody.appendChild(tr);
        });
    }

    // Volver al inicio y limpiar sesión
    document.getElementById('btnVolverInicio').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // --- MENÚ LATERAL ---
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const textoMenu = item.textContent;

            if (textoMenu.includes('MENÚ PRINCIPAL')) {
                e.preventDefault();
                if (confirm('¿Seguro que deseas salir? Tu cronómetro seguirá corriendo en el servidor.')) {
                    window.location.href = 'index.html';
                }
            }

            // Pruebas (HU-03): índice de evidencias desbloqueadas
            if (textoMenu.includes('PRUEBAS')) {
                e.preventDefault();
                abrirIndicePruebas();
            }

            if (textoMenu.includes('SOSPECHOSOS')) {
                e.preventDefault();
                abrirSospechosos();
            }
        });
    });

    // Cerrar cualquier modal abierto con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (modalEvidencia.classList.contains('modal-active')) return cerrarVisor();
        [modal, modalRegistro, modalPruebas, modalSospechosos].forEach(cerrarModal);
    });

    // Inicializar llamadas al backend
    cargarProgreso();
    cargarEvidencias();
});