<script lang="ts">
    import {
        SurfaceMesh,
        Surface,
        MeshColors,
    } from "brainviewer/src/brainViewer";
    import { minMax } from "brainviewer/src/utils";
    import { ViewerClient } from "brainviewer/src/viewer";
    import { spectrogram } from "./spectrogram";
    import { afterUpdate, onMount } from "svelte";
    import brainData from "../assets/brain.json";
    import intensityData from "../assets/intensity.json";

    let elemViewer;
    let viewer;

    let client: ViewerClient | undefined;

    class RollingAutoscaler {
        private rollingMin: number;
        private rollingMax: number;
        private scalingFrac: number;

        constructor(
            scalingFrac: number = 0.1,
            startMin: number = 0,
            startMax: number = 1
        ) {
            this.rollingMin = startMin;
            this.rollingMax = startMax;
            this.scalingFrac = scalingFrac;
        }

        public update(value: number): number {
            const x = this.scalingFrac;
            const xi = 1 - this.scalingFrac;

            if (value < this.rollingMin) {
                this.rollingMin = this.rollingMin * x + value * xi;
            } else {
                this.rollingMin = this.rollingMin * xi + value * x;
            }

            if (value > this.rollingMax) {
                this.rollingMax = this.rollingMax * x + value * xi;
            } else {
                this.rollingMax = this.rollingMax * xi + value * x;
            }

            let fraction =
                (value - this.rollingMin) / (this.rollingMax - this.rollingMin);

            return fraction;
        }
    }

    function arrayMean(
        arr: number[],
        start: number = 0,
        stop: number | undefined = undefined
    ): number {
        if (stop === undefined) stop = arr.length;
        else stop = Math.min(stop, arr.length);
        start = Math.max(0, start);
        if (stop <= start) return 0;

        let mean = 0;
        for (let i = start; i < stop; i++) {
            mean += arr[i] * (1 / (stop - start));
        }
        return mean;
    }

    let baseScaler = new RollingAutoscaler(0.01, 0, 255);
    let baseFrac = 0;
    let highScaler = new RollingAutoscaler(0.01, 0, 255);
    let highFrac = 0;

    function callback(data: Uint8Array) {
        if (!client) return;

        let baseMean = arrayMean(Array.from(data), 50, 300);
        baseFrac = baseScaler.update(baseMean) * 0.8 + baseFrac * 0.2;
        
        let highMean = arrayMean(Array.from(data), 300, 1024);
        highFrac = highScaler.update(highMean) * 0.8 + highFrac * 0.2;

        client.controls.zoomTo(baseFrac * 5 + 1);
        client.controls.rotateTo(highFrac * Math.PI + Math.PI,  Math.PI  * 0.5);
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
        client.setOrbit('center');
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
