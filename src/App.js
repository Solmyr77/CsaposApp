import Header from "./Header";
import Navbar from "./Navbar";
import TitleDivider from "./TitleDivider";
import StyledSwiper from "./StyledSwiper";
import Card from "./Card";

function App() {
  return (
    <div className="bg-grey text-white w-screen min-h-screen font-play font-bold pt-16 px-4">
      <Header/>
      <Navbar/>
      <TitleDivider title={"Kiemelt"}/>
      <StyledSwiper/>
      <TitleDivider title={"Összes"}/>
      <div className="flex gap-4 justify-between flex-wrap">
        <Card status={"open"} title={"Félidő söröző"}/>
        <Card status={"open"} title={"City Pub"}/>
        <Card status={"open"} title={"Félidő söröző"}/>
        <Card status={"open"} title={"Félidő söröző"}/>
        <Card status={"closed"} title={"Félidő söröző"}/>
        <Card status={"closed"} title={"Félidő söröző"}/>
      </div>

    </div>
  );
}

export default App;
