import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Hero from "../HeroSection/Hero";


const MainLayOut = () => {
    return (
        <div >
            <nav className="sticky top-0 z-10">
                <Navbar></Navbar>
            </nav>
                <Hero>
                </Hero>
               <main>
                 <Outlet />
               </main>
            <footer >
                <Footer></Footer>
            </footer>
           

        </div>
    );
};

export default MainLayOut;