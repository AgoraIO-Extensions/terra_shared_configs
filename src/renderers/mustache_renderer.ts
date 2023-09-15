import fs, { readFileSync } from 'fs';
import path from 'path';

import * as Mustache from 'mustache';
import { RenderResult } from '@agoraio-extensions/terra-core';

export interface MustacheRenderConfiguration {
  /**
   * fileNameTemplatePath is the path of file name template.
   */
  fileNameTemplatePath: string;
  /**
   * fileContentTemplatePath is the path of file content template.
   */
  fileContentTemplatePath: string;
  /**
   * view is the data for mustache rendering.
   */
  view: any;
  /**
   * childrenTemplatesPath is the path of children templates.
   * default value: baseDir at fileContentTemplate.
   */
  childrenTemplatesPath?: string;
  /**
   * templateFilePostfix is the postfix of template file.
   * default value: '.mustache'.
   */
  templateFilePostfix?: string;
}

export function renderWithConfiguration(config: MustacheRenderConfiguration): RenderResult[] {
  const {
    fileNameTemplatePath,
    fileContentTemplatePath,
    childrenTemplatesPath = path.dirname(fileContentTemplatePath),
    templateFilePostfix = '.mustache',
  } = config;
  const childrenTemplates: { [key: string]: string } = fs
    .readdirSync(childrenTemplatesPath)
    .filter((it) => it.endsWith(templateFilePostfix))
    .reduce(
      (a, v) => ({
        ...a,
        [path.basename(v).replace(templateFilePostfix, '')]: readFileSync(
          path.join(childrenTemplatesPath, v)
        ).toString(),
      }),
      {}
    );

  const _render = (view: any): RenderResult => {
    view.upper = function () {
      return function (text: string, render: (arg0: string) => string) {
        return render(text).toUpperCase();
      };
    };
    view.lower = function () {
      return function (text: string, render: (arg0: string) => string) {
        return render(text).toLowerCase();
      };
    };
    return {
      file_name: renderWithTemplate(
        fs.readFileSync(fileNameTemplatePath).toString(),
        view
      ),
      file_content: renderWithTemplate(
        fs.readFileSync(fileContentTemplatePath).toString(),
        view,
        childrenTemplates
      ),
    };
  };
  if (Array.isArray(config.view)) {
    return config.view.map(_render);
  }
  return [_render(config.view)];
}

export function renderWithTemplate(
  template: string,
  view: any,
  childrenTemplates?: Record<string, string>
): string {
  return Mustache.render(template, view, childrenTemplates);
}