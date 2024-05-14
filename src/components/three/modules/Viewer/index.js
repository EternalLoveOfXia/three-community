import {
  Cache,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SRGBColorSpace,
  Color,
  AxesHelper,
 } from "three";
 import Lights from "../Lights";
import {CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer'
import {CSS3DRenderer} from 'three/examples/jsm/renderers/CSS3DRenderer'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
export default class Viewer{
  constructor(id) {
    Cache.enabled = true;
    this.id = id;
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.controls = undefined;
    this.animateEventList = []
    // 调用自身内部方法
    this._initViewer();
  }
  /**
   * 添加坐标系
   */
  addAxis(){
    const axisHelper = new AxesHelper(300);
    this.scene.add(axisHelper);
  }
  _initViewer() {
    // 初始化场景
    this._initScene();
    // 初始化相机
    this._initCamera();
    // 初始化渲染器
    this._initRenderer();
    // 初始化控制器
    this._initControls();
    // 初始化灯光
    this._initLight()
    const that = this;
    // 渲染函数
    function animate() {
      requestAnimationFrame(animate);
      that._updateDom();
      that._renderDom();
      // console.log('this.camera',this.camera.position);
      // 全局的公共动画函数，添加函数可同步执行
      that.animateEventList.forEach(event => {
        event.fun && event.content && event.fun(event.content);
      })
    }
    // 执行渲染函数
    animate();
  }
  addAnimate(animate) {
    console.log('animate',animate);
    this.animateEventList.push(animate)
  }
  removeAnimate(animate) {
    this.animateEventList.map((val, i) => {
      if (val === animate) this.animateEventList.splice(i, 1)
    })
  }

  _initScene(){
    this.scene = new Scene();
    this.scene.background = new Color('rgb(5,24,38)')
  }
  _initCamera(){
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.set(73.678452221262, 240.50327500728153, 896.2297473365194);
    this.camera.lookAt(0, 0, 0);
  }
  _initRenderer(){
    this.viewerDom = document.getElementById(this.id);
    this.renderer = new WebGLRenderer({
      logarithmicDepthBuffer:true,
      antialias: true,
      alpha: true,
      precision:'highp'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //解决加载gltf格式模型颜色偏差问题
    this.renderer.outputColorSpace = SRGBColorSpace;
    // 设置设备像素比
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.viewerDom.appendChild(this.renderer.domElement);

    // 二维标签
    this.css2dRenderer = new CSS2DRenderer();
    this.css2dRenderer.setSize( window.innerWidth, window.innerHeight );
    this.css2dRenderer.domElement.style.position = 'absolute';
    this.css2dRenderer.domElement.style.top = '0px';
    this.css2dRenderer.domElement.style.left = '0px';
    this.css2dRenderer.domElement.style.pointerEvents = 'none';
    this.viewerDom.appendChild( this.css2dRenderer.domElement );
    // 三维标签
    this.css3dRenderer = new CSS3DRenderer();
    this.css3dRenderer.setSize( window.innerWidth, window.innerHeight );
    this.css3dRenderer.domElement.style.position = 'absolute';
    this.css3dRenderer.domElement.style.top = '0px';
    this.css3dRenderer.domElement.style.left = '0px';
    this.css3dRenderer.domElement.style.pointerEvents = 'none';
    this.viewerDom.appendChild( this.css3dRenderer.domElement );
  }
  _initControls(){
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
     // 1.平移 .enablePan
    // this.controls.enablePan = false
    this.controls.minPolarAngle = 0
    this.controls.maxPolarAngle = Math.PI * 0.5
    // this.controls.target.set(772,0,682)
  }
  // 更新Dom
  _updateDom(){
    const that = this;
    console.log('that.camera',that.camera.position);
    that.controls.update();
    that.camera.aspect = that.viewerDom.clientWidth / that.viewerDom.clientHeight;// 摄像机视锥体的长宽比，通常是使用画布的宽/画布的高
    that.camera.updateProjectionMatrix();// 更新摄像机投影矩阵。在任何参数被改变以后必须被调用,来使得这些改变生效
    that.renderer.setSize(that.viewerDom.clientWidth,that.viewerDom.clientHeight)// 设置渲染器的大小
    that.css2dRenderer.setSize(that.viewerDom.clientWidth,that.viewerDom.clientHeight);
    that.css3dRenderer.setSize(that.viewerDom.clientWidth,that.viewerDom.clientHeight);
  }
  // 渲染Dom
  _renderDom(){
    this.renderer.render(this.scene, this.camera);
    this.css2dRenderer.render(this.scene, this.camera);
    this.css3dRenderer.render(this.scene, this.camera);
  }
  _initLight(){
    if(!this.lights) this.lights = new Lights(this)
  }

}
