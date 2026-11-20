// Prueba de extremo a extremo de la API contra PostgreSQL: npm test
// Requiere la base montada (npm run db:crear). Crea dos partidas de prueba con nombres únicos.
const assert = require('assert');
const app = require('../sistema/app');
const pool = require('../persistencia/conexion/database');
const repoAcertijos = require('../persistencia/repositorios/AcertijoRepositorio');
const repoEvidencias = require('../persistencia/repositorios/EvidenciaRepositorio');
const { ADMIN_USUARIO } = require('../configuracion/variablesEntorno');

const servidor = app.listen(0);
const base = `http://localhost:${servidor.address().port}`;

const pedir = async (metodo, ruta, cuerpo) => {
    const res = await fetch(base + ruta, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: cuerpo ? JSON.stringify(cuerpo) : undefined
    });
    return { status: res.status, datos: await res.json() };
};

const respuestasJugador = ['8', 'laura méndez', 'Registro 023', '15-04-2022', 'NEGATIVO', '16/10/2025', 'estudio 3b', 'el original', 'E. Morales'];

(async () => {
    const acertijos = await repoAcertijos.obtenerTodos();
    const evidencias = await repoEvidencias.obtenerTodas();
    const ana = `Ana-prueba-${Date.now()}`;

    // Inicio
    const a = await pedir('POST', '/api/investigaciones', { nombreUsuario: ana });
    const b = await pedir('POST', '/api/investigaciones', { nombreUsuario: 'Beto-prueba' });
    assert.strictEqual(a.status, 201);
    const idA = a.datos.investigacion.id, idB = b.datos.investigacion.id;
    assert.strictEqual((await pedir('POST', '/api/investigaciones', { nombreUsuario: '  ' })).status, 400);

    // Evidencias iniciales: 6, sin respuestas filtradas al cliente
    let ev = await pedir('GET', `/api/investigaciones/${idA}/evidencias`);
    assert.strictEqual(ev.datos.evidencias.length, 6);
    assert.ok(!JSON.stringify(ev.datos).includes('"respuesta"'));
    assert.strictEqual(ev.datos.evidencias.filter(e => e.acertijoPendiente).length, 1);

    // No se puede saltar al acertijo final ni finalizar antes de tiempo
    assert.strictEqual((await pedir('POST', `/api/investigaciones/${idA}/acertijos/9/resolver`, { respuesta: 'Esteban Morales' })).status, 403);
    assert.strictEqual((await pedir('POST', `/api/investigaciones/${idA}/finalizar`)).status, 400);

    // Respuesta incorrecta + pistas (2 pistas, la 3.ª revela la respuesta canónica)
    assert.strictEqual((await pedir('POST', `/api/investigaciones/${idA}/acertijos/1/resolver`, { respuesta: '07' })).status, 400);
    await pedir('POST', `/api/investigaciones/${idA}/acertijos/1/pista`);
    await pedir('POST', `/api/investigaciones/${idA}/acertijos/1/pista`);
    const p3 = await pedir('POST', `/api/investigaciones/${idA}/acertijos/1/pista`);
    assert.ok(p3.datos.pista.descripcion.includes('"08"'));
    const usadas = await pedir('GET', `/api/investigaciones/${idA}/pistas-usadas`);
    assert.strictEqual(usadas.datos.pistasUsadas.length, 2);

    // Resolver todo en orden con variantes de escritura
    for (let i = 0; i < acertijos.length; i++) {
        const r = await pedir('POST', `/api/investigaciones/${idA}/acertijos/${i + 1}/resolver`, { respuesta: respuestasJugador[i] });
        assert.strictEqual(r.status, 200, `acertijo ${i + 1}: ${r.datos.mensaje}`);
    }
    ev = await pedir('GET', `/api/investigaciones/${idA}/evidencias`);
    assert.strictEqual(ev.datos.evidencias.length, evidencias.length);

    // El jugador B no se ve afectado por el avance de A
    ev = await pedir('GET', `/api/investigaciones/${idB}/evidencias`);
    assert.strictEqual(ev.datos.evidencias.length, 6);

    // Progreso (antes fallaba por referencia circular en "estado")
    const prog = await pedir('POST', `/api/investigaciones/${idA}/progreso`);
    assert.strictEqual(prog.status, 200);
    assert.strictEqual(prog.datos.progreso.porcentajeCompletado, 100);
    assert.strictEqual(prog.datos.progreso.pistasUtilizadas, 2);
    assert.strictEqual(prog.datos.progreso.estado, 'EN_PROGRESO');

    // Finalizar → ranking; State impide repetir o seguir respondiendo
    const fin = await pedir('POST', `/api/investigaciones/${idA}/finalizar`);
    assert.strictEqual(fin.status, 200);
    assert.strictEqual(fin.datos.investigacion.estado, 'FINALIZADA');
    assert.strictEqual((await pedir('POST', `/api/investigaciones/${idA}/finalizar`)).status, 400);
    assert.strictEqual((await pedir('POST', `/api/investigaciones/${idA}/acertijos/1/resolver`, { respuesta: '08' })).status, 400);
    const ranking = await pedir('GET', '/api/ranking');
    assert.ok(ranking.datos.ranking.length <= 10);
    assert.ok(ranking.datos.ranking.some(r => r.nombreUsuario === ana), 'Ana debe aparecer en el ranking');

    // Persistencia: la partida se lee de nuevo desde la base
    const guardado = await pedir('GET', `/api/investigaciones/${idA}/progreso`);
    assert.strictEqual(guardado.datos.progreso.acertijosResueltos, 9);
    assert.strictEqual((await pedir('GET', '/api/investigaciones/999999999/evidencias')).status, 404);
    assert.strictEqual((await pedir('GET', '/api/investigaciones/abc/evidencias')).status, 404);

    // Administrador: entra al panel sin crear partida y solo él accede a /api/admin
    const totalAntes = (await pool.query('SELECT COUNT(*) AS n FROM investigacion')).rows[0].n;
    const admin = await pedir('POST', '/api/investigaciones', { nombreUsuario: ` ${ADMIN_USUARIO} ` });
    assert.strictEqual(admin.status, 200);
    assert.strictEqual(admin.datos.rol, 'administrador');
    assert.strictEqual((await pool.query('SELECT COUNT(*) AS n FROM investigacion')).rows[0].n, totalAntes);
    assert.notStrictEqual((await pedir('POST', '/api/investigaciones', { nombreUsuario: ADMIN_USUARIO.slice(0, -1) })).datos.rol, 'administrador');

    const pedirAdmin = (ruta, usuario) => fetch(base + ruta, { headers: usuario ? { 'x-admin-usuario': encodeURIComponent(usuario) } : {} });
    for (const ruta of ['/api/admin/investigaciones', '/api/admin/evidencias', '/api/admin/acertijos', '/api/admin/pistas']) {
        assert.strictEqual((await pedirAdmin(ruta)).status, 401, ruta);
        assert.strictEqual((await pedirAdmin(ruta, 'Ana')).status, 401, ruta);
        assert.strictEqual((await pedirAdmin(ruta, ADMIN_USUARIO)).status, 200, ruta);
    }
    const panel = await (await pedirAdmin('/api/admin/investigaciones', ADMIN_USUARIO)).json();
    const filaAna = panel.investigaciones.find(i => i.id === idA);
    assert.strictEqual(filaAna.acertijosResueltos, 9);
    assert.strictEqual(filaAna.estado, 'FINALIZADA');
    const panelEvidencias = await (await pedirAdmin('/api/admin/evidencias', ADMIN_USUARIO)).json();
    assert.strictEqual(panelEvidencias.evidencias.length, evidencias.length);
    const panelAcertijos = await (await pedirAdmin('/api/admin/acertijos', ADMIN_USUARIO)).json();
    assert.strictEqual(panelAcertijos.acertijos[0].respuesta[0], '08');
    const panelPistas = await (await pedirAdmin('/api/admin/pistas', ADMIN_USUARIO)).json();
    assert.strictEqual(panelPistas.pistas.length, 18);
    assert.ok(panelPistas.pistas.find(p => p.id === 1).usos >= 1);

    // Recursos estáticos del expediente
    for (const e of evidencias) {
        const res = await fetch(`${base}/${e.archivo}`, { method: 'HEAD' });
        assert.strictEqual(res.status, 200, e.archivo);
    }
    assert.strictEqual((await fetch(`${base}/tablero.html`)).status, 200);

    console.log('OK: flujo completo del Expediente 001 verificado contra PostgreSQL');
    servidor.close();
    await pool.end();
})().catch(async error => {
    console.error(error);
    servidor.close();
    await pool.end();
    process.exit(1);
});