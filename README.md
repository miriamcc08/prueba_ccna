# Simulador de práctica CCNA 200-301

Aplicación React/TypeScript y Express/Prisma con SQLite para desarrollo. La puntuación de práctica y el objetivo de 82,5 % son internos; no equivalen a una calificación oficial de Cisco.

## Entorno en la nube

Requisitos: Node.js 22.12 o superior de la rama 22, o Node.js 24, npm, Python 3, Chromium (`/usr/bin/chromium` o `CHROMIUM_PATH`) y acceso HTTPS a registry.npmjs.org y binaries.prisma.sh. Usa el checkout existente; cada tarea de nube ya está aislada y no necesita worktrees.

El repositorio heredado contiene `node_modules`, `.env` y una base SQLite versionados. Para preservarlos, instala y ejecuta desde una copia separada:

```bash
cd /workspace/prueba_ccna
bash tools/cloud-setup.sh
```

El script sincroniza los archivos a `/workspace/.ccna-runtime`, instala exactamente los lockfiles, genera Prisma, aplica migraciones, carga los ejemplos, comprueba e importa los ocho lotes originales (360 candidatos) como pendientes, compila ambos componentes y ejecuta pruebas de servidor y navegador. No copia `.env` ni la base original. Repite el script después de modificar código para actualizar la copia. Si eliminas o renombras archivos fuente, elimina sus copias obsoletas de la carpeta de ejecución; la sincronización no borra archivos automáticamente. No uses la copia para editar: los cambios deben hacerse en el checkout original.

Arranque, en una terminal persistente:

```bash
cd /workspace/.ccna-runtime
export DATABASE_URL=file:/workspace/.ccna-runtime/server/prisma/cloud.db
export NODE_ENV=development
npm run dev
```

Comprobación interna: la interfaz escucha en 5173 y reenvía `/api` al servidor en 3001. `GET /api/health` debe devolver `success: true` y `db: connected`; `/api/topics` y `/api/questions` deben responder con datos. Los procesos deben arrancarse de nuevo en cada tarea.

Para ejecutar el servidor compilado: desde la carpeta de ejecución, exporta `DATABASE_URL` y ejecuta `npm --prefix server start`.

## Banco revisado: actualización del 29/10/2026

La carga inicial de 360 originales más ocho ejemplos explica las 368 preguntas visibles. La [revisión vigente](docs/revision-lote-heredado-04-20261030.md) acumula **520 versiones aprobadas, 140 pendientes y 119 antiguas rechazadas con reemplazo**. Incluye 119 correcciones que conservan sus originales. Desde `server`, `npm run db:sync-reviewed` muestra la previsión y `npm run db:sync-reviewed -- --apply` aplica las decisiones. No se ejecuta automáticamente en el setup ni sobrescribe contenido local diferente o decisiones editoriales incompatibles.

La nueva base aislada de validación tiene **787 registros, 528 validados y 450 familias validadas**; permite un simulacro de 100 con dificultad mixta. Esto no actualiza por sí solo la base de tu PC. La [primera ronda](docs/revision-y-aprobaciones-20261029.md) y la [segunda](docs/continuacion-revision-20261029.md) conservan el detalle histórico.

## Cuentas y administración

El rol **admin** permite crear preguntas bilingües, importar JSON/CSV, buscar, paginar, comprobar y revisar candidatos en `/admin`. No incluye generación con IA. Consulta la [guía de administración](docs/administracion.md) y la [auditoría funcional actual](docs/auditoria-funcional-20261026.md).

Los usuarios pueden registrarse desde la interfaz. El seed no crea una contraseña administrativa conocida ni cambia la de una cuenta existente. Para crear un administrador nuevo, inyecta `ADMIN_EMAIL` y `ADMIN_PASSWORD` (mínimo 12 caracteres) de forma segura y ejecuta `npm run admin:bootstrap` desde la carpeta `server` de la copia de ejecución. No incluyas valores en archivos versionados ni en comandos compartidos. En producción es obligatorio proporcionar `JWT_SECRET`.

Los exámenes asociados a una cuenta solo son accesibles para su propietario o administradores. Una sesión anónima se recupera con su ID de examen: trata ese identificador como privado; no tiene el mismo control de identidad que una cuenta.

El historial muestra la versión del temario y el idioma guardados en cada intento, con filtro por las siete modalidades. Conserva porcentajes con un decimal y permite reintentar ante un fallo de carga. [Cambios y comprobación](docs/mejoras-historial-20261026.md).

## Pruebas y puntuación

```bash
cd /workspace/.ccna-runtime
npm run build
npm test
```

Las pruebas incluyen cálculos de subnetting y un flujo de integración con migraciones SQLite en una base temporal: elegibilidad, filtros, familias, confirmación, caducidad, recuperación, resultados y permisos HTTP. No modifican la base de desarrollo. La suite Chromium (`npm run test:browser`) comprueba el cliente API real, registro/inicio de sesión, recuperación, estudio, favoritos y revisión administrativa con una base temporal independiente. Los servicios de prueba usan los puertos 3101 y 5175 y se cierran al terminar. Los intentos y cuentas de prueba no se guardan en la base de desarrollo.

Cada pregunta vale lo mismo. La selección múltiple exige coincidencia exacta; no hay crédito parcial. Las preguntas sin responder cuentan como cero. El porcentaje es `aciertos / total × 100`, redondeado a un decimal. La escala interna es `300 + aciertos / total × 700`, redondeada al entero. El objetivo de práctica es 82,5 %. El cierre por caducidad usa la fecha límite del servidor, incluso si la reconexión ocurre más tarde.

## Pendientes para completar el alcance

Consulta la [lista de cierre priorizada](docs/pendientes-cierre.md): banco aprobado, funciones avanzadas, calidad de interfaz y preparación de producción. Incluye criterios comprobables por tarea. La [guía CSV](docs/importacion-csv.md) explica la nueva importación desde hojas de cálculo.

## Banco de preguntas y alcance

La base versionada incluye 108 registros etiquetados `validated` por la implementación anterior; esto no demuestra una revisión técnica independiente. Los JSON de lotes contienen 660 registros candidatos, no 1000 preguntas verificadas. La instalación nueva usa los ejemplos del seed y una base diferente. No se ha certificado la exactitud de todo el banco heredado.

Las nuevas importaciones quedan en `pending_review`, aunque superen validaciones estructurales. No entran en exámenes hasta su revisión. El motor solo selecciona registros `validated`, de la versión configurada en el código (`200-301-v1.1`), sin repetir familias. Si faltan preguntas, rechaza la solicitud indicando cuántas hay; no cambia de categoría ni reduce el examen silenciosamente.

Consulta [el estado de implementación](docs/estado.md) para las limitaciones y el trabajo pendiente frente al documento original.

## Estudio, favoritos y revisión

Desde estudio puedes [cambiar de tema](docs/cambio-tema-estudio.md) creando otra práctica y conservando el intento anterior. El formulario comprueba disponibilidad y permite volver al origen; el reloj anterior no se pausa.

Puedes activar el [límite por pregunta](docs/tiempo-por-pregunta.md), controlado por servidor y compatible con examen estricto o estudio con tiempo.

Consulta también cómo [reiniciar un ejercicio en una práctica independiente](docs/reinicio-estudio.md), sin modificar el intento anterior.

Activa **Modo estudio** y, si lo deseas, **Sin cronómetro** en la configuración. Después de confirmar, puedes regresar a preguntas anteriores con su explicación. La respuesta original no se sobrescribe. Desde una cuenta puedes guardar favoritas en el examen y encontrarlas con el filtro del banco.

El panel administrativo permite importar candidatos pendientes y abrir una revisión. Para aprobar exige explicaciones bilingües, notas de al menos 20 caracteres, una referencia HTTPS y confirmación de que se revisaron concepto, alternativas y traducción. Cada decisión conserva quién la hizo y cuándo. El servidor vuelve a comprobar estos requisitos; no basta cambiar el estado con una petición genérica. Editar una pregunta aprobada la devuelve a revisión.

Audita los candidatos sin alterar la base:

```bash
cd /workspace/.ccna-runtime/server
npm run db:audit -- --output /tmp/auditoria-ccna.json
```

El reporte en `docs/auditoria-banco.json` agrupa los 660 candidatos en trece grupos de 50 y un grupo final de diez. Pasar la validación estructural no los aprueba técnicamente. El dashboard de inicio muestra a cada cuenta un plan de estudio basado en sus intentos finalizados, errores repetidos y tiempos registrados.

## Nuevo lote de 50 preguntas originales

La copia para leer y revisar está en [docs/batches/lote-original-50.md](docs/batches/lote-original-50.md). El [plan revisado](docs/plan-revisado.md) explica su relación con el PLAN.md recibido.

El setup importa el lote nuevo como `pending_review`. La base nueva de desarrollo tiene 8 ejemplos puntuables y 360 preguntas originales pendientes; los 660 candidatos JSON no se cuentan como 660 aprobados. Las pruebas de navegador siguen usando solo los ejemplos en su base temporal.

Para comprobar cálculos e importar manualmente, desde la copia de ejecución:

```bash
cd /workspace/.ccna-runtime
python3 tools/check-question-calculations.py server/prisma/questions/original_20261024_50.json --output /tmp/calculos-lote-original.json
cd server
export DATABASE_URL=file:/workspace/.ccna-runtime/server/prisma/cloud.db
npm run db:load-original
```

Repetir el cargador no duplica registros. Si un registro con el mismo ID tiene contenido diferente, la transacción se cancela y conserva las ediciones existentes. No utiliza el estado de un archivo importado para aprobar preguntas. No resetees la base para resolver un conflicto: revisa el registro señalado.

Las 28 comprobaciones verifican cálculos y escenarios modelados con una implementación independiente. Las referencias del primer lote ahora cuentan con metadatos de recuperación. Consultar pasajes y completar la revisión técnica y de traducción siguen siendo requisitos separados antes de aprobar preguntas para exámenes puntuables.

## Historial estable y correcciones editoriales

Los intentos nuevos guardan el contenido de cada pregunta y el orden de las alternativas al configurarse. Puntuación y revisión usan esa copia, incluso si el banco cambia. Las alternativas se barajan salvo que su texto dependa de letras. Los intentos anteriores a esta función no reciben una versión histórica inventada: la revisión muestra una advertencia.

En administración, abre una pregunta y **Editar como nueva revisión** para corregir enunciados o explicaciones sin sobrescribir el original. La revisión nueva comparte familia y requiere aprobación. Las modificaciones de alternativas para preguntas usadas se realizan mediante `POST /api/questions/:id/revisions`, con permisos administrativos. No borres las alternativas originales: los intentos existentes pueden referenciarlas.

La revisión posterior de candidatos y sus límites están en [docs/revision-banco-20261024.md](docs/revision-banco-20261024.md). Para repetir los cálculos heredados:

```bash
cd /workspace/.ccna-runtime
python3 tools/review-legacy-calculations.py --output /tmp/revision-calculos-heredados.json
```

Las correcciones de candidatos no actualizan automáticamente las copias de una base que ya tenga ediciones o revisiones. La revisión previa agrupó 339 familias en 350 candidatos; el informe actualizado incluye los lotes sucesivos y sus familias relacionadas; no significa que todas sean técnicamente aprobadas ni que no queden duplicados semánticos.

## Segundo lote original y fuentes

Lee [las nuevas 50 preguntas](docs/batches/lote-original-02-50.md) y [su informe](docs/batches/lote-02-informe.md). Incluyen 10 de selección múltiple y 13 comprobaciones independientes. Se recuperaron 32 documentos primarios y se registraron 24 consultas focalizadas; el resto aún requiere revisión documental precisa. Todas las nuevas preguntas permanecen pendientes de aprobación técnica y de traducción.

La instalación ahora importa todos los lotes originales. Para hacerlo manualmente:

```bash
cd /workspace/.ccna-runtime/server
export DATABASE_URL=file:/workspace/.ccna-runtime/server/prisma/cloud.db
npm run db:load-original -- --all
```

Para un solo lote, usa `npm run db:load-original -- --file prisma/questions/original_20261024_b02_50.json`. Los IDs deben pertenecer al lote declarado y la carga preserva las ediciones existentes.

El cribado léxico puede repetirse con `python3 tools/screen-question-similarity.py server/prisma/questions/original_20261024_b02_50.json --output /tmp/similitud-lote-02.json` desde la copia de ejecución. Su resultado no sustituye una revisión semántica. El panel administrativo muestra la referencia técnica disponible y la familia de ejercicios; consultar la referencia no marca automáticamente la casilla de revisión ni aprueba la pregunta.

## Tercer lote original

[Lee las siguientes 50 preguntas](docs/batches/lote-original-03-50.md) y [su informe](docs/batches/lote-03-informe.md). Incluyen 10 ejercicios de selección múltiple, uno de verdadero/falso y 21 casos calculables comprobados de forma independiente. Al cerrar el tercer lote, las tres cargas originales formaban 150 registros pendientes y el banco reunía 450 candidatos con 427 familias declaradas.

El setup ya detecta este lote automáticamente. Para cargar únicamente el tercero, desde `server/` de la copia de ejecución y con `DATABASE_URL` exportado, ejecuta `npm run db:load-original -- --file prisma/questions/original_20261024_b03_50.json`. La repetición no duplica registros y una discrepancia de contenido conserva la protección contra sobrescrituras.

## Cuarto lote original y próximos pasos por fase

[Consulta las 50 preguntas del lote 04](docs/batches/lote-original-04-50.md) y [su informe de revisión](docs/batches/lote-04-informe.md). Amplían switching, VRRP, diagnóstico de OSPF, QoS, seguridad y automatización. Incluyen cuatro ejercicios de selección múltiple y nueve comprobaciones independientes de cálculo o escenario. Se recuperaron 37 documentos primarios y se registraron 13 consultas focalizadas; ninguna pregunta se aprueba automáticamente.

Al cerrar el cuarto lote había 500 candidatos en archivos, 467 familias declaradas y 200 preguntas originales nuevas pendientes. La deduplicación semántica y la aprobación técnica y de traducción siguen abiertas. El setup carga los cuatro lotes sin duplicarlos. Para cargar solo el último desde `server/` en la copia de ejecución: `npm run db:load-original -- --file prisma/questions/original_20261026_b04_50.json`.

Las prioridades siguientes por fase están en [el plan revisado](docs/plan-revisado.md#orden-de-continuación-después-del-lote-04). La verificación de esta entrega pasó la compilación, 320 pruebas de servidor y seis pruebas de navegador.

## Quinto lote: preguntas con validación documentada

[Lee las 50 preguntas nuevas](docs/batches/lote-original-05-50.md) y [su informe de validación](docs/batches/lote-05-informe.md). Se contrastaron los escenarios y claves con pasajes de 36 documentos citados y se registró evidencia individual para las 50. Seis casos tienen además comprobación independiente en Python. La nueva herramienta `tools/check-question-evidence.py` comprueba integridad y detecta cambios posteriores al contenido revisado; no otorga aprobación humana.

Al cerrar el lote 05 había **550 candidatos, 506 familias declaradas y 250 originales nuevos pendientes**. La compilación, 383 pruebas del servidor y seis del navegador pasaron. La carga repetida de los cinco lotes no duplica registros. Todas las preguntas nuevas conservan `pending_review` hasta completar la aprobación editorial independiente.

## Sexto lote y seguimiento de las fases

Se añadieron [50 preguntas más](docs/batches/lote-original-06-50.md), con seis de selección múltiple y doce comprobaciones independientes. Las 50 tienen revisión documental registrada; se verificaron los bytes y pasajes de 36 referencias citadas. También se recomprobó el lote 05 y se completó la evidencia de unidades de un caso del lote 04; dos casos antiguos siguen pendientes de fuente directa.

Al cerrar el lote 06 había **600 candidatos, 542 familias declaradas y 300 originales pendientes**. Pasaron la compilación, 449 pruebas del servidor y seis del navegador. [Informe del lote 06](docs/batches/lote-06-informe.md) y [cobertura y prioridades por fase](docs/cobertura-priorizada.md). La aprobación editorial independiente y la matriz oficial del temario siguen abiertas.

## Séptimo lote y revisión de contenido anterior

Se guardaron [50 preguntas adicionales](docs/batches/lote-original-07-50.md), centradas en arquitecturas, virtualización, controladores y diagnóstico. Las 50 tienen revisión documental registrada con 30 referencias citadas; diez casos se comprobaron independientemente. También se revisaron las primeras diez del primer lote y se añadió RFC 9542 para actualizar la referencia de bits MAC, conservando textos y claves.

Al cerrar el lote 07 había **650 candidatos, 577 familias declaradas y 350 originales pendientes**. Hay 209 originales con consulta focalizada registrada; no son aprobaciones humanas. Pasaron compilación, 518 pruebas de servidor y seis de navegador. [Informe](docs/batches/lote-07-informe.md) y [prioridades por fase](docs/cobertura-priorizada.md).

## Lote focalizado 08 y explicaciones configurables

Se añadieron [diez preguntas de AIOps y automatización](docs/batches/lote-original-08-10.md) con revisión documental y dos cálculos independientes. El primer lote ya tiene veinte preguntas revisadas individualmente; treinta siguen sin esa revisión focalizada. Las citas generales se vinculan a los capítulos concretos consultados sin reescribir contenido importado.

En estudio, `showExplanations` ahora se aplica tanto al responder como al recuperar respuestas. Las sesiones antiguas sin preferencias guardadas conservan su comportamiento; la revisión final mantiene explicaciones. El modo estricto conserva su protección. Sonidos y límite por pregunta siguen pendientes.

El cargador admite exactamente 10 o 50 preguntas según el tamaño declarado, y el setup detecta ambos. Para cargar solo el focalizado desde `server/`: `npm run db:load-original -- --file prisma/questions/original_20261026_b08_10.json`.

Estado actual: **660 candidatos, 586 familias declaradas y 360 originales pendientes**. Pasaron compilación, 540 pruebas de servidor y ocho del navegador. [Informe y límites](docs/batches/lote-08-informe.md); la aprobación editorial y matriz oficial siguen abiertas.

## Dependencias actualizadas

Se actualizaron Vitest, Zod, Express y React Router, además de dependencias transitivas, para resolver los avisos detectados durante la instalación en Windows. Usa los lockfiles con `npm ci`; no apliques `npm audit fix --force`. Versiones, cambios de compatibilidad y evidencia en [actualizacion-dependencias-20261026.md](docs/actualizacion-dependencias-20261026.md). Node 24.5.0 es compatible.
