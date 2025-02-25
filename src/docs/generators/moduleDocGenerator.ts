import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

export class ModuleDocGenerator {
    constructor(private modulePath: string) {}

    async generateModuleDoc(): Promise<string> {
        const moduleName = path.basename(this.modulePath);
        let markdown = `# ${moduleName} Module\n\n`;

        // Add module overview from module's README if exists
        const readmePath = path.join(this.modulePath, 'README.md');
        if (fs.existsSync(readmePath)) {
            const overview = fs.readFileSync(readmePath, 'utf-8');
            markdown += `## Overview\n\n${overview}\n\n`;
        }

        // Generate docs for different component types
        markdown += await this.generateComponentDocs('Use Cases', 'usecase.ts');
        markdown += await this.generateComponentDocs('Services', 'service.ts');
        markdown += await this.generateComponentDocs('Commands', 'command.ts');
        markdown += await this.generateComponentDocs('Types', 'types.ts');
        markdown += await this.generateComponentDocs('Repositories', 'repository.ts');
        markdown += await this.generateComponentDocs('Mappers', 'mapper.ts');

        return markdown;
    }

    private async generateComponentDocs(section: string, filePattern: string): Promise<string> {
        let docs = `## ${section}\n\n`;
        const files = await this.findFiles(filePattern);

        for (const file of files) {
            docs += await this.processFile(file);
        }

        return files.length > 0 ? docs : '';
    }

    private async findFiles(pattern: string): Promise<string[]> {
        const files: string[] = [];
        
        const scan = async (dir: string) => {
            const entries = await fs.promises.readdir(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory()) {
                    await scan(fullPath);
                } else if (entry.name.includes(pattern)) {
                    files.push(fullPath);
                }
            }
        };

        await scan(this.modulePath);
        return files;
    }

    private async processFile(filePath: string): Promise<string> {
        const sourceFile = ts.createSourceFile(
            filePath,
            await fs.promises.readFile(filePath, 'utf-8'),
            ts.ScriptTarget.Latest,
            true
        );

        let docs = `### ${path.basename(filePath)}\n\n`;
        
        // Extract file description from JSDoc if available
        const fileComment = ts.getJSDocTags(sourceFile);
        if (fileComment.length > 0) {
            docs += `${this.getJsDoc(sourceFile)}\n\n`;
        }

        // Process exports (classes, interfaces, types, etc.)
        ts.forEachChild(sourceFile, (node) => {
            if (ts.isClassDeclaration(node) || 
                ts.isInterfaceDeclaration(node) || 
                ts.isTypeAliasDeclaration(node)) {
                docs += this.processNode(node);
            }
        });

        return docs;
    }

    private processNode(node: ts.Node): string {
        let docs = '';
        const name = (node as any).name?.text;
        
        if (!name) return '';

        // Get node description from JSDoc
        const description = this.getJsDoc(node);
        
        if (ts.isClassDeclaration(node)) {
            docs += `#### Class: ${name}\n\n`;
            if (description) docs += `${description}\n\n`;
            docs += this.processMembers(node);
        } else if (ts.isInterfaceDeclaration(node)) {
            docs += `#### Interface: ${name}\n\n`;
            if (description) docs += `${description}\n\n`;
            docs += this.processMembers(node);
        } else if (ts.isTypeAliasDeclaration(node)) {
            docs += `#### Type: ${name}\n\n`;
            if (description) docs += `${description}\n\n`;
            docs += `\`\`\`typescript\n${node.getText()}\n\`\`\`\n\n`;
        }

        return docs;
    }

    private processMembers(node: ts.ClassDeclaration | ts.InterfaceDeclaration): string {
        let docs = '';
        
        node.members.forEach(member => {
            if (ts.isMethodDeclaration(member) || ts.isPropertyDeclaration(member)) {
                const name = member.name.getText();
                const description = this.getJsDoc(member);
                
                docs += `##### ${name}\n\n`;
                if (description) docs += `${description}\n\n`;
                docs += `\`\`\`typescript\n${member.getText()}\n\`\`\`\n\n`;
            }
        });

        return docs;
    }

    private getJsDoc(node: ts.Node): string {
        const jsDoc = ts.getJSDocTags(node);
        return jsDoc.map(doc => doc.getText()).join('\n');
    }
} 