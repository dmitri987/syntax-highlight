import { HastElement, HastRoot, HastText } from "../core";

/*
 * Caveat: it will only group top-level elements
 * It WILL NOT split elements, which have multiple lines inside
 *
 *
 *
 **/

function appendLineSpanNode(
  lineSpanNodes: HastElement[],
  prefix: string | null,
  children: (HastElement | HastText)[] | null,
  postfix: string | null,
  className?: string
): void {
  if (
    prefix === null &&
    (!children || children.length <= 0) &&
    postfix === null
  )
    return;

  const lineSpanNode: HastElement = {
    type: "element" as const,
    tagName: "span",
    children: [],
    properties: {},
  };

  if (className) lineSpanNode.properties!.className = className;

  if (prefix !== null) {
    lineSpanNode.children.push({
      type: "text" as const,
      value: prefix,
    });
  }

  if (children && children.length > 0) {
    lineSpanNode.children.push(...children);
  }

  if (postfix !== null) {
    lineSpanNode.children.push({
      type: "text" as const,
      value: postfix,
    });
  }

  lineSpanNodes.push(lineSpanNode);
  // console.log(lineSpanNode)
}

export default function wrapLinesInSpans(
  root: HastRoot,
  className?: string
): void {
  let start = 0;
  let prefix = null;
  const result: HastElement[] = [];
  const nodes = root.children;
  for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
    const node = nodes[nodeIndex];
    // console.log('#1', node, start, nodeIndex, nodes.length, `'${prefix}'`)
    if (node.type === "text") {
      // if (node.value === '\n') continue;

      let lines = node.value.split("\n");
      if (lines.length === 1 && nodeIndex < nodes.length - 1) continue;
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
// console.log(nodeIndex, start, lineIndex, lines)
        const line = lines[lineIndex];
        if (start < nodeIndex) {
          appendLineSpanNode(
            result,
            result.length === 0 ? prefix : prefix ? "\n" + prefix : "\n",
            nodes.slice(start, nodeIndex),
            line,
            className
          );
          start = nodeIndex + 1;
          prefix = null;
        } else if (
          lineIndex < lines.length - 1 ||
          nodeIndex >= nodes.length - 1
        ) {
          appendLineSpanNode(
            result,
            (result.length > 0 ? "\n" : "") + line,
            null,
            null,
            className
          );
        } else {
          prefix = line;
          start = nodeIndex + 1;
        }
      }
    } else if (nodeIndex === nodes.length - 1 && start <= nodeIndex) {
      const nPrefix = result.length > 0 ? "\n" : "";
      // console.log('#1', nodes.slice(start, nodeIndex + 1))
      appendLineSpanNode(
        result,
        nPrefix + prefix,
        nodes.slice(start, nodeIndex + 1),
        null,
        className
      );
    }
  }

  if (prefix) {
    appendLineSpanNode(result, "\n" + prefix, null, null, className);
  }

  if (result.length === 0) {
    appendLineSpanNode(result, null, nodes, null, className);
  }
  // console.log(root, result)

  root.children = result;
}
