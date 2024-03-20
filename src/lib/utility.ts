
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

/**
 * Polls a callback until it returns a non-undefined result
 * @param callback The function to poll a result for. If undefined, then the polling will continue.
 * @param pollRate How often to check for a callback
 * @returns 
 */
export function poll<T>(callback: () => T | undefined, pollRate: number = 150): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const interval = setInterval(() => {
            try {
                console.log('polling...', callback);
                const result = callback();
                if (result !== undefined) {
                    clearInterval(interval);
                    resolve(result);
                }
            } catch (e) {
                console.error('failed to poll: ', e);
                clearInterval(interval);
                reject(e);
            }
        }, pollRate);
    });
}

/**
 * Polls a callback until it returns a non-null result. The callback is run once before polling begins
 * @param callback The function to poll a result for. If undefined, then the polling will continue.
 * @param pollRate How often to check for a callback
 * @returns 
 */
export async function find<T>(callback: () => T | null | undefined, pollRate: number = 150) : Promise<T> {
    const result = callback();
    if (result !== null && result !== undefined) return result;
    return await poll(() => callback() ?? undefined, pollRate);
}

/** raw JS version 
    let container = document.querySelector('d2l-consistent-evaluation');
    container = container.shadowRoot.querySelector('d2l-consistent-evaluation-page');
    container = container.shadowRoot.querySelector('d2l-template-primary-secondary');
    container = container.querySelector('d2l-consistent-evaluation-left-panel');
    container = container.shadowRoot.querySelector('d2l-consistent-evaluation-evidence-assignment');
*/