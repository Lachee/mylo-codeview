import { type LanguageFn } from 'highlight.js';
import hljs from 'highlight.js/lib/core';

import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import dart from 'highlight.js/lib/languages/dart';
import java from 'highlight.js/lib/languages/java';
import javaScript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typeScript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

export const LINE_STYLE = `
.hljs .line {
    display: inline-block;
    user-select: none;
    pointer-events: none;
    margin-right: 10px;
    padding-right: 0.5em;
    border-right: 1px solid gray;
    color: gray;
    width: 2em;
    text-align: right;
}
`;

// Declare the langauges
const languages = [
    { name: "C", ext: "c", module: c, alias: ['.h'] },
    { name: "C++", ext: "cpp", module: cpp, alias: ['.hpp'] },
    { name: "C#", ext: "cs", module: csharp, alias: ['csharp'] },
    { name: "CSS", ext: "css", module: css },
    { name: "Dart", ext: "dart", module: dart },
    { name: "Java", ext: "java", module: java },
    { name: "JavaScript", ext: "js", module: javaScript },
    { name: "JSON", ext: "json", module: json },
    { name: "Kotlin", ext: "kt", module: kotlin },
    { name: "PHP", ext: "php", module: php },
    { name: "Python", ext: "py", module: python },
    { name: "SQL", ext: "sql", module: sql },
    { name: "Swift", ext: "swift", module: swift },
    { name: "TypeScript", ext: "ts", module: typeScript },
    { name: "XML", ext: "xml", module: xml, alias: ['html', '.html', 'uxml', '.uxml', 'xaml', '.xaml'] }
] as const;

/** Name of a valid language */
export type LanguageName = typeof languages[number]['name'];
/** Programming language data */
export type Language = {
    name: LanguageName,
    ext: Readonly<string>,
    module: Readonly<LanguageFn>,
    alias?: Readonly<string[]>,

    registered?: boolean,
    editor?: CodeEditor,
}

export interface CodeEditor {
    create(url: string, lang: Language | undefined, parent: Element): Promise<void>;
}

/** @ts-ignore we are ignoring the error this throws because it is convient */
const _langauges: Language[] = languages;
/** List of all available languages */
export const Languages = _langauges;

const _languageExtensionMap: Record<string, Language> = {};

/** Gets a language from the given name */
export function getLanguageFromExtension(ext: string): (Language | undefined) {
    if (ext.length == 0)
        return undefined;

    if (ext[0] == '.')
        ext = ext.substring(1);

    ext = ext.toLowerCase();
    if (_languageExtensionMap[ext] !== undefined)
        return _languageExtensionMap[ext];

    for (const language of Languages) {
        if (language.ext === ext)
            return _languageExtensionMap[ext] = language;
    }

    return undefined;
}

/** Registers all the languages for use */
export function registerAllLanguages() {
    for (const lang of Languages)
        registerLanguage(lang);
}

/** Registers a language for use */
export function registerLanguage(lang: Language) {
    if (lang.registered === true) return;

    console.log('registering language', lang);
    const languageName = lang.name.toLowerCase();

    lang.registered = true;
    hljs.registerLanguage(languageName, lang.module as LanguageFn);

    const aliases = lang.alias?.map(v => v) ?? [];
    aliases.push(lang.name);
    aliases.push("." + lang.ext);
    hljs.registerAliases(aliases, { languageName });
}

export function highlight(code: string, language: Language | undefined, lineNumbers: boolean): string {
    if (language != undefined)
        registerLanguage(language);

    // Get the highlighted code
    const highlight = language != undefined
        ? hljs.highlight(code, { language: language.name }).value
        : hljs.highlightAuto(code).value;

    if (!lineNumbers)
        return `<pre><code class="hljs">${highlight}</code></pre>`;

    // Get the line numbers
    let lineHTML = '';
    const lines = highlight.split(/\n/);
    for (let i = 0; i < lines.length; i++)
        lineHTML += `<span class="line">${i + 1}</span>${lines[i]}\n`;
    
    return `<pre><code class="hljs">${lineHTML}</code></pre>`;
    // Combine it all
    //return `<pre><span class="line-numbers">${lineHTML}</span><code class="hljs">${highlight}</code></pre>`;
}