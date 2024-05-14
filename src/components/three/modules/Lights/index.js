import DirectionalLight from './DirectionalLight';
import AmbientLight from './AmbientLight';

export default class Lights {
  constructor(_viewer){
    this._viewer = _viewer;
    this.lightList = [];
  }
  /**
   * 添加平行光
   */
  addDirectionalLight(position = [500,500,500],options = {color:'rgb(255,255,255)'}){
    const light = new DirectionalLight(this._viewer,position,options);
    this.lightList.push(light);
    return light;
  }
  /**
   * 添加环境光
   */
  addAmbientLight(options = {color:'rgb(255,255,255)'}){
    const light = new AmbientLight(this._viewer,options);
    this.lightList.push(light);
    return light;
  }

  /**
   * 移除光源
   */
  removeLight(light){
    this._viewer.scene.remove(light)
  }
}