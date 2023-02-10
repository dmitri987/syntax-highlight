import { HastElement, HastRoot, HastText } from "../core";

function urlToLink(
  node: HastText,
  className?: string
): (HastElement | HastText)[] {
  // from Prism Autolinker plugin:
  // https://github.com/PrismJS/prism/blob/master/plugins/autolinker/prism-autolinker.js
  const urlRegExp =
    /\b([a-z]{3,7}:\/\/|tel:)[\w\-+%~/.:=&!$*,;@]+(?:\?[\w\-+%~/.:=?&!$*,;@]*)?(?:#[\w\-+%~/.:#=?&!$*,;@]*)?|\b\S+@[\w.]+[a-z]{2}/g;
  const text = node.value;
  const result = [];
  let start = 0;

  for (const match of text.matchAll(urlRegExp)) {
    const url = match[0];
    const i = match.index ?? 0;

    if (i > start) {
      result.push({
        type: "text" as const,
        value: text.slice(start, i),
      });
    }

    const link: HastElement = {
      type: "element" as const,
      tagName: "a",
      properties: {
        href: url,
      },
      children: [
        {
          type: "text" as const,
          value: url,
        },
      ],
    };

    if (className) link.properties!.className = className;

    result.push(link);

    start = i + url.length;
  }

  if (start < text.length) {
    result.push({
      type: "text" as const,
      value: text.slice(start),
    });
  }

  return result;
}

function urlsToLinks(
  parent: HastRoot | HastElement,
  className?: string
): HastRoot | HastElement {
  const newChildren = [];
  for (const child of parent.children) {
    if (child.type === "text") {
      newChildren.push(...urlToLink(child, className));
    } else {
      urlsToLinks(child, className);
      newChildren.push(child);
    }
  }
  parent.children = newChildren;
  return parent;
}

export default function autolink(parent: HastRoot, className?: string): void {
  urlsToLinks(parent, className);
}
