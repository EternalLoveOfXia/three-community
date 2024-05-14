import *as THREE from 'three'
import { getTextureUrl } from '@/utils/tools' 
const textureLoader = new THREE.TextureLoader();
// 创建一个平面
const groundGrometry = new THREE.PlaneGeometry(1000, 1000);

const groundTexture = textureLoader.load(getTextureUrl('地面.jpg'));
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10, 10);

const groundMaterial = new THREE.MeshLambertMaterial({
  map: groundTexture,
  side: THREE.DoubleSide,
})

const grondMesh = new THREE.Mesh(groundGrometry, groundMaterial);
grondMesh.rotation.x = -Math.PI / 2;
grondMesh.position.y = -1

// 设置接收阴影的投影面
grondMesh.receiveShadow = true;

export default grondMesh;