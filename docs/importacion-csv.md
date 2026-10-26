# Importar preguntas desde CSV

En `/admin`, abre **Importar preguntas**, descarga **plantilla-preguntas.csv**, complétala en una hoja de cálculo y guárdala como **CSV UTF-8 separado por comas**. No se admite un archivo binario `.xlsx` ni CSV separado por punto y coma. Puedes seleccionar un archivo o pegar el contenido y escoger CSV en el selector de formato.

La plantilla solo contiene cabeceras: no añade preguntas de ejemplo al banco. El archivo admite hasta **2 MiB** y **1000 registros de preguntas**. Cada archivo conserva estructura CSV; las comas y saltos de línea dentro de una celda se entrecomillan, y una comilla interna se escribe doble. Excel/LibreOffice realizan este escape al exportar correctamente.

| Columna | Contenido |
|---|---|
| `statementEn`, `statementEs` | Enunciado en cada idioma; ambos obligatorios. |
| `questionType` | Tipo de la API, por ejemplo `single_choice`, `multiple_choice` o `true_false`. Se admiten los mismos 14 tipos del formulario. |
| `difficulty` | `basic`, `intermediate` o `advanced`; `mixed` corresponde a configuración de exámenes, no a una pregunta individual. |
| `primaryTopicExamArea` | `network_fundamentals`, `network_access`, `ip_connectivity`, `ip_services`, `security_fundamentals` o `automation_programmability`. |
| `explanationEn`, `explanationEs` | Explicación bilingüe obligatoria en CSV. |
| `correctAnswers` | Una letra, como `A`; para selección múltiple, letras distintas separadas por `|`, como `A|C`. La cantidad requerida se deriva de esta clave. |
| `optionAEn`, `optionAEs` … `optionFEn`, `optionFEs` | Entre dos y seis alternativas, cada una con ambos idiomas. Puedes dejar pares sin usar vacíos. Las letras de la clave deben referirse a opciones presentes. |
| `sourceUrl` | Referencia propuesta. Para aprobar será necesaria evidencia HTTPS revisada; una URL no acredita revisión técnica. |
| `sourceLicense`, `sourceName` | Autoría/licencia y nombre de fuente propuestos. Verificar condiciones antes de aprobar. |
| `questionFamilyId` | Familia conceptual opcional para evitar repeticiones equivalentes. |
| `estimatedTimeSeconds` | Opcional, entero de 10 a 600; es una estimación de dificultad temporal, no el límite por pregunta todavía pendiente. |

Las primeras ocho columnas de la plantilla son obligatorias; el resto puede reordenarse u omitirse si no se utiliza, siempre conservando al menos dos pares de opciones. No cambies los nombres de las cabeceras. Se rechazan cabeceras desconocidas o repetidas, cantidades de celdas inconsistentes, comillas sin cerrar, claves inválidas y alternativas sin traducción. Los errores indican el registro CSV; un registro puede ocupar más de una línea física si contiene saltos dentro de celdas.

Al pulsar **Procesar importación**, el cliente convierte el CSV al formato JSON existente. El servidor sigue comprobando permisos, esquema, duplicados y coherencia de respuestas. En un CSV mal formado no se envía ninguna importación. Una vez enviado un lote válido en estructura, el importador puede aceptar unas preguntas y rechazar o detectar como duplicadas otras; consulta los contadores y errores del resultado. No es una aprobación masiva ni una transacción de todo o nada para cada lote.

**Todo candidato importado queda pendiente de revisión** y fuera de los exámenes. La aprobación posterior exige revisión técnica, traducción y referencia según [administracion.md](administracion.md). La API sigue recibiendo JSON; el soporte CSV reside en el adaptador compartido `shared/questionCsv.ts`, sin una dependencia nueva.
