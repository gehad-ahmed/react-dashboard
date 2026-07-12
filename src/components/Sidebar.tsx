import { AiOutlineHome, AiOutlineInfoCircle, AiOutlineMail, AiOutlineTeam, AiOutlineShopping, AiOutlineShoppingCart } from "react-icons/ai";

const navItems = [
  { name: "Home", icon: <AiOutlineHome /> },
  { name: "About", icon: <AiOutlineInfoCircle /> },
  { name: "Contact us", icon: <AiOutlineMail /> },
  { name: "Clients", icon: <AiOutlineTeam /> },
  { name: "Products", icon: <AiOutlineShopping /> },
  { name: "Orders", icon: <AiOutlineShoppingCart /> },
];


function Sidebar({activePage, setActivePage}:{activePage: string, setActivePage: (page: string) => void}) {
    return (
        <div style={{width:"200px" ,height:"100vh" ,backgroundColor: "#1e293b", padding: "20px", flexShrink: 0}}>
            <h2>Nexus</h2>
            <ul style={{listStyle:"none", marginTop:"30px", display:"flex", flexDirection:"column", gap:"20px"}}>
                {navItems.map((item)=>
                <li
                key={item.name}
                onClick={()=> setActivePage(item.name)}
                onMouseEnter={(e)=>{
                    if(activePage !== item.name){
                        e.currentTarget.style.backgroundColor ="#334155"
                    }
                }}
                onMouseLeave={(e)=>{
                    if(activePage !== item.name){
                        e.currentTarget.style.backgroundColor= "transparent"
                    }
                }}
               style={{ padding: "10px",margin:'10px', borderRadius: "8px", cursor: "pointer",
                     backgroundColor: activePage ===item.name ? "#334155" : "transparent",
                      color: activePage ===item.name ?  "#6EE7F7" : "white" , transition: "all 0.3s ease"}}>
                         <span style={{ fontSize: "18px", marginRight: "10px"}}>{item.icon}</span>
                        {item.name}</li>

            )
                }

            </ul>
        </div>

    )
}export default Sidebar;
