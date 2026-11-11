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

Clasificar y presentar el resto de RF y RNF individualmente. Para cada uno, registrar: aceptar, modificar, diferir o descartar. Los RNF tendrán criterios medibles y valores acordados; no se asignan tiempos de respuesta, carga o compatibilidad sin decisión explícita. RF-01 a RF-37 están aceptados en su definición. RF-38 y siguientes no se incorporan al alcance aprobado hasta recibir respuesta.

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

## RF-07 — Cronómetro y recuperación de sesiones

**Tipo:** funcional. **Decisión:** aceptado por la propietaria el 11/11/2026 mediante «si, acetp», solicitando continuar con bloques de diez. **Verificación del producto:** pendiente de vincular evidencia y comprobar aceptación local. **Relación con la matriz anterior:** RE-05 y RE-09; fase original 2.

La aplicación mostrará el tiempo restante y permitirá recuperar un intento interrumpido sin perder respuestas confirmadas ni ampliar el plazo.

Reglas aceptadas:

- Mostrar minutos y segundos y un aviso cuando quede poco tiempo.
- Calcular el plazo mediante marcas temporales del servidor; recargar o desconectarse no reinicia ni pausa el reloj.
- Al reconectar, recuperar el mismo intento y sus respuestas confirmadas; una selección que no llegó a confirmarse no se considera guardada.
- Si el plazo total venció, cerrar el examen con las respuestas guardadas y marcar las restantes como no respondidas.
- Permitir un límite opcional por pregunta: al vencer, registrar como no respondida y avanzar o finalizar según corresponda. No reactivar su plazo al recargar.
- Registrar tiempo total y por pregunta. El estudio sin cronómetro no aplica límites ni caducidad temporal.

**Criterio de aceptación:** recargar o interrumpir la conexión conserva el plazo original y las respuestas confirmadas. Al reconectar, se recupera el intento si sigue vigente o se obtiene su cierre por caducidad; nunca se otorga tiempo adicional. El límite por pregunta, cuando está activado, tampoco se reinicia.

La recuperación presupone conservar el identificador o acceso al intento en el mismo navegador o mediante su cuenta según corresponda; no se promete recuperar una sesión anónima si se pierde su identificador. El umbral concreto del aviso se acordará antes de cerrar la aceptación de este requisito.

## Bloque RF-08 a RF-17 — aceptados

Cambio de método solicitado por la propietaria: presentar diez requisitos por bloque y permitir decidir por ID. RF-08 a RF-17 fueron aceptados expresamente el 11/11/2026 mediante «acepto todos». Su verificación técnica queda pendiente; la aceptación no certifica implementación. Conservar las decisiones individuales o por selección explícita, sin asumir que el silencio aprueba el resto.

| ID | Requisito funcional aceptado | Criterio de aceptación resumido | Referencia anterior |
|---|---|---|---|
| RF-08 | Resultados del examen: mostrar puntuación, porcentaje, aciertos, errores, no respondidas y tiempos. | Un intento con respuestas conocidas produce los valores esperados al finalizar o caducar; nunca presenta la puntuación como oficial Cisco. | RR-01, RE-07 |
| RF-09 | Revisión explicada: mostrar selección, clave, explicación y referencia de cada pregunta tras finalizar. | La revisión coincide con la versión presentada en el intento, aunque se haya editado después. | RR-02, RC-09 |
| RF-10 | Historial personal: listar intentos con fecha, idioma, configuración y resultado y permitir abrirlos. | Cada cuenta consulta únicamente su historial personal; los datos coinciden con los intentos guardados. | RR-03 |
| RF-11 | Comparación de progreso: comparar intentos por áreas y dificultad. | Usa resultados reales e indica cuando no hay datos suficientes o las versiones/políticas no son comparables. | RR-05 |
| RF-12 | Favoritas: guardar, quitar y filtrar preguntas favoritas de la cuenta. | La selección persiste al iniciar sesión de nuevo y no modifica favoritas ajenas. | RR-04 |
| RF-13 | Banco de preguntas: buscar y filtrar por tema, dificultad, tipo, idioma y estado según permisos. | Los resultados y páginas corresponden a los filtros y respetan los permisos sobre contenido retirado y soluciones. La política de consulta paralela durante estricto sigue pendiente en DEC-03. | RU-05 |
| RF-14 | Crear y editar preguntas: admin/superadmin redactan contenido ES/EN, alternativas, clave, explicación y fuente. | Guardar crea contenido pendiente de revisión; editar conserva versiones usadas en exámenes anteriores. | RA-01 |
| RF-15 | Importar JSON/CSV autorizado con informe de resultados y errores. | Una importación repetida no duplica registros idénticos ni sobrescribe contenido local incompatible; las altas quedan pendientes. | RC-03 |
| RF-16 | Revisar, aprobar y rechazar preguntas con evidencia y auditoría. | Solo administración decide, con notas y referencia; los candidatos no aprobados quedan fuera de exámenes. | RA-02 |
| RF-17 | Retirar y restaurar preguntas con confirmación y motivo. | Retirar excluye de exámenes nuevos conservando historial; restaurar devuelve a pendiente de revisión y registra actor/fecha. | RA-03 |

La aceptación se limita al bloque RF-08 a RF-17 tal como se presentó. La comparación completa o los filtros adicionales no se consideran ya implementados por aprobar su definición. Este bloque no genera nuevas preguntas ni levanta la pausa del banco.

## Bloque RF-18 a RF-27 — aceptados

**Decisión:** RF-18 a RF-27 aceptados expresamente el 11/11/2026 mediante «acepto todas». **Verificación técnica:** pendiente. Esta aceptación no incluye RNF ni futuras ampliaciones. Su aceptación no cambia por sí sola el hito local/avanzado de las referencias anteriores.

| ID | Requisito funcional aceptado | Criterio de aceptación resumido | Referencia anterior |
|---|---|---|---|
| RF-18 | Gestión de usuarios: admin/superadmin crean, consultan, editan y desactivan/restauran cuentas normales. | Desactivar bloquea acceso conservando historial; restaurar devuelve a user; datos inválidos o duplicados no dejan cambios parciales. | RA-04 |
| RF-19 | Gestión de roles: solo superadmin asigna user/admin/superadmin y gestiona cuentas privilegiadas. | Admin no se eleva ni modifica privilegiadas; no se permite cambiar el propio rol o desactivarse ni eliminar el último superadmin activo; los cambios invalidan sesiones anteriores de la cuenta afectada. | RA-05/06 |
| RF-20 | Auditoría administrativa: registrar cambios de cuentas y decisiones editoriales con actor, fecha, motivo y objetivo. | Superadmin puede consultar los cambios de cuentas y administración las revisiones editoriales; no se muestran contraseñas ni hashes. | RA-07, RA-02/03 |
| RF-21 | Recomendaciones de estudio basadas en resultados reales: áreas débiles, errores repetidos y tiempos. | El plan explica su fundamento y permite abrir práctica del tema con contenido aprobado; sin historial se informa que faltan datos. | RL-01/02 |
| RF-22 | Selección de idioma de interfaz y contenido ES/EN. | Cambiar la interfaz no altera idioma, respuestas ni contenido guardado de intentos anteriores; enunciados, opciones y explicaciones tienen versión ES/EN. | RU-03, RI-03, RR-03 |
| RF-23 | Eliminación confirmada del historial propio. | Cancelar conserva datos; confirmar borra únicamente el historial de la cuenta solicitante, nunca el de otras cuentas; se informa que no es reversible desde la interfaz. | RR-03 |
| RF-24 | Gestión editorial de fuentes y licencias por administración. | Permite registrar/editar fuente, URL, consulta y condiciones de reutilización, vinculándolas a preguntas; cambiar el catálogo no reescribe capturas de exámenes anteriores. | RA-08, RC-06 |
| RF-25 | Gestión de familias y duplicados por administración. | Permite relacionar preguntas equivalentes y registrar decisiones; no destruye versiones históricas y evita repetir familias en un examen. | RA-08, RC-08 |
| RF-26 | Ejecución de validadores técnicos desde administración y consulta de resultados. | Muestra qué cálculos/estructuras se verificaron, errores y límites; pasar comprobaciones no aprueba automáticamente la pregunta. | RC-04/05, RA-02 |
| RF-27 | Consulta de cobertura por versión del temario, áreas y subobjetivos. | Muestra preguntas aprobadas, familias y huecos por objetivo, con fuente y fecha del temario; separa candidatas de aprobadas. | RC-07 |

La aceptación se limita a estas diez definiciones y criterios. La comparación adaptativa completa, gestión de fuentes/familias y cobertura pueden requerir desarrollo posterior: aceptación de definición no equivale a entrega. La generación sigue pausada y los RNF se revisarán en bloques separados.

## Bloque RNF-01 a RNF-10 — aceptados

**Tipo:** no funcional. **Decisión:** RNF-01 a RNF-10 aceptados expresamente el 11/11/2026 mediante «acpeto todo». **Verificación técnica:** pendiente. Son condiciones de calidad acordadas para la entrega local; no se consideran ya cumplidas. Se adoptan los objetivos explícitos del bloque. Publicación, carga multiusuario y operación remota se especificarán aparte.

| ID | Requisito no funcional aceptado | Criterio de aceptación acordado | Referencia anterior |
|---|---|---|---|
| RNF-01 | Seguridad de acceso: comprobar identidad, rol y estado vigente en servidor. | Las pruebas de invitado/user/admin/superadmin y cuenta desactivada rechazan todas las operaciones no autorizadas del catálogo de permisos; manipular rol/ID o reutilizar una sesión revocada no concede acceso. | RS-01/02, RA-06 |
| RNF-02 | Protección de secretos y datos personales. | Contraseñas como hash, sin valores reales ni bases personales en archivos publicados; respuestas y registros no revelan hashes, contraseñas o tokens. Revisar archivos nuevos, seguimiento heredado y contenido de la entrega antes de cerrar el requisito, preservando respaldos. | RI-04, RS-03 |
| RNF-03 | Integridad y consistencia. | Pruebas de doble envío, edición, retirada y migración no duplican confirmaciones ni alteran resultados históricos; todas las verificaciones de integridad y claves foráneas de la base de prueba pasan. | RI-02, RE-09, RR-02 |
| RNF-04 | Rendimiento local medible. | En compilación de producción, API en localhost y PC de prueba documentado, al menos 95 % de 30 ejecuciones por operación terminan en 2 segundos o menos: consultar página de banco, abrir pregunta y guardar respuesta. Usar la misma copia del banco disponible y un usuario activo; medir desde envío del cliente hasta respuesta JSON. Documentar equipo, tamaño de datos y resultados; sin carga multiusuario y excluyendo instalación/importación/build/primer arranque. | RP-07 adaptado a L |
| RNF-05 | Compatibilidad local. | Los recorridos de registro, examen, resultados y administración pasan en Windows 11 con Chrome y Edge estables, registrando sus versiones; instalar con la versión compatible de Node documentada. Otros sistemas/navegadores quedan por acordar. | RI-01, RU-04 |
| RNF-06 | Usabilidad y claridad. | Todos los formularios de los recorridos principales identifican campos obligatorios y muestran errores junto al contexto; las operaciones destructivas permiten cancelar sin cambios y los estados de carga/vacío no muestran éxito ficticio. Verificar lista de pantallas por rol. | RU-01/02 |
| RNF-07 | Accesibilidad de los recorridos principales. | Objetivo propuesto WCAG 2.2 AA para registro/login, configuración, examen, resultados y administración: teclado completo, foco visible, nombres accesibles, avisos y contraste mínimo aplicable. Verificar criterios pertinentes con revisión manual y herramientas; un escáner sin alertas no basta para certificar cumplimiento. | RU-04, DEC-04 |
| RNF-08 | Respaldo y recuperación local. | Crear copia consistente antes de cada actualización de esquema y restaurarla en una base separada en 15 minutos o menos, con herramientas ya instaladas. Comprobar cuentas, banco e historial; no sobrescribir la base original durante la prueba. Informar que solo se recupera hasta el momento del respaldo y no prometer pérdida cero de datos posteriores. | RS-04/05, RP-03 |
| RNF-09 | Mantenibilidad y pruebas reproducibles. | Separar cliente/API y centralizar validación/errores; desde una copia limpia, instalar lockfiles, generar cliente/migrar, compilar y pasar las pruebas pertinentes. Todo cambio identifica requisitos y evidencia; las pruebas no modifican la base personal. | RI-01, RS-03/04 |
| RNF-10 | Trazabilidad y actualización PC/GitHub. | Documentar cada entrega y verificar el mismo commit local/remoto tras publicar y hacer pull, registrando archivos modificados sin incluir datos o secretos locales. Si hay diferencias o falta aplicar migraciones, informarlo antes de declarar sincronizado el código. Las cuentas/bases no se replican por Git. | RG-02, RS-05 |

La aceptación de RNF-04/05/07/08 adopta expresamente los objetivos presentados (2 segundos/95 %/30 muestras, Windows 11 Chrome/Edge, WCAG 2.2 AA y restauración de 15 minutos); no afirma que hayan sido medidos o alcanzados. Cambios posteriores de plataforma o umbral requieren registrar una modificación del requisito. No se reanudan generación ni despliegue.

Los RF avanzados se presentaron en el bloque RF-28 a RF-37 y fueron aceptados posteriormente; véase el registro siguiente. La matriz original sigue como referencia para reconciliar cualquier condición aún no decidida.

## Bloque RF-28 a RF-37 — aceptados

**Decisión:** RF-28 a RF-37 aceptados expresamente el 11/11/2026 mediante «acepto todo», en respuesta a ese bloque. **Verificación técnica:** pendiente. La aceptación no levanta la pausa de generación ni obliga a terminarlos en la primera versión local: conservan sus hitos L/A definidos en la matriz, salvo ajuste expreso. La política y límites de RF-30 quedan aceptados tal como se presentaron.

| ID | Requisito funcional aceptado | Criterio de aceptación resumido | Referencia anterior |
|---|---|---|---|
| RF-28 | Generar variantes técnicas con recálculo de parámetros, alternativas y clave. | Mantener familia y parámetros; rechazar ambigüedad y verificar con cálculo independiente antes de aprobar. Generación solo cuando se levante la pausa aplicable. | RB-03 |
| RF-29 | Repetir un ejercicio mediante una variante aprobada disponible. | Crear intento independiente con misma familia y variante distinta, conservando el anterior; informar si no existe una compatible. | RE-10 |
| RF-30 | Configurar la política de puntuación desde superadmin. | Configurar objetivo interno de práctica y habilitar/deshabilitar escala interna 300–1000; mantener porcentaje, peso igual y múltiple exacta. Guardar política por intento y no recalcular históricos ni atribuirla a Cisco. Otros parámetros requieren acuerdo separado. | RE-08 |
| RF-31 | Explicaciones pedagógicas ampliadas por escenario. | Incluir pasos, razón de distractores relevantes, fórmulas/comandos cuando apliquen, ejemplo, referencia, consejo y enlace a refuerzo aprobado disponible; indicar si no hay refuerzo. Amplía RF-09, sin generar contenido nuevo automáticamente. | RC-09 |
| RF-32 | Diagnóstico adaptativo avanzado. | Detectar evolución por dificultad y conceptos confundidos con datos verificables; mostrar fundamento y comparación pertinente sin afirmar conclusiones si faltan datos. Amplía RF-11/21. | RL-02 |
| RF-33 | Seleccionar versión del temario entre las soportadas. | Cada intento conserva versión elegida y selecciona contenido compatible; una versión sin banco suficiente se informa y no se mezcla con otra. | RC-07, RE-03 |
| RF-34 | Informes por lote del banco. | Mostrar creadas, aprobadas, rechazadas, pendientes, duplicados, errores y cobertura; no sumar versiones como conceptos independientes. | RB-02 |
| RF-35 | Continuación de la ampliación por lotes de 50. | Al autorizar su reanudación, continuar desde IDs y revisiones guardados sin duplicar ni sobrescribir conflictos; emitir informe de cada lote. Mientras tanto permanece pausada. | RB-02 |
| RF-36 | Meta posterior de 1000 preguntas aprobadas y distintas. | Contar activas aprobadas y familias/conceptos sustancialmente distintos por separado; candidatas, rechazadas o variantes cosméticas no cumplen la meta. Generación y meta siguen diferidas. | RB-01 |
| RF-37 | Práctica sin cuenta con recuperación limitada. | Permitir recuperar el intento anónimo si se conserva su identificador en el navegador; informar que perderlo puede impedir recuperar la sesión y que no equivale a historial de cuenta entre equipos. | RE-09, RP-06 |

La aceptación se limita a estas diez definiciones y criterios. RF-30 conserva los límites acordados para que su configuración sea verificable. Este bloque no incorpora las ampliaciones opcionales RX (IA conectada, doble factor, reportes, exportaciones o laboratorios interactivos), que siguen sin aprobar.

## Resumen de decisiones al 11/11/2026

- **37 requisitos funcionales:** RF-01 a RF-37 aceptados en su definición.
- **10 requisitos no funcionales:** RNF-01 a RNF-10 aceptados en su definición, incluidos sus objetivos explícitos.
- **47 definiciones aceptadas no equivalen a 47 funciones verificadas.** El cumplimiento del producto requiere evidencia y aceptación técnica por requisito.
- La primera entrega sigue siendo local en el PC. Publicación, carga multiusuario y operación remota no quedan aprobadas por este bloque.
- Generación de preguntas nuevas y variantes permanece pausada; la meta de 1000 y continuación de lotes siguen posteriores. Aceptar su definición no autoriza ejecutarlas ahora.
- Las ampliaciones opcionales RX y las fases nuevas propuestas no reciben aprobación por omisión. Se revisan por separado cuando corresponda.
- Siguiente control: relacionar estas definiciones con los hitos L/A y las fases originales, completar decisiones abiertas de detalle y registrar evidencia de implementación y pruebas. Las condiciones de la matriz de referencia no cubiertas aún deben marcarse pendientes, sin afirmar cierre total del alcance original.
