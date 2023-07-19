import { SurfaceMesh, MeshColors, Surface } from "./brainViewer";
import { ViewerClient } from "./viewer";

export const run = (api_surface: Promise<Response>) => {
  api_surface
    .then((response) => {
      return response.json();
    })
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
        const mesh = new SurfaceMesh(new Float32Array(vertices), new Uint32Array(faces));
        const colors = new MeshColors(Array(10242).fill(1), "Turbo", [0, 1]);
        const surface = new Surface(mesh, colors);
        console.log(surface)
        const client = new ViewerClient(surface);
        client.setModel(surface.mesh, surface.colors);
    });
};
