import { describe, test, expect } from 'vitest'

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

    const meshColors = new MeshColors(intensity, colorMapName, colorLimits);

    // More blue for higher intensity
    expect(meshColors.colors[2]).toBeLessThan(meshColors.colors[5]);
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
