# Revisión y aprobaciones del 29/10/2026

> Registro de la primera ronda. La segunda ronda está en [continuación de la revisión](continuacion-revision-20261029.md) y el estado vigente en [revisión de heredadas](revision-heredadas-20261029.md).

## Resultado y límites

Se comprobaron estructuralmente los 660 candidatos existentes y se revisaron técnicamente en profundidad 134: respuesta, distractores, explicación, supuestos y coherencia español/inglés. Se aprobaron **131 (120 originales y 11 heredadas)**. Permanecen **529 pendientes**: tres revisadas que necesitan aclaración o evidencia y 526 sin revisión técnica completa en esta entrega. No se generaron preguntas nuevas.

De las aprobadas, 110 tienen comprobaciones independientes ejecutables y 21 revisión documental. Se contrastaron 55 documentos primarios Cisco/RFC disponibles en la caché del proyecto, verificando sus hashes y pasajes. La consulta fue el 29/10; no se afirma haber descargado versiones nuevas ese día ni haber certificado la vigencia íntegra del temario oficial. El manifiesto conserva URL, hash, ubicación y extractos breves (máximo 90 palabras por documento).

Esta es una **revisión asistida por un agente automatizado, autorizada por el usuario**, no una certificación humana o de Cisco. El manifiesto `server/prisma/reviews/assisted-20261029.json` registra las decisiones asociadas al contenido exacto. Los indicadores de revisión humana pendiente de los lotes originales conservan su significado histórico; no se falsifica una firma humana.

En la copia de ejecución de nube se pasó de 368 a **668 preguntas** al incorporar también las 300 heredadas: **139 validadas** (131 de esta revisión y ocho ejemplos previos), 529 pendientes y 120 familias validadas distintas. Se verificó un simulacro de 100 preguntas con dificultad mixta. Esto no permite 100 preguntas con cualquier filtro: por ejemplo, hay 15 familias básicas. No acredita cobertura ponderada completa del blueprint.

**Estos cambios todavía no actualizan la base SQLite del equipo Windows del usuario.** Las cifras anteriores corresponden a la copia de nube después de aplicar el manifiesto; una base con contenido propio puede tener otras cifras.

## Correcciones de contenido

Se añadieron referencias HTTPS primarias a las 11 preguntas heredadas aprobadas. Se corrigieron siete registros (posiciones contadas desde 1):

| Archivo y posición | Corrección bilingüe |
|---|---|
| batch2_network_fundamentals, 7 | Distinguir direcciones asignadas y hosts utilizables en /25 y /26; justificar eficiencia sin llamar no asignadas a direcciones del bloque. |
| batch3_all, 9 | Planteamiento CIDR hipotético, sin atribuir una asignación real al ISP; normalizar 198.51.96.0/21 y sustituir terminología de clase por /24. |
| batch4_all, 7 | Un /21 contiene ocho /24; 192.168.0.0/20 no contiene las redes 16–19. |
| batch5_all, 4 | La alternativa incumple la asignación consecutiva desde el bloque inferior; no implica falta de capacidad total. |
| batch5_all, 30 | Distinguir resumen OSPF externo de interárea sin afirmar que ABR y ASBR sean roles excluyentes ni limitar todo resumen externo a Type 5. |
| batch6_all, 1 | Explicar los bits de la máscara sin presuponer un prefijo padre no indicado. |
| batch6_all, 2 | /23 abarca 16.0/24 y 17.0/24 y termina en 17.255; corregir la explicación de la alternativa. |

Los 360 contenidos originales no se modificaron. Las decisiones se aplican como un registro separado de revisión.

Tres preguntas inspeccionadas se mantienen pendientes:

- `ccna-original-20261024-b03-026`: falta explicitar que las interfaces están habilitadas en el proceso OSPF; passive-interface no lo hace por sí mismo.
- `ccna-original-20261026-b04-012`: el cálculo pasa, pero la evidencia disponible no fundamenta suficientemente la regla exacta de excluir el puerto de ingreso al inundar unicast desconocido.
- `ccna-original-20261024-045`: la referencia disponible es un índice; falta el capítulo concreto que documente protect mode.

## Aplicación segura y trazabilidad

Desde `server`, con las dependencias instaladas, Prisma generado, migraciones aplicadas y seed ejecutado, utiliza la misma `DATABASE_URL` de tu aplicación:

```powershell
npm run db:sync-reviewed
```

Ese comando solo muestra una previsión. Para importar las preguntas que faltan y aplicar exclusivamente las 131 decisiones aprobadas:

```powershell
npm run db:sync-reviewed -- --apply
```

Detén antes el servidor para actualizar los archivos y evitar bloqueos de SQLite. En la copia Windows conocida, la variable es `$env:DATABASE_URL="file:./pruebas-windows.db"`, ejecutando desde su carpeta `server`. No uses reset ni borres la base. Es necesario actualizar primero el código desde la rama `codex/ccna-mejoras-validadas`; copiar código no copia estas decisiones a la base hasta ejecutar el comando.

La operación es transaccional e idempotente. Comprueba hashes de los 660 contenidos, respuestas y duplicados exactos. Conserva ejemplos y preguntas propias; rechaza contenido local diferente, coincidencias ambiguas, rechazos previos y restaurar silenciosamente aprobaciones retiradas. Si encuentra diferencias, cancela toda la operación para exigir una revisión explícita. No sobrescribe tus ediciones.

Cada aprobación conserva evidencia y notas en QuestionReview. El actor técnico `system-assisted-bank-review`, rol `review_service`, tiene prohibidos el inicio de sesión y el uso de tokens interactivos. **No es una cuenta administradora**. La creación de un admin real sigue siendo optativa mediante `admin:bootstrap`; no se inventaron credenciales. El flujo administrativo de revisión continúa disponible.

## Archivos y validación

- `tools/build-reviewed-bank-report.py`: reconstruye el manifiesto desde las selecciones revisadas, fuentes locales y cálculos independientes; requiere la caché de referencias, que no se publica completa.
- `server/prisma/bank-review-format.ts`: normalización y hashes de contenido.
- `server/prisma/sync-reviewed-bank.ts` y script `db:sync-reviewed`: previsión, importación y aplicación auditada.
- Middleware de autenticación y login: bloqueo del actor técnico.
- Pruebas de manifiesto, integración y navegador: contenido alterado, conservación de ediciones, retirada de aprobación, idempotencia, bloqueo de sesión y simulacro de 100 familias únicas con capturas.

Validación completada: compilación de cliente y servidor; comprobación estricta de tipos de los nuevos módulos CLI; **599 pruebas de servidor y 22 de Chromium aprobadas**; 101 comprobaciones originales y 11 heredadas independientes; revisión de espacios con `git diff --check`. Las pruebas funcionales no convierten las 529 pendientes en preguntas revisadas.

Pendientes: revisión técnica de las 529 restantes, cobertura por subobjetivo y pesos oficiales, duplicados semánticos completos, disponibilidad suficiente para cada combinación de filtros y preparación del despliegue de producción. La generación de preguntas sigue pausada.
