import { computeMapColors } from "./colormaps/colormapUtils.js";
import { ColorInterpolateName } from "./colormaps/d3ColorSchemes.js";

export class SurfaceMesh {
    public readonly vertices: Float32Array;
    public readonly faces: Uint32Array;

    constructor(vertices: Float32Array, faces: Uint32Array) {
        this.vertices = vertices;
        this.faces = faces;
    }
}

export class MeshColors {
    public readonly colors: Float32Array;

    constructor( 
        intensity: number[],
        colorMapName: ColorInterpolateName,
        colorLimits: [number, number]
    ) {
        const colors = computeMapColors(intensity, colorMapName, colorLimits);
        this.colors = new Float32Array(colors);
    }
}

export class Surface {
    public mesh: SurfaceMesh;
    public colors: MeshColors;

    constructor(mesh: SurfaceMesh, colors: MeshColors) {
        this.mesh = mesh;
        this.colors = colors;
    }
}
