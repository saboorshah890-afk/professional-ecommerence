export interface ProductModelAsset {
  src: string;
  format: 'glb' | 'gltf';
}

export interface ProductViewerMedia {
  galleryImages?: string[];
  zoomImage?: string;
  zoomEnabled?: boolean;
  simulated3dEnabled?: boolean;
  view360Frames?: string[];
  view360Enabled?: boolean;
  model3d?: ProductModelAsset;
}
