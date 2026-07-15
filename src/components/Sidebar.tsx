import { AiOutlineHome, AiOutlineInfoCircle, AiOutlineMail, AiOutlineTeam, AiOutlineShopping, AiOutlineShoppingCart, AiOutlineLogout } from "react-icons/ai";

const navItems = [
  { name: "Home", icon: <AiOutlineHome /> },
  { name: "About", icon: <AiOutlineInfoCircle /> },
  { name: "Contact us", icon: <AiOutlineMail /> },
  { name: "Clients", icon: <AiOutlineTeam /> },
  { name: "Products", icon: <AiOutlineShopping /> },
  { name: "Orders", icon: <AiOutlineShoppingCart /> },
];


function Sidebar({activePage, setActivePage, userName, onLogout}:{activePage: string, setActivePage: (page: string) => void, userName?: string, onLogout?: () => void}) {
    return (
        <div style={{width:"200px" ,height:"100vh" ,backgroundColor: "#1e293b", padding: "20px", flexShrink: 0, display:"flex", flexDirection:"column", boxSizing:"border-box"}}>
            <h2>Nexus</h2>
            <ul style={{listStyle:"none", marginTop:"30px", display:"flex", flexDirection:"column", gap:"20px", flex:1, minHeight:0, overflowY:"auto"}}>
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

            {(userName || onLogout) && (
                <div style={{ flexShrink: 0, borderTop: "1px solid #334155", paddingTop: "16px", marginTop: "12px" }}>
                    {userName && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 10px", marginBottom: "10px" }}>
                            <div style={{ width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                                backgroundColor: "#6EE7F7", color: "#0f172a",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 700, fontSize: "15px", textTransform: "uppercase" }}>
                                {userName.trim().charAt(0) || "U"}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ color: "#94a3b8", fontSize: "11px", lineHeight: 1.2 }}>Signed in as</div>
                                <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "14px",
                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
                            </div>
                        </div>
                    )}
                    {onLogout && (
                        <button
                            type="button"
                            onClick={onLogout}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(248,113,113,0.12)"; e.currentTarget.style.color = "#FCA5A5"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#F87171"; }}
                            style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", boxSizing: "border-box",
                                padding: "10px 12px", borderRadius: "8px", cursor: "pointer",
                                backgroundColor: "transparent", border: "none",
                                color: "#F87171", fontSize: "14px", fontWeight: 500, textAlign: "left",
                                transition: "background-color 0.2s ease, color 0.2s ease" }}>
                            <AiOutlineLogout style={{ fontSize: "18px", flexShrink: 0 }} /> Logout
                        </button>
                    )}
                </div>
            )}
        </div>

    )
}export default Sidebar;
