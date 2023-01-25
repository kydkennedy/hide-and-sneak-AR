let renderer, scene, camera, xrSession, xrRefSpace;
let cube;

// Set up the WebXR environment
function onXRFrame(t, frame) {
    const session = frame.session;
    const pose = frame.getViewerPose(xrRefSpace);
    if (pose) {
        const { views } = pose;
        for (let i = 0; i < views.length; i++) {
            const view = views[i];
            renderer.render(scene, view);
        }
    }
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

async function startXRSession() {
    xrSession = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local'],
        optionalFeatures: ['local-floor', 'bounded-floor']
    });
    xrSession.addEventListener('end', onXRSessionEnd);
    xrRefSpace = await xrSession.requestReferenceSpace('local');
    xrSession.requestAnimationFrame(onXRFrame);
}

function onXRSessionEnd() {
    xrSession.removeEventListener('end', onXRSessionEnd);
    xrSession = null;
}

// Set up the Three.js environment
function init() {
    // Create the Three.js renderer and add it to the page
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);

    // Create a Three.js scene
    scene = new THREE.Scene();

    // Create a Three.js camera
    camera = new THREE.PerspectiveCamera();
    camera.position.z = 5;

    // Add a black cube to the scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Start the XR session
    navigator.xr.isSessionSupported('immersive-ar').then(startXRSession);
}

window.onload = init;
