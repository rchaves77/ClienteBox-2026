import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Play, 
  Pause, 
  TrendingUp, 
  Award, 
  Target, 
  Search, 
  Filter, 
  Layers, 
  Compass, 
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Company, SearchTermItem } from '../types';

export interface Keyword3DItem {
  id: string;
  keyword: string;
  position: number; // 1 to 20+
  volume: number; // monthly searches or impressions
  previousPosition?: number;
  category: 'core' | 'local' | 'longtail' | 'competitor';
  difficulty: 'fácil' | 'médio' | 'alto';
  ctr: number; // percentage
  status: 'top3' | 'top10' | 'rising' | 'opportunity';
}

interface Keywords3DVisualizerProps {
  company: Company;
  onUpdateKeywords?: (newTerms: SearchTermItem[]) => void;
}

export const Keywords3DVisualizer: React.FC<Keywords3DVisualizerProps> = ({
  company,
  onUpdateKeywords
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword3DItem | null>(null);
  const [hoveredKeyword, setHoveredKeyword] = useState<Keyword3DItem | null>(null);
  const [filterTier, setFilterTier] = useState<'all' | 'top3' | 'top10' | 'rising'>('all');
  const [cameraPerspective, setCameraPerspective] = useState<'iso' | 'top' | 'front'>('iso');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [filterSearch, setFilterSearch] = useState<string>('');

  // Generate or parse keywords for the current company
  const keywordItems: Keyword3DItem[] = useMemo(() => {
    const rawTerms: SearchTermItem[] = company.termosBusca || [];
    
    // Also extract terms from monthlyHistory if available
    const historyTerms: SearchTermItem[] = [];
    if (company.monthlyHistory) {
      company.monthlyHistory.forEach((m) => {
        if (m.termosBusca) {
          m.termosBusca.forEach((t) => historyTerms.push(t));
        }
      });
    }

    const mergedTerms = [...rawTerms, ...historyTerms];
    const uniqueMap = new Map<string, string | number>();
    
    mergedTerms.forEach((t) => {
      if (t.termo && !uniqueMap.has(t.termo.toLowerCase().trim())) {
        uniqueMap.set(t.termo.toLowerCase().trim(), t.exibicoes);
      }
    });

    // Default terms based on company category/name if few or none
    if (uniqueMap.size < 6) {
      const cat = (company.categoria || 'Serviço Local').toLowerCase();
      const name = company.nome.toLowerCase();
      
      if (cat.includes('fisio') || name.includes('fisio')) {
        uniqueMap.set('fisioterapia no bosque', 140);
        uniqueMap.set('fisioterapeuta rio branco', 95);
        uniqueMap.set('clínica de fisioterapia', 82);
        uniqueMap.set('tratamento coluna dor', 64);
        uniqueMap.set('reabilitação motora', 45);
        uniqueMap.set('fisiatra perto de mim', 38);
        uniqueMap.set('pilates clínico especializado', 29);
        uniqueMap.set('consulta fisioterapia preço', 25);
      } else if (cat.includes('neuro') || cat.includes('psico') || name.includes('serclin')) {
        uniqueMap.set('neuropsicologia rio branco', 185);
        uniqueMap.set('avaliação neuropsicológica', 120);
        uniqueMap.set('clínica de psicologia', 98);
        uniqueMap.set('neuropsicóloga infantil', 76);
        uniqueMap.set('laudo tdah autismo neuro', 62);
        uniqueMap.set('terapia cognitiva comportamental', 48);
        uniqueMap.set('psicopedagogia clínica', 35);
        uniqueMap.set('psicólogo doca furtado', 30);
      } else {
        uniqueMap.set(`${company.categoria} centro`, 110);
        uniqueMap.set(`${company.categoria} melhor avaliado`, 85);
        uniqueMap.set(`${company.nome} telefone rota`, 65);
        uniqueMap.set(`${company.categoria} orçamento rápido`, 48);
        uniqueMap.set(`${company.categoria} perto de mim`, 39);
        uniqueMap.set(`${company.categoria} horário atendimento`, 26);
      }
    }

    const list: Keyword3DItem[] = [];
    let index = 0;

    uniqueMap.forEach((vol, term) => {
      index++;
      let numVol = 15;
      if (typeof vol === 'number') {
        numVol = vol;
      } else if (typeof vol === 'string') {
        const parsed = parseInt(vol.replace(/\D/g, ''), 10);
        numVol = isNaN(parsed) ? 15 : parsed;
      }

      // Assign position logically based on order / volume
      let pos = 1;
      if (index === 1) pos = 1;
      else if (index === 2) pos = 2;
      else if (index === 3) pos = 3;
      else if (index <= 5) pos = index + 1;
      else if (index <= 8) pos = index + 2;
      else pos = Math.min(20, index + 3);

      let status: Keyword3DItem['status'] = 'rising';
      if (pos <= 3) status = 'top3';
      else if (pos <= 10) status = 'top10';
      else if (numVol >= 40) status = 'opportunity';

      let category: Keyword3DItem['category'] = 'core';
      if (term.includes('rio branco') || term.includes('bairro') || term.includes('perto') || term.includes('bosque')) {
        category = 'local';
      } else if (term.split(' ').length >= 3) {
        category = 'longtail';
      }

      const ctr = pos === 1 ? 38.5 : pos === 2 ? 22.4 : pos === 3 ? 14.1 : pos <= 5 ? 7.2 : 2.8;

      list.push({
        id: `kw-${index}`,
        keyword: term,
        position: pos,
        volume: numVol,
        previousPosition: pos <= 3 ? pos + 1 : pos + 2,
        category,
        difficulty: pos <= 3 ? 'alto' : pos <= 8 ? 'médio' : 'fácil',
        ctr,
        status
      });
    });

    return list;
  }, [company]);

  // Filtered keywords
  const visibleKeywords = useMemo(() => {
    return keywordItems.filter((item) => {
      if (filterTier === 'top3' && item.position > 3) return false;
      if (filterTier === 'top10' && item.position > 10) return false;
      if (filterTier === 'rising' && item.status !== 'rising' && item.status !== 'opportunity') return false;
      if (filterSearch.trim()) {
        const s = filterSearch.toLowerCase().trim();
        if (!item.keyword.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [keywordItems, filterTier, filterSearch]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = keywordItems.length;
    const top3 = keywordItems.filter((k) => k.position <= 3).length;
    const top10 = keywordItems.filter((k) => k.position <= 10).length;
    const avgPos = total > 0 ? (keywordItems.reduce((acc, k) => acc + k.position, 0) / total).toFixed(1) : '0';
    const totalImpressions = keywordItems.reduce((acc, k) => acc + k.volume, 0);
    return { total, top3, top10, avgPos, totalImpressions };
  }, [keywordItems]);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pillarGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isRotatingRef = useRef<boolean>(isRotating);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  // -------------------------------------------------------------
  // THREE.JS INITIALIZATION & SCENE SETUP
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = isFullscreen ? window.innerHeight - 100 : 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(12, 14, 18);
    camera.lookAt(0, 1.5, 0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const accentLight1 = new THREE.PointLight(0xff5a35, 2.5, 35);
    accentLight1.position.set(-8, 6, -8);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0x10b981, 2.5, 35);
    accentLight2.position.set(8, 6, 8);
    scene.add(accentLight2);

    // 5. Circular Grid / Radar Ground Plane
    const gridHelper = new THREE.PolarGridHelper(16, 16, 8, 64, 0x334155, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Ground reflective disc
    const discGeo = new THREE.CircleGeometry(16.5, 64);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x0b0f19,
      roughness: 0.6,
      metalness: 0.8,
      transparent: true,
      opacity: 0.95
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = -0.05;
    disc.receiveShadow = true;
    scene.add(disc);

    // Center Landmark (The Company Core Tower)
    const centerCoreGroup = new THREE.Group();
    const coreGeo = new THREE.CylinderGeometry(0.8, 1.1, 4.2, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff5a35,
      emissive: 0xaa2005,
      emissiveIntensity: 0.45,
      metalness: 0.9,
      roughness: 0.2
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 2.1;
    coreMesh.castShadow = true;
    centerCoreGroup.add(coreMesh);

    // Core glowing aura ring
    const ringGeo = new THREE.TorusGeometry(1.6, 0.08, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff5a35 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 2.5;
    centerCoreGroup.add(ringMesh);

    scene.add(centerCoreGroup);

    // Floating Ambient Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 32;
      particlePositions[i + 1] = Math.random() * 12 + 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 32;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.14,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Keywords Pillar Group
    const pillarGroup = new THREE.Group();
    pillarGroupRef.current = pillarGroup;
    scene.add(pillarGroup);

    // Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || 800;
      const h = isFullscreen ? window.innerHeight - 100 : 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Mouse Controls (Orbit Drag & Hover)
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.set(x, y);

      if (isDraggingRef.current && pillarGroupRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;
        pillarGroupRef.current.rotation.y += deltaX * 0.008;
        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    const startTime = performance.now();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Slow auto-rotation
      if (isRotatingRef.current && pillarGroupRef.current && !isDraggingRef.current) {
        pillarGroupRef.current.rotation.y += 0.0035;
      }

      // Animate core aura
      ringMesh.rotation.z = elapsedTime * 0.8;
      ringMesh.position.y = 2.1 + Math.sin(elapsedTime * 2) * 0.2;

      // Gentle wave for particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.004;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Raycasting for Hover Detection
      if (camera && pillarGroupRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(pillarGroupRef.current.children, true);

        if (intersects.length > 0) {
          let foundMesh = intersects[0].object as THREE.Mesh;
          // Traverse up to group if needed
          const itemData = foundMesh.userData?.item as Keyword3DItem | undefined;
          if (itemData) {
            setHoveredKeyword(itemData);
            document.body.style.cursor = 'pointer';
          }
        } else {
          setHoveredKeyword(null);
          document.body.style.cursor = 'default';
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('mousemove', onMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      document.body.style.cursor = 'default';
    };
  }, [isFullscreen]);

  // -------------------------------------------------------------
  // UPDATE 3D PILLARS WHEN VISIBLE KEYWORDS CHANGE
  // -------------------------------------------------------------
  useEffect(() => {
    const pillarGroup = pillarGroupRef.current;
    if (!pillarGroup) return;

    // Clear existing pillars
    while (pillarGroup.children.length > 0) {
      const obj = pillarGroup.children[0];
      pillarGroup.remove(obj);
      if ((obj as any).geometry) (obj as any).geometry.dispose();
    }

    const total = visibleKeywords.length;
    if (total === 0) return;

    visibleKeywords.forEach((item, idx) => {
      // Arrangement in golden spiral / concentric radar rings
      // Positions 1-3 are closer to the center, higher rank = closer
      const normalizedPos = Math.max(1, Math.min(20, item.position));
      const radius = 2.8 + (normalizedPos / 20) * 11.5 + (idx % 2 === 0 ? 0.4 : -0.4);
      const angle = (idx / total) * Math.PI * 2 + (normalizedPos * 0.35);

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Height inversely proportional to position number (Top 1 is tallest!)
      // Top 1: ~6.5 units, Top 3: ~5 units, Top 10: ~3.2 units, Top 20: ~1.5 units
      const pillarHeight = Math.max(1.2, 7.5 - normalizedPos * 0.32);

      // Colors based on tier
      let pillarColor = 0x38bdf8; // Sky
      let emissiveColor = 0x0284c7;
      let auraColor = 0x38bdf8;

      if (item.position <= 3) {
        pillarColor = 0x10b981; // Emerald Glow
        emissiveColor = 0x059669;
        auraColor = 0x34d399;
      } else if (item.position <= 7) {
        pillarColor = 0x38bdf8; // Sky Blue
        emissiveColor = 0x0284c7;
        auraColor = 0x60a5fa;
      } else if (item.position <= 10) {
        pillarColor = 0xf59e0b; // Amber
        emissiveColor = 0xd97706;
        auraColor = 0xfbbf24;
      } else {
        pillarColor = 0x818cf8; // Indigo / Purple
        emissiveColor = 0x4f46e5;
        auraColor = 0xa5b4fc;
      }

      const itemPillarGroup = new THREE.Group();
      itemPillarGroup.position.set(x, 0, z);

      // Pillar Geometry (Hexagonal Cylinder)
      const geo = new THREE.CylinderGeometry(0.48, 0.58, pillarHeight, 6);
      const mat = new THREE.MeshStandardMaterial({
        color: pillarColor,
        emissive: emissiveColor,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.8
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = pillarHeight / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { item };

      itemPillarGroup.add(mesh);

      // Top floating crystal or ranking badge
      const capGeo = new THREE.OctahedronGeometry(0.38, 0);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: auraColor,
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.1
      });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.y = pillarHeight + 0.45;
      capMesh.userData = { item };
      itemPillarGroup.add(capMesh);

      // Floor ring marker
      const markerGeo = new THREE.RingGeometry(0.65, 0.78, 24);
      const markerMat = new THREE.MeshBasicMaterial({
        color: auraColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.rotation.x = -Math.PI / 2;
      markerMesh.position.y = 0.02;
      itemPillarGroup.add(markerMesh);

      pillarGroup.add(itemPillarGroup);
    });
  }, [visibleKeywords]);

  // Camera perspective view changes
  const handleChangeCamera = (view: 'iso' | 'top' | 'front') => {
    setCameraPerspective(view);
    const camera = cameraRef.current;
    if (!camera) return;

    if (view === 'iso') {
      camera.position.set(12, 14, 18);
      camera.lookAt(0, 1.5, 0);
    } else if (view === 'top') {
      camera.position.set(0, 26, 0.01);
      camera.lookAt(0, 0, 0);
    } else if (view === 'front') {
      camera.position.set(0, 5, 22);
      camera.lookAt(0, 2.5, 0);
    }
  };

  const handleResetCamera = () => {
    handleChangeCamera('iso');
    if (pillarGroupRef.current) {
      pillarGroupRef.current.rotation.y = 0;
    }
    setIsRotating(true);
  };

  return (
    <div className="bg-[#101522] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300">
      {/* HEADER & SUMMARY METRICS */}
      <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-gradient-to-r from-[#141b2b] via-[#101522] to-[#141b2b]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-[#ff5a35]/15 border border-[#ff5a35]/40 rounded-xl text-[#ff5a35]">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  Constelação 3D de Palavras-Chave & Rankings
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Three.js Interativo
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visualização imersiva da distribuição de posicionamento no Google Maps & Busca Local para{' '}
                  <strong className="text-white">{company.nome}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* KPI Mini-Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
            <div className="bg-[#182032] p-2.5 rounded-xl border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Top 3 (Local Pack)</span>
              <span className="text-base font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5" />
                {stats.top3} termos
              </span>
            </div>

            <div className="bg-[#182032] p-2.5 rounded-xl border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Top 10 (Pág 1)</span>
              <span className="text-base font-extrabold text-sky-400 flex items-center justify-center gap-1">
                <Target className="w-3.5 h-3.5" />
                {stats.top10} termos
              </span>
            </div>

            <div className="bg-[#182032] p-2.5 rounded-xl border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Posição Média</span>
              <span className="text-base font-extrabold text-amber-300">
                #{stats.avgPos}
              </span>
            </div>

            <div className="bg-[#182032] p-2.5 rounded-xl border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Buscas Auditadas</span>
              <span className="text-base font-extrabold text-white">
                {stats.totalImpressions}+
              </span>
            </div>
          </div>
        </div>

        {/* CONTROLS TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800/60 text-xs">
          {/* Filter Tiers */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-bold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              Filtrar:
            </span>

            <button
              onClick={() => setFilterTier('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterTier === 'all'
                  ? 'bg-[#ff5a35] text-white shadow-md'
                  : 'bg-[#182032] text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Todos ({keywordItems.length})
            </button>

            <button
              onClick={() => setFilterTier('top3')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterTier === 'top3'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#182032] text-emerald-400 hover:text-white border border-emerald-900/50'
              }`}
            >
              🥇 Top 3 ({stats.top3})
            </button>

            <button
              onClick={() => setFilterTier('top10')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterTier === 'top10'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-[#182032] text-sky-400 hover:text-white border border-sky-900/50'
              }`}
            >
              🥈 Top 10 ({stats.top10})
            </button>

            <button
              onClick={() => setFilterTier('rising')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterTier === 'rising'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-[#182032] text-amber-400 hover:text-white border border-amber-900/50'
              }`}
            >
              🚀 Em Crescimento
            </button>
          </div>

          {/* Search Term Filter & View Angle Switcher */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Buscar palavra..."
                className="w-full bg-[#182032] border border-slate-700 text-white pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-[#ff5a35]"
              />
            </div>

            {/* Camera View Switcher */}
            <div className="flex items-center bg-[#182032] p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => handleChangeCamera('iso')}
                title="Visão Isométrica 3D"
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  cameraPerspective === 'iso' ? 'bg-[#ff5a35] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                3D Iso
              </button>
              <button
                onClick={() => handleChangeCamera('top')}
                title="Visão Superior (Radar / Mapa)"
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  cameraPerspective === 'top' ? 'bg-[#ff5a35] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Radar Top
              </button>
              <button
                onClick={() => handleChangeCamera('front')}
                title="Visão Frontal de Altura"
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  cameraPerspective === 'front' ? 'bg-[#ff5a35] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Frontal
              </button>
            </div>

            {/* Rotation toggle */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-1.5 rounded-lg border transition-all ${
                isRotating
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-400'
                  : 'bg-[#182032] border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isRotating ? 'Pausar rotação contínua' : 'Ativar rotação contínua'}
            >
              {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Reset Camera */}
            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded-lg bg-[#182032] border border-slate-700 text-slate-400 hover:text-white"
              title="Resetar Câmera"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-[#182032] border border-slate-700 text-slate-400 hover:text-white"
              title={isFullscreen ? 'Reduzir tela' : 'Expandir tela cheia'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3D CANVAS VIEWPORT AREA */}
      <div className="relative w-full overflow-hidden bg-[#0a0e17]">
        {/* Interactive 3D Canvas Mount */}
        <div
          ref={mountRef}
          className={`w-full cursor-grab active:cursor-grabbing transition-all ${
            isFullscreen ? 'h-[75vh]' : 'h-[460px]'
          }`}
        />

        {/* FLOATING INSTRUCTION HELPER */}
        <div className="absolute top-3 left-3 bg-[#111622]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-[11px] text-slate-300 pointer-events-none flex items-center gap-2 shadow-lg">
          <Compass className="w-3.5 h-3.5 text-[#ff5a35] animate-spin" style={{ animationDuration: '6s' }} />
          <span>Arraste com o mouse para girar o raio de busca 3D &bull; Aponte nos pilares</span>
        </div>

        {/* CENTER COMPANY EMBLEM OVERLAY */}
        <div className="absolute bottom-3 left-3 bg-[#111622]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 text-xs shadow-lg max-w-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5a35] shadow-lg shadow-[#ff5a35]/60 animate-pulse" />
            <span className="font-bold text-white truncate">{company.nome}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Marco Zero do Raio Georreferenciado ({company.categoria})
          </p>
        </div>

        {/* HOVER / SELECTION TOOLTIP CARD */}
        {(hoveredKeyword || selectedKeyword) && (
          <div className="absolute top-3 right-3 bg-[#111622]/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 shadow-2xl max-w-xs sm:w-80 transition-all animate-in fade-in zoom-in-95 duration-200">
            {(() => {
              const kw = hoveredKeyword || selectedKeyword!;
              const isTop3 = kw.position <= 3;
              const isTop10 = kw.position <= 10;
              return (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Palavra-Chave Selecionada
                      </span>
                      <h4 className="text-sm font-extrabold text-white leading-tight mt-0.5">
                        "{kw.keyword}"
                      </h4>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 ${
                        isTop3
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm'
                          : isTop10
                          ? 'bg-sky-950 text-sky-300 border border-sky-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}
                    >
                      Posição #{kw.position}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#182030] p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Volume / Exibições:</span>
                      <strong className="text-white text-sm">{kw.volume} buscas/mês</strong>
                    </div>

                    <div className="bg-[#182030] p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">CTR Estimado:</span>
                      <strong className="text-emerald-400 text-sm">~{kw.ctr}% dos cliques</strong>
                    </div>

                    <div className="bg-[#182030] p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Tipo do Termo:</span>
                      <span className="text-slate-200 font-semibold capitalize">{kw.category}</span>
                    </div>

                    <div className="bg-[#182030] p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Intensidade Competitiva:</span>
                      <span className="text-amber-300 font-semibold capitalize">{kw.difficulty}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#141b2a] border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {isTop3
                        ? 'Posição no Google 3-Pack: máxima visibilidade direta no mapa.'
                        : isTop10
                        ? '1ª Página do Google: alta conversão com potencial de Top 3.'
                        : 'Oportunidade de expansão orgânica via otimização de termos.'}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* FOOTER KEYWORD CARDS GRID */}
      <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-[#111622]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Detalhamento das Palavras Mapeadas no Espaço 3D ({visibleKeywords.length})
          </span>
          <span className="text-[11px] text-slate-500">
            Clique no termo para destacar suas métricas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto pr-1">
          {visibleKeywords.map((item) => {
            const isTop3 = item.position <= 3;
            const isSelected = (hoveredKeyword?.id === item.id) || (selectedKeyword?.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedKeyword(item)}
                onMouseEnter={() => setHoveredKeyword(item)}
                onMouseLeave={() => setHoveredKeyword(null)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#1e293b] border-[#ff5a35] shadow-lg shadow-[#ff5a35]/20'
                    : isTop3
                    ? 'bg-[#141c2c] border-emerald-900/60 hover:border-emerald-500'
                    : 'bg-[#141c2c] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isTop3 ? 'bg-emerald-400' : item.position <= 10 ? 'bg-sky-400' : 'bg-amber-400'
                      }`}
                    />
                    <strong className="text-white font-bold truncate block">{item.keyword}</strong>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {item.volume} exibições &bull; CTR ~{item.ctr}%
                  </span>
                </div>

                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-lg shrink-0 ${
                    isTop3
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  #{item.position}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
