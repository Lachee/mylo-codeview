import { type Language, hljs, registerLanguage, CodeEditor } from './hljs';

//const HLJS_THEME = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css';
const HLJS_THEME_DARK = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.min.css';
const HLJS_THEME_LIGHT = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
const HLJS_THEME = HLJS_THEME_LIGHT;

const ADDITIONAL_STYLE = `
code { text-align: left; font-size: 11pt; line-height: 11pt; }
div.d2l-consistent-eval-non-viewable { justify-content: start; height: calc(100% - 55px); }
.hlsj-container { overflow: auto; }
`;

export class Editor implements CodeEditor {

    url: string = '';
    code: string = '';
    container: Element | null = null;

    _loadedStyle = false;

    constructor() {
    }

    async create(url: string, lang: Language | undefined, parent: Element): Promise<void> {
        if (this.container != null && this.container.isConnected && this.container.getAttribute('data-url') === url) {
            //console.log('cannot create another code view because one already exists', this.container);
            return;
        }

        // Download the code if we havn't done so already
        if (this.url !== url) {
            console.log('downloading and displaying', url);
            this.url = url;
            this.code = await fetch(url).then(r => r.text());
        } else {
            console.log('displaying', url);
        }

        // Create the code preview
        this.createCodeContainer(parent);
        if (this.container != null) {
            let code = this.code;
            if (lang !== undefined) {
                registerLanguage(lang);
                code = hljs.highlight(code, { language: lang.name }).value;
            } else {
                code = hljs.highlightAuto(code).value;
            }

            this.container.innerHTML = `<pre><code class="hljs">${code}</code></pre>`;
        }
    }

    createCodeContainer(parent: Element) {
        parent.innerHTML = '';

        // Add HLJS
        const hljsStyleTag = document.createElement('link');
        hljsStyleTag.setAttribute('rel', 'stylesheet');
        hljsStyleTag.setAttribute('href', HLJS_THEME);
        parent.appendChild(hljsStyleTag);

        const additionalStyleTag = document.createElement('style');
        additionalStyleTag.innerText = ADDITIONAL_STYLE;
        parent.appendChild(additionalStyleTag)

        // Add the editor box
        const container = document.createElement('div');
        container.classList.add('hlsj-container');
        container.setAttribute('data-url', this.url);

        parent.appendChild(container);
        this.container = container;
    }
}

export class PyEditor extends Editor {
    async create(url: string, lang: Language | undefined, parent: Element): Promise<void> {
        await super.create(url, lang, parent);
        if (!this.container) return;

        console.log('appending pyscript');
        this.container.innerHTML += `<script type="py" src="${url}" config="./pyscript.toml" terminal worker></script>`;
    }

    createCodeContainer(parent: Element): void {
        super.createCodeContainer(parent);

        // Add PyScript
        const pyscriptStyleTag = document.createElement('link');
        pyscriptStyleTag.setAttribute('rel', 'stylesheet');
        pyscriptStyleTag.setAttribute('href', 'https://pyscript.net/releases/2024.3.1/core.css');
        parent.appendChild(pyscriptStyleTag);

        const pyscriptScriptTag = document.createElement('script');
        pyscriptScriptTag.setAttribute('type', 'module');
        pyscriptScriptTag.setAttribute('src', 'https://pyscript.net/releases/2024.3.1/core.js');
        parent.appendChild(pyscriptStyleTag);
    }
}