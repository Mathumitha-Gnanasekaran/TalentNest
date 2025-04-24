import { Link } from 'react-router-dom';
import { AiOutlineUserAdd } from "react-icons/ai"
import { AiOutlineSetting } from "react-icons/ai"
import { MdOutlineNotificationsActive } from "react-icons/md"
import { AiOutlineLogout } from "react-icons/ai"
import { AiFillHome } from "react-icons/ai"
import { BiAddToQueue } from "react-icons/bi"

import './icons.css'

const Navbar = ({ user }) => {

    const logout = () => {
        window.open("http://localhost:5000/auth/logout", "_self");
    };

    return (
        <div className="navbar">
            <span className="logo">
                <Link className='navtitle'>FOODIEES</Link>
            </span>{
                user ? (
                    <ul className="list">
                        <li className="listItem">
                            <img
                                src={user.photos[0].value}
                                alt=""
                                className="img1" />
                        </li>
                        <li className="listItem">{user.displayName}</li>
                        <li className="listItem" onClick={logout}>Signout</li>

                        <span>
                            <Link to='/login'>
                                <AiFillHome className="addfriend" />
                            </Link>
                            <Link to='/addpost'>
                                <BiAddToQueue className="friend" />
                            </Link>
                            <Link to='/addfriend'>
                                <AiOutlineUserAdd className="friend" />
                            </Link>
                            <Link to='/notification'>
                                <MdOutlineNotificationsActive className="friend" />
                            </Link>
                            <Link to='/setting'>
                                <AiOutlineSetting className="friend" />
                            </Link>
                            <Link to=''>
                                <AiOutlineLogout className="logout" />
                            </Link>
                        </span>
                    </ul>
                ) : (<Link className='linklog' to="login">Login</Link>)
            }


        </div>
    );
};

export default Navbar;