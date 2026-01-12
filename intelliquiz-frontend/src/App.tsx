export default function App() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f8c107] rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#880015] rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#f8c107] rounded-full blur-[80px] opacity-5 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Center Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-9xl md:text-[150px] font-black leading-tight">
          <span className="bg-gradient-to-r from-[#f8c107] via-[#880015] to-[#f8c107] bg-clip-text text-transparent">
            intelliquiz
          </span>
        </h1>
      </div>
    </div>
  )
}