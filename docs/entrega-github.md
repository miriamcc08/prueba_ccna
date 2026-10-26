# Entrega para GitHub

Esta entrega reúne el trabajo acumulado del simulador en la rama `codex/ccna-mejoras-validadas`, preparada sobre el commit `cef82bb` de `main`. Los informes anteriores describen el estado al terminar cada sesión; sus frases «sin commit ni push» corresponden a esos momentos, anteriores a esta entrega.

Incluye código, migraciones, pruebas, herramientas, documentación, 360 candidatos originales pendientes y correcciones/auditorías de candidatos heredados. No presenta el banco como 1000 preguntas aprobadas ni declara terminada la preparación de producción. El estado vigente está en [pendientes-cierre.md](pendientes-cierre.md).

Se excluyeron archivos de entorno reales, bases SQLite locales, dependencias y cachés de Python. Los archivos sensibles/dependencias que ya estaban versionados en el repositorio heredado no se modifican ni eliminan en esta entrega; su limpieza sigue pendiente. La configuración de ejemplo `server/.env.example` no contiene credenciales reales.

Se añadieron `__pycache__/` y `*.py[cod]` a `.gitignore`, y se normalizó únicamente el salto final de ocho informes Markdown y del generador de informes para superar la revisión de espacios de Git.

Antes del commit se repitieron y aprobaron compilación de cliente/servidor, **592 pruebas de servidor y 21 de Chromium** en la copia aislada. Registros de ejecución: `/tmp/ccna-publicacion-build.log`, `/tmp/ccna-publicacion-tests.log` y `/tmp/ccna-publicacion-browser.log`. La revisión del contenido preparado comprueba que no incluye rutas sensibles ni artefactos generados y no detecta patrones conocidos de claves privadas o tokens. Ese cribado no sustituye una auditoría de seguridad completa.

Publicar una rama no modifica `main`. Una vez subida, se puede abrir en GitHub y proponer su integración mediante una solicitud de cambios. El resultado concreto de publicación y el identificador del commit se comunican al usuario tras comprobar el remoto.
