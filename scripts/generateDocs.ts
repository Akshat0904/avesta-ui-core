import { DocGenerator } from '../src/docs/generators/docGenerator';
import * as fs from 'fs';
import * as path from 'path';
import { version } from '../package.json';

async function generateDocs() {
	const generator = new DocGenerator(path.join(__dirname, '../src'));
	const docs = await generator.generateDocs();

	const docsDir = path.join(__dirname, '../docs');
	if (!fs.existsSync(docsDir)) {
		fs.mkdirSync(docsDir);
	}

	fs.writeFileSync(path.join(docsDir, `api-${version}.md`), docs);

	// Also update latest version
	fs.writeFileSync(path.join(docsDir, 'api-latest.md'), docs);
}

generateDocs().catch(console.error);
