export default function YayPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent">
      <main className="relative w-full max-w-xl rounded-[32px] bg-[#89806380]/80 px-8 py-10 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(255,192,203,0.6)_1px,transparent_1px)] bg-[length:18px_18px] opacity-40" />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          {/* <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#ffe5f1] shadow-md">
            <span className="text-5xl" aria-hidden="true">
              💖
            </span>
          </div> */}

          <h1 className="text-2xl font-semibold leading-snug text-neutral-900 sm:text-3xl">
          Thanks! It means a lot
          </h1>

          <p className="text-xl font-bold text-pink-600">YAY! 🎉</p>

          <div className="mt-2 overflow-hidden rounded-2xl border border-pink-200 shadow-lg">
            <video
              src="https://res.cloudinary.com/douco0ige/video/upload/v1770234120/thanks_git_1_rx6qve.mp4"
              className="h-56 w-72 object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </main>
    </div>
  );
}

