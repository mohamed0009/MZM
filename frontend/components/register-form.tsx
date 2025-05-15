{/* Logo and Brand */}
<div className="flex flex-col items-center space-y-2 mb-4">
  <div className="relative w-14 h-14">
    <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-60"></div>
    <div className="relative flex items-center justify-center w-full h-full bg-blue-600 rounded-full">
      <Heart 
        className="text-white" 
        fill="white" 
        size={28} 
      />
      <svg 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        width={18} 
        height={10} 
        viewBox="0 0 16 8" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M0 4H3L4 1L6 7L8 4L9 5L11 2L13 4H16" 
          stroke="blue" 
          strokeWidth="1.5"
          className="heartbeat-line"
        />
      </svg>
    </div>
  </div>
  <h1 className="text-2xl font-bold tracking-tight text-center bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
    PharmaFlow
  </h1>
  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
    Créez votre compte pour commencer
  </p>
</div> 