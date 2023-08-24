import {NavLink} from "react-router-dom";
import GitHubIcon from '@mui/icons-material/GitHub';
const getActiveClass = (isActive) => isActive ? "nav-link active":"nav-link";
function Header(){
    console.log("I Am Header Component");
    return(
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
            <div className="container">
                <NavLink to="/" className="navbar-brand d-flex align-items-center"> <GitHubIcon /> &nbsp; Github Users Api</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/" className={({isActive}) => getActiveClass(isActive)}>Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/users" className={({isActive}) => getActiveClass(isActive)}>Users</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/bookmarks" className={({isActive}) => getActiveClass(isActive)}>Bookmarks</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Header;