-- Last Seen · Datos del EXPEDIENTE 001: EL ÚLTIMO REGISTRO
-- Catálogo fijo del caso: evidencias, acertijos, respuestas aceptadas, pistas y personas.
-- Se puede ejecutar varias veces: actualiza el catálogo sin borrar las partidas.
-- Documento ficticio – proyecto académico.

BEGIN;
-- evidencia y acertijo se referencian mutuamente: las llaves foráneas se comprueban al final (DEFERRABLE)
SET CONSTRAINTS ALL DEFERRED;

-- Evidencias (desbloqueada_por = acertijo que la revela; NULL = visible desde el inicio)
INSERT INTO evidencia (id, codigo, tipo, titulo, contenido, archivo, desbloqueada_por) VALUES
    (1, 'D01', 'documento', 'Informe de desaparición', 'Expediente SJ-2025-001. Andrés Herrera reporta el 17/10/2025 la desaparición de su hermano Daniel. Último contacto conocido: 15/10/2025. Sin señales de ingreso forzado.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D01_InformeDesaparicion.pdf', NULL),
    (2, 'F01', 'fotografia', 'Daniel Herrera', 'Fotografía de la persona desaparecida. Fotógrafo documental, 32 años. Residía en el apartamento 302 del edificio Los Olivos.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F01_Daniel.jpg', NULL),
    (3, 'F03', 'fotografia', 'Andrés Herrera', 'Hermano mayor de Daniel, comerciante. Fue quien reportó la desaparición.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F03_Andres.jpeg', NULL),
    (4, 'F11', 'fotografia', 'Apartamento 302 – Vista del cuarto', 'Estado del apartamento durante la inspección del 18/10/2025. Pertenencias y material fotográfico en su lugar.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F11_VistaCuarto.jpeg', NULL),
    (5, 'D02', 'documento', 'Inventario del apartamento', 'Elementos registrados en la inspección del apartamento. Los investigadores compararon el inventario con las notas del cuaderno de Daniel.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D02_InventarioApartamento.pdf', NULL),
    (6, 'A07', 'audio', 'Ambiente – Apartamento de Daniel', 'Registro sonoro ambiental tomado en el apartamento durante la inspección.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/03_AUDIOS/A07_ApartamentoDaniel.mp3', NULL),
    (7, 'D03', 'documento', 'Diario personal de Daniel', 'Cuaderno recuperado del apartamento. Notas del 10 al 15 de octubre de 2025.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D03_DiarioPersonalDaniel.pdf', 1),
    (8, 'F05', 'fotografia', 'Escritorio de Daniel', 'Mesa de trabajo con fotografías impresas, un cuaderno y una cámara.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F05_Escritorio.jpeg', 1),
    (9, 'F07', 'fotografia', 'Cámara analógica y material', 'Cámara analógica negra (elemento 01 del inventario) junto a negativos y copias en blanco y negro.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F07_Camara.jpeg', 1),
    (10, 'F02', 'fotografia', 'Laura Méndez', 'Restauradora documental, 29 años. Amiga de Daniel desde hace unos seis años.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F02_Laura.jpg', 2),
    (11, 'F12', 'fotografia', 'Sobre «Para Laura»', 'Sobre que Daniel entregó a Laura el 12 de octubre para que lo conservara.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F12_Sobre.jpeg', 2),
    (12, 'D05', 'documento', 'Correos electrónicos Daniel – Laura', 'Tres correos recuperados de la cuenta de Daniel (10, 11 y 13 de octubre de 2025).', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D05_CorrepsElectronicosDanielLaura.pdf', 2),
    (13, 'A02', 'audio', 'Nota de voz de Laura', 'Nota de voz de Laura Méndez incorporada al expediente.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/03_AUDIOS/A02_NotaVozLaura.mp3', 2),
    (14, 'D04', 'documento', 'Registro de digitalización 2022', 'Registro del Archivo Histórico Municipal, abril de 2022. Fotografías 021 a 024 con fecha oficial y anotación secundaria.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D04_RegistroDigitalizacion.pdf', 3),
    (15, 'F08A', 'fotografia', 'Archivo Histórico Municipal', 'Sala de consulta y depósito del Archivo Municipal de San Jerónimo.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F08_Archivo.jpeg', 3),
    (16, 'F06', 'fotografia', 'Estantería M-14', 'Estantería con cajas de herramientas y archivos. Etiqueta visible: M-14.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F06_Estanteria.jpeg', 3),
    (17, 'F14', 'fotografia', 'Caja de archivo', 'Caja de conservación en el depósito. La etiqueta de clasificación está parcialmente cubierta.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F14_Caja.jpeg', 3),
    (18, 'F04', 'fotografia', 'Esteban Morales', 'Director del Archivo Municipal, 48 años. Supervisó el proyecto de digitalización de 2022.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F04_Esteban.jpg', 3),
    (19, 'A06', 'audio', 'Ambiente – Archivo Municipal', 'Registro sonoro ambiental del Archivo Municipal.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/03_AUDIOS/A06_ArchivoMunicipal.mp3', 3),
    (20, 'D06', 'documento', 'Nota manuscrita de Daniel', '«Una nota para quien encuentre esto». Fecha estimada: 15/10/2025. Ocho frases que parecen consejos.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D06_CartaMensajeOculto.pdf', 4),
    (21, 'F08B', 'fotografia', 'Hoja de contactos', 'Hoja de contactos con ocho fotografías numeradas del 01 al 08.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F08_HojaContactos.jpeg', 4),
    (22, 'D09', 'documento', 'Registro del material fotográfico', 'Ficha descriptiva de las ocho fotografías de la hoja de contactos.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D09_Registro_MaterialFotograficoDaniel.pdf', 4),
    (23, 'A03', 'audio', 'Conversación entre Daniel y Esteban', 'Grabación de una conversación entre Daniel Herrera y Esteban Morales.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/03_AUDIOS/A03_ConversacionDanielYEsteban.mp3', 4),
    (24, 'D07', 'documento', 'Registro de comunicaciones', 'Mensajes del teléfono personal de Daniel entre el 14/10/2025 y el 16/10/2025.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D07_RegistroComunicaciones.pdf', 5),
    (25, 'A04', 'audio', 'Mensaje de Andrés', 'Mensaje de voz de Andrés Herrera incorporado al expediente.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/03_AUDIOS/A04_MensajeAndres.mp3', 5),
    (26, 'D11', 'documento', 'Declaración de Andrés Herrera', 'Entrevista del 22/10/2025. Andrés corrige su primera declaración.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D11_DeclaracionAndres.pdf', 6),
    (27, 'D12', 'documento', 'Declaración de Laura Méndez', 'Declaración testimonial del 20/10/2025 sobre el sobre recibido el 12 de octubre.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D12_DeclaracionLaura.pdf', 6),
    (28, 'D08', 'documento', 'Comprobante de viaje RC-15829', 'Recibo de Transportes Ruta Central a nombre de Daniel Herrera, encontrado entre sus documentos personales.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D08_ReciboTransporte.pdf', 6),
    (29, 'F10', 'fotografia', 'Puerta – Estudio 3B', 'Puerta de madera del Archivo Municipal con placa «ESTUDIO 3B».', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F10_Puerta.jpeg', 7),
    (30, 'F13', 'fotografia', 'Negativo 08', 'El negativo que faltaba en la caja del apartamento. Muestra una calle histórica de San Jerónimo.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F13_Negativo.jpeg', 7),
    (31, 'F15', 'fotografia', 'Mesa de trabajo del Estudio 3B', 'Libros de registro abiertos, copias fotográficas y una lupa sobre la mesa.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/01_FOTOGRAFIAS/F15_MesaTrabajo.jpeg', 7),
    (32, 'D10', 'documento', 'Carta de Daniel y transcripción A01', 'Documentos de cierre: carta de Daniel (20/10/2025) y transcripción de su mensaje de voz.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D10_CartaTrascripcionFinal.pdf', 7),
    (33, 'A01', 'audio', 'Mensaje de voz de Daniel', 'Mensaje grabado por Daniel. Su transcripción está en la Parte II de D10.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/03_AUDIOS/A01_MensajeVozDaniel.mp3', 7),
    (34, 'A08', 'audio', 'Interferencia en la grabación', 'Grabación con interferencias recuperada junto al material de Daniel.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/03_AUDIOS/A08_InterferenciaGrabacion.mp3', 7),
    (35, 'D13', 'documento', 'Declaración de Esteban Morales', 'Entrevista formal del 21/10/2025 al director del Archivo Municipal.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D13_DeclaracionEstebanMorales.pdf', 7),
    (36, 'D14', 'documento', 'Registro original de modificaciones', 'Control administrativo de cambios en documentos digitalizados. Copia para expediente del registro original.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/02_DOCUMENTOS/D14_RegistroOriginalModificaciones.pdf', 8),
    (37, 'A05', 'audio', 'Grabación final de Daniel', 'Última grabación de Daniel Herrera incorporada al expediente.', 'assets/EXPEDIENTE_001_EL_ULTIMO_REGISTRO/03_AUDIOS/A05_GrabacionFinalDaniel.mp3', 9)
ON CONFLICT (id) DO UPDATE SET codigo = EXCLUDED.codigo, tipo = EXCLUDED.tipo, titulo = EXCLUDED.titulo,
    contenido = EXCLUDED.contenido, archivo = EXCLUDED.archivo, desbloqueada_por = EXCLUDED.desbloqueada_por;

-- Acertijos (evidencia_id = evidencia sobre la que se plantea)
INSERT INTO acertijo (id, codigo, titulo, pregunta, evidencia_id) VALUES
    (1, 'AC-01', 'La pieza que falta', 'El inventario del apartamento (D02) se comparó con las notas del cuaderno de Daniel. ¿Qué número tiene el negativo que no fue localizado?', 5),
    (2, 'AC-02', 'El sobre', 'Según el diario de Daniel (D03), ¿a quién le entregó un sobre para que lo conservara?', 7),
    (3, 'AC-03', 'Dos fechas para un mismo registro', 'En los correos (D05), Daniel menciona un registro que tiene dos fechas diferentes. ¿Qué número de registro es?', 12),
    (4, 'AC-04', 'La anotación secundaria', 'En el registro de digitalización (D04), ¿qué fecha figura en la anotación secundaria de la fotografía 023? (DD/MM/AAAA)', 14),
    (5, 'AC-05', 'Lo que la nota no dice', 'La nota de Daniel (D06) esconde una palabra. ¿Cuál es?', 20),
    (6, 'AC-06', 'Después del 15 de octubre', 'Según el registro de comunicaciones (D07), ¿en qué fecha volvió a comunicarse Daniel con Andrés después de haber salido del apartamento? (DD/MM/AAAA)', 24),
    (7, 'AC-07', 'Asiento reservado', 'El número de asiento del comprobante de viaje (D08) coincide con una de las fotografías de la hoja de contactos. ¿Qué lugar aparece en esa fotografía?', 28),
    (8, 'AC-08', 'Antes de validar', 'El registro de digitalización (D04), la nota de Daniel (D06) y su carta (D10) repiten la misma instrucción. En una palabra: ¿qué hay que buscar del registro 023 antes de validarlo?', 32),
    (9, 'AC-09', 'El último registro', 'Según el registro original de modificaciones (D14), ¿quién autorizó la modificación del registro 023?', 36)
ON CONFLICT (id) DO UPDATE SET codigo = EXCLUDED.codigo, titulo = EXCLUDED.titulo,
    pregunta = EXCLUDED.pregunta, evidencia_id = EXCLUDED.evidencia_id;

-- Respuestas aceptadas (orden 1 = respuesta canónica, la que revela la tercera pista)
DELETE FROM respuesta_aceptada;
INSERT INTO respuesta_aceptada (acertijo_id, orden, respuesta) VALUES
    (1, 1, '08'),
    (1, 2, '8'),
    (1, 3, 'negativo 08'),
    (1, 4, 'negativo 8'),
    (2, 1, 'Laura'),
    (2, 2, 'Laura Mendez'),
    (3, 1, '023'),
    (3, 2, '23'),
    (3, 3, 'registro 023'),
    (3, 4, 'registro 23'),
    (4, 1, '15/04/2022'),
    (4, 2, '15/4/2022'),
    (4, 3, '15 de abril de 2022'),
    (4, 4, '15 de abril'),
    (5, 1, 'negativo'),
    (5, 2, 'el negativo'),
    (6, 1, '16/10/2025'),
    (6, 2, '16/10'),
    (6, 3, '16 de octubre de 2025'),
    (6, 4, '16 de octubre'),
    (7, 1, 'Estudio 3B'),
    (7, 2, '3B'),
    (7, 3, 'el estudio 3B'),
    (8, 1, 'original'),
    (8, 2, 'el original'),
    (8, 3, 'registro original'),
    (8, 4, 'soporte original'),
    (8, 5, 'documento original'),
    (8, 6, 'el registro original'),
    (8, 7, 'el soporte original'),
    (8, 8, 'el documento original'),
    (9, 1, 'Esteban Morales'),
    (9, 2, 'E. Morales'),
    (9, 3, 'E Morales'),
    (9, 4, 'Morales');

-- Pistas (orden 1 y 2 por acertijo)
INSERT INTO pista (id, acertijo_id, orden, descripcion) VALUES
    (1, 1, 1, 'Lee las «Observaciones particulares» del inventario: allí se cruza la caja de negativos con el cuaderno.'),
    (2, 1, 2, 'Es un número de dos cifras. La caja tiene un hueco compatible con su tamaño.'),
    (3, 2, 1, 'Busca la entrada del 12 de octubre de 2025 en el diario.'),
    (4, 2, 2, 'Es la restauradora documental, amiga de Daniel desde hace años.'),
    (5, 3, 1, 'El asunto del tercer correo es bastante directo.'),
    (6, 3, 2, 'Responde con el número de tres cifras del registro.'),
    (7, 4, 1, 'Compara las columnas «Fecha oficial» y «Anotación secundaria»: solo una fila no coincide.'),
    (8, 4, 2, 'La fecha oficial es 12/04/2022. Busca la otra.'),
    (9, 5, 1, 'La nota tiene ocho frases. No importa tanto lo que dicen como la forma en que empiezan.'),
    (10, 5, 2, 'Lee la primera letra de cada frase, de arriba abajo. El inventario ya mencionó este objeto.'),
    (11, 6, 1, 'Fíjate en el último intercambio del registro y en la observación del investigador.'),
    (12, 6, 2, 'Es el día siguiente al último contacto conocido. Formato DD/MM/AAAA.'),
    (13, 7, 1, 'Busca el número de asiento en el comprobante. Ya has visto ese número antes en este caso.'),
    (14, 7, 2, 'En la hoja de contactos (F08B) o en su ficha (D09), localiza la fotografía con ese número y lee la placa de la puerta.'),
    (15, 8, 1, 'D04 tiene una nota manuscrita al margen; D06 habla de copias; D10 pide buscar el «soporte» del registro.'),
    (16, 8, 2, 'Una sola palabra: lo contrario de una copia.'),
    (17, 9, 1, 'Lee la sección «Constancia de autorización» al final del registro.'),
    (18, 9, 2, 'Escribe el nombre completo de quien figura como responsable. Compáralo con la firma.')
ON CONFLICT (id) DO UPDATE SET acertijo_id = EXCLUDED.acertijo_id, orden = EXCLUDED.orden, descripcion = EXCLUDED.descripcion;

-- Personas del caso (ficha que muestra el menú SOSPECHOSOS)
INSERT INTO persona (id, evidencia_id, nombre, edad, rol) VALUES
    (1, 2, 'Daniel Herrera', 32, 'Fotógrafo documental. Persona desaparecida.'),
    (2, 3, 'Andrés Herrera', 35, 'Hermano de Daniel. Denunciante.'),
    (3, 10, 'Laura Méndez', 29, 'Restauradora documental. Amiga de Daniel.'),
    (4, 18, 'Esteban Morales', 48, 'Director del Archivo Municipal de San Jerónimo.')
ON CONFLICT (id) DO UPDATE SET evidencia_id = EXCLUDED.evidencia_id, nombre = EXCLUDED.nombre,
    edad = EXCLUDED.edad, rol = EXCLUDED.rol;

COMMIT;
