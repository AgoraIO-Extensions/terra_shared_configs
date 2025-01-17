import { DocAIToolJsonProcessor } from './doc_ai_tool_processor';

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error('Usage: node script.js <input_filepath> <output_filepath>');
  process.exit(1);
}

const [inputFilePath, outputFilePath] = args;

const docAIToolJsonProcessor = new DocAIToolJsonProcessor(inputFilePath);
docAIToolJsonProcessor.saveConfigToFile(outputFilePath);
