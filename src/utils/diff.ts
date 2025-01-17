import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Interface to store differences
interface Difference {
  filePath: string; // Path of the file with differences
  diffs: string[]; // Store the output from the diff command as an array
  diffsBlocks: string[]; // Store the output from the diff command as an array
}

export class Diff {
  private dirA: string;
  private dirB: string;
  private blackList: string[];
  private whiteList: string[];
  private outputDir?: string; // Optional output directory

  constructor(
    dirA: string,
    dirB: string,
    blackList: string[] = [],
    whiteList: string[] = []
  ) {
    this.dirA = dirA;
    this.dirB = dirB;
    this.blackList = blackList;
    this.whiteList = whiteList;
  }

  // Set the output directory for diff results
  public setOutputDirectory(outputDir: string): void {
    this.outputDir = outputDir;
  }

  // Clean the file path to remove unwanted parts
  private cleanFilePath(filePath: string): string {
    return filePath
      .replace(/\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/, '')
      .trim();
  }

  // Compare two directories using the diff command
  private compareDirectories(): Difference[] {
    const differences: Difference[] = [];

    console.log(`Comparing directories: ${this.dirA} vs ${this.dirB}`);

    try {
      const result = execSync(
        `diff -u -b -r --unified=50 ${this.dirA} ${this.dirB}`,
        {
          encoding: 'utf-8',
        }
      );

      if (!result) {
        console.log('No Differences found.');
        return differences; // No differences found
      }
    } catch (error: any) {
      if (error.status === 1) {
        console.log('Differences found.');
        const errorOutput = error.stdout || 'Differences found but no output.';
        const diffLines = errorOutput.split('\n');
        let currentFile: string = '';
        let currentDiff: string[] = [];

        diffLines.map((line: string, index: number) => {
          if (line.startsWith('+++ ')) {
            currentFile = line.substring(4).trim();
            currentFile = this.cleanFilePath(currentFile);
          } else if (line.startsWith('diff -u -b')) {
            if (currentFile && currentDiff.length > 0) {
              differences[differences.length - 1].filePath = currentFile;
              differences[differences.length - 1].diffs = currentDiff;
              differences[differences.length - 1].diffsBlocks = currentDiff
                .join('\n')
                .split(/(?=@@ -)/)
                .map((part) =>
                  part.includes('@@ -')
                    ? part.split(/(?=@@ -)/).join('@@ -')
                    : part
                )
                .filter(Boolean);
              currentFile = '';
              currentDiff = [];
            }
            differences.push({
              filePath: currentFile,
              diffs: currentDiff,
              diffsBlocks: [],
            });
          } else if (currentFile) {
            currentDiff.push(line);
          }
          if (index === diffLines.length - 1) {
            differences[differences.length - 1].filePath = currentFile;
            differences[differences.length - 1].diffs = currentDiff;
            differences[differences.length - 1].diffsBlocks = currentDiff
              .join('\n')
              .split(/(?=@@ -)/)
              .map((part) =>
                part.includes('@@ -')
                  ? part.split(/(?=@@ -)/).join('@@ -')
                  : part
              )
              .filter(Boolean);
          }
        });
      } else {
        console.error(`Error executing diff: ${error.message}`);
        console.error(`Command output: ${error.stdout}`);
        console.error(`Error output: ${error.stderr}`);
      }
    }

    return differences;
  }

  // Write differences to the specified output directory
  private writeDifferencesToFile(differences: Difference[]): void {
    if (!this.outputDir) {
      console.warn('Output directory not set. Skipping writing differences.');
      return;
    }

    if (fs.existsSync(this.outputDir)) {
      fs.rmSync(this.outputDir!, { recursive: true });
    }
    fs.mkdirSync(this.outputDir, { recursive: true });

    differences.forEach((diff) => {
      const outputFilePath = path.join(
        this.outputDir!,
        `${path.basename(diff.filePath)}.diff`
      );
      const diffContent = diff.diffs.join('\n');
      fs.writeFileSync(outputFilePath, diffContent);
      console.log(`Differences written to: ${outputFilePath}`);
    });
  }

  public run(): Difference[] {
    const relativePathA = path.relative(this.dirA, this.dirA);
    const relativePathB = path.relative(this.dirB, this.dirB);

    if (
      this.blackList.includes(relativePathA) ||
      this.blackList.includes(relativePathB)
    ) {
      console.log(`Skipping comparison due to blacklist.`);
      return [];
    }

    if (
      this.whiteList.length > 0 &&
      !this.whiteList.includes(relativePathA) &&
      !this.whiteList.includes(relativePathB)
    ) {
      console.log(`Skipping comparison as not in whitelist.`);
      return [];
    }

    const differences = this.compareDirectories();

    // Write differences to the output directory if set
    if (this.outputDir) {
      this.writeDifferencesToFile(differences);
    }
    debugger;
    return differences;
  }
}
