export function getDocElem<T extends HTMLElement>(id: string) {
    return document.getElementById(id) as T;
}

export function createDocElem<T extends HTMLElement>(tagName: string) {
    return document.createElement(tagName) as T;
}

/**
 * @param number[] | ArrayLike<number> - array of numbers 
 * @returns number[] the minimum and maximum of the array, or undefined if the array is empty.
*/
export function minMax(arr: number[] | ArrayLike<number>) {
    if (arr.length === 0) {
        return undefined;
    }
    let max = arr[0];
    let min = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (max < arr[i]) {
            max = arr[i];
        }
        if (min > arr[i]) {
            min = arr[i];
        }
    }
    return [min, max];
}
