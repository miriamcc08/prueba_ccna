# Usuarios, admin y superadmin — 09/11/2026

## Comportamiento entregado

El panel incorpora **Usuarios y roles**, con búsqueda, paginación de 25 cuentas, creación, edición, cambio de contraseña, eliminación reversible y restauración. Los errores se muestran y la confirmación de eliminación puede cancelarse. Las operaciones requieren motivo de al menos 20 caracteres y se registran transaccionalmente junto con actor, cuenta afectada, fecha y datos anteriores/posteriores. Los hashes y contraseñas no aparecen en respuestas ni en la auditoría. Superadmin puede consultar los últimos 100 eventos por cuenta.

| Función | user | admin | superadmin |
|---|---|---|---|
| Estudiar y gestionar su historial | Sí | Sí | Sí |
| Crear, editar, importar, revisar, retirar/restaurar preguntas | No | Sí | Sí |
| Consultar listado de cuentas | No | Sí | Sí |
| Crear, editar, desactivar/restaurar usuarios normales | No | Sí | Sí |
| Gestionar administradores y otros superadmin | No | No | Sí |
| Otorgar o retirar roles administrativos | No | No | Sí |
| Consultar auditoría de cuentas | No | No | Sí |

El registro público siempre crea `user`, aunque se envíe un rol diferente. `review_service` continúa siendo un actor técnico sin login y queda fuera de la gestión interactiva.

**Eliminar usuario** desactiva la cuenta sin borrar exámenes, favoritos ni revisiones. Bloquea login y sesiones existentes. Restaurar devuelve a `user`; no recupera privilegios anteriores y los tokens anteriores siguen invalidados. Los cambios de perfil, contraseña o rol también invalidan sesiones anteriores: la cuenta debe iniciar sesión otra vez. Si un superadmin edita su propio perfil, deberá volver a iniciar sesión. Ningún administrador puede modificar sus propios privilegios o desactivarse mediante este panel. La última cuenta superadmin activa está protegida. Las comprobaciones se realizan en el servidor con el rol vigente; ocultar controles no es la protección de seguridad.

Las contraseñas creadas/cambiadas desde el panel necesitan al menos 12 caracteres y como máximo 72 bytes UTF-8; se almacenan como hash bcrypt. En edición, dejar vacío conserva el hash. No existe todavía correo de invitación o recuperación de contraseña.

## Actualizar el PC

Con el servidor detenido, en la raíz del proyecto:

```powershell
git pull --ff-only
Copy-Item .\server\prisma\dev.db ".\server\prisma\dev-respaldo-$(Get-Date -Format 'yyyyMMdd-HHmmss').db"
npm --prefix server run db:generate
Set-Location .\server
npx prisma migrate deploy
Set-Location ..
npm run build
npm test
```

La migración `20261109190000_user_management` añade `User.deletedAt`, `User.authVersion` y `UserAccountAudit`; conserva cuentas, roles, contraseñas e historial anteriores. No ejecutar `db:reset`. Si se usa SQLite en modo WAL, debe hacerse una copia consistente que incluya los datos del WAL; las validaciones de esta entrega usan la API de backup de SQLite sobre una copia aislada.

## Convertir tu administrador existente en el primer superadmin

Este paso se ejecuta **en tu PC**, después de migrar, usando el correo y contraseña de la cuenta admin que ya creaste. No crea otra cuenta ni cambia su contraseña. Comprueba la contraseña actual y solo permite inicializar al primer superadmin; si ya existe otro, los nuevos roles se conceden desde el panel.

Desde la raíz:

```powershell
Set-Location .\server
$env:SUPERADMIN_EMAIL = Read-Host "Correo de tu administrador actual"
$ownerSecret = Read-Host "Contraseña actual del administrador" -AsSecureString
$ownerPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($ownerSecret)
try {
    $env:SUPERADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ownerPointer)
    npm run superadmin:bootstrap
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ownerPointer)
    $ownerSecret.Dispose()
    Remove-Item Env:SUPERADMIN_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:SUPERADMIN_EMAIL -ErrorAction SilentlyContinue
}
Set-Location ..
npm run dev
```

Cierra la sesión anterior e inicia sesión de nuevo: **Panel Admin → Usuarios y roles**. Comprueba también una cuenta normal. No compartas contraseñas en el chat ni las guardes en Git. La promoción se audita e invalida la sesión anterior.

## Sincronización y límites

Git sincroniza el código y las migraciones. La cuenta superadmin se configura localmente: esta entrega no promueve automáticamente a todos los administradores ni replica datos personales entre PC y GitHub. En esta sesión solo se han utilizado cuentas de prueba en bases temporales.

Se mantiene la pausa de creación de preguntas y la lista de pendientes del alcance original en [pendientes-cierre.md](pendientes-cierre.md). Esta entrega amplía las cuentas; no completa recuperación por correo, controles de producción o las 41 preguntas pendientes.

## Pruebas de la entrega

Compilación de servidor y cliente correcta; permanece el aviso conocido de tamaño del JavaScript. Suite general: 15 archivos y 644 pruebas aprobadas. Tras añadir compatibilidad con el nombre de usuario de correo del admin existente, se ejecutaron 8 pruebas dirigidas de usuarios/roles, todas correctas: 7 ya estaban en la suite y una regresión es adicional (645 pruebas en el código final). Chromium: los 26 escenarios completos aprobados. Se verificaron permisos, alta/edición, hashing, roles, sesiones revocadas, contraseña, cancelación, desactivación/restauración y auditoría; la promoción local exige contraseña y no permite inicializar otro propietario cuando ya existe uno.

Migración probada sobre una copia consistente con 977 preguntas, cuatro exámenes y 928 revisiones: todas las columnas anteriores conservaron sus valores; integridad y claves foráneas correctas. [Registro de evidencia y hashes](validacion-usuarios-roles-20261109.json). Estos resultados no equivalen a certificar todos los escenarios de producción.
