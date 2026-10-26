#!/usr/bin/env python3
"""Review selected legacy arithmetic against Python's standard IP implementation."""
import argparse
import collections
import ipaddress as ip
import json
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]/'server/prisma/questions'


def expected_case(kind, inputs):
    if kind=='bounds':
        n=ip.ip_network(inputs['network'],strict=False)
        return (str(n.network_address),str(n.broadcast_address))
    if kind=='capacity':
        prefix=32-(inputs['hosts']+1).bit_length()
        parent=ip.ip_network(inputs['parent'])
        child=next(parent.subnets(new_prefix=prefix))
        if 2**(prefix-parent.prefixlen)<inputs.get('subnets',1):raise ValueError('Insufficient subnet count')
        return (str(child.netmask),prefix,str(child.network_address+1),str(child.broadcast_address-1))
    if kind in ['summary','summary_command']:
        summary=list(ip.collapse_addresses([ip.ip_network(n) for n in inputs['networks']]))
        if len(summary)!=1:raise ValueError('Cannot summarize exactly')
        return summary[0]
    if kind=='vlsm':
        parent=ip.ip_network(inputs['parent']);cursor=int(parent.network_address)
        for hosts in inputs['requirements']:
            prefix=32-(hosts+1).bit_length();block=2**(32-prefix)
            cursor=(cursor+block-1)//block*block
            subnet=ip.ip_network((cursor,prefix))
            if not subnet.subnet_of(parent):raise ValueError('VLSM allocation exceeds parent')
            if hosts==inputs['target']:return subnet
            cursor+=block
    if kind=='ipv6':return ip.IPv6Address(inputs['address']).compressed
    if kind=='mask':
        mask=ip.ip_network(f"0.0.0.0/{inputs['prefix']}").netmask
        return str(mask),f'{int(str(mask).split(".")[-1]):08b}'
    raise ValueError('Unknown case')


def matches(kind, expected, text, inputs):
    if kind=='bounds':return tuple(re.findall(r'\b(?:\d{1,3}\.){3}\d{1,3}\b',text))==expected
    if kind=='capacity':
        addresses=re.findall(r'\b(?:\d{1,3}\.){3}\d{1,3}\b',text)
        prefix=re.search(r'/(\d+)',text)
        return bool(prefix and len(addresses)==3 and (addresses[0],int(prefix[1]),addresses[1],addresses[2])==expected)
    if kind in ['summary','vlsm']:
        match=re.search(r'((?:\d{1,3}\.){3}\d{1,3})(?:/(\d+)|\s+((?:\d{1,3}\.){3}\d{1,3}))',text)
        if not match:return False
        try:return ip.ip_network(match[1]+'/'+(match[2] or match[3]),strict=True)==expected
        except ValueError:return False
    if kind=='summary_command':return text.strip()==f"area {inputs['area']} range {expected.network_address} {expected.netmask}"
    if kind=='ipv6':return text.strip()==expected
    if kind=='mask':return all(value in text for value in expected)
    return False


CASES=[
 ('batch1_network_fundamentals.json',6,'bounds',{'network':'172.16.45.138/27'}),
 ('batch2_network_fundamentals.json',6,'capacity',{'parent':'192.168.10.0/24','hosts':58}),
 ('batch3_all.json',6,'capacity',{'parent':'192.168.50.0/24','hosts':28,'subnets':6}),
 ('batch3_all.json',8,'summary',{'networks':[f'198.51.{n}.0/24' for n in range(100,104)]}),
 ('batch4_all.json',6,'summary',{'networks':[f'192.168.{n}.0/24' for n in range(16,20)]}),
 ('batch4_all.json',7,'vlsm',{'parent':'172.16.8.0/21','requirements':[500,220,100,55],'target':100}),
 ('batch5_all.json',3,'vlsm',{'parent':'172.20.0.0/22','requirements':[480,220,110,55],'target':220}),
 ('batch5_all.json',4,'ipv6',{'address':'2001:0db8:0000:0000:0008:0800:200c:417a'}),
 ('batch5_all.json',29,'summary_command',{'networks':[f'10.4.{n}.0/24' for n in range(16,20)],'area':1}),
 ('batch6_all.json',0,'mask',{'prefix':27}),
 ('batch6_all.json',1,'summary',{'networks':[f'172.16.{n}.0/24' for n in range(16,20)]}),
]


def review(root=ROOT):
    records=[]
    for file,index,kind,inputs in CASES:
        q=json.loads((root/file).read_text())['questions'][index]
        result=expected_case(kind,inputs)
        candidates=[o for o in q['options'] if matches(kind,result,o['optionTextEn'],inputs)]
        keyed=[o for o in q['options'] if o['isCorrect']]
        if len(candidates)!=1 or len(keyed)!=1 or candidates[0]!=keyed[0]:raise ValueError(f'{file}:{index}: ambiguous or incorrect answer key')
        # The numerical values in the Spanish alternative must agree as well.
        if not matches(kind,result,keyed[0]['optionTextEs'],inputs):raise ValueError(f'{file}:{index}: Spanish numerical mismatch')
        records.append({'file':file,'index':index,'kind':kind,'result':str(result),'answer':keyed[0]['optionLabel'],'arithmetic':'passed','fullTechnicalApproval':False})
    singles=collections.Counter();multiples=collections.Counter()
    for file in sorted(root.glob('batch*.json')):
        for q in json.loads(file.read_text())['questions']:
            labels=[o['optionLabel'] for o in q['options'] if o['isCorrect']]
            (singles if len(labels)==1 else multiples)[','.join(labels)]+=1
    return {'arithmeticChecksPassed':len(records),'fullTechnicalApprovals':0,'legacySingleAnswerKeys':dict(singles),'legacyMultipleAnswerKeys':dict(multiples),'scope':'Eleven selected arithmetic cases, with numerical ES/EN agreement. Reference consultation, technical translation and the rest of the bank remain unapproved.','records':records}


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--output');args=parser.parse_args()
    report=json.dumps(review(),indent=2,ensure_ascii=False)+'\n'
    if args.output:Path(args.output).write_text(report)
    else:print(report,end='')
