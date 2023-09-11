import { describe, expect, it, vi } from "vitest";

import * as THREE from "three";
import { Surface } from "./models";
import { createDocElem, getDocElem, minMax, surfaceToMesh } from "./utils";

// vitest mocks are explicit
vi.mock("./surfaceModels.js");

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
  it("should convert a Surface object with meshcolors to a THREE.Mesh object", () => {
    // @ts-expect-error because Surface is mocked.
    const surface = new Surface();

    const mesh = surfaceToMesh(surface);

    expect(mesh).toBeDefined();
    expect(mesh instanceof THREE.Mesh).toBe(true);
  });

  it("should convert a Surface object without meshcolors to a THREE.Mesh object", () => {
    // @ts-expect-error because Surface is mocked.
    const surface = new Surface();

    const mesh = surfaceToMesh(surface);

    expect(mesh).toBeDefined();
    expect(mesh instanceof THREE.Mesh).toBe(true);
  });
});
