import React, { useState, useEffect } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfileId } from "../feature/checkProfile/checkProfileSlice";
import { followAccount } from "../feature/followingAccounts/followingAccountSlice";
import { Check, UserPlus } from "lucide-react";

function FollowerAccountItem(props) {
  const dispatch = useDispatch();
  const selectedProfileId = useSelector(
    (state) => state.checkProfileReducer.profileId
  );
  const storeFollowingAccounts = useSelector(
    (state) => state.followingAccountReducer.followingAccounts
  );

  const [followButtonTitle, setFollowButtonTitle] = useState("Follow");
  const [tickIconStatus, setTickIconStatus] = useState(false);

  function handleFollowButtonClick(e) {
    dispatch(
      followAccount({
        followedId: props.id,
        followerId: localStorage.getItem("psnUserId"),
      })
    );
    setFollowButtonTitle("Followed");
    setTickIconStatus(true);
  }

  function handleClick(e) {
    dispatch(getProfileId(props.id));
  }

  useEffect(() => {
    if (storeFollowingAccounts !== null) {
      for (let i = 0; i < storeFollowingAccounts.length; i++) {
        if (storeFollowingAccounts[i].id === props.id) {
          setTickIconStatus(true);
          setFollowButtonTitle("Followed");
        }
      }
    }
  }, []);

  return (
    <tr style={{
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '0.5rem',
      transition: 'all 0.3s ease',
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
    >
      <td style={{ 
        padding: '1rem', 
        borderTopLeftRadius: '0.5rem',
        borderBottomLeftRadius: '0.5rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          padding: '0.25rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Hashicon value={props.id} size={50} />
        </div>
      </td>
      <td style={{ padding: '1rem' }}>
        <Link
          to="/newsfeed/profile"
          onClick={handleClick}
          style={{ 
            fontSize: '1.25rem',
            color: 'white',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#fbbf24'}
          onMouseOut={(e) => e.currentTarget.style.color = 'white'}
        >
          {props.firstName + " " + props.lastName}
        </Link>
      </td>
      <td style={{ 
        padding: '1rem',
        textAlign: 'right',
        borderTopRightRadius: '0.5rem',
        borderBottomRightRadius: '0.5rem'
      }}>
        <button
          onClick={handleFollowButtonClick}
          disabled={tickIconStatus}
          style={{
            background: tickIconStatus 
              ? 'linear-gradient(to right, #1e40af, #3b82f6)' 
              : 'linear-gradient(to right, #92400e, #d97706)',
            color: 'white',
            fontWeight: 'bold',
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: 'none',
            cursor: tickIconStatus ? 'default' : 'pointer',
            transition: 'transform 0.3s ease',
            opacity: tickIconStatus ? 0.9 : 1,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          onMouseOver={(e) => {
            if (!tickIconStatus) e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseOut={(e) => {
            if (!tickIconStatus) e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {followButtonTitle}
          {tickIconStatus ? <Check size={16} /> : <UserPlus size={16} />}
        </button>
      </td>
    </tr>
  );
}

export default FollowerAccountItem;