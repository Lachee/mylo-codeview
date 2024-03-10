
export class Editor {

    url : string = '';

    constructor(){}

    async reload() : Promise<void> {
        const url = this.url;
        this.url = '';
        return this.load(url);
    }

    async load(url : string) : Promise<void> {
        if (this.url === url) return;
        this.url = url;

        const body = await fetch(url).then(r => r.text());
        console.log(body);
    }
}