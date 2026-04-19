import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full text-center p-6 mt-auto flex flex-col items-center gap-2 bg-gray-900 border-t">
            <p className="text-white font-semibold flex items-center justify-center text-shadow-white gap-1.5 text-sm">
                Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500 hover:scale-125 transition-transform" /> by <span>Abhishek</span>
            </p>
            
            <div className="flex items-center gap-4 mt-1">
                <a href="https://github.com/Abhishek651/Talent-forge" target="_blank" rel="noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                    <img src="/icons8-github-64.png" alt="GitHub" className="w-[22px] h-[22px] invert opacity-90" />
                </a>
                <a href="https://www.linkedin.com/in/abhishek700/" target="_blank" rel="noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                    <img src="/icons8-linkedin-48.png" alt="LinkedIn" className="w-6 h-6" />
                </a>
            </div>
            <p className="text-white/70 text-xs mt-2">© {new Date().getFullYear()} TalentForge</p>
        </footer>
    );
}
