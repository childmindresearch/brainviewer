import * as THREE from "three";
import CameraControls from "camera-controls";
import { Legend } from "./colormaps/legend";
import { Surface } from "./brainViewer";
import { surfaceToMesh } from "./utils";

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

  private legend: Legend;

  public constructor(elemViewer: HTMLElement) {
    this.legend = new Legend();
    this.legend.init();

    this.elemViewer = elemViewer;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.set(-150, 100, -100);

    this.raycaster = new THREE.Raycaster();

    this.renderer = new THREE.WebGLRenderer();
    this.elemViewer.innerHTML = "";
    this.renderer.setSize(
      this.elemViewer.clientWidth,
      this.elemViewer.clientHeight,
    );
    this.elemViewer.appendChild(this.renderer.domElement);

    CameraControls.install({ THREE: THREE });
    this.controls = new CameraControls(this.camera, this.renderer.domElement);
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
      const targetPosition = this.controls.getTarget(new THREE.Vector3());

      directionalLight.position.set(
        cameraPosition.x + (cameraPosition.x - targetPosition.x) * 0.2,
        cameraPosition.y + (cameraPosition.y - targetPosition.y) * 0.2,
        cameraPosition.z + (cameraPosition.z - targetPosition.z) * 4.0,
      );

      this.render();
    };

    animate();
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
      this.elemViewer.clientHeight,
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
    targetName = targetName.toLowerCase();
    let target: THREE.Vector3;
    if (targetName === "origin") {
      target = new THREE.Vector3(0, 0, 0);
    } else if (targetName === "center") {
      const box = new THREE.Box3().setFromObject(this.scene);
      target = box.getCenter(new THREE.Vector3());
    } else {
      console.warn("Unknown orbit point: " + targetName);
      return undefined;
    }
    this.controls.setTarget(target.x, target.y, target.z);
  }

  public addListener(
    eventName: string,
    callable: (
      evt: Event,
      intersects?: THREE.Intersection<THREE.Object3D<THREE.Event>>[],
    ) => void,
  ): void {
    const raycastEvents = [
      "click",
      "dblclick",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
    ] as const;
    const eventNameLower: string = eventName.toLowerCase();

    if (!(raycastEvents as unknown as string[]).includes(eventNameLower)) {
      this.elemViewer.addEventListener(eventNameLower, callable, false);
      return;
    }

    this.elemViewer.addEventListener(
      eventNameLower as (typeof raycastEvents)[number],
      (event: MouseEvent | TouchEvent) => {
        const rect = this.elemViewer.getBoundingClientRect();
        const mice = getClicks(event, rect);

        const intersects = [];
        for (let i = 0; i < mice.length; i++) {
          this.raycaster.setFromCamera(mice[i], this.camera);
          const inter = this.raycaster.intersectObjects(this.getModels());
          intersects.push(inter[0]);
        }
        callable(event, intersects);
      },
    );
  }

  public addModel(surface: Surface): THREE.Mesh {
    const obj = surfaceToMesh(surface);
    this.scene.add(obj);
    return obj;
  }

  public getModels(): THREE.Mesh[] {
    return this.scene.children.filter(
      (child) => child.type === "Mesh",
    ) as THREE.Mesh[];
  }

  public deleteModel(surface: THREE.Mesh): void {
    this.scene.remove(surface);
  }

  public dispose(): void {
    window.removeEventListener("resize", this.onWindowResize);
  }
}

/**
 * Returns an array of normalized mouse/touch coordinates based on the given event and rectangle.
 * @param event - The mouse/touch event.
 * @param rect - The rectangle of the element.
 * @returns An array of normalized mouse coordinates.
 */
function getClicks(event: MouseEvent | TouchEvent, rect: DOMRect) {
  const clicks: THREE.Vector2[] = [];

  if (event instanceof TouchEvent) {
    for (let i = 0; i < event.touches.length; i++) {
      const touch = new THREE.Vector2();
      touch.x = ((event.touches[i].clientX - rect.left) / rect.width) * 2 - 1;
      touch.y = -((event.touches[i].clientY - rect.top) / rect.height) * 2 + 1;
      clicks.push(touch);
    }
  }

  if (event instanceof MouseEvent) {
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    clicks.push(mouse);
  }

  return clicks;
}
