import { createElement, ReactElement } from "react";
import { HastElement, HastText, Options, highlight } from "./core";

export default function toReactElement(
  text: string,
  languageOrOptions: string | Options = {} as Options
): ReactElement | null {
  const root = highlight(text, languageOrOptions);
  if (!root) return null;

  const pre = root.children[0] as HastElement;

  const e = (node: HastElement | HastText): ReactElement | string => {
    if (node.type === "text") return (node as HastText).value;

    return createElement(
      node.tagName,
      node.properties,
      ...node.children.map(e)
    );
  };

  return createElement(pre.tagName, pre.properties, ...pre.children.map(e));
}
