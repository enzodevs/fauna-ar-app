import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
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
  const animationIdRef = useRef<number | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null); // NOVO
  const clockRef = useRef<THREE.Clock>(new THREE.Clock()); // NOVO
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!mountRef.current || !cameraReady) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera for AR
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      animal.modelPath,
      (gltf: GLTF) => {
        const model = gltf.scene;
        
        // Verificar se há animações
        console.log('Animations found:', gltf.animations.length);
        gltf.animations.forEach((clip, index) => {
          console.log(`Animation ${index}:`, clip.name, 'Duration:', clip.duration);
        });
        
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(0, 0, -1.5);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.z = -1.5;
        
        scene.add(model);
        modelRef.current = model;

        // NOVO: Setup AnimationMixer para reproduzir animações
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;
          
          // Reproduzir a primeira animação (geralmente Idle ou Walk)
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
          
          console.log('Playing animation:', gltf.animations[0].name);
        }
        
        setIsLoading(false);
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

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // MODIFICADO: Update animation mixer
      const delta = clockRef.current.getDelta();
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Rotate model if loaded (opcional - remova se não quiser rotação)
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [animal, cameraReady]);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraReady(true);
        setShowInstructions(false);
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Não foi possível acessar a câmera. Verifique as permissões.');
      }
    };

    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />

      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Instructions Overlay */}
      {showInstructions && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="bg-jungle-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-4 text-center animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-4">Instruções AR</h2>
            <div className="space-y-4 text-gray-200">
              <p>📱 Permitir acesso à câmera quando solicitado</p>
              <p>🎯 Aponte a câmera para o marcador Hiro</p>
              <p>📏 Mantenha uma distância adequada do marcador</p>
              <p>💡 Certifique-se de ter boa iluminação</p>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              Baixe o marcador Hiro em: github.com/AR-js-org/AR.js
            </p>
          </div>
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
      {!showInstructions && !error && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">{animal.name}</h2>
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