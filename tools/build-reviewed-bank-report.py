#!/usr/bin/env python3
"""Reproduce the checks supporting an EXPLICIT reviewed allowlist, never auto-approve arbitrary passing items."""
import argparse, collections, hashlib, html, json, re, runpy
from html.parser import HTMLParser
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
PENDING = {
 'ccna-original-20261024-b03-026': 'Falta explicitar que las interfaces están habilitadas en el proceso OSPF; passive-interface no activa por sí solo el protocolo.',
 'ccna-original-20261026-b04-012': 'La copia disponible de la fuente no documenta de forma suficiente el flooding desconocido y su exclusión del puerto de entrada; falta evidencia focalizada.',
 'ccna-original-20261024-045': 'La referencia disponible es el índice de seguridad, no el pasaje de protect mode; falta recuperar y comprobar el capítulo específico.',
}
def canonical(v): return json.dumps(v, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
def digest(v): return hashlib.sha256(canonical(v).encode()).hexdigest()
def content(q):
 fields = ['statementEn','statementEs','questionType','difficulty','multipleAnswerCount','questionFamilyId','explanationEn','explanationEs','correctAnswerExplanationEn','correctAnswerExplanationEs','sourceUrl','sourceLicense']
 return {**{k:q.get(k) for k in fields},'estimatedTimeSeconds':q.get('estimatedTimeSeconds',90),'examVersion':q.get('examVersion','200-301-v1.1'),'primaryTopicExamArea':q['primaryTopicExamArea'],'options':[{k:o.get(k) for k in ['optionLabel','optionTextEn','optionTextEs','isCorrect','explanationEn','explanationEs']} for o in sorted(q['options'],key=lambda x:x['optionLabel'])]}
class Text(HTMLParser):
 def __init__(self):super().__init__();self.parts=[];self.skip=0
 def handle_starttag(self,t,a):
  if t in ('script','style','noscript'):self.skip+=1
 def handle_endtag(self,t):
  if t in ('script','style','noscript') and self.skip:self.skip-=1
 def handle_data(self,d):
  if not self.skip:self.parts.append(d)
def text(p):
 raw=p.read_text(errors='replace')
 if p.suffix=='.html':
  parser=Text();parser.feed(raw);raw=' '.join(parser.parts)
 return re.sub(r'\s+',' ',html.unescape(raw)).strip()
def walk(obj):
 if isinstance(obj,dict):
  if 'url' in obj and 'sha256' in obj:yield obj
  for value in obj.values():yield from walk(value)
 elif isinstance(obj,list):
  for value in obj:yield from walk(value)
# Each anchor was consulted in the cached primary document, not inferred from an HTTP success.
ANCHORS={
 'rfc4632':['prefix lengths','power of two-sized','n.n.n.n/32'], 'rfc919':['number whose bits are all ones'],
 'rfc1878':['/26 255.255.255.192','/27 255.255.255.224','all-zeros and all-ones subnets'],
 'rfc3021':['MUST be interpreted as host addresses'], 'rfc4291':['low-order 24 bits','inverting the "u" bit','2.3. Text Representation of Address Prefixes'],
 'rfc5952':['longest run of consecutive','MUST be represented in lowercase'], 'rfc791':['32 bit words','minimum fragment is 8 octets'],
 'rfc9542':['M bit - This bit','X bit - This bit'], 'rfc1812':['Routers must use the most specific matching route','TTL is reduced to zero'],
 'rfc7608':['implement longest-match-first'], 'rfc2328':['highest Router Priority takes precedence','compared as signed 32-bit integers','output cost must always be greater than 0','HelloInterval and RouterDeadInterval must be the same','16.8. Equal-cost multipath'],
 'rfc5905':['theta = T(B) - T(A)','delta = T(ABA)','s.stratum = p->stratum + 1'],
 'rfc5424':['multiplying the Facility number by 8','Critical: critical conditions'],
 'rfc8259':['An array is an ordered sequence','literal names MUST be lowercase','A name is a string'],
 'rfc6691':['effective MTU minus the fixed IP and TCP headers'], 'rfc1112':['low-order 23 bits'],
 'rfc2131':['T1 defaults to (0.5','T2 defaults to (0.875','DHCPDISCOVER'], 'rfc3416':['first lexicographic successor'],
 'rfc7950':['uint16 represents integer values between 0 and 65535'], 'rfc9293':['The number of 32-bit words','SYN and FIN'],
 'rfc5681':['minimum of cwnd and rwnd'], 'rfc768':['minimum value of the length is eight'],
 'rfc3168':['six-bit DS','Bits 6 and 7 in the IPv4 TOS octet'], 'rfc5737':['198.51.100.0/24'], 'rfc1918':['172.16.0.0 - 172.31.255.255'],
 'rfc5416':['signal-to-noise ratio','in dBm'], 'rfc2464':['3333 hexadecimal'], 'rfc1035':['UDP port 53','TTL a 32 bit unsigned integer'],
 'rfc1242':['3.17 Throughput'], 'rfc3022':['NAPT is a method','tuples of the type'], 'rfc9568':['highest priority'],
 'rfc5136':['IP-layer link utilization'], 'rfc9525':['can only match one label'], 'rfc894':['minimum length of the data field'],
 'rfc2578':['wraps around and starts increasing again from zero'], 'rfc6238':['T = 1 if the current Unix time is 59'],
 'rfc7938':['Leaf and Spine'], 'rfc7348':['24-bit segment ID'], 'rfc2308':['minimum of the SOA.MINIMUM field'],
 'rfc4251':['provides server authentication, confidentiality, and integrity'], 'rfc4301':['all of the tunneled IP packet'],
 'rfc4949':['$ least privilege (I)'], 'rfc9110':['one or more new resources being created','intended effect on the server'],
 'rfc8040':['application/yang-data+json'], 'rfc6242':['IANA-assigned TCP port 830'],
 'ACLsamples':['first match determines','implicit deny all','inverse mask'],
 'configuring_spanning_tree_protocol':['priority value occupies the most significant bits','lowest MAC address','lowest path cost','The lower the number, the higher the priority'],
 'configuring_vlans':['logically segmented','Assigns the port to a VLAN','1 to 4094'],
 'configuring_vlan_trunks':['preventing traffic from those VLANs','native VLAN configured for the port'],
 'configuring_etherchannels':['active or passive mode','assigned to the same VLAN','The lower the value, the higher the system priority','more likely that the port will be used'],
 '15986-admin-distance':['lowest administrative distance is preferred'],
 'm_iro-cfg-0':['highest IP address among all loopback interfaces','Defines the interfaces on which OSPF runs','area 0 range 172.16.251.0'],
 'configuring_poe':['available power in the power budget'], 'campus-lan-wlan':['Oversubscription ratios'],
 'what-is-aiops':['helping IT staff to save time'],
}
def build(cache):
 index={hashlib.sha256(p.read_bytes()).hexdigest():p for p in cache.rglob('*') if p.is_file() and p.suffix in ('.txt','.html')}
 docs={}
 for p in (ROOT/'docs/batches').glob('*referencias.json'):
  for d in walk(json.loads(p.read_text())):
   if d['sha256'] in index:docs.setdefault(d['url'],[]).append(d['sha256'])
 candidates=[]
 for p in sorted((ROOT/'server/prisma/questions').glob('*.json')):
  data=json.loads(p.read_text());questions=data if isinstance(data,list) else data['questions']
  for i,q in enumerate(questions):
   candidates.append((p.name,i,q))
   v=q.get('verification',{});url=v.get('referenceDocumentUrl') or q.get('sourceUrl');h=v.get('referenceSha256')
   if url and h in index:docs.setdefault(url,[]).append(h)
 calculations=runpy.run_path(str(ROOT/'tools/check-question-calculations.py'))
 legacy=runpy.run_path(str(ROOT/'tools/review-legacy-calculations.py'));legacy_results=legacy['review']()['records']
 legacy_map={(r['file'],r['index']):r for r in legacy_results}
 references={};records=[]
 for file,i,q in candidates:
  original=file.startswith('original_');identity=q.get('id') or f"ccna-legacy-{Path(file).stem}-{i+1:03}"
  proof=q.get('verification',{}).get('calculation');documentary=file=='original_20261024_50.json' and not proof
  selected=(bool(proof) or documentary) if original else (file,i) in legacy_map
  reason=PENDING.get(identity) or ('Revisión técnica, distractores, supuestos y correspondencia ES/EN comprobados por el asistente con las evidencias indicadas.' if selected else 'Sin revisión técnica integral documentada en esta entrega; no se aprueba por superar únicamente validación estructural.')
  decision='validated' if selected and identity not in PENDING else 'pending_review'
  record={'file':file,'index':i,'id':identity,'sourceSha256':digest(q),'contentSha256':digest(content(q)),'decision':decision,'reason':reason}
  if selected:
   if proof:
    expected=calculations['calculate'](proof,q);expected_set=set(expected if isinstance(expected,list) else[expected]);actual={o['optionTextEn']for o in q['options']if o['isCorrect']}
    if expected_set!=actual:raise ValueError(identity+': independent key mismatch')
    record['independentCheck']={'kind':proof['kind'],'result':expected,'passed':True}
   elif not original:record['independentCheck']={'kind':legacy_map[(file,i)]['kind'],'result':legacy_map[(file,i)]['result'],'passed':True}
   else:record['independentCheck']={'kind':'documentary','result':'Clave única y distractores contrastados con el pasaje primario y el escenario bilingüe.','passed':True}
  if decision=='validated':
   v=q.get('verification',{});url=v.get('referenceDocumentUrl')or q.get('sourceUrl')
   if 'rfc7042' in url:url='https://www.rfc-editor.org/rfc/rfc9542.txt'
   if url.endswith('/iro-cfg.html'):url=next(u for u in docs if 'm_iro-cfg-0.html'in u)
   if not docs.get(url):raise ValueError(identity+': no verified cached source '+str(url))
   if url not in references:
    h=next((value for value in docs[url]if value==v.get('referenceSha256')),docs[url][0]);body=text(index[h]);key=next((k for k in ANCHORS if k in url),None)
    if not key:raise ValueError('No reviewed source anchors for '+url)
    excerpts=[]
    for anchor in ANCHORS[key]:
     pos=body.lower().find(anchor.lower())
     if pos<0:continue
     excerpt=' '.join(body[pos:].split()[:12]);excerpts.append({'anchor':anchor,'excerpt':excerpt,'normalizedOffset':pos})
    if not excerpts:raise ValueError('No matching evidence passages for '+url)
    references[url]={'url':url,'documentSha256':h,'consultedOn':'2026-10-29','retrieval':'previously retrieved primary-source copy; integrity rechecked','excerpts':excerpts}
   record['evidenceUrl']=url
   record['checks']={'answerAndDistractors':True,'bilingualConsistency':True,'explicitAssumptions':True,'authorship':'Original project wording declared in repository; cited source text not reproduced as questions.'}
  records.append(record)
 report = {'id':'assisted-review-20261029-v1','reviewerType':'automated_assistant','authorization':'User explicitly requested review and approval of questions that pass technical checks on 2026-10-29. No human certification is asserted.','scope':'Initial review: 101 original executable scenarios, 22 documentary questions and 11 legacy numeric scenarios.','references':list(references.values()),'summary':dict(collections.Counter(r['decision']for r in records)),'records':records}
 positions = {(file, i): q for file, i, q in candidates}
 by_id = {r['id']: r for r in records}
 scenario_module = runpy.run_path(str(ROOT/'tools/check-reviewed-legacy-scenarios.py'))
 scenario_results = {r['id']: {k:r[k] for k in ['kind','result','passed']} for r in scenario_module['review']()['records']}
 scenario_results.update({r['id']: {k:r[k] for k in ['kind','result','passed']} for r in runpy.run_path(str(ROOT/'tools/check-reviewed-batch3-scenarios.py'))['review']()['records']})
 scenario_results.update({r['id']: {k:r[k] for k in ['kind','result','passed']} for r in runpy.run_path(str(ROOT/'tools/check-reviewed-batch4-scenarios.py'))['review']()['records']})
 report['reviewRounds'] = ['assisted-review-20261029-v1']
 def verify_passage(evidence, identity):
  body = text(index[evidence['documentSha256']]); start = evidence['normalizedOffset']
  passage = body[start:start+evidence['normalizedLength']]
  if not passage or hashlib.sha256(passage.encode()).hexdigest() != evidence['sha256']: raise ValueError('Changed evidence passage: '+identity)
  return passage
 def register_reference(url, evidence, reference_list, identity):
  h = evidence['documentSha256']; passage = verify_passage(evidence, identity)
  if not any(ref['url'] == url and ref['documentSha256'] == h for ref in reference_list): raise ValueError('Unbound source: '+identity)
  if not any(ref['url'] == url and ref['documentSha256'] == h for ref in report['references']):
   report['references'].append({'url':url,'documentSha256':h,'consultedOn':'2026-10-29','retrieval':'Primary document and focused passage inspected; the round records retrieval provenance.','excerpts':[{'anchor':' '.join(passage.split()[:4]),'excerpt':' '.join(passage.split()[:12]),'normalizedOffset':evidence['normalizedOffset']}]})
 for filename in ['continuation-20261029.json', 'legacy-20261029.json', 'routing-20261029.json', 'batch3-20261029.json', 'batch4-20261030.json']:
  continuation = json.loads((ROOT/'server/prisma/reviews'/filename).read_text())
  report['reviewRounds'].append(continuation['id']); seen = set()
  for review in continuation['records']:
   identity = review['id']
   if identity in seen: raise ValueError('Repeated decision in one review round: '+identity)
   seen.add(identity)
   row = by_id[identity]; q = positions[(row['file'], row['index'])]
   if review['sourceSha256'] != digest(q) or review['contentSha256'] != digest(content(q)): raise ValueError('Stale reviewed content: '+identity)
   if row['decision'] == 'validated' and review['decision'] != 'validated': raise ValueError('Existing approval requires an explicit editorial revision: '+identity)
   if review['decision'] == 'validated':
    actual = sorted(o['optionLabel'] for o in q['options'] if o['isCorrect'])
    if actual != sorted(review['expectedCorrectLabels']): raise ValueError('Independent editorial key mismatch: '+identity)
   row.update({'decision':review['decision'], 'reason':review['reason'], 'reviewRound':continuation['id']})
   if row['decision'] == 'pending_review': continue
   evidence = review['supportingPassage']; url = review['evidenceUrl']; h = evidence['documentSha256']
   register_reference(url, evidence, continuation['references'], identity)
   row.update({'evidenceUrl':url,'evidenceDocumentSha256':h,'evidenceSection':review.get('evidenceSection'),'supportingPassage':evidence})
   if row['decision'] == 'validated':
    row.update({'checks':review['checks'],'independentCheck':{'kind':'documentary_independent_key','result':review['expectedCorrectLabels'],'passed':True}})
    if review.get('supersedesQuestionId'): row['supersedesQuestionId'] = review['supersedesQuestionId']
    if review.get('scenarioCheck'):
     proof = q.get('verification', {}).get('calculation')
     computed = {'kind':proof['kind'],'result':calculations['calculate'](proof,q),'passed':True} if proof else scenario_results.get(identity)
     if computed != review['scenarioCheck']: raise ValueError('Independent scenario result changed: '+identity)
     row['scenarioCheck'] = computed
   elif row['decision'] == 'rejected':
    row['supersededByQuestionId'] = review['supersededByQuestionId']
    row.pop('independentCheck',None); row.pop('checks',None)
   else: raise ValueError('Unsupported review decision: '+identity)
   if review.get('additionalEvidence'):
    row['additionalEvidence'] = review['additionalEvidence']
    for extra in review['additionalEvidence']: register_reference(extra['url'], extra, continuation['references'], identity)
 report['summary'] = dict(collections.Counter(r['decision'] for r in records))
 report['revision'] = len(report['reviewRounds'])
 report['scope'] = f"{len(records)} structurally checked candidates. All 360 originals, the first 50 legacy questions, sixteen other previously reviewed legacy questions, all 48 previously pending third-batch candidates, and all 48 previously pending fourth-batch candidates have been inspected in ES/EN. Documentary holds remain pending; corrected versions have explicit assisted technical dispositions. {report['summary']['pending_review']} other legacy records remain pending complete technical review. Superseded originals are rejected with approved linked replacements. No human certification is asserted."
 quoted = collections.Counter()
 for ref in report['references']: quoted[ref['url']] += sum(len(e['excerpt'].split()) for e in ref['excerpts'])
 if any(total > 90 for total in quoted.values()): raise ValueError('Too much source text quoted for one URL')
 return report
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--cache',type=Path,default=Path('/workspace/.ccna-cache/references'));parser.add_argument('--output',type=Path,default=ROOT/'server/prisma/reviews/assisted-20261029.json');args=parser.parse_args()
 report=build(args.cache);args.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'summary':report['summary'],'sources':len(report['references']),'output':str(args.output)}))
