import Header from "./Header";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";

function App() {
  return (
    <div className="bg-grey text-white w-screen h-screen font-play font-bold pt-16 px-4">
      <Header/>
      <Navbar/>
      <TitleDivider title={"Kiemelt"}/>
      <StyledSwiper/>
      <TitleDivider title={"Összes"}/>
    </div>
  );
}

export default App;
