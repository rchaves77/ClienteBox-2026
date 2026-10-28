import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  Gift, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  ArrowRight, 
  Users, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle2, 
  TrendingUp, 
  Eye, 
  Navigation,
  DollarSign,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ClientGift3DExperienceProps {
  onOpenBriefing?: () => void;
  onOpenDiagnostic?: () => void;
}

export const ClientGift3DExperience: React.FC<ClientGift3DExperienceProps> = ({
  onOpenBriefing,
  onOpenDiagnostic
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [particlesBurst, setParticlesBurst] = useState(0);

  // Video / Showreel State
  const [activeVideoTab, setActiveVideoTab] = useState<'journey' | 'maps_radar' | 'whatsapp_stream'>('journey');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(35);
  const [isMuted, setIsMuted] = useState(true);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const boxLidGroupRef = useRef<THREE.Group | null>(null);
  const boxBodyRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isOpenStateRef = useRef(isOpen);

  useEffect(() => {
    isOpenStateRef.current = isOpen;
  }, [isOpen]);

  // Video progress simulated playback timer
  useEffect(() => {
    if (!isVideoPlaying) return;
    const interval = setInterval(() => {
      setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 120);
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // -------------------------------------------------------------
  // THREE.JS 3D GIFT BOX SCENE SETUP
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 0.5, 0);

    // 3. Renderer with antialiasing and alpha transparency
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.75);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Glowing interior PointLight (shines when box opens)
    const interiorLight = new THREE.PointLight(0xffa149, 4, 8);
    interiorLight.position.set(0, 0.5, 0);
    scene.add(interiorLight);
    pointLightRef.current = interiorLight;

    // 5. Gift Box Materials
    // Luxury Coral-Orange Box Texture with slight sheen
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: 0xff5a35,
      metalness: 0.25,
      roughness: 0.35,
    });

    // Golden Silk Ribbon Material
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
    });

    // 6. Master Box Group
    const boxGroup = new THREE.Group();
    boxGroup.position.set(0, 0.2, 0);
    scene.add(boxGroup);
    boxBodyRef.current = boxGroup;

    // 6A. Box Body (Base)
    const baseSize = 2.4;
    const baseHeight = 2.0;
    const bodyGeometry = new THREE.BoxGeometry(baseSize, baseHeight, baseSize);
    const bodyMesh = new THREE.Mesh(bodyGeometry, boxMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    boxGroup.add(bodyMesh);

    // Cross Ribbon X on Body
    const ribbonWidth = 0.42;
    const ribbonDepthOffset = 0.015;
    const ribbonGeoX = new THREE.BoxGeometry(ribbonWidth, baseHeight + ribbonDepthOffset, baseSize + ribbonDepthOffset);
    const ribbonMeshX = new THREE.Mesh(ribbonGeoX, ribbonMaterial);
    boxGroup.add(ribbonMeshX);

    // Cross Ribbon Z on Body
    const ribbonGeoZ = new THREE.BoxGeometry(baseSize + ribbonDepthOffset, baseHeight + ribbonDepthOffset, ribbonWidth);
    const ribbonMeshZ = new THREE.Mesh(ribbonGeoZ, ribbonMaterial);
    boxGroup.add(ribbonMeshZ);

    // 6B. Box Lid Group (Lifts up and tilts when opened!)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, baseHeight / 2 + 0.12, 0);
    boxGroup.add(lidGroup);
    boxLidGroupRef.current = lidGroup;

    const lidSize = baseSize + 0.15;
    const lidHeight = 0.35;
    const lidGeometry = new THREE.BoxGeometry(lidSize, lidHeight, lidSize);
    const lidMesh = new THREE.Mesh(lidGeometry, boxMaterial);
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    // Cross Ribbon on Lid
    const lidRibbonGeoX = new THREE.BoxGeometry(ribbonWidth, lidHeight + 0.02, lidSize + 0.02);
    const lidRibbonMeshX = new THREE.Mesh(lidRibbonGeoX, ribbonMaterial);
    lidGroup.add(lidRibbonMeshX);

    const lidRibbonGeoZ = new THREE.BoxGeometry(lidSize + 0.02, lidHeight + 0.02, ribbonWidth);
    const lidRibbonMeshZ = new THREE.Mesh(lidRibbonGeoZ, ribbonMaterial);
    lidGroup.add(lidRibbonMeshZ);

    // 6C. 3D Golden Bow on Top of Lid
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0, lidHeight / 2 + 0.15, 0);
    lidGroup.add(bowGroup);

    // Center knot sphere
    const knotGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const knotMesh = new THREE.Mesh(knotGeo, ribbonMaterial);
    bowGroup.add(knotMesh);

    // Left and Right Torus loops for realistic gift ribbon
    const loopGeo = new THREE.TorusGeometry(0.42, 0.12, 16, 32, Math.PI * 1.4);
    
    const loopMesh1 = new THREE.Mesh(loopGeo, ribbonMaterial);
    loopMesh1.rotation.set(0, 0, Math.PI / 4);
    loopMesh1.position.set(-0.35, 0.2, 0);
    bowGroup.add(loopMesh1);

    const loopMesh2 = new THREE.Mesh(loopGeo, ribbonMaterial);
    loopMesh2.rotation.set(0, Math.PI, Math.PI / 4);
    loopMesh2.position.set(0.35, 0.2, 0);
    bowGroup.add(loopMesh2);

    const loopMesh3 = new THREE.Mesh(loopGeo, ribbonMaterial);
    loopMesh3.rotation.set(Math.PI / 4, Math.PI / 2, 0);
    loopMesh3.position.set(0, 0.2, -0.35);
    bowGroup.add(loopMesh3);

    const loopMesh4 = new THREE.Mesh(loopGeo, ribbonMaterial);
    loopMesh4.rotation.set(-Math.PI / 4, -Math.PI / 2, 0);
    loopMesh4.position.set(0, 0.2, 0.35);
    bowGroup.add(loopMesh4);

    // 7. Ground Shadow / Mirror Disc
    const groundGeo = new THREE.CircleGeometry(3.5, 64);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x05070c,
      transparent: true,
      opacity: 0.65
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -1.05;
    scene.add(groundMesh);

    // 8. Glowing Particle Sparks Field
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 1] = Math.random() * 4.5 - 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      particleScales[i] = Math.random() * 0.8 + 0.2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle Material
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffd166,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // 9. Interactive Drag Orbit Handling
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0.45;
    let targetRotationX = 0.15;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX + deltaY * 0.008));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX + deltaY * 0.008));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 10. Animation Loop
    const startTime = performance.now();

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Auto rotation when enabled and not dragging
      if (isRotating && !isDragging) {
        targetRotationY += 0.004;
      }

      // Smooth Box rotation slerp
      if (boxBodyRef.current) {
        boxBodyRef.current.rotation.y += (targetRotationY - boxBodyRef.current.rotation.y) * 0.08;
        boxBodyRef.current.rotation.x += (targetRotationX - boxBodyRef.current.rotation.x) * 0.08;
        
        // Gentle vertical floating breathing motion
        boxBodyRef.current.position.y = 0.2 + Math.sin(elapsedTime * 1.5) * 0.08;
      }

      // Lid Open / Close Animation Transition
      if (boxLidGroupRef.current) {
        const targetLidY = isOpenStateRef.current ? 2.4 : 1.12;
        const targetLidRotX = isOpenStateRef.current ? -0.45 : 0;
        const targetLidRotZ = isOpenStateRef.current ? 0.35 : 0;

        boxLidGroupRef.current.position.y += (targetLidY - boxLidGroupRef.current.position.y) * 0.06;
        boxLidGroupRef.current.rotation.x += (targetLidRotX - boxLidGroupRef.current.rotation.x) * 0.06;
        boxLidGroupRef.current.rotation.z += (targetLidRotZ - boxLidGroupRef.current.rotation.z) * 0.06;
      }

      // Interior Light Intensity Pulses when box is open
      if (pointLightRef.current) {
        if (isOpenStateRef.current) {
          pointLightRef.current.intensity = 3.5 + Math.sin(elapsedTime * 4) * 0.8;
        } else {
          pointLightRef.current.intensity = 0.2;
        }
      }

      // Particles float upwards and rotate
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.06;
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < pos.length; i += 3) {
          pos[i] += 0.008;
          if (pos[i] > 3.8) {
            pos[i] = -0.5;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      renderer.dispose();
      if (dom && dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    };
  }, []);

  // Trigger temporary celebration sparkles burst
  const handleTriggerBurst = () => {
    setParticlesBurst((prev) => prev + 1);
    setIsOpen(true);
  };

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#080c14] via-[#0d1320] to-[#0b0e14] border-b border-slate-800 text-slate-100">
      
      {/* Ambient background glow & radial energy */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-r from-[#ff5a35]/20 via-amber-500/15 to-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">

        {/* HERO BADGE & IMPACT HEADLINE */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ff5a35]/15 to-amber-500/15 border border-[#ff5a35]/30 text-amber-300 text-xs sm:text-sm font-extrabold tracking-wide uppercase mb-5 shadow-lg shadow-[#ff5a35]/10 animate-pulse">
            <Gift className="w-4 h-4 text-[#ff5a35]" />
            <span>O Conceito ClienteBox &bull; Animação 3D & Entrega de Clientes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.12]">
            NÃO ENTREGAMOS APENAS VISUALIZAÇÕES.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a35] via-amber-400 to-[#ff8c42]">
              ENTREGAMOS CLIENTES COMO UM PRESENTE
            </span>{' '}
            NO SEU CAIXA.
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto mt-5 leading-relaxed font-normal">
            Gire a nossa <strong className="text-white">Caixa 3D</strong> abaixo e abra para ver o fluxo contínuo de pessoas que saem das pesquisas do Google Maps e entram direto na porta da sua empresa todos os dias.
          </p>
        </div>

        {/* -------------------------------------------------------------
            GRID PRINCIPAL: 3D INTERACTIVE CANVAS + FLOATING CLIENTS HUB
           ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* COLUNA ESQUERDA (7 COLS): O PALCO 3D INTERATIVO WEBGL */}
          <div className="lg:col-span-7 relative">
            <div 
              className="relative w-full h-[400px] sm:h-[480px] lg:h-[530px] bg-gradient-to-b from-[#111726]/90 to-[#0b0f1a]/95 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Three.js Canvas Container */}
              <div ref={mountRef} className="w-full h-full" />

              {/* FLOATING CLIENTS POPPING OUT OF THE 3D BOX (when isOpen) */}
              {isOpen && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10 overflow-hidden">
                  
                  {/* Floating Client 1 (Top Left) */}
                  <div className="self-start animate-bounce duration-1000 bg-[#0d121f]/90 backdrop-blur-md border border-emerald-500/50 p-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-xs transform -rotate-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Navigation className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Novo Cliente Conectado</span>
                      <strong className="text-xs text-white block">Mariana Silva traçou rota GPS</strong>
                      <span className="text-[10px] text-slate-400">A 450m do seu estabelecimento</span>
                    </div>
                  </div>

                  {/* Floating Client 2 (Top Right) */}
                  <div className="self-end bg-[#0d121f]/90 backdrop-blur-md border border-amber-500/50 p-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-xs transform rotate-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">WhatsApp Oficial</span>
                      <strong className="text-xs text-white block">Dr. Carlos: &quot;Quero agendar hoje&quot;</strong>
                      <span className="text-[10px] text-slate-400">Origem: Google Maps Mobile</span>
                    </div>
                  </div>

                  {/* Floating Client 3 (Bottom Left) */}
                  <div className="self-start bg-[#0d121f]/90 backdrop-blur-md border border-sky-500/50 p-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-xs">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Receita Entregue</span>
                      <strong className="text-xs text-white block">+R$ 1.850,00 Venda Concluída</strong>
                      <span className="text-[10px] text-slate-400">Ciclo de Gestão ClienteBox</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Bottom 3D Interactive Controls: Apenas ABRIR CAIXA CENTRALIZADO */}
              <div className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setIsOpen((prev) => !prev)}
                  className={`flex items-center justify-center gap-2.5 px-7 py-3 rounded-2xl font-black text-sm transition-all shadow-2xl active:scale-95 border ${
                    isOpen 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-amber-300 shadow-amber-500/30' 
                      : 'bg-gradient-to-r from-[#ff5a35] via-amber-500 to-orange-500 hover:from-[#ff481f] hover:to-orange-600 text-white border-amber-400/60 shadow-xl shadow-[#ff5a35]/30'
                  }`}
                >
                  <Gift className="w-5 h-5" />
                  <span>{isOpen ? '🎁 Fechar Caixa' : '✨ Abrir Caixa'}</span>
                </button>
              </div>
            </div>

            <div className="text-center mt-3 text-xs text-slate-400 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Dica: Use o mouse ou o dedo para girar a Caixa de Presente em qualquer ângulo 3D!</span>
            </div>
          </div>

          {/* COLUNA DIREITA (5 COLS): POR QUE A CLIENTEBOX É UM PRESENTE? */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#ff5a35] block">
                O Fim da Prospecção Fria
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display leading-tight">
                Você não precisa mais correr atrás de clientes. O Google coloca eles dentro da sua caixa.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                A maioria das agências entrega planilhas com números vazios de &quot;alcance&quot; e &quot;impressões&quot;. Na ClienteBox, nós configuramos o perfil do seu negócio como um ímã: quando alguém pesquisa o seu serviço com urgência, você recebe a ligação pronta para fechar.
              </p>
            </div>

            {/* 3 Gift Benefit Cards */}
            <div className="space-y-3">
              
              <div className="bg-[#121826] p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3.5 transition-all hover:border-amber-500/40">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">1. Clientes com Intenção Imediata de Compra</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Quem busca no Google Maps não está apenas navegando por entretenimento. Ele quer ir até a sua clínica, loja ou escritório agora.
                  </p>
                </div>
              </div>

              <div className="bg-[#121826] p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3.5 transition-all hover:border-emerald-500/40">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">2. WhatsApp e Telefone com UTMs Rastreadas</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Você sabe o dia, a hora e o valor exato gerado por cada cliente que veio pelo trabalho da ClienteBox através do nosso relatório A4.
                  </p>
                </div>
              </div>

              <div className="bg-[#121826] p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3.5 transition-all hover:border-sky-500/40">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">3. Blindagem Completa contra a Concorrência</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Garantimos que ninguém altere seu horário, telefone ou categories, mantendo sua empresa protegida no Top 3 da sua região.
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenBriefing}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff5a35] to-[#ff7a55] hover:from-[#ff481f] hover:to-[#ff6842] text-white font-black text-sm px-6 py-3.5 rounded-xl shadow-xl shadow-[#ff5a35]/25 transition-all active:scale-95"
              >
                <span>Quero Minha Caixa de Clientes</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenDiagnostic}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#182030] hover:bg-[#202b40] text-amber-300 font-bold text-sm px-5 py-3.5 rounded-xl border border-slate-700 transition-all"
              >
                <span>Diagnóstico Gratuito</span>
              </button>
            </div>

          </div>

        </div>

        {/* -------------------------------------------------------------
            SEÇÃO DE VÍDEOS & DEMONSTRAÇÃO VISUAL RELACIONADA
           ------------------------------------------------------------- */}
        <div className="mt-8 pt-12 border-t border-slate-800/80">
          
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Eye className="w-3.5 h-3.5" />
              <span>Vídeos & Animações Demonstrativas</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Veja a Entrega de Clientes Acontecendo na Prática
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Acompanhe a simulação passo a passo de como o algoritmo local conduz as pessoas até você.
            </p>
          </div>

          {/* Video Tabs Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => { setActiveVideoTab('journey'); setVideoProgress(20); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                activeVideoTab === 'journey'
                  ? 'bg-gradient-to-r from-[#ff5a35] to-orange-500 text-white border-transparent shadow-lg shadow-[#ff5a35]/25'
                  : 'bg-[#121724] text-slate-300 border-slate-800 hover:bg-[#1a2234]'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Vídeo 1: A Jornada da Rota até a Porta</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveVideoTab('maps_radar'); setVideoProgress(40); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                activeVideoTab === 'maps_radar'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black border-transparent shadow-lg shadow-amber-500/25'
                  : 'bg-[#121724] text-slate-300 border-slate-800 hover:bg-[#1a2234]'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Vídeo 2: Radar do Google Maps & Top 1</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveVideoTab('whatsapp_stream'); setVideoProgress(65); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                activeVideoTab === 'whatsapp_stream'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black border-transparent shadow-lg shadow-emerald-500/25'
                  : 'bg-[#121724] text-slate-300 border-slate-800 hover:bg-[#1a2234]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Vídeo 3: Transbordo de Conversas no WhatsApp</span>
            </button>
          </div>

          {/* INTERACTIVE VIDEO SHOWCASE SCREEN */}
          <div className="max-w-4xl mx-auto bg-[#0e1320] rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden relative">
            
            {/* Simulated Animated Video Screen Content */}
            <div className="relative h-64 sm:h-96 bg-[#080c14] flex items-center justify-center overflow-hidden p-6">
              
              {/* TAB 1: ROTA DA JORNADA */}
              {activeVideoTab === 'journey' && (
                <div className="w-full h-full flex flex-col justify-between animate-fadeIn relative">
                  <div className="flex items-center justify-between">
                    <div className="bg-[#101726]/90 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#ff5a35]" />
                      <span className="text-xs font-bold text-white">Ponto de Partida: Cliente no Bairro</span>
                    </div>

                    <div className="bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-emerald-300">
                      Tempo Estimado: 4 min (1,2 km)
                    </div>
                  </div>

                  {/* Animated Route Line */}
                  <div className="my-auto relative flex items-center justify-center">
                    <div className="w-full max-w-lg h-3 bg-slate-800 rounded-full relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#ff5a35] via-amber-400 to-emerald-400 transition-all duration-300"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-[#121929]/90 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">Destino Final</span>
                      <strong className="text-sm text-white">Sua Empresa (Chegada Confirmada no Estabelecimento)</strong>
                    </div>
                    <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl">
                      Cliente Entregue ✅
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: RADAR MAPS TOP 1 */}
              {activeVideoTab === 'maps_radar' && (
                <div className="w-full h-full flex flex-col items-center justify-center animate-fadeIn relative">
                  {/* Radar Circles */}
                  <div className="relative w-56 h-56 rounded-full border-2 border-amber-500/30 flex items-center justify-center">
                    <div className="absolute inset-4 rounded-full border border-amber-500/20" />
                    <div className="absolute inset-12 rounded-full border border-amber-500/40 animate-ping" />
                    <div className="w-14 h-14 rounded-2xl bg-[#ff5a35] text-white flex items-center justify-center font-black text-lg shadow-xl shadow-[#ff5a35]/40 z-10">
                      #1
                    </div>
                  </div>

                  <div className="mt-4 bg-[#111726] px-4 py-2 rounded-xl border border-slate-800 text-xs text-center">
                    <strong className="text-amber-400 block font-bold">Raio de Cobertura Local de 10km</strong>
                    <span className="text-slate-300 text-[11px]">Seu negócio em destaque absoluto quando pesquisam por perto</span>
                  </div>
                </div>
              )}

              {/* TAB 3: WHATSAPP NOTIFICATIONS */}
              {activeVideoTab === 'whatsapp_stream' && (
                <div className="w-full h-full max-w-md flex flex-col justify-center space-y-3 animate-fadeIn">
                  <div className="bg-[#121a28] p-3.5 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center gap-3 transform translate-x-1">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
                      WA
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Novo Contato Google Maps</span>
                      <p className="text-[11px] text-emerald-300 font-medium">&quot;Olá! Vi seu perfil no Google e gostaria de fazer um agendamento hoje.&quot;</p>
                    </div>
                  </div>

                  <div className="bg-[#121a28] p-3.5 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center gap-3 transform -translate-x-1">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
                      WA
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">WhatsApp Business Integrado</span>
                      <p className="text-[11px] text-emerald-300 font-medium">&quot;Boa tarde, qual o valor do procedimento de fisioterapia?&quot;</p>
                    </div>
                  </div>

                  <div className="text-center text-[11px] text-slate-400 font-mono">
                    🟢 Mensagens gravadas e sincronizadas com parâmetros UTM
                  </div>
                </div>
              )}

              {/* Central Play/Pause Overlay indicator */}
              <button
                type="button"
                onClick={() => setIsVideoPlaying((prev) => !prev)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors group cursor-pointer"
              >
                {!isVideoPlaying && (
                  <div className="w-16 h-16 rounded-full bg-[#ff5a35] text-white flex items-center justify-center shadow-2xl pl-1 transform group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7" />
                  </div>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
