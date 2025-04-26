import {SlLike} from "react-icons/sl"
import {AiOutlineComment} from "react-icons/ai"
import { TbShare3 } from "react-icons/tb";

import './icons.css'
const Foot = () => {

    return (
        <div className="foot">
            <SlLike className="like"/>
            <AiOutlineComment className="comment"/>
            <TbShare3 className="comment"/>
        </div>
    );
};

export default Foot