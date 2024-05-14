import * as THREE from 'three';

export default class AmbientLight{
  constructor(_viewer,option = {color:'rba(255,255,255)'}){
    this._viewer = _viewer;
    this.light = new THREE.AmbientLight(new THREE.Color(option.color));
    this._setOption(option);
    this._viewer.scene.add(this.light);
  }
  
  _setOption(option={}){
    this.light.intensity = option.intensity || 1;
  }
}