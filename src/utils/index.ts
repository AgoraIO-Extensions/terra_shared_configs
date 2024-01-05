export * from './obj_utils';
export * from './iris_utils';

import { SimpleTypeKind, Variable } from '@agoraio-extensions/cxx-parser';

export function isOutputVariable(node: Variable): boolean {
  return (
    (node.type.kind === SimpleTypeKind.pointer_t ||
      node.type.kind === SimpleTypeKind.reference_t ||
      node.type.kind === SimpleTypeKind.array_t) &&
    !node.type.is_const
  );
}
