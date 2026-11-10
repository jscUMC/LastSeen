-- Last Seen · Esquema PostgreSQL
-- Catálogo del expediente: evidencia, acertijo, respuesta_aceptada, pista, persona.
-- Datos de cada partida: investigacion, acertijo_resuelto, intento, pista_usada, progreso.
-- El ranking es una vista sobre las investigaciones finalizadas.

-- ---------- CATÁLOGO DEL EXPEDIENTE ----------

CREATE TABLE evidencia (
    id               INTEGER PRIMARY KEY,
    codigo           VARCHAR(10)  NOT NULL UNIQUE,
    tipo             VARCHAR(12)  NOT NULL CHECK (tipo IN ('documento', 'fotografia', 'audio')),
    titulo           VARCHAR(120) NOT NULL,
    contenido        TEXT         NOT NULL,
    archivo          VARCHAR(255) NOT NULL,
    desbloqueada_por INTEGER      -- acertijo que la revela; NULL = visible desde el inicio
);

CREATE TABLE acertijo (
    id           INTEGER PRIMARY KEY,
    codigo       VARCHAR(10)  NOT NULL UNIQUE,
    titulo       VARCHAR(120) NOT NULL,
    pregunta     TEXT         NOT NULL,
    -- evidencia sobre la que se plantea (una evidencia plantea a lo sumo un acertijo)
    evidencia_id INTEGER      NOT NULL UNIQUE
        REFERENCES evidencia (id) DEFERRABLE INITIALLY DEFERRED
);

-- evidencia y acertijo se referencian mutuamente; por eso esta llave se agrega después
ALTER TABLE evidencia
    ADD CONSTRAINT evidencia_desbloqueada_por_fkey
    FOREIGN KEY (desbloqueada_por) REFERENCES acertijo (id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE respuesta_aceptada (
    acertijo_id INTEGER     NOT NULL REFERENCES acertijo (id) ON DELETE CASCADE,
    orden       SMALLINT    NOT NULL,   -- 1 = respuesta canónica
    respuesta   VARCHAR(80) NOT NULL,
    PRIMARY KEY (acertijo_id, orden)
);

CREATE TABLE pista (
    id          INTEGER  PRIMARY KEY,
    acertijo_id INTEGER  NOT NULL REFERENCES acertijo (id),
    orden       SMALLINT NOT NULL,
    descripcion TEXT     NOT NULL,
    UNIQUE (acertijo_id, orden)
);

CREATE TABLE persona (
    id           INTEGER      PRIMARY KEY,
    evidencia_id INTEGER      NOT NULL UNIQUE REFERENCES evidencia (id),
    nombre       VARCHAR(80)  NOT NULL,
    edad         SMALLINT     NOT NULL,
    rol          VARCHAR(160) NOT NULL
);

-- ---------- PARTIDAS ----------

CREATE TABLE investigacion (
    id                 INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_usuario     VARCHAR(40) NOT NULL,
    fecha_inicio       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_finalizacion TIMESTAMPTZ,
    tiempo_utilizado   BIGINT,     -- milisegundos, se fija al finalizar
    estado             VARCHAR(12) NOT NULL DEFAULT 'EN_PROGRESO'
        CHECK (estado IN ('EN_PROGRESO', 'FINALIZADA'))
);

CREATE TABLE acertijo_resuelto (
    investigacion_id INTEGER     NOT NULL REFERENCES investigacion (id) ON DELETE CASCADE,
    acertijo_id      INTEGER     NOT NULL REFERENCES acertijo (id),
    fecha            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (investigacion_id, acertijo_id)
);

CREATE TABLE intento (
    id               INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    investigacion_id INTEGER      NOT NULL REFERENCES investigacion (id) ON DELETE CASCADE,
    acertijo_id      INTEGER      NOT NULL REFERENCES acertijo (id),
    respuesta        VARCHAR(200) NOT NULL,
    correcta         BOOLEAN      NOT NULL,
    fecha            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX intento_investigacion_acertijo_idx ON intento (investigacion_id, acertijo_id);

CREATE TABLE pista_usada (
    id               INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    investigacion_id INTEGER     NOT NULL REFERENCES investigacion (id) ON DELETE CASCADE,
    acertijo_id      INTEGER     NOT NULL REFERENCES acertijo (id),
    pista_id         INTEGER     NOT NULL REFERENCES pista (id),
    fecha            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (investigacion_id, pista_id)
);

CREATE TABLE progreso (
    investigacion_id         INTEGER     PRIMARY KEY REFERENCES investigacion (id) ON DELETE CASCADE,
    estado                   VARCHAR(12) NOT NULL,
    evidencias_desbloqueadas INTEGER     NOT NULL,
    evidencias_totales       INTEGER     NOT NULL,
    acertijos_resueltos      INTEGER     NOT NULL,
    acertijos_totales        INTEGER     NOT NULL,
    intentos_realizados      INTEGER     NOT NULL,
    pistas_utilizadas        INTEGER     NOT NULL,
    tiempo_investigacion     BIGINT      NOT NULL,   -- milisegundos
    porcentaje_completado    SMALLINT    NOT NULL,
    fecha_guardado           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- RANKING ----------
-- Top 10 por menor tiempo (misma regla que tenía el proyecto en memoria)
CREATE VIEW ranking AS
SELECT nombre_usuario, tiempo_utilizado AS tiempo_total
FROM investigacion
WHERE estado = 'FINALIZADA'
ORDER BY tiempo_utilizado ASC, id ASC
LIMIT 10;
