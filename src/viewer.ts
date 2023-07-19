import * as THREE from "three";
import CameraControls from "camera-controls";
//import Stats from "stats.js";
import { getDocElem } from "./utils";
import { Legend } from "./colormaps/legend";
import { MeshColors, Surface, SurfaceMesh } from "./brainViewer";

export type SerializableViewerState = {
    map?: number[];
    mesh?: {
        vertices: number[];
        faces: number[];
    };
};

export class ViewerClient {
    private viewerRoot: HTMLElement;
    private viewerUi: HTMLElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    private surface: Surface;

    private legend: Legend;

    public constructor(surface: Surface) {
        this.legend = new Legend();
        this.legend.init();

        this.surface = surface;

        this.viewerRoot = getDocElem("viewer");
        this.viewerRoot.innerHTML = "";

        this.viewerUi = getDocElem("viewer-ui");

        // setup scene

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(-150, 100, -100);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(
            this.viewerRoot.clientWidth,
            (this.viewerRoot?.parentElement?.clientHeight || 400) -
                this.viewerUi.getBoundingClientRect().bottom
        );
        this.viewerRoot.appendChild(this.renderer.domElement);

        // eslint-disable-next-line @typescript-eslint/naming-convention
        CameraControls.install({ THREE: THREE });
        const controls = new CameraControls(
            this.camera,
            this.renderer.domElement
        );
        controls.minZoom = 0.1;

        const gridHelper = new THREE.GridHelper(1000, 100);
        this.scene.add(gridHelper);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        this.scene.add(directionalLight);

        //const stats = new Stats();
        //stats.showPanel(0);
        //this.viewerRoot.appendChild(stats.dom);

        const clock = new THREE.Clock();

        const animate = () => {
            if (!this.camera) {
                return;
            }

            //stats.begin();

            const delta = clock.getDelta();
            const hasControlsUpdated = controls.update(delta);

            //stats.end();

            requestAnimationFrame(animate);

            directionalLight.position.set(
                this.camera.position.x + 100,
                this.camera.position.y + 100,
                this.camera.position.z + 100
            );

            this.render();
        };

        animate();

        // Window resize listener

        window.addEventListener("resize", () => this.onWindowResize(), false);
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    private onWindowResize() {
        this.camera.aspect =
            this.viewerRoot.clientWidth /
            ((this.viewerRoot?.parentElement?.clientHeight || 400) -
                this.viewerUi.getBoundingClientRect().bottom);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(
            this.viewerRoot.clientWidth,
            (this.viewerRoot?.parentElement?.clientHeight || 400) -
                this.viewerUi.getBoundingClientRect().bottom
        );
        this.render();
    }

    

    public setModel(
        meshUpdated?: SurfaceMesh,
        mapUpdated?: MeshColors,
    ) {
        if (meshUpdated) {
            this.surface.mesh = meshUpdated;
        }

        if (mapUpdated) {
            this.surface.colors = mapUpdated;
        }

        //const geometry = new THREE.SphereGeometry();
        const geometry = new THREE.BufferGeometry();

        const verts = this.surface.mesh.vertices;

        let material: THREE.MeshLambertMaterial;
        if (this.surface.colors.colors) {

            // cols = [r,g,b,r,g,b,...]

            geometry.setAttribute("color", new THREE.BufferAttribute(this.surface.colors.colors, 3));

            material = new THREE.MeshLambertMaterial({
                vertexColors: true,
            });
        } else {

            material = new THREE.MeshLambertMaterial({
                color: /*new THREE.Color(*/"orange"/*)*/,
                vertexColors: false,
            });

            this.legend.remove();
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(verts, 3));
        geometry.setIndex(new THREE.BufferAttribute(this.surface.mesh.faces, 1));

        geometry.computeVertexNormals();

        const obj = new THREE.Mesh(geometry, material);
        obj.rotation.x = -Math.PI / 2;
        this.scene.add(obj);
    }

    public dispose(): void {
        window.removeEventListener("resize", this.onWindowResize);
    }
}
