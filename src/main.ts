import { Editor } from "./editor";
import { Messages } from "./messages";
import { AllowedLanguageFileTypes, extname, findEvaluationEvidenceAssignment, poll } from "./utility";


class Extension {

    private editor: Editor;
    private _observer: MutationObserver;
    private _semaphore : Promise<void>|null = null;
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

    init() {
        console.log('initializing document');
        this.observeEvaluationBox();
    }

    /** disconenects the evaulation box and hte observer */
    disconnectEvaluationBox() {
        this._evaluationBox = null;
        this._observer.disconnect();
    }

    /** Looks for the first available evaulation box and attaches an observer */
    async observeEvaluationBox(): Promise<ShadowRoot> {
        this.disconnectEvaluationBox();
        const shadowRoot = await poll<ShadowRoot>(() => {
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
        const shadowRoot    = nonvisibleBox?.shadowRoot;
        if (nonvisibleBox == null || shadowRoot == null) {
            //console.log('failed to find the non-visible box');
            return false;
        }

        // Get the visible box
        const nonViewableBox = await poll<Element>(() => {
            const nonViewableBox = shadowRoot.querySelector('.d2l-consistent-eval-non-viewable');
            if (nonViewableBox != null) 
                return nonViewableBox;
        });

        // Get the url
        const url = nonvisibleBox.getAttribute('download-url');
        const title = nonvisibleBox.getAttribute('title');
        if (title == null || url == null) {
            //console.log('non-visible box does not have a valid url or title', { url, title });
            return false;
        }

        // Get the extension
        const ext = extname(title);
        /** @ts-ignore this is a weird thing because AllowedLanguageFileTypes is based of a const */
        if (!AllowedLanguageFileTypes.includes(ext)) {
            console.log('Cannot display code-preview because the file extension is not allowed', ext);
            return false;
        }

        // Create the editor
        await this.editor.create(url, nonViewableBox);
        return true;
    }
}

const extension = new Extension();
extension.init();