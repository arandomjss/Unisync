export default function Footer() {
    return (
        <footer className="w-full py-6 mt-20 border-t border-white/5 bg-black/20 backdrop-blur-sm text-center">
            <p className="text-zinc-500 text-sm">
                © {new Date().getFullYear()} UniSync. All rights reserved.
            </p>
        </footer>
    );
}
