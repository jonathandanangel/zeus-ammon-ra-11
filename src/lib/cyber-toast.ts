import { CyberToast, type CyberToastOptions, type CyberToastType, CYBER_TOAST_CREDIT } from "@/vendor/cyber-toast/CyberToast";

export { CYBER_TOAST_CREDIT };
export type { CyberToastType };

let singleton: CyberToast | null = null;

export function getCyberToast(options?: CyberToastOptions): CyberToast {
  if (typeof document === "undefined") {
    // SSR stub — no-ops on server
    return {
      options: {
        position: "top-right",
        duration: 4000,
        typingSpeed: 30,
      },
      container: null,
      initContainer() {},
      show() {},
      typewriterEffect() {},
      dismiss() {},
      clear() {},
    } as unknown as CyberToast;
  }
  if (!singleton) {
    singleton = new CyberToast({
      position: "top-right",
      duration: 4200,
      typingSpeed: 28,
      ...options,
    });
  }
  return singleton;
}

export function cyberToast(message: string, type: CyberToastType = "info") {
  getCyberToast().show(message, type);
}

export function cyberToastSuccess(message: string) {
  cyberToast(message, "success");
}

export function cyberToastError(message: string) {
  cyberToast(message, "error");
}

export function cyberToastInfo(message: string) {
  cyberToast(message, "info");
}
