import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  textColor?: string;
}

const Logo = ({ className = '', textColor = 'text-white' }: LogoProps) => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <motion.div
        whileHover={{ rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/50"
          style={{
            width: '44px',
            height: '44px',
          }}
        />

        {/* Main logo background */}
        <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
          {/* Glow effect */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(0, 200, 255, 0.3)',
                '0 0 40px rgba(0, 200, 255, 0.5)',
                '0 0 20px rgba(0, 200, 255, 0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-lg"
          />

          {/* S letter */}
          <span className="relative text-white font-bold text-lg leading-none">
            S
          </span>
        </div>
      </motion.div>

      {/* Text */}
      <div className="flex flex-col">
        <motion.span
          whileHover={{ x: 3 }}
          className={`font-display font-bold text-lg ${textColor} transition-colors`}
        >
          Sachin
        </motion.span>
        <motion.span
          whileHover={{ x: 3 }}
          className="text-xs font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          Developer
        </motion.span>
      </div>
    </Link>
  );
};

export default Logo;
