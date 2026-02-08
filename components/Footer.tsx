import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="w-full py-6 mt-20 border-t border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-[#0d1117] text-center">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Brand and Copyright */}
                    <div className="mb-4 md:mb-0">
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            © {new Date().getFullYear()} UniSync. All rights reserved.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="mb-4 md:mb-0">
                        <ul className="flex space-x-6 text-sm text-zinc-600 dark:text-zinc-400">
                            <li>
                                <a href="/about" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="/privacy" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex space-x-4">
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
                        >
                            <FaTwitter size={20} />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-600 transition"
                        >
                            <FaLinkedin size={20} />
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-600 dark:text-zinc-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                        >
                            <FaGithub size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
