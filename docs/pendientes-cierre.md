# Lista de cierre del simulador

Base funcional del 26/10/2026; revisión de contenido actualizada el 29/10/2026: CSV, resultados por dificultad, reinicio independiente de estudio, tiempo por pregunta, cambio de tema en estudio e historial con versión del temario visible.

**Estado:** el recorrido principal está probado, pero no está completo el alcance original ni certificado el despliegue de producción. No se asigna un porcentaje de avance: las preguntas candidatas, las pruebas automatizadas y los requisitos entregados miden cosas diferentes.

El usuario ha pausado la creación de preguntas. Esa pausa se mantiene. Revisar y aprobar material existente no es equivalente a generar más ni a aprobarlo automáticamente.

## Lo que ya funciona

Configuración y disponibilidad real; exámenes estrictos; estudio sin tiempo; fecha límite del servidor y recuperación; confirmación de respuestas; resultados y revisión; contenido inmutable por intento nuevo; historial; favoritos; recomendaciones por reglas; registro e inicio de sesión; roles actuales comprobados en servidor; CORS restrictivo; sonidos opcionales; borrado confirmado del historial propio. Administración permite crear, importar **JSON/CSV**, buscar, filtrar, paginar, revisar y aprobar/rechazar candidatos con evidencia. Resultados ya muestra el rendimiento por dificultad que calcula la API.

Última comprobación: compilación de cliente y servidor correcta, **599 pruebas de servidor y 22 de Chromium aprobadas**. Esto comprueba escenarios concretos, no todas las preguntas ni todos los dispositivos.

## 1. Para entregar un simulador útil con contenido suficiente

| ID | Pendiente | Criterio de cierre |
|---|---|---|
| C01 | Activar la primera cuenta administradora en el entorno que se vaya a utilizar | Configurar correo/contraseña mediante variables seguras, ejecutar `admin:bootstrap` y comprobar acceso a `/admin` y denegación a una cuenta normal. La última consulta de la copia de desarrollo mostró 0 administradores; no se inventaron credenciales. |
| C02 | Revisar técnicamente el material existente | Se revisaron en profundidad 134 candidatos y se aprobaron 131 mediante revisión asistida documentada; quedan 529 pendientes. Completar respuesta, distractores, explicación, traducción, referencia vigente y licencia por candidato. Registrar decisión y evidencia; mantener fuera de exámenes lo no aprobado. |
| C03 | Completar el mapa del temario oficial vigente | Vincular las preguntas aprobadas a los subobjetivos, contrastar pesos/versiones con fuente oficial y mostrar huecos. Las coincidencias por palabras actuales no certifican cobertura. |
| C04 | Disponer de suficientes familias aprobadas por modalidad y dificultad | Probar las cantidades ofrecidas, incluidos simulacros largos. Tras aplicar el manifiesto, la instalación aislada contiene 668 preguntas, 139 validadas y 120 familias validadas; se probó un simulacro de 100 con dificultad mixta. Otros filtros siguen teniendo menos disponibilidad. La interfaz informa la escasez, no inventa disponibilidad. |
| C05 | Revisar duplicados semánticos | Agrupar equivalencias en familias y comprobar que un examen no repite el mismo ejercicio conceptual. Ya hay comprobaciones exactas/heurísticas, no una deduplicación semántica completa. |
| C06 | Completar revisión de explicaciones pedagógicas | Verificar pasos, por qué fallan distractores, comandos y referencias; contrastar escenarios de routing, ACL y configuración con laboratorio o fuente de plataforma cuando corresponda. |

Inventario documental: 660 candidatos JSON, 586 familias declaradas, 360 originales y 300 candidatos heredados. Las 108 preguntas de la base histórica etiquetadas `validated` tampoco acreditan revisión independiente. Los 660 JSON no se suman a los registros de bases como si todos fueran distintos. El objetivo de 1000 aprobadas permanece pendiente; no se reanuda su generación en esta entrega.

**F01 completado:** [tiempo por pregunta](tiempo-por-pregunta.md), activación persistida, rechazo de respuestas tardías, avance y resultado sin responder; configuración y recuperación de conexión comprobadas. No se combina con estudio sin cronómetro.

**F02 completado:** el [reinicio de estudio](reinicio-estudio.md) crea otro intento con una pregunta aprobada, preserva respuestas/resultados y permite volver al original. Funciona tras confirmar y desde revisión de un estudio completado, con control de propiedad.

**F08 completado:** el historial muestra versión guardada e idioma original, sin reemplazarlos por el banco o idioma de interfaz actuales. Se comprueba la coherencia con la captura y el aislamiento entre cuentas. Incluye filtros completos y error/reintento visibles. [Registro de cambios](mejoras-historial-20261026.md).

**F04 completado:** [cambiar de tema](cambio-tema-estudio.md) abre otra práctica con disponibilidad real, sin modificar el intento anterior; conserva preferencias y enlace de vuelta. Hay comprobaciones de permisos, temas vacíos y recuperación de errores.

## 2. Funciones pendientes del alcance original

| ID | Pendiente | Criterio de cierre |
|---|---|---|
| F03 | Variantes recalculadas | Generar parámetros, alternativas y clave mediante reglas deterministas, rechazar ambigüedad, conservar la relación de familia y revisión. Cambiar números en texto no basta. |
| F05 | Ampliar validadores técnicos | ACL, selección de rutas, métricas, sintaxis dependiente de plataforma y prefijos IPv6 según los tipos soportados. Declarar qué verifica cada validador y qué necesita revisión humana. |
| F06 | Puntuación configurable | Definir ajustes permitidos y conservar la política/versionado en cada intento. Actualmente hay una política reproducible y documentada, pero la escala y objetivo se fijan en código. No atribuirlos a Cisco. |
| F07 | Diagnóstico adaptativo completo | Añadir evolución por área/dificultad, conceptos confundidos y comparación explícita con intentos anteriores; comprobar con historiales de prueba. Ya existen tendencias y recomendaciones por reglas, pero no todo el diagnóstico pedido. |
| F09 | Gestión editorial de fuentes y equivalencias | Facilitar en el panel la relación de familias, condiciones de reutilización, decisiones sobre duplicados y trazabilidad de fuentes. Hoy se editan textos/alternativas/referencia y se revisan decisiones; no hay una herramienta completa para fusionar o gestionar equivalencias. |

CSV deja de ser un pendiente: usa la plantilla y [la guía de formato](importacion-csv.md). No hace falta añadir crédito parcial si se conserva y documenta la política actual de coincidencia exacta.

## 3. Calidad de interfaz y cuentas

| ID | Pendiente | Criterio de cierre |
|---|---|---|
| U01 | Completar traducciones | Recorrer todas las pantallas y estados de error EN/ES, eliminar textos residuales en el idioma incorrecto y comprobar etiquetas/fechas. La revisión del contenido del banco es un trabajo separado. |
| U02 | Validar móvil y tablet | Probar configuración, examen, tablas, revisión y administración en tamaños reales; corregir desbordamientos y controles difíciles de usar. Las pruebas actuales de escritorio no certifican esta cobertura. |
| U03 | Accesibilidad | Comprobar teclado, foco, lectores de pantalla, formularios, contraste, avisos y temporizador; corregir barreras y añadir pruebas pertinentes. |
| U04 | Resiliencia adicional | Pruebas de desconexiones prolongadas, varias pestañas, peticiones concurrentes, navegación atrás y actualización de sesión en todos los recorridos principales. Ya se prueban algunos fallos de red y finalización, no todos. |
| U05 | Recuperación de contraseña para uso público | Implementar tokens de un solo uso, caducidad, envío de correo y protección contra abuso, con proveedor configurado. Es una mejora de operación de cuentas; el registro/inicio de sesión actual funciona sin ella. |

## 4. Antes de usarlo en producción

| ID | Pendiente | Criterio de cierre |
|---|---|---|
| P01 | Definir y comprobar el despliegue real | Dominio, HTTPS, proceso del servidor, compilado del cliente, reinicio, variables y almacenamiento persistente. Verificar desde el servicio desplegado. No hay un despliegue publicado por esta entrega. |
| P02 | Límites de peticiones y abuso | Proteger acceso/registro y operaciones costosas; probar respuestas de exceso y recuperación. Configurar IP/proxy según la infraestructura, sin confiar en cabeceras arbitrarias. |
| P03 | Copias y restauración | Crear copia consistente, restaurarla en otro entorno, ejecutar migraciones y comprobar cuentas, intentos y capturas. Definir periodicidad y retención; un archivo copiado sin prueba de restauración no cierra el punto. |
| P04 | Resolver datos y dependencias versionados del proyecto heredado | Preparar retirada segura de `node_modules`, `.env` y SQLite del seguimiento de Git, preservando datos necesarios y revisando secretos históricos. La entrega los ha preservado; no se hizo una limpieza destructiva. |
| P05 | Revisar configuración de seguridad de despliegue y mantener auditoría de dependencias | Ejecutar auditoría del conjunto desplegado y resolver hallazgos; comprobar autorización en operación, secretos, encabezados y política de sesión/token. CORS y rol vigente ya están corregidos, pero no equivalen a una auditoría de seguridad completa. |
| P06 | Registro y observabilidad de producción | Registrar eventos de autenticación/administración y fallos sin secretos, conservar registros y comprobar alertas de salud. Existe auditoría editorial y logging de desarrollo, no una operación completa monitorizada. |
| P07 | Verificación de privacidad y operación | Comprobar aislamiento de datos, borrado, retención de copias y límites de sesión invitada. La invitada usa el ID opaco del intento como capacidad de acceso; no tiene credencial independiente. |
| P08 | Automatizar las comprobaciones de entrega | Compilación, pruebas y control de migraciones en el flujo de publicación para no depender solo de ejecuciones manuales de esta sesión. |

**PostgreSQL:** es la arquitectura de referencia del documento, pero SQLite fue aceptado como alternativa inicial. Si se elige PostgreSQL, faltan esquema/migraciones adaptados, exportación/importación, verificación de restricciones, integridad, restauración y pruebas. No basta cambiar el provider. PostgreSQL no es por sí mismo un requisito para que los flujos básicos funcionen; sí requiere una decisión y validación para el despliegue previsto.

**Generador con IA:** no está conectado. El administrador ya puede redactar y cargar preguntas. Añadir un modelo es una ampliación del método de generación, con proveedor, coste, secretos, límites y revisión; no sustituye calidad editorial ni es necesario para ejecutar el simulador con un banco aprobado. El pipeline de variantes recalculadas de F03 sí forma parte explícita del alcance original.

## Orden recomendado

1. Activar administración y revisar suficiente contenido existente para el uso previsto (C01–C06), manteniendo pausada la expansión del banco.
2. Completar funciones originales F01–F09 y calidad U01–U04; continuar por variantes recalculadas; F01 (tiempo por pregunta), F02 (reinicio de estudio), F04 (cambio de tema) y F08 (versión en historial) ya están completados.
3. Cerrar producción P01–P08 y recuperación de contraseña si habrá cuentas públicas.
4. Reanudar el objetivo de 1000 preguntas solo cuando el usuario retome la ampliación, con aprobación editorial y cobertura real.

Para declarar completo el **alcance original**, todos sus requisitos deben pasar criterios de aceptación, incluido el banco. Para declarar una **versión utilizable en producción**, debe definirse qué funciones se publican y cerrar además la operación y seguridad de esa versión. No se retira silenciosamente un requisito para llamarlo 100 % terminado.

Las dependencias se actualizaron para resolver los avisos detectados en la instalación: [informe y comprobación](actualizacion-dependencias-20261026.md). Esto avanza P05, pero no sustituye la revisión de secretos, permisos, encabezados y operación del despliegue.

Revisión vigente y procedimiento para actualizar cada base local: [aprobaciones del 29/10](revision-y-aprobaciones-20261029.md). El actor técnico de revisión no es un administrador interactivo.
