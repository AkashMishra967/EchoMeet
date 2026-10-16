// Tiny global store that tells the UI when a backend request is taking long
// (usually because the free server is waking up from sleep).

let pending = 0;
let slow = false;
let timer = null;
const listeners = new Set();

const emit = () => listeners.forEach((l) => l());

export const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const getSlow = () => slow;

// call when a request starts
export const requestStarted = () => {
    pending += 1;
    if (pending === 1) {
        // only show the loader if the request is still running after 2.5 seconds
        timer = setTimeout(() => {
            slow = true;
            emit();
        }, 2500);
    }
};

// call when a request finishes (success or error)
export const requestFinished = () => {
    pending = Math.max(0, pending - 1);
    if (pending === 0) {
        clearTimeout(timer);
        timer = null;
        if (slow) {
            slow = false;
            emit();
        }
    }
};