# Requisitos funcionales y no funcionales — revisión individual

Fecha inicial: 11/11/2026. Este registro recoge decisiones requisito por requisito. La matriz anterior de 70 requisitos es una fuente de propuestas, no una aprobación global. Las fases se asignan para planificar después de decidir el alcance.

**RF** describe comportamientos del sistema. **RNF** describe condiciones de calidad como seguridad, rendimiento, accesibilidad, compatibilidad y recuperación. Un requisito funcional puede incluir reglas de seguridad; los RNF desarrollarán sus condiciones transversales sin eliminar lo ya acordado.

Aceptar la definición de un requisito no certifica que su implementación haya pasado la aceptación. Cada requisito conserva dos estados separados: decisión de alcance y verificación del producto. No se reejecutan pruebas de aplicación para registrar una decisión documental.

## RF-01 — Registro de usuarios

**Tipo:** funcional. **Decisión:** aceptado expresamente por la propietaria el 11/11/2026. **Verificación del producto:** pendiente de vincular evidencia y comprobar aceptación local. **Relación con la matriz anterior:** RS-01 y RA-05; fases originales 6 y 7.

La aplicación permitirá crear una cuenta introduciendo correo electrónico, nombre de usuario y contraseña.

Reglas aceptadas:

- El correo y el nombre de usuario no pueden repetirse.
- El registro siempre asigna el rol `user`.
- Nadie puede registrarse directamente como `admin` o `superadmin`.
- Las contraseñas se almacenan mediante un hash seguro.

**Criterio de aceptación:** una persona puede registrarse e iniciar sesión; los datos duplicados o inválidos se rechazan con un mensaje claro y nunca se conceden permisos administrativos.

La respuesta «acepto» se refiere exclusivamente a este requisito con las reglas presentadas. No aprueba otros requisitos ni fija nuevos límites de contraseña o verificación de correo.

## RF-02 — Inicio y cierre de sesión

**Tipo:** funcional. **Decisión:** aceptado expresamente por la propietaria el 11/11/2026 mediante «si me gusta, lo acepto». **Verificación del producto:** pendiente de vincular evidencia y comprobar aceptación local. **Relación con la matriz anterior:** RS-01 y RA-06; fases originales 6 y 7.

El usuario podrá iniciar sesión con correo y contraseña, y cerrar su sesión desde la aplicación.

Reglas aceptadas:

- Solo podrán iniciar sesión cuentas activas con credenciales correctas.
- El sistema reconocerá el rol actual de la cuenta: `user`, `admin` o `superadmin`.
- Credenciales incorrectas producirán un mensaje sin revelar si el correo existe.
- Al cerrar sesión, la aplicación eliminará las credenciales locales de esa sesión y exigirá autenticación para acceder a funciones protegidas.

**Criterio de aceptación:** una cuenta activa accede con sus credenciales y permisos correspondientes; credenciales incorrectas o una cuenta desactivada no permiten acceso. Después de cerrar sesión, la aplicación solicita autenticación al intentar abrir una función protegida.

El cierre de todas las sesiones o la revocación en servidor de un token copiado requieren definición separada; RF-02 no los da por aprobados ni implementados.

## Pendientes del proceso de requisitos

Clasificar y presentar el resto de RF y RNF individualmente. Para cada uno, registrar: aceptar, modificar, diferir o descartar. Los RNF tendrán criterios medibles y valores acordados; no se asignan tiempos de respuesta, carga o compatibilidad sin decisión explícita. RF-01, RF-02, RF-03, RF-04, RF-05 y RF-06 están aceptados en su definición. RF-07 y siguientes no se incorporan al alcance aprobado hasta recibir respuesta.

## RF-03 — Configuración del examen

**Tipo:** funcional. **Decisión:** aceptado expresamente por la propietaria el 11/11/2026 mediante «si me gusta». **Verificación del producto:** pendiente de vincular evidencia y comprobar aceptación local. **Relación con la matriz anterior:** RE-01 y RE-03; fase original 2.

Antes de iniciar, el usuario podrá configurar cantidad de preguntas, duración, idioma (español o inglés), dificultad y temas.

Reglas aceptadas:

- Mostrar las opciones disponibles y un resumen de la configuración antes de confirmar el inicio.
- Comprobar la disponibilidad de preguntas aprobadas y activas compatibles con los filtros, sin repetir familias equivalentes.
- Si no alcanza la disponibilidad, informar el límite y permitir ajustar la configuración; no reducir la cantidad ni cambiar filtros silenciosamente.
- No permitir cambiar la configuración del intento una vez iniciado.

**Criterio de aceptación:** al elegir y confirmar una configuración válida, el examen utiliza la cantidad, idioma, dificultad y temas acordados y aplica la duración elegida. Si faltan preguntas, no inicia con una configuración diferente y explica qué debe ajustarse.

Las modalidades y las reglas de examen estricto/estudio se revisarán como requisitos separados. Esta aceptación no fija parámetros numéricos nuevos.

## RF-04 — Modalidades de práctica

**Tipo:** funcional. **Decisión:** aceptado expresamente por la propietaria el 11/11/2026 mediante «si acepto». **Verificación del producto:** pendiente de vincular evidencia y comprobar aceptación local. **Relación con la matriz anterior:** RE-02 y RR-04; fase original 2.

El usuario podrá elegir entre simulacro completo, práctica por tema, examen personalizado, repaso de errores, práctica de subnetting, práctica de comandos y práctica de troubleshooting.

Reglas aceptadas:

- Cada modalidad seleccionará preguntas que correspondan realmente a su propósito y respetará la configuración compatible aceptada en RF-03.
- El repaso de errores utilizará fallos del historial del usuario y conservará el intento original.
- Si no hay historial o preguntas suficientes, se informará y se permitirá elegir otra configuración; no se inventarán preguntas ni resultados.

**Criterio de aceptación:** al elegir una modalidad, las preguntas cumplen sus filtros; el repaso de errores corresponde al historial propio. Cuando no existe material compatible, la aplicación explica el motivo sin iniciar una práctica diferente de la elegida.

Este requisito define modalidades de contenido; las reglas de navegación, respuestas y reloj del modo estricto y del modo estudio se revisarán por separado. No autoriza generar más preguntas ni reanuda la meta de 1000.

## RF-05 — Examen estricto

**Tipo:** funcional. **Decisión:** aceptado expresamente por la propietaria el 11/11/2026 mediante «acpeto». **Verificación del producto:** pendiente de vincular evidencia y comprobar aceptación local. **Relación con la matriz anterior:** RE-04, RE-05 y RS-02; fase original 2.

El usuario podrá realizar un examen con reglas de avance y confirmación obligatoria.

Reglas aceptadas:

- Mostrar una pregunta a la vez y exigir seleccionar y confirmar la respuesta antes de continuar.
- En selección múltiple, exigir exactamente el número de alternativas indicado.
- No permitir saltar preguntas, retroceder ni cambiar respuestas confirmadas.
- No revelar aciertos, errores, claves ni explicaciones del intento hasta finalizarlo.
- Mantener la configuración confirmada y el plazo del servidor aunque se recargue la página.
- Al agotarse el tiempo total o el límite por pregunta, si está activado, registrar como no respondidas las preguntas cuyo plazo haya terminado y avanzar o finalizar según corresponda, sin exigir selección. Esta es la excepción temporal al avance por confirmación.
- Aplicar estas reglas también en el servidor ante peticiones manipuladas.

**Criterio de aceptación:** en un intento estricto, solo se avanza tras confirmar una selección válida o por vencimiento del plazo aplicable; una respuesta confirmada no se modifica. Recargar no reinicia el reloj; al caducar el examen se cierra y conserva las respuestas guardadas para calcular el resultado. La API del intento no revela soluciones antes de finalizar.

El reloj y su recuperación se detallarán en un requisito separado. La política sobre consulta paralela del banco sigue como decisión abierta DEC-03; este requisito no promete controlar otras pestañas o dispositivos.

## RF-06 — Modo de estudio

**Tipo:** funcional. **Decisión:** aceptado expresamente por la propietaria el 11/11/2026 mediante «si tambien acepto». **Verificación del producto:** pendiente de vincular evidencia y comprobar aceptación local. **Relación con la matriz anterior:** RE-06, RR-04 y RL-01; fase original 2.

El usuario podrá practicar en modo de estudio, consultar las soluciones después de confirmar y repasar lo aprendido.

Reglas aceptadas:

- Mostrar la respuesta correcta y su explicación después de confirmar, cuando esté activada la opción de explicaciones.
- Permitir regresar a preguntas ya respondidas para revisar su selección y explicación, sin modificar respuestas confirmadas.
- Permitir practicar sin cronómetro.
- Permitir consultar referencias técnicas y guardar favoritas personales al iniciar sesión.
- Cambiar de tema o reiniciar un ejercicio creará una práctica nueva y conservará el intento anterior.
- Utilizar solo preguntas aprobadas y activas; informar cuando no haya contenido disponible.

**Criterio de aceptación:** el usuario confirma una respuesta y puede consultar su solución y explicación, volver a respuestas anteriores y practicar sin reloj. Cambiar de tema o reiniciar abre una práctica independiente sin alterar las respuestas ni resultados anteriores; las favoritas se asocian a su propia cuenta.

Las variantes recalculadas requieren un requisito separado. RF-06 no autoriza generar preguntas nuevas ni levantar la pausa del banco. Los plazos opcionales se regirán por el requisito de cronómetro.

## RF-07 — Cronómetro y recuperación de sesiones (propuesto para revisión)

**Tipo:** funcional. **Decisión:** pendiente. **Verificación del producto:** pendiente. **Relación con la matriz anterior:** RE-05 y RE-09; fase original 2.

La aplicación mostrará el tiempo restante y permitirá recuperar un intento interrumpido sin perder respuestas confirmadas ni ampliar el plazo.

Reglas propuestas:

- Mostrar minutos y segundos y un aviso cuando quede poco tiempo.
- Calcular el plazo mediante marcas temporales del servidor; recargar o desconectarse no reinicia ni pausa el reloj.
- Al reconectar, recuperar el mismo intento y sus respuestas confirmadas; una selección que no llegó a confirmarse no se considera guardada.
- Si el plazo total venció, cerrar el examen con las respuestas guardadas y marcar las restantes como no respondidas.
- Permitir un límite opcional por pregunta: al vencer, registrar como no respondida y avanzar o finalizar según corresponda. No reactivar su plazo al recargar.
- Registrar tiempo total y por pregunta. El estudio sin cronómetro no aplica límites ni caducidad temporal.

**Criterio de aceptación:** recargar o interrumpir la conexión conserva el plazo original y las respuestas confirmadas. Al reconectar, se recupera el intento si sigue vigente o se obtiene su cierre por caducidad; nunca se otorga tiempo adicional. El límite por pregunta, cuando está activado, tampoco se reinicia.

La recuperación presupone conservar el identificador o acceso al intento en el mismo navegador o mediante su cuenta según corresponda; no se promete recuperar una sesión anónima si se pierde su identificador. El umbral concreto del aviso se acordará antes de cerrar la aceptación de este requisito.
