import * as THREE from "three";
import { Surface } from "./surfaceModels";

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
  let min = max;
  for (let i = 0; i < arr.length; i++) {
    const arrI = arr[i];
    if (max < arrI) {
      max = arrI;
    }
    if (min > arrI) {
      min = arrI;
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
  if (surface.colors) {
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(surface.colors.colors, 3),
    );
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
