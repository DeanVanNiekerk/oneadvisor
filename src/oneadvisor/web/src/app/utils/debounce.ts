/**
 * A function that emits a side effect and does not return anything.
 */
export type Procedure = (...args: unknown[]) => void;

export type Options = {
    isImmediate: boolean;
};

export function debounce<F extends Procedure>(
    func: F,
    waitMilliseconds = 50,
    options: Options = {
        isImmediate: false,
    }
): F {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    return function (this: unknown, ...args: unknown[]) {
        const doLater = () => {
            timeoutId = undefined;
            if (!options.isImmediate) {
                func.apply(this, args);
            }
        };

        const shouldCallNow = options.isImmediate && timeoutId === undefined;

        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(doLater, waitMilliseconds);

        if (shouldCallNow) {
            func.apply(this, args);
        }
    } as F;
}
