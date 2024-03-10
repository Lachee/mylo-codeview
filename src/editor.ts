import hljs from 'highlight.js/lib/core';

import python from 'highlight.js/lib/languages/python';
hljs.registerLanguage('python', python);
import csharp from 'highlight.js/lib/languages/csharp';
hljs.registerLanguage('csharp', csharp);
import java from 'highlight.js/lib/languages/java';
hljs.registerLanguage('java', java);

export class Editor {

    url: string = '';
    container: Element | null = null;

    _loadedStyle = false;

    constructor() {
    }

    async reload(): Promise<void> {
        const url = this.url;
        this.url = '';
        return this.load(url, this.container);
    }

    async load(url: string, parent: Element | null): Promise<void> {
        if (this.url === url) return;
        this.url = url;

        console.log('downloading file...', url);
        const body = await fetch(url).then(r => r.text());
        console.log('finished downloading');

        if (parent != null)
            this.createCodeContainer(parent);

        // If we have an editor, insert the highlighted stuff 
        if (this.container != null)
            this.container.innerHTML = `<pre><code class="hljs">${hljs.highlightAuto(body).value}</code></pre>`;
    }

    createCodeContainer(parent: Element) {
        parent.innerHTML = '';

        // Add HLJS
        const hljsStyleTag = document.createElement('link');
        hljsStyleTag.setAttribute('rel', 'stylesheet');
        hljsStyleTag.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css');
        parent.appendChild(hljsStyleTag);

        const additionalStyleTag = document.createElement('style');
        additionalStyleTag.innerText = "code { text-align: left; font-size: 11pt; line-height: 11pt; }";
        parent.appendChild(additionalStyleTag)

        // Add the editor box
        const container = document.createElement('div');
        parent.appendChild(container);
        this.container = container;
    }
}