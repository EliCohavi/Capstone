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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20);
camera.position.z = -800;
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
    ambient.setVolume(0.025);
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
    stars[i].position.z = THREE.MathUtils.randFloat(100, -1500);

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
var k186ZPosition = -(985492.0 / ((1 / zSpeed) * movementYearMultiplier));
var HD40307ZPosition = -(71354.0 / ((1 / zSpeed) * movementYearMultiplier));
var k22bZPostion = -(1078839.0 / ((1 / zSpeed) * movementYearMultiplier));
var g667ZPosition = -(40128 / ((1 / zSpeed) * movementYearMultiplier));
var g581ZPosition = -(33000 / ((1 / zSpeed) * movementYearMultiplier));


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

const k22bLight = new THREE.PointLight(0xffffff, 3, 10, 0);
k22bLight.position.set(3, 0, k22bZPostion + 3);
k22bLight.castShadow = true;
k22bLight.receiveShadow = true;
k22bLight.shadow.camera.near = 1;
k22bLight.shadow.camera.far = 10000;
k22bLight.shadow.mapSize.set(1024, 1024);
scene.add(k22bLight);

const g667Light = new THREE.PointLight(0xffffff, 3, 10, 0);
g667Light.position.set(3, 0, g667ZPosition + 3);
g667Light.castShadow = true;
g667Light.receiveShadow = true;
g667Light.shadow.camera.near = 1;
g667Light.shadow.camera.far = 10000;
g667Light.shadow.mapSize.set(1024, 1024);
scene.add(g667Light);

const g581Light = new THREE.PointLight(0xffffff, 3, 10, 0);
g581Light.position.set(3, 0, g581ZPosition + 3);
g581Light.castShadow = true;
g581Light.receiveShadow = true;
g581Light.shadow.camera.near = 1;
g581Light.shadow.camera.far = 10000;
g581Light.shadow.mapSize.set(1024, 1024);
scene.add(g581Light);


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
let HUDk22bGeo;
let k22btextGeo;
let K22btext;
let HUDg667Geo;
let g667textGeo;
let g667text;
let HUDg581Geo;
let g581textGeo;
let g581text;
let HUDJourneyEndGeo;
let JourneyEndTextGeo;
let JourneyEndText;
let HUDgenerationsGeo;
let generationsText;
let generationsTextGeo;
let HUDhumansGeo;
let humansText;
let humansTextGeo;
let HUDworthGeo;
let worthText;
let worthTextGeo;



//add text HUDs
HUDYearsGeo = new THREE.Group();
HUDK186Geo = new THREE.Group();
HUDHD40307Geo = new THREE.Group();
HUDk22bGeo = new THREE.Group();
HUDg667Geo = new THREE.Group();
HUDg581Geo = new THREE.Group();
HUDJourneyEndGeo = new THREE.Group();
HUDgenerationsGeo = new THREE.Group();
HUDhumansGeo = new THREE.Group();
HUDworthGeo = new THREE.Group();

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
    //HUDYearsGeo.add(years);


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
    K186text.position.x = -0.8;
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


    //Kepler 22b
    k22btextGeo = new TextGeometry(
        `Discovered on December 5, 2011, Kepler-22b orbits within
the Kepler-22 system in the Cygnus constellation, a vast
635 light-years distant from Earth. With a mass 9.1 times
that of Earth and a radius 2.1 times larger, Kepler-22b
poses an intriguing puzzle. It's true nature remains
elusive due to its immense distance, with speculation
ranging from rocky to potentially gaseous. Estimates
suggest its equilibrium temperature is around 6°C, but
with a greenhouse effect akin to Earth, it could reach
22°C. Conversely, a Venus-like effect might soar it to a
blistering 460°C. Despite its allure, a journey to
Kepler-22b, even at 395,000 mph, would take a daunting
1,078,839 years.`, {

        font: font,

        size: size / 7,
        height: height / 8,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness / 8,
        bevelSize: bevelSize / 8,
        //bevelEnabled: bevelEnabled / 8,

    }).center();

    //Text Object Creation
    K22btext = new THREE.Mesh(k22btextGeo, materials);
    K22btext.position.x = -0.95;
    K22btext.position.y = -0.6;
    K22btext.position.z = -1;


    //Add to hud
    HUDk22bGeo.add(K22btext);


    //Gliese 667Cc
    g667textGeo = new TextGeometry(
        `Discovered by the ESO/HARPS team on November 21, 2011,
Gliese 667Cc resides in the Gliese 667C system, part
of the Scorpius constellation, just 23.62 light-years
from Earth. With a mass around 3.709 times that of
Earth and a radius 1.54 times greater, Gliese 667Cc
stands as a potentially unique world in the cosmos. 
Situated closer to the inner edge of the
"Habitability Zone," Gliese 667Cc experiences slightly
warmer temperatures than other exoplanets. However,
its status as a tidally-locked planet subject to
intense tidal heating—300 times that of Earth—raises
doubts about its habitability Embarking on a journey
to Gliese 667Cc, even at 395,000 mph, would require
a staggering 40,128 years.`, {

        font: font,

        size: size / 7,
        height: height / 8,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness / 8,
        bevelSize: bevelSize / 8,
        //bevelEnabled: bevelEnabled / 8,

    }).center();

    //Text Object Creation
    g667text = new THREE.Mesh(g667textGeo, materials);
    g667text.position.x = -0.9;
    g667text.position.y = -0.6;
    g667text.position.z = -1;


    //Add to hud
    HUDg667Geo.add(g667text);


    //Gliese 581g
    g581textGeo = new TextGeometry(
        `Discovered by Steven S. Vogt on September 29, 2010, 
Gliese 581g resides in the Gliese 581 system,however,
its existence remains controversial due to challenges
in confirmation.  Believed to be tidally locked,
Gliese 581g offers the potential for liquid water
despite its mysterious nature. With an average global
equilibrium temperature ranging from 209 to 228 K, it
could sustain life with Earth-like greenhouse effects,
resulting in temperatures of -37 to -12°C (-35 to 10°F). 
Despite the daunting journey—20 lightyears or 33,986
years at 395,000 mph—Gliese 581g beckons as a
tantalizing destination, challenging humanity to
unravel its mysteries and explore the frontiers of
habitability in the cosmos.`, {

        font: font,

        size: size / 7,
        height: height / 8,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness / 8,
        bevelSize: bevelSize / 8,
        //bevelEnabled: bevelEnabled / 8,

    }).center();

    //Text Object Creation
    g581text = new THREE.Mesh(g581textGeo, materials);
    g581text.position.x = -1;
    g581text.position.y = -0.6;
    g581text.position.z = -1;


    //Add to hud
    HUDg581Geo.add(g581text);

    const JourneyEndTextMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true });



    //Gliese 581g
    JourneyEndTextGeo = new TextGeometry(
        `THIS JOURNEY TOOK 1,078,839 YEARS`, {

        font: font,

        size: size / 5,
        height: height / 8,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness / 8,
        bevelSize: bevelSize / 8,
        //bevelEnabled: bevelEnabled / 8,


    }).center();

    //Text Object Creation
    JourneyEndText = new THREE.Mesh(JourneyEndTextGeo, JourneyEndTextMat);
    JourneyEndText.position.x = 0;
    JourneyEndText.position.y = 0;
    JourneyEndText.position.z = -1;


    //Add to hud
    HUDJourneyEndGeo.add(JourneyEndText);



    const generationsTextMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true });

    //Generations Text
    generationsTextGeo = new TextGeometry(
        `43,154 GENERATIONS`, {

        font: font,

        size: size / 5,
        height: height / 8,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness / 8,
        bevelSize: bevelSize / 8,
        //bevelEnabled: bevelEnabled / 8,


    }).center();

    //Text Object Creation
    generationsText = new THREE.Mesh(generationsTextGeo, generationsTextMat);
    generationsText.position.x = 0;
    generationsText.position.y = 0;
    generationsText.position.z = -1;


    //Add to hud
    HUDgenerationsGeo.add(generationsText);



    const humansTextMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true });

    //Humans Text
    humansTextGeo = new TextGeometry(
        /*`HUMANS ARE ONLY 12,000 GENERATIONS`*/"HUMANS HAVE ONLY EXISTED FOR 12,000", {

        font: font,

        size: size / 5,
        height: height / 8,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness / 8,
        bevelSize: bevelSize / 8,
        //bevelEnabled: bevelEnabled / 8,


    }).center();

    //Text Object Creation
    humansText = new THREE.Mesh(humansTextGeo, humansTextMat);
    humansText.position.x = 0;
    humansText.position.y = 0;
    humansText.position.z = -1;


    //Add to hud
    HUDhumansGeo.add(humansText);



    const worthTextMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true });

    //Worth Text
    worthTextGeo = new TextGeometry(
        `IS IT WORTH IT?`, {

        font: font,

        size: size / 5,
        height: height / 8,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness / 8,
        bevelSize: bevelSize / 8,
        //bevelEnabled: bevelEnabled / 8,


    }).center();

    //Text Object Creation
    worthText = new THREE.Mesh(worthTextGeo, worthTextMat);
    worthText.position.x = 0;
    worthText.position.y = 0;
    worthText.position.z = -1;


    //Add to hud
    HUDworthGeo.add(worthText);
}

HUDYearsGeo.position.set(1.1, 0.65, 0);

camera.add(HUDYearsGeo);
camera.add(HUDK186Geo);
camera.add(HUDHD40307Geo);
camera.add(HUDk22bGeo);
camera.add(HUDg667Geo);
camera.add(HUDg581Geo);
camera.add(HUDJourneyEndGeo);
camera.add(HUDgenerationsGeo);
camera.add(HUDhumansGeo);
camera.add(HUDworthGeo);


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

//K22b
const k22bBoxGeo = new THREE.BoxGeometry(1.85, .9, 0.01);
const k22bBoxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
const k22bBox = new THREE.Mesh(k22bBoxGeo, k22bBoxMat);
k22bBox.position.x = -0.775;
k22bBox.position.y = -0.6;
k22bBox.position.z = -1;
HUDk22bGeo.add(k22bBox);
HUDk22bGeo.position.x = 3.5;
HUDk22bGeo.position.y = 0.5;

//g667
const g667BoxGeo = new THREE.BoxGeometry(1.85, .9, 0.01);
const g667BoxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
const g667Box = new THREE.Mesh(g667BoxGeo, g667BoxMat);
g667Box.position.x = -0.775;
g667Box.position.y = -0.6;
g667Box.position.z = -1;
HUDg667Geo.add(g667Box);
HUDg667Geo.position.x = 3.5;
HUDg667Geo.position.y = 0.5;

//g581
const g581BoxGeo = new THREE.BoxGeometry(1.85, .9, 0.01);
const g581BoxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
const g581Box = new THREE.Mesh(g581BoxGeo, g581BoxMat);
g581Box.position.x = -0.775;
g581Box.position.y = -0.6;
g581Box.position.z = -1;
HUDg581Geo.add(g581Box);
HUDg581Geo.position.x = 3.5;
HUDg581Geo.position.y = 0.5;


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
            HUDtext = "Years Traveled: " + Math.round(yearsTraveled);
        }
        //console.log(camera.position.z);

    }
    if (downPressed) { //between 0 and 1
        camera.position.z += (0.5 * upDownValue * zSpeed);
        if (yearsTraveled < 0) {
            yearsTraveled = 0;
        }
        if (yearsTraveled >= 0) {
            yearsTraveled -= Math.abs((0.5 * upDownValue * movementYearMultiplier));
            HUDtext = "Years Traveled: " + Math.round(yearsTraveled);
        }
        //console.log(camera.position.z);


    }
    if (leftPressed) {
        K186f.rotation.y -= Math.abs((leftRightValue * rotationSpeed));
        HD40307g.rotation.y -= Math.abs((leftRightValue * rotationSpeed));
        k22b.rotation.y -= Math.abs((leftRightValue * rotationSpeed));
        g667.rotation.y -= Math.abs((leftRightValue * rotationSpeed));
        g581.rotation.y -= Math.abs((leftRightValue * rotationSpeed));
    }
    if (rightPressed) {
        K186f.rotation.y += (leftRightValue * rotationSpeed);
        HD40307g.rotation.y += (leftRightValue * rotationSpeed);
        k22b.rotation.y += Math.abs((leftRightValue * rotationSpeed));
        g667.rotation.y += Math.abs((leftRightValue * rotationSpeed));
        g581.rotation.y += Math.abs((leftRightValue * rotationSpeed));
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

    //KEPLER22 HUD
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) - 9 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) - 4) {
        HUDk22bGeo.position.x = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) - 9, Math.abs(k22bZPostion) - 4, 3.5, 1.4);
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 2) {
        HUDk22bGeo.position.x = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion), Math.abs(k22bZPostion) + 2, 1.4, 3.5);
    }

    //GLIESE667 HUD
    if (Math.abs(camera.position.z) > Math.abs(g667ZPosition) - 5 && Math.abs(camera.position.z) < Math.abs(g667ZPosition) - 3) {
        HUDg667Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(g667ZPosition) - 5, Math.abs(g667ZPosition) - 3, 3.5, 1.4);
    }
    if (Math.abs(camera.position.z) > Math.abs(g667ZPosition) + 1 && Math.abs(camera.position.z) < Math.abs(g667ZPosition) + 4) {
        HUDg667Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(g667ZPosition) + 1, Math.abs(g667ZPosition) + 4, 1.4, 3.5);
    }

    //GLIESE581 HUD
    if (Math.abs(camera.position.z) > Math.abs(g581ZPosition) - 9 && Math.abs(camera.position.z) < Math.abs(g581ZPosition) - 6) {
        HUDg581Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(g581ZPosition) - 9, Math.abs(g581ZPosition) - 6, 3.5, 1.4);
    }
    if (Math.abs(camera.position.z) > Math.abs(g581ZPosition) - 3 && Math.abs(camera.position.z) < Math.abs(g581ZPosition)) {
        HUDg581Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(g581ZPosition) - 3, Math.abs(g581ZPosition), 1.4, 3.5);
    }

    //JOURNEY END HUD
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 6 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 10) {
        JourneyEndText.material.opacity = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) + 6, Math.abs(k22bZPostion) + 10, 0, 1);
        //console.log('Opacity is here');
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 23 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 27) {
        JourneyEndText.material.opacity = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) + 23, Math.abs(k22bZPostion) + 27, 1, 0);
        //console.log('Opacity is gone');
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 27) {
        //JourneyEndText.material.color = 0x000000;
        HUDJourneyEndGeo.remove(JourneyEndText);
    }

    //GENERATIONS HUD
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 29 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 33) {
        generationsText.material.opacity = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) + 29, Math.abs(k22bZPostion) + 33, 0, 1);
        //console.log('Opacity is here');
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 46 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 50) {
        generationsText.material.opacity = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) + 46, Math.abs(k22bZPostion) + 50, 1, 0);
        //console.log('Opacity is gone');
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 50) {
        //JourneyEndText.material.color = 0x000000;
        HUDgenerationsGeo.remove(generationsText);
    }

    //HUMANS HUD
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 52 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 56) {
        humansText.material.opacity = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) + 52, Math.abs(k22bZPostion) + 56, 0, 1);
        //console.log('Opacity is here');
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 69 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 73) {
        humansText.material.opacity = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) + 69, Math.abs(k22bZPostion) + 73, 1, 0);
        //console.log('Opacity is gone');
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 73) {
        //JourneyEndText.material.color = 0x000000;
        HUDhumansGeo.remove(humansText);
    }

    //WORTH HUD
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 78 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 82) {
        worthText.material.opacity = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) + 78, Math.abs(k22bZPostion) + 82, 0, 1);
        //console.log('Opacity is here');
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 95 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 99) {
        worthText.material.opacity = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) + 95, Math.abs(k22bZPostion) + 99, 1, 0);
        //console.log('Opacity is gone');
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 99) {
        //JourneyEndText.material.color = 0x000000;
        HUDworthGeo.remove(worthText);
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
        //console.log(camera.position.z);
        yearsTraveled += movementYearMultiplier;
    } else if (keyCode == 83) { //DOWN KEY
        camera.position.z += zSpeed;
        //console.log(camera.position.z);
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

    //KEPLER22 HUD
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) - 9 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) - 4) {
        HUDk22bGeo.position.x = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) - 9, Math.abs(k22bZPostion) - 4, 3.5, 1.4);
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 2) {
        HUDk22bGeo.position.x = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion), Math.abs(k22bZPostion) + 2, 1.4, 3.5);
    }

    //GLIESE667 HUD
    if (Math.abs(camera.position.z) > Math.abs(g667ZPosition) - 5 && Math.abs(camera.position.z) < Math.abs(g667ZPosition) - 3) {
        HUDg667Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(g667ZPosition) - 5, Math.abs(g667ZPosition) - 3, 3.5, 1.4);
    }
    if (Math.abs(camera.position.z) > Math.abs(g667ZPosition) + 1 && Math.abs(camera.position.z) < Math.abs(g667ZPosition) + 4) {
        HUDg667Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(g667ZPosition) + 1, Math.abs(g667ZPosition) + 4, 1.4, 3.5);
    }

    //GLIESE581 HUD
    if (Math.abs(camera.position.z) > Math.abs(g581ZPosition) - 9 && Math.abs(camera.position.z) < Math.abs(g581ZPosition) - 6) {
        HUDg581Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(g581ZPosition) - 9, Math.abs(g581ZPosition) - 6, 3.5, 1.4);
    }
    if (Math.abs(camera.position.z) > Math.abs(g581ZPosition) - 3 && Math.abs(camera.position.z) < Math.abs(g581ZPosition)) {
        HUDg581Geo.position.x = remap(Math.abs(camera.position.z), Math.abs(g581ZPosition) - 3, Math.abs(g581ZPosition), 1.4, 3.5);
    }

    //JOURNEY END HUD
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 6 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 10) {
        JourneyEndText.material.opacity = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) + 6, Math.abs(k22bZPostion) + 10, 0, 1);
        console.log('Opacity is here');
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 23 && Math.abs(camera.position.z) < Math.abs(k22bZPostion) + 27) {
        JourneyEndText.material.opacity = remap(Math.abs(camera.position.z), Math.abs(k22bZPostion) + 23, Math.abs(k22bZPostion) + 27, 1, 0);
        console.log('Opacity is gone');
    }
    if (Math.abs(camera.position.z) > Math.abs(k22bZPostion) + 27) {
        //JourneyEndText.material.color = 0x000000;
        HUDJourneyEndGeo.remove(JourneyEndTextGeo);
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

//k22b Texture
const k22bTexture = new THREE.TextureLoader().load(
    "Assets/Planets/kepler-22b/textures/Planet_baseColor.png");
k22bTexture.wrapS = THREE.RepeatWrapping;
k22bTexture.wrapT = THREE.RepeatWrapping;
k22bTexture.repeat.set(1, 1);

const k22bGeo = new THREE.SphereGeometry(3, 64, 64);
const k22bMat = new THREE.MeshPhysicalMaterial({ map: k22bTexture, color: 0xffffff });
const k22b = new THREE.Mesh(k22bGeo, k22bMat);
k22b.position.set(-4, 0, k22bZPostion);
k22b.rotation.z = Math.PI / 6;
k22b.receiveShadow = true;
k22b.castShadow = true;
scene.add(k22b);

//g667 Texture
const g667Texture = new THREE.TextureLoader().load(
    "Assets/Planets/gliese-667cc/textures/g667Texture.png");
g667Texture.wrapS = THREE.RepeatWrapping;
g667Texture.wrapT = THREE.RepeatWrapping;
g667Texture.repeat.set(1, 1);

const g667Geo = new THREE.SphereGeometry(2.5, 64, 64);
const g667Mat = new THREE.MeshPhysicalMaterial({ map: g667Texture, color: 0xffffff });
const g667 = new THREE.Mesh(g667Geo, g667Mat);
g667.position.set(-4, 0, g667ZPosition);
g667.rotation.z = Math.PI / 6;
g667.receiveShadow = true;
g667.castShadow = true;
scene.add(g667);

//g581 Texture
const g581Texture = new THREE.TextureLoader().load(
    "Assets/Planets/gliese-581g/textures/g581Texture.png");
g581Texture.wrapS = THREE.RepeatWrapping;
g581Texture.wrapT = THREE.RepeatWrapping;
g581Texture.repeat.set(1, 1);

const g581Geo = new THREE.SphereGeometry(2.5, 64, 64);
const g581Mat = new THREE.MeshPhysicalMaterial({ map: g581Texture, color: 0xffffff });
const g581 = new THREE.Mesh(g581Geo, g581Mat);
g581.position.set(-4, 0, g581ZPosition);
g581.rotation.z = Math.PI / 6;
g581.receiveShadow = true;
g581.castShadow = true;
scene.add(g581);


function rotatePlanets() {
    K186f.rotation.y += 0.0005;
    HD40307g.rotation.y += 0.0003;
    k22b.rotation.y += 0.0005;
    g667.rotation.y += 0.0005;
    g581.rotation.y += 0.0005;
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
    yearsGeo = new TextGeometry(HUDtext);
    updateCamera();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

animate();