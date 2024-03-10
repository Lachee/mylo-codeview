import { Editor } from "./editor";
import { Messages } from "./messages";
import { AllowedLanguageFileTypes, extname, findEvaluationEvidenceAssignment } from "./utility";


class Extension {

    private editor: Editor;
    private _observer: MutationObserver;
    private _evaluationBox: ShadowRoot | null = null;
    get evaluationBox(): ShadowRoot | null {
        return this._evaluationBox;
    }

    constructor() {
        this._evaluationBox = null;
        this.editor = new Editor();
        this._observer = new MutationObserver((details) => {
            this.initializeCodeEditor();
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
        const shadowRoot = await new Promise<ShadowRoot>((resolve, reject) => {
            const timeout = setInterval(() => {
                const box = findEvaluationEvidenceAssignment();
                if (box !== null && box.shadowRoot != null) {
                    clearInterval(timeout);
                    resolve(box.shadowRoot);
                }
            }, 100);
        });

        console.log('found evaluation box');
        this._evaluationBox = shadowRoot;
        this._observer.observe(this._evaluationBox, { attributes: true, childList: true, subtree: true });

        return shadowRoot;
    }

    /** tries to initialise the code editor */
    async initializeCodeEditor(): Promise<boolean> {
        if (this.evaluationBox == null)
            return false;
        
        const nonvisibleBox = this.evaluationBox.querySelector('d2l-consistent-evaluation-assignments-evidence-non-viewable');
        if (nonvisibleBox == null || nonvisibleBox.shadowRoot == null) 
            return false;

        const nonViewableBox = nonvisibleBox.shadowRoot.querySelector('.d2l-consistent-eval-non-viewable');
        console.log({nonvisibleBox, nonViewableBox});
        if (nonViewableBox == null)
            return false;

        const url = nonvisibleBox.getAttribute('download-url');
        const title = nonvisibleBox.getAttribute('title');
        if (title == null || url == null)
            return false;

        const ext = extname(title);
        /** @ts-ignore this is a weird thing because AllowedLanguageFileTypes is based of a const */
        if (!AllowedLanguageFileTypes.includes(ext))
            return false;

        await this.editor.load(url, nonViewableBox);
        return true;
    }


    onMessage(data: any) {
        if (!('type' in data) && !('data' in data))
            return;
        switch (data.type) {
            default: break;
            case Messages.HistoryStateUpdated:
                this.onHistoryStateUpdated(data.data);
                break;
            case Messages.NavigationCompleted:
                this.onNavigationCompleted(data.data);
                break;
        }
    }
    onHistoryStateUpdated(details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) {
        console.log('on history updated : ', details);
    }
    onNavigationCompleted(details: chrome.webNavigation.WebNavigationFramedCallbackDetails) {
        console.log('on navigation : ', details, findEvaluationEvidenceAssignment());
    }
}

const extension = new Extension();
extension.init();