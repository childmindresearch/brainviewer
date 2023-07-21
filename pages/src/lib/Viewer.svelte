<script lang="ts">
    import {
        SurfaceMesh,
        Surface,
        MeshColors,
    } from "brainviewer/src/brainViewer";
    import { minMax } from "brainviewer/src/utils";
    import { ViewerClient } from "brainviewer/src/viewer";
    import { onMount } from "svelte";
    import brainData from "../assets/brain.json";
    import intensityData from "../assets/intensity.json";

    let elemViewer;
    let viewer;

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

        const client = new ViewerClient(elemViewer, surface);
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
