# Sincronizar la base heredada sin sobrescribir su contenido

## Incidencia del 05/11/2026

Al preparar la base antigua del usuario, la previsión se detuvo en `cmvcgz1110002acj0oyyzo7z8` con `an existing approval cannot be withdrawn by this correction import`. El contenido corresponde a `ccna-legacy-batch1_automation-001`: la base inicial lo marcaba validado y el manifiesto posterior conserva ese original rechazado con una versión corregida aprobada. El bloqueo habitual es correcto: importar no debe retirar aprobaciones silenciosamente.

El análisis de una copia migrada de la base del primer commit identificó 100 versiones antiguas relacionadas con el banco. Sus versiones canónicas tienen hoy 42 rechazos con reemplazo aprobado, 20 aprobaciones y 38 pendientes. Además, siete registros presentan diferencias respecto al archivo canónico: familias, referencias, una explicación y una clasificación. No deben sobrescribirse para hacer pasar la importación.

## Opción explícita

`--archive-legacy-versions` permite migrar esas versiones conocidas mediante archivo y creación separada. Su lista de procedencia está en `server/prisma/reviews/legacy-approval-baseline.json`, vinculada al commit `cef82bb` y al SHA-256 de su base original. Cada entrada fija ID antiguo, ID canónico, hash del contenido antiguo, hash del contenido revisado, estado y fecha de verificación originales.

La opción comprueba esas condiciones y exige que no exista ninguna revisión editorial registrada para el original. Si detecta una edición local, un cambio de estado o verificación, una revisión, o una duplicación ambigua, se detiene y no aplica cambios. No acepta retirar aprobaciones de versiones desconocidas. Las protecciones habituales siguen vigentes sin la opción.

Al aplicar:

1. Conserva las preguntas antiguas, sus IDs, opciones y contenidos. Las aparta de futuros exámenes cambiando su estado a **borrador** (`draft`); el estado previo queda registrado en una auditoría de archivo, no como una nueva aprobación o rechazo técnico. Conserva su fecha previa de verificación; `updatedAt` cambia al efectuar el archivo.
2. Crea las versiones canónicas por separado y aplica únicamente las decisiones del manifiesto. Las pendientes permanecen pendientes, aunque su antecesora antigua estuviera marcada validada.
3. Registra una auditoría `archived` por versión antigua, con procedencia, hash, versión canónica y estado previo. La operación completa es transaccional.
4. Una repetición reconoce únicamente archivos con auditoría del servicio y estado borrador; no duplica registros ni decisiones. Si falta su versión canónica, o se reactiva un original de forma incompatible, exige reconciliación explícita.

No modifica cuentas, contraseñas, intentos ni respuestas históricas. La consulta de los exámenes antiguos sigue usando los mismos IDs y contenido. No se fabrican snapshots históricos para ellos.

## Pasos en PowerShell

Después de descargar el cambio, desde `server`, y conservando la copia de seguridad realizada antes de las migraciones:

```powershell
npm run db:sync-reviewed -- --archive-legacy-versions
```

Esto es **solo previsión**. En la copia inicial comprobada informa 100 versiones por archivar, 869 canónicas por crear y cero decisiones aplicadas. `targetStatus` dentro de la lista describe el estado de la versión canónica; el original se aparta como borrador. Si tu salida muestra un conflicto, consérvala para revisarlo sin forzar cambios.

Solo después de revisar la previsión se aplica explícitamente:

```powershell
npm run db:sync-reviewed -- --archive-legacy-versions --apply
```

Después, el comando habitual vuelve a funcionar:

```powershell
npm run db:sync-reviewed
```

## Resultado en la copia de prueba

La base original del repositorio y la del PC no se modificaron durante estas comprobaciones. La copia aislada pasó de 108 a 977 preguntas: 100 originales conservadas como borradores, ocho ejemplos anteriores del seed y 869 registros canónicos del banco (619 validados, 209 rechazados con reemplazo y 41 pendientes). En total, 627 figuran validadas contando los ocho ejemplos, no recertificados en esta operación. Las 977 filas no representan 977 ejercicios distintos.

Se verificaron las 108 preguntas y sus 442 opciones originales, una cuenta, 51 temas, dos fuentes y los cuatro exámenes con sus 70 filas de preguntas de examen. Los valores originales se conservan salvo estado y timestamp de actualización de las 100 versiones apartadas. La base supera integridad SQLite y no presenta violaciones de claves foráneas. Hay 100 auditorías de archivo separadas de las 828 decisiones técnicas. Repetir la aplicación crea cero preguntas, archiva cero versiones y aplica cero decisiones.

Las pruebas de regresión comprueban previsión sin escrituras, conservación de contenidos/IDs/fechas/historial, bloqueos por edición local o revisión registrada, exclusión de versiones antiguas y mantenimiento de pendientes. Los resultados se resumen en [validacion-base-heredada-20261105.json](validacion-base-heredada-20261105.json). La comprobación de este cambio se ejecutó en Linux; falta confirmar la previsión sobre la base real del PC.

La suite completa pasó **632 pruebas en 15 archivos**, incluidas cuatro regresiones nuevas; el tipado estricto de la sincronización también pasó. La ejecución anterior en paralelo se interrumpió por saturación del entorno; el resultado citado corresponde a la ejecución completa final con un solo trabajador.
