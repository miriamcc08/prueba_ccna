# Reiniciar un ejercicio de estudio

El botón **Reiniciar ejercicio** aparece después de confirmar una respuesta en modo estudio. También está disponible al revisar una pregunta respondida de un estudio terminado.

Reiniciar crea otro intento con una sola pregunta, sin cronómetro. Conserva idioma, preferencia de explicaciones y sonido. No borra ni cambia la selección, captura, tiempo o resultados del intento anterior. La práctica nueva cuenta como un intento independiente cuando se termina; puede aparecer por separado en el historial y contribuir al diagnóstico del estudiante.

La práctica toma la **versión actualmente aprobada** de la misma pregunta, con una nueva captura y orden de alternativas. Esto permite utilizar correcciones aprobadas sin modificar el contenido histórico. Si la pregunta volvió a revisión, fue rechazada o cambió de versión de temario, el servidor rechaza el reinicio. No genera una variante ni añade preguntas al banco.

El enlace **Volver al intento original** se conserva al recargar. Si el original sigue activo, permite continuar; si ya terminó, lleva a sus resultados mediante el recorrido normal de recuperación. La práctica nueva permanece guardada como otro intento.

## Límites y permisos

- Solo se reinician preguntas ya respondidas pertenecientes al intento indicado.
- El origen debe ser un estudio sin modo estricto, activo o completado. No se habilita para intentos configurados, abandonados o caducados.
- Una cuenta solo puede reiniciar sus propios ejercicios. Un administrador que consulta el intento ajeno no puede crear prácticas en el historial del estudiante mediante esta operación.
- Las sesiones invitadas conservan su condición invitada y la protección existente mediante identificador opaco. El reinicio no las convierte silenciosamente en intentos de una cuenta.
- Cada respuesta confirmada sigue siendo inmutable. Para responder de nuevo, se utiliza el intento independiente.
- Si falla la solicitud, permanece la pantalla original y se muestra el error. No se limpia la respuesta antes de que el servidor confirme el nuevo intento.

API: `POST /api/exams/:id/restart-exercise`, cuerpo `{ "examQuestionId": "identificador-de-la-pregunta-del-intento" }`. Devuelve `201` y el estado del nuevo intento configurado. La interfaz lo inicia mediante el flujo existente. La propiedad `config.practiceSourceExamId` se crea en servidor para enlazar el origen; no concede permisos sobre él.

El límite por pregunta del origen no se hereda: la práctica reiniciada es sin cronómetro. El origen conserva sus plazos. Ver [tiempo-por-pregunta.md](tiempo-por-pregunta.md).
