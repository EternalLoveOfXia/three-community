import * as THREE from 'three';
// 加载纹理  
const textureLoader = new THREE.CubeTextureLoader();  
const textureCube = textureLoader.setPath('./textures/skybox/') // 设置路径  
    .load([  
        'px.jpg', 'nx.jpg',  
        'py.jpg', 'ny.jpg',  
        'pz.jpg', 'nz.jpg'  
    ]);  
  
// 创建材质  
const shader = THREE.ShaderLib['cube']; // 使用内置的cube着色器  
shader.uniforms['tCube'].value = textureCube; // 应用纹理到着色器  
  
const skyBoxMaterial = new THREE.ShaderMaterial({  
    fragmentShader: shader.fragmentShader,  
    vertexShader: shader.vertexShader,  
    uniforms: shader.uniforms,  
    side: THREE.BackSide // 通常只渲染天空盒的内侧  
});  
  
// 创建几何体  
const geometry = new THREE.BoxGeometry(10000, 100000, 10000); // 设置天空盒的大小  
const skyBox = new THREE.Mesh(geometry, skyBoxMaterial);  
  
export default skyBox;