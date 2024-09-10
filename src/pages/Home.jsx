import React, { useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa"
import { FaRocketchat } from 'react-icons/fa'
import { MdGroups } from "react-icons/md"
import { TbLogout2 } from "react-icons/tb"
import IndividualChat from '../components/chats/IndividualChat'
import { useNavigate } from 'react-router-dom'
import ChatsDisplay from '../components/chats/ChatsDisplay'
import UserSearchs from '../components/chats/UserSearchs'
import SelfProfile from '../components/chats/SelfProfile'
import UserProfile from '../components/UserProfile'
import { io } from 'socket.io-client'


const Home = (props) => {
    const histMsgUrl = 'http://localhost:3333/api/msghistory';
    const socket = io('http://localhost:3333');
    
    const navigate = useNavigate();
    const [chat, setChat] = useState(false);
    const [users, setUsers] = useState(false);
    const [selfProfile, setSelfProfile] = useState(false);
    const [userInfo, setUserInfo] = useState(false);
    const [term, setTerm] = useState('');
    const [profile, setProfile] = useState(() => {
        const storedProfiles = localStorage.getItem('profiles');
        return storedProfiles ? JSON.parse(storedProfiles) : {};
      });
    const [userList, setUserList] = useState([]);
    const [histMsg, setHistMsg] = useState([]);
    const [friends, setFriends] = useState(() => {
        const storedFriends = localStorage.getItem('friends');
        return storedFriends ? JSON.parse(storedFriends) : [];
    });
    const [displayChatName, setDisplayChatName] = useState();
    const [empty, setEmpty] = useState(false);

    class HomeInterface {
        handleLogout() {
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            props.setIsToken(false);
            navigate('/');
        };

        chatsScreen() {
            setUsers(false);
            setChat(false);
            setUserList([]);
            setTerm('');
            setSelfProfile(false);
        };

        usersScreen() {
            setUsers(true);
            setChat(false);
            setTerm('');
            setSelfProfile(false);
        };

        displayChat() {
            setChat(true);
            setUserInfo(false);
            console.log(profile)
        };


        saveProfileInfo(data) {
            const existingProfiles = JSON.parse(localStorage.getItem('profiles')) || {};

            const updatedProfiles = {
                ...existingProfiles,
                [data.profileInfo.username]: {
                    name: data.profileInfo.name,
                    bio: data.profileInfo.bio,
                    picture: data.profileInfo.picture,
                }
            };
            localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

            setProfile(updatedProfiles);
        };


        async displayUserInfo(user) {
            if (user === localStorage.getItem('id')) {
                this.displaySelfProfile();
                return;
            };

            const getProfileUrl = `http://localhost:3333/api/getProfile?param=${(user)}`
            const response = await fetch(getProfileUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();

                if (user === localStorage.getItem('id')) {
                    this.displaySelfProfile();
                    this.saveProfileInfo(data);
                } else {
                    setUserInfo(true);
                    this.saveProfileInfo(data);
                }
    
                return data;
            } else {
                console.log('Error fetching data')
            }
        };

        displaySelfProfile() {
            setSelfProfile(true);
            setChat(false);
            setUserInfo(false);
            setUsers(false);
        };

        closeChat() {
            setChat(false);
            setUserInfo(false);
            setSelfProfile(false);
        };
    };
    

    function addFriend(name) {
        if (!name || name === profile.mainUser || friends.includes(name)) {
            return;
        };

        setFriends(prev => {
            const friendsArray = [...prev, name]
            localStorage.setItem('friends', JSON.stringify(friendsArray));
            return friendsArray;
        });
    };


    async function getMessages(info) {
        if(!info) {
            setEmpty(true);
            console.log('no messages here');

            return;
        };

        try {   
            const response = await fetch(histMsgUrl, {
                method: 'GET',  
                headers: {
                  'Authorization': info
                }
              });
      
              const data = await response.json();
              setHistMsg(data.hist);
              setEmpty(false);

        } catch(err) {
            console.log('Error fetching messages: ', err);
        }
    };


    useEffect(() => {
        socket.emit('join', localStorage.getItem('id'));

        const token = localStorage.getItem('token');
        if (token) {
            props.setIsToken(true);
        }
        else {
            navigate('/');
        }
    }, [props.isToken]);


    const home = new HomeInterface();
    const conditionalStyle1 = {color: 'white'};
    const conditionalStyle2 = {color: '#ce31fd', backgroundColor: 'white'};


  return (
    <>
        <main className='homePage'>
            <sidebar>
                <div className='sidebarOpt'
                    onClick={() => home.displayUserInfo(localStorage.getItem('id'))}
                    style={selfProfile === true ? conditionalStyle2 : conditionalStyle1}>
                    {
                        profile[profile.mainUser] && profile[profile.mainUser].picture ? 
                        <img src={profile[profile.mainUser].picture} style={{width: 40, height: 40, borderRadius: '50%'}} /> :
                        <FaUserCircle size={30} />
                    }
                </div>

                <div className='sidebarOpt'
                    onClick={home.chatsScreen}

                    // se users for verdade OU (||) selfProfile for verdade, condição de estilo 1 é ativada, SE NÃO (:) condição de estilo 2 é ativada

                    style={users === true || selfProfile === true ? conditionalStyle1 : conditionalStyle2}>
                    <FaRocketchat size={30} />
                </div>

                <div className='sidebarOpt'
                    onClick={home.usersScreen}
                    style={users === false ? conditionalStyle1 : conditionalStyle2}>
                    <MdGroups size={30} />
                </div>

                <div className="sidebarOpt"
                    onClick={home.handleLogout}>
                    <TbLogout2 size={30} />
                </div>
            </sidebar>

            {
                users === false ?
                (<ChatsDisplay home={home} 
                    userList={userList} getMessages={getMessages} 
                    friends={friends} setDisplayChatName={setDisplayChatName} 
                    profile={profile} histMsg={histMsg}
                />) :
                (<UserSearchs term={term} setTerm={setTerm} home={home} userList={userList}
                    setUserList={setUserList} setDisplayChatName={setDisplayChatName} 
                    getMessages={getMessages} setEmpty={setEmpty} addFriend={addFriend}
                    profile={profile} 
                />)
            }

            {
                userInfo ? (
                    <UserProfile 
                    profile={profile}
                    home={home}
                    displayChatName={displayChatName} />
                ) : chat === true ? (
                    <IndividualChat 
                        home={home} 
                        displayChatName={displayChatName} 
                        userList={userList} 
                        histMsg={histMsg} 
                        setHistMsg={setHistMsg} 
                        getMessages={getMessages} 
                        empty={empty} 
                        setEmpty={setEmpty} 
                        setFriends={setFriends} 
                        addFriend={addFriend} 
                        profile={profile}
                    />
                ) : selfProfile === true ? (
                    <SelfProfile profile={profile}
                    setProfile={setProfile}
                    home={home}
                    displayChatName={displayChatName} />
                ) :
                (
                    <div className='empty'>
                        <img src="./src/assets/empty.png" alt="no chat here" />
                    </div>
                )
            }
    
        </main>
    </>
  )
};

export default Home;
