/**
 * CyberToast — Sci-Fi / Cyberpunk notifications.
 * Adapted from https://github.com/hsr88/cyber-toast-js (MIT)
 * Krystian Welcel / hsr88 — typewriter, glitch, CRT scanlines, neon pulse.
 *
 * Styles live in src/styles.css under the `.cyber-toast*` selectors so they
 * share ZEUS AMMON-RA 11 brand tokens (cyan / mint / magenta) instead of
 * injecting a separate stylesheet.
 */

export type CyberToastType = "success" | "error" | "info";
export type CyberToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export type CyberToastOptions = {
  position?: CyberToastPosition;
  duration?: number;
  typingSpeed?: number;
};

type ToastEl = HTMLDivElement & {
  _dismissTimer?: ReturnType<typeof setTimeout>;
  _remainingTime?: number;
  _activeStart?: number;
};

export class CyberToast {
  options: Required<CyberToastOptions>;
  container: HTMLElement | null = null;

  constructor(options: CyberToastOptions = {}) {
    this.options = {
      position: options.position ?? "top-right",
      duration: options.duration ?? 4000,
      typingSpeed: options.typingSpeed ?? 30,
    };
    if (typeof document !== "undefined") {
      this.initContainer();
    }
  }

  initContainer() {
    const containerId = `cyber-toast-container-${this.options.position}`;
    let el = document.getElementById(containerId);
    if (!el) {
      el = document.createElement("div");
      el.id = containerId;
      el.className = `cyber-toast-container ${this.options.position}`;
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    this.container = el;
  }

  show(message: string, type: CyberToastType = "info") {
    if (typeof document === "undefined") return;
    if (!this.container) this.initContainer();
    if (!this.container) return;

    const toast = document.createElement("div") as ToastEl;
    toast.className = `cyber-toast ${type}`;
    toast.dataset.dismissed = "false";
    toast.setAttribute("role", "status");

    const header = type === "error" ? "[CRITICAL ERROR]" : "[SYSTEM MESSAGE]";

    toast.innerHTML = `
      <div class="glitch-layer" data-text=""></div>
      <div class="cyber-toast-header">${header}</div>
      <div class="cyber-toast-body">
        <span class="text-content"></span><span class="cursor" aria-hidden="true"></span>
      </div>
      <div class="cyber-toast-progress"></div>
    `;

    this.container.appendChild(toast);

    const glitchLayer = toast.querySelector(".glitch-layer") as HTMLElement | null;
    const textContent = toast.querySelector(".text-content") as HTMLElement | null;
    const progressBar = toast.querySelector(".cyber-toast-progress") as HTMLElement | null;

    void toast.offsetWidth;
    toast.classList.add("visible");

    const typingDuration = message.length * this.options.typingSpeed;
    const totalDuration = this.options.duration + typingDuration;

    if (progressBar) {
      progressBar.style.animation = `cyber-toast-progress-shrink ${totalDuration}ms linear forwards`;
    }

    toast._dismissTimer = setTimeout(() => this.dismiss(toast), totalDuration);
    toast._remainingTime = totalDuration;
    toast._activeStart = performance.now();

    if (textContent) {
      this.typewriterEffect(textContent, message, glitchLayer, () => {
        toast.classList.add("typing-done");
      });
    }

    toast.onclick = () => this.dismiss(toast);

    toast.onmouseenter = () => {
      if (toast.dataset.dismissed === "true") return;
      clearTimeout(toast._dismissTimer);
      toast._remainingTime = (toast._remainingTime ?? 0) - (performance.now() - (toast._activeStart ?? performance.now()));
      toast.classList.add("paused");
    };

    toast.onmouseleave = () => {
      if (toast.dataset.dismissed === "true") return;
      toast.classList.remove("paused");
      toast._activeStart = performance.now();
      toast._dismissTimer = setTimeout(() => this.dismiss(toast), Math.max(0, toast._remainingTime ?? 0));
    };
  }

  typewriterEffect(
    element: HTMLElement,
    text: string,
    glitchLayer: HTMLElement | null,
    onComplete?: () => void,
  ) {
    let i = 0;
    const interval = setInterval(() => {
      element.textContent += text.charAt(i);
      if (glitchLayer) glitchLayer.setAttribute("data-text", element.textContent ?? "");

      if (Math.random() < 0.08) {
        const host = element.closest(".cyber-toast");
        host?.classList.add("micro-glitch");
        setTimeout(() => host?.classList.remove("micro-glitch"), 80);
      }

      i += 1;
      if (i > text.length - 1) {
        clearInterval(interval);
        onComplete?.();
      }
    }, this.options.typingSpeed);
  }

  dismiss(toastElement: ToastEl | null) {
    if (!toastElement || toastElement.dataset.dismissed === "true") return;
    toastElement.dataset.dismissed = "true";
    clearTimeout(toastElement._dismissTimer);
    toastElement.classList.remove("visible", "paused");
    toastElement.classList.add("exiting");
    setTimeout(() => {
      toastElement.parentElement?.removeChild(toastElement);
    }, 400);
  }

  /** Clear all active toasts. */
  clear() {
    if (!this.container) return;
    for (const child of Array.from(this.container.children)) {
      this.dismiss(child as ToastEl);
    }
  }
}

export const CYBER_TOAST_CREDIT =
  "CyberToast.js aesthetics · https://github.com/hsr88/cyber-toast-js (MIT)";
