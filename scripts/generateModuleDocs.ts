import * as fs from 'fs';
import * as path from 'path';
import { ModuleDocGenerator } from '../src/docs/generators/moduleDocGenerator';

async function generateModuleDocs() {
	const modulesPath = path.join(__dirname, '../src/modules');
	const modules = fs.readdirSync(modulesPath);

	for (const module of modules) {
		const modulePath = path.join(modulesPath, module);
		if (fs.statSync(modulePath).isDirectory()) {
			// Create docs directory for the module if it doesn't exist
			const docsDir = path.join(modulePath, 'docs');
			if (!fs.existsSync(docsDir)) {
				fs.mkdirSync(docsDir);
			}

			// Generate documentation for the module
			const generator = new ModuleDocGenerator(modulePath);
			const docs = await generator.generateModuleDoc();

			// Write the documentation
			fs.writeFileSync(path.join(docsDir, 'README.md'), docs);
		}
	}
}

generateModuleDocs().catch(console.error);
