import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 150);
camera.position.z = 0;
camera.lookAt(0, 0, -10000);
scene.add(camera);


//Game Controller Integration
let controllerIndex = null;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

//Game Pad Connection
window.addEventListener("gamepadconnected", (event) => {
    const gamepad = event.gamepad;
    controllerIndex = gamepad.index;
    console.log("connected");
});

//Game Pad Disconnection
window.addEventListener("gamepaddisconnected", (event) => {
    controllerIndex = null;
    console.log("disconnected");
});

//Button Detector
function handleButtons(buttons) {
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const buttonElement = document.getElementById(`controller-b${i}`);
        //console.log(buttonElement);
    }
}

//Controller Input
let leftRightValue;
let upDownValue;
function controllerInput() {
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];

        const buttons = gamepad.buttons;
        upPressed = buttons[12].pressed;
        downPressed = buttons[13].pressed;
        leftPressed = buttons[14].pressed;
        rightPressed = buttons[15].pressed;

        const stickDeadZone = 0.2;
        leftRightValue = gamepad.axes[2];
        //console.log(leftRightValue);

        if (leftRightValue >= stickDeadZone) {
            rightPressed = true;
            //console.log(leftRightValue);
        } else if (leftRightValue <= -stickDeadZone) {
            leftPressed = true;
            //console.log(leftRightValue);
        }

        upDownValue = gamepad.axes[1];

        if (upDownValue >= stickDeadZone) {
            downPressed = true;
            //console.log(upDownValue);
        } else if (upDownValue <= -stickDeadZone) {
            upPressed = true;
            //console.log(upDownValue);
        }
    }
}






var yearsTraveled = 0;
var HUDtext = "Years Traveled: " + yearsTraveled;

const renderer = new THREE.WebGLRenderer({ antialias: true, });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

document.body.appendChild(renderer.domElement);

//Star creation
const starGeometry = new THREE.SphereGeometry(0.01);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

//10000 stars
const stars = [];


for (let i = 0; i < 10000; i++) {
    stars[i] = new THREE.Mesh(starGeometry, starMaterial);

    stars[i].position.x = THREE.MathUtils.randFloatSpread(-20, 20);
    stars[i].position.y = THREE.MathUtils.randFloatSpread(-20, 20);
    stars[i].position.z = THREE.MathUtils.randFloat(100, -1000);
    //console.log(stars[i].position.z); -- DEBUG

    scene.add(stars[i]);
}


//const controls = new OrbitControls(camera, renderer.domElement);
//controls.enableDamping = true;
//controls.autoRotate = true;

const ambient = new THREE.AmbientLight();
scene.add(ambient);

// movement - please calibrate these values
var ySpeed = 0.2; //Every 1.0 move is 1000 years


//Text Attributes
let text = 'three.js',
    bevelEnabled = true;



const height = 0.01,
    size = 0.25,
    hover = 30,

    curveSegments = 4,

    bevelThickness = 0.01,
    bevelSize = .01;
bevelEnabled = true;

//Font
const loader = new FontLoader();
const font = loader.load(
    //resource URL
    'Assets/Fonts/helvetiker_regular.typeface.json',

    //onLoad callback
    function (font) {
        //do something with the font
        console.log(font);

        textGeneration(font);


    },

    //onProgress callback
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    //onError callback
    function (err) {
        console.log('An error happened');
    }
);

//creates global version of model
var Kepler186f;
var movementYearMultiplier = 200.0;
var k186ZPosition = (985492.0 / ((1 / ySpeed) * movementYearMultiplier));

console.log(k186ZPosition);
//load model
new GLTFLoader()
    .load('Assets/Planets/kepler-186f/kepler_186f-v1.glb',
        function (kepler186) {
            kepler186.scene.scale.set(1, 1, 1);
            Kepler186f = kepler186.scene.getObjectByName('Scene');
            kepler186.scene.position.set(-1.5, 0, -k186ZPosition);
            kepler186.scene.rotation.y = Math.PI / 2;

            const model = kepler186.scene.children[0];
            model.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            })

            scene.add(kepler186.scene);
            //How to catch other meshes of model

        }
    );
;

function rotatePlanets() {
    kepler186f.scene.rotation.y += 10;

}


const light = new THREE.PointLight(0xff0000, 1, 100);
light.position.set(-2, 2, 8);
//scene.add(light);

const light2 = new THREE.AmbientLight(0xffffff, 0.2);
//scene.add(light2);


//Text Materials
let materials;

//Materials For Text
materials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
];

//Text
let HUDYearsGeo;
let HUDK186Geo;
let yearsGeo;
let years;
let K186textGeo;
let K186text;


//add text HUDs
HUDYearsGeo = new THREE.Group();
HUDK186Geo = new THREE.Group();

//All Text Generations
function textGeneration(font) {


    //Question Text
    yearsGeo = new TextGeometry(
        HUDtext, {

        font: font,

        size: size / 7,
        height: height / 8,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness / 8,
        bevelSize: bevelSize / 8,
        //bevelEnabled: bevelEnabled / 8,

    }).center();

    //Text Object Creation
    years = new THREE.Mesh(yearsGeo, materials);
    years.position.x = 0;
    years.position.y = 0;
    years.position.z = -1;

    //Add to hud
    HUDYearsGeo.add(years);


    //KEPLER 186f
    K186textGeo = new TextGeometry(
        `Discovered on April 17, 2014, by Elisa Quintana, Kepler-186f
is a distant world in the Cygnus constellation, approximately
580 light-years away. Its size, about 1.44 times Earth's mass
and 1.17 times its radius, suggests potential habitability.
With an equilibrium temperature around -85°C (-121°F),
Kepler-186f offers an Earth-like but colder environment.
Though its atmosphere remains a mystery, scientists speculate
about its ability to sustain life. Despite the distance and
time—nearly 985,492 years at 395,000 mph—Kepler-186f beckons
as a beacon of exploration, inviting humanity to unravel its
secrets and ponder the vastness of the cosmos.`, {

        font: font,

        size: size / 7,
        height: height / 8,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness / 8,
        bevelSize: bevelSize / 8,
        //bevelEnabled: bevelEnabled / 8,

    }).center();

    //Text Object Creation
    K186text = new THREE.Mesh(K186textGeo, materials);
    K186text.position.x = -0.88;
    K186text.position.y = -0.6;
    K186text.position.z = -1;

    //Add Box to hud
    // HUDK186Geo.add(k186box);

    //Add to hud
    HUDK186Geo.add(K186text);


}

HUDYearsGeo.position.set(1.1, 0.65, 0);
HUDK186Geo.position.set(1.5, 0.65, 0);

camera.add(HUDYearsGeo);

//HUD Boxes
const k186BoxGeo = new THREE.BoxGeometry(1.85, .8, 0.01);
const k186BoxMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
const k186box = new THREE.Mesh(k186BoxGeo, k186BoxMat);
k186box.position.x = -0.775;
k186box.position.y = -0.6;
k186box.position.z = -1;
HUDK186Geo.add(k186box);


var testYears;
var testYearsGeo;

function updateYears() {

}

//For Controller
function moveCamera() {
    if (upPressed) { //between -1 and 0
        camera.position.z += (0.5 * upDownValue * ySpeed);
        if (yearsTraveled < 0) {
            yearsTraveled = 0;
        }
        if (yearsTraveled >= 0) {
            yearsTraveled += Math.abs((0.5 * upDownValue * movementYearMultiplier));
            HUDtext = "Years Traveled: " + Math.round(yearsTraveled);
        }

        console.log(HUDtext);
        console.log(camera.position.z);
    }
    if (downPressed) { //between 0 and 1
        camera.position.z += (0.5 * upDownValue * ySpeed);
        if (yearsTraveled < 0) {
            yearsTraveled = 0;
        }
        if (yearsTraveled >= 0) {
            yearsTraveled -= Math.abs((0.5 * upDownValue * movementYearMultiplier));
            HUDtext = "Years Traveled: " + Math.round(yearsTraveled);
        }

        console.log(HUDtext);
        console.log(camera.position.z);
    }
    if (leftPressed) {
        // -= Math.abs((leftRightValue * rotationSpeed));
    }
    if (rightPressed) {
        //cube.rotation.y += (leftRightValue * rotationSpeed);
    }
    /*  These are all using the axes value paired with the rotationSpeed as a multiplier to create variable speeds based off input.
        Absolute value is added so direction can reverse (Rules of Math for adding and subtracting positive and negative integers).*/


    if (font) {
        textGeneration(font);
    }

    //Kepler-186f HUD
    if (yearsTraveled > 983000 && yearsTraveled < 985000) {
        if (camera.getObjectByName(HUDK186Geo) == null) {
            camera.add(HUDK186Geo);
            //console.log('K186f text has been added');
        }
    }
    if (yearsTraveled < 983000 || yearsTraveled > 985000) {
        //if (camera.getObjectByName(HUDK186Geo) != null) {
        camera.remove(HUDK186Geo);
        //console.log('K186f text has been removed');
    }
}

function updateCamera() {
    moveCamera();
}

//For Keyboard
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (font) {
        textGeneration(font);
    }
    if (keyCode == 87) { //UP KEY
        camera.position.z -= ySpeed;
        //console.log(camera.position.z); DEBUG
        yearsTraveled += movementYearMultiplier;
    } else if (keyCode == 83) { //DOWN KEY
        camera.position.z += ySpeed;
        //console.log(camera.position.z); DEBUG
        yearsTraveled -= movementYearMultiplier;
    }

    //Kepler-186f HUD
    if (yearsTraveled > 983000 && yearsTraveled < 985000) {
        if (camera.getObjectByName(HUDK186Geo) == null) {
            camera.add(HUDK186Geo);
            console.log('K186f text has been added');
        }
    }
    if (yearsTraveled < 983000 || yearsTraveled > 985000) {
        //if (camera.getObjectByName(HUDK186Geo) != null) {
        camera.remove(HUDK186Geo);
        console.log('K186f text has been removed');
    }
};


function animate() {
    requestAnimationFrame(animate);

    //controls.update();
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
        handleButtons(gamepad.buttons);
    }
    controllerInput();
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
        handleButtons(gamepad.buttons);
    }
    //controls.update();
    renderer.render(scene, camera);
    if (Kepler186f) {
        rotatePlanets();
    }

    updateCamera();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

animate();