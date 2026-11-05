# Mantener GitHub y el PC sincronizados

La rama de trabajo oficial es `main`. Cada entrega debe incluir sus cambios guardados en archivos, validación apropiada, documentación, commit y publicación en GitHub. El resultado se identifica por el hash del commit.

La copia del PC se actualiza mediante Git. Desde una ventana PowerShell dentro del proyecto:

```powershell
git pull --ff-only
git log -1 --oneline
```

El hash mostrado debe coincidir con el commit comunicado al publicar la entrega. Desde este entorno no se puede escribir directamente en la carpeta de tu PC; hace falta descargar el commit allí para que ambos tengan la misma versión. Si ejecutas otra copia del proyecto, como la de AppData, también deberá actualizarse su código antes de usarla.

Para comprobar cambios locales de archivos versionados, excluyendo dependencias instaladas, base de datos, configuración local y cachés:

```powershell
git diff --name-only HEAD -- . ':!**/node_modules/**' ':!**/*.db' ':!**/*.db-*' ':!**/*.tsbuildinfo' ':!**/.env'
```

Una salida vacía confirma que los archivos versionados incluidos en esa comparación coinciden con el commit local. No compara archivos sin seguimiento ni acredita que la base local sea una réplica de otra máquina. `git status --short` permite revisar también archivos nuevos; nunca hay que añadir todo a ciegas con `git add .`.

La base de datos, `.env`, dependencias y cachés permanecen locales. El repositorio heredado todavía contiene dependencias y la base inicial versionadas, por eso Git puede seguir mostrando cambios dentro de `node_modules` o en `server/prisma/dev.db`; no se deben incluir en los commits de código. Su limpieza general sigue siendo un pendiente separado.

Si Git bloquea la actualización por cambios locales o divergencia, se revisa el mensaje antes de continuar. Se conservan los cambios y no se utiliza un reset o push forzado para ocultar el conflicto. Los cambios legítimos hechos en el PC se revisan y publican con commit, igual que se hizo con Vite 6.4.5.
