import { html, highlight } from "../index";

describe(`html(text: string, langOrOptions: string | Options): string`, () => {
  it(`should return empty string if 'text' is empty, null or undefined`, () => {
    expect(html("")).toEqual("");
    expect(html(null)).toEqual("");
    expect(html()).toEqual("");
  });

  it(`should have the same 'default' property as 'highlight'`, () => {
    expect(html.defaults).not.toBeUndefined();
    expect(html.defaults).toBe(highlight.defaults);
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
    const expected = 
`<pre class="language-javascript prism"><code class="language-javascript prism"><span class="token comment">// http://example.com/foo/bar?a=1&b=2#baz</span>
<span class="token keyword">let</span> x <span class="token operator">=</span> <span class="token number">42</span><span class="token punctuation">;</span>

<span class="token keyword">function</span><span class="token operator">*</span> <span class="token function">f</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">yield</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token operator">:</span> i <span class="token operator"><</span> <span class="token number">5</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// do something</span>
<span class="token punctuation">}</span></code></pre>`

    const markup = html(text, { language: "javascript", wrapLines: false, autolink: false });
    expect(markup).toEqual(expected);
  });

  it(`hljs - js - no wrapLines - no autolink`, () => {
    const expected = 
`<pre class="language-javascript hljs"><code class="language-javascript hljs"><span class="hljs-comment">// http://example.com/foo/bar?a=1&b=2#baz</span>
<span class="hljs-keyword">let</span> x = <span class="hljs-number">42</span>;

<span class="hljs-keyword">function</span>* <span class="hljs-title function_">f</span>(<span class="hljs-params" />) {
  <span class="hljs-keyword">yield</span> <span class="hljs-literal">true</span>;
}

<span class="hljs-keyword">for</span> (<span class="hljs-keyword">let</span> i = <span class="hljs-number">0</span>: i < <span class="hljs-number">5</span>; i++) {
  <span class="hljs-comment">// do something</span>
}</code></pre>`

    const markup = html(text, { parsingEngine: 'hljs', language: "javascript", wrapLines: false, autolink: false });
    expect(markup).toEqual(expected);
  });

  it(`prism - js - wrapLines - autolink`, () => {
    const expected = 
`<pre class="language-javascript prism"><code class="language-javascript prism"><span><span class="token comment">// <a href="http://example.com/foo/bar?a=1&b=2#baz">http://example.com/foo/bar?a=1&b=2#baz</a></span></span><span>
<span class="token keyword">let</span> x <span class="token operator">=</span> <span class="token number">42</span><span class="token punctuation">;</span></span><span>
</span><span>
<span class="token keyword">function</span><span class="token operator">*</span> <span class="token function">f</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span><span>
  <span class="token keyword">yield</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span><span>
<span class="token punctuation">}</span></span><span>
</span><span>
<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token operator">:</span> i <span class="token operator"><</span> <span class="token number">5</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span><span>
  <span class="token comment">// do something</span></span><span>
<span class="token punctuation">}</span></span></code></pre>`

    const markup = html(text, { language: "javascript", wrapLines: true, autolink: true });
    expect(markup).toEqual(expected);
  });

  it(`hljs - js - wrapLines - autolink`, () => {
    const expected = 
`<pre class="language-javascript hljs"><code class="language-javascript hljs"><span><span class="hljs-comment">// <a href="http://example.com/foo/bar?a=1&b=2#baz">http://example.com/foo/bar?a=1&b=2#baz</a></span></span><span>
<span class="hljs-keyword">let</span> x = <span class="hljs-number">42</span>;</span><span>
</span><span>
<span class="hljs-keyword">function</span>* <span class="hljs-title function_">f</span>(<span class="hljs-params" />) {</span><span>
  <span class="hljs-keyword">yield</span> <span class="hljs-literal">true</span>;</span><span>
}</span><span>
</span><span>
<span class="hljs-keyword">for</span> (<span class="hljs-keyword">let</span> i = <span class="hljs-number">0</span>: i < <span class="hljs-number">5</span>; i++) {</span><span>
  <span class="hljs-comment">// do something</span></span><span>
}</span></code></pre>`

    const markup = html(text, { parsingEngine: 'hljs', language: "javascript", wrapLines: true, autolink: true });
    expect(markup).toEqual(expected);
  });

  // it(`prism - js - wrapLines: string - autolink: string`, () => {
  //   const expected = 

  //   const markup = html(text, { language: "javascript", wrapLines: 'ml-4 text-lg', autolink: 'text-red-500 no-underline' });
  //   expect(markup).toEqual(expected);
  // });

})
