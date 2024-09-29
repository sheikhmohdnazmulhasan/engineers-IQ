const Footer: React.FC = () => {

    return (
        <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                {/* Logo or Company Name */}
                <div className="text-lg font-semibold">My Company</div>

                {/* Navigation Links */}
                <div className="flex space-x-6">
                    <a className="hover:text-rose-600 transition" href="#">
                        Home
                    </a>
                    <a className="hover:text-rose-600 transition" href="#">
                        About
                    </a>
                    <a className="hover:text-rose-600 transition" href="#">
                        Services
                    </a>
                    <a className="hover:text-rose-600 transition" href="#">
                        Contact
                    </a>
                </div>

                {/* Dark Mode Toggle */}
            </div>

            {/* Footer Bottom */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} My Company. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
