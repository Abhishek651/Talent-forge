// LoadingOverlay.jsx
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function LoadingOverlay({ visible, text }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <DotLottieReact
        src="/SandyLoading.lottie"
        loop
        autoplay
        style={{ width: "200px", height: "200px" }}
      />
      <p className="mt-4 text-xl font-medium tracking-wide text-white text-center px-6 py-2 animate-pulse">
        {text}
      </p>
    </div>
  );
}