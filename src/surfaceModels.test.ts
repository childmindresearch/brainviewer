// d3 seems to have issues in Jest, just mock it.
jest.mock("./colormaps/d3ColorSchemes", () => ({
  ColorInterpolateName: {
    Blues: "Blues",
  },
  colorInterpolates: {
    Blues: () => "#0000FF",
  },
}));

import { SurfaceMesh, MeshColors, Surface } from "./surfaceModels";

describe("SurfaceMesh", () => {
  test("creates a SurfaceMesh instance containing the input vertices and faces", () => {
    const vertices = new Float32Array([0, 0, 0, 1, 1, 1]);
    const faces = new Uint32Array([0, 1, 2]);

    const surfaceMesh = new SurfaceMesh(vertices, faces);

    expect(surfaceMesh.vertices).toEqual(vertices);
    expect(surfaceMesh.faces).toEqual(faces);
  });
});

describe("MeshColors", () => {
  test("creates a MeshColors instance with interpolated colors", () => {
    const intensity = [1, 0];
    const colorMapName = "Blues";
    const colorLimits: [number, number] = [0, 1];
    const expected = new Float32Array([0, 0, 1, 0, 0, 1]);

    const meshColors = new MeshColors(intensity, colorMapName, colorLimits);

    expect(meshColors.colors).toEqual(expected);
  });
});

describe("Surface", () => {
  test("creates a Surface instance consisting of the input mesh and colors", () => {
    const vertices = new Float32Array([0, 0, 0, 1, 1, 1]);
    const faces = new Uint32Array([0, 1, 2]);
    const surfaceMesh = new SurfaceMesh(vertices, faces);
    const intensity = [0.1, 0.9];
    const colorMapName = "Blues";
    const colorLimits: [number, number] = [0, 1];
    const meshColors = new MeshColors(intensity, colorMapName, colorLimits);

    const surface = new Surface(surfaceMesh, meshColors);

    expect(surface.mesh).toEqual(surfaceMesh);
    expect(surface.colors).toEqual(meshColors);
  });
});
