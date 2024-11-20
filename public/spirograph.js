// Global Spirograph initialization
window.J = {
  initAll: function() {
    document.querySelectorAll('[data-spirograph]').forEach(container => {
      const type = container.getAttribute('data-spirograph');
      new SpirographAnimation({ container, type });
    });
  }
};

class SpirographAnimation {
  constructor(options) {
    const { container, type } = options;
    this.container = container;
    this.params = {
      baseSize: 92,
      objectsCount: 15,
      duplicateFactor: 0.4,
      rotationSpeed: 0.5,
      lineWidth: 1,
      backgroundColor: '#ffffff',
      lineColor: '#000000',
      autoRotate: true,
      interactive: true
    };
    
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    this.resize();
    this.setupEvents();
    this.startAnimation();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
  }

  setupEvents() {
    window.addEventListener('resize', () => this.resize());
    if (this.params.interactive) {
      this.container.addEventListener('mousemove', (e) => {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.handleInteraction(x, y);
      });
    }
  }

  handleInteraction(x, y) {
    const dx = x - this.centerX;
    const dy = y - this.centerY;
    this.params.rotationSpeed = Math.sqrt(dx * dx + dy * dy) / 100;
  }

  startAnimation() {
    this.isAnimating = true;
    this.animate();
  }

  animate() {
    if (!this.isAnimating) return;

    this.ctx.fillStyle = this.params.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.strokeStyle = this.params.lineColor;
    this.ctx.lineWidth = this.params.lineWidth;

    const time = Date.now() / 1000;
    
    // Draw spirograph
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    
    for (let i = 0; i < this.params.objectsCount; i++) {
      const angle = (i / this.params.objectsCount) * Math.PI * 2 + time * this.params.rotationSpeed;
      const scale = 1 - (i / this.params.objectsCount) * this.params.duplicateFactor;
      
      this.ctx.save();
      this.ctx.rotate(angle);
      this.ctx.scale(scale, scale);
      
      this.drawSpirograph();
      
      this.ctx.restore();
    }
    
    this.ctx.restore();

    requestAnimationFrame(() => this.animate());
  }

  drawSpirograph() {
    const size = this.params.baseSize;
    const points = 100;
    
    this.ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * Math.PI * 2;
      const x = size * Math.cos(t) + size/2 * Math.cos(3 * t);
      const y = size * Math.sin(t) + size/2 * Math.sin(3 * t);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();
  }

  stop() {
    this.isAnimating = false;
  }
}
