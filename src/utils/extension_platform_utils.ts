import { SimpleTypeKind, Variable } from '@agoraio-extensions/cxx-parser';

export function getVariableIsOutput(node: Variable): boolean {
  return (
    (node.type.kind === SimpleTypeKind.pointer_t ||
      node.type.kind === SimpleTypeKind.reference_t ||
      node.type.kind === SimpleTypeKind.array_t) &&
    !node.type.is_const
  );
}