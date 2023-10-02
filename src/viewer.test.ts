import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { ViewerClient, toFloat32Array, toUint32Array } from "./viewer";

describe("ViewerClient", () => {
  let client: ViewerClient;
  const mockElement = document.createElement("div");

  beforeEach(() => {
    client = new ViewerClient(mockElement);
  });

  afterEach(() => {
    client.dispose();
  });

  test("should be instantiated", () => {
    expect(client).toBeInstanceOf(ViewerClient);
  });

  test("should update clear alpha", () => {
    const alpha = 0.5;
    client.setAlpha(alpha);
    expect(client.renderer.getClearAlpha()).toBe(alpha);
  });
});

describe("Utility functions", () => {
  test("toFloat32Array should convert to Float32Array", () => {
    const input = new Int8Array([1, 2, 3]);

    const result = toFloat32Array(input);

    expect(result).toBeInstanceOf(Float32Array);
    expect(result).toEqual(new Float32Array(input));
  });

  test("toUint32Array should convert to Uint32Array", () => {
    const input = new Float32Array([1, 2, 3]);

    const result = toUint32Array(input);

    expect(result).toBeInstanceOf(Uint32Array);
    expect(result).toEqual(new Uint32Array(input));
  });
});
