import React, { useRef, useEffect } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

const NeuralNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    // Create nodes - increased count and adjusted based on screen size
    const nodeCount = Math.min(Math.floor(window.innerWidth / 50), 40); // Increased density
    const nodes: Node[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8, // Increased speed
        vy: (Math.random() - 0.5) * 0.8, // Increased speed
        connections: []
      });
    }
    
    // Create more connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      const connectionCount = Math.floor(Math.random() * 5) + 2; // Increased connections
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodes.length);
        if (targetIndex !== i && !nodes[i].connections.includes(targetIndex)) {
          nodes[i].connections.push(targetIndex);
        }
      }
    }
    
    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.lineWidth = 1;
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        for (const targetIndex of node.connections) {
          const target = nodes[targetIndex];
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Increased connection distance
          if (distance < 400) {
            const alpha = Math.max(0, 1 - distance / 400);
            ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.5})`;
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            
            // Enhanced curve effect
            const midX = (node.x + target.x) / 2;
            const midY = (node.y + target.y) / 2 - 20 * Math.sin(Date.now() / 1000 + i);
            
            ctx.quadraticCurveTo(midX, midY, target.x, target.y);
            ctx.stroke();
            
            // Multiple data flow animations per connection
            for (let p = 0; p < 2; p++) {
              const pulseOffset = ((Date.now() / 1000 + i + p * 0.5) % 1);
              const pulseX = node.x + dx * pulseOffset;
              const pulseY = node.y + dy * pulseOffset;
              
              ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.8})`;
              ctx.beginPath();
              ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
      
      // Draw nodes with enhanced effects
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Enhanced node glow
        const glowRadius = 6 + Math.sin(Date.now() / 1000 + i) * 3;
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius * 2
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Node core with pulsing effect
        const coreSize = 3 + Math.sin(Date.now() / 500 + i) * 1;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(node.x, node.y, coreSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Update node position with boundary wrapping
        node.x += node.vx;
        node.y += node.vy;
        
        // Wrap around screen edges
        if (node.x < 0) node.x = canvas.width;
        if (node.x > canvas.width) node.x = 0;
        if (node.y < 0) node.y = canvas.height;
        if (node.y > canvas.height) node.y = 0;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateSize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
  );
};

export default NeuralNetwork;