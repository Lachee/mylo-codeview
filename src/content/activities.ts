import { Editor, PyEditor } from "../lib/editor";
import { getLanguageFromExtension } from "../lib/hljs";
import { extname, findEvaluationEvidenceAssignment, poll as find } from "../lib/utility";

class Interop {
    test() {
        console.log('TEST INTEROP');
    }
}

class ActivityPage {

    private editor: Editor;
    private _observer: MutationObserver;
    private _semaphore: Promise<void> | null = null;
    private _evaluationBox: ShadowRoot | null = null;
    get evaluationBox(): ShadowRoot | null {
        return this._evaluationBox;
    }

    constructor() {
        this._evaluationBox = null;
        this.editor = new Editor();
        this._observer = new MutationObserver(async (details) => {
            if (this._semaphore != null)
                await this._semaphore;

            // Semaphore waits for the code editor
            this._semaphore = (async () => {
                await this.initializeCodeEditor();
            })();
        });
    }

    async init() : Promise<void> {
        await this.install();
        await this.observeEvaluationBox();
    }

    /** disconenects the evaulation box and hte observer */
    disconnectEvaluationBox() {
        this._evaluationBox = null;
        this._observer.disconnect();
    }

    async install() : Promise<void> {
        await Promise.all([
            find<Element>(() => document.head ?? undefined),
            find<Element>(() => document.body ?? undefined),
        ]);

        // Install PyScript
        const pyscriptScriptTag = document.createElement('script');
        pyscriptScriptTag.setAttribute('type', 'module');
        pyscriptScriptTag.setAttribute('name', 'py');
        pyscriptScriptTag.setAttribute('src', 'https://pyscript.net/releases/2024.1.1/core.js');
        document.head.appendChild(pyscriptScriptTag);
        
        const pyscriptStyleTag = document.createElement('link');
        pyscriptStyleTag.setAttribute('rel', 'stylesheet');
        pyscriptStyleTag.setAttribute('href', 'https://pyscript.net/releases/2024.1.1/core.css');
        document.head.appendChild(pyscriptStyleTag);
    }

    /** Looks for the first available evaulation box and attaches an observer */
    async observeEvaluationBox(): Promise<ShadowRoot> {
        this.disconnectEvaluationBox();
        const shadowRoot = await find<ShadowRoot>(() => {
            const box = findEvaluationEvidenceAssignment();
            if (box !== null && box.shadowRoot !== null)
                return box.shadowRoot;
        });

        this._evaluationBox = shadowRoot;
        this._observer.observe(this._evaluationBox, {
            attributes: true,
            childList: true,
            subtree: true
        });

        return shadowRoot;
    }

    /** tries to initialise the code editor */
    async initializeCodeEditor(): Promise<boolean> {
        if (this.evaluationBox == null) {
            //console.log('no evaulation box available');
            return false;
        }

        // Get the shadow root
        const nonvisibleBox = this.evaluationBox.querySelector('d2l-consistent-evaluation-assignments-evidence-non-viewable');
        const shadowRoot = nonvisibleBox?.shadowRoot;
        if (nonvisibleBox == null || shadowRoot == null) {
            //console.log('failed to find the non-visible box');
            return false;
        }

        // Get the url
        const url = nonvisibleBox.getAttribute('download-url');
        const title = nonvisibleBox.getAttribute('title');
        if (title == null || url == null) {
            //console.log('non-visible box does not have a valid url or title', { url, title });
            return false;
        }

        await this.createDownloadButton(shadowRoot, url, title);
        await this.createCodeEditor(shadowRoot, url, title);

        return true;
    }

    /** creates the code editor for the given url */
    async createCodeEditor(frag: DocumentFragment, url: string, title: string) {
        // Get the visible box
        const parent = await find<Element>(() => frag.querySelector('.d2l-consistent-eval-non-viewable') ?? undefined);

        // Get the extension
        const ext = extname(title);
        const lang = getLanguageFromExtension(ext);
        if (lang === undefined) {
            console.log('Cannot display code-preview because the file extension is not allowed', ext);
            return false;
        }

        // Set the default editor
        if (lang.editor == null) {
            console.log('language has no editor: ', lang.name, lang);
            if (lang.name == "Python") {
                lang.editor = new PyEditor();
            } else {
                lang.editor = this.editor;
            }
        }

        // Create the editor
        await lang.editor.create(url, lang, parent);
    }

    /** creates the download button for the given url */
    async createDownloadButton(frag: DocumentFragment, url: string, title: string) {
        // Get the visible top bar
        const topbarRoot = await find<ShadowRoot>(() => frag.querySelector('d2l-consistent-evaluation-assignments-evidence-top-bar')?.shadowRoot ?? undefined);
        const parent = await find<Element>(() => topbarRoot.querySelector('.d2l-consistent-evaluation-assignments-evidence-top-bar') ?? undefined);

        // Check for the button
        if (parent.querySelector('[name=download]') != null)
            return;

        // Create the button
        const d2lButton = document.createElement('d2l-button-subtle');
        d2lButton.setAttribute('name', 'download');
        d2lButton.setAttribute('icon', 'tier1:download');
        d2lButton.setAttribute('text', 'Download');
        d2lButton.setAttribute('type', 'button');
        d2lButton.setAttribute('title', title);
        d2lButton.setAttribute('download-url', url);
        d2lButton.addEventListener('click', () => window.open(url, '_BLANK'));
        parent.appendChild(d2lButton);
    }
}

const page = new ActivityPage();
page.init();