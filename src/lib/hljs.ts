import { LanguageFn } from 'highlight.js';
import hljsAPI from 'highlight.js/lib/core';
export const hljs = hljsAPI;

import c from 'highlight.js/lib/languages/c';
import csharp from 'highlight.js/lib/languages/csharp';
import dart from 'highlight.js/lib/languages/dart';
import java from 'highlight.js/lib/languages/java';
import javaScript from 'highlight.js/lib/languages/javascript';
import kotlin from 'highlight.js/lib/languages/kotlin';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typeScript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';

export type Language = {
    name: string,
    ext: string,
    module: LanguageFn,
    alias?: string[],
    registered?: boolean,
}

// Declare the langauges
export const Languages: Language[] = [
    { name: "C", ext: "c", module: c, alias: [ '.h' ] },
    { name: "C#", ext: "cs", module: csharp, alias: [ 'csharp' ] },
    { name: "Dart", ext: "dart", module: dart },
    { name: "Java", ext: "java", module: java },
    { name: "JavaScript", ext: "js", module: javaScript },
    { name: "Kotlin", ext: "kt", module: kotlin },
    { name: "PHP", ext: "php", module: php },
    { name: "Python", ext: "py", module: python },
    { name: "SQL", ext: "sql", module: sql },
    { name: "Swift", ext: "swift", module: swift },
    { name: "TypeScript", ext: "ts", module: typeScript },
    { name: "JSON", ext: "json", module: json },
];

const _languageExtensionMap : Record<string, Language> = {};

export function getLanguageFromExtension(ext: string): (Language | undefined) {
    if (ext.length == 0)
        return undefined;

    if (ext[0] == '.')
        ext = ext.substring(1);

    ext = ext.toLowerCase();
    if (_languageExtensionMap[ext] !== undefined)
        return _languageExtensionMap[ext];

    for(const language of Languages) {
        if (language.ext === ext)
            return _languageExtensionMap[ext] = language;
    }

    return undefined;
}

export function registerAllLanguages() {
    for(const lang of Languages) 
        registerLanguage(lang);
}

/** Registers a language for use */
export function registerLanguage(lang: Language) {
    if (lang.registered === true) return;

    console.log('registering language', lang);
    const languageName = lang.name.toLowerCase();

    lang.registered = true;
    hljs.registerLanguage(languageName, lang.module);
    
    const aliases = lang.alias ?? [];
    aliases.push(lang.name);
    aliases.push("." + lang.ext);
    hljs.registerAliases(aliases, { languageName });
}