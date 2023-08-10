import { ColorInterpolateName, colorInterpolates } from "./d3ColorSchemes.js";

function makeInterpolationFun(
  name: ColorInterpolateName,
): (x: number) => [number, number, number] {
  const baseFun = colorInterpolates[name];
  return (x: number) => autoToRgb(baseFun(x));
}

export function computeMapColors(
  map: number[],
  colorMapName: ColorInterpolateName,
  colorLimits: [number, number],
) {
  const interpolationFun = makeInterpolationFun(colorMapName);
  return Array.from(map)
    .map((x) =>
      interpolationFun(
        (x - colorLimits[0]) / (colorLimits[1] - colorLimits[0]),
      ),
    )
    .flat();
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
    number,
  ];
}

export function autoToRgb(colorStr: string): [number, number, number] {
  return colorStr.startsWith("#") ? hexToRgb(colorStr) : rgbStrToRgb(colorStr);
}
