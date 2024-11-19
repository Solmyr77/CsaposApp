import Header from "./Header";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";

function App() {
  return (
    <div className="bg-grey text-white w-screen h-screen font-play font-bold pt-16 px-4">
      <Header></Header>
      <Navbar></Navbar>
      <TitleDivider></TitleDivider>
    </div>
  );
}

export default App;
