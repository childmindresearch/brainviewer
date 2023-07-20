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

    let divUi;
    let divRoot;
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

        const client = new ViewerClient(divUi, divRoot, surface);
        client.setModel(surface.mesh, surface.colors);
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
