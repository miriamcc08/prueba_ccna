# Registro de aceptación de requisitos

Plantilla de trabajo, 11/11/2026. Línea base candidata: [requisitos.md, v0.1](requisitos.md). No hay aceptación global registrada todavía.

## Decisiones confirmadas

| Fecha | Decisión | Evidencia |
|---|---|---|
| 11/11/2026 | Primera entrega para uso local en el PC; publicación después | Respuesta explícita de la propietaria en la conversación |
| 11/11/2026 | Meta de 1000 preguntas para después y generación pausada | Respuesta explícita de la propietaria en la conversación |
| Confirmación previa al borrador | Migración de cuentas aplicada y primer superadmin configurado en el PC | Salidas `All migrations have been successfully applied` y `Superadmin configured. Sign in again.` compartidas por la propietaria |

## Revisiones pendientes

- Revisar los hitos L/A/P y decisiones DEC-01–07.
- Aceptar o ajustar las fases propuestas 0 y 8.
- Decidir cada ampliación RX por separado; listar una propuesta no autoriza su desarrollo.
- Registrar las pruebas de la instalación local y aceptación por rol; una configuración de cuenta correcta no demuestra todo el CRUD.

## Ficha por requisito

Duplicar esta ficha cuando se ejecute su aceptación. No marcar «pasa» basándose solo en que el código existe.

| Campo | Valor que se debe completar |
|---|---|
| Requisito(s) | ID de la matriz |
| Versión y commit | Commit probado en PC/entorno de prueba |
| Hito | L, A, P o X aceptado |
| Caso de aceptación | AC correspondiente o caso nuevo |
| Ejecutor y fecha | Persona/automatización; fecha y entorno |
| Rol y precondiciones | Cuenta, estado, datos preparados sin credenciales |
| Pasos | Acciones reproducibles |
| Resultado esperado | Criterio de la línea base |
| Resultado obtenido | Observación concreta |
| Evidencia | Informe, salida o captura sin datos sensibles |
| Resultado de prueba | Sin ejecutar / pasa / falla / bloqueado |
| Incidencias y correcciones | Enlace y estado |
| Decisión de la propietaria | Pendiente / aceptado / requiere cambios / diferido explícitamente |

## Regla para entregar

Cerrar un requisito requiere criterios completos, evidencia vinculada y aceptación. Cerrar la primera versión local requiere todos los L aceptados de la línea base acordada y decisiones esenciales resueltas; los A/P se mantienen visibles. Las propuestas X no cuentan como deuda aprobada hasta que se incorporen al alcance.

## Cambio documental de esta entrega

Se creó la matriz, su trazabilidad y esta plantilla. Se enlazaron desde README y los documentos de plan/estado/pendientes. Se actualizó el pendiente de superadmin con la confirmación real del usuario. No se modificaron código, cuentas, base de datos ni preguntas; no se reejecutó la suite de aplicación para una edición exclusivamente documental.

Validación documental del 11/11/2026: 70 identificadores únicos de requisitos; referencias a requisitos existentes; matrices de cuatro columnas coherentes; 92 enlaces locales de los seis documentos modificados comprobados y `git diff --check` sin errores. Se contrastó la matriz con las secciones disponibles del prompt y las siete fases originales. Las secciones truncadas de la fuente y las decisiones DEC abiertas permanecen explícitas. Esto valida la coherencia documental, no certifica implementación ni aceptación.

## Decisiones individuales RF/RNF

El 11/11/2026 la propietaria solicitó separar requisitos funcionales y no funcionales y decidir individualmente. **RF-01, registro de usuarios, aceptado** mediante respuesta «acepto» al texto presentado. Esto aprueba su definición, no el cumplimiento técnico ni los restantes requisitos. Texto y seguimiento en [requisitos-rf-rnf.md](requisitos-rf-rnf.md). RF-02 fue aceptado posteriormente de forma individual; véase el registro siguiente.

El 11/11/2026 la propietaria aceptó **RF-02, inicio y cierre de sesión**, mediante «si me gusta, lo acepto». Se conserva el texto acordado y se distingue aceptación de definición de verificación técnica pendiente. RF-03 se presentó para decisión individual y fue aceptado posteriormente; véase el registro siguiente.

El 11/11/2026 la propietaria aceptó **RF-03, configuración del examen**, mediante «si me gusta» en respuesta a la solicitud de decisión. Se aprueba su definición; la verificación técnica sigue pendiente. RF-04 se presentó para decisión individual y fue aceptado posteriormente; véase el registro siguiente.

El 11/11/2026 la propietaria aceptó **RF-04, modalidades de práctica**, mediante «si acepto». Se aprueba la definición; su verificación técnica queda pendiente. RF-05 se presentó para decisión individual y fue aceptado posteriormente; véase el registro siguiente.

El 11/11/2026 la propietaria aceptó **RF-05, examen estricto**, mediante «acpeto» en respuesta a la propuesta. Se aprueba su definición; no se certifica su cumplimiento técnico. RF-06 se presentó para decisión individual y fue aceptado posteriormente; véase el registro siguiente.

El 11/11/2026 la propietaria aceptó **RF-06, modo de estudio**, mediante «si tambien acepto». Se aprueba su definición; la verificación técnica continúa pendiente. RF-07 se presentó para decisión y fue aceptado posteriormente; véase el registro siguiente.

El 11/11/2026 la propietaria aceptó **RF-07, cronómetro y recuperación de sesiones**, y solicitó decidir en bloques de diez para agilizar la revisión. RF-08 a RF-17 se presentan como propuestas, sin aceptación presunta. El umbral concreto del aviso de tiempo de RF-07 permanece por precisar antes de su aceptación técnica.

El 11/11/2026 la propietaria aceptó **RF-08 a RF-17 completos**, mediante «acepto todos» en respuesta exclusivamente a ese bloque. Se aprueban sus definiciones y criterios; no se aprueba el bloque siguiente ni se certifica implementación. RF-18 a RF-27 permanecen propuestos. RF-01 a RF-17 tienen definición aceptada; su aceptación técnica requiere evidencia por requisito.

El 11/11/2026 la propietaria aceptó **RF-18 a RF-27 completos**, mediante «acepto todas» referido a ese bloque. RF-01 a RF-27 tienen definición aceptada, sin certificar cumplimiento técnico. RNF-01 a RNF-10 se presentan como propuestas con objetivos explícitos, pendientes de decisión; el resto de funciones de la matriz continúa por revisar.
