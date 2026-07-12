import Home from "./Home.tsx";
import About from "./About.tsx";
import ContactUs from "./ContactUs.tsx";
import Clients from "./Clients.tsx";
import Products from "./Products.tsx";
import Orders from "./Orders.tsx";

function MainContent({ activePage, isMobile }: { activePage: string; isMobile: boolean }) {
  return (
    <div style={{ flex: 1, minWidth: 0, padding: isMobile ? "16px" : "30px" }}>
      {activePage === "Home" && <Home isMobile={isMobile} />}
      {activePage === "About" && <About />}
      {activePage === "Contact us" && <ContactUs />}
      {activePage === "Clients" && <Clients />}
      {activePage === "Products" && <Products />}
      {activePage === "Orders" && <Orders />}
    </div>
  );
}

export default MainContent;
