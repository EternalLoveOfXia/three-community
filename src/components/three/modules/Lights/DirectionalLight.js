import * as THREE from 'three'
export default class DirectionalLight {
  constructor(_viewer,position,option){
    this._viewer = _viewer;
    this.light = new THREE.DirectionalLight(new THREE.Color(option.color))
    this._setPosition(position)
    this._setOption(option)
    this._viewer.scene.add(this.light)
  }
  /**
   * 设置灯光位置
   * @param {Object} param0 
   */
  _setPosition([x,y,z]){
    this.light.position.set(x || 0 , y || 0 , z || 0 )
  }
  /**
   * 设置灯光参数
   * @param {Object} option 
   */
  _setOption(option){
    // const light = this.light
    this.light.intensity = option.intensity || 1
    this.light.castShadow = option.castShadow || true
    this.light.shadow.mapSize.width = option.mapSize || 512
    this.light.shadow.mapSize.height = option.mapSize || 512
    // 设置阴影投射方向
    const d = 100
    this.light.shadow.camera.left = -d
    this.light.shadow.camera.right = d
    this.light.shadow.camera.top = d
    this.light.shadow.camera.bottom = -d
    this.light.shadow.bias = -0.0005
    // 设置阴影范围
    this.light.shadow.camera.near = 0.01
    this.light.shadow.camera.far =5000
  }
}