import * as fs from 'fs';
import * as path from 'path';

function ensureDocDirs() {
	const modulesPath = path.join(__dirname, '../src/modules');
	const modules = fs.readdirSync(modulesPath);

	for (const module of modules) {
		const modulePath = path.join(modulesPath, module);
		if (fs.statSync(modulePath).isDirectory()) {
			const docsDir = path.join(modulePath, 'docs');
			if (!fs.existsSync(docsDir)) {
				fs.mkdirSync(docsDir, { recursive: true });
			}
		}
	}
}

ensureDocDirs();
