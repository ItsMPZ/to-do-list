import { useAppContext } from "../context/appContext"
import NavLinks from "./NavLinks"
import Logo from './Logo'
import Wrapper from "../assets/wrappers/BigSidebar"

const BigSideBar = () => {
    const { showSidebar } = useAppContext()
  return (
    <Wrapper>
        <div
            className= {showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'}
        >
            <div className="content">
                <header>
                    <Logo />
                </header>
                <NavLinks />
            </div>    
        </div>    
    </Wrapper>
  )
}

export default BigSideBar