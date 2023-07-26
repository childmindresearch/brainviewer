import * as THREE from "three";
import CameraControls from "camera-controls";
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
    public controls: CameraControls;
    public renderer: THREE.WebGLRenderer;
    
    private elemViewer: HTMLElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private raycaster: THREE.Raycaster;

    private surface: Surface;

    private legend: Legend;

    public constructor(elemViewer: HTMLElement, surface: Surface) {
        this.legend = new Legend();
        this.legend.init();

        this.surface = surface;
        this.elemViewer = elemViewer;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(-150, 100, -100);

        this.raycaster = new THREE.Raycaster();

        this.renderer = new THREE.WebGLRenderer();
        this.elemViewer.innerHTML = "";
        this.renderer.setSize(
            this.elemViewer.clientWidth,
            this.elemViewer.clientHeight
        );
        this.elemViewer.appendChild(this.renderer.domElement);

        CameraControls.install({ THREE: THREE });
        this.controls = new CameraControls(
            this.camera,
            this.renderer.domElement
        );
        this.controls.minZoom = 0.1;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        this.scene.add(directionalLight);

        const clock = new THREE.Clock();

        const animate = () => {
            if (!this.camera) {
                return;
            }

            const delta = clock.getDelta();
            this.controls.update(delta);

            requestAnimationFrame(animate);
            const cameraPosition = this.camera.position;
            const targetPosition = this.controls.getTarget(new THREE.Vector3())

            directionalLight.position.set(
                cameraPosition.x + (cameraPosition.x - targetPosition.x) * 0.2,
                cameraPosition.y + (cameraPosition.y - targetPosition.y) * 0.2,
                cameraPosition.z + (cameraPosition.z - targetPosition.z) * 4.0
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

    public onWindowResize() {
        this.camera.aspect =
            this.elemViewer.clientWidth / this.elemViewer.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(
            this.elemViewer.clientWidth,
            this.elemViewer.clientHeight
        );
        this.render();
    }

    public setBackgroundColor(color: string): void {
        this.renderer.setClearColor(color);
    }

    public setAlpha(alpha: number): void {
        this.renderer.setClearAlpha(alpha);
    }

    public setTarget(targetName: string): undefined {
        targetName = targetName.toLowerCase()
        let target: THREE.Vector3
        if (targetName === "origin") {
            target = new THREE.Vector3(0, 0, 0)
        } else if (targetName === "center") {
            const box = new THREE.Box3().setFromObject(this.scene)
            target = box.getCenter(new THREE.Vector3())
        } else {
            console.warn("Unknown orbit point: " + targetName)
            return undefined
        }
        this.controls.setTarget(target.x, target.y, target.z)
    }

    public addListener(eventName: string, callable: any): void {
        const raycastEvents = ["click", "dblclick", "mousedown", "mouseup"];
        if (!raycastEvents.includes(eventName.toLowerCase())) {
            this.elemViewer.addEventListener(eventName.toLowerCase(), callable, false);
            return;
        }

        this.elemViewer.addEventListener(
            eventName.toLowerCase(),
            (event: any) => {
                const mouse = new THREE.Vector2();
                const rect = this.elemViewer.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                this.raycaster.setFromCamera(mouse, this.camera);

                const intersects = this.raycaster.intersectObjects(
                    this.scene.children.filter(
                        (child) => child.type === "Mesh"
                    )
                );
                event.intersects = intersects[0];
                callable(event)
            }
        );
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
