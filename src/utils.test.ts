import * as THREE from "three";
import {
  getDocElem,
  createDocElem,
  minMax,
  surfaceToMesh,
  isMeshEqual,
} from "./utils";
jest.mock("./brainViewer");
import { Surface } from "./brainViewer";

describe("getDocElem", () => {
  it("should return an HTML element when the element with the given id exists", () => {
    document.body.innerHTML = '<div id="test"></div>';
    const elem = getDocElem<HTMLDivElement>("test");
    expect(elem).toBeDefined();
    expect(elem instanceof HTMLDivElement).toBe(true);
  });

  it("should throw an error when the element with the given id does not exist", () => {
    document.body.innerHTML = "";
    expect(() => getDocElem<HTMLDivElement>("test")).toThrowError(
      /Element with id test not found./,
    );
  });
});

describe("createDocElem", () => {
  it("should create an HTML element with the given tag name", () => {
    const elem = createDocElem<HTMLDivElement>("div");
    expect(elem).toBeDefined();
    expect(elem instanceof HTMLDivElement).toBe(true);
  });
});

describe("minMax", () => {
  it("should return the minimum and maximum values of an array of numbers", () => {
    const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
    const result = minMax(arr);
    expect(result).toEqual([1, 9]);
  });

  it("should return undefined for an empty array", () => {
    const result = minMax([]);
    expect(result).toBeUndefined();
  });
});

describe("surfaceToMesh", () => {
  it("should convert a Surface object to a THREE.Mesh object", () => {
    // @ts-expect-error because Surface is mocked.
    const surface = new Surface();
    const mesh = surfaceToMesh(surface);
    expect(mesh).toBeDefined();
    expect(mesh instanceof THREE.Mesh).toBe(true);
  });
});

describe("isMeshEqual", () => {
  it("should return true when two meshes have equal buffer attributes", () => {
    const mesh1 = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshLambertMaterial(),
    );
    const mesh2 = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshLambertMaterial(),
    );
    expect(isMeshEqual(mesh1, mesh2)).toBe(true);
  });

  it("should return false when two meshes have different buffer attributes", () => {
    const mesh1 = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshLambertMaterial(),
    );
    const mesh2 = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshLambertMaterial(),
    );
    mesh1.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3),
    );
    mesh2.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([1, 1, 1]), 3),
    );
    expect(isMeshEqual(mesh1, mesh2)).toBe(false);
  });
});
