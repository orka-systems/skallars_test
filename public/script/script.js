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

    render() {
      if (!this.isRendering) return;

      const time = new Date() / 1000 - this.initTime;
      
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw spirograph
      const count = window.innerWidth < 768 ? this.params.objectsCountMobile : this.params.objectsCount;
      const size = Math.min(this.canvas.width, this.canvas.height) * 0.4;
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = this.centerX + Math.cos(angle + time * 0.5) * size;
        const y = this.centerY + Math.sin(angle + time * 0.5) * size;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * this.params.duplicateFactor, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsl(${(angle + time) * 30}, 70%, 60%)`;
        this.ctx.fill();
      }
      
      requestAnimationFrame(() => this.render());
    }

    stop() {
      this.isRendering = false;
    }
  }

  // Make J available globally with initAll function
  window.J = J;
  window.J.initAll = function() {
    const containers = document.querySelectorAll('[data-spirograph]');
    containers.forEach(container => {
      try {
        let options = {};
        const optionsAttr = container.getAttribute('data-spirograph-options');
        if (optionsAttr) {
          try {
            options = JSON.parse(optionsAttr);
          } catch (e) {
            console.warn('Invalid spirograph options:', e);
          }
        }
        new J({ container, options });
      } catch (e) {
        console.error('Failed to initialize spirograph:', e);
      }
    });
  };
})();
