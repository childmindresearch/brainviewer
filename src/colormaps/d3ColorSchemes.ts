/* eslint-disable @typescript-eslint/naming-convention */
import * as d3sc from "d3-scale-chromatic";

/**
 * Generated with:
 * const asd = Object.keys(d3sc)
        .filter((x) => x.startsWith("interpolate"))
        .map((x) => x.substring(11))
        .map((x) => `${x}: d3sc.interpolate${x},`)
        .join("\n");
    console.log(asd);
 */
export const colorInterpolates = {
    Blues: d3sc.interpolateBlues,
    BrBG: d3sc.interpolateBrBG,
    BuGn: d3sc.interpolateBuGn,
    BuPu: d3sc.interpolateBuPu,
    Cividis: d3sc.interpolateCividis,
    Cool: d3sc.interpolateCool,
    CubehelixDefault: d3sc.interpolateCubehelixDefault,
    GnBu: d3sc.interpolateGnBu,
    Greens: d3sc.interpolateGreens,
    Greys: d3sc.interpolateGreys,
    Inferno: d3sc.interpolateInferno,
    Magma: d3sc.interpolateMagma,
    OrRd: d3sc.interpolateOrRd,
    Oranges: d3sc.interpolateOranges,
    PRGn: d3sc.interpolatePRGn,
    PiYG: d3sc.interpolatePiYG,
    Plasma: d3sc.interpolatePlasma,
    PuBu: d3sc.interpolatePuBu,
    PuBuGn: d3sc.interpolatePuBuGn,
    PuOr: d3sc.interpolatePuOr,
    PuRd: d3sc.interpolatePuRd,
    Purples: d3sc.interpolatePurples,
    Rainbow: d3sc.interpolateRainbow,
    RdBu: d3sc.interpolateRdBu,
    RdGy: d3sc.interpolateRdGy,
    RdPu: d3sc.interpolateRdPu,
    RdYlBu: d3sc.interpolateRdYlBu,
    RdYlGn: d3sc.interpolateRdYlGn,
    Reds: d3sc.interpolateReds,
    Sinebow: d3sc.interpolateSinebow,
    Spectral: d3sc.interpolateSpectral,
    Turbo: d3sc.interpolateTurbo,
    Viridis: d3sc.interpolateViridis,
    Warm: d3sc.interpolateWarm,
    YlGn: d3sc.interpolateYlGn,
    YlGnBu: d3sc.interpolateYlGnBu,
    YlOrBr: d3sc.interpolateYlOrBr,
    YlOrRd: d3sc.interpolateYlOrRd,
};

/**
 * Generated with:
 * const asd2 = Object.keys(d3sc)
        .filter((x) => x.startsWith("scheme"))
        .map((x) => x.substring(6))
        .map((x) => `${x}: d3sc.scheme${x},`)
        .join("\n");
    console.log(asd2);
 */
export const colorMaps = {
    Accent: d3sc.schemeAccent,
    Blues: d3sc.schemeBlues,
    BrBG: d3sc.schemeBrBG,
    BuGn: d3sc.schemeBuGn,
    BuPu: d3sc.schemeBuPu,
    Category10: d3sc.schemeCategory10,
    Dark2: d3sc.schemeDark2,
    GnBu: d3sc.schemeGnBu,
    Greens: d3sc.schemeGreens,
    Greys: d3sc.schemeGreys,
    OrRd: d3sc.schemeOrRd,
    Oranges: d3sc.schemeOranges,
    PRGn: d3sc.schemePRGn,
    Paired: d3sc.schemePaired,
    Pastel1: d3sc.schemePastel1,
    Pastel2: d3sc.schemePastel2,
    PiYG: d3sc.schemePiYG,
    PuBu: d3sc.schemePuBu,
    PuBuGn: d3sc.schemePuBuGn,
    PuOr: d3sc.schemePuOr,
    PuRd: d3sc.schemePuRd,
    Purples: d3sc.schemePurples,
    RdBu: d3sc.schemeRdBu,
    RdGy: d3sc.schemeRdGy,
    RdPu: d3sc.schemeRdPu,
    RdYlBu: d3sc.schemeRdYlBu,
    RdYlGn: d3sc.schemeRdYlGn,
    Reds: d3sc.schemeReds,
    Set1: d3sc.schemeSet1,
    Set2: d3sc.schemeSet2,
    Set3: d3sc.schemeSet3,
    Spectral: d3sc.schemeSpectral,
    Tableau10: d3sc.schemeTableau10,
    YlGn: d3sc.schemeYlGn,
    YlGnBu: d3sc.schemeYlGnBu,
    YlOrBr: d3sc.schemeYlOrBr,
    YlOrRd: d3sc.schemeYlOrRd,
};

export type ColorInterpolateName = keyof typeof colorInterpolates;
export type ColorMapName = keyof typeof colorMaps;
