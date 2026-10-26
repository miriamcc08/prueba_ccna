# Lote original 07 y revisión del primer lote

El 26 de octubre de 2026 se guardaron 50 preguntas bilingües adicionales: 45 de respuesta única y cinco de selección múltiple. Hay diez preguntas básicas y 40 intermedias; la dificultad propuesta todavía requiere calibración con resultados reales. El reparto por áreas es 10/10/12/5/8/5.

## Preguntas y evidencia

- [Lote 07: preguntas, claves y explicaciones](lote-original-07-50.md).
- Fuente de verdad: `server/prisma/questions/original_20261026_b07_50.json`.
- [30 referencias citadas y 50 consultas focalizadas](lote-07-referencias.json).
- [Diez comprobaciones independientes](lote-07-calculos.json).
- [Integridad y huellas de revisión](lote-07-validacion.json).
- [Cribado léxico frente a 600 candidatos anteriores](lote-07-similitud.json).
- [Evidencia de las primeras diez preguntas originales](lote-01-referencias.json).
- [Resultado explícito de la revisión parcial: 10 revisadas, 40 sin esta revisión](lote-01-validacion-parcial.json).

## Avance de cobertura

Se amplían roles de acceso/distribución y núcleo colapsado, leaf-spine, virtualización overlay/underlay, NVE y VTEP, redundancia lógica del control, interfaces de controladores e intención declarativa. También se incluyen diagnóstico OSPF, vida preferida frente a válida en IPv6, DHCP/NAT, caché DNS negativa, EAP-TLS, autorización de API y revocación de credenciales expuestas.

Los ejercicios de VXLAN y detalles de protocolo son material de práctica cuyo nivel y correspondencia por subobjetivo oficial siguen en revisión. Citar un RFC no demuestra que todos sus detalles formen parte del examen. La cobertura de IA y de herramientas específicas sigue siendo una prioridad aparte; este lote no declara resueltos todos los huecos del temario.

## Validación y correcciones

Se revisaron por asistente automatizado los 50 escenarios nuevos, sus claves, supuestos, distractores y coherencia bilingüe frente a las referencias. Se verificaron bytes, hashes y pasajes de los 30 documentos citados. La huella de cada pregunta permite detectar una edición posterior. No se registró una aprobación humana.

Los diez casos Python comprueban enlaces de una fabric, saltos de un camino explícito, espacio bruto del VNI, razón de potencia con fórmula dada, sobresuscripción, desempate STP, prioridad LACP, costos OSPF positivos, TTL negativo DNS y capacidad de un modelo PAT definido. Diez pruebas cambian claves manteniendo su cardinalidad: fallan tanto la comprobación independiente como la correspondencia con la revisión guardada.

Se sustituyó un escenario sobre el puerto no controlado 802.1X que no estaba suficientemente respaldado por la referencia seleccionada por la dependencia de IP de EAP, sustentada directamente en RFC 3748. La pregunta de potencia distingue dBm de cobertura y tasa de datos; la fórmula pertenece al modelo explícito del ejercicio. La pregunta de VNI distingue patrones brutos de segmentos realmente utilizables o soportados por un equipo.

El lote declara 48 familias; los ejercicios relacionados de DTP y vidas de direcciones IPv6 comparten familia. El cribado léxico no marcó similitudes superiores a 0,72, sin garantizar deduplicación semántica completa.

## Revisión del contenido anterior

Las preguntas 001–010 del primer lote recibieron revisión documental individual y volvieron a comprobarse sus cálculos mediante el verificador original. Se conservaron enunciados, alternativas, claves, IDs y familias; las siete cargas originales se repitieron sin conflicto ni duplicados.

Para el caso de bits MAC se añadió RFC 9542, que sustituye a RFC 7042. La actualización queda registrada como referencia complementaria vigente sin reescribir contenido ya importado.

La herramienta de evidencia exige coincidencia de todos los IDs en su modo normal. La opción explícita `--reviewed-only` permite comprobar un lote parcialmente revisado e informa el total y los casos sin revisión. Las pruebas comprueban que no presenta diez revisiones como cincuenta, que rechaza IDs ajenos, manifiestos vacíos y contenido editado tras la revisión.

Desde la raíz de la copia de ejecución:

```bash
python3 tools/check-question-evidence.py server/prisma/questions/original_20261024_50.json --references docs/batches/lote-01-referencias.json --reviewed-only
```

Añadir `--check-cache` verifica también las copias recuperadas, que deben estar disponibles en la caché indicada. Sin esa opción se comprueba el manifiesto y la huella del contenido, sin acceso a Internet. El modo parcial no aprueba las otras 40 preguntas ni elimina su trabajo pendiente.

## Estado y siguiente fase

Pasaron compilación, **518 pruebas del servidor y seis del navegador**. La importación repetida de los siete lotes creó cero registros adicionales. La base heredada y dependencias versionadas se conservaron.

El banco reúne **650 candidatos y 577 familias declaradas**. De las 350 preguntas originales nuevas, 209 tienen consulta focalizada registrada y 99 incluyen un cálculo o escenario ejecutable; esos conjuntos se superponen. Quedan otras 141 originales sin consulta focalizada registrada y continúa pendiente revisar las 300 heredadas. La base de desarrollo separada mantiene ocho ejemplos puntuables y 350 originales pendientes.

Las fases 3 y 5 avanzan con revisión y cobertura; todavía faltan aprobación editorial independiente, deduplicación semántica y matriz oficial por subobjetivo. Los dos casos antiguos de autostate y retirada de rutas conectadas siguen abiertos. Orden actualizado: [cobertura-priorizada.md](../cobertura-priorizada.md).
