import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-center bg-no-repeat">
          <Navbar />
          <Hero />
        </div>
      </div>
      {/*About*/}
      {/*Experience*/}
      {/*works*/}
      <div className="relative z-0" id="footer">
        {/*Contact */}
      </div>
    </BrowserRouter>
  );
};

export default App;
