# Integración de las ramas — 05/11/2026

La rama oficial `main` estaba en `cef82bb` y la entrega de mejoras en `e69e860`. Las mejoras descienden del commit original: no hay dos implementaciones independientes que deban combinarse manualmente. La integración se realiza con avance directo (`--ff-only`), conservando todo el historial.

## Trabajo recuperado de Antigravity

El usuario publicó los tres commits que permanecían únicamente en su PC:

| Commit | Contenido comprobado |
|---|---|
| `4636464` | Regeneración de archivos del cliente Prisma que ya estaban versionados en el repositorio heredado. |
| `451c86d` | Ajustes de tipos en rutas, servicio y esquema de actualización de preguntas; scripts temporales de reescritura. |
| `fccab10` | Ajustes adicionales de TypeScript. |

No habían actualizado `main` en GitHub. Los tres se incorporan al historial de integración; no se descartan sus commits ni se reescribe el historial.

## Ajustes antes de integrar

- Se eliminaron los `any` añadidos a la validación de preguntas y sus opciones. La actualización usa `Prisma.QuestionUncheckedUpdateInput`, que comprueba los campos y tipos de escritura de Prisma, en lugar de `Record<string, any>`.
- Se retiraron aserciones redundantes y la aserción de no nulidad de opciones dentro del bloque que ya verifica su existencia.
- Se retiraron `fix-params.js`, `fix-questions-route.js`, `fix-schemas.js` y `fix-ts-errors.js`. Eran scripts temporales de sustitución de texto, sin referencias en las tareas del proyecto; volver a ejecutarlos podía reescribir otra vez el código ya corregido.
- Se conservaron los ajustes compatibles de parámetros de rutas y el esquema parcial sin valores por defecto. Las pruebas existentes comprueban que omitir campos en una edición no borra sus valores.

La comprobación usa una instalación limpia desde los archivos lock y genera Prisma desde `server/prisma/schema.prisma`. No depende del cliente generado que quedó guardado en `node_modules`. La limpieza general de dependencias y artefactos que el repositorio original ya versionaba sigue siendo un pendiente separado.

## Validaciones

Compilación de cliente y servidor, tipado estricto de las herramientas de revisión, **622 pruebas de servidor y 22 de Chromium aprobadas**. Se comprobaron administración y revisión de preguntas, exámenes, historial, autenticación, importación e idempotencia del banco. La auditoría estructural verifica 869 registros, sin duplicados exactos ni rechazos estructurales, y el manifiesto editorial de 619 validados, 209 originales rechazados con reemplazo y 41 pendientes.

Se aplicaron las tres migraciones posteriores al primer commit sobre una copia aislada de la base antigua. Se compararon cantidad y checksum de los valores de las columnas originales de sus diez tablas: se conservaron todos los registros, incluidas 108 preguntas y cuatro exámenes. Integridad SQLite correcta y sin violaciones de claves foráneas. No se modificó la base original del repositorio ni una base del PC del usuario.

[Resultados de la integración](validacion-integracion-main-20261105.json). La compilación conserva avisos de tamaño del bundle; la instalación también avisa de la futura retirada de la configuración Prisma en package.json y del mantenimiento de Recharts 2. Estos avisos no impidieron compilar ni superar las pruebas. No se afirma que las 41 preguntas pendientes hayan sido aprobadas en esta integración.

## Actualizar la rama oficial en el PC

En PowerShell, dentro de `C:\Users\miria\OneDrive\Escritorio\cnna`, después de comprobar la publicación en GitHub:

```powershell
git fetch origin
git switch main
git merge --ff-only origin/main
git log -1 --oneline
```

Si Git avisa de cambios locales o de ramas divergentes, conserva el mensaje y detén ese paso; no uses `reset --hard`, `clean` ni un push forzado. La caché local `server/node_modules/.vite/vitest/results.json` no debe añadirse al commit.

Si ejecutas el proyecto directamente desde esa carpeta, detén primero el servidor y actualiza la instalación:

```powershell
npm ci
npm --prefix server ci
npm --prefix client ci
Set-Location server
npm run db:generate
npx prisma migrate deploy
Set-Location ..
npm run build
npm run dev
```

Conserva tu `.env` y tu base SQLite. Para una base con datos propios, guarda una copia de seguridad antes de migrarla; no ejecutes `db:reset`. La integración no aplica automáticamente las decisiones editoriales: desde `server`, `npm run db:sync-reviewed` permite revisar la previsión y `npm run db:sync-reviewed -- --apply` aplica el manifiesto comprobando conflictos.

Si arrancas la copia de `%LOCALAPPDATA%\CCNA-pruebas-4afc703`, actualizar el repositorio de OneDrive no actualiza esa segunda carpeta. Debe actualizarse también su código antes de repetir allí la instalación, preservando su `.env` y su base. No reemplaces esos archivos ni copies las carpetas `node_modules` entre instalaciones.
