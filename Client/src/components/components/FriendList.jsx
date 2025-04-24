
import './icons.css'

const FriendList = ({ friend }) => {
    return (
        <div className="userrow">
            <div className="row">
                <img src={friend.img} alt="" className="frienddp" />
                <p className="name">{friend.name}</p>
            </div>
            <div className='followbutton'>
                <p className="text">Follow</p>
            </div>
        </div>
    )
}

export default FriendList;