# Límite de tiempo por pregunta

En Configuración, elige **Límite por pregunta**. La interfaz ofrece 10, 30, 60, 90, 120, 180, 300 o 600 segundos, o desactivado. La API admite cualquier entero de 10 a 600. El resumen muestra la selección antes del inicio.

Se admite en modo estricto y estudio con tiempo. **No se combina con estudio sin cronómetro**: la interfaz elimina/deshabilita el límite al activarlo y el servidor rechaza peticiones contradictorias. Al salir de estudio sin tiempo, la opción vuelve a estar disponible.

## Política de activación y vencimiento

- La primera pregunta se activa al iniciar el intento. La marca `ExamQuestion.activatedAt` se guarda en la base y no se modifica al recargar o repetir el arranque.
- Confirmar activa la siguiente pregunta inmediatamente. En estudio, su plazo corre también mientras se lee la explicación anterior; volver a preguntas anteriores no pausa el reloj de la activa. La interfaz informa esta política.
- El plazo efectivo es el menor entre activación más límite por pregunta y vencimiento total del examen. El límite por pregunta nunca amplía el tiempo total.
- Cuando una pregunta vence, el servidor la registra `timed_out`, sin respuestas elegidas. Cuenta como **no respondida**, sin acierto ni crédito parcial. No se envía automáticamente una selección que estuviera marcada pero no confirmada.
- El servidor avanza en transacción y activa la siguiente. Si era la última, cierra el intento y calcula resultados. Las comprobaciones concurrentes no deben saltar dos preguntas.
- La API devuelve `questionExpiresAt` en el estado y el plazo siguiente en la confirmación para que la pantalla cambie de contador inmediatamente. Esa información no revela la respuesta correcta en modo estricto.

## Desconexión y recuperación

El contador visual no decide la aceptación de respuestas. El servidor comprueba los plazos en cada operación del intento y rechaza respuestas tardías aunque el cliente tenga otro reloj o cambie su interfaz.

Si la conexión se pierde, la pregunta que estaba activa sigue consumiendo tiempo. Al recuperar, si venció se marca sin responder y la siguiente recibe su intervalo a partir de esa reconciliación. **Las preguntas todavía no activadas no consumen intervalos durante la desconexión.** Si entretanto venció el examen completo, se aplica primero ese cierre y las preguntas pendientes quedan sin responder.

No hay un proceso programado que escriba vencimientos mientras no llega ninguna petición: la reconciliación ocurre al consultar o actuar sobre el intento. La pantalla consulta el servidor al alcanzar el plazo y reintenta si no hay conexión, sin depender de que el navegador envíe una respuesta vacía. Las duraciones de preguntas vencidas se limitan a su intervalo efectivo; el tiempo total del intento conserva el tiempo real hasta el cierre, incluida la espera sin conexión.

## Compatibilidad y reinicio de estudio

Los intentos sin límite por pregunta conservan su comportamiento. La migración añade una columna nullable y no cambia respuestas, capturas ni JSON del banco. En registros antiguos con una configuración de límite pero sin activación guardada, la primera reconciliación inicia una marca persistente; no se inventa un momento histórico de activación.

El [reinicio de estudio](reinicio-estudio.md) crea una práctica nueva sin cronómetro, por lo que no hereda el límite por pregunta del intento de origen. El original no se modifica.

La hora visual se calcula en el navegador; un reloj local incorrecto puede afectar la visualización y cuándo solicita sincronización. La aceptación de respuestas y los plazos efectivos se comprueban siempre con la hora del servidor. El temporizador no impide consultar fuentes externas ni representa una garantía de vigilancia de examen.
