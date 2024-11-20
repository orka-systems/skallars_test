class e {
  constructor(e) {
    if (("string" == typeof e && (e = document.querySelector(e)), e))
      return (
        (this.el = e),
        (this.enabled = !1),
        this.resize(),
        this.render(),
        (this.resize = this.resize.bind(this)),
        (this.render = this.render.bind(this)),
        this.start(),
        (this.el.Parallax = this),
        this
      );
  }
  start() {
    this.enabled ||
      ((this.enabled = !0),
      addEventListener("resize", this.resize),
      addEventListener("scroll", this.render));
  }
  stop() {
    this.enabled &&
      ((this.enabled = !1),
      removeEventListener("resize", this.resize),
      removeEventListener("scroll", this.render));
  }
  reset() {
    this.el.style.transform = "translate3d(0, 0, 0)";
  }
  resize() {
    let e = this.el;
    this.offsetTop = 0;
    do {
      (this.offsetTop += e.offsetTop || 0), (e = e.offsetParent);
    } while (e);
    this.render();
  }
  render() {
    let e = 100 / this.el.dataset.parallaxSpeed,
      t =
        scrollY / e -
        (this.offsetTop +
          this.el.offsetHeight / 2 -
          document.documentElement.clientHeight / 2) /
          e;
    this.el.style.transform = "translate3d(0px, " + t + "px, 0px)";
  }
}
function t(e) {
  let t = document.querySelector(e);
  if (!t) return;
  let i = t.querySelector("[data-flow-body]"),
    s = i.querySelectorAll("[data-flow-item]");
  if (!s.length) return;
  let n = t.dataset.flowBreakpoints.split(","),
    r = h();
  s = Array.prototype.map.call(s, (e) => {
    let { to: t, offset: i } = c(e);
    return { el: e, to: t, offset: i };
  });
  let a = v(),
    o = p(),
    l = null;
  function d() {
    (l = requestAnimationFrame(d)), u();
  }
  function c(e) {
    let t = e.dataset.flowTo.split(","),
      i = e.dataset.flowOffset.split(",");
    return {
      offset: +(void 0 !== i[r] ? i[r] : i[0]),
      to: +(void 0 !== t[r] ? t[r] : t[0]),
    };
  }
  function h() {
    let e = innerWidth,
      t = n.length - 1;
    return e > n[0] ? 0 : e < n[t] ? t + 1 : t;
  }
  function u() {
    (o = p()),
      s.forEach((e) => {
        let t = o * -e.to + e.offset;
        e.el.style.transform = "translate3d(0, ".concat(t, "px, 0)");
      });
  }
  function p() {
    return (scrollY - a.start) / a.dist;
  }
  function v() {
    let e = i.getBoundingClientRect(),
      t = e.top + scrollY - innerHeight;
    t = t > 0 ? t : 0;
    let s = e.height + innerHeight;
    return { dist: s, start: t, end: t + s };
  }
  new IntersectionObserver((e) => {
    e.forEach((e) => {
      e.isIntersecting
        ? (i.classList.add("_ready"), d())
        : (i.classList.remove("_ready"), cancelAnimationFrame(l), (l = null));
    });
  }).observe(t),
    s.length &&
      (addEventListener("resize", function () {
        (a = v()),
          (r = h()),
          s.forEach((e) => {
            let { to: t, offset: i } = c(e.el);
            (e.to = t), (e.offset = i);
          });
      }),
      u());
}

class i {
  constructor() {
    this.events = {};
  }
  on(e, t) {
    this.events[e] || (this.events[e] = []), this.events[e].push(t);
  }
  emit(e, t) {
    this.events[e] && this.events[e].forEach((e) => e.call(null, t));
  }
  off(e, t) {
    this.events[e] && (this.events[e] = this.events[e].filter((e) => e !== t));
  }
}
let s = {
  maskSelector: "[data-menu-mask]",
  openClass: "_open",
  animatingClass: "_animating",
  closingClass: "_closing",
  animationDuration: 500,
  openEventName: "dropdown:open",
  closeEventName: "dropdown:close",
};
class n extends i {
  constructor(e) {
    let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    super(),
      (this.options = Object.assign(t, s)),
      (this.el = e),
      this.el &&
        ((this.animationTimeout = null),
        (this._isOpen = this.el.classList.contains(this.options.openClass)));
  }
  set isOpen(e) {
    this._isOpen !== e &&
      (this.animationTimeout &&
        (clearTimeout(this.animationTimeout), (this.animationTimeout = null)),
      (this._isOpen = e),
      this.el.classList.add(this.options.animatingClass),
      this._isOpen
        ? this.el.classList.add(this.options.openClass)
        : this.el.classList.remove(this.options.openClass),
      (this.animationTimeout = setTimeout(() => {
        this.el.classList.remove(this.options.animatingClass),
          this.emit(
            this.isOpen
              ? this.options.openEventName
              : this.options.closeEventName
          ),
          (this.animationTimeout = null);
      }, this.options.animationDuration)));
  }
  get isOpen() {
    return this._isOpen;
  }
}
function r() {
  let e = document.querySelector("[data-submenu]");
  if (!e) return;
  let t,
    i,
    s = e.querySelector("[data-submenu-mask]"),
    n = document.querySelector("[data-submenu-open]"),
    r = !1;
  function a() {
    clearTimeout(t),
      (i = setTimeout(() => {
        o();
      }, 100));
  }
  function o() {
    n.classList.remove("_hover"),
      e.classList.remove("_open"),
      e.classList.add("_closing"),
      window.removeEventListener("scroll", o),
      s.addEventListener("transitionend", l),
      (r = !1);
  }
  function l() {
    s.removeEventListener("transitionend", l),
      r || e.classList.remove("_closing");
  }
  n &&
    ((s.style.paddingLeft = n.getBoundingClientRect().left + "px"),
    window.addEventListener("resize", function () {
      if (
        ((s.style.paddingLeft = n.getBoundingClientRect().left + "px"),
        window.innerWidth > 1130)
      )
        return;
      r && (o(), e.classList.remove("_closing"));
    }),
    n.addEventListener("mouseenter", function () {
      clearTimeout(i),
        (t = setTimeout(() => {
          n.classList.add("_hover"),
            e.classList.remove("_closing"),
            e.classList.add("_open"),
            window.addEventListener("scroll", o),
            s.addEventListener("transitionend", l),
            (r = !0);
        }, 100));
    }),
    n.addEventListener("mouseleave", a),
    s.addEventListener("mouseenter", () => clearTimeout(i)),
    s.addEventListener("mouseleave", a));
}
const a = (e, t) => {
  let i = new URL(t);
  return (i.search = new URLSearchParams(e).toString()), i.toString();
};
function o(e, t) {
  return function () {
    for (var i = arguments.length, s = new Array(i), n = 0; n < i; n++)
      s[n] = arguments[n];
    let r = this.lastCall;
    (this.lastCall = Date.now()),
      r && this.lastCall - r <= t && clearTimeout(this.lastCallTimer),
      (this.lastCallTimer = setTimeout(() => e(...s), t));
  };
}
let l = location.origin + "/assets/components/msearch2/action.php";
class d extends i {
  constructor(e) {
    super(),
      (this.el = e),
      (this.token = (function () {
        if (window.hasOwnProperty("mse2FormConfig")) {
          let e = window.mse2FormConfig;
          return Object.keys(e)[0];
        }
      })()),
      this.el &&
        this.token &&
        (this._onInput = o(this._onInput.bind(this), 250));
  }
  enable() {
    this.el.addEventListener("input", this._onInput);
  }
  focus() {
    this.el.focus();
  }
  async _onInput() {
    if (this.el.value)
      try {
        let e = await this._requestSuggestions();
        this.emit("success", e);
      } catch (e) {
        this.emit("error", e);
      }
  }
  async _requestSuggestions() {
    var e;
    let t = a(
        {
          action: "search",
          key: this.token,
          pageId: "31",
          query: this.el.value,
        },
        l
      ),
      i = await fetch(t, { method: "POST" }),
      s = await i.json();
    return (
      (null == s || null === (e = s.data) || void 0 === e
        ? void 0
        : e.results) || []
    );
  }
}
function c() {
  var e;
  let t = document.querySelector("[data-search-toggle]"),
    i = new n(document.querySelector("[data-search-dropdown]")),
    s = new d(document.querySelector("[data-search-input]")),
    r = document.querySelector("[data-search-suggests]"),
    a =
      null === (e = i.el) || void 0 === e
        ? void 0
        : e.querySelector("[data-dropdown-underlay]");
  if (!(t && i && s && r && a)) return;
  let o = {
    elements: [],
    activeIndex: -1,
    focus(e) {
      var t;
      null === (t = this.elements[e].querySelector("a")) ||
        void 0 === t ||
        t.focus();
    },
  };
  function l() {
    (i.isOpen = !1),
      t.classList.remove("_active"),
      removeEventListener("scroll", l),
      removeEventListener("keyup", c),
      removeEventListener("keydown", h);
  }
  function c(e) {
    "Escape" === e.code && l();
  }
  function h(e) {
    let t = e.code;
    if (["ArrowDown", "ArrowUp"].includes(t)) {
      switch ((e.preventDefault(), t)) {
        case "ArrowDown":
          o.activeIndex < o.elements.length - 1 && o.activeIndex++;
          break;
        case "ArrowUp":
          o.activeIndex > -1 && o.activeIndex--;
      }
      -1 === o.activeIndex ? s.focus() : o.focus(o.activeIndex);
    }
  }
  t &&
    i &&
    s &&
    r &&
    a &&
    (s.enable(),
    s.on("success", (e) => {
      (r.innerHTML = e
        .map((e) =>
          '<li><a href="'
            .concat(e.url, '">')
            .concat(e.value, "</a></li>")
            .replace(/<br\/?>/gi, "")
        )
        .join("")),
        (o.elements = r.children),
        (o.activeIndex = -1);
    }),
    a.addEventListener("click", l),
    t.addEventListener("click", function () {
      i.isOpen
        ? l()
        : ((i.isOpen = !0),
          t.classList.add("_active"),
          addEventListener("scroll", l, { passive: !0 }),
          addEventListener("keyup", c),
          addEventListener("keydown", h));
    }),
    i.on("dropdown:open", () => {
      s.focus(), (o.activeIndex = -1);
    }));
}
function h(e, t) {
  var i = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    t &&
      (s = s.filter(function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable;
      })),
      i.push.apply(i, s);
  }
  return i;
}
function u(e) {
  for (var t = 1; t < arguments.length; t++) {
    var i = null != arguments[t] ? arguments[t] : {};
    t % 2
      ? h(Object(i), !0).forEach(function (t) {
          p(e, t, i[t]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i))
      : h(Object(i)).forEach(function (t) {
          Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(i, t));
        });
  }
  return e;
}
function p(e, t, i) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: i,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = i),
    e
  );
}
let v = {
    gradCenter: { x: 0.5, y: 0.5 },
    gradColor1: { r: 191.25, g: 127.5, b: 255 },
    gradColor2: { r: 91.8, g: 200.6, b: 255 },
    gradColor3: { r: 153, g: 255, b: 153 },
    gradSize: 1,
  },
  f = (e) => "rgb(".concat(e.r, ", ").concat(e.g, ", ").concat(e.b, ")"),
  m = 0;
let g = [];
class w {
  constructor(e, t, i) {
    p(this, "draw", (e) => {
      (this.sum =
        this.point0.X + this.point0.Y + this.point1.X + this.point1.Y),
        -1 === g.indexOf(this.sum)
          ? (g.push(this.sum), (e.globalAlpha = this.alpha))
          : (e.globalAlpha = 0),
        e.beginPath(),
        e.moveTo(this.point0.X, this.point0.Y),
        e.lineTo(this.point1.X, this.point1.Y),
        e.closePath(),
        e.stroke();
    }),
      (this.point0 = e),
      (this.point1 = t),
      (this.alpha = null != i ? i : 1),
      (this.sum = e.X + e.Y + t.X + t.Y);
  }
  static eraseAll() {
    g = [];
  }
}
class S {
  constructor(e, t) {
    t && (this.parent = t),
      (this.xo = e[0]),
      (this.yo = e[1]),
      (this.zo = e[2]);
  }
}
function y(e) {
  let { x: t = 0, y: i = 0, z: s = 0 } = e;
  (this.cosY = Math.cos(i)),
    (this.sinY = Math.sin(i)),
    (this.cosX = Math.cos(t)),
    (this.sinX = Math.sin(t)),
    (this.cosZ = Math.cos(s)),
    (this.sinZ = Math.sin(s));
}
var b = (e, t, i) => {
  for (let s = 0; s < i.length; s++) {
    let n = i[s][0],
      r = i[s][1];
    e.lines.push(new w(t[n], t[r], 1));
  }
};
const T = Math.SQRT2;
class E {
  constructor(e) {
    let { scene: t, size: i, alpha: s } = e;
    (this.size = i),
      (this.points = []),
      (this.scene = t),
      (this.alpha = null != s ? s : 1),
      this.rotate(0, 0, 0);
    let n = [
      [i, 0, -i / T],
      [-i, 0, -i / T],
      [0, -i, i / T],
      [0, i, i / T],
    ];
    for (let e = 0; e < n.length; e++) this.points.push(new S(n[e]));
    this.createLines(this.scene, this.points, [
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 3],
      [3, 0],
      [3, 1],
    ]);
  }
}
(E.prototype.rotate = y), (E.prototype.createLines = b);
class x {
  constructor(e) {
    let { scene: t, size: i, alpha: s } = e;
    (this.size = i),
      (this.points = []),
      (this.scene = t),
      (this.alpha = null != s ? s : 1),
      this.rotate(0, 0, 0);
    let n = i / 2,
      r = [
        [-n, -n, -n],
        [n, -n, -n],
        [n, n, -n],
        [-n, n, -n],
        [-n, -n, n],
        [n, -n, n],
        [n, n, n],
        [-n, n, n],
      ];
    for (let e = 0; e < r.length; e++) this.points.push(new S(r[e]));
    this.createLines(this.scene, this.points, [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ]);
  }
}
(x.prototype.rotate = y), (x.prototype.createLines = b);
const C = 2 * Math.PI;
class M {
  constructor(e) {
    let { scene: t, size: i, alpha: s, segments: n, rings: r } = e,
      a = (this.size = i);
    (this.scene = t),
      (this.alpha = null != s ? s : 1),
      (this.points = []),
      (this.lines = []);
    let o = [],
      l = [],
      d = C / n,
      c = Math.PI / (r - 1),
      h = 0,
      u = 0;
    for (let e = 0; e < r; e += 1) {
      let t = Math.cos(c * e) * a;
      if (0 === e || e === r - 1) {
        if ((o.push([0, t, 0]), (h = o.length - 1), e === r - 1))
          for (u = 0; u < n; u += 1) l.push([h - u - 1, h]);
      } else {
        let i = Math.sin(c * e) * a;
        for (u = 0; u < n; u += 1) {
          let e = Math.sin(d * u) * i,
            s = Math.cos(d * u) * i;
          o.push([e, t, s]),
            (h = o.length - 1),
            h < n + 1 && l.push([0, h]),
            h > 1 && u > 0 && l.push([h - 1, h]),
            u === n - 1 && l.push([h - (n - 1), h]),
            h > n && l.push([h - n, h]);
        }
      }
    }
    for (let e = 0; e < o.length; e++) this.points.push(new S(o[e]));
    this.createLines(this.scene, this.points, l);
  }
}
(M.prototype.rotate = y), (M.prototype.createLines = b);
class L {
  constructor(e) {
    let { scene: t, radius: i, height: s, size: n, alpha: r, segments: a } = e;
    (this.radius = n * i),
      (this.height = n * s),
      (this.scene = t),
      (this.alpha = null != r ? r : 1),
      (this.segments = a),
      (this.pointNum = 0),
      (this.points = []),
      (this.lines = []),
      this.addPoint([0, 0, 0]),
      this.createHalf(1),
      this.createHalf(-1),
      this.createLines(this.scene, this.points, this.lines);
  }
  addPoint(e) {
    let t = this.points.push(new S(e));
    this.pointNum = t - 1;
  }
  createHalf() {
    let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
      t = this.height * e,
      i = this.pointNum + this.segments;
    for (let e = 0; e < this.segments; e++) {
      let s = Math.sin(((2 * Math.PI) / this.segments) * e) * this.radius,
        n = Math.cos(((2 * Math.PI) / this.segments) * e) * this.radius;
      this.addPoint([s, n, t]),
        this.lines.push([this.pointNum, 0]),
        this.lines.push([i, this.pointNum]),
        (i = this.pointNum);
    }
  }
}
(L.prototype.rotate = y), (L.prototype.createLines = b);
class P {
  constructor(e) {
    let { scene: t, size: i, height: s, segments: n = 4 } = e;
    (this.size = i / 2),
      (this.height = (this.size / 2) * s),
      (this.scene = t),
      (this.alpha = 1),
      (this.segments = n),
      (this.pointNum = 0),
      (this.points = []),
      (this.lines = []),
      this.rotate(0, 0, 0),
      (this.firstTopIdx = this.addPoint([0, 1.41 * this.height, 0])),
      (this.secondTopIdx = this.addPoint([0, 1.41 * -this.height, 0])),
      this.calcCoords(),
      this.createLines(this.scene, this.points, this.lines);
  }
  calcCoords() {
    let e = this.pointNum + this.segments;
    for (let t = 0; t < this.segments; t++) {
      let i = Math.sin(((2 * Math.PI) / this.segments) * t) * this.size,
        s = Math.cos(((2 * Math.PI) / this.segments) * t) * this.size;
      this.addPoint([i, 0, s]),
        this.lines.push(
          [this.pointNum, this.firstTopIdx],
          [this.pointNum, this.secondTopIdx],
          [e, this.pointNum]
        ),
        (e = this.pointNum);
    }
  }
  addPoint(e) {
    let t = this.points.push(new S(e));
    return (this.pointNum = t - 1);
  }
}
(P.prototype.rotate = y), (P.prototype.createLines = b);
class O {
  constructor(e) {
    let {
      scene: t,
      sections: i,
      baseSize: s,
      size: n,
      useBaseSize: r,
      radius: a,
      height: o,
      segments: l = 7,
    } = e;
    (this.scene = t),
      (this.radius = a),
      (this.height = o),
      r
        ? ((this.radius *= s), (this.height *= s))
        : ((this.radius *= n), (this.height *= n)),
      (this.segments = l),
      (this.pointNum = -1),
      (this.points = []),
      (this.lines = []),
      (this.sections = i),
      this.rotate(0, 0, 0),
      this.createSections(),
      this.createLines(this.scene, this.points, this.lines);
  }
  createSections() {
    for (let e = 0; e <= this.sections; e++) {
      let t = this.height * (e - this.sections / 2);
      this.createSlice(t);
    }
  }
  createSlice(e) {
    let t = this.pointNum + this.segments;
    for (let i = 0; i < this.segments; i++) {
      let s = Math.sin(((2 * Math.PI) / this.segments) * i) * this.radius,
        n = Math.cos(((2 * Math.PI) / this.segments) * i) * this.radius;
      this.addPoint([s, e, n]);
      let r = this.pointNum - this.segments;
      this.lines.push([t, this.pointNum]),
        r >= 0 && this.lines.push([this.pointNum, r]),
        (t = this.pointNum);
    }
  }
  addPoint(e) {
    this.points.push(new S(e)), this.pointNum++;
  }
}
(O.prototype.rotate = y), (O.prototype.createLines = b);
class z {
  constructor(e) {
    let { viscosity: t, initialValue: i = 0 } = e;
    (this.viscosity = t),
      (this.initialValue = i),
      (this.currentValue = i),
      (this.impactCyclesLeft = 0),
      (this.complete = !0);
  }
  impact(e) {
    let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
    (this.impactValue = e), (this.impactCyclesLeft = t);
  }
  getUpdated(e) {
    if (!e) return this.currentValue;
    this.impactCyclesLeft > 0
      ? ((e = this.impactValue), this.impactCyclesLeft--)
      : (this.impactValue = this.initialValue);
    let t = e - this.currentValue;
    return (
      (this.currentValue += t / this.viscosity),
      Math.abs(t) < this.viscosity / 1e4
        ? ((this.currentValue = e), (this.complete = !0))
        : (this.complete = !1),
      this.currentValue
    );
  }
}
let k,
  A = innerWidth / 2,
  _ = innerHeight / 2,
  I = A,
  R = _,
  D = A,
  N = _,
  W = D / innerWidth - 0.5,
  H = D / innerHeight - 0.5,
  q = {};
function j(e) {
  cancelAnimationFrame(k),
    (A = void 0 !== e.clientX ? e.clientX : e.touches[0].clientX),
    (_ = void 0 !== e.clientY ? e.clientY : e.touches[0].clientY),
    B();
}
function G() {
  (A = A > I ? innerWidth + 100 : -100), (_ = _ > R ? innerHeight + 100 : -100);
}
function B() {
  (I = q.x.getUpdated(A)),
    (R = q.y.getUpdated(_)),
    (D = q.x2.getUpdated(A)),
    (N = q.y2.getUpdated(_)),
    -1 !== Object.values(q).findIndex((e) => !e.complete) &&
      (k = requestAnimationFrame(() => B())),
    (W = D / innerWidth - 0.5),
    (H = N / innerHeight - 0.5),
    dispatchEvent(
      new CustomEvent("mousemove-inert", {
        detail: { mouseInertX: I, mouseInertY: R },
      })
    );
}
let Y = (e) => e && "object" == typeof e && !Array.isArray(e),
  F = function (e) {
    for (
      var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), s = 1;
      s < t;
      s++
    )
      i[s - 1] = arguments[s];
    if (!i.length) return e;
    const n = i.shift();
    if (Y(e) && Y(n))
      for (const t in n)
        Y(n[t])
          ? (e[t] || Object.assign(e, { [t]: {} }), F(e[t], n[t]))
          : Object.assign(e, { [t]: n[t] });
    return F(e, ...i);
  };
class V {
  constructor() {
    let { fadeRate: e = 0.02, maxValue: t = 1 } =
      arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    (this.maxValue = t),
      e > 1 && (e = 1),
      e < 0 && (e = 0),
      (this.unchargeFactor = 1 - e),
      (this.value = 0);
  }
  charge(e) {
    (this.value += e),
      this.value > this.maxValue && (this.value = this.maxValue);
  }
  use() {
    return (this.value *= this.unchargeFactor), this.value;
  }
}
var X, $;
let U = {
    baseSize: 92,
    objectsCount: 15,
    duplicateFactor: 0.4,
    centerX: 0.7,
    centerY: 0.32,
    perspective: 1e3,
    size: 1.2,
    radius: 1,
    radiusIncrement: 0,
    gradSpeed: 0.01,
    alphaMin: 0.7,
    lineWidth: +(null !== (X = localStorage.lineWidth) && void 0 !== X ? X : 1),
    height: 1,
    sections: 1,
    heightIncrement: 0,
    iterator: 0,
    useBaseSize: !1,
    mouseReactCoverage: 160,
    mouseReactPower: 30,
    wheelPower: 1e-4,
    mouseMaxRotate: 35,
    maxRotate: 180,
    timeShift: 10,
    rotateSpeed: 3,
    rotateAxis: "z",
    initRotate: {
      x: 0.1 * Math.random(),
      y: 0.1 * Math.random(),
      z: 0.1 * Math.random(),
    },
    heightCoefficient: 1.5,
  },
  Z = {
    lineWidth: +(null !== ($ = localStorage.lineWidthMini) && void 0 !== $
      ? $
      : 1.2),
    centerX: 0.5,
    centerY: 0.6,
    mouseReactPower: 15,
    maxRotate: 1800,
    rotateSpeed: 14,
  },
  K = new IntersectionObserver((e) => {
    e.forEach((e) => {
      e.isIntersecting && e.target.dispatchEvent(new CustomEvent("enter-view")),
        e.isIntersecting ||
          e.target.dispatchEvent(new CustomEvent("exit-view"));
    });
  });
export class J {
  constructor(e) {
    let { container: t, type: i } = e;
    (this.container = t),
      (this.params = u({}, U)),
      (this.gradientAngle = Math.random() * Math.PI * 2),
      (this.isRendering = !1),
      (this.initTime = new Date() / 1e3),
      this.container.hasAttribute("data-spirograph-mini") &&
        (this.params = F({}, this.params, Z));
    let s = this.container.dataset.spirographOptions;
    s && ((s = JSON.parse(s)), (this.params = F({}, this.params, s))),
      this.defineAxes(),
      (this.timeShift = this.params.timeShift),
      (this.maxRotateRad = (this.params.maxRotate / 180) * Math.PI),
      (this.rotateRadPerSec = (this.params.rotateSpeed / 180) * Math.PI),
      (this.mouseMaxRotateRad = (this.params.mouseMaxRotate / 180) * Math.PI),
      (this.angle = {
        [this.rotateAxis]: 0,
        [this.axisMouseX]: 0,
        [this.axisMouseY]: 0,
      }),
      (this.type = i),
      (this.dir = 1),
      (this.canvas = this.container.querySelector("[data-spirograph-canvas]")),
      (this.ctx = this.canvas.getContext("2d")),
      (this.ctx.lineWidth = this.params.lineWidth),
      (this.zoom = this.params.perspective * this.params.size),
      K.observe(this.canvas),
      (this.pageMouseX = -100),
      (this.pageMouseY = -100),
      this.updateMouse(),
      (this.wheelAddedTime = 0),
      (this.wheelPower = new V()),
      this.resize(),
      this.setup(),
      this.updateGradient(),
      this.incrementRotation(),
      addEventListener("wheel", (e) => {
        let { wheelDelta: t } = e,
          i = Math.abs(t * this.params.wheelPower);
        this.wheelPower.charge(i);
      }),
      addEventListener("resize", this.resize.bind(this), !1),
      addEventListener("mousemove-inert", (e) => {
        let { detail: t } = e;
        (this.pageMouseX = t.mouseInertX),
          (this.pageMouseY = t.mouseInertY),
          this.updateMouse();
      }),
      this.canvas.addEventListener("enter-view", () => this.startAnimation()),
      this.canvas.addEventListener("exit-view", () => this.stopAnimation()),
      document.addEventListener("visibilitychange", () => {
        document.hidden ? this.stopAnimation() : this.startAnimation();
      });
  }
  defineAxes() {
    let e = ["x", "y", "z"];
    (this.rotateAxis = this.params.rotateAxis),
      (e = e.filter((e) => e !== this.rotateAxis)),
      (this.axisMouseY = e.pop()),
      (this.axisMouseX = e.pop());
  }
  updateGradient() {
    this.gradient = (function (e) {
      let t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : v,
        i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : m;
      (t = Object.assign({}, v, t)), null != i && (m = i);
      let s = e.width,
        n = e.height,
        r = (0.5 + t.gradCenter.x * Math.cos(i)) * s,
        a = (0.5 + t.gradCenter.y * Math.sin(i)) * n,
        o = Math.sqrt((0.4 * s) ** 2 + n ** 2) * t.gradSize,
        l = e.canvas.getContext("2d").createRadialGradient(r, a, 0, r, a, o),
        d = f(t.gradColor1),
        c = f(t.gradColor2),
        h = f(t.gradColor3);
      return (
        l.addColorStop(0, d),
        l.addColorStop(0.4, c),
        l.addColorStop(0.6, c),
        l.addColorStop(1, h),
        l
      );
    })(this, this.params, this.gradientAngle);
  }
  updateMouse() {
    let e = this.canvas.getBoundingClientRect();
    (this.mouseX = this.pageMouseX - e.left),
      (this.mouseY = this.pageMouseY - e.top);
  }
  resize() {
    (this.width = this.container.offsetWidth),
      (this.height =
        this.container.offsetHeight * this.params.heightCoefficient),
      (this.scale = 0.4 + innerWidth / 2800),
      this.resizeForRetina(),
      this.updateMouse(),
      this.updateGradient();
  }
  resizeForRetina() {
    let e = this.width,
      t = this.height,
      i = devicePixelRatio;
    (this.canvas.width = e * i),
      (this.canvas.height = t * i),
      this.ctx.scale(i, i),
      (this.canvas.style.width = e + "px"),
      (this.canvas.style.height = t + "px"),
      (this.ctx.lineWidth = this.params.lineWidth);
  }
  set scale(e) {
    this.objects && this.objects.forEach((t) => (t.scale = e)),
      (this.currentScale = e || 1);
  }
  get scale() {
    return this.currentScale;
  }
  setup() {
    let {
      objectsCount: e,
      objectsCountMobile: t,
      alphaMin: i,
      iterator: s,
    } = this.params;
    (this.objects = []), (this.lines = []);
    let n = { scene: this, size: this.params.baseSize };
    innerWidth < 760 && t && (e = t);
    for (let t = 0; t < e; t++) {
      let r;
      n.alpha = i + ((1 - i) * t) / e;
      let a = this.params.segments + t * s,
        o = this.params.rings + t * s,
        l = this.params.height + this.params.heightIncrement * (t + 1),
        d = this.params.radius + this.params.radiusIncrement * (t + 1);
      switch (this.type) {
        case "tetra":
          r = new E(n);
          break;
        case "cube":
          r = new x(n);
          break;
        case "globe":
          r = new M(u(u({}, n), {}, { segments: a, rings: o }));
          break;
        case "hourglass":
          r = new L(u(u({}, n), {}, { segments: a, radius: d, height: l }));
          break;
        case "pyramid":
          r = new P(u(u({}, n), {}, { height: l, segments: a }));
          break;
        case "cylinder":
          r = new O(
            u(
              u({}, n),
              {},
              {
                segments: a,
                baseSize: this.params.baseSize,
                sections: this.params.sections,
                radius: d,
                height: l,
              }
            )
          );
      }
      this.objects.push(r),
        (n.size += this.params.duplicateFactor * this.params.baseSize);
    }
  }
  projectPoint(e, t) {
    let i = t.cosY * (t.sinZ * e.yo + t.cosZ * e.xo) - t.sinY * e.zo,
      s =
        t.sinX * (t.cosY * e.zo + t.sinY * (t.sinZ * e.yo + t.cosZ * e.xo)) +
        t.cosX * (t.cosZ * e.yo - t.sinZ * e.xo),
      n =
        t.cosX * (t.cosY * e.zo + t.sinY * (t.sinZ * e.yo + t.cosZ * e.xo)) -
        t.sinX * (t.cosZ * e.yo - t.sinZ * e.xo);
    (i *= this.scale), (s *= this.scale), (n *= this.scale);
    let r =
        this.width * this.params.centerX +
        (i * this.params.perspective) / (n + this.zoom),
      a =
        this.height * this.params.centerY +
        (s * this.params.perspective) / (n + this.zoom),
      o = this.mouseShift(r, a);
    (e.X = o[0]), (e.Y = o[1]);
  }
  prepareFrame() {
    w.eraseAll(),
      this.ctx.save(),
      this.updateGradient(),
      (this.gradientAngle += this.params.gradSpeed),
      this.ctx.clearRect(0, 0, this.width, this.height),
      (this.ctx.strokeStyle = this.gradient);
  }
  renderLoop() {
    this.isRendering &&
      (this.render(),
      (this.frameId = requestAnimationFrame(() => this.renderLoop())));
  }
  render() {
    let { objectsCount: e, initRotate: t, rotateAxis: i } = this.params,
      { axisMouseX: s, axisMouseY: n } = this;
    this.prepareFrame();
    let r,
      a = 0;
    for (; (r = this.objects[a++]); ) {
      let o = a / e,
        l = W * this.mouseMaxRotateRad,
        d = H * this.mouseMaxRotateRad,
        c = {
          [i]: t[i] + o * this.angle[i],
          [s]: t[s] + o * l,
          [n]: t[n] + o * d,
        };
      r.rotate(c);
      for (let e = 0; e < r.points.length; e++)
        this.projectPoint(r.points[e], r);
    }
    this.incrementRotation(), this.drawAllLines();
  }
  incrementRotation() {
    this.wheelAddedTime += this.wheelPower.use();
    let e =
      ((this.timeShift +
        new Date() / 1e3 +
        this.wheelAddedTime -
        this.initTime) *
        this.rotateRadPerSec) /
      this.maxRotateRad;
    this.angle[this.rotateAxis] = Math.sin(e) * this.maxRotateRad;
  }
  drawAllLines() {
    let e,
      t = 0;
    for (; (e = this.lines[t++]); ) e.draw(this.ctx);
    this.ctx.restore();
  }
  startAnimation() {
    this.isRendering ||
      ((this.isRendering = !0),
      (this.frameId = requestAnimationFrame(() => this.renderLoop())));
  }
  stopAnimation() {
    (this.isRendering = !1),
      cancelAnimationFrame(this.frameId),
      (this.frameId = null);
  }
  mouseShift(e, t) {
    let i = this.params.mouseReactCoverage,
      s = this.params.mouseReactPower,
      n = e - this.mouseX,
      r = t - this.mouseY,
      a = 0,
      o = 0;
    if (Math.sqrt(n ** 2 + r ** 2) < i) {
      let e = s / i,
        t = Math.atan2(r, n);
      (a = (Math.cos(t) * i - n) * e), (o = (Math.sin(t) * i - r) * e);
    }
    return [e + a, t + o];
  }
  static initAll() {
    let e = [];

    console.log("init all", document.querySelectorAll("[data-spirograph]"));
    return (
      document.querySelectorAll("[data-spirograph]").forEach((t) => {
        e.push(new J({ container: t, type: t.dataset.spirograph }));
      }),
      e
    );
  }
}
let Q = (e) => {
  let t,
    i,
    s = e.getContext("webgl", { preserveDrawingBuffer: !0 }),
    n = 0,
    r = 0,
    a = new Date().getTime(),
    o = 1e4 * Math.random();
  function l(e, t) {
    (this.name = e),
      (this.suffix = t),
      (this.location = s.getUniformLocation(c, e));
  }
  function d(e) {
    let t = e.createBuffer();
    e.bindBuffer(e.ARRAY_BUFFER, t),
      e.bufferData(e.ARRAY_BUFFER, d.verts, e.STATIC_DRAW);
  }
  (a -= o),
    (l.prototype.set = function () {
      let e = "uniform" + this.suffix;
      for (var t = arguments.length, i = new Array(t), n = 0; n < t; n++)
        i[n] = arguments[n];
      let r = [this.location].concat(i);
      s[e].apply(s, r);
    }),
    (d.verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])),
    (d.prototype.render = function (e) {
      e.drawArrays(e.TRIANGLE_STRIP, 0, 4);
    });
  let c = s.createProgram();
  m(
    "#define GLSLIFY 1\nattribute vec2 a_position;void main(){gl_Position=vec4(a_position,0,1);}",
    s.VERTEX_SHADER
  ),
    m(
      "#ifdef GL_ES\nprecision mediump float;\n#define GLSLIFY 1\n#endif\nuniform vec2 u_resolution;uniform float u_time;vec3 colorGreen=vec3(.67,.91,.80);vec3 colorBlue=vec3(.67,.84,.98);vec3 colorCyan=vec3(.67,.83,.86);vec3 colorViolet=vec3(.73,.73,.95);vec3 colorWhite=vec3(1.,1.,1.);mat2 Rot(float a){float s=sin(a);float c=cos(a);return mat2(c,-s,s,c);}vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}float noise(in vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}void main(){vec2 uv=gl_FragCoord.xy/u_resolution.xy;float ratio=u_resolution.x/u_resolution.y;vec2 tuv=uv;tuv-=.5;float degree=noise(vec2(u_time*.3,tuv.x*tuv.y));tuv.y*=1./ratio;tuv*=Rot(radians((degree-.5)*720.+180.));tuv.y*=ratio;float frequency=5.;float amplitude=30.;float speed=u_time*2.;tuv.x+=sin(tuv.y*frequency*1.618+speed)/amplitude;tuv.y+=sin(tuv.x*frequency+speed)/(amplitude*.5);vec3 layer1=mix(colorCyan,colorBlue,smoothstep(-.3,.2,(tuv*Rot(radians(-5.))).x));vec3 layer2=mix(colorViolet,colorGreen,smoothstep(-.3,.2,(tuv*Rot(radians(-5.))).x));vec3 finalComp=mix(layer1,layer2,smoothstep(.5,-.3,tuv.y));vec3 color=finalComp;float progress=(u_resolution.y-gl_FragCoord.y)/u_resolution.y;color=mix(colorWhite,color,progress);gl_FragColor=vec4(color,1.0);}",
      s.FRAGMENT_SHADER
    ),
    s.linkProgram(c),
    s.useProgram(c);
  let h = new l("u_resolution", "2f"),
    u = new l("u_mouse", "2f"),
    p = new l("u_time", "1f"),
    v = new d(s),
    f = s.getAttribLocation(c, "a_position");
  function m(e, t) {
    let i = s.createShader(t);
    if (
      (s.shaderSource(i, e),
      s.compileShader(i),
      !s.getShaderParameter(i, s.COMPILE_STATUS))
    )
      throw new Error("Shader compile error: " + s.getShaderInfoLog(i));
    s.attachShader(c, i);
  }
  function g() {
    (t = e.width = innerWidth),
      (i = e.height = innerHeight),
      h.set(t, i),
      s.viewport(0, 0, t, i);
  }
  s.enableVertexAttribArray(f),
    s.vertexAttribPointer(f, 2, s.FLOAT, !1, 0, 0),
    g(),
    (function e() {
      let t = (new Date().getTime() - a) / 1e3;
      p.set(t), u.set(n, r), v.render(s), requestAnimationFrame(e);
    })(),
    addEventListener("resize", g),
    document.addEventListener("mousemove", function (e) {
      (n = e.pageX), (r = i - e.pageY);
    });
};
function ee() {
  let e = document.querySelectorAll("[data-line]");
  if (!e) return;
  let t = new IntersectionObserver((e) => {
    e.forEach((e) => {
      e.isIntersecting && e.target.classList.add("is-inview");
    });
  });
  for (let i = 0; i < e.length; i++) t.observe(e[i]);
  window.addEventListener("page-content-updated", () => {
    for (let i = 0; i < e.length; i++) t.unobserve(e[i]);
    e = document.querySelectorAll("[data-line]");
    for (let i = 0; i < e.length; i++) t.observe(e[i]);
  });
}
function te(e) {
  return (
    null !== e &&
    "object" == typeof e &&
    "constructor" in e &&
    e.constructor === Object
  );
}
function ie(e, t) {
  void 0 === e && (e = {}),
    void 0 === t && (t = {}),
    Object.keys(t).forEach(function (i) {
      void 0 === e[i]
        ? (e[i] = t[i])
        : te(t[i]) &&
          te(e[i]) &&
          Object.keys(t[i]).length > 0 &&
          ie(e[i], t[i]);
    });
}
var se = {
  body: {},
  addEventListener: function () {},
  removeEventListener: function () {},
  activeElement: { blur: function () {}, nodeName: "" },
  querySelector: function () {
    return null;
  },
  querySelectorAll: function () {
    return [];
  },
  getElementById: function () {
    return null;
  },
  createEvent: function () {
    return { initEvent: function () {} };
  },
  createElement: function () {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute: function () {},
      getElementsByTagName: function () {
        return [];
      },
    };
  },
  createElementNS: function () {
    return {};
  },
  importNode: function () {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: "",
  },
};
function ne() {
  var e = "undefined" != typeof document ? document : {};
  return ie(e, se), e;
}
var re = {
  document: se,
  navigator: { userAgent: "" },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: "",
  },
  history: {
    replaceState: function () {},
    pushState: function () {},
    go: function () {},
    back: function () {},
  },
  CustomEvent: function () {
    return this;
  },
  addEventListener: function () {},
  removeEventListener: function () {},
  getComputedStyle: function () {
    return {
      getPropertyValue: function () {
        return "";
      },
    };
  },
  Image: function () {},
  Date: function () {},
  screen: {},
  setTimeout: function () {},
  clearTimeout: function () {},
  matchMedia: function () {
    return {};
  },
  requestAnimationFrame: function (e) {
    return "undefined" == typeof setTimeout ? (e(), null) : setTimeout(e, 0);
  },
  cancelAnimationFrame: function (e) {
    "undefined" != typeof setTimeout && clearTimeout(e);
  },
};
function ae() {
  var e = "undefined" != typeof window ? window : {};
  return ie(e, re), e;
}
function oe(e) {
  return (
    (oe = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (e) {
          return e.__proto__ || Object.getPrototypeOf(e);
        }),
    oe(e)
  );
}
function le(e, t) {
  return (
    (le =
      Object.setPrototypeOf ||
      function (e, t) {
        return (e.__proto__ = t), e;
      }),
    le(e, t)
  );
}
function de() {
  if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
  if (Reflect.construct.sham) return !1;
  if ("function" == typeof Proxy) return !0;
  try {
    return (
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {})),
      !0
    );
  } catch (e) {
    return !1;
  }
}
function ce(e, t, i) {
  return (
    (ce = de()
      ? Reflect.construct
      : function (e, t, i) {
          var s = [null];
          s.push.apply(s, t);
          var n = new (Function.bind.apply(e, s))();
          return i && le(n, i.prototype), n;
        }),
    ce.apply(null, arguments)
  );
}
function he(e) {
  var t = "function" == typeof Map ? new Map() : void 0;
  return (
    (he = function (e) {
      if (
        null === e ||
        ((i = e), -1 === Function.toString.call(i).indexOf("[native code]"))
      )
        return e;
      var i;
      if ("function" != typeof e)
        throw new TypeError(
          "Super expression must either be null or a function"
        );
      if (void 0 !== t) {
        if (t.has(e)) return t.get(e);
        t.set(e, s);
      }
      function s() {
        return ce(e, arguments, oe(this).constructor);
      }
      return (
        (s.prototype = Object.create(e.prototype, {
          constructor: {
            value: s,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        })),
        le(s, e)
      );
    }),
    he(e)
  );
}
var ue = (function (e) {
  var t, i;
  function s(t) {
    var i, s, n;
    return (
      (i = e.call.apply(e, [this].concat(t)) || this),
      (s = (function (e) {
        if (void 0 === e)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        return e;
      })(i)),
      (n = s.__proto__),
      Object.defineProperty(s, "__proto__", {
        get: function () {
          return n;
        },
        set: function (e) {
          n.__proto__ = e;
        },
      }),
      i
    );
  }
  return (
    (i = e),
    ((t = s).prototype = Object.create(i.prototype)),
    (t.prototype.constructor = t),
    (t.__proto__ = i),
    s
  );
})(he(Array));
function pe(e) {
  void 0 === e && (e = []);
  var t = [];
  return (
    e.forEach(function (e) {
      Array.isArray(e) ? t.push.apply(t, pe(e)) : t.push(e);
    }),
    t
  );
}
function ve(e, t) {
  return Array.prototype.filter.call(e, t);
}
function fe(e, t) {
  var i = ae(),
    s = ne(),
    n = [];
  if (!t && e instanceof ue) return e;
  if (!e) return new ue(n);
  if ("string" == typeof e) {
    var r = e.trim();
    if (r.indexOf("<") >= 0 && r.indexOf(">") >= 0) {
      var a = "div";
      0 === r.indexOf("<li") && (a = "ul"),
        0 === r.indexOf("<tr") && (a = "tbody"),
        (0 !== r.indexOf("<td") && 0 !== r.indexOf("<th")) || (a = "tr"),
        0 === r.indexOf("<tbody") && (a = "table"),
        0 === r.indexOf("<option") && (a = "select");
      var o = s.createElement(a);
      o.innerHTML = r;
      for (var l = 0; l < o.childNodes.length; l += 1) n.push(o.childNodes[l]);
    } else
      n = (function (e, t) {
        if ("string" != typeof e) return [e];
        for (var i = [], s = t.querySelectorAll(e), n = 0; n < s.length; n += 1)
          i.push(s[n]);
        return i;
      })(e.trim(), t || s);
  } else if (e.nodeType || e === i || e === s) n.push(e);
  else if (Array.isArray(e)) {
    if (e instanceof ue) return e;
    n = e;
  }
  return new ue(
    (function (e) {
      for (var t = [], i = 0; i < e.length; i += 1)
        -1 === t.indexOf(e[i]) && t.push(e[i]);
      return t;
    })(n)
  );
}
fe.fn = ue.prototype;
var me,
  ge,
  we,
  Se = {
    addClass: function () {
      for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
        t[i] = arguments[i];
      var s = pe(
        t.map(function (e) {
          return e.split(" ");
        })
      );
      return (
        this.forEach(function (e) {
          var t;
          (t = e.classList).add.apply(t, s);
        }),
        this
      );
    },
    removeClass: function () {
      for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
        t[i] = arguments[i];
      var s = pe(
        t.map(function (e) {
          return e.split(" ");
        })
      );
      return (
        this.forEach(function (e) {
          var t;
          (t = e.classList).remove.apply(t, s);
        }),
        this
      );
    },
    hasClass: function () {
      for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
        t[i] = arguments[i];
      var s = pe(
        t.map(function (e) {
          return e.split(" ");
        })
      );
      return (
        ve(this, function (e) {
          return (
            s.filter(function (t) {
              return e.classList.contains(t);
            }).length > 0
          );
        }).length > 0
      );
    },
    toggleClass: function () {
      for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
        t[i] = arguments[i];
      var s = pe(
        t.map(function (e) {
          return e.split(" ");
        })
      );
      this.forEach(function (e) {
        s.forEach(function (t) {
          e.classList.toggle(t);
        });
      });
    },
    attr: function (e, t) {
      if (1 === arguments.length && "string" == typeof e)
        return this[0] ? this[0].getAttribute(e) : void 0;
      for (var i = 0; i < this.length; i += 1)
        if (2 === arguments.length) this[i].setAttribute(e, t);
        else
          for (var s in e) (this[i][s] = e[s]), this[i].setAttribute(s, e[s]);
      return this;
    },
    removeAttr: function (e) {
      for (var t = 0; t < this.length; t += 1) this[t].removeAttribute(e);
      return this;
    },
    transform: function (e) {
      for (var t = 0; t < this.length; t += 1) this[t].style.transform = e;
      return this;
    },
    transition: function (e) {
      for (var t = 0; t < this.length; t += 1)
        this[t].style.transitionDuration = "string" != typeof e ? e + "ms" : e;
      return this;
    },
    on: function () {
      for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
        t[i] = arguments[i];
      var s = t[0],
        n = t[1],
        r = t[2],
        a = t[3];
      function o(e) {
        var t = e.target;
        if (t) {
          var i = e.target.dom7EventData || [];
          if ((i.indexOf(e) < 0 && i.unshift(e), fe(t).is(n))) r.apply(t, i);
          else
            for (var s = fe(t).parents(), a = 0; a < s.length; a += 1)
              fe(s[a]).is(n) && r.apply(s[a], i);
        }
      }
      function l(e) {
        var t = (e && e.target && e.target.dom7EventData) || [];
        t.indexOf(e) < 0 && t.unshift(e), r.apply(this, t);
      }
      "function" == typeof t[1] &&
        ((s = t[0]), (r = t[1]), (a = t[2]), (n = void 0)),
        a || (a = !1);
      for (var d, c = s.split(" "), h = 0; h < this.length; h += 1) {
        var u = this[h];
        if (n)
          for (d = 0; d < c.length; d += 1) {
            var p = c[d];
            u.dom7LiveListeners || (u.dom7LiveListeners = {}),
              u.dom7LiveListeners[p] || (u.dom7LiveListeners[p] = []),
              u.dom7LiveListeners[p].push({ listener: r, proxyListener: o }),
              u.addEventListener(p, o, a);
          }
        else
          for (d = 0; d < c.length; d += 1) {
            var v = c[d];
            u.dom7Listeners || (u.dom7Listeners = {}),
              u.dom7Listeners[v] || (u.dom7Listeners[v] = []),
              u.dom7Listeners[v].push({ listener: r, proxyListener: l }),
              u.addEventListener(v, l, a);
          }
      }
      return this;
    },
    off: function () {
      for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
        t[i] = arguments[i];
      var s = t[0],
        n = t[1],
        r = t[2],
        a = t[3];
      "function" == typeof t[1] &&
        ((s = t[0]), (r = t[1]), (a = t[2]), (n = void 0)),
        a || (a = !1);
      for (var o = s.split(" "), l = 0; l < o.length; l += 1)
        for (var d = o[l], c = 0; c < this.length; c += 1) {
          var h = this[c],
            u = void 0;
          if (
            (!n && h.dom7Listeners
              ? (u = h.dom7Listeners[d])
              : n && h.dom7LiveListeners && (u = h.dom7LiveListeners[d]),
            u && u.length)
          )
            for (var p = u.length - 1; p >= 0; p -= 1) {
              var v = u[p];
              (r && v.listener === r) ||
              (r &&
                v.listener &&
                v.listener.dom7proxy &&
                v.listener.dom7proxy === r)
                ? (h.removeEventListener(d, v.proxyListener, a), u.splice(p, 1))
                : r ||
                  (h.removeEventListener(d, v.proxyListener, a),
                  u.splice(p, 1));
            }
        }
      return this;
    },
    trigger: function () {
      for (
        var e = ae(), t = arguments.length, i = new Array(t), s = 0;
        s < t;
        s++
      )
        i[s] = arguments[s];
      for (var n = i[0].split(" "), r = i[1], a = 0; a < n.length; a += 1)
        for (var o = n[a], l = 0; l < this.length; l += 1) {
          var d = this[l];
          if (e.CustomEvent) {
            var c = new e.CustomEvent(o, {
              detail: r,
              bubbles: !0,
              cancelable: !0,
            });
            (d.dom7EventData = i.filter(function (e, t) {
              return t > 0;
            })),
              d.dispatchEvent(c),
              (d.dom7EventData = []),
              delete d.dom7EventData;
          }
        }
      return this;
    },
    transitionEnd: function (e) {
      var t = this;
      return (
        e &&
          t.on("transitionend", function i(s) {
            s.target === this && (e.call(this, s), t.off("transitionend", i));
          }),
        this
      );
    },
    outerWidth: function (e) {
      if (this.length > 0) {
        if (e) {
          var t = this.styles();
          return (
            this[0].offsetWidth +
            parseFloat(t.getPropertyValue("margin-right")) +
            parseFloat(t.getPropertyValue("margin-left"))
          );
        }
        return this[0].offsetWidth;
      }
      return null;
    },
    outerHeight: function (e) {
      if (this.length > 0) {
        if (e) {
          var t = this.styles();
          return (
            this[0].offsetHeight +
            parseFloat(t.getPropertyValue("margin-top")) +
            parseFloat(t.getPropertyValue("margin-bottom"))
          );
        }
        return this[0].offsetHeight;
      }
      return null;
    },
    styles: function () {
      var e = ae();
      return this[0] ? e.getComputedStyle(this[0], null) : {};
    },
    offset: function () {
      if (this.length > 0) {
        var e = ae(),
          t = ne(),
          i = this[0],
          s = i.getBoundingClientRect(),
          n = t.body,
          r = i.clientTop || n.clientTop || 0,
          a = i.clientLeft || n.clientLeft || 0,
          o = i === e ? e.scrollY : i.scrollTop,
          l = i === e ? e.scrollX : i.scrollLeft;
        return { top: s.top + o - r, left: s.left + l - a };
      }
      return null;
    },
    css: function (e, t) {
      var i,
        s = ae();
      if (1 === arguments.length) {
        if ("string" != typeof e) {
          for (i = 0; i < this.length; i += 1)
            for (var n in e) this[i].style[n] = e[n];
          return this;
        }
        if (this[0])
          return s.getComputedStyle(this[0], null).getPropertyValue(e);
      }
      if (2 === arguments.length && "string" == typeof e) {
        for (i = 0; i < this.length; i += 1) this[i].style[e] = t;
        return this;
      }
      return this;
    },
    each: function (e) {
      return e
        ? (this.forEach(function (t, i) {
            e.apply(t, [t, i]);
          }),
          this)
        : this;
    },
    html: function (e) {
      if (void 0 === e) return this[0] ? this[0].innerHTML : null;
      for (var t = 0; t < this.length; t += 1) this[t].innerHTML = e;
      return this;
    },
    text: function (e) {
      if (void 0 === e) return this[0] ? this[0].textContent.trim() : null;
      for (var t = 0; t < this.length; t += 1) this[t].textContent = e;
      return this;
    },
    is: function (e) {
      var t,
        i,
        s = ae(),
        n = ne(),
        r = this[0];
      if (!r || void 0 === e) return !1;
      if ("string" == typeof e) {
        if (r.matches) return r.matches(e);
        if (r.webkitMatchesSelector) return r.webkitMatchesSelector(e);
        if (r.msMatchesSelector) return r.msMatchesSelector(e);
        for (t = fe(e), i = 0; i < t.length; i += 1) if (t[i] === r) return !0;
        return !1;
      }
      if (e === n) return r === n;
      if (e === s) return r === s;
      if (e.nodeType || e instanceof ue) {
        for (t = e.nodeType ? [e] : e, i = 0; i < t.length; i += 1)
          if (t[i] === r) return !0;
        return !1;
      }
      return !1;
    },
    index: function () {
      var e,
        t = this[0];
      if (t) {
        for (e = 0; null !== (t = t.previousSibling); )
          1 === t.nodeType && (e += 1);
        return e;
      }
    },
    eq: function (e) {
      if (void 0 === e) return this;
      var t = this.length;
      if (e > t - 1) return fe([]);
      if (e < 0) {
        var i = t + e;
        return fe(i < 0 ? [] : [this[i]]);
      }
      return fe([this[e]]);
    },
    append: function () {
      for (var e, t = ne(), i = 0; i < arguments.length; i += 1) {
        e = i < 0 || arguments.length <= i ? void 0 : arguments[i];
        for (var s = 0; s < this.length; s += 1)
          if ("string" == typeof e) {
            var n = t.createElement("div");
            for (n.innerHTML = e; n.firstChild; )
              this[s].appendChild(n.firstChild);
          } else if (e instanceof ue)
            for (var r = 0; r < e.length; r += 1) this[s].appendChild(e[r]);
          else this[s].appendChild(e);
      }
      return this;
    },
    prepend: function (e) {
      var t,
        i,
        s = ne();
      for (t = 0; t < this.length; t += 1)
        if ("string" == typeof e) {
          var n = s.createElement("div");
          for (n.innerHTML = e, i = n.childNodes.length - 1; i >= 0; i -= 1)
            this[t].insertBefore(n.childNodes[i], this[t].childNodes[0]);
        } else if (e instanceof ue)
          for (i = 0; i < e.length; i += 1)
            this[t].insertBefore(e[i], this[t].childNodes[0]);
        else this[t].insertBefore(e, this[t].childNodes[0]);
      return this;
    },
    next: function (e) {
      return this.length > 0
        ? e
          ? this[0].nextElementSibling && fe(this[0].nextElementSibling).is(e)
            ? fe([this[0].nextElementSibling])
            : fe([])
          : this[0].nextElementSibling
          ? fe([this[0].nextElementSibling])
          : fe([])
        : fe([]);
    },
    nextAll: function (e) {
      var t = [],
        i = this[0];
      if (!i) return fe([]);
      for (; i.nextElementSibling; ) {
        var s = i.nextElementSibling;
        e ? fe(s).is(e) && t.push(s) : t.push(s), (i = s);
      }
      return fe(t);
    },
    prev: function (e) {
      if (this.length > 0) {
        var t = this[0];
        return e
          ? t.previousElementSibling && fe(t.previousElementSibling).is(e)
            ? fe([t.previousElementSibling])
            : fe([])
          : t.previousElementSibling
          ? fe([t.previousElementSibling])
          : fe([]);
      }
      return fe([]);
    },
    prevAll: function (e) {
      var t = [],
        i = this[0];
      if (!i) return fe([]);
      for (; i.previousElementSibling; ) {
        var s = i.previousElementSibling;
        e ? fe(s).is(e) && t.push(s) : t.push(s), (i = s);
      }
      return fe(t);
    },
    parent: function (e) {
      for (var t = [], i = 0; i < this.length; i += 1)
        null !== this[i].parentNode &&
          (e
            ? fe(this[i].parentNode).is(e) && t.push(this[i].parentNode)
            : t.push(this[i].parentNode));
      return fe(t);
    },
    parents: function (e) {
      for (var t = [], i = 0; i < this.length; i += 1)
        for (var s = this[i].parentNode; s; )
          e ? fe(s).is(e) && t.push(s) : t.push(s), (s = s.parentNode);
      return fe(t);
    },
    closest: function (e) {
      var t = this;
      return void 0 === e ? fe([]) : (t.is(e) || (t = t.parents(e).eq(0)), t);
    },
    find: function (e) {
      for (var t = [], i = 0; i < this.length; i += 1)
        for (var s = this[i].querySelectorAll(e), n = 0; n < s.length; n += 1)
          t.push(s[n]);
      return fe(t);
    },
    children: function (e) {
      for (var t = [], i = 0; i < this.length; i += 1)
        for (var s = this[i].children, n = 0; n < s.length; n += 1)
          (e && !fe(s[n]).is(e)) || t.push(s[n]);
      return fe(t);
    },
    filter: function (e) {
      return fe(ve(this, e));
    },
    remove: function () {
      for (var e = 0; e < this.length; e += 1)
        this[e].parentNode && this[e].parentNode.removeChild(this[e]);
      return this;
    },
  };
function ye(e, t) {
  return void 0 === t && (t = 0), setTimeout(e, t);
}
function be() {
  return Date.now();
}
function Te(e, t) {
  void 0 === t && (t = "x");
  var i,
    s,
    n,
    r = ae(),
    a = (function (e) {
      var t,
        i = ae();
      return (
        i.getComputedStyle && (t = i.getComputedStyle(e, null)),
        !t && e.currentStyle && (t = e.currentStyle),
        t || (t = e.style),
        t
      );
    })(e);
  return (
    r.WebKitCSSMatrix
      ? ((s = a.transform || a.webkitTransform).split(",").length > 6 &&
          (s = s
            .split(", ")
            .map(function (e) {
              return e.replace(",", ".");
            })
            .join(", ")),
        (n = new r.WebKitCSSMatrix("none" === s ? "" : s)))
      : (i = (n =
          a.MozTransform ||
          a.OTransform ||
          a.MsTransform ||
          a.msTransform ||
          a.transform ||
          a
            .getPropertyValue("transform")
            .replace("translate(", "matrix(1, 0, 0, 1,"))
          .toString()
          .split(",")),
    "x" === t &&
      (s = r.WebKitCSSMatrix
        ? n.m41
        : 16 === i.length
        ? parseFloat(i[12])
        : parseFloat(i[4])),
    "y" === t &&
      (s = r.WebKitCSSMatrix
        ? n.m42
        : 16 === i.length
        ? parseFloat(i[13])
        : parseFloat(i[5])),
    s || 0
  );
}
function Ee(e) {
  return (
    "object" == typeof e &&
    null !== e &&
    e.constructor &&
    "Object" === Object.prototype.toString.call(e).slice(8, -1)
  );
}
function xe(e) {
  return "undefined" != typeof window && void 0 !== window.HTMLElement
    ? e instanceof HTMLElement
    : e && (1 === e.nodeType || 11 === e.nodeType);
}
function Ce() {
  for (
    var e = Object(arguments.length <= 0 ? void 0 : arguments[0]),
      t = ["__proto__", "constructor", "prototype"],
      i = 1;
    i < arguments.length;
    i += 1
  ) {
    var s = i < 0 || arguments.length <= i ? void 0 : arguments[i];
    if (null != s && !xe(s))
      for (
        var n = Object.keys(Object(s)).filter(function (e) {
            return t.indexOf(e) < 0;
          }),
          r = 0,
          a = n.length;
        r < a;
        r += 1
      ) {
        var o = n[r],
          l = Object.getOwnPropertyDescriptor(s, o);
        void 0 !== l &&
          l.enumerable &&
          (Ee(e[o]) && Ee(s[o])
            ? s[o].__swiper__
              ? (e[o] = s[o])
              : Ce(e[o], s[o])
            : !Ee(e[o]) && Ee(s[o])
            ? ((e[o] = {}), s[o].__swiper__ ? (e[o] = s[o]) : Ce(e[o], s[o]))
            : (e[o] = s[o]));
      }
  }
  return e;
}
function Me(e, t) {
  Object.keys(t).forEach(function (i) {
    Ee(t[i]) &&
      Object.keys(t[i]).forEach(function (s) {
        "function" == typeof t[i][s] && (t[i][s] = t[i][s].bind(e));
      }),
      (e[i] = t[i]);
  });
}
function Le() {
  return (
    me ||
      (me = (function () {
        var e = ae(),
          t = ne();
        return {
          touch: !!(
            "ontouchstart" in e ||
            (e.DocumentTouch && t instanceof e.DocumentTouch)
          ),
          pointerEvents:
            !!e.PointerEvent &&
            "maxTouchPoints" in e.navigator &&
            e.navigator.maxTouchPoints >= 0,
          observer: "MutationObserver" in e || "WebkitMutationObserver" in e,
          passiveListener: (function () {
            var t = !1;
            try {
              var i = Object.defineProperty({}, "passive", {
                get: function () {
                  t = !0;
                },
              });
              e.addEventListener("testPassiveListener", null, i);
            } catch (e) {}
            return t;
          })(),
          gestures: "ongesturestart" in e,
        };
      })()),
    me
  );
}
function Pe(e) {
  return (
    void 0 === e && (e = {}),
    ge ||
      (ge = (function (e) {
        var t = (void 0 === e ? {} : e).userAgent,
          i = Le(),
          s = ae(),
          n = s.navigator.platform,
          r = t || s.navigator.userAgent,
          a = { ios: !1, android: !1 },
          o = s.screen.width,
          l = s.screen.height,
          d = r.match(/(Android);?[\s\/]+([\d.]+)?/),
          c = r.match(/(iPad).*OS\s([\d_]+)/),
          h = r.match(/(iPod)(.*OS\s([\d_]+))?/),
          u = !c && r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
          p = "Win32" === n,
          v = "MacIntel" === n;
        return (
          !c &&
            v &&
            i.touch &&
            [
              "1024x1366",
              "1366x1024",
              "834x1194",
              "1194x834",
              "834x1112",
              "1112x834",
              "768x1024",
              "1024x768",
              "820x1180",
              "1180x820",
              "810x1080",
              "1080x810",
            ].indexOf(o + "x" + l) >= 0 &&
            ((c = r.match(/(Version)\/([\d.]+)/)) || (c = [0, 1, "13_0_0"]),
            (v = !1)),
          d && !p && ((a.os = "android"), (a.android = !0)),
          (c || u || h) && ((a.os = "ios"), (a.ios = !0)),
          a
        );
      })(e)),
    ge
  );
}
function Oe() {
  return (
    we ||
      (we = (function () {
        var e,
          t = ae();
        return {
          isEdge: !!t.navigator.userAgent.match(/Edge/g),
          isSafari:
            ((e = t.navigator.userAgent.toLowerCase()),
            e.indexOf("safari") >= 0 &&
              e.indexOf("chrome") < 0 &&
              e.indexOf("android") < 0),
          isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
            t.navigator.userAgent
          ),
        };
      })()),
    we
  );
}
Object.keys(Se).forEach(function (e) {
  Object.defineProperty(fe.fn, e, { value: Se[e], writable: !0 });
});
var ze = {
  name: "resize",
  create: function () {
    var e = this;
    Ce(e, {
      resize: {
        observer: null,
        createObserver: function () {
          e &&
            !e.destroyed &&
            e.initialized &&
            ((e.resize.observer = new ResizeObserver(function (t) {
              var i = e.width,
                s = e.height,
                n = i,
                r = s;
              t.forEach(function (t) {
                var i = t.contentBoxSize,
                  s = t.contentRect,
                  a = t.target;
                (a && a !== e.el) ||
                  ((n = s ? s.width : (i[0] || i).inlineSize),
                  (r = s ? s.height : (i[0] || i).blockSize));
              }),
                (n === i && r === s) || e.resize.resizeHandler();
            })),
            e.resize.observer.observe(e.el));
        },
        removeObserver: function () {
          e.resize.observer &&
            e.resize.observer.unobserve &&
            e.el &&
            (e.resize.observer.unobserve(e.el), (e.resize.observer = null));
        },
        resizeHandler: function () {
          e &&
            !e.destroyed &&
            e.initialized &&
            (e.emit("beforeResize"), e.emit("resize"));
        },
        orientationChangeHandler: function () {
          e && !e.destroyed && e.initialized && e.emit("orientationchange");
        },
      },
    });
  },
  on: {
    init: function (e) {
      var t = ae();
      e.params.resizeObserver && void 0 !== ae().ResizeObserver
        ? e.resize.createObserver()
        : (t.addEventListener("resize", e.resize.resizeHandler),
          t.addEventListener(
            "orientationchange",
            e.resize.orientationChangeHandler
          ));
    },
    destroy: function (e) {
      var t = ae();
      e.resize.removeObserver(),
        t.removeEventListener("resize", e.resize.resizeHandler),
        t.removeEventListener(
          "orientationchange",
          e.resize.orientationChangeHandler
        );
    },
  },
};
function ke() {
  return (
    (ke =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var i = arguments[t];
          for (var s in i)
            Object.prototype.hasOwnProperty.call(i, s) && (e[s] = i[s]);
        }
        return e;
      }),
    ke.apply(this, arguments)
  );
}
var Ae = {
    attach: function (e, t) {
      void 0 === t && (t = {});
      var i = ae(),
        s = this,
        n = new (i.MutationObserver || i.WebkitMutationObserver)(function (e) {
          if (1 !== e.length) {
            var t = function () {
              s.emit("observerUpdate", e[0]);
            };
            i.requestAnimationFrame
              ? i.requestAnimationFrame(t)
              : i.setTimeout(t, 0);
          } else s.emit("observerUpdate", e[0]);
        });
      n.observe(e, {
        attributes: void 0 === t.attributes || t.attributes,
        childList: void 0 === t.childList || t.childList,
        characterData: void 0 === t.characterData || t.characterData,
      }),
        s.observer.observers.push(n);
    },
    init: function () {
      var e = this;
      if (e.support.observer && e.params.observer) {
        if (e.params.observeParents)
          for (var t = e.$el.parents(), i = 0; i < t.length; i += 1)
            e.observer.attach(t[i]);
        e.observer.attach(e.$el[0], {
          childList: e.params.observeSlideChildren,
        }),
          e.observer.attach(e.$wrapperEl[0], { attributes: !1 });
      }
    },
    destroy: function () {
      this.observer.observers.forEach(function (e) {
        e.disconnect();
      }),
        (this.observer.observers = []);
    },
  },
  _e = {
    name: "observer",
    params: { observer: !1, observeParents: !1, observeSlideChildren: !1 },
    create: function () {
      Me(this, { observer: ke({}, Ae, { observers: [] }) });
    },
    on: {
      init: function (e) {
        e.observer.init();
      },
      destroy: function (e) {
        e.observer.destroy();
      },
    },
  },
  Ie = {
    on: function (e, t, i) {
      var s = this;
      if ("function" != typeof t) return s;
      var n = i ? "unshift" : "push";
      return (
        e.split(" ").forEach(function (e) {
          s.eventsListeners[e] || (s.eventsListeners[e] = []),
            s.eventsListeners[e][n](t);
        }),
        s
      );
    },
    once: function (e, t, i) {
      var s = this;
      if ("function" != typeof t) return s;
      function n() {
        s.off(e, n), n.__emitterProxy && delete n.__emitterProxy;
        for (var i = arguments.length, r = new Array(i), a = 0; a < i; a++)
          r[a] = arguments[a];
        t.apply(s, r);
      }
      return (n.__emitterProxy = t), s.on(e, n, i);
    },
    onAny: function (e, t) {
      var i = this;
      if ("function" != typeof e) return i;
      var s = t ? "unshift" : "push";
      return (
        i.eventsAnyListeners.indexOf(e) < 0 && i.eventsAnyListeners[s](e), i
      );
    },
    offAny: function (e) {
      var t = this;
      if (!t.eventsAnyListeners) return t;
      var i = t.eventsAnyListeners.indexOf(e);
      return i >= 0 && t.eventsAnyListeners.splice(i, 1), t;
    },
    off: function (e, t) {
      var i = this;
      return i.eventsListeners
        ? (e.split(" ").forEach(function (e) {
            void 0 === t
              ? (i.eventsListeners[e] = [])
              : i.eventsListeners[e] &&
                i.eventsListeners[e].forEach(function (s, n) {
                  (s === t || (s.__emitterProxy && s.__emitterProxy === t)) &&
                    i.eventsListeners[e].splice(n, 1);
                });
          }),
          i)
        : i;
    },
    emit: function () {
      var e,
        t,
        i,
        s = this;
      if (!s.eventsListeners) return s;
      for (var n = arguments.length, r = new Array(n), a = 0; a < n; a++)
        r[a] = arguments[a];
      "string" == typeof r[0] || Array.isArray(r[0])
        ? ((e = r[0]), (t = r.slice(1, r.length)), (i = s))
        : ((e = r[0].events), (t = r[0].data), (i = r[0].context || s)),
        t.unshift(i);
      var o = Array.isArray(e) ? e : e.split(" ");
      return (
        o.forEach(function (e) {
          s.eventsAnyListeners &&
            s.eventsAnyListeners.length &&
            s.eventsAnyListeners.forEach(function (s) {
              s.apply(i, [e].concat(t));
            }),
            s.eventsListeners &&
              s.eventsListeners[e] &&
              s.eventsListeners[e].forEach(function (e) {
                e.apply(i, t);
              });
        }),
        s
      );
    },
  };
var Re = {
  updateSize: function () {
    var e,
      t,
      i = this,
      s = i.$el;
    (e =
      void 0 !== i.params.width && null !== i.params.width
        ? i.params.width
        : s[0].clientWidth),
      (t =
        void 0 !== i.params.height && null !== i.params.height
          ? i.params.height
          : s[0].clientHeight),
      (0 === e && i.isHorizontal()) ||
        (0 === t && i.isVertical()) ||
        ((e =
          e -
          parseInt(s.css("padding-left") || 0, 10) -
          parseInt(s.css("padding-right") || 0, 10)),
        (t =
          t -
          parseInt(s.css("padding-top") || 0, 10) -
          parseInt(s.css("padding-bottom") || 0, 10)),
        Number.isNaN(e) && (e = 0),
        Number.isNaN(t) && (t = 0),
        Ce(i, { width: e, height: t, size: i.isHorizontal() ? e : t }));
  },
  updateSlides: function () {
    var e = this;
    function t(t) {
      return e.isHorizontal()
        ? t
        : {
            width: "height",
            "margin-top": "margin-left",
            "margin-bottom ": "margin-right",
            "margin-left": "margin-top",
            "margin-right": "margin-bottom",
            "padding-left": "padding-top",
            "padding-right": "padding-bottom",
            marginRight: "marginBottom",
          }[t];
    }
    function i(e, i) {
      return parseFloat(e.getPropertyValue(t(i)) || 0);
    }
    var s = e.params,
      n = e.$wrapperEl,
      r = e.size,
      a = e.rtlTranslate,
      o = e.wrongRTL,
      l = e.virtual && s.virtual.enabled,
      d = l ? e.virtual.slides.length : e.slides.length,
      c = n.children("." + e.params.slideClass),
      h = l ? e.virtual.slides.length : c.length,
      u = [],
      p = [],
      v = [],
      f = s.slidesOffsetBefore;
    "function" == typeof f && (f = s.slidesOffsetBefore.call(e));
    var m = s.slidesOffsetAfter;
    "function" == typeof m && (m = s.slidesOffsetAfter.call(e));
    var g = e.snapGrid.length,
      w = e.slidesGrid.length,
      S = s.spaceBetween,
      y = -f,
      b = 0,
      T = 0;
    if (void 0 !== r) {
      var E, x;
      "string" == typeof S &&
        S.indexOf("%") >= 0 &&
        (S = (parseFloat(S.replace("%", "")) / 100) * r),
        (e.virtualSize = -S),
        a
          ? c.css({ marginLeft: "", marginBottom: "", marginTop: "" })
          : c.css({ marginRight: "", marginBottom: "", marginTop: "" }),
        s.slidesPerColumn > 1 &&
          ((E =
            Math.floor(h / s.slidesPerColumn) === h / e.params.slidesPerColumn
              ? h
              : Math.ceil(h / s.slidesPerColumn) * s.slidesPerColumn),
          "auto" !== s.slidesPerView &&
            "row" === s.slidesPerColumnFill &&
            (E = Math.max(E, s.slidesPerView * s.slidesPerColumn)));
      for (
        var C,
          M,
          L,
          P = s.slidesPerColumn,
          O = E / P,
          z = Math.floor(h / s.slidesPerColumn),
          k = 0;
        k < h;
        k += 1
      ) {
        x = 0;
        var A = c.eq(k);
        if (s.slidesPerColumn > 1) {
          var _ = void 0,
            I = void 0,
            R = void 0;
          if ("row" === s.slidesPerColumnFill && s.slidesPerGroup > 1) {
            var D = Math.floor(k / (s.slidesPerGroup * s.slidesPerColumn)),
              N = k - s.slidesPerColumn * s.slidesPerGroup * D,
              W =
                0 === D
                  ? s.slidesPerGroup
                  : Math.min(
                      Math.ceil((h - D * P * s.slidesPerGroup) / P),
                      s.slidesPerGroup
                    );
            (_ =
              (I = N - (R = Math.floor(N / W)) * W + D * s.slidesPerGroup) +
              (R * E) / P),
              A.css({
                "-webkit-box-ordinal-group": _,
                "-moz-box-ordinal-group": _,
                "-ms-flex-order": _,
                "-webkit-order": _,
                order: _,
              });
          } else
            "column" === s.slidesPerColumnFill
              ? ((R = k - (I = Math.floor(k / P)) * P),
                (I > z || (I === z && R === P - 1)) &&
                  (R += 1) >= P &&
                  ((R = 0), (I += 1)))
              : (I = k - (R = Math.floor(k / O)) * O);
          A.css(
            t("margin-top"),
            0 !== R ? s.spaceBetween && s.spaceBetween + "px" : ""
          );
        }
        if ("none" !== A.css("display")) {
          if ("auto" === s.slidesPerView) {
            var H = getComputedStyle(A[0]),
              q = A[0].style.transform,
              j = A[0].style.webkitTransform;
            if (
              (q && (A[0].style.transform = "none"),
              j && (A[0].style.webkitTransform = "none"),
              s.roundLengths)
            )
              x = e.isHorizontal() ? A.outerWidth(!0) : A.outerHeight(!0);
            else {
              var G = i(H, "width"),
                B = i(H, "padding-left"),
                Y = i(H, "padding-right"),
                F = i(H, "margin-left"),
                V = i(H, "margin-right"),
                X = H.getPropertyValue("box-sizing");
              if (X && "border-box" === X) x = G + F + V;
              else {
                var $ = A[0],
                  U = $.clientWidth;
                x = G + B + Y + F + V + ($.offsetWidth - U);
              }
            }
            q && (A[0].style.transform = q),
              j && (A[0].style.webkitTransform = j),
              s.roundLengths && (x = Math.floor(x));
          } else
            (x = (r - (s.slidesPerView - 1) * S) / s.slidesPerView),
              s.roundLengths && (x = Math.floor(x)),
              c[k] && (c[k].style[t("width")] = x + "px");
          c[k] && (c[k].swiperSlideSize = x),
            v.push(x),
            s.centeredSlides
              ? ((y = y + x / 2 + b / 2 + S),
                0 === b && 0 !== k && (y = y - r / 2 - S),
                0 === k && (y = y - r / 2 - S),
                Math.abs(y) < 0.001 && (y = 0),
                s.roundLengths && (y = Math.floor(y)),
                T % s.slidesPerGroup == 0 && u.push(y),
                p.push(y))
              : (s.roundLengths && (y = Math.floor(y)),
                (T - Math.min(e.params.slidesPerGroupSkip, T)) %
                  e.params.slidesPerGroup ==
                  0 && u.push(y),
                p.push(y),
                (y = y + x + S)),
            (e.virtualSize += x + S),
            (b = x),
            (T += 1);
        }
      }
      if (
        ((e.virtualSize = Math.max(e.virtualSize, r) + m),
        a &&
          o &&
          ("slide" === s.effect || "coverflow" === s.effect) &&
          n.css({ width: e.virtualSize + s.spaceBetween + "px" }),
        s.setWrapperSize)
      )
        n.css(
          (((M = {})[t("width")] = e.virtualSize + s.spaceBetween + "px"), M)
        );
      if (s.slidesPerColumn > 1)
        if (
          ((e.virtualSize = (x + s.spaceBetween) * E),
          (e.virtualSize =
            Math.ceil(e.virtualSize / s.slidesPerColumn) - s.spaceBetween),
          n.css(
            (((L = {})[t("width")] = e.virtualSize + s.spaceBetween + "px"), L)
          ),
          s.centeredSlides)
        ) {
          C = [];
          for (var Z = 0; Z < u.length; Z += 1) {
            var K = u[Z];
            s.roundLengths && (K = Math.floor(K)),
              u[Z] < e.virtualSize + u[0] && C.push(K);
          }
          u = C;
        }
      if (!s.centeredSlides) {
        C = [];
        for (var J = 0; J < u.length; J += 1) {
          var Q = u[J];
          s.roundLengths && (Q = Math.floor(Q)),
            u[J] <= e.virtualSize - r && C.push(Q);
        }
        (u = C),
          Math.floor(e.virtualSize - r) - Math.floor(u[u.length - 1]) > 1 &&
            u.push(e.virtualSize - r);
      }
      if ((0 === u.length && (u = [0]), 0 !== s.spaceBetween)) {
        var ee,
          te = e.isHorizontal() && a ? "marginLeft" : t("marginRight");
        c.filter(function (e, t) {
          return !s.cssMode || t !== c.length - 1;
        }).css((((ee = {})[te] = S + "px"), ee));
      }
      if (s.centeredSlides && s.centeredSlidesBounds) {
        var ie = 0;
        v.forEach(function (e) {
          ie += e + (s.spaceBetween ? s.spaceBetween : 0);
        });
        var se = (ie -= s.spaceBetween) - r;
        u = u.map(function (e) {
          return e < 0 ? -f : e > se ? se + m : e;
        });
      }
      if (s.centerInsufficientSlides) {
        var ne = 0;
        if (
          (v.forEach(function (e) {
            ne += e + (s.spaceBetween ? s.spaceBetween : 0);
          }),
          (ne -= s.spaceBetween) < r)
        ) {
          var re = (r - ne) / 2;
          u.forEach(function (e, t) {
            u[t] = e - re;
          }),
            p.forEach(function (e, t) {
              p[t] = e + re;
            });
        }
      }
      Ce(e, { slides: c, snapGrid: u, slidesGrid: p, slidesSizesGrid: v }),
        h !== d && e.emit("slidesLengthChange"),
        u.length !== g &&
          (e.params.watchOverflow && e.checkOverflow(),
          e.emit("snapGridLengthChange")),
        p.length !== w && e.emit("slidesGridLengthChange"),
        (s.watchSlidesProgress || s.watchSlidesVisibility) &&
          e.updateSlidesOffset();
    }
  },
  updateAutoHeight: function (e) {
    var t,
      i = this,
      s = [],
      n = i.virtual && i.params.virtual.enabled,
      r = 0;
    "number" == typeof e
      ? i.setTransition(e)
      : !0 === e && i.setTransition(i.params.speed);
    var a = function (e) {
      return n
        ? i.slides.filter(function (t) {
            return (
              parseInt(t.getAttribute("data-swiper-slide-index"), 10) === e
            );
          })[0]
        : i.slides.eq(e)[0];
    };
    if ("auto" !== i.params.slidesPerView && i.params.slidesPerView > 1)
      if (i.params.centeredSlides)
        i.visibleSlides.each(function (e) {
          s.push(e);
        });
      else
        for (t = 0; t < Math.ceil(i.params.slidesPerView); t += 1) {
          var o = i.activeIndex + t;
          if (o > i.slides.length && !n) break;
          s.push(a(o));
        }
    else s.push(a(i.activeIndex));
    for (t = 0; t < s.length; t += 1)
      if (void 0 !== s[t]) {
        var l = s[t].offsetHeight;
        r = l > r ? l : r;
      }
    r && i.$wrapperEl.css("height", r + "px");
  },
  updateSlidesOffset: function () {
    for (var e = this.slides, t = 0; t < e.length; t += 1)
      e[t].swiperSlideOffset = this.isHorizontal()
        ? e[t].offsetLeft
        : e[t].offsetTop;
  },
  updateSlidesProgress: function (e) {
    void 0 === e && (e = (this && this.translate) || 0);
    var t = this,
      i = t.params,
      s = t.slides,
      n = t.rtlTranslate;
    if (0 !== s.length) {
      void 0 === s[0].swiperSlideOffset && t.updateSlidesOffset();
      var r = -e;
      n && (r = e),
        s.removeClass(i.slideVisibleClass),
        (t.visibleSlidesIndexes = []),
        (t.visibleSlides = []);
      for (var a = 0; a < s.length; a += 1) {
        var o = s[a],
          l =
            (r +
              (i.centeredSlides ? t.minTranslate() : 0) -
              o.swiperSlideOffset) /
            (o.swiperSlideSize + i.spaceBetween);
        if (i.watchSlidesVisibility || (i.centeredSlides && i.autoHeight)) {
          var d = -(r - o.swiperSlideOffset),
            c = d + t.slidesSizesGrid[a];
          ((d >= 0 && d < t.size - 1) ||
            (c > 1 && c <= t.size) ||
            (d <= 0 && c >= t.size)) &&
            (t.visibleSlides.push(o),
            t.visibleSlidesIndexes.push(a),
            s.eq(a).addClass(i.slideVisibleClass));
        }
        o.progress = n ? -l : l;
      }
      t.visibleSlides = fe(t.visibleSlides);
    }
  },
  updateProgress: function (e) {
    var t = this;
    if (void 0 === e) {
      var i = t.rtlTranslate ? -1 : 1;
      e = (t && t.translate && t.translate * i) || 0;
    }
    var s = t.params,
      n = t.maxTranslate() - t.minTranslate(),
      r = t.progress,
      a = t.isBeginning,
      o = t.isEnd,
      l = a,
      d = o;
    0 === n
      ? ((r = 0), (a = !0), (o = !0))
      : ((a = (r = (e - t.minTranslate()) / n) <= 0), (o = r >= 1)),
      Ce(t, { progress: r, isBeginning: a, isEnd: o }),
      (s.watchSlidesProgress ||
        s.watchSlidesVisibility ||
        (s.centeredSlides && s.autoHeight)) &&
        t.updateSlidesProgress(e),
      a && !l && t.emit("reachBeginning toEdge"),
      o && !d && t.emit("reachEnd toEdge"),
      ((l && !a) || (d && !o)) && t.emit("fromEdge"),
      t.emit("progress", r);
  },
  updateSlidesClasses: function () {
    var e,
      t = this,
      i = t.slides,
      s = t.params,
      n = t.$wrapperEl,
      r = t.activeIndex,
      a = t.realIndex,
      o = t.virtual && s.virtual.enabled;
    i.removeClass(
      s.slideActiveClass +
        " " +
        s.slideNextClass +
        " " +
        s.slidePrevClass +
        " " +
        s.slideDuplicateActiveClass +
        " " +
        s.slideDuplicateNextClass +
        " " +
        s.slideDuplicatePrevClass
    ),
      (e = o
        ? t.$wrapperEl.find(
            "." + s.slideClass + '[data-swiper-slide-index="' + r + '"]'
          )
        : i.eq(r)).addClass(s.slideActiveClass),
      s.loop &&
        (e.hasClass(s.slideDuplicateClass)
          ? n
              .children(
                "." +
                  s.slideClass +
                  ":not(." +
                  s.slideDuplicateClass +
                  ')[data-swiper-slide-index="' +
                  a +
                  '"]'
              )
              .addClass(s.slideDuplicateActiveClass)
          : n
              .children(
                "." +
                  s.slideClass +
                  "." +
                  s.slideDuplicateClass +
                  '[data-swiper-slide-index="' +
                  a +
                  '"]'
              )
              .addClass(s.slideDuplicateActiveClass));
    var l = e
      .nextAll("." + s.slideClass)
      .eq(0)
      .addClass(s.slideNextClass);
    s.loop && 0 === l.length && (l = i.eq(0)).addClass(s.slideNextClass);
    var d = e
      .prevAll("." + s.slideClass)
      .eq(0)
      .addClass(s.slidePrevClass);
    s.loop && 0 === d.length && (d = i.eq(-1)).addClass(s.slidePrevClass),
      s.loop &&
        (l.hasClass(s.slideDuplicateClass)
          ? n
              .children(
                "." +
                  s.slideClass +
                  ":not(." +
                  s.slideDuplicateClass +
                  ')[data-swiper-slide-index="' +
                  l.attr("data-swiper-slide-index") +
                  '"]'
              )
              .addClass(s.slideDuplicateNextClass)
          : n
              .children(
                "." +
                  s.slideClass +
                  "." +
                  s.slideDuplicateClass +
                  '[data-swiper-slide-index="' +
                  l.attr("data-swiper-slide-index") +
                  '"]'
              )
              .addClass(s.slideDuplicateNextClass),
        d.hasClass(s.slideDuplicateClass)
          ? n
              .children(
                "." +
                  s.slideClass +
                  ":not(." +
                  s.slideDuplicateClass +
                  ')[data-swiper-slide-index="' +
                  d.attr("data-swiper-slide-index") +
                  '"]'
              )
              .addClass(s.slideDuplicatePrevClass)
          : n
              .children(
                "." +
                  s.slideClass +
                  "." +
                  s.slideDuplicateClass +
                  '[data-swiper-slide-index="' +
                  d.attr("data-swiper-slide-index") +
                  '"]'
              )
              .addClass(s.slideDuplicatePrevClass)),
      t.emitSlidesClasses();
  },
  updateActiveIndex: function (e) {
    var t,
      i = this,
      s = i.rtlTranslate ? i.translate : -i.translate,
      n = i.slidesGrid,
      r = i.snapGrid,
      a = i.params,
      o = i.activeIndex,
      l = i.realIndex,
      d = i.snapIndex,
      c = e;
    if (void 0 === c) {
      for (var h = 0; h < n.length; h += 1)
        void 0 !== n[h + 1]
          ? s >= n[h] && s < n[h + 1] - (n[h + 1] - n[h]) / 2
            ? (c = h)
            : s >= n[h] && s < n[h + 1] && (c = h + 1)
          : s >= n[h] && (c = h);
      a.normalizeSlideIndex && (c < 0 || void 0 === c) && (c = 0);
    }
    if (r.indexOf(s) >= 0) t = r.indexOf(s);
    else {
      var u = Math.min(a.slidesPerGroupSkip, c);
      t = u + Math.floor((c - u) / a.slidesPerGroup);
    }
    if ((t >= r.length && (t = r.length - 1), c !== o)) {
      var p = parseInt(i.slides.eq(c).attr("data-swiper-slide-index") || c, 10);
      Ce(i, { snapIndex: t, realIndex: p, previousIndex: o, activeIndex: c }),
        i.emit("activeIndexChange"),
        i.emit("snapIndexChange"),
        l !== p && i.emit("realIndexChange"),
        (i.initialized || i.params.runCallbacksOnInit) && i.emit("slideChange");
    } else t !== d && ((i.snapIndex = t), i.emit("snapIndexChange"));
  },
  updateClickedSlide: function (e) {
    var t,
      i = this,
      s = i.params,
      n = fe(e.target).closest("." + s.slideClass)[0],
      r = !1;
    if (n)
      for (var a = 0; a < i.slides.length; a += 1)
        if (i.slides[a] === n) {
          (r = !0), (t = a);
          break;
        }
    if (!n || !r)
      return (i.clickedSlide = void 0), void (i.clickedIndex = void 0);
    (i.clickedSlide = n),
      i.virtual && i.params.virtual.enabled
        ? (i.clickedIndex = parseInt(fe(n).attr("data-swiper-slide-index"), 10))
        : (i.clickedIndex = t),
      s.slideToClickedSlide &&
        void 0 !== i.clickedIndex &&
        i.clickedIndex !== i.activeIndex &&
        i.slideToClickedSlide();
  },
};
var De = {
  getTranslate: function (e) {
    void 0 === e && (e = this.isHorizontal() ? "x" : "y");
    var t = this,
      i = t.params,
      s = t.rtlTranslate,
      n = t.translate,
      r = t.$wrapperEl;
    if (i.virtualTranslate) return s ? -n : n;
    if (i.cssMode) return n;
    var a = Te(r[0], e);
    return s && (a = -a), a || 0;
  },
  setTranslate: function (e, t) {
    var i = this,
      s = i.rtlTranslate,
      n = i.params,
      r = i.$wrapperEl,
      a = i.wrapperEl,
      o = i.progress,
      l = 0,
      d = 0;
    i.isHorizontal() ? (l = s ? -e : e) : (d = e),
      n.roundLengths && ((l = Math.floor(l)), (d = Math.floor(d))),
      n.cssMode
        ? (a[i.isHorizontal() ? "scrollLeft" : "scrollTop"] = i.isHorizontal()
            ? -l
            : -d)
        : n.virtualTranslate ||
          r.transform("translate3d(" + l + "px, " + d + "px, 0px)"),
      (i.previousTranslate = i.translate),
      (i.translate = i.isHorizontal() ? l : d);
    var c = i.maxTranslate() - i.minTranslate();
    (0 === c ? 0 : (e - i.minTranslate()) / c) !== o && i.updateProgress(e),
      i.emit("setTranslate", i.translate, t);
  },
  minTranslate: function () {
    return -this.snapGrid[0];
  },
  maxTranslate: function () {
    return -this.snapGrid[this.snapGrid.length - 1];
  },
  translateTo: function (e, t, i, s, n) {
    void 0 === e && (e = 0),
      void 0 === t && (t = this.params.speed),
      void 0 === i && (i = !0),
      void 0 === s && (s = !0);
    var r = this,
      a = r.params,
      o = r.wrapperEl;
    if (r.animating && a.preventInteractionOnTransition) return !1;
    var l,
      d = r.minTranslate(),
      c = r.maxTranslate();
    if (
      ((l = s && e > d ? d : s && e < c ? c : e),
      r.updateProgress(l),
      a.cssMode)
    ) {
      var h,
        u = r.isHorizontal();
      if (0 === t) o[u ? "scrollLeft" : "scrollTop"] = -l;
      else if (o.scrollTo)
        o.scrollTo(
          (((h = {})[u ? "left" : "top"] = -l), (h.behavior = "smooth"), h)
        );
      else o[u ? "scrollLeft" : "scrollTop"] = -l;
      return !0;
    }
    return (
      0 === t
        ? (r.setTransition(0),
          r.setTranslate(l),
          i && (r.emit("beforeTransitionStart", t, n), r.emit("transitionEnd")))
        : (r.setTransition(t),
          r.setTranslate(l),
          i &&
            (r.emit("beforeTransitionStart", t, n), r.emit("transitionStart")),
          r.animating ||
            ((r.animating = !0),
            r.onTranslateToWrapperTransitionEnd ||
              (r.onTranslateToWrapperTransitionEnd = function (e) {
                r &&
                  !r.destroyed &&
                  e.target === this &&
                  (r.$wrapperEl[0].removeEventListener(
                    "transitionend",
                    r.onTranslateToWrapperTransitionEnd
                  ),
                  r.$wrapperEl[0].removeEventListener(
                    "webkitTransitionEnd",
                    r.onTranslateToWrapperTransitionEnd
                  ),
                  (r.onTranslateToWrapperTransitionEnd = null),
                  delete r.onTranslateToWrapperTransitionEnd,
                  i && r.emit("transitionEnd"));
              }),
            r.$wrapperEl[0].addEventListener(
              "transitionend",
              r.onTranslateToWrapperTransitionEnd
            ),
            r.$wrapperEl[0].addEventListener(
              "webkitTransitionEnd",
              r.onTranslateToWrapperTransitionEnd
            ))),
      !0
    );
  },
};
var Ne = {
  slideTo: function (e, t, i, s, n) {
    if (
      (void 0 === e && (e = 0),
      void 0 === t && (t = this.params.speed),
      void 0 === i && (i = !0),
      "number" != typeof e && "string" != typeof e)
    )
      throw new Error(
        "The 'index' argument cannot have type other than 'number' or 'string'. [" +
          typeof e +
          "] given."
      );
    if ("string" == typeof e) {
      var r = parseInt(e, 10);
      if (!isFinite(r))
        throw new Error(
          "The passed-in 'index' (string) couldn't be converted to 'number'. [" +
            e +
            "] given."
        );
      e = r;
    }
    var a = this,
      o = e;
    o < 0 && (o = 0);
    var l = a.params,
      d = a.snapGrid,
      c = a.slidesGrid,
      h = a.previousIndex,
      u = a.activeIndex,
      p = a.rtlTranslate,
      v = a.wrapperEl,
      f = a.enabled;
    if ((a.animating && l.preventInteractionOnTransition) || (!f && !s && !n))
      return !1;
    var m = Math.min(a.params.slidesPerGroupSkip, o),
      g = m + Math.floor((o - m) / a.params.slidesPerGroup);
    g >= d.length && (g = d.length - 1),
      (u || l.initialSlide || 0) === (h || 0) &&
        i &&
        a.emit("beforeSlideChangeStart");
    var w,
      S = -d[g];
    if ((a.updateProgress(S), l.normalizeSlideIndex))
      for (var y = 0; y < c.length; y += 1) {
        var b = -Math.floor(100 * S),
          T = Math.floor(100 * c[y]),
          E = Math.floor(100 * c[y + 1]);
        void 0 !== c[y + 1]
          ? b >= T && b < E - (E - T) / 2
            ? (o = y)
            : b >= T && b < E && (o = y + 1)
          : b >= T && (o = y);
      }
    if (a.initialized && o !== u) {
      if (!a.allowSlideNext && S < a.translate && S < a.minTranslate())
        return !1;
      if (
        !a.allowSlidePrev &&
        S > a.translate &&
        S > a.maxTranslate() &&
        (u || 0) !== o
      )
        return !1;
    }
    if (
      ((w = o > u ? "next" : o < u ? "prev" : "reset"),
      (p && -S === a.translate) || (!p && S === a.translate))
    )
      return (
        a.updateActiveIndex(o),
        l.autoHeight && a.updateAutoHeight(),
        a.updateSlidesClasses(),
        "slide" !== l.effect && a.setTranslate(S),
        "reset" !== w && (a.transitionStart(i, w), a.transitionEnd(i, w)),
        !1
      );
    if (l.cssMode) {
      var x,
        C = a.isHorizontal(),
        M = -S;
      if ((p && (M = v.scrollWidth - v.offsetWidth - M), 0 === t))
        v[C ? "scrollLeft" : "scrollTop"] = M;
      else if (v.scrollTo)
        v.scrollTo(
          (((x = {})[C ? "left" : "top"] = M), (x.behavior = "smooth"), x)
        );
      else v[C ? "scrollLeft" : "scrollTop"] = M;
      return !0;
    }
    return (
      0 === t
        ? (a.setTransition(0),
          a.setTranslate(S),
          a.updateActiveIndex(o),
          a.updateSlidesClasses(),
          a.emit("beforeTransitionStart", t, s),
          a.transitionStart(i, w),
          a.transitionEnd(i, w))
        : (a.setTransition(t),
          a.setTranslate(S),
          a.updateActiveIndex(o),
          a.updateSlidesClasses(),
          a.emit("beforeTransitionStart", t, s),
          a.transitionStart(i, w),
          a.animating ||
            ((a.animating = !0),
            a.onSlideToWrapperTransitionEnd ||
              (a.onSlideToWrapperTransitionEnd = function (e) {
                a &&
                  !a.destroyed &&
                  e.target === this &&
                  (a.$wrapperEl[0].removeEventListener(
                    "transitionend",
                    a.onSlideToWrapperTransitionEnd
                  ),
                  a.$wrapperEl[0].removeEventListener(
                    "webkitTransitionEnd",
                    a.onSlideToWrapperTransitionEnd
                  ),
                  (a.onSlideToWrapperTransitionEnd = null),
                  delete a.onSlideToWrapperTransitionEnd,
                  a.transitionEnd(i, w));
              }),
            a.$wrapperEl[0].addEventListener(
              "transitionend",
              a.onSlideToWrapperTransitionEnd
            ),
            a.$wrapperEl[0].addEventListener(
              "webkitTransitionEnd",
              a.onSlideToWrapperTransitionEnd
            ))),
      !0
    );
  },
  slideToLoop: function (e, t, i, s) {
    void 0 === e && (e = 0),
      void 0 === t && (t = this.params.speed),
      void 0 === i && (i = !0);
    var n = this,
      r = e;
    return n.params.loop && (r += n.loopedSlides), n.slideTo(r, t, i, s);
  },
  slideNext: function (e, t, i) {
    void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
    var s = this,
      n = s.params,
      r = s.animating;
    if (!s.enabled) return s;
    var a = s.activeIndex < n.slidesPerGroupSkip ? 1 : n.slidesPerGroup;
    if (n.loop) {
      if (r && n.loopPreventsSlide) return !1;
      s.loopFix(), (s._clientLeft = s.$wrapperEl[0].clientLeft);
    }
    return s.slideTo(s.activeIndex + a, e, t, i);
  },
  slidePrev: function (e, t, i) {
    void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
    var s = this,
      n = s.params,
      r = s.animating,
      a = s.snapGrid,
      o = s.slidesGrid,
      l = s.rtlTranslate;
    if (!s.enabled) return s;
    if (n.loop) {
      if (r && n.loopPreventsSlide) return !1;
      s.loopFix(), (s._clientLeft = s.$wrapperEl[0].clientLeft);
    }
    function d(e) {
      return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
    }
    var c,
      h = d(l ? s.translate : -s.translate),
      u = a.map(function (e) {
        return d(e);
      }),
      p = a[u.indexOf(h) - 1];
    return (
      void 0 === p &&
        n.cssMode &&
        a.forEach(function (e) {
          !p && h >= e && (p = e);
        }),
      void 0 !== p && (c = o.indexOf(p)) < 0 && (c = s.activeIndex - 1),
      s.slideTo(c, e, t, i)
    );
  },
  slideReset: function (e, t, i) {
    return (
      void 0 === e && (e = this.params.speed),
      void 0 === t && (t = !0),
      this.slideTo(this.activeIndex, e, t, i)
    );
  },
  slideToClosest: function (e, t, i, s) {
    void 0 === e && (e = this.params.speed),
      void 0 === t && (t = !0),
      void 0 === s && (s = 0.5);
    var n = this,
      r = n.activeIndex,
      a = Math.min(n.params.slidesPerGroupSkip, r),
      o = a + Math.floor((r - a) / n.params.slidesPerGroup),
      l = n.rtlTranslate ? n.translate : -n.translate;
    if (l >= n.snapGrid[o]) {
      var d = n.snapGrid[o];
      l - d > (n.snapGrid[o + 1] - d) * s && (r += n.params.slidesPerGroup);
    } else {
      var c = n.snapGrid[o - 1];
      l - c <= (n.snapGrid[o] - c) * s && (r -= n.params.slidesPerGroup);
    }
    return (
      (r = Math.max(r, 0)),
      (r = Math.min(r, n.slidesGrid.length - 1)),
      n.slideTo(r, e, t, i)
    );
  },
  slideToClickedSlide: function () {
    var e,
      t = this,
      i = t.params,
      s = t.$wrapperEl,
      n =
        "auto" === i.slidesPerView ? t.slidesPerViewDynamic() : i.slidesPerView,
      r = t.clickedIndex;
    if (i.loop) {
      if (t.animating) return;
      (e = parseInt(fe(t.clickedSlide).attr("data-swiper-slide-index"), 10)),
        i.centeredSlides
          ? r < t.loopedSlides - n / 2 ||
            r > t.slides.length - t.loopedSlides + n / 2
            ? (t.loopFix(),
              (r = s
                .children(
                  "." +
                    i.slideClass +
                    '[data-swiper-slide-index="' +
                    e +
                    '"]:not(.' +
                    i.slideDuplicateClass +
                    ")"
                )
                .eq(0)
                .index()),
              ye(function () {
                t.slideTo(r);
              }))
            : t.slideTo(r)
          : r > t.slides.length - n
          ? (t.loopFix(),
            (r = s
              .children(
                "." +
                  i.slideClass +
                  '[data-swiper-slide-index="' +
                  e +
                  '"]:not(.' +
                  i.slideDuplicateClass +
                  ")"
              )
              .eq(0)
              .index()),
            ye(function () {
              t.slideTo(r);
            }))
          : t.slideTo(r);
    } else t.slideTo(r);
  },
};
var We = {
  loopCreate: function () {
    var e = this,
      t = ne(),
      i = e.params,
      s = e.$wrapperEl;
    s.children("." + i.slideClass + "." + i.slideDuplicateClass).remove();
    var n = s.children("." + i.slideClass);
    if (i.loopFillGroupWithBlank) {
      var r = i.slidesPerGroup - (n.length % i.slidesPerGroup);
      if (r !== i.slidesPerGroup) {
        for (var a = 0; a < r; a += 1) {
          var o = fe(t.createElement("div")).addClass(
            i.slideClass + " " + i.slideBlankClass
          );
          s.append(o);
        }
        n = s.children("." + i.slideClass);
      }
    }
    "auto" !== i.slidesPerView || i.loopedSlides || (i.loopedSlides = n.length),
      (e.loopedSlides = Math.ceil(
        parseFloat(i.loopedSlides || i.slidesPerView, 10)
      )),
      (e.loopedSlides += i.loopAdditionalSlides),
      e.loopedSlides > n.length && (e.loopedSlides = n.length);
    var l = [],
      d = [];
    n.each(function (t, i) {
      var s = fe(t);
      i < e.loopedSlides && d.push(t),
        i < n.length && i >= n.length - e.loopedSlides && l.push(t),
        s.attr("data-swiper-slide-index", i);
    });
    for (var c = 0; c < d.length; c += 1)
      s.append(fe(d[c].cloneNode(!0)).addClass(i.slideDuplicateClass));
    for (var h = l.length - 1; h >= 0; h -= 1)
      s.prepend(fe(l[h].cloneNode(!0)).addClass(i.slideDuplicateClass));
  },
  loopFix: function () {
    var e = this;
    e.emit("beforeLoopFix");
    var t,
      i = e.activeIndex,
      s = e.slides,
      n = e.loopedSlides,
      r = e.allowSlidePrev,
      a = e.allowSlideNext,
      o = e.snapGrid,
      l = e.rtlTranslate;
    (e.allowSlidePrev = !0), (e.allowSlideNext = !0);
    var d = -o[i] - e.getTranslate();
    if (i < n)
      (t = s.length - 3 * n + i),
        (t += n),
        e.slideTo(t, 0, !1, !0) &&
          0 !== d &&
          e.setTranslate((l ? -e.translate : e.translate) - d);
    else if (i >= s.length - n) {
      (t = -s.length + i + n),
        (t += n),
        e.slideTo(t, 0, !1, !0) &&
          0 !== d &&
          e.setTranslate((l ? -e.translate : e.translate) - d);
    }
    (e.allowSlidePrev = r), (e.allowSlideNext = a), e.emit("loopFix");
  },
  loopDestroy: function () {
    var e = this,
      t = e.$wrapperEl,
      i = e.params,
      s = e.slides;
    t
      .children(
        "." +
          i.slideClass +
          "." +
          i.slideDuplicateClass +
          ",." +
          i.slideClass +
          "." +
          i.slideBlankClass
      )
      .remove(),
      s.removeAttr("data-swiper-slide-index");
  },
};
var He = {
  appendSlide: function (e) {
    var t = this,
      i = t.$wrapperEl,
      s = t.params;
    if ((s.loop && t.loopDestroy(), "object" == typeof e && "length" in e))
      for (var n = 0; n < e.length; n += 1) e[n] && i.append(e[n]);
    else i.append(e);
    s.loop && t.loopCreate(), (s.observer && t.support.observer) || t.update();
  },
  prependSlide: function (e) {
    var t = this,
      i = t.params,
      s = t.$wrapperEl,
      n = t.activeIndex;
    i.loop && t.loopDestroy();
    var r = n + 1;
    if ("object" == typeof e && "length" in e) {
      for (var a = 0; a < e.length; a += 1) e[a] && s.prepend(e[a]);
      r = n + e.length;
    } else s.prepend(e);
    i.loop && t.loopCreate(),
      (i.observer && t.support.observer) || t.update(),
      t.slideTo(r, 0, !1);
  },
  addSlide: function (e, t) {
    var i = this,
      s = i.$wrapperEl,
      n = i.params,
      r = i.activeIndex;
    n.loop &&
      ((r -= i.loopedSlides),
      i.loopDestroy(),
      (i.slides = s.children("." + n.slideClass)));
    var a = i.slides.length;
    if (e <= 0) i.prependSlide(t);
    else if (e >= a) i.appendSlide(t);
    else {
      for (var o = r > e ? r + 1 : r, l = [], d = a - 1; d >= e; d -= 1) {
        var c = i.slides.eq(d);
        c.remove(), l.unshift(c);
      }
      if ("object" == typeof t && "length" in t) {
        for (var h = 0; h < t.length; h += 1) t[h] && s.append(t[h]);
        o = r > e ? r + t.length : r;
      } else s.append(t);
      for (var u = 0; u < l.length; u += 1) s.append(l[u]);
      n.loop && i.loopCreate(),
        (n.observer && i.support.observer) || i.update(),
        n.loop ? i.slideTo(o + i.loopedSlides, 0, !1) : i.slideTo(o, 0, !1);
    }
  },
  removeSlide: function (e) {
    var t = this,
      i = t.params,
      s = t.$wrapperEl,
      n = t.activeIndex;
    i.loop &&
      ((n -= t.loopedSlides),
      t.loopDestroy(),
      (t.slides = s.children("." + i.slideClass)));
    var r,
      a = n;
    if ("object" == typeof e && "length" in e) {
      for (var o = 0; o < e.length; o += 1)
        (r = e[o]), t.slides[r] && t.slides.eq(r).remove(), r < a && (a -= 1);
      a = Math.max(a, 0);
    } else
      (r = e),
        t.slides[r] && t.slides.eq(r).remove(),
        r < a && (a -= 1),
        (a = Math.max(a, 0));
    i.loop && t.loopCreate(),
      (i.observer && t.support.observer) || t.update(),
      i.loop ? t.slideTo(a + t.loopedSlides, 0, !1) : t.slideTo(a, 0, !1);
  },
  removeAllSlides: function () {
    for (var e = [], t = 0; t < this.slides.length; t += 1) e.push(t);
    this.removeSlide(e);
  },
};
function qe(e) {
  var t = this,
    i = ne(),
    s = ae(),
    n = t.touchEventsData,
    r = t.params,
    a = t.touches;
  if (t.enabled && (!t.animating || !r.preventInteractionOnTransition)) {
    var o = e;
    o.originalEvent && (o = o.originalEvent);
    var l = fe(o.target);
    if (
      ("wrapper" !== r.touchEventsTarget || l.closest(t.wrapperEl).length) &&
      ((n.isTouchEvent = "touchstart" === o.type),
      (n.isTouchEvent || !("which" in o) || 3 !== o.which) &&
        !(
          (!n.isTouchEvent && "button" in o && o.button > 0) ||
          (n.isTouched && n.isMoved)
        ))
    ) {
      !!r.noSwipingClass &&
        "" !== r.noSwipingClass &&
        o.target &&
        o.target.shadowRoot &&
        e.path &&
        e.path[0] &&
        (l = fe(e.path[0]));
      var d = r.noSwipingSelector
          ? r.noSwipingSelector
          : "." + r.noSwipingClass,
        c = !(!o.target || !o.target.shadowRoot);
      if (
        r.noSwiping &&
        (c
          ? (function (e, t) {
              return (
                void 0 === t && (t = this),
                (function t(i) {
                  return i && i !== ne() && i !== ae()
                    ? (i.assignedSlot && (i = i.assignedSlot),
                      i.closest(e) || t(i.getRootNode().host))
                    : null;
                })(t)
              );
            })(d, o.target)
          : l.closest(d)[0])
      )
        t.allowClick = !0;
      else if (!r.swipeHandler || l.closest(r.swipeHandler)[0]) {
        (a.currentX =
          "touchstart" === o.type ? o.targetTouches[0].pageX : o.pageX),
          (a.currentY =
            "touchstart" === o.type ? o.targetTouches[0].pageY : o.pageY);
        var h = a.currentX,
          u = a.currentY,
          p = r.edgeSwipeDetection || r.iOSEdgeSwipeDetection,
          v = r.edgeSwipeThreshold || r.iOSEdgeSwipeThreshold;
        if (p && (h <= v || h >= s.innerWidth - v)) {
          if ("prevent" !== p) return;
          e.preventDefault();
        }
        if (
          (Ce(n, {
            isTouched: !0,
            isMoved: !1,
            allowTouchCallbacks: !0,
            isScrolling: void 0,
            startMoving: void 0,
          }),
          (a.startX = h),
          (a.startY = u),
          (n.touchStartTime = be()),
          (t.allowClick = !0),
          t.updateSize(),
          (t.swipeDirection = void 0),
          r.threshold > 0 && (n.allowThresholdMove = !1),
          "touchstart" !== o.type)
        ) {
          var f = !0;
          l.is(n.focusableElements) && (f = !1),
            i.activeElement &&
              fe(i.activeElement).is(n.focusableElements) &&
              i.activeElement !== l[0] &&
              i.activeElement.blur();
          var m = f && t.allowTouchMove && r.touchStartPreventDefault;
          (!r.touchStartForcePreventDefault && !m) ||
            l[0].isContentEditable ||
            o.preventDefault();
        }
        t.emit("touchStart", o);
      }
    }
  }
}
function je(e) {
  var t = ne(),
    i = this,
    s = i.touchEventsData,
    n = i.params,
    r = i.touches,
    a = i.rtlTranslate;
  if (i.enabled) {
    var o = e;
    if ((o.originalEvent && (o = o.originalEvent), s.isTouched)) {
      if (!s.isTouchEvent || "touchmove" === o.type) {
        var l =
            "touchmove" === o.type &&
            o.targetTouches &&
            (o.targetTouches[0] || o.changedTouches[0]),
          d = "touchmove" === o.type ? l.pageX : o.pageX,
          c = "touchmove" === o.type ? l.pageY : o.pageY;
        if (o.preventedByNestedSwiper)
          return (r.startX = d), void (r.startY = c);
        if (!i.allowTouchMove)
          return (
            (i.allowClick = !1),
            void (
              s.isTouched &&
              (Ce(r, { startX: d, startY: c, currentX: d, currentY: c }),
              (s.touchStartTime = be()))
            )
          );
        if (s.isTouchEvent && n.touchReleaseOnEdges && !n.loop)
          if (i.isVertical()) {
            if (
              (c < r.startY && i.translate <= i.maxTranslate()) ||
              (c > r.startY && i.translate >= i.minTranslate())
            )
              return (s.isTouched = !1), void (s.isMoved = !1);
          } else if (
            (d < r.startX && i.translate <= i.maxTranslate()) ||
            (d > r.startX && i.translate >= i.minTranslate())
          )
            return;
        if (
          s.isTouchEvent &&
          t.activeElement &&
          o.target === t.activeElement &&
          fe(o.target).is(s.focusableElements)
        )
          return (s.isMoved = !0), void (i.allowClick = !1);
        if (
          (s.allowTouchCallbacks && i.emit("touchMove", o),
          !(o.targetTouches && o.targetTouches.length > 1))
        ) {
          (r.currentX = d), (r.currentY = c);
          var h = r.currentX - r.startX,
            u = r.currentY - r.startY;
          if (
            !(
              i.params.threshold &&
              Math.sqrt(Math.pow(h, 2) + Math.pow(u, 2)) < i.params.threshold
            )
          ) {
            var p;
            if (void 0 === s.isScrolling)
              (i.isHorizontal() && r.currentY === r.startY) ||
              (i.isVertical() && r.currentX === r.startX)
                ? (s.isScrolling = !1)
                : h * h + u * u >= 25 &&
                  ((p = (180 * Math.atan2(Math.abs(u), Math.abs(h))) / Math.PI),
                  (s.isScrolling = i.isHorizontal()
                    ? p > n.touchAngle
                    : 90 - p > n.touchAngle));
            if (
              (s.isScrolling && i.emit("touchMoveOpposite", o),
              void 0 === s.startMoving &&
                ((r.currentX === r.startX && r.currentY === r.startY) ||
                  (s.startMoving = !0)),
              s.isScrolling)
            )
              s.isTouched = !1;
            else if (s.startMoving) {
              (i.allowClick = !1),
                !n.cssMode && o.cancelable && o.preventDefault(),
                n.touchMoveStopPropagation && !n.nested && o.stopPropagation(),
                s.isMoved ||
                  (n.loop && i.loopFix(),
                  (s.startTranslate = i.getTranslate()),
                  i.setTransition(0),
                  i.animating &&
                    i.$wrapperEl.trigger("webkitTransitionEnd transitionend"),
                  (s.allowMomentumBounce = !1),
                  !n.grabCursor ||
                    (!0 !== i.allowSlideNext && !0 !== i.allowSlidePrev) ||
                    i.setGrabCursor(!0),
                  i.emit("sliderFirstMove", o)),
                i.emit("sliderMove", o),
                (s.isMoved = !0);
              var v = i.isHorizontal() ? h : u;
              (r.diff = v),
                (v *= n.touchRatio),
                a && (v = -v),
                (i.swipeDirection = v > 0 ? "prev" : "next"),
                (s.currentTranslate = v + s.startTranslate);
              var f = !0,
                m = n.resistanceRatio;
              if (
                (n.touchReleaseOnEdges && (m = 0),
                v > 0 && s.currentTranslate > i.minTranslate()
                  ? ((f = !1),
                    n.resistance &&
                      (s.currentTranslate =
                        i.minTranslate() -
                        1 +
                        Math.pow(-i.minTranslate() + s.startTranslate + v, m)))
                  : v < 0 &&
                    s.currentTranslate < i.maxTranslate() &&
                    ((f = !1),
                    n.resistance &&
                      (s.currentTranslate =
                        i.maxTranslate() +
                        1 -
                        Math.pow(i.maxTranslate() - s.startTranslate - v, m))),
                f && (o.preventedByNestedSwiper = !0),
                !i.allowSlideNext &&
                  "next" === i.swipeDirection &&
                  s.currentTranslate < s.startTranslate &&
                  (s.currentTranslate = s.startTranslate),
                !i.allowSlidePrev &&
                  "prev" === i.swipeDirection &&
                  s.currentTranslate > s.startTranslate &&
                  (s.currentTranslate = s.startTranslate),
                i.allowSlidePrev ||
                  i.allowSlideNext ||
                  (s.currentTranslate = s.startTranslate),
                n.threshold > 0)
              ) {
                if (!(Math.abs(v) > n.threshold || s.allowThresholdMove))
                  return void (s.currentTranslate = s.startTranslate);
                if (!s.allowThresholdMove)
                  return (
                    (s.allowThresholdMove = !0),
                    (r.startX = r.currentX),
                    (r.startY = r.currentY),
                    (s.currentTranslate = s.startTranslate),
                    void (r.diff = i.isHorizontal()
                      ? r.currentX - r.startX
                      : r.currentY - r.startY)
                  );
              }
              n.followFinger &&
                !n.cssMode &&
                ((n.freeMode ||
                  n.watchSlidesProgress ||
                  n.watchSlidesVisibility) &&
                  (i.updateActiveIndex(), i.updateSlidesClasses()),
                n.freeMode &&
                  (0 === s.velocities.length &&
                    s.velocities.push({
                      position: r[i.isHorizontal() ? "startX" : "startY"],
                      time: s.touchStartTime,
                    }),
                  s.velocities.push({
                    position: r[i.isHorizontal() ? "currentX" : "currentY"],
                    time: be(),
                  })),
                i.updateProgress(s.currentTranslate),
                i.setTranslate(s.currentTranslate));
            }
          }
        }
      }
    } else s.startMoving && s.isScrolling && i.emit("touchMoveOpposite", o);
  }
}
function Ge(e) {
  var t = this,
    i = t.touchEventsData,
    s = t.params,
    n = t.touches,
    r = t.rtlTranslate,
    a = t.$wrapperEl,
    o = t.slidesGrid,
    l = t.snapGrid;
  if (t.enabled) {
    var d = e;
    if (
      (d.originalEvent && (d = d.originalEvent),
      i.allowTouchCallbacks && t.emit("touchEnd", d),
      (i.allowTouchCallbacks = !1),
      !i.isTouched)
    )
      return (
        i.isMoved && s.grabCursor && t.setGrabCursor(!1),
        (i.isMoved = !1),
        void (i.startMoving = !1)
      );
    s.grabCursor &&
      i.isMoved &&
      i.isTouched &&
      (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) &&
      t.setGrabCursor(!1);
    var c,
      h = be(),
      u = h - i.touchStartTime;
    if (
      (t.allowClick &&
        (t.updateClickedSlide(d),
        t.emit("tap click", d),
        u < 300 &&
          h - i.lastClickTime < 300 &&
          t.emit("doubleTap doubleClick", d)),
      (i.lastClickTime = be()),
      ye(function () {
        t.destroyed || (t.allowClick = !0);
      }),
      !i.isTouched ||
        !i.isMoved ||
        !t.swipeDirection ||
        0 === n.diff ||
        i.currentTranslate === i.startTranslate)
    )
      return (i.isTouched = !1), (i.isMoved = !1), void (i.startMoving = !1);
    if (
      ((i.isTouched = !1),
      (i.isMoved = !1),
      (i.startMoving = !1),
      (c = s.followFinger
        ? r
          ? t.translate
          : -t.translate
        : -i.currentTranslate),
      !s.cssMode)
    )
      if (s.freeMode) {
        if (c < -t.minTranslate()) return void t.slideTo(t.activeIndex);
        if (c > -t.maxTranslate())
          return void (t.slides.length < l.length
            ? t.slideTo(l.length - 1)
            : t.slideTo(t.slides.length - 1));
        if (s.freeModeMomentum) {
          if (i.velocities.length > 1) {
            var p = i.velocities.pop(),
              v = i.velocities.pop(),
              f = p.position - v.position,
              m = p.time - v.time;
            (t.velocity = f / m),
              (t.velocity /= 2),
              Math.abs(t.velocity) < s.freeModeMinimumVelocity &&
                (t.velocity = 0),
              (m > 150 || be() - p.time > 300) && (t.velocity = 0);
          } else t.velocity = 0;
          (t.velocity *= s.freeModeMomentumVelocityRatio),
            (i.velocities.length = 0);
          var g = 1e3 * s.freeModeMomentumRatio,
            w = t.velocity * g,
            S = t.translate + w;
          r && (S = -S);
          var y,
            b,
            T = !1,
            E = 20 * Math.abs(t.velocity) * s.freeModeMomentumBounceRatio;
          if (S < t.maxTranslate())
            s.freeModeMomentumBounce
              ? (S + t.maxTranslate() < -E && (S = t.maxTranslate() - E),
                (y = t.maxTranslate()),
                (T = !0),
                (i.allowMomentumBounce = !0))
              : (S = t.maxTranslate()),
              s.loop && s.centeredSlides && (b = !0);
          else if (S > t.minTranslate())
            s.freeModeMomentumBounce
              ? (S - t.minTranslate() > E && (S = t.minTranslate() + E),
                (y = t.minTranslate()),
                (T = !0),
                (i.allowMomentumBounce = !0))
              : (S = t.minTranslate()),
              s.loop && s.centeredSlides && (b = !0);
          else if (s.freeModeSticky) {
            for (var x, C = 0; C < l.length; C += 1)
              if (l[C] > -S) {
                x = C;
                break;
              }
            S = -(S =
              Math.abs(l[x] - S) < Math.abs(l[x - 1] - S) ||
              "next" === t.swipeDirection
                ? l[x]
                : l[x - 1]);
          }
          if (
            (b &&
              t.once("transitionEnd", function () {
                t.loopFix();
              }),
            0 !== t.velocity)
          ) {
            if (
              ((g = r
                ? Math.abs((-S - t.translate) / t.velocity)
                : Math.abs((S - t.translate) / t.velocity)),
              s.freeModeSticky)
            ) {
              var M = Math.abs((r ? -S : S) - t.translate),
                L = t.slidesSizesGrid[t.activeIndex];
              g = M < L ? s.speed : M < 2 * L ? 1.5 * s.speed : 2.5 * s.speed;
            }
          } else if (s.freeModeSticky) return void t.slideToClosest();
          s.freeModeMomentumBounce && T
            ? (t.updateProgress(y),
              t.setTransition(g),
              t.setTranslate(S),
              t.transitionStart(!0, t.swipeDirection),
              (t.animating = !0),
              a.transitionEnd(function () {
                t &&
                  !t.destroyed &&
                  i.allowMomentumBounce &&
                  (t.emit("momentumBounce"),
                  t.setTransition(s.speed),
                  setTimeout(function () {
                    t.setTranslate(y),
                      a.transitionEnd(function () {
                        t && !t.destroyed && t.transitionEnd();
                      });
                  }, 0));
              }))
            : t.velocity
            ? (t.updateProgress(S),
              t.setTransition(g),
              t.setTranslate(S),
              t.transitionStart(!0, t.swipeDirection),
              t.animating ||
                ((t.animating = !0),
                a.transitionEnd(function () {
                  t && !t.destroyed && t.transitionEnd();
                })))
            : (t.emit("_freeModeNoMomentumRelease"), t.updateProgress(S)),
            t.updateActiveIndex(),
            t.updateSlidesClasses();
        } else {
          if (s.freeModeSticky) return void t.slideToClosest();
          s.freeMode && t.emit("_freeModeNoMomentumRelease");
        }
        (!s.freeModeMomentum || u >= s.longSwipesMs) &&
          (t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses());
      } else {
        for (
          var P = 0, O = t.slidesSizesGrid[0], z = 0;
          z < o.length;
          z += z < s.slidesPerGroupSkip ? 1 : s.slidesPerGroup
        ) {
          var k = z < s.slidesPerGroupSkip - 1 ? 1 : s.slidesPerGroup;
          void 0 !== o[z + k]
            ? c >= o[z] && c < o[z + k] && ((P = z), (O = o[z + k] - o[z]))
            : c >= o[z] && ((P = z), (O = o[o.length - 1] - o[o.length - 2]));
        }
        var A = (c - o[P]) / O,
          _ = P < s.slidesPerGroupSkip - 1 ? 1 : s.slidesPerGroup;
        if (u > s.longSwipesMs) {
          if (!s.longSwipes) return void t.slideTo(t.activeIndex);
          "next" === t.swipeDirection &&
            (A >= s.longSwipesRatio ? t.slideTo(P + _) : t.slideTo(P)),
            "prev" === t.swipeDirection &&
              (A > 1 - s.longSwipesRatio ? t.slideTo(P + _) : t.slideTo(P));
        } else {
          if (!s.shortSwipes) return void t.slideTo(t.activeIndex);
          t.navigation &&
          (d.target === t.navigation.nextEl || d.target === t.navigation.prevEl)
            ? d.target === t.navigation.nextEl
              ? t.slideTo(P + _)
              : t.slideTo(P)
            : ("next" === t.swipeDirection && t.slideTo(P + _),
              "prev" === t.swipeDirection && t.slideTo(P));
        }
      }
  }
}
function Be() {
  var e = this,
    t = e.params,
    i = e.el;
  if (!i || 0 !== i.offsetWidth) {
    t.breakpoints && e.setBreakpoint();
    var s = e.allowSlideNext,
      n = e.allowSlidePrev,
      r = e.snapGrid;
    (e.allowSlideNext = !0),
      (e.allowSlidePrev = !0),
      e.updateSize(),
      e.updateSlides(),
      e.updateSlidesClasses(),
      ("auto" === t.slidesPerView || t.slidesPerView > 1) &&
      e.isEnd &&
      !e.isBeginning &&
      !e.params.centeredSlides
        ? e.slideTo(e.slides.length - 1, 0, !1, !0)
        : e.slideTo(e.activeIndex, 0, !1, !0),
      e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.run(),
      (e.allowSlidePrev = n),
      (e.allowSlideNext = s),
      e.params.watchOverflow && r !== e.snapGrid && e.checkOverflow();
  }
}
function Ye(e) {
  var t = this;
  t.enabled &&
    (t.allowClick ||
      (t.params.preventClicks && e.preventDefault(),
      t.params.preventClicksPropagation &&
        t.animating &&
        (e.stopPropagation(), e.stopImmediatePropagation())));
}
function Fe() {
  var e = this,
    t = e.wrapperEl,
    i = e.rtlTranslate;
  if (e.enabled) {
    (e.previousTranslate = e.translate),
      e.isHorizontal()
        ? (e.translate = i
            ? t.scrollWidth - t.offsetWidth - t.scrollLeft
            : -t.scrollLeft)
        : (e.translate = -t.scrollTop),
      -0 === e.translate && (e.translate = 0),
      e.updateActiveIndex(),
      e.updateSlidesClasses();
    var s = e.maxTranslate() - e.minTranslate();
    (0 === s ? 0 : (e.translate - e.minTranslate()) / s) !== e.progress &&
      e.updateProgress(i ? -e.translate : e.translate),
      e.emit("setTranslate", e.translate, !1);
  }
}
var Ve = !1;
function Xe() {}
var $e = {
  attachEvents: function () {
    var e = this,
      t = ne(),
      i = e.params,
      s = e.touchEvents,
      n = e.el,
      r = e.wrapperEl,
      a = e.device,
      o = e.support;
    (e.onTouchStart = qe.bind(e)),
      (e.onTouchMove = je.bind(e)),
      (e.onTouchEnd = Ge.bind(e)),
      i.cssMode && (e.onScroll = Fe.bind(e)),
      (e.onClick = Ye.bind(e));
    var l = !!i.nested;
    if (!o.touch && o.pointerEvents)
      n.addEventListener(s.start, e.onTouchStart, !1),
        t.addEventListener(s.move, e.onTouchMove, l),
        t.addEventListener(s.end, e.onTouchEnd, !1);
    else {
      if (o.touch) {
        var d = !(
          "touchstart" !== s.start ||
          !o.passiveListener ||
          !i.passiveListeners
        ) && { passive: !0, capture: !1 };
        n.addEventListener(s.start, e.onTouchStart, d),
          n.addEventListener(
            s.move,
            e.onTouchMove,
            o.passiveListener ? { passive: !1, capture: l } : l
          ),
          n.addEventListener(s.end, e.onTouchEnd, d),
          s.cancel && n.addEventListener(s.cancel, e.onTouchEnd, d),
          Ve || (t.addEventListener("touchstart", Xe), (Ve = !0));
      }
      ((i.simulateTouch && !a.ios && !a.android) ||
        (i.simulateTouch && !o.touch && a.ios)) &&
        (n.addEventListener("mousedown", e.onTouchStart, !1),
        t.addEventListener("mousemove", e.onTouchMove, l),
        t.addEventListener("mouseup", e.onTouchEnd, !1));
    }
    (i.preventClicks || i.preventClicksPropagation) &&
      n.addEventListener("click", e.onClick, !0),
      i.cssMode && r.addEventListener("scroll", e.onScroll),
      i.updateOnWindowResize
        ? e.on(
            a.ios || a.android
              ? "resize orientationchange observerUpdate"
              : "resize observerUpdate",
            Be,
            !0
          )
        : e.on("observerUpdate", Be, !0);
  },
  detachEvents: function () {
    var e = this,
      t = ne(),
      i = e.params,
      s = e.touchEvents,
      n = e.el,
      r = e.wrapperEl,
      a = e.device,
      o = e.support,
      l = !!i.nested;
    if (!o.touch && o.pointerEvents)
      n.removeEventListener(s.start, e.onTouchStart, !1),
        t.removeEventListener(s.move, e.onTouchMove, l),
        t.removeEventListener(s.end, e.onTouchEnd, !1);
    else {
      if (o.touch) {
        var d = !(
          "onTouchStart" !== s.start ||
          !o.passiveListener ||
          !i.passiveListeners
        ) && { passive: !0, capture: !1 };
        n.removeEventListener(s.start, e.onTouchStart, d),
          n.removeEventListener(s.move, e.onTouchMove, l),
          n.removeEventListener(s.end, e.onTouchEnd, d),
          s.cancel && n.removeEventListener(s.cancel, e.onTouchEnd, d);
      }
      ((i.simulateTouch && !a.ios && !a.android) ||
        (i.simulateTouch && !o.touch && a.ios)) &&
        (n.removeEventListener("mousedown", e.onTouchStart, !1),
        t.removeEventListener("mousemove", e.onTouchMove, l),
        t.removeEventListener("mouseup", e.onTouchEnd, !1));
    }
    (i.preventClicks || i.preventClicksPropagation) &&
      n.removeEventListener("click", e.onClick, !0),
      i.cssMode && r.removeEventListener("scroll", e.onScroll),
      e.off(
        a.ios || a.android
          ? "resize orientationchange observerUpdate"
          : "resize observerUpdate",
        Be
      );
  },
};
var Ue = {
  setBreakpoint: function () {
    var e = this,
      t = e.activeIndex,
      i = e.initialized,
      s = e.loopedSlides,
      n = void 0 === s ? 0 : s,
      r = e.params,
      a = e.$el,
      o = r.breakpoints;
    if (o && (!o || 0 !== Object.keys(o).length)) {
      var l = e.getBreakpoint(o, e.params.breakpointsBase, e.el);
      if (l && e.currentBreakpoint !== l) {
        var d = l in o ? o[l] : void 0;
        d &&
          [
            "slidesPerView",
            "spaceBetween",
            "slidesPerGroup",
            "slidesPerGroupSkip",
            "slidesPerColumn",
          ].forEach(function (e) {
            var t = d[e];
            void 0 !== t &&
              (d[e] =
                "slidesPerView" !== e || ("AUTO" !== t && "auto" !== t)
                  ? "slidesPerView" === e
                    ? parseFloat(t)
                    : parseInt(t, 10)
                  : "auto");
          });
        var c = d || e.originalParams,
          h = r.slidesPerColumn > 1,
          u = c.slidesPerColumn > 1,
          p = r.enabled;
        h && !u
          ? (a.removeClass(
              r.containerModifierClass +
                "multirow " +
                r.containerModifierClass +
                "multirow-column"
            ),
            e.emitContainerClasses())
          : !h &&
            u &&
            (a.addClass(r.containerModifierClass + "multirow"),
            ((c.slidesPerColumnFill && "column" === c.slidesPerColumnFill) ||
              (!c.slidesPerColumnFill && "column" === r.slidesPerColumnFill)) &&
              a.addClass(r.containerModifierClass + "multirow-column"),
            e.emitContainerClasses());
        var v = c.direction && c.direction !== r.direction,
          f = r.loop && (c.slidesPerView !== r.slidesPerView || v);
        v && i && e.changeDirection(), Ce(e.params, c);
        var m = e.params.enabled;
        Ce(e, {
          allowTouchMove: e.params.allowTouchMove,
          allowSlideNext: e.params.allowSlideNext,
          allowSlidePrev: e.params.allowSlidePrev,
        }),
          p && !m ? e.disable() : !p && m && e.enable(),
          (e.currentBreakpoint = l),
          e.emit("_beforeBreakpoint", c),
          f &&
            i &&
            (e.loopDestroy(),
            e.loopCreate(),
            e.updateSlides(),
            e.slideTo(t - n + e.loopedSlides, 0, !1)),
          e.emit("breakpoint", c);
      }
    }
  },
  getBreakpoint: function (e, t, i) {
    if ((void 0 === t && (t = "window"), e && ("container" !== t || i))) {
      var s = !1,
        n = ae(),
        r = "window" === t ? n.innerHeight : i.clientHeight,
        a = Object.keys(e).map(function (e) {
          if ("string" == typeof e && 0 === e.indexOf("@")) {
            var t = parseFloat(e.substr(1));
            return { value: r * t, point: e };
          }
          return { value: e, point: e };
        });
      a.sort(function (e, t) {
        return parseInt(e.value, 10) - parseInt(t.value, 10);
      });
      for (var o = 0; o < a.length; o += 1) {
        var l = a[o],
          d = l.point,
          c = l.value;
        "window" === t
          ? n.matchMedia("(min-width: " + c + "px)").matches && (s = d)
          : c <= i.clientWidth && (s = d);
      }
      return s || "max";
    }
  },
};
var Ze = {
  addClasses: function () {
    var e,
      t,
      i,
      s = this,
      n = s.classNames,
      r = s.params,
      a = s.rtl,
      o = s.$el,
      l = s.device,
      d = s.support,
      c =
        ((e = [
          "initialized",
          r.direction,
          { "pointer-events": d.pointerEvents && !d.touch },
          { "free-mode": r.freeMode },
          { autoheight: r.autoHeight },
          { rtl: a },
          { multirow: r.slidesPerColumn > 1 },
          {
            "multirow-column":
              r.slidesPerColumn > 1 && "column" === r.slidesPerColumnFill,
          },
          { android: l.android },
          { ios: l.ios },
          { "css-mode": r.cssMode },
        ]),
        (t = r.containerModifierClass),
        (i = []),
        e.forEach(function (e) {
          "object" == typeof e
            ? Object.keys(e).forEach(function (s) {
                e[s] && i.push(t + s);
              })
            : "string" == typeof e && i.push(t + e);
        }),
        i);
    n.push.apply(n, c),
      o.addClass([].concat(n).join(" ")),
      s.emitContainerClasses();
  },
  removeClasses: function () {
    var e = this,
      t = e.$el,
      i = e.classNames;
    t.removeClass(i.join(" ")), e.emitContainerClasses();
  },
};
var Ke = {
  loadImage: function (e, t, i, s, n, r) {
    var a,
      o = ae();
    function l() {
      r && r();
    }
    fe(e).parent("picture")[0] || (e.complete && n)
      ? l()
      : t
      ? (((a = new o.Image()).onload = l),
        (a.onerror = l),
        s && (a.sizes = s),
        i && (a.srcset = i),
        t && (a.src = t))
      : l();
  },
  preloadImages: function () {
    var e = this;
    function t() {
      null != e &&
        e &&
        !e.destroyed &&
        (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1),
        e.imagesLoaded === e.imagesToLoad.length &&
          (e.params.updateOnImagesReady && e.update(), e.emit("imagesReady")));
    }
    e.imagesToLoad = e.$el.find("img");
    for (var i = 0; i < e.imagesToLoad.length; i += 1) {
      var s = e.imagesToLoad[i];
      e.loadImage(
        s,
        s.currentSrc || s.getAttribute("src"),
        s.srcset || s.getAttribute("srcset"),
        s.sizes || s.getAttribute("sizes"),
        !0,
        t
      );
    }
  },
};
var Je = {
  init: !0,
  direction: "horizontal",
  touchEventsTarget: "container",
  initialSlide: 0,
  speed: 300,
  cssMode: !1,
  updateOnWindowResize: !0,
  resizeObserver: !1,
  nested: !1,
  createElements: !1,
  enabled: !0,
  focusableElements: "input, select, option, textarea, button, video, label",
  width: null,
  height: null,
  preventInteractionOnTransition: !1,
  userAgent: null,
  url: null,
  edgeSwipeDetection: !1,
  edgeSwipeThreshold: 20,
  freeMode: !1,
  freeModeMomentum: !0,
  freeModeMomentumRatio: 1,
  freeModeMomentumBounce: !0,
  freeModeMomentumBounceRatio: 1,
  freeModeMomentumVelocityRatio: 1,
  freeModeSticky: !1,
  freeModeMinimumVelocity: 0.02,
  autoHeight: !1,
  setWrapperSize: !1,
  virtualTranslate: !1,
  effect: "slide",
  breakpoints: void 0,
  breakpointsBase: "window",
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerColumn: 1,
  slidesPerColumnFill: "column",
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  centeredSlides: !1,
  centeredSlidesBounds: !1,
  slidesOffsetBefore: 0,
  slidesOffsetAfter: 0,
  normalizeSlideIndex: !0,
  centerInsufficientSlides: !1,
  watchOverflow: !1,
  roundLengths: !1,
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: !0,
  shortSwipes: !0,
  longSwipes: !0,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: !0,
  allowTouchMove: !0,
  threshold: 0,
  touchMoveStopPropagation: !1,
  touchStartPreventDefault: !0,
  touchStartForcePreventDefault: !1,
  touchReleaseOnEdges: !1,
  uniqueNavElements: !0,
  resistance: !0,
  resistanceRatio: 0.85,
  watchSlidesProgress: !1,
  watchSlidesVisibility: !1,
  grabCursor: !1,
  preventClicks: !0,
  preventClicksPropagation: !0,
  slideToClickedSlide: !1,
  preloadImages: !0,
  updateOnImagesReady: !0,
  loop: !1,
  loopAdditionalSlides: 0,
  loopedSlides: null,
  loopFillGroupWithBlank: !1,
  loopPreventsSlide: !0,
  allowSlidePrev: !0,
  allowSlideNext: !0,
  swipeHandler: null,
  noSwiping: !0,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  passiveListeners: !0,
  containerModifierClass: "swiper-container-",
  slideClass: "swiper-slide",
  slideBlankClass: "swiper-slide-invisible-blank",
  slideActiveClass: "swiper-slide-active",
  slideDuplicateActiveClass: "swiper-slide-duplicate-active",
  slideVisibleClass: "swiper-slide-visible",
  slideDuplicateClass: "swiper-slide-duplicate",
  slideNextClass: "swiper-slide-next",
  slideDuplicateNextClass: "swiper-slide-duplicate-next",
  slidePrevClass: "swiper-slide-prev",
  slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
  wrapperClass: "swiper-wrapper",
  runCallbacksOnInit: !0,
  _emitClasses: !1,
};
function Qe(e, t) {
  for (var i = 0; i < t.length; i++) {
    var s = t[i];
    (s.enumerable = s.enumerable || !1),
      (s.configurable = !0),
      "value" in s && (s.writable = !0),
      Object.defineProperty(e, s.key, s);
  }
}
var et = {
    modular: {
      useParams: function (e) {
        var t = this;
        t.modules &&
          Object.keys(t.modules).forEach(function (i) {
            var s = t.modules[i];
            s.params && Ce(e, s.params);
          });
      },
      useModules: function (e) {
        void 0 === e && (e = {});
        var t = this;
        t.modules &&
          Object.keys(t.modules).forEach(function (i) {
            var s = t.modules[i],
              n = e[i] || {};
            s.on &&
              t.on &&
              Object.keys(s.on).forEach(function (e) {
                t.on(e, s.on[e]);
              }),
              s.create && s.create.bind(t)(n);
          });
      },
    },
    eventsEmitter: Ie,
    update: Re,
    translate: De,
    transition: {
      setTransition: function (e, t) {
        var i = this;
        i.params.cssMode || i.$wrapperEl.transition(e),
          i.emit("setTransition", e, t);
      },
      transitionStart: function (e, t) {
        void 0 === e && (e = !0);
        var i = this,
          s = i.activeIndex,
          n = i.params,
          r = i.previousIndex;
        if (!n.cssMode) {
          n.autoHeight && i.updateAutoHeight();
          var a = t;
          if (
            (a || (a = s > r ? "next" : s < r ? "prev" : "reset"),
            i.emit("transitionStart"),
            e && s !== r)
          ) {
            if ("reset" === a) return void i.emit("slideResetTransitionStart");
            i.emit("slideChangeTransitionStart"),
              "next" === a
                ? i.emit("slideNextTransitionStart")
                : i.emit("slidePrevTransitionStart");
          }
        }
      },
      transitionEnd: function (e, t) {
        void 0 === e && (e = !0);
        var i = this,
          s = i.activeIndex,
          n = i.previousIndex,
          r = i.params;
        if (((i.animating = !1), !r.cssMode)) {
          i.setTransition(0);
          var a = t;
          if (
            (a || (a = s > n ? "next" : s < n ? "prev" : "reset"),
            i.emit("transitionEnd"),
            e && s !== n)
          ) {
            if ("reset" === a) return void i.emit("slideResetTransitionEnd");
            i.emit("slideChangeTransitionEnd"),
              "next" === a
                ? i.emit("slideNextTransitionEnd")
                : i.emit("slidePrevTransitionEnd");
          }
        }
      },
    },
    slide: Ne,
    loop: We,
    grabCursor: {
      setGrabCursor: function (e) {
        var t = this;
        if (
          !(
            t.support.touch ||
            !t.params.simulateTouch ||
            (t.params.watchOverflow && t.isLocked) ||
            t.params.cssMode
          )
        ) {
          var i = t.el;
          (i.style.cursor = "move"),
            (i.style.cursor = e ? "-webkit-grabbing" : "-webkit-grab"),
            (i.style.cursor = e ? "-moz-grabbin" : "-moz-grab"),
            (i.style.cursor = e ? "grabbing" : "grab");
        }
      },
      unsetGrabCursor: function () {
        var e = this;
        e.support.touch ||
          (e.params.watchOverflow && e.isLocked) ||
          e.params.cssMode ||
          (e.el.style.cursor = "");
      },
    },
    manipulation: He,
    events: $e,
    breakpoints: Ue,
    checkOverflow: {
      checkOverflow: function () {
        var e = this,
          t = e.params,
          i = e.isLocked,
          s =
            e.slides.length > 0 &&
            t.slidesOffsetBefore +
              t.spaceBetween * (e.slides.length - 1) +
              e.slides[0].offsetWidth * e.slides.length;
        t.slidesOffsetBefore && t.slidesOffsetAfter && s
          ? (e.isLocked = s <= e.size)
          : (e.isLocked = 1 === e.snapGrid.length),
          (e.allowSlideNext = !e.isLocked),
          (e.allowSlidePrev = !e.isLocked),
          i !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock"),
          i &&
            i !== e.isLocked &&
            ((e.isEnd = !1), e.navigation && e.navigation.update());
      },
    },
    classes: Ze,
    images: Ke,
  },
  tt = {},
  it = (function () {
    function e() {
      for (var t, i, s = arguments.length, n = new Array(s), r = 0; r < s; r++)
        n[r] = arguments[r];
      if (
        (1 === n.length &&
        n[0].constructor &&
        "Object" === Object.prototype.toString.call(n[0]).slice(8, -1)
          ? (i = n[0])
          : ((t = n[0]), (i = n[1])),
        i || (i = {}),
        (i = Ce({}, i)),
        t && !i.el && (i.el = t),
        i.el && fe(i.el).length > 1)
      ) {
        var a = [];
        return (
          fe(i.el).each(function (t) {
            var s = Ce({}, i, { el: t });
            a.push(new e(s));
          }),
          a
        );
      }
      var o = this;
      (o.__swiper__ = !0),
        (o.support = Le()),
        (o.device = Pe({ userAgent: i.userAgent })),
        (o.browser = Oe()),
        (o.eventsListeners = {}),
        (o.eventsAnyListeners = []),
        void 0 === o.modules && (o.modules = {}),
        Object.keys(o.modules).forEach(function (e) {
          var t = o.modules[e];
          if (t.params) {
            var s = Object.keys(t.params)[0],
              n = t.params[s];
            if ("object" != typeof n || null === n) return;
            if (
              (["navigation", "pagination", "scrollbar"].indexOf(s) >= 0 &&
                !0 === i[s] &&
                (i[s] = { auto: !0 }),
              !(s in i) || !("enabled" in n))
            )
              return;
            !0 === i[s] && (i[s] = { enabled: !0 }),
              "object" != typeof i[s] ||
                "enabled" in i[s] ||
                (i[s].enabled = !0),
              i[s] || (i[s] = { enabled: !1 });
          }
        });
      var l,
        d,
        c = Ce({}, Je);
      return (
        o.useParams(c),
        (o.params = Ce({}, c, tt, i)),
        (o.originalParams = Ce({}, o.params)),
        (o.passedParams = Ce({}, i)),
        o.params &&
          o.params.on &&
          Object.keys(o.params.on).forEach(function (e) {
            o.on(e, o.params.on[e]);
          }),
        o.params && o.params.onAny && o.onAny(o.params.onAny),
        (o.$ = fe),
        Ce(o, {
          enabled: o.params.enabled,
          el: t,
          classNames: [],
          slides: fe(),
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],
          isHorizontal: function () {
            return "horizontal" === o.params.direction;
          },
          isVertical: function () {
            return "vertical" === o.params.direction;
          },
          activeIndex: 0,
          realIndex: 0,
          isBeginning: !0,
          isEnd: !1,
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: !1,
          allowSlideNext: o.params.allowSlideNext,
          allowSlidePrev: o.params.allowSlidePrev,
          touchEvents:
            ((l = ["touchstart", "touchmove", "touchend", "touchcancel"]),
            (d = ["mousedown", "mousemove", "mouseup"]),
            o.support.pointerEvents &&
              (d = ["pointerdown", "pointermove", "pointerup"]),
            (o.touchEventsTouch = {
              start: l[0],
              move: l[1],
              end: l[2],
              cancel: l[3],
            }),
            (o.touchEventsDesktop = { start: d[0], move: d[1], end: d[2] }),
            o.support.touch || !o.params.simulateTouch
              ? o.touchEventsTouch
              : o.touchEventsDesktop),
          touchEventsData: {
            isTouched: void 0,
            isMoved: void 0,
            allowTouchCallbacks: void 0,
            touchStartTime: void 0,
            isScrolling: void 0,
            currentTranslate: void 0,
            startTranslate: void 0,
            allowThresholdMove: void 0,
            focusableElements: o.params.focusableElements,
            lastClickTime: be(),
            clickTimeout: void 0,
            velocities: [],
            allowMomentumBounce: void 0,
            isTouchEvent: void 0,
            startMoving: void 0,
          },
          allowClick: !0,
          allowTouchMove: o.params.allowTouchMove,
          touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
          imagesToLoad: [],
          imagesLoaded: 0,
        }),
        o.useModules(),
        o.emit("_swiper"),
        o.params.init && o.init(),
        o
      );
    }
    var t,
      i,
      s,
      n = e.prototype;
    return (
      (n.enable = function () {
        var e = this;
        e.enabled ||
          ((e.enabled = !0),
          e.params.grabCursor && e.setGrabCursor(),
          e.emit("enable"));
      }),
      (n.disable = function () {
        var e = this;
        e.enabled &&
          ((e.enabled = !1),
          e.params.grabCursor && e.unsetGrabCursor(),
          e.emit("disable"));
      }),
      (n.setProgress = function (e, t) {
        var i = this;
        e = Math.min(Math.max(e, 0), 1);
        var s = i.minTranslate(),
          n = (i.maxTranslate() - s) * e + s;
        i.translateTo(n, void 0 === t ? 0 : t),
          i.updateActiveIndex(),
          i.updateSlidesClasses();
      }),
      (n.emitContainerClasses = function () {
        var e = this;
        if (e.params._emitClasses && e.el) {
          var t = e.el.className.split(" ").filter(function (t) {
            return (
              0 === t.indexOf("swiper-container") ||
              0 === t.indexOf(e.params.containerModifierClass)
            );
          });
          e.emit("_containerClasses", t.join(" "));
        }
      }),
      (n.getSlideClasses = function (e) {
        var t = this;
        return e.className
          .split(" ")
          .filter(function (e) {
            return (
              0 === e.indexOf("swiper-slide") ||
              0 === e.indexOf(t.params.slideClass)
            );
          })
          .join(" ");
      }),
      (n.emitSlidesClasses = function () {
        var e = this;
        if (e.params._emitClasses && e.el) {
          var t = [];
          e.slides.each(function (i) {
            var s = e.getSlideClasses(i);
            t.push({ slideEl: i, classNames: s }), e.emit("_slideClass", i, s);
          }),
            e.emit("_slideClasses", t);
        }
      }),
      (n.slidesPerViewDynamic = function () {
        var e = this,
          t = e.params,
          i = e.slides,
          s = e.slidesGrid,
          n = e.size,
          r = e.activeIndex,
          a = 1;
        if (t.centeredSlides) {
          for (var o, l = i[r].swiperSlideSize, d = r + 1; d < i.length; d += 1)
            i[d] &&
              !o &&
              ((a += 1), (l += i[d].swiperSlideSize) > n && (o = !0));
          for (var c = r - 1; c >= 0; c -= 1)
            i[c] &&
              !o &&
              ((a += 1), (l += i[c].swiperSlideSize) > n && (o = !0));
        } else
          for (var h = r + 1; h < i.length; h += 1) s[h] - s[r] < n && (a += 1);
        return a;
      }),
      (n.update = function () {
        var e = this;
        if (e && !e.destroyed) {
          var t = e.snapGrid,
            i = e.params;
          i.breakpoints && e.setBreakpoint(),
            e.updateSize(),
            e.updateSlides(),
            e.updateProgress(),
            e.updateSlidesClasses(),
            e.params.freeMode
              ? (s(), e.params.autoHeight && e.updateAutoHeight())
              : (("auto" === e.params.slidesPerView ||
                  e.params.slidesPerView > 1) &&
                e.isEnd &&
                !e.params.centeredSlides
                  ? e.slideTo(e.slides.length - 1, 0, !1, !0)
                  : e.slideTo(e.activeIndex, 0, !1, !0)) || s(),
            i.watchOverflow && t !== e.snapGrid && e.checkOverflow(),
            e.emit("update");
        }
        function s() {
          var t = e.rtlTranslate ? -1 * e.translate : e.translate,
            i = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
          e.setTranslate(i), e.updateActiveIndex(), e.updateSlidesClasses();
        }
      }),
      (n.changeDirection = function (e, t) {
        void 0 === t && (t = !0);
        var i = this,
          s = i.params.direction;
        return (
          e || (e = "horizontal" === s ? "vertical" : "horizontal"),
          e === s ||
            ("horizontal" !== e && "vertical" !== e) ||
            (i.$el
              .removeClass("" + i.params.containerModifierClass + s)
              .addClass("" + i.params.containerModifierClass + e),
            i.emitContainerClasses(),
            (i.params.direction = e),
            i.slides.each(function (t) {
              "vertical" === e ? (t.style.width = "") : (t.style.height = "");
            }),
            i.emit("changeDirection"),
            t && i.update()),
          i
        );
      }),
      (n.mount = function (e) {
        var t = this;
        if (t.mounted) return !0;
        var i = fe(e || t.params.el);
        if (!(e = i[0])) return !1;
        e.swiper = t;
        var s = function () {
            return (
              "." + (t.params.wrapperClass || "").trim().split(" ").join(".")
            );
          },
          n = (function () {
            if (e && e.shadowRoot && e.shadowRoot.querySelector) {
              var t = fe(e.shadowRoot.querySelector(s()));
              return (
                (t.children = function (e) {
                  return i.children(e);
                }),
                t
              );
            }
            return i.children(s());
          })();
        if (0 === n.length && t.params.createElements) {
          var r = ne().createElement("div");
          (n = fe(r)),
            (r.className = t.params.wrapperClass),
            i.append(r),
            i.children("." + t.params.slideClass).each(function (e) {
              n.append(e);
            });
        }
        return (
          Ce(t, {
            $el: i,
            el: e,
            $wrapperEl: n,
            wrapperEl: n[0],
            mounted: !0,
            rtl: "rtl" === e.dir.toLowerCase() || "rtl" === i.css("direction"),
            rtlTranslate:
              "horizontal" === t.params.direction &&
              ("rtl" === e.dir.toLowerCase() || "rtl" === i.css("direction")),
            wrongRTL: "-webkit-box" === n.css("display"),
          }),
          !0
        );
      }),
      (n.init = function (e) {
        var t = this;
        return (
          t.initialized ||
            !1 === t.mount(e) ||
            (t.emit("beforeInit"),
            t.params.breakpoints && t.setBreakpoint(),
            t.addClasses(),
            t.params.loop && t.loopCreate(),
            t.updateSize(),
            t.updateSlides(),
            t.params.watchOverflow && t.checkOverflow(),
            t.params.grabCursor && t.enabled && t.setGrabCursor(),
            t.params.preloadImages && t.preloadImages(),
            t.params.loop
              ? t.slideTo(
                  t.params.initialSlide + t.loopedSlides,
                  0,
                  t.params.runCallbacksOnInit,
                  !1,
                  !0
                )
              : t.slideTo(
                  t.params.initialSlide,
                  0,
                  t.params.runCallbacksOnInit,
                  !1,
                  !0
                ),
            t.attachEvents(),
            (t.initialized = !0),
            t.emit("init"),
            t.emit("afterInit")),
          t
        );
      }),
      (n.destroy = function (e, t) {
        void 0 === e && (e = !0), void 0 === t && (t = !0);
        var i,
          s = this,
          n = s.params,
          r = s.$el,
          a = s.$wrapperEl,
          o = s.slides;
        return (
          void 0 === s.params ||
            s.destroyed ||
            (s.emit("beforeDestroy"),
            (s.initialized = !1),
            s.detachEvents(),
            n.loop && s.loopDestroy(),
            t &&
              (s.removeClasses(),
              r.removeAttr("style"),
              a.removeAttr("style"),
              o &&
                o.length &&
                o
                  .removeClass(
                    [
                      n.slideVisibleClass,
                      n.slideActiveClass,
                      n.slideNextClass,
                      n.slidePrevClass,
                    ].join(" ")
                  )
                  .removeAttr("style")
                  .removeAttr("data-swiper-slide-index")),
            s.emit("destroy"),
            Object.keys(s.eventsListeners).forEach(function (e) {
              s.off(e);
            }),
            !1 !== e &&
              ((s.$el[0].swiper = null),
              (i = s),
              Object.keys(i).forEach(function (e) {
                try {
                  i[e] = null;
                } catch (e) {}
                try {
                  delete i[e];
                } catch (e) {}
              })),
            (s.destroyed = !0)),
          null
        );
      }),
      (e.extendDefaults = function (e) {
        Ce(tt, e);
      }),
      (e.installModule = function (t) {
        e.prototype.modules || (e.prototype.modules = {});
        var i = t.name || Object.keys(e.prototype.modules).length + "_" + be();
        e.prototype.modules[i] = t;
      }),
      (e.use = function (t) {
        return Array.isArray(t)
          ? (t.forEach(function (t) {
              return e.installModule(t);
            }),
            e)
          : (e.installModule(t), e);
      }),
      (t = e),
      (s = [
        {
          key: "extendedDefaults",
          get: function () {
            return tt;
          },
        },
        {
          key: "defaults",
          get: function () {
            return Je;
          },
        },
      ]),
      (i = null) && Qe(t.prototype, i),
      s && Qe(t, s),
      e
    );
  })();
Object.keys(et).forEach(function (e) {
  Object.keys(et[e]).forEach(function (t) {
    it.prototype[t] = et[e][t];
  });
}),
  it.use([ze, _e]);
var st = it;
function nt() {
  return (
    (nt =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var i = arguments[t];
          for (var s in i)
            Object.prototype.hasOwnProperty.call(i, s) && (e[s] = i[s]);
        }
        return e;
      }),
    nt.apply(this, arguments)
  );
}
var rt = {
    toggleEl: function (e, t) {
      e[t ? "addClass" : "removeClass"](this.params.navigation.disabledClass),
        e[0] && "BUTTON" === e[0].tagName && (e[0].disabled = t);
    },
    update: function () {
      var e = this,
        t = e.params.navigation,
        i = e.navigation.toggleEl;
      if (!e.params.loop) {
        var s = e.navigation,
          n = s.$nextEl,
          r = s.$prevEl;
        r &&
          r.length > 0 &&
          (e.isBeginning ? i(r, !0) : i(r, !1),
          e.params.watchOverflow &&
            e.enabled &&
            r[e.isLocked ? "addClass" : "removeClass"](t.lockClass)),
          n &&
            n.length > 0 &&
            (e.isEnd ? i(n, !0) : i(n, !1),
            e.params.watchOverflow &&
              e.enabled &&
              n[e.isLocked ? "addClass" : "removeClass"](t.lockClass));
      }
    },
    onPrevClick: function (e) {
      var t = this;
      e.preventDefault(), (t.isBeginning && !t.params.loop) || t.slidePrev();
    },
    onNextClick: function (e) {
      var t = this;
      e.preventDefault(), (t.isEnd && !t.params.loop) || t.slideNext();
    },
    init: function () {
      var e,
        t,
        i = this,
        s = i.params.navigation;
      ((i.params.navigation = (function (e, t, i, s) {
        var n = ne();
        return (
          i &&
            Object.keys(s).forEach(function (i) {
              if (!t[i] && !0 === t.auto) {
                var r = n.createElement("div");
                (r.className = s[i]), e.append(r), (t[i] = r);
              }
            }),
          t
        );
      })(i.$el, i.params.navigation, i.params.createElements, {
        nextEl: "swiper-button-next",
        prevEl: "swiper-button-prev",
      })),
      s.nextEl || s.prevEl) &&
        (s.nextEl &&
          ((e = fe(s.nextEl)),
          i.params.uniqueNavElements &&
            "string" == typeof s.nextEl &&
            e.length > 1 &&
            1 === i.$el.find(s.nextEl).length &&
            (e = i.$el.find(s.nextEl))),
        s.prevEl &&
          ((t = fe(s.prevEl)),
          i.params.uniqueNavElements &&
            "string" == typeof s.prevEl &&
            t.length > 1 &&
            1 === i.$el.find(s.prevEl).length &&
            (t = i.$el.find(s.prevEl))),
        e && e.length > 0 && e.on("click", i.navigation.onNextClick),
        t && t.length > 0 && t.on("click", i.navigation.onPrevClick),
        Ce(i.navigation, {
          $nextEl: e,
          nextEl: e && e[0],
          $prevEl: t,
          prevEl: t && t[0],
        }),
        i.enabled ||
          (e && e.addClass(s.lockClass), t && t.addClass(s.lockClass)));
    },
    destroy: function () {
      var e = this,
        t = e.navigation,
        i = t.$nextEl,
        s = t.$prevEl;
      i &&
        i.length &&
        (i.off("click", e.navigation.onNextClick),
        i.removeClass(e.params.navigation.disabledClass)),
        s &&
          s.length &&
          (s.off("click", e.navigation.onPrevClick),
          s.removeClass(e.params.navigation.disabledClass));
    },
  },
  at = {
    name: "navigation",
    params: {
      navigation: {
        nextEl: null,
        prevEl: null,
        hideOnClick: !1,
        disabledClass: "swiper-button-disabled",
        hiddenClass: "swiper-button-hidden",
        lockClass: "swiper-button-lock",
      },
    },
    create: function () {
      Me(this, { navigation: nt({}, rt) });
    },
    on: {
      init: function (e) {
        e.navigation.init(), e.navigation.update();
      },
      toEdge: function (e) {
        e.navigation.update();
      },
      fromEdge: function (e) {
        e.navigation.update();
      },
      destroy: function (e) {
        e.navigation.destroy();
      },
      "enable disable": function (e) {
        var t = e.navigation,
          i = t.$nextEl,
          s = t.$prevEl;
        i &&
          i[e.enabled ? "removeClass" : "addClass"](
            e.params.navigation.lockClass
          ),
          s &&
            s[e.enabled ? "removeClass" : "addClass"](
              e.params.navigation.lockClass
            );
      },
      click: function (e, t) {
        var i = e.navigation,
          s = i.$nextEl,
          n = i.$prevEl,
          r = t.target;
        if (e.params.navigation.hideOnClick && !fe(r).is(n) && !fe(r).is(s)) {
          if (
            e.pagination &&
            e.params.pagination &&
            e.params.pagination.clickable &&
            (e.pagination.el === r || e.pagination.el.contains(r))
          )
            return;
          var a;
          s
            ? (a = s.hasClass(e.params.navigation.hiddenClass))
            : n && (a = n.hasClass(e.params.navigation.hiddenClass)),
            !0 === a ? e.emit("navigationShow") : e.emit("navigationHide"),
            s && s.toggleClass(e.params.navigation.hiddenClass),
            n && n.toggleClass(e.params.navigation.hiddenClass);
        }
      },
    },
  };
class ot {
  constructor(e) {
    if (((this.el = e), !this.el)) return;
    if (
      ((this.wrap = this.el.querySelector("[data-rail-wrap]")),
      (this.row = this.el.querySelector("[data-rail-row]")),
      !this.wrap || !this.row)
    )
      return;
    (this.breakpoint = 760),
      (this.hasRotate = e.dataset.railRotate || !1),
      (this.step = 1 * this.el.dataset.railSpeed || 1),
      (this.x = 0),
      (this.virtualX = window.innerWidth / 2),
      (this.lastInputX = this.virtualX);
    let t = this.row.cloneNode(!0);
    this.wrap.appendChild(t),
      (this.images = this.el.querySelectorAll("[data-rail-img]")),
      this.resize(),
      this.step > 0 && (this.wrap.style.justifyContent = "flex-end"),
      (this.resize = this.resize.bind(this)),
      addEventListener("resize", this.resize),
      this.hasRotate &&
        ((this.mouseMoveHandler = this.mouseMoveHandler.bind(this)),
        addEventListener("mousemove", this.mouseMoveHandler),
        addEventListener("touchmove", this.mouseMoveHandler)),
      this.play();
  }
  resize() {
    let e = this.isMobile;
    (this.vw = innerWidth),
      (this.isMobile = this.vw < this.breakpoint + 1),
      e !== this.isMobile &&
        (this.isMobile
          ? this.images.forEach(
              (e) => (e.style.width = "".concat(0.8 * e.width, "px"))
            )
          : this.images.forEach((e) => (e.style.width = ""))),
      (this.rowWidth = this.row.offsetWidth);
  }
  mouseMoveHandler(e) {
    this.lastInputX = void 0 !== e.clientX ? e.clientX : e.touches[0].clientX;
  }
  play() {
    (this.isPlaying = !0), this.cycle();
  }
  stop() {
    this.isPlaying = !1;
  }
  cycle() {
    this.isPlaying &&
      (this.update(), requestAnimationFrame(() => this.cycle()));
  }
  update() {
    if (
      ((this.x = this.x + this.step),
      Math.abs(this.x) >= this.rowWidth && (this.x = 0),
      (this.wrap.style.transform = "translate3d(".concat(this.x, "px, 0, 0)")),
      this.hasRotate)
    ) {
      this.virtualX =
        ((e = this.virtualX), (t = this.lastInputX), e + 0.02 * (t - e));
      let i = ((2 * this.virtualX) / this.vw - 1) * this.el.dataset.railRotate;
      this.el.style.transform = "rotateY(".concat(i, "deg)");
    }
    var e, t;
  }
}
const lt = new IntersectionObserver((e, t) => {
    e.forEach((e) => {
      e.isIntersecting &&
        (e.target.classList.add("is-inview"), t.unobserve(e.target));
    });
  }),
  dt = (e) => {
    const t = e.toLowerCase();
    return "<br>" === t || "<br/>" === t;
  };
class ct {
  constructor(e) {
    if (((this.root = e), !this.root)) return;
    (this.copy = this.root.innerHTML),
      (this.outerClass = "splitter__outer"),
      (this.innerClass = "splitter__inner"),
      (this.windowWidth = window.innerWidth),
      (this.output = []);
    for (let e = 0; e < this.root.childNodes.length; e++) {
      let t = this.root.childNodes[e];
      if (t.nodeType === Node.TEXT_NODE) {
        let e = t.nodeValue.split(/[\s\n\t]+/).filter((e) => "" !== e);
        e.length && this.output.push.apply(this.output, e);
      } else t.nodeType === Node.ELEMENT_NODE && this.output.push(t.outerHTML);
    }
    this.splitText(this.root, this.output);
    const t = o(() => {
      this.windowWidth !== window.innerWidth &&
        ((this.windowWidth = window.innerWidth),
        (this.root.innerHTML = this.copy),
        this.splitText(this.root, this.output));
    }, 200);
    window.addEventListener("resize", t), lt.observe(this.root);
  }
  splitText() {
    let e =
        arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : this.root,
      t =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : this.output;
    const i = e.offsetWidth;
    e.innerHTML = "";
    const s = (t) => {
      const n = document.createElement("span");
      n.classList.add(this.innerClass);
      const r = document.createElement("span");
      r.classList.add(this.outerClass), r.appendChild(n), e.appendChild(r);
      let a = [];
      for (let e = 0; e < t.length; e++) {
        const s = t[e];
        if (dt(s)) {
          a = t.slice(e + 1);
          break;
        }
        if (((n.innerHTML += s + " "), n.offsetWidth > i)) {
          (n.innerHTML = n.innerHTML.slice(0, -s.length - 1)), (a = t.slice(e));
          break;
        }
      }
      a.length && s(a);
    };
    s(t);
  }
}
class ht {
  constructor(e) {
    let { element: t, content: i, scroller: s } = e;
    Object.assign(this, { element: t, content: i, scroller: s }),
      (this.shift = t.dataset.underScrollShift || "100"),
      (this.media = t.dataset.underScrollMedia || "all"),
      (this.enabled = !1),
      (this.cache = {}),
      this.resize();
  }
  enable() {
    this.enabled || (this.enabled = !0);
  }
  disable() {
    this.enabled && (this.enabled = !1);
  }
  reset() {
    this.content.style.transform = "";
  }
  update() {
    if (!this.enabled) return;
    const e =
        (this.scroller.y - this.getStartY()) /
        (this.getEndY() - this.getStartY()),
      t = Math.min(Math.max(e, 0), 1),
      i = this.getShift() - this.element.offsetHeight;
    (this.translate = ((e, t, i) => (1 - i) * e + i * t)(i, 0, t)), this.draw();
  }
  draw() {
    this.content.style.transform = "translate3d(0, ".concat(
      this.translate,
      "px,0 )"
    );
  }
  resize() {
    (this.cache = {}),
      this.testMedia() ? this.enable() : (this.disable(), this.reset()),
      this.update();
  }
  testMedia() {
    return window.matchMedia("".concat(this.media)).matches;
  }
  getShift() {
    if ("number" != typeof this.cache.shift) {
      const e =
        -1 !== this.shift.indexOf("%") ? this.element.offsetHeight / 100 : 1;
      this.cache.shift = parseFloat(this.shift) * e;
    }
    return this.cache.shift;
  }
  getStartY() {
    return (
      "number" != typeof this.cache.startPoint &&
        (this.cache.startPoint =
          this.getOffset(this.element) - window.innerHeight),
      this.cache.startPoint
    );
  }
  getEndY() {
    return (
      "number" != typeof this.cache.endPoint &&
        (this.cache.endPoint = this.getStartY() + this.element.offsetHeight),
      this.cache.endPoint
    );
  }
  getOffset(e) {
    return e.getBoundingClientRect().top + this.scroller.y;
  }
}
class ut extends i {
  constructor() {
    super(),
      (this._lastY = 0),
      (this._distance = 0),
      (this.y = window.scrollY),
      (this.direction = 1);
  }
  setY(e) {
    (this._lastY = this.y),
      (this.y = e),
      (this._distance = this.y - this._lastY),
      (this.direction = Math.sign(this._distance)),
      0 !== this._distance && this._emitScroll();
  }
  _emitScroll() {
    this.emit("scroll", { y: this.y, direction: this.direction });
  }
}
function pt(e, t, i) {
  return Math.max(e, Math.min(t, i));
}
class vt {
  advance(e) {
    var t;
    if (!this.isRunning) return;
    let i = !1;
    if (this.lerp)
      (this.value = (1 - (s = this.lerp)) * this.value + s * this.to),
        Math.round(this.value) === this.to &&
          ((this.value = this.to), (i = !0));
    else {
      this.currentTime += e;
      const t = pt(0, this.currentTime / this.duration, 1);
      i = t >= 1;
      const s = i ? 1 : this.easing(t);
      this.value = this.from + (this.to - this.from) * s;
    }
    var s;
    null == (t = this.onUpdate) || t.call(this, this.value, { completed: i }),
      i && this.stop();
  }
  stop() {
    this.isRunning = !1;
  }
  fromTo(e, t, i) {
    let {
      lerp: s = 0.1,
      duration: n = 1,
      easing: r = (e) => e,
      onUpdate: a,
    } = i;
    (this.from = this.value = e),
      (this.to = t),
      (this.lerp = s),
      (this.duration = n),
      (this.easing = r),
      (this.currentTime = 0),
      (this.isRunning = !0),
      (this.onUpdate = a);
  }
}
function ft(e, t) {
  let i;
  return function () {
    let s = arguments,
      n = this;
    clearTimeout(i),
      (i = setTimeout(function () {
        e.apply(n, s);
      }, t));
  };
}
class mt {
  constructor(e, t) {
    (this.onWindowResize = () => {
      (this.width = window.innerWidth), (this.height = window.innerHeight);
    }),
      (this.onWrapperResize = () => {
        (this.width = this.wrapper.clientWidth),
          (this.height = this.wrapper.clientHeight);
      }),
      (this.onContentResize = () => {
        const e =
          this.wrapper === window ? document.documentElement : this.wrapper;
        (this.scrollHeight = e.scrollHeight),
          (this.scrollWidth = e.scrollWidth);
      }),
      (this.wrapper = e),
      (this.content = t),
      this.wrapper === window
        ? (window.addEventListener("resize", this.onWindowResize, !1),
          this.onWindowResize())
        : ((this.wrapperResizeObserver = new ResizeObserver(
            ft(this.onWrapperResize, 100)
          )),
          this.wrapperResizeObserver.observe(this.wrapper),
          this.onWrapperResize()),
      (this.contentResizeObserver = new ResizeObserver(
        ft(this.onContentResize, 100)
      )),
      this.contentResizeObserver.observe(this.content),
      this.onContentResize();
  }
  destroy() {
    var e, t;
    window.removeEventListener("resize", this.onWindowResize, !1),
      null == (e = this.wrapperResizeObserver) || e.disconnect(),
      null == (t = this.contentResizeObserver) || t.disconnect();
  }
  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height,
    };
  }
}
let gt = () => ({
  events: {},
  emit(e) {
    let t = this.events[e] || [];
    for (
      var i = arguments.length, s = new Array(i > 1 ? i - 1 : 0), n = 1;
      n < i;
      n++
    )
      s[n - 1] = arguments[n];
    for (let e = 0, i = t.length; e < i; e++) t[e](...s);
  },
  on(e, t) {
    var i;
    return (
      (null == (i = this.events[e]) ? void 0 : i.push(t)) ||
        (this.events[e] = [t]),
      () => {
        var i;
        this.events[e] =
          null == (i = this.events[e]) ? void 0 : i.filter((e) => t !== e);
      }
    );
  },
});
class wt {
  constructor(e, t) {
    let {
      wheelMultiplier: i = 1,
      touchMultiplier: s = 2,
      normalizeWheel: n = !1,
    } = t;
    (this.onTouchStart = (e) => {
      const { clientX: t, clientY: i } = e.targetTouches
        ? e.targetTouches[0]
        : e;
      (this.touchStart.x = t), (this.touchStart.y = i);
    }),
      (this.onTouchMove = (e) => {
        const { clientX: t, clientY: i } = e.targetTouches
          ? e.targetTouches[0]
          : e;
        let s = t - this.touchStart.x;
        const n = Math.abs(s),
          r = Math.max(0 * n, 1);
        let a = i - this.touchStart.y;
        const o = Math.abs(a),
          l = Math.max(0 * o, 1);
        (s *= -r * this.touchMultiplier),
          (a *= -l * this.touchMultiplier),
          (this.touchStart.x = t),
          (this.touchStart.y = i),
          this.emitter.emit("scroll", {
            type: "touch",
            deltaX: s,
            deltaY: a,
            event: e,
          });
      }),
      (this.onWheel = (e) => {
        let { deltaX: t, deltaY: i } = e;
        this.normalizeWheel && ((t = pt(-100, t, 100)), (i = pt(-100, i, 100))),
          (t *= this.wheelMultiplier),
          (i *= this.wheelMultiplier),
          this.emitter.emit("scroll", {
            type: "wheel",
            deltaX: t,
            deltaY: i,
            event: e,
          });
      }),
      (this.element = e),
      (this.wheelMultiplier = i),
      (this.touchMultiplier = s),
      (this.normalizeWheel = n),
      (this.touchStart = { x: null, y: null }),
      (this.emitter = gt()),
      this.element.addEventListener("wheel", this.onWheel, { passive: !1 }),
      this.element.addEventListener("touchstart", this.onTouchStart, {
        passive: !1,
      }),
      this.element.addEventListener("touchmove", this.onTouchMove, {
        passive: !1,
      });
  }
  on(e, t) {
    return this.emitter.on(e, t);
  }
  destroy() {
    (this.emitter.events = {}),
      this.element.removeEventListener("wheel", this.onWheel, { passive: !1 }),
      this.element.removeEventListener("touchstart", this.onTouchStart, {
        passive: !1,
      }),
      this.element.removeEventListener("touchmove", this.onTouchMove, {
        passive: !1,
      });
  }
}
class St {
  constructor() {
    let {
      direction: e,
      gestureDirection: t,
      mouseMultiplier: i,
      smooth: s,
      wrapper: n = window,
      content: r = document.documentElement,
      wheelEventsTarget: a = n,
      smoothWheel: o = null == s || s,
      smoothTouch: l = !1,
      duration: d,
      easing: c = (e) => Math.min(1, 1.001 - Math.pow(2, -10 * e)),
      lerp: h = d ? null : 0.1,
      infinite: u = !1,
      orientation: p = null != e ? e : "vertical",
      gestureOrientation: v = null != t ? t : "vertical",
      touchMultiplier: f = 1,
      wheelMultiplier: m = null != i ? i : 1,
      normalizeWheel: g = !1,
    } = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    (this.onVirtualScroll = (e) => {
      let { type: t, deltaX: i, deltaY: s, event: n } = e;
      if (n.ctrlKey) return;
      if (
        ("vertical" === this.options.gestureOrientation && 0 === s) ||
        ("horizontal" === this.options.gestureOrientation && 0 === i) ||
        ("touch" === t &&
          "vertical" === this.options.gestureOrientation &&
          0 === this.scroll &&
          !this.options.infinite &&
          s <= 0)
      )
        return;
      if (
        n
          .composedPath()
          .find((e) =>
            null == e || null == e.hasAttribute
              ? void 0
              : e.hasAttribute("data-lenis-prevent")
          )
      )
        return;
      if (this.isStopped || this.isLocked) return void n.preventDefault();
      if (
        ((this.isSmooth =
          (this.options.smoothTouch && "touch" === t) ||
          (this.options.smoothWheel && "wheel" === t)),
        !this.isSmooth)
      )
        return (this.isScrolling = !1), void this.animate.stop();
      n.preventDefault();
      let r = s;
      "both" === this.options.gestureOrientation
        ? (r = Math.abs(s) > Math.abs(i) ? s : i)
        : "horizontal" === this.options.gestureOrientation && (r = i),
        this.scrollTo(this.targetScroll + r, { programmatic: !1 });
    }),
      (this.onScroll = () => {
        if (!this.isScrolling) {
          const e = this.animatedScroll;
          (this.animatedScroll = this.targetScroll = this.actualScroll),
            (this.velocity = 0),
            (this.direction = Math.sign(this.animatedScroll - e)),
            this.emit();
        }
      }),
      e &&
        console.warn(
          "Lenis: `direction` option is deprecated, use `orientation` instead"
        ),
      t &&
        console.warn(
          "Lenis: `gestureDirection` option is deprecated, use `gestureOrientation` instead"
        ),
      i &&
        console.warn(
          "Lenis: `mouseMultiplier` option is deprecated, use `wheelMultiplier` instead"
        ),
      s &&
        console.warn(
          "Lenis: `smooth` option is deprecated, use `smoothWheel` instead"
        ),
      (window.lenisVersion = "1.0.6"),
      (n !== document.documentElement && n !== document.body) || (n = window),
      (this.options = {
        wrapper: n,
        content: r,
        wheelEventsTarget: a,
        smoothWheel: o,
        smoothTouch: l,
        duration: d,
        easing: c,
        lerp: h,
        infinite: u,
        gestureOrientation: v,
        orientation: p,
        touchMultiplier: f,
        wheelMultiplier: m,
        normalizeWheel: g,
      }),
      (this.dimensions = new mt(n, r)),
      this.rootElement.classList.add("lenis"),
      (this.velocity = 0),
      (this.isStopped = !1),
      (this.isSmooth = o || l),
      (this.isScrolling = !1),
      (this.targetScroll = this.animatedScroll = this.actualScroll),
      (this.animate = new vt()),
      (this.emitter = gt()),
      this.options.wrapper.addEventListener("scroll", this.onScroll, {
        passive: !1,
      }),
      (this.virtualScroll = new wt(a, {
        touchMultiplier: f,
        wheelMultiplier: m,
        normalizeWheel: g,
      })),
      this.virtualScroll.on("scroll", this.onVirtualScroll);
  }
  destroy() {
    (this.emitter.events = {}),
      this.options.wrapper.removeEventListener("scroll", this.onScroll, {
        passive: !1,
      }),
      this.virtualScroll.destroy();
  }
  on(e, t) {
    return this.emitter.on(e, t);
  }
  off(e, t) {
    var i;
    this.emitter.events[e] =
      null == (i = this.emitter.events[e]) ? void 0 : i.filter((e) => t !== e);
  }
  setScroll(e) {
    this.isHorizontal
      ? (this.rootElement.scrollLeft = e)
      : (this.rootElement.scrollTop = e);
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  reset() {
    (this.isLocked = !1),
      (this.isScrolling = !1),
      (this.velocity = 0),
      this.animate.stop();
  }
  start() {
    (this.isStopped = !1), this.reset();
  }
  stop() {
    (this.isStopped = !0), this.animate.stop(), this.reset();
  }
  raf(e) {
    const t = e - (this.time || e);
    (this.time = e), this.animate.advance(0.001 * t);
  }
  scrollTo(e) {
    let {
      offset: t = 0,
      immediate: i = !1,
      lock: s = !1,
      duration: n = this.options.duration,
      easing: r = this.options.easing,
      lerp: a = !n && this.options.lerp,
      onComplete: o = null,
      force: l = !1,
      programmatic: d = !0,
    } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    if (!this.isStopped || l) {
      if (["top", "left", "start"].includes(e)) e = 0;
      else if (["bottom", "right", "end"].includes(e)) e = this.limit;
      else {
        var c;
        let i;
        if (
          ("string" == typeof e
            ? (i = document.querySelector(e))
            : null != (c = e) && c.nodeType && (i = e),
          i)
        ) {
          if (this.options.wrapper !== window) {
            const e = this.options.wrapper.getBoundingClientRect();
            t -= this.isHorizontal ? e.left : e.top;
          }
          const s = i.getBoundingClientRect();
          e = (this.isHorizontal ? s.left : s.top) + this.animatedScroll;
        }
      }
      if ("number" == typeof e) {
        if (
          ((e += t),
          (e = Math.round(e)),
          this.options.infinite
            ? d && (this.targetScroll = this.animatedScroll = this.scroll)
            : (e = pt(0, e, this.limit)),
          i)
        )
          return (
            (this.animatedScroll = this.targetScroll = e),
            this.setScroll(this.scroll),
            this.reset(),
            this.emit(),
            void (null == o || o())
          );
        if (!d) {
          if (e === this.targetScroll) return;
          this.targetScroll = e;
        }
        this.animate.fromTo(this.animatedScroll, e, {
          duration: n,
          easing: r,
          lerp: a,
          onUpdate: (e, t) => {
            let { completed: i } = t;
            s && (this.isLocked = !0),
              (this.isScrolling = !0),
              (this.velocity = e - this.animatedScroll),
              (this.direction = Math.sign(this.velocity)),
              (this.animatedScroll = e),
              this.setScroll(this.scroll),
              d && (this.targetScroll = e),
              i &&
                (s && (this.isLocked = !1),
                requestAnimationFrame(() => {
                  this.isScrolling = !1;
                }),
                (this.velocity = 0),
                null == o || o()),
              this.emit();
          },
        });
      }
    }
  }
  get rootElement() {
    return this.options.wrapper === window
      ? this.options.content
      : this.options.wrapper;
  }
  get limit() {
    return this.isHorizontal
      ? this.dimensions.limit.x
      : this.dimensions.limit.y;
  }
  get isHorizontal() {
    return "horizontal" === this.options.orientation;
  }
  get actualScroll() {
    return this.isHorizontal
      ? this.rootElement.scrollLeft
      : this.rootElement.scrollTop;
  }
  get scroll() {
    return this.options.infinite
      ? (function (e, t) {
          let i = e % t;
          return ((t > 0 && i < 0) || (t < 0 && i > 0)) && (i += t), i;
        })(this.animatedScroll, this.limit)
      : this.animatedScroll;
  }
  get progress() {
    return 0 === this.limit ? 1 : this.scroll / this.limit;
  }
  get isSmooth() {
    return this.__isSmooth;
  }
  set isSmooth(e) {
    this.__isSmooth !== e &&
      (this.rootElement.classList.toggle("lenis-smooth", e),
      (this.__isSmooth = e));
  }
  get isScrolling() {
    return this.__isScrolling;
  }
  set isScrolling(e) {
    this.__isScrolling !== e &&
      (this.rootElement.classList.toggle("lenis-scrolling", e),
      (this.__isScrolling = e));
  }
  get isStopped() {
    return this.__isStopped;
  }
  set isStopped(e) {
    this.__isStopped !== e &&
      (this.rootElement.classList.toggle("lenis-stopped", e),
      (this.__isStopped = e));
  }
}
const yt = new IntersectionObserver((e, t) => {
  e.forEach((e) => {
    e.isIntersecting &&
      (e.target.classList.add("in-view"), t.unobserve(e.target));
  });
});
function bt() {
  const i = "en" === document.documentElement.lang,
    s = new ut();
  ((e) => {
    let { scroller: t, isScrollSmooth: i } = e;
    const s = new St({
      duration: 1.2,
      easing: (e) => Math.min(1, 1.001 - Math.pow(2, -10 * e)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: i,
      wheelMultiplier: 1,
      smoothTouch: !1,
      touchMultiplier: 2,
      infinite: !1,
      wheelEventsTarget: window,
    });
    document.querySelectorAll("[data-lenis-anchor]").forEach((e) => {
      e.addEventListener("click", (t) => {
        t.preventDefault();
        const i = document.querySelector(e.getAttribute("href"));
        i && s.scrollTo(i);
      });
    }),
      s.on("scroll", (e) => {
        t.setY(e.scroll);
      }),
      requestAnimationFrame(function e(t) {
        s.raf(t), requestAnimationFrame(e);
      });
  })({ scroller: s, isScrollSmooth: i }),
    (q.x = new z({ viscosity: 30, initialValue: I })),
    (q.y = new z({ viscosity: 30, initialValue: R })),
    (q.x2 = new z({ viscosity: 200, initialValue: D })),
    (q.y2 = new z({ viscosity: 200, initialValue: N })),
    addEventListener("mousemove", j),
    addEventListener("touchmove", j),
    document.body.addEventListener("mouseleave", G),
    document.body.addEventListener("touchend", G),
    B(),
    (function () {
      let e = null,
        t = function () {
          e !== innerWidth &&
            (document.documentElement.style.setProperty(
              "--vh",
              "".concat(0.01 * innerHeight, "px")
            ),
            (e = innerWidth));
        };
      t(), addEventListener("resize", t);
    })(),
    J.initAll(),
    new e("[data-parallax]"),
    (function () {
      let t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 760,
        i = document.querySelector("[data-main-p-container]");
      if (!i) return;
      let s = [...document.querySelectorAll("[data-main-p]")].map(
          (t) => new e(t)
        ),
        n = () => {
          innerWidth >= t
            ? s.forEach((e) => e.start())
            : s.forEach((e) => {
                e.stop(), e.reset();
              });
        };
      s.forEach((e) => e.stop()),
        addEventListener("resize", n),
        n(),
        i.classList.add("_ready");
    })(760),
    t("[data-flow]"),
    (function () {
      let e = new n(document.querySelector("[data-menu]"), {
          maskSelector: "[data-dropdown-mask]",
        }),
        t = document.querySelector("[data-menu-switch]");
      function i() {
        let i = e.isOpen ? "add" : "remove";
        document.documentElement.classList[i]("__menu-open"),
          t.classList[i]("_active");
      }
      e &&
        t &&
        (t.addEventListener("click", () => {
          (e.isOpen = !e.isOpen), i();
        }),
        addEventListener("resize", function () {
          e.isOpen && innerWidth > 1130 && ((e.isOpen = !1), i());
        }));
    })(),
    r(),
    (function () {
      let e = sessionStorage.prevLocation;
      sessionStorage.prevLocation !== location.href &&
        (sessionStorage.prevLocation = location.href);
      let t = document.querySelector("[data-back]");
      t && e && (t.href = e);
    })(),
    (function (e) {
      let t = document.querySelector(e.form),
        i = null == t ? void 0 : t.querySelectorAll("[data-filter-tag]"),
        s = document.querySelectorAll("[data-filter-tags]"),
        n = document.querySelector("[data-articles-count]");
      if (!(t && i.length && s.length && n)) return;
      let r = [...i].map((e) => ({ el: e, value: e.dataset.filterTag })),
        o = [...s].map((e) => ({
          el: e,
          tags: ["all", ...JSON.parse(e.dataset.filterTags)],
          _hidden: e.classList.contains("_hide"),
          get hidden() {
            return this._hidden;
          },
          set hidden(e) {
            e !== this._hidden &&
              ((this._hidden = e),
              e
                ? this.el.classList.add("_hide")
                : this.el.classList.remove("_hide"));
          },
        })),
        l = () => o.filter((e) => !e.hidden).length;
      (n.innerText = l()),
        t.addEventListener("change", () => {
          let e = r.find((e) => e.el.checked).value,
            t = a({ tag: e }, location.href);
          history.pushState({ path: t }, "", t),
            o.forEach((t) => (t.hidden = !t.tags.includes(e))),
            (n.innerText = l());
        });
    })({ form: "[data-filter-form]" }),
    (function () {
      const e = () =>
        [...document.querySelectorAll("[data-article-card]")].map((e) => {
          const t = [...e.querySelectorAll("[data-article-hover-elem]")],
            i = () => e.classList.add("_hover"),
            s = () => e.classList.remove("_hover");
          return (
            t.forEach((e) => e.addEventListener("mouseover", i)),
            t.forEach((e) => e.addEventListener("mouseleave", s)),
            () => {
              t.forEach((e) => e.removeEventListener("mouseover", i)),
                t.forEach((e) => e.removeEventListener("mouseleave", s));
            }
          );
        });
      let t = e();
      window.addEventListener("page-content-updated", () => {
        t.forEach((e) => e()), (t = e());
      });
    })(),
    window.innerWidth > 760 &&
      (function () {
        let e = document.querySelectorAll("[data-year]"),
          t = document.querySelector("[data-century-num]"),
          i = document.querySelector("[data-century]");
        if (!e) return;
        if (!t) return;
        if (!i) return;
        let s = new IntersectionObserver(
          (e) => {
            for (let i of e)
              i.isIntersecting &&
                (i.target.textContent >= 2e3
                  ? t.classList.add("__ready")
                  : t.classList.remove("__ready"));
          },
          { rootMargin: "-48% 0px -48% 0px" }
        );
        for (let t = 0; t < e.length; t++) s.observe(e[t]);
        function n() {
          let t = e[e.length - 1].offsetHeight;
          i.style.height = "".concat(t, "px");
        }
        n(), addEventListener("resize", n);
      })(),
    ((e) => {
      let t = [...document.querySelectorAll("[data-splitter]")];
      window.innerWidth <= e
        ? t.forEach((e) => {
            e.classList.add("is-inview");
          })
        : t.map((e) => new ct(e));
    })(760),
    c(),
    (function () {
      let e = document.querySelector("[data-search-field-input]"),
        t = document.querySelector("[data-search-results]");
      if (!e || !t) return;
      let i = location.origin + e.dataset.fetchPath;
      e.addEventListener(
        "input",
        o(async () => {
          let s = e.value;
          if (s.length < 3) return;
          let n = { query: s },
            r = a(n, location.href);
          history.pushState({ path: r }, "", r);
          let o = a(n, i),
            l = await fetch(o, { method: "POST" });
          (t.innerHTML = await l.text()),
            window.dispatchEvent(new CustomEvent("page-content-updated"));
        }, 300)
      );
    })(),
    (() => {
      let e = document.querySelector("[data-gradient]");
      e && Q(e);
    })(),
    document.querySelectorAll("[data-share]").forEach((e) => {
      e.addEventListener("click", () => {
        window.open(e.href, "socialshare", "width=600,height=400");
      });
    }),
    ee(),
    (function () {
      let e = document.querySelectorAll("[data-stroked]");
      if (!e) return;
      let t = new IntersectionObserver(
        (e) => {
          e.forEach((e) => {
            e.isIntersecting && e.target.classList.add("is-inview");
          });
        },
        { rootMargin: "0px 0px -30% 0px" }
      );
      for (let i = 0; i < e.length; i++) t.observe(e[i]);
    })(),
    (function (e) {
      const t = Array.from(
        document.querySelectorAll("[data-under-scroll]")
      ).map((t) => {
        const i = t.querySelector("[data-under-scroll-content]");
        return new ht({ element: t, content: i, scroller: e });
      });
      e.on("scroll", () => {
        t.forEach((e) => e.update());
      }),
        window.addEventListener("resize", () => {
          t.forEach((e) => e.resize());
        });
    })(s),
    document.querySelectorAll("[data-enter-scale]").forEach((e) => {
      yt.observe(e);
    }),
    window.addEventListener("resize", () => ee());
}
"loading" !== document.readyState
  ? bt()
  : document.addEventListener("DOMContentLoaded", bt),
  addEventListener("load", function () {
    !(function () {
      let e = document.documentElement,
        t = scrollY,
        i = new CustomEvent("scrollToTop");
      function s() {
        let s = scrollY;
        s < 50
          ? (e.classList.add("__header-top"), dispatchEvent(i))
          : (e.classList.remove("__header-top"),
            t < s
              ? e.classList.add("__header-hide")
              : e.classList.remove("__header-hide")),
          (t = s);
      }
      document.addEventListener("scroll", s, { passive: !0 }), s();
    })(),
      (function () {
        let e = document.querySelectorAll("[data-rail]");
        Array.prototype.map.call(e, (e) => new ot(e));
      })(),
      (function (e) {
        let t = document.querySelector(e);
        if (!t) return;
        let i = t.querySelector("[data-slider-container]"),
          s = t.querySelector("[data-slider-next]"),
          n = t.querySelector("[data-slider-prev]");
        st.use([at]),
          new st(i, {
            slidesPerView: "auto",
            freeMode: !0,
            navigation: { nextEl: s, prevEl: n, disabledClass: "_disabled" },
          });
      })("[data-slider]"),
      document.documentElement.classList.add("__loaded");
  });
