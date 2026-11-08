#!/usr/bin/env python3
"""Documentation-only pack checker. NO application build/tests are implied."""
from pathlib import Path
import csv, json, sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    'AGENTS.md', '.specify/memory/constitution.md',
    '.github/copilot-instructions.md', 'docs/architecture/architecture.md',
    'docs/security/threat-model.md', 'docs/api/openapi.json',
    'tests/test-catalog.csv', 'docs/requirements/traceability.csv',
    'specs/features/001-auth/spec.md', 'specs/features/002-incidents/spec.md',
    'specs/features/003-assignments/spec.md',
]

def check_required():
    return [x for x in REQUIRED if not (ROOT/x).is_file()]

def check_ids():
    with (ROOT/'tests/test-catalog.csv').open(encoding='utf-8',newline='') as fh:
        tests=list(csv.DictReader(fh))
    with (ROOT/'docs/requirements/traceability.csv').open(encoding='utf-8',newline='') as fh:
        trace=list(csv.DictReader(fh))
    ids=[r['Test_ID'] for r in tests]
    reqs=[r['Requirement_ID'] for r in trace]
    errors=[]
    if len(ids)!=len(set(ids)): errors.append('Duplicate test IDs')
    if len(reqs)!=len(set(reqs)): errors.append('Duplicate requirement IDs')
    allowed={'Planned','In progress','Implemented','Verified','Blocked'}
    for row in trace:
        if row['Status'] not in allowed: errors.append('Invalid requirement status '+row['Requirement_ID'])
        if row['Status']=='Verified' and not row['CI_Evidence']:
            errors.append('Verified requirement lacks CI evidence '+row['Requirement_ID'])
    for row in tests:
        if row['Status'] not in allowed: errors.append('Invalid test status '+row['Test_ID'])
        if row['Status']=='Verified' and not row['Last_CI_Evidence']:
            errors.append('Verified test lacks CI evidence '+row['Test_ID'])
    for row in tests:
        if row['Requirement_ID'] not in reqs:
            errors.append('Test missing requirement '+row['Test_ID'])
    for row in trace:
        if row['Test_ID'] and row['Test_ID'] not in ids:
            errors.append('Unresolved test for '+row['Requirement_ID'])
    return errors

def check_openapi():
    obj=json.loads((ROOT/'docs/api/openapi.json').read_text(encoding='utf-8'))
    errors=[]
    if not obj.get('openapi','').startswith('3.1.'):
        errors.append('Expected OpenAPI 3.1 contract')
    if len(obj.get('paths',{}))<15:
        errors.append('Too few planned API paths')
    if 'sessionCookie' not in obj.get('components',{}).get('securitySchemes',{}):
        errors.append('Missing cookie security definition')
    return errors

def run():
    errors=[('Missing file: '+x) for x in check_required()]+check_ids()+check_openapi()
    if errors:
        for issue in errors: print('FAIL:',issue)
        return 1
    print('PASS: documentation manifest, requirement/test references and draft OpenAPI JSON validated.')
    print('NOTE: no web application or executable application tests are implemented.')
    return 0

if __name__=='__main__':
    sys.exit(run())
