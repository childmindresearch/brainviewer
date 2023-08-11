export const mockSurfaceData = {
  mesh: {
    vertices: new Float32Array([0, 1, 2, 3, 4, 5, 6, 7, 8]),
    faces: new Uint32Array([0, 1, 2]),
  },
  colors: {
    colors: new Float32Array([0, 1, 2]),
  },
};

export class Surface {
  public mesh: { vertices: Float32Array; faces: Uint32Array };
  public colors: { colors: Float32Array };

  constructor(
    mesh:
      | { vertices: Float32Array; faces: Uint32Array }
      | undefined = undefined,
    colors: { colors: Float32Array } | undefined = undefined,
  ) {
    this.mesh = mesh || mockSurfaceData.mesh;
    this.colors = colors || mockSurfaceData.colors;
  }
}
