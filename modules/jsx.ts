import type { Options } from "./core";
import stringify from "./stringify";

export default function toJsx(
  text: string,
  languageOrOptions: string | Options = {} as Options
) {
  return stringify(text, "jsx", languageOrOptions);
}
