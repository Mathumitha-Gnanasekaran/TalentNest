
import './noti.css'

const NotificationList = ({ notification }) => {
    return (
        <div className="userrow">
            <div className="row">
                <img src={notification.img} alt="" className="frienddp" />
                <p className="name">{notification.name}</p>
                <p className="info">{notification.info}</p>
            </div>
            <div className='infoimg1'>
                <img src={notification.likeimg} alt="" className="infoimg" />
            </div>
        </div>
    )
}

export default NotificationList;