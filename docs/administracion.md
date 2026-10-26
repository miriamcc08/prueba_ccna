# Administración del simulador

El perfil **admin** existe. Inicia sesión con esa cuenta y entra en **Administración** (`/admin`). El registro público siempre crea usuarios normales; añadir `role: admin` a una petición no otorga privilegios. El servidor consulta el rol actual en la base en cada petición autenticada, por lo que retirar el rol invalida inmediatamente el acceso administrativo del token existente.

## Crear la primera cuenta

No hay una contraseña administrativa predeterminada. Configura `ADMIN_EMAIL` y `ADMIN_PASSWORD` mediante las variables seguras del entorno. La contraseña necesita al menos 12 caracteres y como máximo 72 bytes UTF-8. No guardes sus valores en Git ni los incluyas en comandos compartidos.

Después de preparar el entorno, ejecuta:

```bash
cd /workspace/.ccna-runtime/server
export DATABASE_URL=file:/workspace/.ccna-runtime/server/prisma/cloud.db
npm run admin:bootstrap
```

El comando utiliza las dos variables anteriores, crea una cuenta nueva con rol `admin` y solo informa el resultado. También las reconoce el seed, pero no necesitas volver a cargar ejemplos para crear un administrador. Sin ambas variables, el comando falla explícitamente; el seed omite la creación cuando ambas faltan.

Si ya existe un administrador con ese correo, conserva su contraseña. Si el correo pertenece a un usuario normal, rechaza el cambio: utiliza un correo separado para administración. No se ha creado una cuenta real ni inventado credenciales durante esta auditoría; las cuentas de pruebas se crean en bases temporales que se eliminan al finalizar.

## Crear y revisar contenido

1. En Administración, pulsa **Crear pregunta**. Elige tema, tipo y dificultad.
2. Escribe enunciados, explicaciones y alternativas en inglés y español. Marca la respuesta correcta; en selección múltiple marca al menos dos e indica en ambos enunciados cuántas se deben elegir.
3. Añade referencia técnica HTTPS y autoría o licencia. La familia es opcional, pero conviene agrupar ejercicios conceptualmente equivalentes.
4. Pulsa **Guardar pendiente de revisión**. Crear no equivale a aprobar: el motor excluye las preguntas pendientes.
5. En el listado, usa búsqueda, estado y páginas de 50 registros. Abre la revisión con el botón de validación de la fila.
6. **Ejecutar comprobaciones** revisa estructura y los cálculos compatibles; no verifica por sí solo toda la exactitud técnica, el contenido de enlaces ni los derechos de uso.
7. Contrasta la respuesta, distractores, traducción, vigencia y licencia. Para aprobar, añade notas de al menos 20 caracteres, referencia HTTPS y confirma la revisión técnica. La decisión registra autor y fecha.

La edición permite crear una **nueva revisión** de los enunciados, explicaciones, referencia, alternativas y clave. Se conserva el contenido anterior y ambos registros vuelven o permanecen pendientes. Los intentos nuevos guardan una captura del contenido; corregir el banco no cambia las preguntas ya presentadas en esos intentos. No puede recuperarse una captura que no existía en intentos antiguos.

## Importación y límites actuales

La pestaña de importación admite CSV UTF-8 con plantilla descargable y JSON: un arreglo de preguntas o un objeto con propiedad `questions`. El esquema está en `server/src/validators/schemas.ts` y hay ejemplos en `server/prisma/questions/`. Importar conserva el estado pendiente y detecta duplicados exactos; la revisión semántica sigue siendo humana. Las altas manuales también rechazan enunciados idénticos normalizados en cualquiera de los dos idiomas; para corregir contenido existente utiliza revisiones.

**El administrador puede redactar e importar preguntas por JSON o CSV; no existe un generador de preguntas con IA conectado.** Consulta el [formato CSV](importacion-csv.md). El diagnóstico del estudiante usa reglas del historial. No se añadieron preguntas al banco en esta auditoría.

## Configuración del servicio

En producción son obligatorios `JWT_SECRET` y `CORS_ORIGIN`, con orígenes exactos separados por comas; no se admite `*`. En desarrollo se permiten además orígenes locales HTTP/HTTPS. CORS es una restricción del navegador, no sustituye autenticación ni autorización. Revisa los pendientes de despliegue, restauración y límites de peticiones en [la auditoría funcional](auditoria-funcional-20261026.md).
