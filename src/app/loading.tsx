import { GraduationCap, Sparkles } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4 animate-content-fade">
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        {/* Outer Ring - Spins clockwise slowly */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent animate-spin-slow opacity-80" />
        
        {/* Inner Ring - Spins counter-clockwise faster */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-accent border-l-primary animate-spin-reverse-fast opacity-65" />
        
        {/* Glow backdrop behind the icon */}
        <div className="absolute inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-md animate-pulse-glow" />
        
        {/* Central White Card Container with Icon */}
        <div className="relative flex items-center justify-center w-12 h-12 text-primary-ink bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-border animate-pulse-glow">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        
        {/* Small floating sparkles for premium feel */}
        <div className="absolute -top-1 -right-1 text-accent animate-soft-float">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
      </div>
      
      {/* Brand Title and Text with loading effect */}
      <h3 className="text-xl font-semibold text-ink tracking-wider animate-pulse font-ui" data-font="ui">
        GIntern
      </h3>
      <p className="text-sm text-muted mt-2 tracking-wide text-center max-w-[280px] animate-pulse">
        กำลังโหลดข้อมูลฝึกงานจากรุ่นพี่...
      </p>
    </div>
  );
}
