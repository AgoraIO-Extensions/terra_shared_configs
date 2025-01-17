export * from './add_node_parser';
export * from './fix_enum_constant_parser';
export * from './order_node_parser';
export * from './pointer_to_array_parser';
export * from './remove_node_parser';
export * from './update_simple_type_parser';
export * from './return_type_parser';
export * from './merge_node_parser';
export * from './pointer_marker_parser';
export * from './iris_api_id_parser';
export * from './cud_node_parser';
export * from './override_node_parser';
// TS's parsers
export * from './ts/ts_comment_parser';
export * from './rtc_parser';

export enum LANGUAGE {
  TS = 'ts',
  DART = 'dart',
}

export type BaseParserArgs = {
  language?: LANGUAGE;
  config?: string;
  configFilePath?: string;
  defaultConfig?: any;
  ignoreDefaultConfig?: boolean;
  useAI?: boolean;
};
