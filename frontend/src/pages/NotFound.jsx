import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 text-white">
      {/* Background glow */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-[120px]" />

      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#B8860B]/10 blur-[120px]" />

      <div className="relative z-10 text-center">
        <div className="mb-3 text-8xl font-black tracking-tighter text-[#D4AF37] drop-shadow-[0_0_30px_rgba(212,175,55,0.2)] sm:text-[140px]">
          404
        </div>

        <div className="mx-auto mb-6 h-px w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <h2 className="text-3xl font-bold sm:text-4xl">Page Not Found</h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#777]">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] bg-[length:200%_100%] px-7 py-3 font-bold text-black transition-all duration-300 hover:bg-[position:100%_0] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(212,175,55,0.3)]"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
