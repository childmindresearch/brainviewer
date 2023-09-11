import { computeMapColors } from "./colormaps/colormapUtils";
import { ColorInterpolateName } from "./colormaps/d3ColorSchemes";

interface SurfaceMeshSettings {
  vertices: Float32Array;
  faces: Uint32Array;
}

interface VertexMapSettings {
  intensity: number[];
  colorLimits: [number, number];
  colorMapName: ColorInterpolateName;
}

/**
 * Represents a surface mesh with vertices and faces.
 */
export class SurfaceMesh {
  private vertices: Float32Array;
  private faces: Uint32Array;

  /**
   * Creates a new SurfaceMesh object.
   * @constructor
   * @param {Float32Array} vertices - The vertices of the surface model.
   * @param {Uint32Array} faces - The faces of the surface model.
   */
  constructor(vertices: Float32Array, faces: Uint32Array) {
    this.vertices = vertices;
    this.faces = faces;
  }

  /**
   * Getter for the data of surface mesh properties.
   * @param propertyName - The name of the property to retrieve.
   * @returns The Float32Array or Uint32Array corresponding to the given property name.
   */
  get(propertyName: "vertices"): Float32Array;
  get(propertyName: "faces"): Uint32Array;
  get(propertyName: "vertices" | "faces") {
    return this[propertyName];
  }

  /**
   * Updates the surface mesh settings with the provided values.
   * @param surfaceMeshSettings - The new surface mesh settings to apply.
   */
  public update(surfaceMeshSettings: Partial<SurfaceMeshSettings>): void {
    this.vertices = surfaceMeshSettings.vertices ?? this.vertices;
    this.faces = surfaceMeshSettings.faces ?? this.faces;
  }
}

export class VertexMap {
  private intensity: number[];
  private colorLimits: [number, number];
  private colorMapName: ColorInterpolateName;
  private colors: Float32Array;

  constructor(
    intensity: number[],
    colorMapName: ColorInterpolateName = "Viridis",
    colorLimits?: [number, number],
  ) {
    this.intensity = intensity;
    if (!colorLimits) {
      colorLimits = [Math.min(...this.intensity), Math.max(...this.intensity)];
    }
    this.colorLimits = colorLimits;
    this.colorMapName = colorMapName;
    this.colors = this.computeColors();
  }

  private computeColors() {
    const colors = computeMapColors(
      this.intensity,
      this.colorMapName,
      this.colorLimits,
    );
    return new Float32Array(colors);
  }

  get(propertyName: "intensity"): number[];
  get(propertyName: "colorLimits"): [number, number];
  get(propertyName: "colorMapName"): ColorInterpolateName;
  get(propertyName: "colors"): Float32Array;
  get(propertyName: "intensity" | "colorLimits" | "colorMapName" | "colors") {
    return this[propertyName];
  }

  public update(settings: Partial<VertexMapSettings>) {
    this.intensity = settings?.intensity ?? this.intensity;
    this.colorLimits = settings?.colorLimits ?? this.colorLimits;
    this.colorMapName = settings?.colorMapName ?? this.colorMapName;
    this.colors = this.computeColors();
  }
}

export class Surface {
  public mesh: SurfaceMesh[];
  public vertexMap: VertexMap[];

  constructor(vertices: Float32Array, faces: Uint32Array) {
    this.mesh = [new SurfaceMesh(vertices, faces)];
    this.vertexMap = [];
  }

  public addVertexMap(
    intensity: number[],
    colorLimits?: [number, number],
    colorMapName?: ColorInterpolateName,
  ) {
    this.vertexMap.push(new VertexMap(intensity, colorLimits, colorMapName));
  }

  public deleteVertexMap(index: number) {
    this.vertexMap.splice(index, 1);
  }
}
