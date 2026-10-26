# Lote original 06 y seguimiento de validación

El 26 de octubre de 2026 se guardaron 50 preguntas ES/EN: 44 de respuesta única y seis de selección múltiple. El reparto por las seis áreas es 10/10/12/5/8/5.

## Material y alcance

- [Preguntas, opciones, respuestas y explicaciones](lote-original-06-50.md).
- Fuente de verdad: `server/prisma/questions/original_20261026_b06_50.json`.
- [36 referencias citadas y 50 consultas focalizadas](lote-06-referencias.json).
- [Doce cálculos y escenarios comprobados independientemente](lote-06-calculos.json).
- [Integridad de fuentes y vínculo de revisión con el contenido](lote-06-validacion.json).
- [Cribado léxico contra 550 candidatos anteriores](lote-06-similitud.json).
- [Seguimiento de las tres lagunas documentales del lote 04](lote-04-seguimiento.json).
- [Recomprobación del lote 05 completo](seguimiento-validacion-20261026.json).

Las preguntas incluyen ópticas 10GBASE-SR/LR, cobre multivelocidad, PoE, Ethernet, STP, LACP, cambios de listas VLAN, autostate exclude, diagnóstico OSPF, IPv6, VRF, DHCP, NTP, SNMP, controles de acceso y manejo correcto de respuestas API.

## Correcciones efectuadas al contrastar fuentes

La ficha óptica recuperada correspondía a SFP+ de 10 Gb/s, por lo que se corrigieron los ejercicios para preguntar por 10GBASE-SR/LR y por SFP-10G-T-X a 1 Gb/s según su tabla. No se dejó una pregunta sobre un módulo de 1 Gb/s respaldada por una ficha de otro producto.

Una guía IPv6 antigua redirigía a una portada general. Se rechazó como evidencia y se sustituyó el escenario por una distinción de entrega local y reenvío que sí está sustentada en RFC 4861. El caso de etiquetado VLAN explicita comportamiento nativo ordinario y no presupone soporte de un comando que no se había corroborado. Los casos de wildcard y router ID OSPF usan el capítulo que explica selección de interfaces y preferencia por loopbacks.

El comprobador detectó una copia OSPF cuyo contenido no correspondía al hash antiguo. Se recuperó nuevamente el capítulo, se releyeron los dos pasajes utilizados y se guardó una copia inmutable por hash. No se cambió el hash para aceptar bytes sin comprobarlos.

## Validación realizada

Los 50 escenarios, claves propuestas, distractores y textos bilingües se revisaron por asistente automatizado frente a las referencias citadas. Cada revisión registra su atribución y huella de contenido. Las comprobaciones de integridad verificaron 36 documentos locales y las anclas utilizadas. Esto demuestra correspondencia con la evidencia guardada, no sustituye un juicio técnico independiente ni una aprobación humana.

Los doce casos Python comprueban relleno Ethernet, longitud de cabecera TCP, presupuesto PoE, prioridad numérica LACP, unión de VLAN permitidas, conjunto de rutas de costo mínimo, coincidencia wildcard OSPF, elección de router ID, rollover Counter32, contador TOTP, orden ACL y tipo booleano JSON. Doce pruebas alteran sus claves sin cambiar la cantidad de respuestas: los verificadores detectan tanto la clave incorrecta como la revisión desactualizada.

El lote declara 49 familias y conserva familias anteriores donde el concepto se relaciona. El cribado léxico no marcó coincidencias por encima de 0,72, pero no garantiza ausencia de duplicados semánticos.

## Preguntas anteriores y fases

Se reejecutó la evidencia de las 50 preguntas del lote 05: 36 documentos y seis casos ejecutables correctos. Del lote 04 se resolvió la evidencia de unidades del caso 009 con la definición de octeto de RFC 791 y su cálculo, conservando enunciado, alternativas y clave. Los casos 020 y 029 mantienen expresamente evidencia incompleta; las URLs de soporte antiguas ensayadas no proporcionaron el pasaje suficiente. No se aprobaron por omisión.

El inventario actualizado está en [cobertura-priorizada.md](../cobertura-priorizada.md). Las fases 3 y 5 avanzan con evidencia y cobertura física; siguen pendientes aprobación editorial independiente y matriz oficial por subobjetivo. Counter32 y cálculo TOTP se consideran práctica complementaria mientras se revisa el nivel y alcance del temario.

## Aplicación y guardado

Pasaron la compilación, **449 pruebas del servidor y seis de Chromium**. La instalación cargó los 50 nuevos registros como pendientes; repetir las seis cargas creó cero registros adicionales y mantuvo 50 por lote. Las preguntas pendientes siguen excluidas de exámenes puntuables. La base SQLite heredada y las dependencias versionadas se conservaron.

El banco reúne ahora **600 candidatos y 542 familias declaradas**; la base de desarrollo separada contiene 300 originales pendientes y ocho ejemplos puntuables. No se atribuyen aprobaciones humanas ni cumplimiento de la meta de 1000 aprobadas distintas.
