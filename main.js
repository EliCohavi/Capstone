import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


/*
Music used
Quantum Particles - by Jonny Easton
Link: https://www.youtube.com/watch?v=w_ms_Xe0Jtk
*/



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 50;
camera.lookAt(0, 0, -10000);
scene.add(camera);

//AudioListener
const audioListener = new THREE.AudioListener();
camera.add(audioListener);

const ambient = new THREE.Audio(audioListener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('Assets/Audio/Ambient.mp3', function (buffer) {
    ambient.setBuffer(buffer);
    ambient.setLoop(true);
    ambient.setVolume(0.1);
});

let playAmbientBoolean = false;
function playAmbient() {
    ambient.play();
    console.log("Ambient is playing");
}


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
var HUDtext = "Years Traveled: ", yearsTraveled;

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
    stars[i].position.z = THREE.MathUtils.randFloat(100, -1500);
    //console.log(stars[i].position.z); -- DEBUG

    scene.add(stars[i]);
}


// movement - please calibrate these values
var zSpeed = 0.15;


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
var movementYearMultiplier = 200.0;
var k186ZPosition = -(985492.0 / 1000);
var HD40307ZPosition = -(71354.0 / 1000);


//Lights
const K186light = new THREE.PointLight(0xffffff, 3, 10, 0);
K186light.position.set(3, 0, k186ZPosition + 2);
K186light.castShadow = true;
K186light.receiveShadow = true;
K186light.shadow.camera.near = 1;
K186light.shadow.camera.far = 10000;
K186light.shadow.mapSize.set(1024, 1024);
scene.add(K186light);

const HD40307Light = new THREE.PointLight(0xffffff, 3, 10, 0);
HD40307Light.position.set(3, 0, HD40307ZPosition + 4.5);
HD40307Light.castShadow = true;
HD40307Light.receiveShadow = true;
HD40307Light.shadow.camera.near = 1;
HD40307Light.shadow.camera.far = 10000;
HD40307Light.shadow.mapSize.set(1024, 1024);
scene.add(HD40307Light);

const light2 = new THREE.AmbientLight(0xffffff, 0.003);
scene.add(light2);


//Text Materials
let materials;

//Materials For Text
materials = [
    new THREE.MeshBasicMaterial({ color: 0xffffff, /*flatShading: true*/ }), // front
    new THREE.MeshBasicMaterial({ color: 0xffffff }) // side
];

//Text
let HUDYearsGeo;
let HUDK186Geo;
let yearsGeo;
let years;
let K186textGeo;
let K186text;
let HUDHD40307Geo;
let HD40307textGeo;
let HD40307text;



//add text HUDs
HUDYearsGeo = new THREE.Group();
HUDK186Geo = new THREE.Group();
HUDHD40307Geo = new THREE.Group();

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


    //Add to hud
    HUDK186Geo.add(K186text);


    //HD 40307g
    HD40307textGeo = new TextGeometry(
        `Discovered by Mikko Tuomi on October 28, 2012, HD 40307g
orbits within the HD 40307 system in the Pictor constellation,
situated 42 light-years away from Earth. With a mass
approximately 7.09 times that of Earth and a radius around
2.39 times larger, HD 40307g emerges as a distant enigma,
beckoning exploration and inquiry. Postulated to be a
Neptune-like ice giant, HD 40307g likely possesses a surface
gravity estimated to be around 4.5 times greater than Earth's. 
While little is known about its terrain and temperature, its
distant allure captivates the imagination. Despite the journey's
daunting duration—71,354 years at 395,000 mph—HD 40307g
stands as a testament to the boundless wonders awaiting
discovery in the vastness of the cosmos.`, {

        font: font,

        size: size / 7,
        height: height / 8,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness / 8,
        bevelSize: bevelSize / 8,
        //bevelEnabled: bevelEnabled / 8,

    }).center();

    //Text Object Creation
    HD40307text = new THREE.Mesh(HD40307textGeo, materials);
    HD40307text.position.x = -0.88;
    HD40307text.position.y = -0.6;
    HD40307text.position.z = -1;


    //Add to hud
    HUDHD40307Geo.add(HD40307text);



}

HUDYearsGeo.position.set(1.1, 0.65, 0);

camera.add(HUDYearsGeo);
camera.add(HUDK186Geo);
camera.add(HUDHD40307Geo);

//HUD Boxes
//K186
const k186BoxGeo = new THREE.BoxGeometry(1.85, .8, 0.01);
const k186BoxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
const k186box = new THREE.Mesh(k186BoxGeo, k186BoxMat);
k186box.position.x = -0.775;
k186box.position.y = -0.6;
k186box.position.z = -1;
HUDK186Geo.add(k186box);
HUDK186Geo.position.x = 3.5;
HUDK186Geo.position.y = 0.5;

//HD40307
const HD40307BoxGeo = new THREE.BoxGeometry(1.85, .9, 0.01);
const HD40307BoxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
const HD40307Box = new THREE.Mesh(HD40307BoxGeo, HD40307BoxMat);
HD40307Box.position.x = -0.775;
HD40307Box.position.y = -0.6;
HD40307Box.position.z = -1;
HUDHD40307Geo.add(HD40307Box);

HUDHD40307Geo.position.x = 3.5;
HUDHD40307Geo.position.y = 0.5;


function updateYears() {

}

//Remap Numbers Function
function remap(value, istart, istop, ostart, ostop) {
    // Ensure values are numerical to avoid potential errors
    value = Number(value);
    istart = Number(istart);
    istop = Number(istop);
    ostart = Number(ostart);
    ostop = Number(ostop);

    // Perform the mapping calculation
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}




var rotationSpeed = 0.01;
//For Controller
function moveCamera() {
    if (upPressed) { //between -1 and 0
        camera.position.z += (0.5 * upDownValue * zSpeed);
        if (yearsTraveled < 0) {
            yearsTraveled = 0;
        }
        if (yearsTraveled >= 0) {
            yearsTraveled += Math.abs((0.5 * upDownValue * movementYearMultiplier));
            HUDtext = "Years Traveled: ", Math.round(yearsTraveled);
        }
        console.log(camera.position.z);

    }
    if (downPressed) { //between 0 and 1
        camera.position.z += (0.5 * upDownValue * zSpeed);
        if (yearsTraveled < 0) {
            yearsTraveled = 0;
        }
        if (yearsTraveled >= 0) {
            yearsTraveled -= Math.abs((0.5 * upDownValue * movementYearMultiplier));
            HUDtext = "Years Traveled: ", Math.round(yearsTraveled);
        }
        console.log(camera.position.z);
        //console.log(HUDtext);

    }
    if (leftPressed) {
        K186f.rotation.y -= Math.abs((leftRightValue * rotationSpeed));
        HD40307g.rotation.y -= Math.abs((leftRightValue * rotationSpeed));
    }
    if (rightPressed) {
        K186f.rotation.y += (leftRightValue * rotationSpeed);
        HD40307g.rotation.y += (leftRightValue * rotationSpeed);
    }
    /*  These are all using the axes value paired with the rotationSpeed as a multiplier to create variable speeds based off input.
        Absolute value is added so direction can reverse (Rules of Math for adding and subtracting positive and negative integers).*/


    if (font) {
        textGeneration(font);
    }

    //KEPLER186 HUD
    if (Math.abs(camera.position.z) > Math.abs(k186ZPosition) - 9 && Math.abs(camera.position.z) < Math.abs(k186ZPosition) - 4) {
        HUDK186Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(k186ZPosition) - 9, Math.abs(k186ZPosition) - 4, 3.5, 1.4);
    }
    if (Math.abs(camera.position.z) > Math.abs(k186ZPosition) && Math.abs(camera.position.z) < Math.abs(k186ZPosition) + 2) {
        HUDK186Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(k186ZPosition), Math.abs(k186ZPosition) + 2, 1.4, 3.5);
    }

    //HD40207 HUD
    if (Math.abs(camera.position.z) > Math.abs(HD40307ZPosition) - 11 && Math.abs(camera.position.z) < Math.abs(HD40307ZPosition) - 6) {
        HUDHD40307Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(HD40307ZPosition) - 11, Math.abs(HD40307ZPosition) - 6, 3.5, 1.4);
    }
    if (Math.abs(camera.position.z) > Math.abs(HD40307ZPosition) && Math.abs(camera.position.z) < Math.abs(HD40307ZPosition) + 2) {
        HUDHD40307Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(HD40307ZPosition), Math.abs(HD40307ZPosition) + 2, 1.4, 3.5);
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
        camera.position.z -= zSpeed;
        console.log(camera.position.z);
        yearsTraveled += movementYearMultiplier;
    } else if (keyCode == 83) { //DOWN KEY
        camera.position.z += zSpeed;
        console.log(camera.position.z);
        yearsTraveled -= movementYearMultiplier;
    }

    if (keyCode == 13) {
        playAmbient();
    }

    //K186 HUD
    if (Math.abs(camera.position.z) > Math.abs(k186ZPosition) - 9 && Math.abs(camera.position.z) < Math.abs(k186ZPosition) - 4) {
        HUDK186Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(k186ZPosition) - 9, Math.abs(k186ZPosition) - 4, 3.5, 1.4);
    }
    if (Math.abs(camera.position.z) > Math.abs(k186ZPosition) && Math.abs(camera.position.z) < Math.abs(k186ZPosition) + 2) {
        HUDK186Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(k186ZPosition), Math.abs(k186ZPosition) + 2, 1.4, 3.5);
    }

    //HD40207 HUD
    if (Math.abs(camera.position.z) > Math.abs(HD40307ZPosition) - 11 && Math.abs(camera.position.z) < Math.abs(HD40307ZPosition) - 6) {
        HUDHD40307Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(HD40307ZPosition) - 11, Math.abs(HD40307ZPosition) - 6, 3.5, 1.4);
    }
    if (Math.abs(camera.position.z) > Math.abs(HD40307ZPosition) && Math.abs(camera.position.z) < Math.abs(HD40307ZPosition) + 2) {
        HUDHD40307Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(HD40307ZPosition), Math.abs(HD40307ZPosition) + 2, 1.4, 3.5);
    }

};

//K186f Texture
const K186fTexture = new THREE.TextureLoader().load(
    "Assets/Planets/kepler-186f/textures/Kepler186fTexture.png");
K186fTexture.wrapS = THREE.RepeatWrapping;
K186fTexture.wrapT = THREE.RepeatWrapping;
K186fTexture.repeat.set(1, 1);

const K186fGeo = new THREE.SphereGeometry(2, 64, 64);
const K186fMat = new THREE.MeshPhysicalMaterial({ map: K186fTexture, color: 0xffffff });
const K186f = new THREE.Mesh(K186fGeo, K186fMat);
K186f.position.set(-3, 0, k186ZPosition);
K186f.rotation.y = Math.PI / 2;
K186f.receiveShadow = true;
K186f.castShadow = true;
scene.add(K186f);

//HD 40307g Texture
const HD40307Texture = new THREE.TextureLoader().load(
    "Assets/Planets/hd-40307g/textures/Material_baseColor.png");
HD40307Texture.wrapS = THREE.RepeatWrapping;
HD40307Texture.wrapT = THREE.RepeatWrapping;
HD40307Texture.repeat.set(1, 1);

const HD40307Geo = new THREE.SphereGeometry(4, 64, 64);
const HD40307Mat = new THREE.MeshPhysicalMaterial({ map: HD40307Texture, color: 0xffffff });
const HD40307g = new THREE.Mesh(HD40307Geo, HD40307Mat);
HD40307g.position.set(-5, 0, HD40307ZPosition);
HD40307g.rotation.z = Math.PI / 6;
HD40307g.receiveShadow = true;
HD40307g.castShadow = true;
scene.add(HD40307g);




function rotatePlanets() {
    K186f.rotation.y += 0.0005;
    HD40307g.rotation.y += 0.0003;


}


function animate() {
    requestAnimationFrame(animate);
    rotatePlanets();
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

    updateCamera();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

animate();