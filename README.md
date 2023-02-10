A library for highlighting source code

# Installation and usage
// #TODO 
// clone 
// npm run dev


## How it works
It takes `string` with source code, highlights it and returns in one of the following formats:
- `hast` (see `Types` section)
- `ReactElement` for using inside `React` components
- `JSX` for inlining into React projects
- `HTML` for inlining into html pages

## How it's built
There are two main libraries for highlighting: 
- [Prism.js](https://prismjs.com/) (`prism`) and 
- [Highlight.js](https://highlightjs.org/) (`hljs`)

They give slightly different results, but are very similar. The problem is that they both designed to be inlined inside HTML page as `<script>`. They create global object, query DOM elements and alter them. That's usually not what you want for a React project. 

To alleviate this problem there are two wrapper libraries: 
- [refractor](https://github.com/wooorm/refractor) for `prism` and
- [lowlight](https://github.com/wooorm/lowlight) for `hljs`

They strip original libraries from all DOM bindings and return highlighted result as `hast` object (see `Types` section).

This library uses `refractor` and `lowlight`. It allows to highlight with both `prism` and `hljs` parsing engines and returns something actually useful instead of `hast`. 

## Core module
### Basic usage 
```ts
import { highlight } from './index';

// 'js' is registered by default
const hast = highlight(`var x = 42;`, 'js');


// register a language (see more in 'Languages' section)
import { prism, hljs } from './index';
import prismLua from "refractor/lang/lua";
import hljsLua from "highlight.js/lib/languages/lua";

prism.registerLanguage(prismLua, 'lua');
hljs.registerLanguage(hljsLua, 'lua');

const hast = highlight(text, {
  parsingEngine: 'hljs',
  language: 'lua',
  wrapLines: true,
  autolink: 'text-red no-underline',
  preClass: 'w-1/2',
  codeClass: 'bg-black'
})
```

### Types
`highlight`, `prism.highlight` and `hljs.highlight` return `hast` object, which is simplified model of element tree. See https://github.com/syntax-tree/hast.

At the root of a `hast` tree there is `HastRoot` and it can have nested array of `HastElement` and `Text` objects inside. Here is how approximately they look:
```ts
type HastRoot = {
  type: 'root'
  children: Array<HastElement | Text>
}

type HastElement = {
  type: 'element'
  tagName: string  // 'div', 'a', ...
  properties?: {
    [prop: string]: boolean | number | string | null | undefined | Array<string | number>;
  }
  children: Array<HastElement | Text>
}

type Text = {
  type: 'text'
  value: string
}
```

### `highlight` function
Return `hast` tree (see `Types` section) of following form: `<pre><code> highlighted elements here </code></pre>`. 
If `text` is empty, `undefined` or `null` return `null`.

```ts
function highlight(
  /* your souce code to be highlighted */
  text: string,

  /* name of a language or Options object */
  languageOrOptions: string | Options = {} as Options
): HastRoot | null 


type Options = {
  parsingEngine?: "prism" | "hljs"; // default 'prism'
  language?: string;                // default 'text'

  /* whether to use WrapLines plugin (see Plugins section)
   * can be a string with class names,
   * which will be applied on every line 
   */
  wrapLines?: boolean | ClassName;  // default false

  /* whether to use Autolink plugin (see Plugins section)
   * can be a string with class names,
   * which will be applied on every line 
   */
  autolink?: boolean | ClassName;   // default false

  /* class names to be applied ot <pre> element at the top */
  preClass?: ClassName;             // default ''
  
  /* class names to be applied ot <code> element at the top */
  codeClass?: ClassName;            // default ''
};
```

#### `highlight.defaults`
With `highlight.defaults` you can set default Options for all `highlight` calls. `defaults.reset()` will reset to initial defaults.
```ts
highlight.defaults.parsingEngine = 'hljs';
highlight.defaults.reset(); // now `parsingEngine` is 'prism' again
```

### Languages
Before you use a language with a particular parsing engine you must register it.
Both `prism` and `hljs` have pre-registered languages: `html`, `css`, `js`. So they can be used without registration: `highlight('var x = 10', 'js')`.

A language (or `Syntax` to be precise) in both libraries is a `js` function, which adds new grammar to an engine. 

#### Registering `prism` language
For `prism` we register languages from `refractor` library. They are identical to the original languages, but are unbinded from DOM. 

```ts
import { prism } from './index';
import rust from "refractor/lang/rust";

// language name may be ommitted 
// because Prism languages have names inside them
prism.registerLanguage(rust)  

// or you can provide aliases
prism.registerLanguage(rust, 'rs') 

// use alias
highlight(text, 'rs')
```

#### Registering `hljs` language
For `hljs` we register languages right from `highlight.js` library.
```ts
import { hljs } from './index';
import rust from "highlight.js/lib/languages/rust";

// here one name is required, but 
// you can also provide aliases
hljs.registerLanguage(rust, 'rust', 'rs');

// provide Options object, because the default 
// parsing engine is `prism`
highlight(text, ( parsingEngine: 'hljs', language: 'rs' ))
```

### `prism` object
Both `prism` and `hljs` objects have almost identical API. The only differnce in `registerLanguage` function (see '`hljs` object' section).

```ts
type RefactorSyntax = ((prism: unknown) => void) & {
  displayName: string
  aliases?: string[] | undefined
}

const prism = {
  // make actual highlighting; called in main `highlight` function
  highlight(
    text: string, 
    language: string
  ): HastRoot | null,

  registerLanguage(
    syntax: RefractorSyntax, 
    ...aliases: string[]
  ): void,

  registered(aliasOrLanguage: string): boolean,
  
  listLanguages(): Array<string>,

  displayName: "prism"
};
```

### `hljs` object
```ts
const hljs = {
  highlight(
    text: string, 
    language: string
  ): HastRoot | null,

  // in hljs 'name' is required; 
  // that's the only difference from `prism`
  registerLanguage(
    syntax: RefractorSyntax, 
    name: string,             // <- required
    ...aliases: string[]
  ): void,

  registered(aliasOrLanguage: string): boolean,
  
  listLanguages(): Array<string>,

  displayName: "prism"
};
```

## `react` module
### Signature
Has the same arguments as `highlight` function (see '`highlight` function' section), but return `ReactElement` instead of `hast`.
Can be used inside `React` components or hooks.

```ts
function react(
  text: string,
  languageOrOptions: string | Options = {} as Options
): ReactElement | null 
```

### Usage
```ts
import { react } from './index';

const text = 
`.foo {
  color: red;
  font-size: 1rem;
}`

const Higlighted = () => <div>{react(text, 'css')}</div>;

// or even
const Higlighted = () => react(text, 'css');
```

## `jsx` module
Has the same arguments as `highlight` function (see '`highlight` function' section), but return `string` with `JSX` markup (`className` instead of `class`).
Such markup can be inlined in React project.

// #TODO: add link to the Syntax Highlight Generator

### Signature
```ts
export default function toJsx(
  text: string,
  languageOrOptions: string | Options = {} as Options
): string {
```

## Plugins
### `WrapLines` plugin
Wrap each line in `<span>`. Lines can be styled with `wrapLines` property of `Options` object passed to `highlight`, `react` or `jsx` function.
> [!IMPORTANT] 
> This plugin only groups element. If a parsing engine creates
> an element, which already includes multiple lines, 
> the plugin will not split it!

#### Usage
```ts
import { react } from './index';

const element = react(text, {
  language: 'js',
  
  // don't wrap lines
  wrapLines: false

  // wrap lines without styling
  wrapLines: true

  // wrap lines and assign provided classes to each `<span>`
  wrapLines: 'ml-4 text-lg'
})
```

### `Autolink` plugin
Turn all URLs, emails and phone numbers into `<a>` (see [Autolink Prism plugin](https://prismjs.com/plugins/autolinker)).

#### Usage
```ts
import { jsx } from './index';

const markup = jsx(text, {
  language: 'js',
  
  // don't autolink
  autolink: false

  // autolink without styling
  autolink: true

  // autolink and assign provided classes to every resulting `<a>`
  autolink: 'text-indigo-500 no-underline',
})
```

## Themes 
There are two options for styling parsed code:
- use themes from `prism.js` / `highlight.js` directly
- use themes from this library: `themes/prism` / `themes/hljs`
  They are identical to the originals with few exceptions:
  - each theme is wrapped in `@layer` CSS directive, so it has lowest specificity and can be overriden by utility classes
  - some CSS rules in `prism` themes are additionally scoped with `.prism` class so they don't clash with `hljs` theme when used at the same time:
```css
// https://github.com/PrismJS/prism/blob/master/themes/prism.css
code[class*="language-"],
pre[class*="language-"] {
	color: black;
     ...


// ./themes/prism/default.css
@layer prism-theme {
  code.prism[class*="language-"],
  pre.prism[class*="language-"] {
    color: black;
     ...
```
