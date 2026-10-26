#!/usr/bin/env python3
"""Render an editorial review copy of the batch; JSON remains the source of truth."""
import argparse
import collections
import json
from pathlib import Path

parser=argparse.ArgumentParser()
parser.add_argument('batch')
parser.add_argument('output')
args=parser.parse_args()
data=json.loads(Path(args.batch).read_text())
qs=data['questions']
counts=collections.Counter(q['primaryTopicExamArea'] for q in qs)
focused=sum(q.get('verification',{}).get('referenceAccess')=='consulted' for q in qs)
lines=[f"# Lote original: {data['batchId']}", '',
       'Estado: **pendiente de revisión técnica y de traducción**. El estado de consulta y la evidencia de cada referencia figuran en el JSON. Las comprobaciones ejecutables de cálculo/escenario y la consulta documental no constituyen aprobación editorial completa.', '',
       'Los ejercicios relacionados comparten familia y no se cuentan como conceptos independientes. La equivalencia semántica con todo el banco sigue en revisión. El texto se creó para el proyecto.', '',
       f'Consultas focalizadas registradas: **{focused}/{len(qs)}**. Esta cifra no representa aprobaciones humanas.', '',
       '| Área | Preguntas |','|---|---:|']
lines.extend(f'| {area} | {count} |' for area,count in counts.items())
lines.extend(['', 'El reparto de 50 requiere redondear los medios puntos de IP Connectivity y Security Fundamentals; no se afirma aquí haber confirmado la versión vigente del temario.' if len(qs)==50 else f'Lote focalizado de {len(qs)} preguntas para prioridades de revisión; su distribución no representa los pesos oficiales del examen.', ''])
def option_text(value):
 return f'`{value}`' if value.startswith('<') else value
for index,q in enumerate(qs,1):
 correct=[o for o in q['options'] if o['isCorrect']]
 lines.extend([f"## {index}. {q['concept']}",'',f"ID: `{q['id']}` · Área: `{q['primaryTopicExamArea']}` · Dificultad: `{q['difficulty']}`",'',q['statementEs'],''])
 lines.extend(f"- **{o['optionLabel']}.** {option_text(o['optionTextEs'])}" for o in q['options'])
 lines.extend(['',f"**Respuesta(s) propuesta(s): {', '.join(o['optionLabel'] for o in correct)}.** {q['explanationEs']}",'','**English**', '',q['statementEn'],''])
 lines.extend(f"- **{o['optionLabel']}.** {option_text(o['optionTextEn'])}" for o in q['options'])
 lines.extend(['',q['explanationEn'],'',f"Referencia: {q['sourceUrl']} · {q['sourceSection']} · Consulta: {q['verification']['referenceAccess']}", '', 'Comprobación independiente: '+('cálculo/escenario ejecutable en el reporte.' if 'calculation' in q['verification'] else 'requiere revisión documental; no se declara verificada automáticamente.'), ''])
 if q['verification'].get('referenceDocumentUrl') and q['verification']['referenceDocumentUrl']!=q['sourceUrl']:
  lines.extend(['Documento consultado: '+q['verification']['referenceDocumentUrl'], ''])
 for reference in q['verification'].get('supportingReferences', []):
  url=reference if isinstance(reference,str) else reference['url']
  section='' if isinstance(reference,str) else reference.get('section','')
  lines.extend([f'Referencia complementaria: {url} · {section}', ''])
 if q['verification'].get('referenceCurrencyNotes'):
  lines.extend(['Actualización de referencia: '+q['verification']['referenceCurrencyNotes'], ''])
Path(args.output).write_text('\n'.join(lines)+'\n')
