# Cambiar de tema durante estudio

En un intento de estudio, pulsa **Cambiar de tema**, elige un tema y la cantidad de preguntas, y confirma con **Iniciar práctica del tema**. Se crea otra práctica; no se cambia el conjunto de preguntas del intento iniciado.

El formulario comprueba las familias aprobadas realmente disponibles para el tema y dificultad actuales. No usa los conteos generales como si fueran disponibilidad elegible. Si no hay preguntas, indica cero y deshabilita iniciar. Si falla la consulta, muestra el error, bloquea el inicio y permite **Reintentar disponibilidad**. No sustituye un tema vacío por otro ni reduce silenciosamente la cantidad.

La nueva práctica conserva idioma del examen, dificultad, duración configurada, estudio, preferencia sin tiempo, explicaciones y sonido. Si el origen tenía límite por pregunta y no era sin tiempo, lo conserva. El número se elige de nuevo (1 a 200, limitado por disponibilidad), el orden es aleatorio y el modo nuevo es práctica por tema. Se utilizan preguntas aprobadas para la versión actualmente seleccionada por el motor; no se deduce la vigencia oficial del temario.

## Conservación del intento anterior

No se sobrescriben las respuestas confirmadas, capturas o filtros del original ni se reinician sus fechas límite. Su estado y resultado pueden evolucionar por el avance normal o los vencimientos de sus relojes. Se guarda una referencia al origen inmediato y aparece **Volver al intento original**, que permanece tras recargar. No es una pausa: si el original tenía reloj, sigue avanzando y puede caducar mientras practicas el nuevo tema. Cada práctica es otro intento y aparece por separado al completarse si pertenece a una cuenta.

Solo el propietario puede crear prácticas desde sus intentos asociados a cuenta, aunque un administrador tenga permiso para consultarlos. Los invitados conservan su condición invitada y su protección mediante identificador opaco. El servidor exige un estudio sin modo estricto y estado activo o completado; no admite esta operación sobre un examen estricto, configurado, caducado o abandonado. La interfaz ofrece el formulario durante la pantalla de estudio; la API admite también un estudio completado.

El servidor vuelve a comprobar elegibilidad al crear; una aprobación retirada entre consulta y envío puede producir un rechazo. La interfaz conserva el original y muestra el error. Cambiar de tema no genera variantes ni preguntas nuevas.

API: `POST /api/exams/:id/change-study-topic`, cuerpo `{ "topicId": "identificador-del-tema", "questionCount": 1 }`. Cantidad opcional (predeterminada 1); entero de 1 a 200. Devuelve `201` y estado del nuevo intento configurado; la interfaz usa su arranque normal. El tema se recibe por ID, no por texto libre ni código supuesto.
