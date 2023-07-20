<script lang="ts">
  import {
    SurfaceMesh,
    Surface,
    MeshColors,
  } from "brainviewer/src/brainViewer";
  import { ViewerClient } from "brainviewer/src/viewer";
  import { onMount } from "svelte";

  let divUi;
  let divRoot;
  let viewer;

  onMount(() => {
    async function getMesh() {
      return await fetch(
        "http://localhost:8000/surfaces/hemispheres?species=human&side=left"
      )
        .then((response) => response.json())
        .then((json) => {
          const vertices: number[] = [];
          const faces: number[] = [];
          for (let i = 0; i < json["xCoordinate"].length; i++) {
            vertices.push(json["xCoordinate"][i]);
            vertices.push(json["yCoordinate"][i]);
            vertices.push(json["zCoordinate"][i]);
          }
          for (let i = 0; i < json["iFaces"].length; i++) {
            faces.push(json["iFaces"][i]);
            faces.push(json["jFaces"][i]);
            faces.push(json["kFaces"][i]);
          }
          return new SurfaceMesh(
            new Float32Array(vertices),
            new Uint32Array(faces)
          );
        })
        .catch((error) => console.log(error));
    }

    async function getData() {
      return new MeshColors(new Array(10242).fill(0), "Oranges", [-1, 1]);
    }

    async function getSurface() {
      const colors = await getData();
      const surface = await getMesh();
      if (surface) {
        return new Surface(surface, colors);
      }
    }

    async function getViewer() {
      const surface = await getSurface();
      const client = new ViewerClient(divUi, divRoot, surface);
      client.setModel(surface.mesh, surface.colors);
    }
    viewer = getViewer();
  });
</script>

<div bind:this={divUi} />
<div bind:this={divRoot} />
<svg id="legend" />

<style>
  :global(#app) {
    height: 100%;
  }
  :global(html) {
    height: 100%;
  }
  :global(body) {
    height: 100%;
    padding: 0;
  }
  :global(legend) {
    position: absolute;
    top: 80px;
    left: 20px;
  }
</style>
