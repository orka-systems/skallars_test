// Make class available globally
(function() {
  class J {
    constructor(e) {
      let { container: t, type: i } = e;
      this.container = t;
      this.params = {
        baseSize: 92,
        objectsCount: 15,
        duplicateFactor: 0.4,
        initRotate: { x: 0.1, y: 0.1, z: 0.8 },
        autoRotateNonAxis: true,
        objectsCountMobile: 11
      };
      this.gradientAngle = Math.random() * Math.PI * 2;
      this.isRendering = false;
      this.initTime = new Date() / 1000;
      this.init();
    }

    init() {
      if (!this.container) return;
      
      const canvas = document.createElement('canvas');
      this.container.appendChild(canvas);
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      
      this.resize();
      this.setupEvents();
      this.start();
    }

    resize() {
      if (!this.canvas) return;
      
      const rect = this.container.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      
      this.centerX = this.canvas.width / 2;
      this.centerY = this.canvas.height / 2;
    }

    setupEvents() {
      window.addEventListener('resize', () => this.resize());
    }

    start() {
      if (this.isRendering) return;
      this.isRendering = true;
      this.render();
    }

    stop() {
      this.isRendering = false;
    }

    render() {
      if (!this.isRendering) return;
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw spirograph
      this.ctx.strokeStyle = '#000';
      this.ctx.beginPath();
      
      const time = new Date() / 1000 - this.initTime;
      const scale = Math.min(this.canvas.width, this.canvas.height) * 0.4;
      
      for (let i = 0; i < 360; i++) {
        const angle = (i * Math.PI) / 180;
        const x = this.centerX + Math.cos(angle * 3 + time) * Math.cos(angle) * scale;
        const y = this.centerY + Math.cos(angle * 3 + time) * Math.sin(angle) * scale;
        
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      
      this.ctx.stroke();
      
      requestAnimationFrame(() => this.render());
    }
  }

  // Make J available globally
  window.J = J;
})();
