import { jsx, highlight } from "../index";

describe(`jsx(text: string, langOrOptions: string | Options): string`, () => {
  it(`should return empty string if 'text' is empty, null or undefined`, () => {
    expect(jsx("")).toEqual("");
    expect(jsx(null)).toEqual("");
    expect(jsx()).toEqual("");
  });

  it(`should have the same 'default' property as 'highlight'`, () => {
    expect(jsx.defaults).not.toBeUndefined();
    expect(jsx.defaults).toBe(highlight.defaults);
  });

  const text = `// http://example.com/foo/bar?a=1&b=2#baz
let x = 42;

function* f() {
  yield true;
}

for (let i = 0: i < 5; i++) {
  // do something
}`;

  it(`prism - js - no wrapLines - no autolink`, () => {
    const expected = `<pre className="language-js prism"><code className="language-js prism"><span className="token comment">{\`// http://example.com/foo/bar?a=1&b=2#baz\`}</span>{\`
\`}<span className="token keyword">{\`let\`}</span>{\` x \`}<span className="token operator">{\`=\`}</span>{\` \`}<span className="token number">{\`42\`}</span><span className="token punctuation">{\`;\`}</span>{\`

\`}<span className="token keyword">{\`function\`}</span><span className="token operator">{\`*\`}</span>{\` \`}<span className="token function">{\`f\`}</span><span className="token punctuation">{\`(\`}</span><span className="token punctuation">{\`)\`}</span>{\` \`}<span className="token punctuation">{\`{\`}</span>{\`
  \`}<span className="token keyword">{\`yield\`}</span>{\` \`}<span className="token boolean">{\`true\`}</span><span className="token punctuation">{\`;\`}</span>{\`
\`}<span className="token punctuation">{\`}\`}</span>{\`

\`}<span className="token keyword">{\`for\`}</span>{\` \`}<span className="token punctuation">{\`(\`}</span><span className="token keyword">{\`let\`}</span>{\` i \`}<span className="token operator">{\`=\`}</span>{\` \`}<span className="token number">{\`0\`}</span><span className="token operator">{\`:\`}</span>{\` i \`}<span className="token operator">{\`<\`}</span>{\` \`}<span className="token number">{\`5\`}</span><span className="token punctuation">{\`;\`}</span>{\` i\`}<span className="token operator">{\`++\`}</span><span className="token punctuation">{\`)\`}</span>{\` \`}<span className="token punctuation">{\`{\`}</span>{\`
  \`}<span className="token comment">{\`// do something\`}</span>{\`
\`}<span className="token punctuation">{\`}\`}</span></code></pre>`;

    const markup = jsx(text, "js");
    expect(markup).toEqual(expected);
  });

  it(`hljs - js - no wrapLines - no autolink`, () => {
    const expected = `<pre className="language-javascript hljs"><code className="language-javascript hljs"><span className="hljs-comment">{\`// http://example.com/foo/bar?a=1&b=2#baz\`}</span>{\`
\`}<span className="hljs-keyword">{\`let\`}</span>{\` x = \`}<span className="hljs-number">{\`42\`}</span>{\`;

\`}<span className="hljs-keyword">{\`function\`}</span>{\`* \`}<span className="hljs-title function_">{\`f\`}</span>{\`(\`}<span className="hljs-params" />{\`) {
  \`}<span className="hljs-keyword">{\`yield\`}</span>{\` \`}<span className="hljs-literal">{\`true\`}</span>{\`;
}

\`}<span className="hljs-keyword">{\`for\`}</span>{\` (\`}<span className="hljs-keyword">{\`let\`}</span>{\` i = \`}<span className="hljs-number">{\`0\`}</span>{\`: i < \`}<span className="hljs-number">{\`5\`}</span>{\`; i++) {
  \`}<span className="hljs-comment">{\`// do something\`}</span>{\`
}\`}</code></pre>`;

    const markup = jsx(text, { parsingEngine: "hljs", language: "javascript" });
    expect(markup).toEqual(expected);
  });

  it(`prism - js - wrapLines - autolink`, () => {
    const expected = 
`<pre className="language-javascript prism"><code className="language-javascript prism"><span><span className="token comment">{\`// \`}<a href="http://example.com/foo/bar?a=1&b=2#baz">{\`http://example.com/foo/bar?a=1&b=2#baz\`}</a></span></span><span>{\`
\`}<span className="token keyword">{\`let\`}</span>{\` x \`}<span className="token operator">{\`=\`}</span>{\` \`}<span className="token number">{\`42\`}</span><span className="token punctuation">{\`;\`}</span></span><span>{\`
\`}</span><span>{\`
\`}<span className="token keyword">{\`function\`}</span><span className="token operator">{\`*\`}</span>{\` \`}<span className="token function">{\`f\`}</span><span className="token punctuation">{\`(\`}</span><span className="token punctuation">{\`)\`}</span>{\` \`}<span className="token punctuation">{\`{\`}</span></span><span>{\`
  \`}<span className="token keyword">{\`yield\`}</span>{\` \`}<span className="token boolean">{\`true\`}</span><span className="token punctuation">{\`;\`}</span></span><span>{\`
\`}<span className="token punctuation">{\`}\`}</span></span><span>{\`
\`}</span><span>{\`
\`}<span className="token keyword">{\`for\`}</span>{\` \`}<span className="token punctuation">{\`(\`}</span><span className="token keyword">{\`let\`}</span>{\` i \`}<span className="token operator">{\`=\`}</span>{\` \`}<span className="token number">{\`0\`}</span><span className="token operator">{\`:\`}</span>{\` i \`}<span className="token operator">{\`<\`}</span>{\` \`}<span className="token number">{\`5\`}</span><span className="token punctuation">{\`;\`}</span>{\` i\`}<span className="token operator">{\`++\`}</span><span className="token punctuation">{\`)\`}</span>{\` \`}<span className="token punctuation">{\`{\`}</span></span><span>{\`
  \`}<span className="token comment">{\`// do something\`}</span></span><span>{\`
\`}<span className="token punctuation">{\`}\`}</span></span></code></pre>`

    const markup = jsx(text, { language: "javascript", wrapLines: true, autolink: true });
    expect(markup).toEqual(expected);

  });

  it(`hljs - js - wrapLines - autolink`, () => {
    const expected = 
`<pre className="language-javascript hljs"><code className="language-javascript hljs"><span><span className="hljs-comment">{\`// \`}<a href="http://example.com/foo/bar?a=1&b=2#baz">{\`http://example.com/foo/bar?a=1&b=2#baz\`}</a></span></span><span>{\`
\`}<span className="hljs-keyword">{\`let\`}</span>{\` x = \`}<span className="hljs-number">{\`42\`}</span>{\`;\`}</span><span>{\`
\`}</span><span>{\`
\`}<span className="hljs-keyword">{\`function\`}</span>{\`* \`}<span className="hljs-title function_">{\`f\`}</span>{\`(\`}<span className="hljs-params" />{\`) {\`}</span><span>{\`
  \`}<span className="hljs-keyword">{\`yield\`}</span>{\` \`}<span className="hljs-literal">{\`true\`}</span>{\`;\`}</span><span>{\`
}\`}</span><span>{\`
\`}</span><span>{\`
\`}<span className="hljs-keyword">{\`for\`}</span>{\` (\`}<span className="hljs-keyword">{\`let\`}</span>{\` i = \`}<span className="hljs-number">{\`0\`}</span>{\`: i < \`}<span className="hljs-number">{\`5\`}</span>{\`; i++) {\`}</span><span>{\`
  \`}<span className="hljs-comment">{\`// do something\`}</span></span><span>{\`
}\`}</span></code></pre>`

    const markup = jsx(text, { parsingEngine: 'hljs', language: "javascript", wrapLines: true, autolink: true });
    expect(markup).toEqual(expected);
  });

  it(`prism - js - wrapLines: string - autolink: string`, () => {
    const expected = 
      `<pre className="language-javascript prism"><code className="language-javascript prism"><span className="ml-4 text-lg"><span className="token comment">{\`// \`}<a href="http://example.com/foo/bar?a=1&b=2#baz" className="text-red-500 no-underline">{\`http://example.com/foo/bar?a=1&b=2#baz\`}</a></span></span><span className="ml-4 text-lg">{\`
\`}<span className="token keyword">{\`let\`}</span>{\` x \`}<span className="token operator">{\`=\`}</span>{\` \`}<span className="token number">{\`42\`}</span><span className="token punctuation">{\`;\`}</span></span><span className="ml-4 text-lg">{\`
\`}</span><span className="ml-4 text-lg">{\`
\`}<span className="token keyword">{\`function\`}</span><span className="token operator">{\`*\`}</span>{\` \`}<span className="token function">{\`f\`}</span><span className="token punctuation">{\`(\`}</span><span className="token punctuation">{\`)\`}</span>{\` \`}<span className="token punctuation">{\`{\`}</span></span><span className="ml-4 text-lg">{\`
  \`}<span className="token keyword">{\`yield\`}</span>{\` \`}<span className="token boolean">{\`true\`}</span><span className="token punctuation">{\`;\`}</span></span><span className="ml-4 text-lg">{\`
\`}<span className="token punctuation">{\`}\`}</span></span><span className="ml-4 text-lg">{\`
\`}</span><span className="ml-4 text-lg">{\`
\`}<span className="token keyword">{\`for\`}</span>{\` \`}<span className="token punctuation">{\`(\`}</span><span className="token keyword">{\`let\`}</span>{\` i \`}<span className="token operator">{\`=\`}</span>{\` \`}<span className="token number">{\`0\`}</span><span className="token operator">{\`:\`}</span>{\` i \`}<span className="token operator">{\`<\`}</span>{\` \`}<span className="token number">{\`5\`}</span><span className="token punctuation">{\`;\`}</span>{\` i\`}<span className="token operator">{\`++\`}</span><span className="token punctuation">{\`)\`}</span>{\` \`}<span className="token punctuation">{\`{\`}</span></span><span className="ml-4 text-lg">{\`
  \`}<span className="token comment">{\`// do something\`}</span></span><span className="ml-4 text-lg">{\`
\`}<span className="token punctuation">{\`}\`}</span></span></code></pre>`

    const markup = jsx(text, { language: "javascript", wrapLines: 'ml-4 text-lg', autolink: 'text-red-500 no-underline' });
    expect(markup).toEqual(expected);
  });

  it(`hljs - js - wrapLines - autolink`, () => {
    const expected = 
      `<pre className="language-javascript hljs"><code className="language-javascript hljs"><span className="ml-4 text-lg"><span className="hljs-comment">{\`// \`}<a href="http://example.com/foo/bar?a=1&b=2#baz" className="text-red-500 no-underline">{\`http://example.com/foo/bar?a=1&b=2#baz\`}</a></span></span><span className="ml-4 text-lg">{\`
\`}<span className="hljs-keyword">{\`let\`}</span>{\` x = \`}<span className="hljs-number">{\`42\`}</span>{\`;\`}</span><span className="ml-4 text-lg">{\`
\`}</span><span className="ml-4 text-lg">{\`
\`}<span className="hljs-keyword">{\`function\`}</span>{\`* \`}<span className="hljs-title function_">{\`f\`}</span>{\`(\`}<span className="hljs-params" />{\`) {\`}</span><span className="ml-4 text-lg">{\`
  \`}<span className="hljs-keyword">{\`yield\`}</span>{\` \`}<span className="hljs-literal">{\`true\`}</span>{\`;\`}</span><span className="ml-4 text-lg">{\`
}\`}</span><span className="ml-4 text-lg">{\`
\`}</span><span className="ml-4 text-lg">{\`
\`}<span className="hljs-keyword">{\`for\`}</span>{\` (\`}<span className="hljs-keyword">{\`let\`}</span>{\` i = \`}<span className="hljs-number">{\`0\`}</span>{\`: i < \`}<span className="hljs-number">{\`5\`}</span>{\`; i++) {\`}</span><span className="ml-4 text-lg">{\`
  \`}<span className="hljs-comment">{\`// do something\`}</span></span><span className="ml-4 text-lg">{\`
}\`}</span></code></pre>`

    const markup = jsx(text, { parsingEngine: 'hljs', language: "javascript", wrapLines: 'ml-4 text-lg', autolink: 'text-red-500 no-underline' });
    expect(markup).toEqual(expected);
  });

});
