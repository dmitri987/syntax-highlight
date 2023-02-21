import type { Options } from "./core";
import { highlight } from './core';
import stringify from "./stringify";

export default function toHtml(
  text: string,
  languageOrOptions: string | Options = {} as Options
) {
  return stringify(text, "html", languageOrOptions);
}

toHtml.defaults = highlight.defaults;
