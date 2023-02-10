import { HastElement, HastText, Options, highlight } from "./core";

const stringifyPropValue = (value: unknown): string => {
  if (typeof value === "string") return `"${value}"`;

  if (value instanceof Array) return `"${value.join(" ")}"`;

  if (value && typeof value === "object") {
    const obj: Record<string, any> = value;
    return [
      "{{",
      ...Object.keys(obj).map((k) => {
        const v = typeof obj[k] === "string" ? `"${obj[k]}"` : `${obj[k]}`;
        return ` ${k}: ${v}`;
      }),
      " }}",
    ].join("");
  }

  return `${value}`;
};

const stringifyProps = (node: HastElement): string => {
  const _props = node.properties;
  if (_props instanceof Array) return _props.join(" ");

  if (typeof _props === "object")
    return Object.keys(_props)
      .map((k) => `${k}=${stringifyPropValue(_props[k])}`)
      .join(" ");

  return `${_props}`;
};

const stringifyText = (text: string) =>
  "{`" + text.replaceAll("\\", "\\\\") + "`}";

const stringifyElement = (node: HastElement | HastText): string => {
  if (node.type === "text") {
    return stringifyText((node as HastText).value);
  }

  const tagWithProps = `<${node.tagName} ${stringifyProps(node)}`;

  const tag =
    node.children && node.children.length > 0
      ? [
          tagWithProps + ">",
          ...node.children.map((child) => stringifyElement(child)),
          `</${node.tagName}>`,
        ].join("")
      : tagWithProps + " />";

  return tag;
};

export default function toJsx(
  text: string,
  languageOrOptions: string | Options = {} as Options
): string {
  const root = highlight(text, languageOrOptions);
  if (!root) return "";

  const pre = root.children[0];

  return stringifyElement(pre);
}
