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
        // Are we already displaying this nonsense?
        if (this.isDisplayingURL(url)) return;

        // Create the preview
        parent.innerHTML = '';
        this.createCodeContainer(parent);
        if (this.container == null) return;

        // Download and display code
        let code = await this.download(url);
        if (lang !== undefined) {
            registerLanguage(lang);
            code = hljs.highlight(code, { language: lang.name }).value;
        } else {
            code = hljs.highlightAuto(code).value;
        }

        this.container.innerHTML = `<pre><code class="hljs">${code}</code></pre>`;
    }

    isDisplayingURL(url: string): boolean {
        return this.container != null && this.container.isConnected && this.container.getAttribute('data-url') === url
    }

    /** downloads the code */
    async download(url: string): Promise<string> {
        // Download the code if we havn't done so already
        if (this.url !== url) {
            console.log('- downloading code at', url);
            this.url = url;
            this.code = await fetch(url).then(r => r.text());
        } else {
            console.log('- using cached code for', url);
        }
        return this.code;
    }

    createCodeContainer(parent: Element) {
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

    popup : HTMLDialogElement|null = null;

    constructor() {
        super();
    }

    async create(url: string, lang: Language | undefined, parent: Element): Promise<void> {
        // Are we already displaying this nonsense?
        if (this.isDisplayingURL(url)) return;

        parent.innerHTML = '';
        this.createCodeContainer(parent);
        if (this.container == null) return;

        // Download and display code
        let formattedCode = await this.download(url);
        if (lang !== undefined) {
            registerLanguage(lang);
            formattedCode = hljs.highlight(this.code, { language: lang.name }).value;
        } else {
            formattedCode = hljs.highlightAuto(this.code).value;
        }

        /** @ts-ignore */
        window.pylog = (...args) => {
            console.log('[PY]', ...args);
        }


        const logger = `<pre id="test" class="pyscript-container"></pre>`;
        const viewer = `<pre><code class="hljs">${formattedCode}</code></pre>`;
        //const runner = `<py-script type="py">print("hello world")</py-script>`;
        //const viewer = '';
        this.container.innerHTML = viewer;

    }

    createCodeContainer(parent: Element): void {
        console.log('create code container with pyscript');

        // Setup the popup
        if (!this.popup) this.popup = document.querySelector('.pyscript-popup');
        if (!this.popup) {
            this.popup = document.createElement('dialog');
            document.body.appendChild(this.popup);
        }
        this.popup.innerHTML = `<button autofocus>Close</button>`;
        this.popup.querySelector('button')?.addEventListener('click', () => {
            if (!this.popup) return;
            this.popup.close(); 
        });

        // The button to open the popup
        const btn = document.createElement('button');
        btn.innerText = "RUN";
        btn.addEventListener('click', () => {
            if (!this.popup) return;
            this.popup.showModal();

            if (!this.popup.querySelector('script[type=py]')) {
                const preamble = `from pyscript import window\ninput = window.prompt\n`;
                
                const runner = document.createElement('script');
                runner.setAttribute('type', 'py');
                runner.setAttribute('terminal', '');
                runner.innerHTML = preamble + this.code;
                this.popup.appendChild(runner);
            }
        });
        parent.appendChild(btn);

        super.createCodeContainer(parent);
    }
}