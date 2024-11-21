import Header from "./Header";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";

function App() {
  return (
    <div className="bg-grey text-white w-screen h-screen font-play font-bold pt-16 px-4">
      <Header></Header>
      <Navbar></Navbar>
      <TitleDivider></TitleDivider>
      <StyledSwiper/>
    </div>
  );
}

export default App;
