import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

var canvas, renderer, scene, camera, EarthObj
var deltaX = 0,
    currentDeltaX = 0,
    sceneSize = {
        width: 0,
        height: 0
    },
    mouseData = {
        x: 0,
        xx: 0,
        xxx: 0
    },
    settings = {
        moveStep: {
            x: 0.1,
        },
        aspectRatio: 1.5,
        camera: {
            deep: 10000,
            posY: 10,
            posZ: 425
        }
    },
    model = {
        rotation: {
            y: 0
        }
    }

class App {
    init() {
        canvas = document.getElementById('main3DCanvas');
        const canvasWrapper = document.getElementById('canvasWrapper')
        sceneSize.width = canvasWrapper.getBoundingClientRect().width
        sceneSize.height = sceneSize.width / settings.aspectRatio

        canvas.width = sceneSize.width;
        canvas.height = sceneSize.height;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, sceneSize.width / sceneSize.height, 0.1, settings.camera.deep);
        camera.position.y = settings.camera.posY;
        camera.position.z = settings.camera.posZ;

        camera.rotation.y = Math.PI / 48
        scene.add(camera)

        //lights
        const light = new THREE.AmbientLight(0xffffff, 1.0);
        light.position.set(0, 0, 0);
        scene.add(light);

        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        // renderer.setClearColor( 0x000000, 0 );
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(sceneSize.width, sceneSize.height);

        //obj
        EarthObj = new THREE.Object3D();
        const objLoader = new OBJLoader();
        const gltfLoader = new GLTFLoader();

        const redMaterial = new THREE.MeshBasicMaterial({
            color: 15017491,
            shininess: .75,
            transparent: false,
            emissive: 15017491,
            emissiveIntensity: 1
        });

        const whiteMaterial = new THREE.MeshBasicMaterial({
            color: '#cccccc'
        });

        const blueMaterial = new THREE.MeshBasicMaterial({
            color: '#B4523C',
        });

        const lightRedMaterial = new THREE.MeshBasicMaterial({
            color: '#918B8B',
        });

        // objLoader.setMaterials(materials);
        objLoader.load('./assets/earth__fff.obj', function (object) {
            const scale = 1.8
            object.scale.set(scale, scale, scale);
            object.position.set(0, 0, 0);
            object.rotation.set(0.65, 3.3, 0.3);

            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    console.log(child);
                    child.material.side = THREE.FrontSide;

                    if (child.name === 'Планета') {
                        child.material = whiteMaterial
                    }
                    if (child.name === 'Названия_городов') {
                        child.material = redMaterial
                    }

                    if (child.name === 'Города') {
                        child.material = blueMaterial
                    }
                    if (child.name === 'РФ') {
                        child.material = lightRedMaterial
                    }
                }
            });

            EarthObj.add(object)
        }, (xhr) => {
            const loadedVal = `loaded: ${Math.floor(100.0 * xhr.loaded / xhr.total)}%`;
            console.log(loadedVal);
            document.querySelector('.loader').innerHTML = loadedVal;
        }

        );
        scene.add(EarthObj)

        model.rotation.y = EarthObj.rotation.y

        window.addEventListener('resize', onCanvasResize)

        animate()
    }
}

function onCanvasResize() {
    const canvasWrapper = document.getElementById('canvasWrapper')
    sceneSize.width = canvasWrapper.getBoundingClientRect().width
    sceneSize.height = sceneSize.width / settings.aspectRatio

    canvas.width = sceneSize.width;
    canvas.height = sceneSize.height;

    camera = new THREE.PerspectiveCamera(50, sceneSize.width / sceneSize.height, 0.1, settings.camera.deep);
    camera.position.y = settings.camera.posY;
    camera.position.z = settings.camera.posZ;

    renderer.setSize(sceneSize.width, sceneSize.height);
}

let clicked = false

window.addEventListener('pointerdown', e => clicked = true)


window.addEventListener('pointercancel', e => {
    clicked = false
    // model.rotation.y = EarthObj.rotation.y
    // mouseData.xx = 0

    // mouseData.xxx = mouseData.xx
})
window.addEventListener('pointerup', e => {
    clicked = false
    // model.rotation.y = EarthObj.rotation.y
    // mouseData.xx = 0

    // mouseData.xxx = mouseData.xx

})

window.addEventListener('mousemove', e => {

    let a = sceneSize.width

    if (clicked && e.x < a && e.x > 0) {
        mouseData.xx = (e.x / a) * 2 - 1

        const newDeltaX = Math.sign(e.x - mouseData.x) * settings.moveStep.x

        console.log('mousemovement')
        console.log(e.x)
        console.log(e.clientX)

        mouseData.x = e.x
        // console.log(mouseData.xx)
        deltaX = EarthObj.rotation.x + newDeltaX

        // model.rotation.y = EarthObj.rotation.y
    } else {
        if (model.rotation.y !== EarthObj.rotation.y) {
            model.rotation.y = EarthObj.rotation.y
        }
    }
});

let counter = 0

function animate() {
    const step = 0.05
    const damping = 0.00001
    // for scroll-x rotation

    counter++


    currentDeltaX = currentDeltaX + (deltaX - currentDeltaX)

    // if (clicked) {

    if (Math.abs(deltaX - currentDeltaX) > step) {
        currentDeltaX = currentDeltaX + (deltaX - currentDeltaX) * step
    } else {
        currentDeltaX = currentDeltaX + (deltaX - currentDeltaX) * (deltaX - currentDeltaX) * (deltaX - currentDeltaX) * damping
    }

    // EarthObj.rotation.y = currentDeltaX * Math.PI
    console.log(currentDeltaX)
    // }

    if (clicked) {
        // EarthObj.rotation.y = currentDeltaX * Math.PI

        EarthObj.rotation.y += (mouseData.xx - mouseData.xxx) * (2 * Math.PI / 360) * 0.5
    }

    if (5 == counter) {
        // mouseData.xxx = mouseData.xx

        counter = 0
    }


    // console.log(EarthObj.rotation.y)

    // console.log(mouseData.x)

    // camera.updateMatrixWorld();    
    // camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

export default App;
