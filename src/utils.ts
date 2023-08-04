import * as THREE from "three";
import { Surface } from "./brainViewer";

export function getDocElem<T extends HTMLElement>(id: string): T {
  const elem = document.getElementById(id);
  if (elem === null) {
    throw new Error(`Element with id ${id} not found.`);
  }
  return document.getElementById(id) as T;
}

export function createDocElem<T extends HTMLElement>(tagName: string) {
  return document.createElement(tagName) as T;
}

/**
 * @param number[] | ArrayLike<number> - array of numbers
 * @returns number[] the minimum and maximum of the array, or undefined if the array is empty.
 */
export function minMax(
  arr: number[] | ArrayLike<number>,
): [number, number] | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  let max = arr[0];
  let min = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (max < arr[i]) {
      max = arr[i];
    }
    if (min > arr[i]) {
      min = arr[i];
    }
  }
  return [min, max];
}

/**
 * Converts a Surface object to a THREE.Mesh object.
 * @param surface - The Surface object to convert.
 * @returns A THREE.Mesh object.
 */
export function surfaceToMesh(surface: Surface): THREE.Mesh {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(surface.mesh.vertices, 3),
  );
  geometry.setIndex(new THREE.BufferAttribute(surface.mesh.faces, 1));
  geometry.computeVertexNormals();

  let material: THREE.MeshLambertMaterial;
  const colors = surface.colors.colors;
  if (colors) {
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    material = new THREE.MeshLambertMaterial({
      vertexColors: true,
    });
  } else {
    material = new THREE.MeshLambertMaterial({
      color: "orange",
      vertexColors: false,
    });
  }

  const obj = new THREE.Mesh(geometry, material);
  obj.rotation.x = -Math.PI / 2;
  return obj;
}

export function isMeshEqual(mesh1: THREE.Mesh, mesh2: THREE.Mesh): boolean {
  return (
    isBufferAttributeEqual(
      mesh1.geometry.attributes.position,
      mesh2.geometry.attributes.position,
    ) &&
    isBufferAttributeEqual(
      mesh1.geometry.attributes.normal,
      mesh2.geometry.attributes.normal,
    ) &&
    isBufferAttributeEqual(
      mesh1.geometry.attributes.color,
      mesh2.geometry.attributes.color,
    ) &&
    isBufferAttributeEqual(mesh1.geometry.index, mesh2.geometry.index)
  );
}
/**
 * Determines whether two buffer attributes are equal.
 * @param attr1 - The first buffer attribute.
 * @param attr2 - The second buffer attribute.
 * @returns True if the buffer attributes are equal, false otherwise.
 */
function isBufferAttributeEqual(
  attr1:
    | THREE.BufferAttribute
    | THREE.InterleavedBufferAttribute
    | undefined
    | null,
  attr2:
    | THREE.BufferAttribute
    | THREE.InterleavedBufferAttribute
    | undefined
    | null,
): boolean {
  if (
    attr1 === undefined ||
    attr2 === undefined ||
    attr1 === null ||
    attr2 === null
  ) {
    return attr1 === attr2;
  }
  if (attr1.count !== attr2.count) {
    return false;
  }
  if (attr1.array.length !== attr2.array.length) {
    return false;
  }
  for (let i = 0; i < attr1.array.length; i++) {
    if (attr1.array[i] !== attr2.array[i]) {
      return false;
    }
  }
  return true;
}
