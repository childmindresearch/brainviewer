<script lang="ts">
    import {
        SurfaceMesh,
        Surface,
        MeshColors,
    } from "brainviewer/src/brainViewer";
    import { minMax } from "brainviewer/src/utils";
    import { ViewerClient } from "brainviewer/src/viewer";
    import { spectrogram } from "./spectrogram";
    import { onMount } from "svelte";
    import brainData from "../assets/brain.json";
    import intensityData from "../assets/intensity.json";

    let elemViewer;
    let viewer;

    let client: ViewerClient | undefined;


    let rollingMin = 0;
    let rollingMax = 255;

    function callback(data: Uint8Array) {
      if (!client) return;


      let mean = 0;
      let num = Math.min(300, data.length);
      for (let i = 20; i < num; i++) {
        mean += data[i] * (1/num);
      }
      
      if (mean < rollingMin) {
        rollingMin = mean;
      } else {
        rollingMin = rollingMin * 0.9 + mean * 0.1;
      }

      if (mean > rollingMax) {
        rollingMax = mean;
      } else {
        rollingMax = rollingMax * 0.9 + mean * 0.1;
      }

      let fraction = (mean - rollingMin) / (rollingMax - rollingMin);

      client.controls.zoomTo(fraction * 3 + 1, true);
    }

    spectrogram(callback);

    onMount(() => {
        const surfaceMesh = new SurfaceMesh(
            new Float32Array(brainData.vertices.flat()),
            new Uint32Array(brainData.faces.flat())
        );

        const colors = new MeshColors(
            intensityData,
            "Viridis",
            minMax(intensityData)
        );

        const surface = new Surface(surfaceMesh, colors);

        client = new ViewerClient(elemViewer, surface);
        client.setModel(surface.mesh, surface.colors);
    });
</script>

<div class="brainViewer" bind:this={elemViewer} />
<svg id="legend" />

<style>
    :global(#app) {
        height: 100%;
        margin: 0;
        padding: 0;
    }
    :global(html) {
        height: 100%;
        margin: 0;
        padding: 0;
    }
    :global(body) {
        height: 100%;
        margin: 0;
        padding: 0;
    }
    :global(legend) {
        position: absolute;
        top: 80px;
        left: 20px;
    }

    .brainViewer {
        height: 100%;
        width: 100%;
    }
</style>
