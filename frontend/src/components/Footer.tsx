
import Logo from "@/assets/logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
    ],
    company: [
      { name: "About Us", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer id="contact" className="bg-slate-50 pt-16">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-16">
          <div className="col-span-1 md:col-span-6">
            <div className="flex items-center space-x-2 mb-6">
              <Logo />
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-500">
                Doctor Screen
              </span>
            </div>
            <p className="text-slate-600 mb-6">
              Simplifying healthcare communication for patients and doctors
              everywhere. Secure, efficient, and user-friendly.
            </p>
            <div className="flex space-x-4">
              {["#", "#"].map((href, i) => (
                <a
                  key={i}
                  href={href}
                  className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-brand-500 hover:bg-brand-50 transition-colors shadow-sm"
                  aria-label={`Social link ${i + 1}`}
                >
                  <div className="h-5 w-5 rounded-full bg-slate-200" />
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-slate-900 mb-6">Product</h3>
            <ul className="space-y-4">
              {links.product.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-brand-500 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-slate-900 mb-6">Company</h3>
            <ul className="space-y-4">
              {links.company.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-brand-500 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-slate-900 mb-6">Legal</h3>
            <ul className="space-y-4">
              {links.legal.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-brand-500 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-sm mb-4 md:mb-0">
            © {currentYear} Doctor Screen. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-slate-600 hover:text-brand-500 transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-brand-500 transition-colors text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
