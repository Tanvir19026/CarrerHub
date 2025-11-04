import { motion } from "framer-motion";
import img from "../../assets/Images/ban-img-rtl.png";

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-blue-600 to-blue-800 text-white pt-[90px] pb-20 z-0"
      aria-labelledby="hero-heading"
    >
      {/* Dual-color wave background */}
      <svg
        className="absolute bottom-0 left-0 w-full h-32"
        viewBox="0 0 1440 320"
        aria-hidden="true"
      >
        <path
          fill="#1E40AF"
          fillOpacity="1"
          d="M0,256L48,234.7C96,213,192,171,288,154.7C384,139,480,149,576,176C672,203,768,245,864,250.7C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L0,320Z"
        ></path>
        <path
          fill="#172554"
          fillOpacity="1"
          d="M0,288L80,272C160,256,320,224,480,218.7C640,213,800,235,960,224C1120,213,1280,171,1360,149.3L1440,128L1440,320L0,320Z"
        ></path>
      </svg>

      <div className="container mx-auto w-11/12 flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
        {/* Image */}
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <img
            src={img}
            alt="Hero"
            className="w-[95%] md:w-[90%] drop-shadow-2xl"
          />
        </motion.div>

        {/* Text + Marquee */}
        <motion.div
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 mt-6 md:mt-0 text-center md:text-left px-6"
        >
          <h1 id="hero-heading" className="text-3xl md:text-4xl font-bold leading-snug">
            Your Passion <br />
            <span className="text-yellow-300 font-extrabold">Begins Here!</span>
          </h1>

          <p className="mt-4 text-base md:text-lg font-medium text-gray-200">
            Discover your potential and make your dreams come true with us.
          </p>

          {/* Marquee container */}
          <div className="mt-6 overflow-hidden">
            {/* adjust --marquee-duration to change speed (s) */}
            <div
              className="marquee whitespace-nowrap text-yellow-400 text-lg md:text-2xl font-bold"
              style={{ ["--marquee-duration"]: "18s" }}
              aria-hidden="false"
            >
              <span className="marquee-track inline-block">
                {/* Repeat sequence twice so scroll is seamless */}
                <span className="mr-12">Laravel Developer</span>
                <span className="mr-12">React Developer</span>
                <span className="mr-12">Software Developer</span>
                <span className="mr-12">DevOps Engineer</span>
                <span className="mr-12">Flutter Developer</span>
                <span className="mr-12">Node.js Developer</span>
                <span className="mr-12">Frontend Engineer</span>
                <span className="mr-12">Backend Developer</span>
                <span className="mr-12">Fullstack Developer</span>

                {/* duplicate for seamless loop */}
                <span className="mr-12">Laravel Developer</span>
                <span className="mr-12">React Developer</span>
                <span className="mr-12">Software Developer</span>
                <span className="mr-12">DevOps Engineer</span>
                <span className="mr-12">Flutter Developer</span>
                <span className="mr-12">Node.js Developer</span>
                <span className="mr-12">Frontend Engineer</span>
                <span className="mr-12">Backend Developer</span>
                <span className="mr-12">Fullstack Developer</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Inline styles for marquee animation (Tailwind + custom CSS) */}
      <style jsx>{`
        .marquee {
          --marquee-duration: 18s; /* default duration: lower = faster */
          position: relative;
        }
        .marquee-track {
          display: inline-block;
          will-change: transform;
          animation: marquee-animation linear infinite;
          animation-duration: var(--marquee-duration);
        }
        @keyframes marquee-animation {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Improve accessibility: reduce motion if user prefers reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
