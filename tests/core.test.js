// import { describe, it, expect } from 'jest';
import { refractor } from "refractor/lib/core";
import prismJs from "refractor/lang/javascript";
import prismTs from "refractor/lang/typescript";
import prismRust from "refractor/lang/rust";

import hljsLua from "highlight.js/lib/languages/lua";

import { prism, hljs, highlight } from "../core";
prism.registerLanguage(prismTs);

const isHastRoot = (obj) =>
  obj?.type === "root" && obj?.children instanceof Array;
const isHastText = (obj) =>
  obj?.type === "text" && typeof obj?.value === "string";

const forEach = (root, callback) => {
  const apply = (node) => {
    callback(node);
    if (node.type === "element") node.children.forEach(apply);
  };
  root.children.forEach(apply);
};

describe(`syntax-highlight core functions`, () => {
  describe(`'prism' object`, () => {
    const unregisterLanguage = (...languages) => {
      languages.forEach((language) => {
        delete refractor.languages[language];
      });
    };

    it(`'prism' object should be frozen (changing its property should throw an error)`, () => {
      expect(Object.isFrozen(prism)).toBe(true);
      expect(() => {
        prism.displayName = "foo";
      }).toThrow();
    });

    it(`prism.highlight(text, language) should return HastRoot`, () => {
      expect(prism.registered("html")).toBe(true);
      const hast = prism.highlight(`<h1>hello world</h1>`, "html");
      expect(isHastRoot(hast)).toBe(true);
    });

    it(`prism.highlight with empty, null or undefined 'text' should return null`, () => {
      expect(prism.highlight(null, "html")).toBe(null);
      expect(prism.highlight(undefined, "html")).toBe(null);
      expect(prism.highlight("", "html")).toBe(null);
    });

    it(`prism.highlight with unregistered language should return HastRoot with single HastText child`, () => {
      const hast = prism.highlight(`<p>hello world</p>`, "unregistered");
      expect(isHastRoot(hast)).toBe(true);
      expect(hast.children).toHaveLength(1);
      expect(isHastText(hast.children[0])).toBe(true);
    });

    it(`'prism' should have 'html', 'css', 'javascript', 'js' languages pre-registered`, () => {
      expect(prism.registered("html")).toBe(true);
      expect(prism.registered("css")).toBe(true);
      expect(prism.registered("javascript")).toBe(true);
      expect(prism.registered("js")).toBe(true);
    });

    it(`prism.listLanguages() should return list of names of registered languages`, () => {
      const unregistered = prism
        .listLanguages()
        .filter((lang) => !prism.registered(lang));
      expect(unregistered).toHaveLength(0);
    });

    it(`prism.registerLanguage(syntax) should add language by its 'displayName' and optional list of aliases (see https://github.com/wooorm/refractor/blob/main/lang/javascript.js for reference)`, () => {
      unregisterLanguage("javascript", "js");
      expect(prism.registered("javascript")).toBe(false);
      expect(prism.registered("js")).toBe(false);
      expect(prismJs.displayName).toBe("javascript");
      expect(prismJs.aliases).toEqual(["js"]);
      prism.registerLanguage(prismJs);
      expect(prism.registered("javascript")).toBe(true);
      expect(prism.registered("js")).toBe(true);
    });

    it(`prism.registerLanguage(syntax, 'foo') should install a language by its 'displayName' and default aliases, but also add 'foo' as an additional alias`, () => {
      expect(prism.registered("rust")).toBe(false);
      expect(prism.registered("foo")).toBe(false);
      expect(prismRust.displayName).toBe("rust");
      expect(prismRust.aliases).toHaveLength(0);
      prism.registerLanguage(prismRust, "foo");
      expect(prism.registered("rust")).toBe(true);
      expect(prism.registered("foo")).toBe(true);
      expect(refractor.languages.rust).toBe(refractor.languages.foo);
      unregisterLanguage("rust", "foo");
    });

    it(`prism.registerLanguage(syntax) should throw an error when 'syntax' is not RefractorSyntax`, () => {
      const dummySyntax = () => {};
      dummySyntax.displayName = "foo";
      dummySyntax.aliases = [];
      prism.registerLanguage(dummySyntax); // should not throw

      expect(() => prism.registerLanguage({ foo: 0 })).toThrow();
      expect(() => prism.registerLanguage([])).toThrow();
      expect(() => prism.registerLanguage(10)).toThrow();
    });
  });

  describe(`'hljs' object`, () => {
    it(`'hljs' object should be frozen (changing its property should throw an error)`, () => {
      expect(Object.isFrozen(hljs)).toBe(true);
      expect(() => {
        hljs.displayName = "foo";
      }).toThrow();
    });

    it(`hljs.highlight(text, language) should return HastRoot`, () => {
      expect(hljs.registered("html")).toBe(true);
      const hast = hljs.highlight(`<h1>hello world</h1>`, "html");
      expect(isHastRoot(hast)).toBe(true);
    });

    it(`hljs.highlight with empty, null or undefined 'text' should return null`, () => {
      expect(hljs.highlight(null, "html")).toBe(null);
      expect(hljs.highlight(undefined, "html")).toBe(null);
      expect(hljs.highlight("", "html")).toBe(null);
    });

    it(`hljs.highlight with unregistered language should return HastRoot with single HastText child`, () => {
      const hast = hljs.highlight(`<p>hello world</p>`, "unregistered");
      expect(isHastRoot(hast)).toBe(true);
      expect(hast.children).toHaveLength(1);
      expect(isHastText(hast.children[0])).toBe(true);
    });

    it(`'hljs' should have 'html', 'css', 'javascript', 'js' languages pre-registered`, () => {
      expect(hljs.registered("html")).toBe(true);
      expect(hljs.registered("css")).toBe(true);
      expect(hljs.registered("javascript")).toBe(true);
      expect(hljs.registered("js")).toBe(true);
    });

    it(`hljs.listLanguages() should return list of names of registered languages`, () => {
      const unregistered = hljs
        .listLanguages()
        .filter((lang) => !hljs.registered(lang));
      expect(unregistered).toHaveLength(0);
    });

    it(`hljs.registerLanguage(syntax, name) should add language by 'name'`, () => {
      expect(hljs.registered("lua")).toBe(false);
      hljs.registerLanguage(hljsLua, "lua");
      expect(hljs.registered("lua")).toBe(true);
    });

    it(`hljs.registerLanguage(syntax, 'foo', 'bar') should install a language by name 'foo' and 'bar' as alias`, () => {
      expect(hljs.registered("foo")).toBe(false);
      expect(hljs.registered("bar")).toBe(false);
      hljs.registerLanguage(hljsLua, "foo", "bar");
      expect(hljs.registered("foo")).toBe(true);
      expect(hljs.registered("bar")).toBe(true);
    });

    it(`hljs.registerLanguage(syntax, name) should throw an error when 'syntax' isn't a function, which returns object (see definition of LanguageFn https://github.com/highlightjs/highlight.js/blob/main/types/index.d.ts#L89)`, () => {
      const dummySyntax = () => ({});
      hljs.registerLanguage(dummySyntax, "a"); // should not throw ??

      expect(() => hljs.registerLanguage(() => {}, "a")).toThrow();
      expect(() => hljs.registerLanguage({ foo: 0 }, "a")).toThrow();
      expect(() => hljs.registerLanguage([], "a")).toThrow();
      expect(() => hljs.registerLanguage(10, "a")).toThrow();
    });
  });

  describe(`highligh(text: string, options: string | Options)`, () => {
    it(`default settings for 'highlight' should be accessible by 'highlight.defaults'`, () => {
      expect(highlight.defaults).toBeInstanceOf(Object);
    });

    it(`highlight.defaults should be sealed (can not add or remove properties, but can change their values)`, () => {
      expect(Object.isSealed(highlight.defaults)).toBe(true);
    });

    it(`highlight.defaults.reset() should reset defaults to initial state`, () => {
      highlight.defaults.language = "foo";
      expect(highlight.defaults.language).toBe("foo");
      highlight.defaults.reset();
      expect(highlight.defaults.language).toBe("text");
    });

    it(`highlight with empty, null or undefined 'text' should return null`, () => {
      expect(highlight(null, "html")).toBe(null);
      expect(highlight(undefined, "html")).toBe(null);
      expect(highlight("", "html")).toBe(null);
    });

    it(`highlight(text, options) should return HastRoot, with following element tree: pre > code > ...`, () => {
      const root = highlight(`<h1>hello world</h1>`, "html");
      expect(isHastRoot(root)).toBe(true);
      expect(root.children).toHaveLength(1);
      expect(root.children[0].tagName).toBe("pre");
      expect(root.children[0].children).toHaveLength(1);
      expect(root.children[0].children[0].tagName).toBe("code");
    });

    it(`both <pre> and <code> elements should have .language-{name} and .{parsingEnging} classes`, () => {
      highlight.defaults.parsingEngine = "prism";
      let r = highlight("some text", "text");
      expect(r.children[0].properties.className).toMatch(/language-text/);
      expect(r.children[0].properties.className).toMatch(/prism/);

      highlight.defaults.parsingEngine = "hljs";
      r = highlight("some text", "html");
      expect(r.children[0].properties.className).toMatch(/language-html/);
      expect(r.children[0].properties.className).toMatch(/hljs/);
    });

    it(`highlight(text, language) should use 'prism' as default 'parsingEngine'`, () => {
      highlight.defaults.reset();
      const r = highlight("var x = 42;", "js");
      expect(r.children[0].properties.className).toMatch(/prism/);
      expect(r.children[0].properties.className).not.toMatch(/hljs/);
    });

    it(`highlight(text, { preClass: 'foo min-[200px]:bar' }) should append provided classes to <pre> element`, () => {
      const r = highlight("some text", { preClass: "foo min-[200px]:bar" });
      expect(r.children[0].properties.className).toMatch(/\bfoo\b/);
      expect(r.children[0].properties.className).toMatch(
        /\bmin-\[200px\]:bar\b/
      );
    });

    it(`highlight(text, { codeClass: 'foo-123 bar_45' }) should append provided classes to <code> element`, () => {
      const r = highlight("some text", { codeClass: "foo-123 bar_45" });
      expect(r.children[0].children[0].properties.className).toMatch(
        /\bfoo-123\b/
      );
      expect(r.children[0].children[0].properties.className).toMatch(
        /\bbar_45\b/
      );
    });

    it(`highlight(text, 'html') should return the same as highlight(text, { language: 'html' })`, () => {
      const r1 = highlight("<div></div>", "html");
      const r2 = highlight("<div></div>", { language: "html" });
      expect(r1).toEqual(r2);
    });

    it(`highlight(text) should use the default language (highlight.defaults.language)`, () => {
      highlight.defaults.language = "html";
      const r = highlight("<div></div>");
      expect(r.children[0].properties.className).toMatch(/language-html/);
      highlight.defaults.reset();
    });

    it(`highlight() should return raw text wrapped in pre>code when used with unregistered language`, () => {
      const r = highlight("<div></div>", "odjofjdoj");
      expect(r.children[0].properties.className).toMatch(/language-text/);
      expect(r.children[0].children[0].children).toHaveLength(1);
      expect(r.children[0].children[0].children[0].type).toBe("text");
      expect(r.children[0].children[0].children[0].value).toBe("<div></div>");
    });

    it(`highlight() should return raw text wrapped in pre>code when used with default unregistered language`, () => {
      highlight.defaults.language = "sojsodjfodjfj";
      const r = highlight("<div></div>");
      expect(r.children[0].properties.className).toMatch(/language-text/);
      expect(r.children[0].children[0].children).toHaveLength(1);
      expect(r.children[0].children[0].children[0].type).toBe("text");
      expect(r.children[0].children[0].children[0].value).toBe("<div></div>");
      highlight.defaults.reset();
    });

    it(`'className' property of every HastElement in the tree returned by highlight() should be a string of class names divided with one or more whitespaces`, () => {
      let invalidCount = 0;
      const validRE = /^\S+( +\S+)*$/;
      const root = highlight("var x = 42;", "js");
      forEach(root, (n) => {
        if (n?.properties?.className) {
          invalidCount += ~~!validRE.test(n.properties.className);
        }
      });
      expect(invalidCount).toBe(0);
    });
  });

  describe(`wrapLines plugin:  highlight(text, { wrapLines: true })`, () => {
    it(`should group resulting elements and text to <span> elements by lines (number of spans == number of '\\n' in the text)`, () => {
      const r = highlight(
        `
      function f() {
        const x = 0;

        for(let i; i < 10; i++) {
          x++;
        }

      }`,
        { wrapLines: true }
      );
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(9);
      expect(content.filter((n) => n.tagName !== "span")).toHaveLength(0);
    });

    it(`should prepend second and the rest of line <span>s with '\\n'`, () => {
      const r = highlight(
        `

      .foo {
        color: red;
        font-size: 1rem;
      }`,
        { wrapLines: true }
      );
      const content = r.children[0].children[0].children;
      expect(content[0].children[0].value).toBe("");
      expect(
        content.filter(
          (n) =>
            n.children[0].type === "text" &&
            n.children[0].value.startsWith("\n")
        )
      ).toHaveLength(5);
    });

    it(`'wrapLines' should be false by default`, () => {
      highlight.defaults.reset();
      const r = highlight(
        `first
        second
        third`,
        "text"
      );
      expect(r.children[0].children[0].children).toHaveLength(1);
    });

    it(`highlight(text, { wrapLines: "foo bar" }) should set 'className' for every line <span> to 'foo bar'`, () => {
      const r = highlight(
        `first
        second
        third`,
        { wrapLines: "foo bar" }
      );
      const content = r.children[0].children[0].children;
      expect(
        content.filter((l) => l.properties.className === "foo bar")
      ).toHaveLength(3);
    });

    it(`highlight(text, { wrapLines: '' }) should wrap lines in <span>s without 'className' property (should be equal to highlight(text, { wrapLines: true }))`, () => {
      const r = highlight(
        `first
        second
        third`,
        { wrapLines: "" }
      );
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(3);
      expect(content.filter((l) => l?.properties?.className)).toHaveLength(0);
    });

    it(`should wrap every empty line in its own <span>`, () => {
      const r = highlight(
        `


`,
        { wrapLines: true }
      );
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(4);
      expect(
        content.filter((span) => span.children[0].value === "\n")
      ).toHaveLength(3);
    });

    it(`should preserve line number when parsing 'html'`, () => {
      const r = highlight(
        `
<body>

  <div>
    hello <span>world</span> from me
  </div>

</body>
`,
        { language: "html", wrapLines: true }
      );
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(9);
    });

    it(`should work for 'javascript' language`, () => {
      const r = highlight(
        `
function foo({ // prism.js parse parameters as one <span>
  className, 
  children,
  language,
}) { } `,
        { parsingEngine: "prism", language: "js", wrapLines: true }
      );
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(6);
    });

    it(`should work for 'typescript' language`, () => {
      const r = highlight(
        `
function CodeLayer({
  className,
  children,
  language,
}: CodeLayerProps) {
  // do something
}`,
        { parsingEngine: "prism", language: "ts", wrapLines: true }
      );
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(8);
    });

    it(`each line span should include one and only one new line symbol`, () => {
      const r = highlight(
        `
let x = 42;

function f() {
  return true;
}`,
        { wrapLines: true, language: "javascript" }
      );
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(6);
      let newLineCount = 0;
      forEach(r, (n) => {
        if (n.type === "text" && n.value.includes("\n"))
          newLineCount += n.value.match(/\n/g).length;
      });
      expect(newLineCount).toBe(5);
    });

    it(`line span should have no more than one text element at the beginning`, () => {
      const r = highlight(
        `
let x = 42;

function f() {
  return true;
}`,
        { wrapLines: true, language: "javascript" }
      );
      const content = r.children[0].children[0].children;
      let count = 0;
      content.forEach(line => {
        if (line?.children[0]?.type === 'text' && line?.children[1]?.type === 'text') {
          count++;
        }
      })
      expect(count).toBe(0);
    })
  });

  describe(`autolink plugin: highlight(text, { autolink: boolean | string })`, () => {
    it(`highlight() should not use 'autolink' by default`, () => {
      highlight.defaults.reset();
      const r = highlight(`https://google.com`);
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(1);
      expect(isHastText(content[0])).toBe(true);
    });

    it(`highlight(text, { autolink: true }) should wrap 'https://...' urls in <a>`, () => {
      const r = highlight(`https://google.com`, { autolink: true });
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(1);
      expect(content[0].tagName).toBe("a");
    });

    it(`highlight(text, { autolink: true }) should wrap 'http://...' urls in <a>`, () => {
      const r = highlight(`http://foo.bar`, { autolink: true });
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(1);
      expect(content[0].tagName).toBe("a");
    });

    it(`should wrap in <a> urls with queries and hashes`, () => {
      const r = highlight(`https://foo.bar?a=1&b=2#my-hash`, {
        autolink: true,
      });
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(1);
      expect(content[0].tagName).toBe("a");
    });

    it(`should ignore relative paths`, () => {
      const r = highlight(`./foo/bar.js`, { autolink: true });
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(1);
      expect(isHastText(content[0])).toBe(true);
    });

    it(`should wrap in <a> 'mailto://...' urls`, () => {
      const r = highlight(`mailto://foo@gmail.com`, { autolink: true });
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(1);
      expect(content[0].tagName).toBe("a");
    });

    it(`should wrap in <a> 'tel:+01234...' urls`, () => {
      const r = highlight(`tel:+87348734`, { autolink: true });
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(1);
      expect(content[0].tagName).toBe("a");
    });

    it(`highlight(text, { autolink: 'foo bar' }) should add to each found link className='foo bar'`, () => {
      const r = highlight(`https://foo.bar`, {
        autolink: "text-white hover:underline",
      });
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(1);
      expect(content[0].tagName).toBe("a");
      expect(content[0].properties.className).toMatch(/text-white/);
      expect(content[0].properties.className).toMatch(/hover:underline/);
    });

    it(`highlight(text, { autolink: '' }) should wrap urls to <a> without className (should work like 'autolink: true')`, () => {
      const r = highlight(`https://foo.bar`, { autolink: "" });
      const content = r.children[0].children[0].children;
      expect(content).toHaveLength(1);
      expect(content[0].tagName).toBe("a");
      expect(content[0]?.properties?.className).toBeUndefined();
    });

    it(`should wrap all urls in the text`, () => {
      const r = highlight(
        `https://foo.bar tel:837474
        mailto://ddd@ijij.com`,
        { autolink: true }
      );
      const content = r.children[0].children[0].children;
      let count = 0;
      forEach(r, (n) => (count += ~~(n.tagName === "a")));
      expect(count).toBe(3);
    });
  });
});
