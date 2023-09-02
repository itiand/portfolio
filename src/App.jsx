import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern h-full bg-cover bg-center bg-no-repeat">
          <Navbar />
          <Hero />
        </div>
        {/*About*/}
        {/*Experience*/}
        {/*works*/}
      </div>
      <div className="relative z-0" id="footer">
        {/*Contact */}
      </div>
    </BrowserRouter>
  );
};

export default App;
