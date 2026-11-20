document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/api';
    const adminUsuario = sessionStorage.getItem('adminUsuario');

    if (!adminUsuario) {
        window.location.href = 'index.html';
        return;
    }

    const titulo = document.getElementById('tituloSeccion');
    const resumen = document.getElementById('resumenSeccion');
    const contenido = document.getElementById('contenidoSeccion');

    // Todo texto que va a innerHTML pasa por aquí (los nombres los escriben los jugadores)
    function escapar(texto) {
        const div = document.createElement('div');
        div.textContent = texto == null ? '' : String(texto);
        return div.innerHTML;
    }

    const fecha = valor => valor ? new Date(valor).toLocaleString('es-CO') : '—';
    const segundos = ms => ms == null ? '—' : `${(ms / 1000).toFixed(1)} s`;
    const TIPOS = { documento: '📄 Documento', fotografia: '📷 Fotografía', audio: '🎧 Audio' };

    function cerrarSesion() {
        sessionStorage.removeItem('adminUsuario');
        window.location.href = 'index.html';
    }

    // Las rutas /api/admin exigen el usuario del administrador en la cabecera
    async function pedir(ruta) {
        const response = await fetch(`${API_BASE_URL}${ruta}`, {
            headers: { 'x-admin-usuario': encodeURIComponent(adminUsuario) }
        });
        if (response.status === 401) {
            alert('Sesión de administrador no válida.');
            cerrarSesion();
            throw new Error('No autorizado');
        }
        if (!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
    }

    function tabla(encabezados, filas) {
        if (filas.length === 0) return '<p class="admin-empty">No hay registros.</p>';
        return `<div class="admin-table-wrapper"><table class="admin-table">
            <thead><tr>${encabezados.map(e => `<th>${e}</th>`).join('')}</tr></thead>
            <tbody>${filas.join('')}</tbody></table></div>`;
    }

    // --- SECCIONES ---
    const SECCIONES = {
        async investigaciones() {
            const data = await pedir('/admin/investigaciones');
            const lista = data.investigaciones;
            const finalizadas = lista.filter(i => i.estado === 'FINALIZADA').length;
            resumen.textContent = `${lista.length} investigaciones · ${lista.length - finalizadas} en progreso · ${finalizadas} finalizadas`;

            return tabla(
                ['ID', 'DETECTIVE', 'INICIO', 'ESTADO', 'ACERTIJOS', 'INTENTOS', 'PISTAS', 'TIEMPO FINAL'],
                lista.map(i => `<tr>
                    <td>${i.id}</td>
                    <td>${escapar(i.nombreUsuario)}</td>
                    <td>${fecha(i.fechaInicio)}</td>
                    <td><span class="estado ${i.estado === 'FINALIZADA' ? 'fin' : 'curso'}">${i.estado.replace('_', ' ')}</span></td>
                    <td>${i.acertijosResueltos} / ${data.totalAcertijos}</td>
                    <td>${i.intentos}</td>
                    <td>${i.pistasUsadas}</td>
                    <td>${segundos(i.tiempoUtilizado)}</td>
                </tr>`)
            );
        },

        async evidencias() {
            const { evidencias } = await pedir('/admin/evidencias');
            resumen.textContent = `${evidencias.length} evidencias del expediente (incluye las que el jugador aún no ha desbloqueado)`;

            return tabla(
                ['ID', 'VISTA', 'EVIDENCIA', 'TIPO', 'SE DESBLOQUEA', 'ACERTIJO QUE PLANTEA'],
                evidencias.map(ev => {
                    const ruta = escapar(ev.archivo);
                    const vista = ev.tipo === 'fotografia'
                        ? `<a href="${ruta}" target="_blank" rel="noopener"><img class="admin-thumb" src="${ruta}" alt="${escapar(ev.titulo)}" loading="lazy"></a>`
                        : ev.tipo === 'audio'
                            ? `<audio controls preload="none" src="${ruta}"></audio>`
                            : `<a class="admin-link" href="${ruta}" target="_blank" rel="noopener">Abrir PDF ↗</a>`;
                    return `<tr>
                        <td><strong>${escapar(ev.codigo)}</strong></td>
                        <td>${vista}</td>
                        <td><strong>${escapar(ev.titulo)}</strong><br><span class="admin-muted">${escapar(ev.contenido)}</span></td>
                        <td>${TIPOS[ev.tipo] || ''}</td>
                        <td>${ev.desbloqueadaPorCodigo ? `Al resolver ${escapar(ev.desbloqueadaPorCodigo)}` : 'Desde el inicio'}</td>
                        <td>${escapar(ev.acertijo || '—')}</td>
                    </tr>`;
                })
            );
        },

        async acertijos() {
            const { acertijos } = await pedir('/admin/acertijos');
            resumen.textContent = `${acertijos.length} acertijos en cadena. La primera respuesta es la canónica; las demás también se aceptan.`;

            return tabla(
                ['ID', 'ACERTIJO', 'SE PLANTEA EN', 'RESPUESTAS ACEPTADAS', 'DESBLOQUEA'],
                acertijos.map(a => `<tr>
                    <td><strong>${escapar(a.codigo)}</strong></td>
                    <td><strong>${escapar(a.titulo)}</strong><br><span class="admin-muted">${escapar(a.pregunta)}</span></td>
                    <td>${escapar(a.evidencia)}</td>
                    <td><strong class="respuesta">${escapar(a.respuesta[0])}</strong>${a.respuesta.slice(1).map(r => `<br><span class="admin-muted">${escapar(r)}</span>`).join('')}</td>
                    <td>${escapar(a.desbloquea.join(', '))}</td>
                </tr>`)
            );
        },

        async pistas() {
            const { pistas } = await pedir('/admin/pistas');
            const usos = pistas.reduce((total, p) => total + p.usos, 0);
            resumen.textContent = `${pistas.length} pistas (2 por acertijo) · solicitadas ${usos} veces en total. La tercera solicitud de un jugador revela la respuesta.`;

            return tabla(
                ['ACERTIJO', 'Nº', 'PISTA', 'VECES PEDIDA'],
                pistas.map(p => `<tr>
                    <td>${escapar(p.acertijo)}</td>
                    <td>${p.orden}</td>
                    <td>${escapar(p.descripcion)}</td>
                    <td>${p.usos}</td>
                </tr>`)
            );
        },

        async ranking() {
            const { ranking } = await pedir('/ranking');
            resumen.textContent = 'Top 10 de investigaciones finalizadas por menor tiempo.';

            return tabla(
                ['POS', 'DETECTIVE', 'TIEMPO'],
                ranking.map((r, i) => `<tr>
                    <td>#${i + 1}</td>
                    <td>${escapar(r.nombreUsuario)}</td>
                    <td>${segundos(r.tiempoTotal)}</td>
                </tr>`)
            );
        }
    };

    async function mostrar(seccion, enlace) {
        document.querySelectorAll('.menu-item[data-seccion]').forEach(item =>
            item.classList.toggle('active', item === enlace)
        );
        titulo.textContent = enlace.textContent.replace(/^\S+\s/, '');
        resumen.textContent = '';
        contenido.innerHTML = '<p class="admin-empty">Cargando…</p>';

        try {
            contenido.innerHTML = await SECCIONES[seccion]();
        } catch (error) {
            console.error(error);
            contenido.innerHTML = '<p class="admin-empty">No se pudo cargar la información. Revisa que el servidor y la base de datos estén encendidos.</p>';
        }
    }

    document.querySelectorAll('.menu-item[data-seccion]').forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            mostrar(enlace.dataset.seccion, enlace);
        });
    });

    document.getElementById('btnCerrarSesion').addEventListener('click', (e) => {
        e.preventDefault();
        cerrarSesion();
    });

    mostrar('investigaciones', document.querySelector('.menu-item[data-seccion="investigaciones"]'));
});
