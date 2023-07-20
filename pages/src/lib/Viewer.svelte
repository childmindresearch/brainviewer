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
          const vertices = json.xCoordinate
            .concat(json.yCoordinate)
            .concat(json.zCoordinate);
          const faces = json.iFaces.concat(json.jFaces).concat(json.kFaces);
          return new SurfaceMesh(
            new Float32Array(vertices, 3),
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
      console.log(surface);
      return new ViewerClient(divUi, divRoot, surface);
    }
    viewer = getViewer();
  });
</script>

<div id="viewer-ui" bind:this={divUi} />
<div id="viewer" bind:this={divRoot} />
<div id="legend" />

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
