import { FiLoader } from "react-icons/fi";

function LoadingScreen({ title }) {
  return (
    <div
      className="
        fixed left-0 top-0 z-[9999]
        flex h-screen w-full
        items-center justify-center
        bg-[#050505]
      "
    >
      <div className="text-center">
        <FiLoader
          className="
            mb-[25px]
            animate-spin
            text-[70px]
            text-[#d4af37]
          "
        />

        <h2
          className="
            mb-[10px]
            text-[34px]
            text-white
          "
        >
          Loading {title}...
        </h2>

        <p className="text-[18px] text-[#999]">Please wait a moment.</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
