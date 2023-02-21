import { HastElement, HastText, Options, highlight } from "./core";

const stringifyPropValue = (value: unknown): string => {
  if (typeof value === "string") return `"${value}"`;

  if (value instanceof Array) return `"${value.join(" ")}"`;

  // #change
  // if (value && typeof value === "object") {
  //   const obj: Record<string, any> = value;
  //   return [
  //     "{{",
  //     ...Object.keys(obj).map((k) => {
  //       const v = typeof obj[k] === "string" ? `"${obj[k]}"` : `${obj[k]}`;
  //       return ` ${k}: ${v}`;
  //     }),
  //     " }}",
  //   ].join("");
  // }
  return '';  // ??
};

type TargetFormat = 'jsx' | 'html';

const stringifyProps = (node: HastElement, targetFormat: TargetFormat): string => {
  const _props = node.properties;
  if (_props instanceof Array) return _props.join(" ");

  const _p = targetFormat === 'html' 
    ? (key: string) => (key === 'className') ? 'class' : key
    : (key: string) => key;

  if (typeof _props === "object")
    return Object.keys(_props)
      .map((k) => `${_p(k)}=${stringifyPropValue(_props[k])}`)
      .join(" ");

  return `${_props}`;
};

const stringifyElement = (
  node: HastElement | HastText,
  targetFormat: TargetFormat
): string => {
  if (node.type === "text") {
    return targetFormat === 'jsx'
      ? "{`" + node.value.replaceAll("\\", "\\\\") + "`}"
      : node.value.replaceAll("\\", "\\\\");
  }

  const tagWithProps = `<${node.tagName} ${stringifyProps(node, targetFormat)}`.trimRight();

  const tag =
    node.children && node.children.length > 0
      ? [
          tagWithProps + ">",
          ...node.children.map((child) => stringifyElement(child, targetFormat)),
          `</${node.tagName}>`,
        ].join("")
      : tagWithProps + " />";

  return tag;
};

export default function stringify(
  text: string,
  targetFormat: TargetFormat,
  languageOrOptions: string | Options = {} as Options
): string {
  const root = highlight(text, languageOrOptions);
  if (!root) return "";

  const pre = root.children[0];

  return stringifyElement(pre, targetFormat);
}
