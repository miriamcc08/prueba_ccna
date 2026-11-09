# Perfiles y gestión de preguntas — iniciada 05/11, cierre 09/11/2026

## Entrega

El registro público crea usuarios normales. Estos realizan prácticas, consultan resultados y gestionan su historial/favoritos. El perfil administrador accede además a `/admin`: redacta e importa preguntas, edita mediante nuevas revisiones, revisa con evidencia y retira o restaura contenido. La autorización se comprueba en el servidor con el rol vigente, incluso para tokens emitidos antes de retirar el rol.

Se incorporaron botones explícitos **Editar**, **Eliminar** y **Restaurar**, formulario bilingüe precargado, explicaciones por alternativa y tiempo estimado. Eliminar retira de forma reversible: exige confirmación y motivo, conserva los intentos y registra auditoría. Restaurar devuelve a pendiente de revisión. Las retiradas no cuentan en disponibilidad, temas ni exámenes nuevos. Los intentos existentes conservan sus opciones y contenido. No se añadieron preguntas ni aprobaciones editoriales.

La migración `20261105190000_soft_delete_questions` añade una columna nullable `Question.deletedAt`. Debe aplicarse en cada instalación antes de arrancar esta versión. No ejecutar un reset. La [guía administrativa](administracion.md) contiene actualización Windows y creación segura de la primera cuenta. Git sincroniza código y migraciones; no replica automáticamente cuentas, contraseñas ni cambios de la base local entre equipos.

## Validación

Los resultados concretos figuran en [el registro de validación](validacion-perfiles-administracion-20261105.json). Se verifican permisos de invitado, usuario normal, administrador y administrador revocado; confirmación/cancelación; revisiones con contenido anterior conservado; retirada/restauración auditadas; exclusión de nuevos exámenes y preservación de resultados antiguos con y sin captura. También se comprueba que la sincronización editorial no reaprobará silenciosamente una pregunta retirada.

La compilación mantiene un aviso de tamaño del JavaScript principal; no impide generar el cliente. Las pruebas usan bases aisladas y no crean una cuenta administradora real en el equipo del usuario.

## Qué falta para cerrar el plan

- Activar la cuenta administradora en el PC y comprobar ambos perfiles allí. No hay credenciales predeterminadas.
- Resolver las 41 preguntas pendientes y completar cobertura del temario, familias y revisión de explicaciones. La generación adicional continúa pausada; no se afirma que haya 1000 preguntas aprobadas.
- Completar variantes recalculadas, validadores técnicos, puntuación configurable y diagnóstico adaptativo del alcance original.
- Completar traducciones, accesibilidad y pruebas de móvil/tablet.
- Preparar producción: despliegue HTTPS, límites de peticiones, copias/restauración, seguridad, observabilidad y comprobaciones automatizadas. Recuperación de contraseña si habrá cuentas públicas.

El detalle y los criterios de aceptación se mantienen en [la lista de cierre](pendientes-cierre.md). Tener los dos perfiles y el CRUD editorial no certifica el cumplimiento del plan completo.
