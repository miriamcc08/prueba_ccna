# Corrección de dependencias detectadas al instalar en Windows

El usuario informó 11 vulnerabilidades al instalar el servidor, incluidas dos críticas. Se reprodujo la auditoría con el registro disponible en la nube y se actualizaron dependencias explícitamente, sin `--force`, sin ignorar avisos y sin utilizar `--legacy-peer-deps`.

## Cambios

- `server/package.json` y lockfile: Vitest 5.0.5, Vite 7.3.7 para resolver su dependencia compatible, Zod 4.6.7 y Express 4.22.3. Prisma y su cliente se fijan ambos en 6.19.3 para mantener compatibilidad sin adoptar Prisma 7.
- Se fijan dos dependencias transitivas mediante overrides acotados: `@prisma/config → deepmerge-ts 8.0.2` y `express → body-parser 1.20.9`. La versión publicada de esas dependencias superiores todavía resolvía componentes vulnerables. Las migraciones, generación de cliente, seed y uso HTTP del proyecto se comprueban con estos overrides; deben revisarse al actualizar Prisma o Express.
- `client/package.json` y lockfile: React Router DOM 7.18.4 y parches compatibles de dependencias transitivas de estilos. El enrutamiento declarativo existente se mantiene y se prueba mediante Chromium. React 18 y la arquitectura de la aplicación se conservan.
- `server/src/middleware/errorHandler.ts`: usa `ZodError.issues`, la API de Zod 4, para conservar errores de entrada como HTTP 400.
- `server/src/validators/schemas.ts`: evita que los defaults de Zod 4 aparezcan en actualizaciones parciales de preguntas cuando el usuario omitió esos campos. Una edición no reinicia tiempo estimado ni borra subtemas ni pasa a borrador por un default implícito; sigue invalidando la aprobación anterior.
- `server/tests/exam.integration.test.ts`: regresión HTTP que edita solo una explicación y comprueba conservación de metadatos y traducción, con retorno a pendiente de revisión.
- Este informe, `docs/auditoria-dependencias-20261026.json`, README y estado/lista de cierre documentan versiones, auditoría, comprobaciones y límites.

Se detectaron y corrigieron dos incompatibilidades antes de la entrega: resolución de peer de Vitest/Vite y comportamiento de defaults de Zod 4. No se aceptaron dependencias incompatibles a la fuerza ni se modificaron pruebas para ignorar el fallo funcional.

No cambian preguntas, esquemas/migraciones, bases de datos históricas, secretos o dependencias versionadas en `node_modules` del checkout. La instalación se realiza en la copia aislada; solo se trasladan manifiestos, lockfiles y cambios fuente al repositorio.

## Comprobación

Se ejecutaron instalaciones limpias `npm ci` de servidor y cliente desde los lockfiles, sin desactivar resolución de peers. Se generó Prisma y se ejecutaron compilación y suites sobre la copia aislada. El lock del servidor incluye dependencias opcionales de Rollup para Windows x64; no se eliminan paquetes de otras plataformas por instalar en Linux.

**Resultado final: instalación limpia de servidor/cliente y compilación correctas; 593 pruebas de servidor y 21 de Chromium aprobadas. npm audit reporta 0 vulnerabilidades conocidas en raíz, servidor y cliente, después de repetir la consulta tras las pruebas.** Se comprobaron los códigos de salida y el estado de Git. Registros: `/tmp/ccna-seguridad-server-ci.log`, `/tmp/ccna-seguridad-client-ci.log`, `/tmp/ccna-seguridad-prisma.log`, `/tmp/ccna-seguridad-build.log`, `/tmp/ccna-seguridad-tests.log` y `/tmp/ccna-seguridad-browser.log`.

Las auditorías se consultan por separado para raíz, servidor e interfaz. Los conteos antes pueden diferir de los del equipo del usuario por versiones transitivas y actualización del registro de avisos. **Cero avisos en npm audit no certifica seguridad completa**, no cierra despliegue ni sustituye controles contra abuso y revisión de configuración.

Validación de ejecución realizada en Linux con Node 24.19.0. Node 24.5.0 y npm 11.5.1 del usuario cumplen los requisitos de las versiones elegidas, pero la instalación/ejecución en su Windows se comprueba con él paso a paso; no se declara una prueba Windows que no se realizó. Para Node 22 se requiere como mínimo 22.12.0 con las herramientas actuales.

## Actualización del equipo del usuario

El cambio se prepara para la misma rama `codex/ccna-mejoras-validadas`. Primero se actualiza la carpeta original mediante `git pull --ff-only`; después se vuelven a copiar archivos a la carpeta de pruebas sin `.git`, `.env`, bases ni `node_modules`. La instalación se repite con `npm ci` para aplicar exactamente los lockfiles actualizados. No se ejecuta `npm audit fix` localmente sobre una versión antigua ni se cambia la base anterior para resolver dependencias.

El usuario recibe un paso por mensaje. El resultado concreto de publicación se comunica tras comprobar el remoto. No es necesario cambiar Node 24.5.0 para esta actualización.
