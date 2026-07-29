import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import * as d3 from "d3";

export default function NetworkGraph({ nodes, edges }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [screenCoords, setScreenCoords] = useState([]);
  const [containerDimensions, setContainerDimensions] = useState({ width: 600, height: 450 });

  // Store references for Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const nodeMeshesRef = useRef([]);
  const linkLinesRef = useRef([]);
  const particlesRef = useRef([]);
  const animFrameIdRef = useRef(null);

  // Interaction State (Dragging / Rotation)
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.2, y: 0.4 });
  const targetRotationRef = useRef({ x: 0.2, y: 0.4 });
  const autoRotateRef = useRef(true);

  // Format edges cleanly and calculate 3D layout
  const processedData = useMemo(() => {
    if (!nodes || nodes.length === 0) return { nodes: [], edges: [] };

    // Deep clone nodes to avoid mutating props
    const formattedNodes = nodes.map((n, idx) => ({
      id: n.id ?? idx + 1,
      label: n.label || n.name || `Node ${idx + 1}`,
      score: n.score ?? 70,
      size: n.size ?? 12,
      industry: n.industry || "Supply Chain Partner",
      x: 0,
      y: 0,
      z: 0
    }));

    const nodeMap = new Map(formattedNodes.map(n => [n.id, n]));

    const formattedEdges = (edges || [])
      .map(e => {
        const sourceId = e.source ?? e.fromId ?? (Array.isArray(e) ? e[0] : null);
        const targetId = e.target ?? e.toId ?? (Array.isArray(e) ? e[1] : null);
        return {
          source: sourceId,
          target: targetId,
          sourceNode: nodeMap.get(sourceId),
          targetNode: nodeMap.get(targetId)
        };
      })
      .filter(e => e.sourceNode && e.targetNode);

    // 2D Force layout with d3 to compute balanced 2D positions
    const simulation = d3
      .forceSimulation(formattedNodes)
      .force(
        "link",
        d3
          .forceLink(formattedEdges)
          .id(d => d.id)
          .distance(120)
          .strength(0.6)
      )
      .force("charge", d3.forceManyBody().strength(-350))
      .force("center", d3.forceCenter(0, 0))
      .force("collision", d3.forceCollide().radius(45))
      .stop();

    // Run simulation synchronously
    for (let i = 0; i < 200; ++i) simulation.tick();

    // Add 3D Z depth variation based on distance from center & node index
    formattedNodes.forEach((node, i) => {
      const distFromCenter = Math.sqrt(node.x * node.x + node.y * node.y);
      if (node.id === 1 || node.label.toLowerCase().includes("your co")) {
        node.x = 0;
        node.y = 0;
        node.z = 40; // Elevate central node
      } else {
        const angle = (i / formattedNodes.length) * Math.PI * 2;
        node.z = Math.sin(angle) * 45 + (i % 2 === 0 ? 25 : -25);
      }
    });

    return { nodes: formattedNodes, edges: formattedEdges };
  }, [nodes, edges]);

  // Main Three.js Setup & Animation Loop
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || processedData.nodes.length === 0) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 450;
    setContainerDimensions({ width, height });

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(0, 0, 420);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight1.position.set(200, 300, 400);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    dirLight2.position.set(-200, -200, -200);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x4ade80, 1.5, 300);
    pointLight.position.set(0, 0, 50);
    scene.add(pointLight);

    // Group to hold all graph 3D objects for easy rotation
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // 3. Create Node Meshes
    nodeMeshesRef.current = [];

    processedData.nodes.forEach(node => {
      const isCentral = node.id === 1 || node.label.toLowerCase().includes("your co");
      const radius = isCentral ? 18 : 11;

      // Color selection based on score
      let colorHex = 0x4ade80; // Green (>=80)
      let emissiveHex = 0x15803d;
      if (node.score < 50) {
        colorHex = 0xef4444; // Red (<50)
        emissiveHex = 0xb91c1c;
      } else if (node.score < 80) {
        colorHex = 0xf59e0b; // Yellow/Amber (50-79)
        emissiveHex = 0xb45309;
      }

      const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.2,
        metalness: 0.7,
        emissive: emissiveHex,
        emissiveIntensity: isCentral ? 0.6 : 0.3
      });

      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(node.x, node.y, node.z);
      mesh.userData = { ...node, baseRadius: radius, isCentral };

      // Central node glowing aura ring
      if (isCentral) {
        const ringGeo = new THREE.RingGeometry(radius + 4, radius + 8, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x4ade80,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.name = "auraRing";
        mesh.add(ringMesh);
      }

      graphGroup.add(mesh);
      nodeMeshesRef.current.push(mesh);
    });

    // 4. Create Edges & Flow Particles
    linkLinesRef.current = [];
    particlesRef.current = [];

    processedData.edges.forEach(edge => {
      const srcNode = edge.sourceNode;
      const tgtNode = edge.targetNode;

      const p1 = new THREE.Vector3(srcNode.x, srcNode.y, srcNode.z);
      const p2 = new THREE.Vector3(tgtNode.x, tgtNode.y, tgtNode.z);

      // Line geometry
      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x64748b,
        transparent: true,
        opacity: 0.4,
        linewidth: 1.5
      });

      const lineMesh = new THREE.Line(lineGeo, lineMat);
      lineMesh.userData = { sourceId: srcNode.id, targetId: tgtNode.id };
      graphGroup.add(lineMesh);
      linkLinesRef.current.push(lineMesh);

      // Luminous data flow particle along edge
      const particleGeo = new THREE.SphereGeometry(2.5, 12, 12);
      const particleMat = new THREE.MeshBasicMaterial({
        color: srcNode.score >= 80 ? 0x4ade80 : 0x38bdf8,
        transparent: true,
        opacity: 0.9
      });
      const particleMesh = new THREE.Mesh(particleGeo, particleMat);

      particleMesh.userData = {
        p1,
        p2,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.005
      };

      graphGroup.add(particleMesh);
      particlesRef.current.push(particleMesh);
    });

    // 5. Resize Observer for 100% Responsiveness
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0) {
          setContainerDimensions({ width: newW, height: newH });
          if (cameraRef.current) {
            cameraRef.current.aspect = newW / newH;
            cameraRef.current.updateProjectionMatrix();
          }
          if (rendererRef.current) {
            rendererRef.current.setSize(newW, newH);
          }
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    // 6. Animation Loop
    let ringPulse = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Smooth Rotation
      if (autoRotateRef.current) {
        targetRotationRef.current.y += 0.003;
      }

      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.05;
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.05;

      graphGroup.rotation.x = rotationRef.current.x;
      graphGroup.rotation.y = rotationRef.current.y;

      // Pulse central aura ring
      ringPulse += 0.04;
      nodeMeshesRef.current.forEach(mesh => {
        if (mesh.userData.isCentral) {
          const aura = mesh.getObjectByName("auraRing");
          if (aura) {
            const scale = 1 + Math.sin(ringPulse) * 0.15;
            aura.scale.set(scale, scale, 1);
            aura.material.opacity = 0.4 + Math.sin(ringPulse) * 0.2;
          }
        }
      });

      // Animate edge data particles
      particlesRef.current.forEach(pt => {
        pt.userData.progress += pt.userData.speed;
        if (pt.userData.progress > 1) pt.userData.progress = 0;

        pt.position.lerpVectors(
          pt.userData.p1,
          pt.userData.p2,
          pt.userData.progress
        );
      });

      // Project 3D node coordinates to 2D HTML Screen overlay space
      const newScreenCoords = [];
      const tempVec = new THREE.Vector3();

      nodeMeshesRef.current.forEach(mesh => {
        mesh.getWorldPosition(tempVec);

        // Calculate depth relative to camera
        const depth = tempVec.distanceTo(camera.position);

        // Project vector to normalized device coordinates [-1, 1]
        tempVec.project(camera);

        const x = (tempVec.x * 0.5 + 0.5) * width;
        const y = (-(tempVec.y * 0.5) + 0.5) * height;

        newScreenCoords.push({
          id: mesh.userData.id,
          label: mesh.userData.label,
          score: mesh.userData.score,
          x,
          y,
          visible: tempVec.z < 1 // Only display if in front of camera frustum
        });
      });

      setScreenCoords(newScreenCoords);

      renderer.render(scene, camera);
    };

    animate();

    // Clean up on unmount
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (resizeObserver) resizeObserver.disconnect();
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [processedData]);

  // Handle Mouse Drag / Touch Rotation Controls
  const handleMouseDown = e => {
    isDraggingRef.current = true;
    autoRotateRef.current = false;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = e => {
    if (!isDraggingRef.current) {
      // Raycast for hover state detection
      if (canvasRef.current && cameraRef.current && sceneRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

        const intersects = raycaster.intersectObjects(nodeMeshesRef.current);
        if (intersects.length > 0) {
          const hoveredMesh = intersects[0].object;
          setHoveredNode(hoveredMesh.userData);
        } else {
          setHoveredNode(null);
        }
      }
      return;
    }

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x += deltaY * 0.008;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    // Resume auto-rotation after 3 seconds of inactivity
    setTimeout(() => {
      if (!isDraggingRef.current) autoRotateRef.current = true;
    }, 3000);
  };

  const handleWheel = e => {
    if (cameraRef.current) {
      cameraRef.current.position.z += e.deltaY * 0.2;
      cameraRef.current.position.z = Math.max(180, Math.min(700, cameraRef.current.position.z));
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[420px] relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 backdrop-blur-xl border border-white/10 select-none shadow-2xl"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Responsive Anti-Collision 3D Projected Badges */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {screenCoords.map(coord => {
          if (!coord.visible) return null;
          const isHovered = hoveredNode?.id === coord.id;

          let badgeColorClass = "border-emerald-500/40 bg-emerald-950/60 text-emerald-300";
          let dotColorClass = "bg-emerald-400";
          if (coord.score < 50) {
            badgeColorClass = "border-red-500/40 bg-red-950/60 text-red-300";
            dotColorClass = "bg-red-400";
          } else if (coord.score < 80) {
            badgeColorClass = "border-amber-500/40 bg-amber-950/60 text-amber-300";
            dotColorClass = "bg-amber-400";
          }

          return (
            <div
              key={coord.id}
              className={`absolute transition-all duration-150 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold backdrop-blur-md shadow-lg ${badgeColorClass} ${
                isHovered ? "scale-125 z-30 ring-2 ring-white border-white" : "scale-100 opacity-90 hover:opacity-100"
              }`}
              style={{
                left: `${coord.x}px`,
                top: `${coord.y - 24}px` // Offset badge clean above node sphere to prevent any overlapping
              }}
            >
              <span className={`w-2 h-2 rounded-full ${dotColorClass} animate-pulse`} />
              <span className="whitespace-nowrap tracking-wide">{coord.label}</span>
            </div>
          );
        })}
      </div>

      {/* Interactive 3D Orbit & Zoom Controls Overlay */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-gray-300">
        <span className="material-symbols-outlined text-sm text-sky-400">3d_rotation</span>
        <span>Drag to rotate 3D • Scroll to zoom</span>
      </div>

      {/* Rich Glassmorphism Node Detail Card on Hover */}
      {hoveredNode && (
        <div className="absolute top-4 right-4 z-30 w-72 bg-slate-950/90 backdrop-blur-2xl border border-white/20 p-4 rounded-xl shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <h4 className="font-bold text-white text-base truncate">{hoveredNode.label}</h4>
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                hoveredNode.score >= 80
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : hoveredNode.score >= 50
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : "bg-red-500/20 text-red-400 border border-red-500/40"
              }`}
            >
              {hoveredNode.score >= 80 ? "Healthy" : hoveredNode.score >= 50 ? "Warning" : "Critical"}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-300">
              <span className="text-gray-400">Industry:</span>
              <span className="font-medium text-white">{hoveredNode.industry}</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span className="text-gray-400">Trust Score:</span>
              <span
                className={`font-bold text-sm ${
                  hoveredNode.score >= 80 ? "text-emerald-400" : hoveredNode.score >= 50 ? "text-amber-400" : "text-red-400"
                }`}
              >
                {hoveredNode.score} / 100
              </span>
            </div>

            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  hoveredNode.score >= 80 ? "bg-emerald-400" : hoveredNode.score >= 50 ? "bg-amber-400" : "bg-red-400"
                }`}
                style={{ width: `${hoveredNode.score}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}