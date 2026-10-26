# Lote focalizado 08, revisión anterior y preferencia de explicaciones

Esta continuación combina las fases 2, 3 y 5. Se guardaron diez preguntas ES/EN nuevas y se revisaron otras diez del primer lote, además de corregir una preferencia del motor que se guardaba pero no se aplicaba.

## Fase 2: explicaciones de estudio

`showExplanations` se respeta al confirmar y volver a consultar una respuesta en estudio. Si está desactivado, la API omite la explicación y la pantalla también la oculta; se conserva el feedback de acierto y selección. Al completar el intento, la revisión final mantiene las explicaciones del contenido capturado.

Las sesiones antiguas sin preferencias guardadas conservan su comportamiento de estudio. El modo estricto sigue sin revelar soluciones aunque reciba `showExplanations=true`. Las pruebas cubren ambos valores, recarga y navegación; los ajustes de sonidos y límite por pregunta siguen pendientes.

## Preguntas nuevas

- [Diez preguntas de AIOps, automatización y autorización](lote-original-08-10.md).
- Fuente: `server/prisma/questions/original_20261026_b08_10.json`.
- [Cuatro documentos citados y diez registros de consulta](lote-08-referencias.json).
- [Dos modelos numéricos independientes](lote-08-calculos.json).
- [Integridad de fuentes y revisión](lote-08-validacion.json).
- [Cribado léxico frente a 650 candidatos](lote-08-similitud.json).

Ocho ejercicios tienen una respuesta y dos requieren seleccionar dos opciones. La cobertura focalizada es nueve de automatización y uno de seguridad; no representa los pesos del examen. Se trabaja el propósito de AIOps, correlación de eventos, colaboración, experiencia humana, diagnóstico asistido, NETCONF `test-only`, HTTP 409 y autorización de cambios propuestos por IA.

Los dos cálculos usan modelos explícitos: precisión de alertas y ahorro de tiempo. No son datos de rendimiento de Cisco ni subobjetivos oficiales confirmados. Se comprobaron las dos claves y dos pruebas detectan su alteración conservando el número de respuestas.

La fuente Cisco de AIOps se pudo consultar. Los sitios de Ansible, HashiCorp y NIST no estuvieron accesibles por el proxy, y una ruta Cisco de ML devolvió 404; no se usaron como evidencia. Eso mantiene pendiente la revisión de afirmaciones específicas sobre herramientas y modelos de IA.

## Fase 3: primeras veinte del lote original

Se revisaron los casos 011–020: separación de VLAN, acceso, filtrado troncal, STP, LACP, consistencia EtherChannel, espacio de ID VLAN y VLAN nativa. Se conservaron todos los campos importados, incluidos enunciados, claves, familias y URLs originales.

Las citas originales a una guía general se acompañan ahora del capítulo concreto consultado. El manifiesto diferencia `url`, que conserva la cita, de `documentUrl`, que identifica el documento con los bytes y pasajes revisados. La herramienta rechaza sustituir ese documento después de la revisión. La copia legible muestra también el documento consultado.

El [manifiesto del lote 01](lote-01-referencias.json) tiene ahora 20 revisiones y 14 documentos usados; el [resultado parcial](lote-01-validacion-parcial.json) informa **20 de 50**, con **30 sin esta revisión focalizada**. La referencia vigente RFC 9542 añadida en la entrega anterior se conserva.

Todas estas revisiones están atribuidas al asistente automatizado. La evidencia de procedencia y sus hashes no sustituyen la aprobación editorial independiente. Los nuevos registros conservan `pending_review`.

## Carga, pruebas y estado

El cargador admite lotes declarados de 10 o 50 y exige exactamente ese número. Rechaza nueve u once cuando se declara diez, antes de importar, y nunca completa el lote mediante relleno. El setup descubre ambos tamaños. El lote 08 queda cerrado en diez preguntas con sus propios IDs; las tandas siguientes pueden usar otra identidad.

La instalación completa pasó compilación, **540 pruebas del servidor y ocho del navegador**. Repetir las ocho cargas no añadió registros ni sobrescribió contenido. La base heredada versionada y dependencias versionadas se conservaron.

El banco de archivos contiene **660 candidatos y 586 familias declaradas**: 13 grupos completos de auditoría de 50 y un grupo final de diez. Hay 360 originales nuevos pendientes en la base de desarrollo separada, además de ocho ejemplos puntuables. Entre los originales, 229 tienen consulta focalizada y 101 un caso ejecutable; son conjuntos superpuestos. Quedan 131 originales sin registro focalizado y sigue abierta la revisión completa de las 300 heredadas.

Los dos casos antiguos del lote 04 —autostate y retirada de ruta conectada— siguen pendientes. Continúan abiertas la aprobación editorial, la matriz oficial de objetivos, las variantes y otros controles del motor, y la preparación de producción. Prioridades: [cobertura-priorizada.md](../cobertura-priorizada.md).
