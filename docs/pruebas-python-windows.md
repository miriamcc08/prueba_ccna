# Pruebas de revisión con Python en Windows

## Incidencia del 05/11/2026

En el PC del usuario `py --version` devolvió Python 3.13.6, pero los comprobadores de preguntas se ejecutaban siempre con `python3`. Windows resolvía este último nombre al alias de Microsoft Store y las pruebas mostraron 567 aprobadas y 55 fallidas. Instalar Python de nuevo no era el primer paso necesario: había que usar el ejecutable disponible.

## Cambio

Las nueve suites que invocan comprobadores Python utilizan ahora `server/tests/helpers/python.ts`:

- En Windows ejecuta `py -3 -X utf8`.
- En Linux y macOS ejecuta `python3 -X utf8`.
- `CCNA_PYTHON` permite indicar la ruta de un intérprete Python 3 concreto. Su valor es una ruta de ejecutable, sin argumentos adicionales.
- Pasa los argumentos sin shell, conservando correctamente rutas con espacios.
- Fuerza modo UTF-8 también para las lecturas de archivos que usan la codificación predeterminada. Así las preguntas bilingües no dependen de la página de códigos de Windows.
- Propaga los errores del comprobador: no omite pruebas ni convierte fallos en aprobaciones.

Se añaden seis pruebas: selección del lanzador Windows; selección Linux y macOS; ruta de intérprete configurada con espacios; ejecución real de un script con ruta espaciada y texto Unicode; propagación de una salida fallida. La selección Windows se verifica mediante su vector de argumentos. La suite de esta entrega se ejecuta en Linux; la comprobación real en Windows debe repetirse en el PC del usuario.

## Uso en PowerShell

Desde la carpeta del proyecto, después de descargar el cambio:

```powershell
py --version
npm test
```

Para un Python 3 que no esté registrado en el lanzador `py`, se puede seleccionar su ruta explícitamente antes de ejecutar las pruebas:

```powershell
$env:CCNA_PYTHON = 'C:\ruta\a\Python313\python.exe'
npm test
```

No hace falta editar los alias del sistema, copiar ejecutables ni modificar las pruebas a mano. Las ejecuciones manuales de herramientas documentadas como `python3 tools/...` pueden hacerse en Windows con `py -3 -X utf8 tools/...`.

El ajuste no modifica preguntas, aprobaciones, base de datos ni dependencias del cliente. La actualización local de Vite 6.4.5 sigue siendo un cambio separado que debe guardarse después de revisar `git status`.

## Resultado de validación de esta entrega

**628 pruebas aprobadas en 15 archivos**, sin fallos, en Linux. El helper también supera comprobación TypeScript estricta. Las seis pruebas nuevas se suman a las 622 existentes; no se eliminan ni se omiten casos para resolver la incidencia. La ejecución real de Windows queda por confirmar con `npm test` en el PC del usuario. No se repiten pruebas del navegador porque solo cambia la invocación Python de la suite de servidor.
