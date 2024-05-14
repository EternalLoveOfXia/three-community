<template>
  <div class="box">
    <div class="three-container" id="three-container">
    </div>
    <div class="btns">
      <button @click="toDriverView">司机视角</button>
      <button @click="outDriverView">退出司机视角</button>
    </div>
  </div>
</template>
<script setup>
import * as THREE from 'three';
import gsap from 'gsap'
import modules from './modules/index';
import skyBox from "./modles/skyBox";
import { loadModel, getModelUrl } from '@/utils/tools';
import { onMounted, ref } from 'vue';

import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer';


let viewer = null;

onMounted(() => {
  init();
  addEventListener('mousemove',(e) => {
    const px = e.offsetX;
    const py = e.offsetY;
    const x = (px / window.innerWidth) * 2 - 1;
    const y = -(py / window.innerHeight) * 2 + 1;
    toRaycaster(x,y,viewer.camera)
  })
  addEventListener('click',(e) => {
    const px = e.offsetX;
    const py = e.offsetY;
    const x = (px / window.innerWidth) * 2 - 1;
    const y = -(py / window.innerHeight) * 2 + 1;
    chailou(x,y,viewer.camera)
  })
})
/** 初始化3d场景 */
const init = () =>{
  viewer = new modules.Viewer('three-container')
  viewer.addAxis()
  // 添加环境光
  viewer.lights.addAmbientLight({ intensity: 0.5 })
  viewer.lights.addDirectionalLight([500, 500, 500], { intensity: 2 });
  viewer.scene.add(skyBox)
  loadModel(getModelUrl('city-v1.glb'), cityLoad)
  loadModel(getModelUrl('高楼.gltf'), gaolouLoad)
  loadModel(getModelUrl('zuo.glb'), zuoLoad)
  loadModel(getModelUrl('40.gltf'), ailouLoad)
  loadModel(getModelUrl('lamborghini.glb'), carLoad)
  console.log('viewer', viewer);
}
/**
 * 导入地面模型
 */
const cityLoad = (gltf) => {
  const model = gltf.scene
  model.name = '地面'
  model.scale.set(20, 20, 20)
  viewer.scene.add(model)
}
/**
 * 导入高楼模型
 */
const gaolouLoad = (gltf) => {  
  const models = []; 
  // 模型位置数组，根据需要调整位置 
  const positions = [  
    [-280, 0, -154],  
    [-40.4, 0, -154],  
    [200.4, 0, -154],  
    [440.4, 0, -154],  
    [440.4, 0, -442],  
    [200.4, 0, -442]  
  ];  
  
  const originalModel = gltf.scene.clone(true); // 克隆原始模型，确保不会改变原始gLTF的scene  
  originalModel.scale.set(10, 10, 10);  
  
  for (let i = 0; i < 6; i++) {  
    const model = originalModel.clone();  
    model.name = (i + 1) + '幢';  
    model.position.set(...positions[i]); // 使用扩展运算符设置位置  
  
    // createLabel 函数返回的是一个HTML元素或CSS2DObject  
    const label = createLabel((i + 1) + '幢');  
    // addLabel 函数接受模型和标签作为参数，并返回带有标签的模型  
    const newModel = addLabel(model, label);  
  
    models.push(newModel);  
  }  
  
  // 使用扩展运算符将模型数组添加到场景中  
  viewer.scene.add(...models);  
}
/**
 * 创建label标签
 */
const createLabel = (name)=>{
  const label = document.createElement('div')
  label.className = 'label'
  label.style.background = 'rgba(135, 207, 235, 0.594)'
  label.style.fontSize = '18px'
  label.style.color = '#fff'
  label.style.padding = '5px'
  label.style.borderRadius = '5px'
  label.innerText = name
  return label
}

/**
 * 查看模型的包围盒大小
 */
const getBoxSize = (model) => {
  const box = new THREE.Box3();
  box.expandByObject(model);
  const scale = new THREE.Vector3()
  return box.getSize(scale)
}
/**
 * 给模型添加标注
 */
const addLabel = (model,elementDom) => {
  const label = new CSS3DSprite(elementDom)
  let {x,y,z} = getBoxSize(model)
  label.position.set(model.position.x,y+20, model.position.z)
  gsap.to(label.position,{
    y:label.position.y+10,
    repeat:-1,
    yoyo:true, 
    duration:2,
    ease:'Bounce.inOut'
  })
  gsap.to(label.scale,{
    x:label.scale.x*1.5,
    y:label.scale.y*1.5,
    repeat:-1,
    yoyo:true, 
    duration:2,
    ease:'none'
  })
  const group = new THREE.Group();
  group.add(model,label)
  return group
}


let ailouLeftModel = null
let oldailouLeftModel = null
/**
 * 导入左侧矮楼 
 */
const zuoLoad = (gltf) => {
  ailouLeftModel = gltf.scene
  ailouLeftModel.scale.set(2.4, 2.4, 2.4);
  ailouLeftModel.rotation.y = -Math.PI / 2;
  ailouLeftModel.position.set(-491, 0, 127)
  ailouLeftModel.name = "左侧矮楼"
  oldailouLeftModel =ailouLeftModel.clone();
  viewer.scene.add(ailouLeftModel)
}
/**
 * 导入右侧矮楼
 */
const ailouLoad = (gltf) => {
  const model = gltf.scene
  model.scale.set(9, 9, 9);
  model.rotation.y = -Math.PI/2;
  model.position.set(491, 0, 187)
  model.name = "右侧矮楼"
  // createLabel 函数返回的是一个HTML元素或CSS2DObject  
  const label = createLabel('右侧矮楼');  
  // addLabel 函数接受模型和标签作为参数，并返回带有标签的模型  
  const newModel = addLabel(model, label);  
  viewer.scene.add(newModel)
}

let carModel = null
/**
 *导入汽车
 */
const carLoad = (gltf) => {
  carModel = gltf.scene
  carModel.scale.set(10, 10, 10);
  carModel.rotation.y = Math.PI/2
  carModel.position.set(-870, 0, 682)
  viewer.scene.add(carModel)
  setCarAnimation(carModel)
}
let mixer = null
const setCarAnimation = (model)=>{
  model.name = 'car'
  const times = [0,10,20]
  const values = [-870,0,682,772,0,682,772,0,-868]
  const rotationsY = [Math.PI/2,Math.PI/2,Math.PI,Math.PI]
  const rotationKFY = new THREE.KeyframeTrack('car.rotation[y]',[0,9.9,10.1,20],rotationsY);
  const posKF = new THREE.KeyframeTrack('car.position',times,values);
  const clip = new THREE.AnimationClip('car',20, [posKF,rotationKFY]);
  mixer = new THREE.AnimationMixer(model);
  const clock = new THREE.Clock();
  viewer.addAnimate({
    fun:(mixer) => {
      if(mixer){
        mixer.update(clock.getDelta())
      }
    },
    content:mixer
  })
  const animationAction = mixer.clipAction(clip);
  animationAction.play();
}

let selectModel = ['zuo1', 'zuo2', 'zuo3', 'zuo4', 'zuo5', 'zuoding']
/**
 * 射线检测
 */
const toRaycaster = (x, y, camera) => {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  const intersects = raycaster.intersectObjects([ailouLeftModel]);
  let model = intersects[0]?.object;
  if(model?.parent && model?.parent?.parent && model?.parent?.parent?.name === '左侧矮楼'){
    selectModel.forEach((item)=>{
      if(item === model.parent.name){
        ailouLeftModel.getObjectByName(item).traverse((child)=>{
          if(child.isMesh){
            child.material = new THREE.MeshPhongMaterial({
              color: '#004444',
              transparent: true,
              opacity: 0.5,
              emissive: child.material.color,
              emissiveMap: child.material.map,
              emissiveIntensity: 3
            })
          }
        })
      }else{
        ailouLeftModel.getObjectByName(item).traverse((child)=> {
          if(child.isMesh){
            child.material = oldailouLeftModel.getObjectByName(child.name).material

          }
        })
      }
    })
  }
  else{
    ailouLeftModel.traverse((child)=>{
      if(child.isMesh){
        child.material = oldailouLeftModel.getObjectByName(child.name).material
      }
    })
  }
}

const ischaikai = ref(false)
/**
 * 拆楼
 */
const chailou = (x, y, camera) => {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  const intersects = raycaster.intersectObjects([ailouLeftModel]);
  let model = intersects[0]?.object;
  if(model?.parent && model?.parent?.parent && model?.parent?.parent?.name === '左侧矮楼'){
    if(ischaikai.value){
      ischaikai.value = false;
      selectModel.forEach((item,index)=>{
        gsap.to(ailouLeftModel.getObjectByName(item).position, {
          duration: 1,
          y: ailouLeftModel.getObjectByName(item).position.y -20*index
        })
        gsap.to(viewer.camera.position,{
          x:73.678452221262,
          y:240.50327500728153,
          z:896.2297473365194,
          duration:1
        })
        gsap.to(viewer.controls.target,{
          x:0,
          y:0,
          z:0,
          duration:1
        })
      })
    }
    else{
      ischaikai.value = true;
      selectModel.forEach((item,index)=>{
        gsap.to(ailouLeftModel.getObjectByName(item).position, {
          duration: 1,
          y: ailouLeftModel.getObjectByName(item).position.y +20*index
        })
        gsap.to(viewer.camera.position,{
          x:193.48917162586113,
          y:518.7499055445186,
          z:179.9613371353713,
          duration:1
        })
        gsap.to(viewer.controls.target,{
          x:-334.57394651299967,
          y:132.54477288934277,
          z:141.28423912781986,
          duration:1
        })
      })
    }
  }
}
let carView = {
    fun:()=>{
      viewer.camera.position.set(carModel.position.x, carModel.position.y+10, carModel.position.z)
      let{x,y,z} = getCameraLookAt(carModel.position)
      viewer.controls.target.set(x-3,y,z)
    },
    content:"null"
  }
/**
 * 司机视角
 */
const toDriverView = ()=>{
  console.log('@@',carModel);
  viewer.addAnimate(carView)
}
/**
 * 退出司机视角
 */
const outDriverView = () => {
  viewer.removeAnimate(carView)
  gsap.to(viewer.camera.position, {
    duration: 2,
    x: 500,
    y: 500,
    z: 500
  })
  gsap.to(viewer.controls.target, {
    duration: 2,
    x: 0,
    y: 0,
    z: 0
  })

}

/**
 * 根据当前的三维坐标返回相机对着的位置
 */
const getCameraLookAt = ({x,y,z}) => {
  if(x>=772){
    return {x:772,y:0,z:-868}
  }
  return {x:772,y:0,z:682}
}
</script>
<style lang="scss" scoped>
.box{
  position: relative;
}
.btns{
  position: absolute;
  top: 10px;
  left: 10px;
}
button{
  color: #fff;
  background: skyblue;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px;
  margin: 5px;
}
</style>