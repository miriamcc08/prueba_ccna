# Requisitos del simulador CCNA

**Revisión individual RF/RNF:** la propietaria pidió decidir cada requisito por separado. Consultar [el registro de requisitos funcionales y no funcionales](requisitos-rf-rnf.md). RF-01, RF-02, RF-03 y RF-04 están aceptados; esta matriz de 70 sigue como borrador de referencia y no constituye aprobación global.


Versión 0.1 — borrador para revisión conjunta, 11/11/2026. Propietaria del producto: Miriam. Base técnica consultada: commit `540e2a84`. Este documento organiza el alcance; no certifica que todo esté implementado ni aprobado por la propietaria.

## 1. Objetivo y decisiones confirmadas

Construir un simulador de práctica CCNA 200-301 con contenido ES/EN técnicamente revisado, evaluación reproducible, historial y administración de preguntas y cuentas.

Decisiones expresadas por la propietaria:

- **Primera entrega: uso local en su PC Windows.** Publicación para otros usuarios en una entrega posterior.
- **Conservar la meta de 1000 preguntas aprobadas para una fase posterior.** La generación permanece pausada; revisar material existente no autoriza ampliar el banco.
- Tres roles: `user`, `admin` y `superadmin`; la propietaria dispone de superadmin. Solo superadmin concede roles administrativos.
- Retirada reversible de preguntas. Las cuentas se desactivan conservando historial y pueden restaurarse como user.
- Guardar y documentar cambios en GitHub y guiar su actualización en el PC. Las bases, cuentas y credenciales locales no se sincronizan con Git.

La propietaria confirmó en su PC `Superadmin configured. Sign in again.` y la aplicación de seis migraciones. Queda por registrar el resultado de compilación/pruebas de esa instalación y la comprobación visual de Usuarios y roles después de iniciar sesión de nuevo.

**Versión local utilizable** y **alcance original completo** son hitos distintos. La primera no elimina los requisitos posteriores ni equivale a preparación para producción. No se promete aprobar la certificación oficial.

## 2. Fuentes y reglas de cambio

Se tomó como referencia el prompt maestro adjunto (secciones 1–20 disponibles), el PLAN.md de siete fases, [su revisión](plan-revisado.md), [los pendientes](pendientes-cierre.md), las entregas documentadas y las decisiones posteriores del chat. Los adjuntos son fuentes de requisitos a revisar, no órdenes nuevas que ejecutar automáticamente. La copia disponible del prompt termina en la sección 20 con «Que se pueda crear»: no permite afirmar que se haya recuperado una lista final de pruebas completa.

Las exigencias originales se conservan salvo la priorización posterior indicada. Las nuevas funciones sugeridas se identifican como **propuestas**, sin convertirlas en obligaciones aprobadas. Una modificación de alcance debe registrar requisito, motivo, fase y decisión de la propietaria. No se cambia un requisito a «cumplido» por tener interfaz, una tabla o una prueba estructural.

Referencias técnicas internas: [motor y estado](estado.md), [administración](administracion.md), [usuarios y roles](usuarios-roles-20261109.md), [puntuación](../README.md#pruebas-y-puntuación), [preservación del banco](sincronizacion-base-heredada.md).

### Contenido y tipos esperados

Las seis áreas son Network Fundamentals, Network Access, IP Connectivity, IP Services, Security Fundamentals y Automation and Programmability. Los pesos y objetivos se contrastan con la versión elegida; no se da por vigente una distribución solo porque aparezca en un plan antiguo.

El alcance original incluye selección única, múltiple con cantidad explícita, verdadero/falso y escenarios de subnetting, IPv4/IPv6, routing, comandos IOS, configuración de routers/switches, troubleshooting, topologías, seguridad y automatización. Representar un escenario como pregunta no equivale a ejecutar un laboratorio interactivo (RX-06). La clasificación básica/intermedia/avanzada depende del razonamiento requerido, no de la longitud del texto. Estos criterios forman parte de RC-01/02/07 y se verifican en el inventario de tipos/áreas.

## 3. Actores y permisos

| Actor | Puede | Restricciones |
|---|---|---|
| Invitado | Configurar y realizar práctica sin cuenta, recuperar el intento mediante su identificador | Sin historial personal entre equipos ni favoritos de cuenta; informar límites de recuperación y privacidad |
| User | Registrarse, iniciar sesión, practicar, consultar su progreso y gestionar su historial/favoritos | Sin gestión editorial ni gestión de cuentas ajenas |
| Admin | Lo anterior, gestionar preguntas y crear/editar/desactivar/restaurar cuentas user | No gestionar cuentas privilegiadas ni asignar admin o superadmin |
| Superadmin | Gestión editorial, cuentas y roles; auditoría de cuentas | No desactivarse ni cambiar su propio rol; conservar al menos un superadmin activo |
| Servicio de revisión | Aplicar manifiestos autorizados mediante herramientas internas | Sin login interactivo ni privilegios de administración web |

El servidor comprueba los permisos y el estado vigente. Los botones ocultos no sustituyen la autorización. Los roles son identificadores, no niveles numéricos configurables.

## 4. Cómo leer la matriz

**Hito L:** condición propuesta para aceptar la primera entrega local. **Hito A:** alcance original avanzado, posterior a L. **Hito P:** publicación. La distribución propuesta necesita revisión conjunta; no cancela el alcance A o P. **Hito X:** ampliación opcional aún sin aprobar.

Estados: **D** = implementación respaldada por documentación/pruebas anteriores, pendiente de aceptación de esta línea base; **Parcial** = existe una parte; **Pendiente** = falta implementar o demostrar; **Pausado** = no se ejecuta por decisión expresa; **Propuesta** = nueva sugerencia sin aprobar. Ninguno equivale a aceptación final en el PC.

Cada fila tiene identificador permanente y criterio de aceptación. Las comprobaciones del apartado 7 completan los criterios transversales. Si una fila contiene varios casos, todos deben pasar para cerrarla. Los valores de rendimiento/operación aún abiertos se fijan antes de declarar cumplida su fila.

## 5. Matriz de requisitos

### Fase 0 propuesta — requisitos y aceptación

| ID | Hito | Requisito y criterio de aceptación | Estado |
|---|---|---|---|
| RG-01 | L | Aprobar una línea base con fases, actores, alcance, criterios y decisiones abiertas. La propietaria revisa y registra aceptación o ajustes; no quedan decisiones esenciales de L sin resolver. | Pendiente |
| RG-02 | L | Mantener trazabilidad requisito → implementación/documentación → caso de prueba → resultado → aceptación. Cada cambio identifica IDs afectados; las excepciones quedan explícitas. | Parcial |
| RG-03 | L | Controlar cambios de alcance. Toda nueva función se clasifica como original, ajuste solicitado o propuesta y se decide su hito antes de incorporarla como obligatoria. | Parcial |

### Fase 1 original — infraestructura y datos

| ID | Hito | Requisito y criterio de aceptación | Estado |
|---|---|---|---|
| RI-01 | L | Instalar y ejecutar cliente/API separados en Windows con versiones compatibles documentadas. Una instalación desde lockfiles genera Prisma, migra, compila y responde a salud y navegación. Registrar versiones realmente probadas. | D |
| RI-02 | L | Persistir usuarios, temas/subtemas, fuentes, preguntas, alternativas, intentos, respuestas, tiempos y auditoría. Reiniciar conserva datos; migrar una copia existente preserva filas y relaciones; una migración fallida no exige reset destructivo. | D |
| RI-03 | L | Mantener ES/EN, versión de examen, familia, dificultad, tipo, explicación general/de clave/de opciones, referencias/licencia y fechas de revisión. Una importación válida recupera esos campos sin pérdida; rechazar datos obligatorios incompletos. | Parcial |
| RI-04 | L | Separar código de datos y secretos de ejecución. Documentar instalación, respaldo, migración, recuperación y actualización; Git no debe requerir publicar credenciales, historial o bases personales para sincronizar código. Resolver el seguimiento heredado sin perder datos. | Parcial |
| RI-05 | P | Si se elige PostgreSQL, migrar esquema y datos con restricciones, integridad, copia/restauración y pruebas completas. SQLite sigue siendo la base local aceptada; un cambio de provider no acredita migración. | Pendiente; condicionado |

### Fase 2 original — configuración y motor

| ID | Hito | Requisito y criterio de aceptación | Estado |
|---|---|---|---|
| RE-01 | L | Configurar cantidades 10/25/50/75/100/personalizada; 15/30/60/90/120 minutos/personalizada; ES/EN; dificultad básica/intermedia/avanzada/mixta; temas, orden y preferencias. Resumen coherente antes de confirmar inicio; límites inválidos se rechazan también en API. | D |
| RE-02 | L | Ofrecer simulacro completo, práctica por tema, personalizado, errores, subnetting, comandos y troubleshooting. Cada modalidad filtra realmente su contenido; sin historial o sin preguntas compatibles muestra una alternativa sin inventar disponibilidad. | D |
| RE-03 | L | Seleccionar solo preguntas aprobadas, activas y compatibles con versión/filtros; no repetir familias. Informar disponibilidad y rechazar excesos sin reducir cantidad ni cambiar filtros silenciosamente. Comprobar ponderación por área y redondeo con casos conocidos. | D |
| RE-04 | L | Examen estricto: una pregunta, selección y confirmación, sin saltos/retroceso/cambio posterior ni respuestas correctas durante el intento. Selección múltiple exige exactamente la cantidad indicada. Rechazar peticiones manipuladas desde API. | D |
| RE-05 | L | Reloj controlado por servidor: recarga y desconexión no amplían plazo; al reconectar se recuperan respuestas o finaliza por caducidad. Registrar tiempo total y por pregunta; avisos visuales y tiempo opcional por pregunta coherentes. | D |
| RE-06 | L | Estudio con explicaciones tras confirmar, navegación a respuestas guardadas, referencias, favoritos y opción sin reloj. Cambiar de tema o reiniciar crea otro intento sin sobrescribir el anterior; las preferencias se aplican realmente. | D |
| RE-07 | L | Puntuar de forma reproducible y documentada: selección única/VF correctas, múltiple exacta, no respondidas como cero; calcular resultado y porcentaje en servidor. Mostrar la escala y objetivo como internos, nunca como nota/umbral oficial Cisco. | D |
| RE-08 | A | Configurar política de puntuación dentro de límites acordados y conservar su versión por intento. Cambiarla no altera resultados anteriores. Falta decidir quién puede cambiarla y los parámetros permitidos. | Pendiente |
| RE-09 | L | Recuperar cursor, orden y respuestas confirmadas. Reintentos de envío, finalizar o recargar no duplican respuestas ni reabren exámenes cerrados. Fallos muestran error/reintento y conservan lo confirmado. | D; resiliencia adicional pendiente |
| RE-10 | A | Repetir mediante una variante realmente recalculada y validada. Un nuevo intento referencia familia y variante; una variante ambigua o no aprobada no se utiliza. | Pendiente |

### Fase 3 original — calidad editorial y primer lote

| ID | Hito | Requisito y criterio de aceptación | Estado |
|---|---|---|---|
| RC-01 | L | Entregar un lote inicial de 50 familias revisadas, originales o autorizadas, bilingües y repartidas entre seis áreas. Cada pregunta tiene clave inequívoca, distractores, explicación, versión, evidencia y decisión; no basta validar estructura. | Parcial; falta aceptación del lote |
| RC-02 | L | Verificar por pregunta integridad, datos suficientes, clave, distractores, tipo, traducción, explicación, fuente/licencia y ausencia de duplicación sustancial. Desacuerdos sin resolver quedan pendientes y fuera de exámenes. Registrar revisor, fecha y evidencia sin presentar revisión automatizada como humana. | Parcial |
| RC-03 | L | Importar JSON/CSV autorizado con informe de creadas, sin cambios, rechazadas y errores. No duplicar al repetir ni sobrescribir ediciones locales incompatibles. Importar o crear no aprueba automáticamente. | D |
| RC-04 | L | Validar cálculos soportados de IPv4, máscaras, red/broadcast, hosts, subredes y wildcards con funciones deterministas y casos independientes, incluidos /31 y /32. Declarar alcance y límites; una prueba numérica no certifica toda la pregunta. | Parcial |
| RC-05 | A | Ampliar validadores a selección de rutas, métricas, ACL, prefijos IPv6 y comandos cuando sea verificable. Usar documentación/laboratorio según escenario; distinguir comprobación automática, evidencia y revisión humana. | Parcial |
| RC-06 | L | Identificar fuentes primarias y permisos/licencias. Ante restricciones de acceso registrar limitación y usar originales o importaciones autorizadas. No atribuir origen de examen real sin evidencia ni eludir restricciones de sitios. | Parcial; revisión por registro |
| RC-07 | A | Mantener mapa de objetivos/subobjetivos del temario con versión, fecha/fuente, pesos, aprobadas y familias por objetivo. Mostrar huecos; las coincidencias por palabras no demuestran cobertura. | Pendiente |
| RC-08 | A | Revisar y agrupar duplicados semánticos por familia; cambios cosméticos no cuentan como conceptos distintos. Una consulta de equivalencias y un examen de prueba demuestran que no se repiten familias. | Parcial |
| RC-09 | A | Explicaciones pedagógicas completas según escenario: pasos, por qué falla cada alternativa relevante, fórmulas/comandos, ejemplo, referencia, consejo y refuerzo validado. Subnetting incluye excepciones; routing/OSPF/VLAN/STP/ACL/servicios/automatización explican el comportamiento aplicable. Auditar por pregunta, no solo presencia de campos. | Parcial |

### Fase 4 original — resultados, revisión e historial

| ID | Hito | Requisito y criterio de aceptación | Estado |
|---|---|---|---|
| RR-01 | L | Mostrar al finalizar/caducar puntuación, porcentaje, correctas/incorrectas/no respondidas, total/promedio de tiempo, áreas y dificultades. Comparar con un intento de clave conocida; leer resultados no finaliza un intento en curso. | D |
| RR-02 | L | Revisar enunciado, selección, clave y explicación de la versión presentada. Editar/retirar la pregunta no modifica el resultado anterior; indicar límites si un intento antiguo no tenía captura. | D |
| RR-03 | L | Historial por cuenta con fecha, idioma original, temario, cantidad, duración, tiempo, resultado y temas; abrir revisión, filtrar y reintentar errores de carga. Una cuenta no consulta ni borra el historial de otra; borrar requiere confirmación. | D |
| RR-04 | L | Permitir repaso de fallos y favoritas personales con contenido aún disponible. Informar si los filtros dejan menos preguntas; no modificar el intento original ni reutilizar material retirado. | D |
| RR-05 | A | Comparar intentos y evolución por tema/dificultad, usando resultados reales y políticas compatibles. Definir tratamiento de distintas versiones/configuraciones y mostrar cuándo no hay datos suficientes. | Parcial |

### Fase 5 original — variantes y meta de 1000

| ID | Hito | Requisito y criterio de aceptación | Estado |
|---|---|---|---|
| RB-01 | A | Alcanzar al menos 1000 preguntas aprobadas, activas y sustancialmente distintas; contar conceptos/familias y versiones por separado. Candidatas, rechazadas y cambios cosméticos no satisfacen la meta. | Pausado por decisión de la propietaria |
| RB-02 | A | Reanudar lotes de 50 con IDs estables, informe de creadas/aprobadas/rechazadas/pendientes/duplicados/errores/cobertura y continuación idempotente. Solo tras levantar expresamente la pausa. | Parcial; generación pausada |
| RB-03 | A | Generar variantes mediante reglas técnicas que recalculan enunciado, alternativas y clave, conservan parámetros/familia y rechazan ambigüedad. Probar resultado con cálculo independiente y revisar antes de aprobar. | Pendiente; vinculado a RE-10 |
| RB-04 | A | Resolver las 41 candidatas pendientes registradas y reconciliar el inventario por estado, familia y base. No es obligatorio aprobarlas: rechazar o mantener retenida una no verificable con motivo; ninguna pendiente entra en examen. | Pendiente |

### Fase 6 original — interfaz, administración y aprendizaje

| ID | Hito | Requisito y criterio de aceptación | Estado |
|---|---|---|---|
| RU-01 | L | Inicio, configuración, examen, resultados, revisión, historial, banco y administración funcionales; navegación, carga, vacío y error coherentes. Datos reales, sin métricas ficticias al fallar API. | D |
| RU-02 | L | Presentar alternativas legibles: campos/listas en líneas separadas con guiones cuando corresponda; conservar comandos, JSON, orden y selección. Verificar en examen y revisión EN/ES. | D |
| RU-03 | L | Interfaz y preguntas bilingües sin mezclar textos residuales; idioma de interfaz no cambia idioma guardado ni respuestas de un intento. Recorrer también validaciones, errores, estados vacíos y fechas. | Parcial |
| RU-04 | A | Interfaz adaptable y accesible: completar recorridos por teclado, foco visible, etiquetas, avisos accesibles y sin desbordamientos en tamaños/dispositivos acordados. Propuesta de objetivo: WCAG 2.2 AA en flujos principales, pendiente de ratificación. | Parcial |
| RU-05 | L | Banco con búsqueda, filtros y paginación reales según permisos. Durante modo estricto los endpoints del intento no revelan clave; revisar la política de acceso paralelo al banco en RC/seguridad. | D; política abierta |
| RA-01 | L | Admin/superadmin crean y editan preguntas bilingües con opciones, clave, dificultad, tiempo, traducción y referencia. Editar crea revisión pendiente y conserva contenido/opciones de intentos anteriores. | D |
| RA-02 | L | Revisar, ejecutar validadores y aprobar/rechazar con notas y evidencia. Rechazar aprobación incompleta o edición de retirada; cambios de contenido invalidan aprobación; guardar autor/fecha. | D |
| RA-03 | L | Retirar con confirmación/motivo y restaurar como pendiente. Excluir retiradas de nuevas selecciones y disponibilidad; conservar exámenes; mostrar listado de retiradas solo a administración. | D |
| RA-04 | L | CRUD de cuentas con búsqueda/paginación: alta, lectura, edición, contraseña y desactivación/restauración. Admin gestiona solo user; superadmin gestiona privilegiadas. Mantener historial; restaurar como user; datos inválidos/duplicados no dejan escritura parcial. | D |
| RA-05 | L | Asignar user/admin/superadmin solo desde superadmin; registro público no eleva roles. Proteger cuenta propia/último superadmin y exigir credenciales del admin existente para inicializar al primer propietario. | D; configuración local confirmada |
| RA-06 | L | Revocar sesiones por cambio de cuenta/rol/contraseña, desactivación y restauración. Tokens previos siguen inválidos tras restaurar; login nuevo usa rol vigente; no mostrar contraseñas/hashes. | D |
| RA-07 | L | Auditoría transaccional de cuentas: actor, objetivo, acción, fecha, motivo, antes/después sin hashes/contraseñas. Solo superadmin consulta eventos; comprobar límites y trazabilidad de retirada/restauración. | D |
| RA-08 | A | Gestión editorial de fuentes, objetivos y equivalencias desde panel, con decisiones sobre familias/duplicados y trazabilidad. Fusionar equivalencias no destruye versiones usadas ni cambia intentos anteriores. | Parcial |
| RL-01 | L | Recomendar práctica usando áreas débiles, errores repetidos y tiempos del historial real. Sin intentos, indicar falta de datos; la sesión sugerida filtra realmente el tema y usa solo contenido validado. | D |
| RL-02 | A | Diagnóstico adaptativo completo: evolución por área/dificultad, conceptos confundidos, comparación y plan tras cada examen. Validar con historiales de prueba y explicar fundamento; refuerzos nuevos se revisan antes de usarse. | Parcial |

### Fase 7 original — seguridad, pruebas y documentación

| ID | Hito | Requisito y criterio de aceptación | Estado |
|---|---|---|---|
| RS-01 | L | Autenticar con contraseñas hasheadas y autorización actual en cada operación protegida. Invitado/user/admin/superadmin tienen respuestas de acceso consistentes; manipular rol o ID no concede permisos. | D |
| RS-02 | L | Validar estado, tiempo, cursor, número/propiedad de opciones y confirmación en servidor. No enviar claves del intento estricto ni confiar en reloj/configuración del navegador; cubrir peticiones manipuladas. | D |
| RS-03 | L | Validar entradas y gestionar errores sin exponer secretos. Mantener variables seguras y auditoría de dependencias; investigar hallazgos antes de entrega. No publicar archivos locales sensibles. | Parcial |
| RS-04 | L | Conservar capturas/versiones y probar migración/restauración con datos existentes; los tests usan bases temporales. Compilar y ejecutar unitarias, integración y navegador de los recorridos afectados antes de aceptar cambios. | D |
| RS-05 | L | Documentar instalación/actualización/uso por rol, límites, respaldo y recuperación en Windows. Registrar commit local/remoto y ejecución de migraciones sin confundir sincronización de Git con réplica de la base. | D |
| RS-06 | A | Probar reconexiones prolongadas, varias pestañas, concurrencia y cambios de sesión. No aceptar dos respuestas finales ni reabrir intentos; registrar interrupciones relevantes sin vigilancia invasiva. | Parcial |

### Fase 8 propuesta — publicación y operación

Esta fase separa el despliegue de las pruebas locales; desarrolla tareas de operación ya presentes en el alcance original. Su ejecución se difiere por la decisión de publicar después.

| ID | Hito | Requisito y criterio de aceptación | Estado |
|---|---|---|---|
| RP-01 | P | Desplegar cliente/API con HTTPS, orígenes exactos, secretos, persistencia, proceso/reinicio y salud; verificar desde URL real. Elegir proveedor y base antes de ejecutarlo. | Pendiente |
| RP-02 | P | Limitar peticiones de login/registro/operaciones costosas y configurar proxy/orígenes/sesión. Probar límites, abuso y recuperación sin confiar en cabeceras arbitrarias. | Pendiente |
| RP-03 | P | Definir frecuencia/retención de copias y objetivos de recuperación; restaurar en otro entorno y verificar cuentas, historial, capturas y banco. No basta copiar un archivo. | Parcial; objetivos abiertos |
| RP-04 | P | Registro de fallos y eventos de autenticación, monitorización y alertas sin secretos. Simular caída y comprobar detección, recuperación y acceso restringido a registros. | Pendiente |
| RP-05 | P | Automatizar compilación, pruebas y comprobación de migraciones antes de publicar; definir reversión de código y restauración compatible con datos. Ensayar una entrega fallida. | Pendiente |
| RP-06 | P | Definir privacidad, retención, bajas y tratamiento del historial/auditorías/copias e invitados. Verificar aislamiento y cumplir la política publicada, sin prometer eliminación física si se conserva auditoría. | Pendiente |
| RP-07 | P | Fijar carga y tiempos objetivo sobre entorno definido; medir configuración, respuesta y resultados con banco real. La escalabilidad no se acredita solo por usar una tecnología. | Pendiente; métricas abiertas |

### Ampliaciones propuestas, aún sin aprobar

| ID | Hito | Propuesta y criterio si se acepta | Estado |
|---|---|---|---|
| RX-01 | X/P | Recuperación de contraseña por correo con token de un solo uso, caducidad y límites; proveedor y política definidos. Recomendada si hay registro público; no necesaria para la primera instalación local. | Propuesta; pendiente histórico U05 |
| RX-02 | X | Segundo factor para superadmin y recuperación segura probada antes de habilitarlo. | Propuesta nueva |
| RX-03 | X | Permitir reportar una pregunta problemática con comentario, versión e intento; cola editorial con resolución y auditoría, sin aprobar automáticamente. | Propuesta nueva |
| RX-04 | X | Exportar contenido autorizado e informes según rol; incluir versión/licencia y omitir datos ajenos o claves no autorizadas. Definir formatos antes de desarrollar. | Propuesta nueva |
| RX-05 | X | Generación con IA asistida, siempre pendiente de revisión, con proveedor, coste, secretos y límites explícitos. No confundir con el generador determinista de variantes exigido por RB-03. | Propuesta; no conectado |
| RX-06 | X | Laboratorios interactivos/topologías ejecutables. Definir escenarios, corrección y herramientas; analizar comandos o topologías como preguntas no implica tener un simulador de equipos. | Propuesta nueva |

## 6. Fases y puertas de salida

| Fase | Entregable | Condición de cierre |
|---|---|---|
| 0, propuesta | Requisitos y decisiones | RG-01–03 aceptados para la entrega; decisiones esenciales resueltas |
| 1 | Instalación y persistencia | RI de L comprobados en instalación y actualización Windows sin pérdida |
| 2 | Examen y estudio | RE de L pasan recorrido normal y peticiones inválidas; lo avanzado queda trazado |
| 3 | Banco útil y control editorial | RC de L aceptados; al menos 50 familias del lote de aceptación verificadas, sin contar solo archivos |
| 4 | Resultado, revisión e historial | RR de L reproducibles con contenido/versiones preservadas |
| 5 | Ampliación y variantes | RB y RE-10 aceptados al reanudar; 1000 aprobadas distintas demostradas; fase pausada |
| 6 | Interfaz, cuentas y aprendizaje | RU/RA/RL del hito elegido aceptados por cada rol; las funciones avanzadas siguen abiertas |
| 7 | Calidad y documentación | RS de L aceptados; evidencias completas y sin fallos bloqueantes de permisos, datos, tiempo o puntuación |
| 8, propuesta | Servicio publicado operable | RP aceptados y decisión expresa de publicar; pruebas locales no cierran esta fase |

Las fases no se cierran enteras por terminar su subconjunto L. Es posible entregar L con A/P pendientes explícitos; declarar completo el alcance original exige cerrar también sus requisitos A. RX solo se vuelve obligatorio cuando se acepta expresamente. No se reanuda la generación al aprobar este documento.

## 7. Plan de aceptación local

Crear una ficha por requisito con: ID, versión/commit, responsable de ejecución, rol, precondiciones, pasos, resultado esperado, resultado obtenido, evidencia, fecha y aceptación de la propietaria. Estados de aceptación: sin ejecutar, pasa, falla, bloqueado y aceptado. «D» es estado de implementación, no reemplaza esta ficha.

| Caso | Requisitos principales | Prueba y resultado exigido |
|---|---|---|
| AC-01 | RI-01/02, RS-04/05 | Instalación/actualización Windows desde copia y migraciones; compilar y arrancar; recarga conserva datos y respaldo se restaura |
| AC-02 | RE-01/02/03 | Configurar las siete modalidades e idiomas; probar filtros, disponibilidad insuficiente, familias y distribución |
| AC-03 | RE-04/05/09, RS-02 | Estricto: confirmar, recargar, intentar modificar/saltar/ver clave, perder conexión y caducar; servidor conserva plazo y respuestas |
| AC-04 | RE-06, RR-04 | Estudio, preferencias, favoritas, reinicio y cambio de tema; no se sobrescribe el intento anterior |
| AC-05 | RE-07, RR-01/02/03 | Intento de clave conocida con acierto/error/múltiple/no respuesta; resultado esperado exacto e historial inmutable tras editar/retirar pregunta |
| AC-06 | RC-01/02/03/04/06 | Importar lote autorizado, repetir y probar errores; revisar las 50 familias de aceptación y cálculos/traducción/evidencias |
| AC-07 | RA-01/02/03 | Crear/editar/revisar/retirar/restaurar pregunta; cancelar no cambia nada; pendiente/retirada no entra en examen nuevo |
| AC-08 | RA-04/05/06/07, RS-01 | Por cada rol: CRUD permitido y prohibido, intento de autoascenso, último propietario, revocación, restauración y auditoría sin secretos |
| AC-09 | RU-01/02/03/05, RL-01 | Recorrido ES/EN, guiones/listas, errores/vacíos, historial y recomendaciones reales; no exponer claves según política acordada |
| AC-10 | RI-04, RS-03/04/05 | Verificar archivos incluidos en Git, ausencia de secretos/datos locales en entrega, instalación reproducible y registro de commit PC/GitHub |

No todas estas pruebas están ya ejecutadas para esta línea base. Los informes anteriores sirven como evidencia histórica que debe vincularse a la versión correspondiente. Hay 644 pruebas de suite general y 8 dirigidas de roles documentadas en la última entrega (7 solapadas, una adicional; 645 tests en su código), y 26 escenarios Chromium: esas cifras no certifican cada requisito ni el banco completo.

## 8. Decisiones abiertas para revisar juntas

| ID | Decisión | Recomendación inicial; pendiente de aceptación |
|---|---|---|
| DEC-01 | Alcance exacto de la primera entrega local | Adoptar L de esta matriz; acordar el lote de 50 familias y las modalidades/dificultades demostrables sin reiniciar la generación |
| DEC-02 | Puntuación configurable | Mantener política actual para L; acordar parámetros y permisos de RE-08 antes de desarrollarlo |
| DEC-03 | Modo estricto y consulta paralela del banco | Mantener ocultas claves en API del intento; decidir si banco/revisión estarán restringidos durante estricto. No prometer vigilancia de otras pestañas o dispositivos |
| DEC-04 | Accesibilidad/dispositivos objetivo | Acordar si RU-04 es obligatorio para L y ratificar WCAG 2.2 AA, tamaños, navegadores y pruebas asistivas; Windows/escritorio es el entorno actual |
| DEC-05 | Publicación y cuentas públicas | Diferida; antes de P decidir hosting, cantidad de usuarios simultáneos, recuperación por correo, privacidad y base de datos |
| DEC-06 | Operación medible | Antes de P fijar tiempos de respuesta, carga, frecuencia/retención de copias, pérdida máxima de datos y plazo de recuperación; no inventar valores como si estuvieran acordados |
| DEC-07 | Nuevas ampliaciones | Revisar RX-01–06 por separado: aceptar, aplazar o descartar. No ejecutar por estar listadas |

## 9. Control de cumplimiento

No asignar un porcentaje global sin una línea base aprobada. Para la entrega elegida, mostrar cantidades por estado y los bloqueantes; la meta de preguntas y las pruebas automatizadas son métricas diferentes.

Cada requisito se cierra solo cuando pasa sus criterios, tiene evidencia vinculada, no conserva fallos bloqueantes y recibe aceptación. Si se difiere, se registra explícitamente; no se borra para llamar al producto «100 %». Conservar el historial documental: este borrador ordena las prioridades actuales y no reescribe los resultados de entregas anteriores.

Registro inicial: 11/11/2026, creación de versión 0.1; ámbito local y pausa de 1000 confirmados; fases 0/8 y ampliaciones RX propuestas; aceptación de la línea base pendiente.

## 10. Trazabilidad del alcance recibido

Esta correspondencia permite localizar lo pedido sin confundir las cifras históricas con condiciones de aceptación actuales.

| Fuente | Requisitos de esta línea base |
|---|---|
| Prompt §1, objetivo y desarrollo real | RG-01/02, RI-01/02, RB-01, puertas de salida |
| Prompt §2, fuentes y permisos | RC-02/06, RA-02/08 |
| Prompt §3, banco, áreas, dificultad y tipos | RC-01/02/07/08, RE-01/02/03, RB-01 |
| Prompt §4, datos y persistencia | RI-02/03/05, RR-02/03, RB-03, RA-07 |
| Prompt §5, calidad y validadores | RC-02/04/05/06, RA-02, RS-04 |
| Prompt §6, variantes | RE-10, RB-03, RC-08 |
| Prompt §7, configuración | RE-01/02/03/05/06 |
| Prompt §8, estricto | RE-04/05/09, RS-02/06, DEC-03 |
| Prompt §9, estudio | RE-06/10, RR-04 |
| Prompt §10, temporizador | RE-05/09, RR-01 |
| Prompt §11, evaluación | RE-07/08 |
| Prompt §12, informe | RR-01/05, RL-01/02 |
| Prompt §13, explicaciones | RC-09, RR-02, RL-02 |
| Prompt §14, bilingüismo | RI-03, RC-02, RU-03, RR-03 |
| Prompt §15, adaptativo | RL-01/02, RR-05, RE-10 |
| Prompt §16, historial y privacidad | RR-02/03/04/05, RE-09, RP-06 |
| Prompt §17, pantallas y administración | RU-01–05, RA-01/02/03/08, RS-01/02 |
| Prompt §18, arquitectura y seguridad | RI-01–05, RS-01–06, RP-01–07 |
| Prompt §19, lotes hasta 1000 | RB-01/02/03, RC-01/02/07/08 |
| Prompt §20 disponible, pruebas (texto incompleto) | RS-04 y AC-01–10; falta la lista original completa, no se presume recuperada |
| Solicitudes posteriores de usuarios/roles | RA-04–07, matriz de actores |
| Solicitud posterior de guiones en alternativas | RU-02 |
| Solicitud de guardar/sincronizar PC y GitHub | RI-04, RS-05, AC-10 |
| Decisiones del 11/11: local y pausa | Hitos L/A/P; RB-01/02 pausados; publicación diferida |

Correspondencia con pendientes anteriores: C01→RA-05/AC-08; C02→RC-02/RB-04; C03→RC-07; C04→RE-03; C05→RC-08; C06→RC-09. F01→RE-05; F02/F04→RE-06; F03→RB-03/RE-10; F05→RC-05; F06→RE-08; F07→RL-02; F08→RR-03; F09→RA-08. U01→RU-03; U02/U03→RU-04; U04→RS-06; U05→RX-01. P01→RP-01; P02→RP-02; P03→RP-03; P04→RI-04; P05→RS-03/RP-02; P06→RP-04; P07→RP-06; P08→RP-05.
