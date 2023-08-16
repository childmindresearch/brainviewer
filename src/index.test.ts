import * as indexExports from "./index";

// d3 seems to have issues in Jest.
// We don't need it for these tests, so just mock it.
jest.mock("d3", jest.fn());
jest.mock("d3-scale-chromatic", jest.fn());

describe("index.ts", () => {
  const expectedExports = [
    "SurfaceMesh",
    "MeshColors",
    "Surface",
    "minMax",
    "ViewerClient",
    "colorMaps",
    "colorInterpolates",
    "Legend",
  ];

  it("should export the expected exports", () => {
    const actualExports = Object.keys(indexExports);

    expect(actualExports).toEqual(expectedExports);
  });

  it("should export the expected number of exports", () => {
    const actualExports = Object.keys(indexExports);

    expect(actualExports.length).toEqual(expectedExports.length);
  });
});
