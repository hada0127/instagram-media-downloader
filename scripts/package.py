from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json
root = Path(__file__).resolve().parents[1]
version = json.loads((root / 'extension/manifest.json').read_text())['version']
out = root / 'dist' / f'insta-pick-{version}.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as archive:
    for path in sorted((root / 'extension').rglob('*')):
        if path.is_file() and not path.name.startswith('.'):
            archive.write(path, path.relative_to(root / 'extension'))
print(out)
