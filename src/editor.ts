import hljs from 'highlight.js/lib/core';

import python from 'highlight.js/lib/languages/python';
hljs.registerLanguage('python', python);
import csharp from 'highlight.js/lib/languages/csharp';
hljs.registerLanguage('csharp', csharp);
import java from 'highlight.js/lib/languages/java';
hljs.registerLanguage('java', java);

const ADDITIONAL_STYLE = `
code { text-align: left; font-size: 11pt; line-height: 11pt; }
.d2l-consistent-eval-non-viewable { justify-content: start !important; }
.hlsj-container { overflow: auto; }
`;


export class Editor {

    url: string = '';
    code : string = '';
    container: Element | null = null;

    _loadedStyle = false;

    constructor() {
    }

    async create(url: string, parent: Element): Promise<void> {
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
        if (this.container != null)
            this.container.innerHTML = `<pre><code class="hljs">${hljs.highlightAuto(this.code).value + hljs.highlightAuto(this.code).value}</code></pre>`;
    }

    createCodeContainer(parent: Element) {
        parent.innerHTML = '';

        // Add HLJS
        const hljsStyleTag = document.createElement('link');
        hljsStyleTag.setAttribute('rel', 'stylesheet');
        hljsStyleTag.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css');
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