import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./resources/draco/gltf/');
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader); 


export const loadModel = (url, onLoad, onLoadProgress = ()=>{}) => {
  // 加载模型  
  loader.load(url,(gltf)=>{
    onLoad(gltf);
  },(xhr)=>{
    onLoadProgress(xhr);
  });  
}



export const getTextureUrl = (name) => {
  return new URL(`../assets/textures/${name}`, import.meta.url).href;
}
export const getModelUrl = (name) => {
  return new URL(`../assets/models/${name}`, import.meta.url).href;
}