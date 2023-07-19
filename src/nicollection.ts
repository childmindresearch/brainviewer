import { ColorInterpolateName } from "./d3_color_schemes.js";
import { computeMapColors } from "./color_map_utils.js";

// App state model

export class NiCollection {
    private meshes: NiMesh[];
    private textures: NiTexture[];
    private objects: NiObject[];

    public constructor() {
        this.textures = [];
        this.meshes = [];
        this.objects = [];
    }

    public addMesh(mesh: NiMesh) {
        this.meshes.push(mesh);
        const o = new NiObject();
        o.mesh = mesh;
        o.updateCompat(this.textures);
        this.objects.push(o);
    }

    public addTexture(texture: NiTexture) {
        this.textures.push(texture);
        this.objects.map((o) => o.updateCompat(this.textures));
    }
}

export class NiObject {
    public mesh: NiMesh;
    public texture: NiTexture = null;
    public compatTextures: NiTexture[];
    private active = false;

    public updateCompat(candidates: NiTexture[]) {
        this.compatTextures = candidates.filter((c) => c.compatible(this.mesh));

        if (this.texture === null) {
            this.texture = this.compatTextures?.[0];
        }

        // todo: update current texture if removed
    }

    public activate() {
        this.active = true;
    }

    public deactivate() {
        this.active = false;
    }

    public isActive() {
        return this.active;
    }
}

// Data model

export class NiMesh {
    private readonly vertices: Float32Array;
    private readonly faces: Uint32Array;

    constructor(
        vertices: number[] | ArrayBufferLike,
        faces: number[] | ArrayBufferLike
    ) {
        this.vertices = new Float32Array(vertices);
        this.faces = new Uint32Array(faces);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public packJsonSerialize(): any {
        return [Array.from(this.vertices), Array.from(this.faces)];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static unpackJsonSerialize(obj: any) {
        return new this(obj[0], obj[1]);
    }

    public packWebviewMessage() {
        return [this.vertices.buffer, this.faces.buffer];
    }

    public static unpackWebviewMessage(obj: NiMeshWebviewMessage) {
        return new this(obj[0], obj[1]);
    }

    public numVertices(): number {
        return this.vertices.length;
    }
    public numFaces(): number {
        return this.faces.length;
    }
}

export type NiMeshWebviewMessage = ReturnType<NiMesh["packWebviewMessage"]>;

export class NiTextureSolid {
    private color: number; // 0xffff00

    constructor(color: number) {
        this.color = color;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public serialize(): any {
        return this.color;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static deserialize(obj: any) {
        return new this(obj);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public compatible(_mesh: NiMesh): boolean {
        return true;
    }
}

export class NiTextureVertexMap {
    /** [r,g,b,r,g,b, ...] */
    private colors: Float32Array;

    public static FromMap(map: number[], colorMap: ColorInterpolateName) {
        return new this(computeMapColors(map, colorMap));
    }
    constructor(colors: number[] | ArrayBufferLike) {
        this.colors = new Float32Array(colors);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public packJsonSerialize(): any {
        return Array.from(this.colors);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static unpackJsonSerialize(obj: any) {
        return new this(obj);
    }

    public packWebviewMessage() {
        return this.colors.buffer;
    }

    public static unpackWebviewMessage(obj: NiTextureVertexMapWebviewMessage) {
        return new this(obj);
    }

    public size(): number {
        return this.colors.length;
    }

    public compatible(mesh: NiMesh): boolean {
        return this.colors.length === mesh.numVertices();
    }
}

export type NiTextureVertexMapWebviewMessage = ReturnType<NiTextureVertexMap["packWebviewMessage"]>;

export type NiTexture = NiTextureSolid | NiTextureVertexMap;
