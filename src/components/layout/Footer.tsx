import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Logo className="flex items-center space-x-3" textColor="text-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              Building modern, scalable solutions with cutting-edge technologies for businesses of all sizes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/experience" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Experience
              </Link>
              <Link to="/projects" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Projects
              </Link>
              <Link to="/blogs" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Blogs
              </Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:sachintakoria2204@gmail.com"
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by Sachin Takoria
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
