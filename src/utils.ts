export function getDocElem<T extends HTMLElement>(id: string) {
    return document.getElementById(id) as T;
}

export function createDocElem<T extends HTMLElement>(tagName: string) {
    return document.createElement(tagName) as T;
}

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

export function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [
              parseInt(result[1], 16) / 255,
              parseInt(result[2], 16) / 255,
              parseInt(result[3], 16) / 255,
          ]
        : [0, 0, 0];
}

export function rgbStrToRgb(rgbStr: string): [number, number, number] {
    const result = rgbStr.substring(4, rgbStr.length - 1);
    return result.split(", ").map((x) => parseInt(x) / 255) as [
        number,
        number,
        number
    ];
}

export function autoToRgb(colorStr: string): [number, number, number] {
    return colorStr.startsWith("#")
        ? hexToRgb(colorStr)
        : rgbStrToRgb(colorStr);
}
