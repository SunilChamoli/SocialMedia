import React, { useEffect, useState } from 'react';
import './FollowersCard.css';

const FollowersCard = () => {
    const [users, setUsers] = useState([]);
    const [followersList, setFollowersList] = useState([]);

    const fetchUsers = async () => {
        const response = await fetch("http://localhost:8080/api/users/fetchUsers");
        const converted = await response.json();
        console.log("All users", converted);
        setUsers(converted);
    };

    useEffect(() => {
        fetchUsers();
        const storedFollowers = localStorage.getItem("followersList");
        if (storedFollowers) {
            setFollowersList(storedFollowers.split(","));
        }
    }, []);

    const handleFollowUnfollow = async (follower) => {
        const formData = {
            userId: localStorage.getItem("userId"),
            followerId: follower._id
        };

        const url = followersList.includes(follower._id) 
            ? 'http://localhost:8080/api/profile/unfollow' 
            : 'http://localhost:8080/api/profile/follow';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        const userData = await response.json();
        setFollowersList(userData.followersList);
        localStorage.setItem("followersList", userData.followersList.join(","));
        console.log("Follow/Unfollow response", userData);

        // Update profile followings count in local storage
        const profileData = JSON.parse(localStorage.getItem("profileData"));
        profileData.followings = userData.followersList.length;
        localStorage.setItem("profileData", JSON.stringify(profileData));
    };

    return (
        <div className="FollowersCard">
            <h3>People you may follow</h3>

            {users.length > 0 ? users.filter(item => !localStorage.getItem("name").startsWith(item.firstName)).map((follower, id) => (
                <div className="follower" key={id}>
                    <div>
                        <img src={follower.img} alt="" className='followerImage' />
                        <div className="name">
                            <span>{follower.firstName}</span>
                            <span>@{follower.username}</span>
                        </div>
                    </div>
                    <button className='button fc-button' onClick={() => handleFollowUnfollow(follower)}>
                        {followersList.includes(follower._id) ? 'Unfollow' : 'Follow'}
                    </button>
                </div>
            )) : null}
        </div>
    );
};

export default FollowersCard;
