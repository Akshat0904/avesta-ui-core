import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { ModuleDoc, ClassDoc, MethodDoc, ConstructorDoc, ParameterDoc } from '../types/docTypes';

export class DocGenerator {
	private modules: Map<string, ModuleDoc> = new Map();

	constructor(private basePath: string) {}

	async generateDocs() {
		await this.scanDirectory(this.basePath);
		return this.generateMarkdown();
	}

	private async scanDirectory(dirPath: string) {
		const files = await fs.promises.readdir(dirPath);

		for (const file of files) {
			const fullPath = path.join(dirPath, file);
			const stats = await fs.promises.stat(fullPath);

			if (stats.isDirectory()) {
				await this.scanDirectory(fullPath);
			} else if (file.endsWith('.usecase.ts') || file.endsWith('.service.ts')) {
				await this.processFile(fullPath);
			}
		}
	}

	private async processFile(filePath: string) {
		const sourceFile = ts.createSourceFile(
			filePath,
			await fs.promises.readFile(filePath, 'utf-8'),
			ts.ScriptTarget.Latest,
			true
		);

		const moduleName = this.getModuleName(filePath);
		if (!this.modules.has(moduleName)) {
			this.modules.set(moduleName, {
				name: moduleName,
				useCases: [],
				services: []
			});
		}

		ts.forEachChild(sourceFile, (node) => {
			if (ts.isClassDeclaration(node) && node.name) {
				const doc = this.processClass(node);
				const module = this.modules.get(moduleName)!;

				if (node.name.text.includes('UseCase')) {
					module.useCases.push(doc);
				} else if (node.name.text.includes('Service')) {
					module.services.push(doc);
				}
			}
		});
	}

	private processClass(node: ts.ClassDeclaration): ClassDoc {
		const methods: MethodDoc[] = [];
		const constructor = this.getConstructor(node);

		node.members.forEach((member) => {
			if (ts.isMethodDeclaration(member) && member.name) {
				methods.push(this.processMethod(member));
			}
		});

		return {
			name: node.name?.text || 'Unknown',
			description: this.getJsDoc(node),
			constructor,
			methods
		};
	}

	private processMethod(node: ts.MethodDeclaration): MethodDoc {
		return {
			name: node.name.getText(),
			description: this.getJsDoc(node),
			parameters: this.getParameters(node),
			returnType: node.type ? node.type.getText() : 'void'
		};
	}

	private getConstructor(node: ts.ClassDeclaration): ConstructorDoc | undefined {
		const constructor = node.members.find(ts.isConstructorDeclaration);
		if (!constructor) return undefined;

		return {
			parameters: this.getParameters(constructor)
		};
	}

	private getParameters(node: ts.MethodDeclaration | ts.ConstructorDeclaration): ParameterDoc[] {
		return node.parameters.map((param) => ({
			name: param.name.getText(),
			type: param.type ? param.type.getText() : 'any'
		}));
	}

	private getJsDoc(node: ts.Node): string {
		const jsDoc = ts.getJSDocTags(node);
		return jsDoc.map((doc) => doc.getText()).join('\n');
	}

	private getModuleName(filePath: string): string {
		const parts = filePath.split(path.sep);
		const moduleIndex = parts.findIndex((part) => part === 'modules');
		return moduleIndex >= 0 ? parts[moduleIndex + 1] : 'shared';
	}

	private generateMarkdown(): string {
		let markdown = '# API Documentation\n\n';

		this.modules.forEach((module) => {
			markdown += `## ${module.name}\n\n`;

			if (module.useCases.length > 0) {
				markdown += '### Use Cases\n\n';
				module.useCases.forEach((useCase) => {
					markdown += this.generateClassDoc(useCase);
				});
			}

			if (module.services.length > 0) {
				markdown += '### Services\n\n';
				module.services.forEach((service) => {
					markdown += this.generateClassDoc(service);
				});
			}
		});

		return markdown;
	}

	private generateClassDoc(classDoc: ClassDoc): string {
		let doc = `#### ${classDoc.name}\n\n`;

		if (classDoc.description) {
			doc += `${classDoc.description}\n\n`;
		}

		if (classDoc.constructor) {
			doc += '##### Constructor\n\n';
			doc += '```typescript\n';
			doc += `constructor(${this.formatParameters(classDoc.constructor.parameters)})\n`;
			doc += '```\n\n';
		}

		if (classDoc.methods.length > 0) {
			doc += '##### Methods\n\n';
			classDoc.methods.forEach((method) => {
				doc += `###### ${method.name}\n\n`;
				if (method.description) {
					doc += `${method.description}\n\n`;
				}
				doc += '```typescript\n';
				doc += `${method.name}(${this.formatParameters(method.parameters)}): ${method.returnType}\n`;
				doc += '```\n\n';
			});
		}

		return doc;
	}

	private formatParameters(params: ParameterDoc[]): string {
		return params.map((param) => `${param.name}: ${param.type}`).join(', ');
	}
}
