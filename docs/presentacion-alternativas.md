# Alternativas con datos en líneas separadas

Se mejora la presentación de las alternativas de examen, de la revisión final y del inspector del banco usando el mismo componente `OptionText`.

Los grupos explícitos de direcciones MAC/IP, por ejemplo `MAC origen: ..., MAC destino: ..., IP origen: ..., IP destino: ...`, se muestran como una lista de líneas precedidas por guiones. También se reconocen las etiquetas equivalentes en inglés y las listas ya escritas en varias líneas con guiones o viñetas. Las alternativas ordinarias y los bloques de comandos conservan sus saltos de línea. No se separa cualquier texto por sus comas: una explicación, JSON o comando no se convierte en lista por contener comas.

Se mantiene una sola etiqueta visual por alternativa en el examen, y se permite reducir el ancho del texto para envolverlo en pantallas pequeñas. La selección continúa usando los mismos IDs. Solo cambia el renderizado; no se modifican preguntas, respuestas correctas, snapshots, hashes de revisión ni bases de datos.

La regresión de navegador usa el contenido de `ccna-legacy-batch3_all-029-review-r1`, el caso mostrado por el usuario, en fixtures aisladas. Comprueba sus cuatro alternativas en español e inglés, cuatro líneas con guiones por alternativa, selección y confirmación, revisión final y una pantalla de 390 píxeles sin desplazamiento horizontal. También comprueba que prosa, CLI y JSON permanecen sin separar y que las listas explícitas se reconocen.

Los cambios se entregan en `main` mediante commit y publicación. Para verlos en el PC se descarga ese commit y se comprueba su identificador, según [el procedimiento de sincronización](sincronizacion-pc.md).

Compilación de servidor y cliente correcta con Vite 6.4.5 y **24 pruebas Chromium aprobadas**, incluidas las dos nuevas en español e inglés. La selección expone `aria-pressed` y conserva su letra visible. [Resultado de validación](validacion-presentacion-alternativas-20261105.json).
