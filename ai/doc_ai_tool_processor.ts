import { exec } from 'child_process';
import * as fs from 'fs';

interface DocParameter {
  name: string;
  type: string;
  change_type: string;
  old_value: string;
  new_value: string;
  is_output: boolean;
  is_array: boolean;
}

interface DocChanges {
  diff: string[];
  parent_class: string;
  language: string;
  details: {
    api_name: string;
    api_signature: string;
    change_type: string;
    parameters: DocParameter[];
  };
}

export interface AIParameter {
  parent_name: string;
  parent_class: string;
  is_output: boolean;
  is_array: boolean;
}

interface AIParameterObject {
  [key: string]: AIParameter;
}

export interface DocAIToolJson {
  changes: {
    api_changes: DocChanges[];
    struct_changes: DocChanges[];
    enum_changes: DocChanges[];
  };
}

export class DocAIToolJsonProcessor {
  private data: DocAIToolJson[] | undefined;

  constructor(filepath: string) {
    this.readJsonFromFile(filepath);
  }

  private readJsonFromFile(filepath: string): void {
    try {
      const jsonData = fs.readFileSync(filepath, 'utf-8');
      this.data = JSON.parse(jsonData);
    } catch (error) {
      console.error('Error reading JSON file:', error);
    }
  }

  generateConfigFromDocAPIChanges(): AIParameterObject {
    let output: AIParameterObject = {};
    if (!this.data) {
      console.error('call readJsonFromFile() first.');
      return output;
    }
    this.data.map((docAIToolJson: DocAIToolJson) => {
      docAIToolJson.changes.api_changes.map((item: DocChanges) => {
        item.details.parameters.map((param: DocParameter) => {
          let key = `${item.parent_class}:${item.details.api_name}.${param.name}@type`;
          output[key] = {
            parent_class: item.parent_class,
            parent_name: item.details.api_name,
            is_output: param.is_output,
            is_array: param.is_array,
          };
        });
      });
    });
    return output;
  }

  saveConfigToFile(outputPath: string): void {
    const config = this.generateConfigFromDocAPIChanges();
    const configString = `module.exports = ${JSON.stringify(config, null, 2)};`;
    try {
      fs.writeFileSync(outputPath, configString, 'utf-8');
      exec(`yarn eslint --fix ${outputPath}`);
      console.log(`Configuration saved to ${outputPath}`);
    } catch (error) {
      console.error('Error writing configuration to file:', error);
    }
  }
}
