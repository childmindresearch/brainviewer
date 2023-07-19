import { ColorInterpolateName, colorInterpolates } from "./d3_color_schemes";
import { autoToRgb, minMax } from "./utils";

function makeInterpolationFun(
    name: ColorInterpolateName
): (x: number) => [number, number, number] {
    const baseFun = colorInterpolates[name];
    return (x: number) => autoToRgb(baseFun(x));
}

export function computeMapColors(map: number[], colorMapName: ColorInterpolateName) {
    const [minCol, maxCol] = minMax(map) ?? [0, 0];
    const interpolationFun = makeInterpolationFun(colorMapName);
    return Array.from(map)
        .map((x) => interpolationFun((x - minCol) / (maxCol - minCol)))
        .flat();
}