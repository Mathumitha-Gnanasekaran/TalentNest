import { Link } from "react-router-dom";
import Foot from "./Foot";

const Card = ({ post }) => {
    return (
        <div className="card">
            <Link className="link" to={`/post/${post.id}`}>
                <div className="nav-owner">
                    <img src={post.imgdp} alt="" className="imgdp" />
                    <p className="title">{post.title}</p>
                </div>
                <img src={post.img} alt="" className="img" />
                <p className="head">{post.desc}</p>
                <p className="desc">{post.longDesc}</p>
                <Foot/>
            </Link>
        </div>
    )
}

export default Card;