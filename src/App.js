import Header from "./Header";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import HighlightedCard from "./HighlightedCard";

function App() {
  return (
    <div className="bg-grey text-white w-screen h-screen font-play font-bold pt-16 px-4">
      <Header></Header>
      <Navbar></Navbar>
      <TitleDivider></TitleDivider>
      <HighlightedCard></HighlightedCard>
    </div>
  );
}

export default App;
