import type { Root, Text, Element } from "hast";
import { refractor, Syntax as RefractorSyntax } from "refractor/lib/core";
import { lowlight, HighlightSyntax } from "lowlight/lib/core";
import wrapLinesPlugin from "../plugins/wrapLines";
import autolinkPlugin from "../plugins/autolink";

export type HastText = Text;

export type HastElement = Omit<Element, "children"> & {
  children: Array<HastElement | Text>;
};

export type HastRoot = Omit<Root, "children"> & {
  children: Array<HastElement | Text>;
};

const LIB_PATH = "{path_to_lib}/syntax-highlight";

const warn = (language: string, libName: string, example: string) => {
  console.warn(
    `Language '${language}' isn't registered in '${libName}'.
To register a language in '${libName}':
     
  import { ${libName} } from '${LIB_PATH}';
${example}`
  );
};

const rootWithRawText = (text: string) =>
  ({
    type: "root",
    children: [{ type: "text", value: text }],
  } as HastRoot);

/* wrapper for 'refractor' library */
export const prism = {
  highlight(text: string, language: string): HastRoot | null {
    if (!text) return null;

    let root;
    try {
      root = refractor.highlight(text, language);
    } catch (err) {
      root = rootWithRawText(text);
      warn(
        language,
        this.displayName,
        `
  import javascript from "refractor/lang/javascript";

  prism.registerLanguage(javascript); `
      );
    }
    return root;
  },

  registerLanguage(syntax: RefractorSyntax, ...aliases: string[]): void {
    refractor.register(syntax);
    refractor.alias(syntax.displayName, aliases);
  },

  registered: refractor.registered,
  listLanguages: refractor.listLanguages,
  displayName: "prism" as ParsingEngine,
};
Object.freeze(prism);

/* add some default languages to refractor  */
import clike from "refractor/lang/clike.js";
import markup from "refractor/lang/markup.js";
import css from "refractor/lang/css.js";
import javascript from "refractor/lang/javascript.js";
prism.registerLanguage(clike);
prism.registerLanguage(markup);
prism.registerLanguage(css);
prism.registerLanguage(javascript, "js");

/* wrapper for 'lowlight' library */
export const hljs = {
  highlight(text: string, language: string): HastRoot | null {
    if (!text) return null;

    let root;
    try {
      root = lowlight.highlight(language, text);
    } catch (err) {
      root = rootWithRawText(text);
      warn(
        language,
        this.displayName,
        `
  import javascript from "highlight.js/lib/languages/javascript";

  hljs.registerLanguage(javascript, 'javascript'); `
      );
    }
    return root;
  },
  registerLanguage(
    syntax: HighlightSyntax,
    name: string,
    ...aliases: string[]
  ): void {
    lowlight.registerLanguage(name, syntax);
    lowlight.registerAlias(name, aliases);
  },
  registered: lowlight.registered,
  listLanguages: lowlight.listLanguages,
  displayName: "hljs" as ParsingEngine,
};
Object.freeze(hljs);

/* add some default languages to lowlight */
import xml from "highlight.js/lib/languages/xml";
import hljsCss from "highlight.js/lib/languages/css";
import hljsJavascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage(xml, "xml");
hljs.registerLanguage(hljsCss, "css");
hljs.registerLanguage(hljsJavascript, "javascript", "js");

type ParsingEngine = "prism" | "hljs";
type ClassName = string;

export type Options = {
  parsingEngine?: ParsingEngine;
  language?: string;
  wrapLines?: boolean | ClassName;
  autolink?: boolean | ClassName;
  preClass?: ClassName;
  codeClass?: ClassName;
};

export const defaults: Required<Options> & { reset(): void } = {
  parsingEngine: "prism",
  language: "text",
  wrapLines: false,
  autolink: false,
  preClass: "",
  codeClass: "",
  reset() {
    this.parsingEngine = "prism";
    this.language = "text";
    this.wrapLines = false;
    this.autolink = false;
    this.preClass = "";
    this.codeClass = "";
  },
};
Object.seal(defaults);

export function highlight(
  text: string,
  languageOrOptions: string | Options = {} as Options
): HastRoot | null {
  const {
    parsingEngine,
    language: _lang,
    wrapLines,
    autolink,
    preClass,
    codeClass,
  } = resolveOptions(languageOrOptions);
  const lib = parsingEngine === "hljs" ? hljs : prism;
  const language = _lang && lib.registered(_lang) ? _lang : "text";
  const root = lib.highlight(text, language);
  if (!root) return null;

  stringifyAllClassNames(root);

  if (wrapLines || typeof wrapLines === 'string') {
    const lineClassName =
      typeof wrapLines === "string" && wrapLines !== "" ? wrapLines : undefined;
    wrapLinesPlugin(root, lineClassName);
  }

  if (autolink || typeof autolink === 'string') {
    const linkClassName =
      typeof autolink === "string" && autolink !== "" ? autolink : undefined;
    autolinkPlugin(root, linkClassName);
  }

  wrapInPreCode(root, language, parsingEngine, preClass, codeClass);
  // console.log(root)
  return root;
}

function resolveOptions(
  languageOrOptions: string | Options
): Required<Options> {
  return typeof languageOrOptions === "string"
    ? { ...defaults, language: languageOrOptions }
    : { ...defaults, ...languageOrOptions };
}

function forEach(
  root: HastRoot,
  callback: (node: HastElement | HastText) => void
): void {
  const apply = (node: HastElement | HastText) => {
    callback(node);
    if (node.type === "element") node.children.forEach(apply);
  };

  root.children.forEach(apply);
}

// Prism.js keep classes in Array, Highligh.js - as string
// make either variant as string
function stringifyAllClassNames(root: HastRoot): void {
  forEach(root, (node) => {
    const el = node as HastElement;
    const className = el?.properties?.className;
    if (!className) return;

    el.properties!.className =
      className instanceof Array ? className.join(" ") : className;
  });
}

const clss = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

function wrapInPreCode(
  root: HastRoot,
  language: string,
  engine: ParsingEngine,
  preClass: string,
  codeClass: string
): void {
  const preCode: HastElement = {
    type: "element",
    tagName: "pre",
    properties: {
      className: clss(
        `language-${language}`,
        engine === "hljs" ? "hljs" : "prism",
        preClass
      ),
    },
    children: [
      {
        type: "element",
        tagName: "code",
        properties: {
          className: clss(
            `language-${language}`,
            engine === "hljs" ? "hljs" : "prism",
            codeClass
          ),
        },
        children: root.children,
      },
    ],
  };

  root.children = [preCode];
}
