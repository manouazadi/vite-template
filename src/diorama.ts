import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF/2.0";
import "@babylonjs/core/Helpers/sceneHelpers";
import * as Cannon from 'cannon'; 

// Create a basic Babylon.js scene
let canvas: HTMLCanvasElement = document.getElementById('3D') as HTMLCanvasElement;
let engine: BABYLON.Engine = new BABYLON.Engine(canvas, true);
let scene: BABYLON.Scene = new BABYLON.Scene(engine);

// Enable physics with Cannon.js
let gravityVector = new BABYLON.Vector3(0,-9.81, 0);
let physicsPlugin = new BABYLON.CannonJSPlugin(true, 10, Cannon);
scene.enablePhysics(gravityVector, physicsPlugin);

// Enable the collision system
scene.collisionsEnabled = true;

// Add an ArcRotateCamera to the scene
let arcRotateCamera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("arcRotateCamera", -Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,0), scene);
arcRotateCamera.attachControl(canvas, true);

// Add a FreeCamera (first-person camera) to the scene
let freeCamera: BABYLON.FreeCamera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 0, -3), scene);
freeCamera.keysUp.push('W'.charCodeAt(0)); // 'W' key
freeCamera.keysDown.push('S'.charCodeAt(0)); // 'S' key
freeCamera.keysLeft.push('A'.charCodeAt(0)); // 'A' key
freeCamera.keysRight.push('D'.charCodeAt(0)); // 'D' key

// Add a light to the scene
let light: BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Set the ArcRotateCamera as the active camera
scene.activeCamera = arcRotateCamera;

// Listen for the 'C' key to switch cameras
window.addEventListener('keydown', (event) => {
    if (event.key === 'C' || event.key === 'c') {
        if (scene.activeCamera === arcRotateCamera) {
            freeCamera.attachControl(canvas, true);
            scene.activeCamera = freeCamera;
        } else {
            arcRotateCamera.attachControl(canvas, true);
            scene.activeCamera = arcRotateCamera;
        }
    }
});

// Load the GLTF model
BABYLON.SceneLoader.ImportMesh("", "/public/", "example.glb", scene, (meshes, particleSystems, skeletons, animationGroups) => {
    // This function will be called after the model is loaded
    console.log("Model loaded");

    // Enable collision detection and physics for all meshes
    for (let mesh of meshes) {
        mesh.checkCollisions = true;
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    }

    // Play all animations
    for (let animationGroup of animationGroups) {
        animationGroup.play(true);
    }
});

// Add SSAO rendering pipeline for ambient occlusion
let ssaoRatio = 0.5;
let ssao = new BABYLON.SSAORenderingPipeline('ssao', scene, ssaoRatio);
scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('ssao', arcRotateCamera);
scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('ssao', freeCamera);

let pipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene, [arcRotateCamera,freeCamera ])
pipeline.samples = engine.getCaps().maxMSAASamples
pipeline.fxaaEnabled = true
pipeline.imageProcessingEnabled = true

scene.autoClear = false
scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

// Render the scene
engine.runRenderLoop(() => {
    scene.render();
});

// Resize the engine when the window is resized
window.addEventListener('resize', () => {
    engine.resize();
});