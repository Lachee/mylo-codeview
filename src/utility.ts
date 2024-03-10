export const LanguageFileTypes = {
    Python: 'py',
    CSharp: 'cs',
    Java: 'java',
    C: 'c',
} as const;
export const AllowedLanguageFileTypes = Object.values(LanguageFileTypes);

/**
 * Gets the extension of the given file
 * @param filePath 
 * @returns 
 */
export function extname(filePath: string): string {
    const i = filePath.lastIndexOf('.');
    if (i < 0) return '';
    return filePath.substring(i + 1);
}

export function findEvaluationEvidenceAssignment(): HTMLElement | null {
    let container = document.querySelector<HTMLElement>('d2l-consistent-evaluation');
    if (container == null || container.shadowRoot == null) return null;
    container = container.shadowRoot.querySelector<HTMLElement>('d2l-consistent-evaluation-page');
    if (container == null || container.shadowRoot == null) return null;
    container = container.shadowRoot.querySelector<HTMLElement>('d2l-template-primary-secondary');
    if (container == null || container.shadowRoot == null) return null;
    container = container.querySelector<HTMLElement>('d2l-consistent-evaluation-left-panel');
    if (container == null || container.shadowRoot == null) return null;
    container = container.shadowRoot.querySelector<HTMLElement>('d2l-consistent-evaluation-evidence-assignment');
    return container;
}

/** raw JS version 
    let container = document.querySelector('d2l-consistent-evaluation');
    container = container.shadowRoot.querySelector('d2l-consistent-evaluation-page');
    container = container.shadowRoot.querySelector('d2l-template-primary-secondary');
    container = container.querySelector('d2l-consistent-evaluation-left-panel');
    container = container.shadowRoot.querySelector('d2l-consistent-evaluation-evidence-assignment');
*/