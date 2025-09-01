import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { Animal } from '../App';

interface ARSceneProps {
  animal: Animal;
  onBack: () => void;
}

const ARScene: React.FC<ARSceneProps> = ({ animal, onBack }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const controllerRef = useRef<THREE.Group | null>(null);
  const reticleRef = useRef<THREE.Mesh | null>(null);
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isModelPlaced, setIsModelPlaced] = useState(false);

  // Check AR support
  useEffect(() => {
    const checkARSupport = async () => {
      if (navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setIsARSupported(supported);
          if (!supported) {
            setError('WebXR AR não é suportado neste dispositivo ou navegador.');
          }
        } catch (err) {
          console.error('Error checking AR support:', err);
          setError('Erro ao verificar suporte para AR.');
        }
      } else {
        setError('WebXR não está disponível neste navegador.');
      }
    };
    
    checkARSupport();
  }, []);

  useEffect(() => {
    if (!mountRef.current || !isARSupported) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera for AR
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );
    cameraRef.current = camera;

    // Setup renderer with WebXR
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.xr.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create AR Button
    const arButton = ARButton.createButton(renderer, { 
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['plane-detection']
    });
    arButton.style.position = 'absolute';
    arButton.style.bottom = '20px';
    arButton.style.left = '50%';
    arButton.style.transform = 'translateX(-50%)';
    arButton.style.zIndex = '100';
    mountRef.current.appendChild(arButton);

    // Add lighting
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0.5, 1, 0.25);
    scene.add(directionalLight);

    // Setup controllers and reticle
    const controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);
    controllerRef.current = controller;

    // Create reticle (targeting ring)
    const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
    reticleRef.current = reticle;

    // Load 3D model (but don't add to scene yet)
    const loader = new GLTFLoader();
    loader.load(
      animal.modelPath,
      (gltf) => {
        const model = gltf.scene;
        
        // Setup model properties
        model.scale.set(0.8, 0.8, 0.8);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        modelRef.current = model;

        // Setup AnimationMixer
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
        
        setIsLoading(false);
        setShowInstructions(false);
      },
      (progress: ProgressEvent<EventTarget>) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error: unknown) => {
        console.error('Error loading model:', error);
        setError('Erro ao carregar o modelo 3D. Verifique se o arquivo está em /public/models/');
        setIsLoading(false);
      }
    );

    // Handle select events (place model)
    function onSelect() {
      if (reticleRef.current?.visible && modelRef.current && !isModelPlaced) {
        const model = modelRef.current;

        // centralizar/base no chão como antes
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y -= size.y / 2;

        // posicionar no reticle
        if (reticleRef.current.matrix) {
          model.position.setFromMatrixPosition(reticleRef.current.matrix);
          model.quaternion.setFromRotationMatrix(reticleRef.current.matrix);
        }

        sceneRef.current?.add(model);
        setIsModelPlaced(true);
        reticleRef.current.visible = false;
      }
    }

    // Animation loop
    function animate(_timestamp: number, frame?: XRFrame) {
      // Update animation mixer
      const delta = clockRef.current.getDelta();
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Handle WebXR frame
      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        // Setup hit test source
        if (hitTestSourceRef.current === null && session) {
          session.requestReferenceSpace('viewer').then((referenceSpace) => {
            if (session.requestHitTestSource && typeof session.requestHitTestSource === 'function') {
              const hitTestPromise = session.requestHitTestSource({ space: referenceSpace });
              if (hitTestPromise) {
                hitTestPromise
                  .then((source) => {
                    if (source) {
                      hitTestSourceRef.current = source;
                    }
                  })
                  .catch((err) => {
                    console.warn('Hit test not available:', err);
                  });
              }
            } else {
              console.warn('Hit test API not supported');
            }
          }).catch((err) => {
            console.warn('Viewer reference space not available:', err);
          });

          session.addEventListener('end', () => {
            hitTestSourceRef.current = null;
          });
        }

        // Perform hit test
        if (hitTestSourceRef.current && referenceSpace && !isModelPlaced) {
          const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);

          if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace);

            if (pose && reticleRef.current) {
              reticleRef.current.visible = true;
              reticleRef.current.matrix.fromArray(pose.transform.matrix);
            }
          } else if (reticleRef.current) {
            reticleRef.current.visible = false;
          }
        }
      }

      renderer.render(scene, camera);
    }

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
      if (hitTestSourceRef.current && 'cancel' in hitTestSourceRef.current) {
        hitTestSourceRef.current.cancel();
        hitTestSourceRef.current = null;
      }
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [animal, isARSupported]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Instructions Overlay */}
      {(showInstructions || !isARSupported) && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="bg-jungle-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-4 text-center animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-4">
              {!isARSupported ? 'AR não disponível' : 'Instruções WebXR'}
            </h2>
            <div className="space-y-4 text-gray-200">
              {isARSupported ? (
                <>
                  <p>📱 Clique no botão "START AR" para começar</p>
                  <p>🎯 Aponte a câmera para uma superfície plana</p>
                  <p>👆 Toque na tela para posicionar o animal</p>
                  <p>💡 Certifique-se de ter boa iluminação</p>
                </>
              ) : (
                <>
                  <p>❌ WebXR AR não é suportado neste dispositivo</p>
                  <p>📱 Use Chrome Android mais recente</p>
                  <p>🔒 Acesse via HTTPS ou localhost</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Help Text for AR Session */}
      {isARSupported && !isModelPlaced && !showInstructions && !isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-jungle-900/90 backdrop-blur-sm rounded-lg p-4 text-center z-10">
          <p className="text-white text-sm">
            {reticleRef.current?.visible ? '👆 Toque para posicionar o animal' : '🎯 Procure por uma superfície plana'}
          </p>
        </div>
      )}
      {/* Loading Overlay */}
      {isLoading && !showInstructions && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-jungle-500 border-t-transparent"></div>
            <p className="text-white mt-4">Carregando modelo 3D...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white p-4 rounded-lg z-30">
          <p>{error}</p>
        </div>
      )}

      {/* Animal Info Panel */}
      {!showInstructions && !error && isModelPlaced && (
        <div className="absolute bottom-20 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">{animal.name}</h2>
            <p className="text-jungle-300 italic mb-2">{animal.scientificName}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Habitat:</span>
                <p className="text-white">{animal.habitat}</p>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <p className="text-white">{animal.conservationStatus}</p>
              </div>
              <div>
                <span className="text-gray-400">Descrição:</span>
                <p className="text-white">{animal.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 bg-jungle-600/90 hover:bg-jungle-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors z-30 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>
    </div>
  );
};

export default ARScene;