import { PlaneGeometry, Group, MeshNormalMaterial, BoxGeometry, Mesh, ShaderMaterial, BufferAttribute, SphereGeometry, BufferGeometry, ConeGeometry, TorusGeometry } from "three";
import vertexShader from "../shader/vertex.glsl?raw";
import fragmentShader from "../shader/fragment.glsl?raw";
import { CSG } from "three-csg-ts";

import gsap from "gsap";

//https://github.com/samalexander/three-csg-ts
//https://stackblitz.com/edit/three-csg-ts?file=index.ts

export default class Model {
  static get MESH_PARAM() {
    return {
      x: 2,
      y: 2,
      z: 2,
      seg: 10,
    };
  }

  constructor(stage) {
    this.stage = stage;
    this.geometry;
    this.material;
    this.mesh;
    this.group = new Group();
    this.subRes;
    this.isMobile = "ontouchstart" in document.documentElement;
  }

  _init() {
    this.createMesh();
  }

  createMesh() {
    const size = {
      x: 2,
      y: 2,
      z: 2,
    };

    const uniforms = {
      uTime: {
        value: 0.0,
      },
      uProgress: {
        value: 0.0,
      },
      uPower: {
        value: 2.0,
      },
    };
    /////////
    this.geometry = new BoxGeometry(Model.MESH_PARAM.x, Model.MESH_PARAM.y, Model.MESH_PARAM.z);
    this.material = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    this.meshBox = new Mesh(this.geometry, this.material); //①
    this.meshBox.updateMatrix();
    ////////
    this.meshRound = new Mesh(new SphereGeometry(1.2, 50, 50)); //②
    this.meshRound.updateMatrix();
    ///////
    this.subRes = CSG.subtract(this.meshBox, this.meshRound); //① - ②
    this.subRes.position.z = 3;
    this.subRes.position.x = 1.5;
    this.subRes.position.y = -0.5;

    if (this.isMobile) {
      this.subRes.position.z = 2;
      this.subRes.position.x = 1;
      this.subRes.position.y = -0.8;
    }

    //////
    this.stage.scene.add(this.subRes);
    /////
    this.plane = new PlaneGeometry(40, 40);
    this.planeMesh = new Mesh(this.plane, this.material);
    this.planeMesh.position.x = 1.0;
    this.planeMesh.position.z = 0.3;
    this.stage.scene.add(this.planeMesh);
  }

  onUpdata() {
    this.subRes.material.uniforms.uTime.value += 0.005;
    this.subRes.rotation.x += 0.005;
    this.subRes.rotation.y += 0.005;
  }
}
