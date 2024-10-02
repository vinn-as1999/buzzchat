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
    const [userList, setUserList] = useState([]);
    const [histMsg, setHistMsg] = useState([]);
    const [displayChatName, setDisplayChatName] = useState();
    const [empty, setEmpty] = useState(false);
    const perfil = JSON.parse(localStorage.getItem('profiles'));
    const mainUser = localStorage.getItem('username');

    class HomeInterface {
        handleLogout() {
            localStorage.clear();
            props.setIsToken(false);
            socket.disconnect();
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
            console.log(perfil)
        };


        saveProfileInfo(data) {
            const existingProfiles = JSON.parse(localStorage.getItem('profiles')) || {};

            const updatedProfiles = {
                [mainUser]: existingProfiles[mainUser],
                [data.username]: {
                    name: data.name,
                    bio: data.bio,
                    picture: data.picture,
                }
            };
            localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

            props.setProfile(updatedProfiles);
        };


        async displayUserInfo(user) {
            const data = await props.getProfileInfo(user);
            if (user === localStorage.getItem('username')) {
                this.displaySelfProfile();
            } else {
                setUserInfo(true);
                console.log('data', data)
                this.saveProfileInfo(data);
            }

            return data;

        };

        displaySelfProfile() {
            setSelfProfile(true);
            setChat(false);
            setUserInfo(false);
            setUsers(false);
        };

        closeChat() {
            const main_user = perfil[mainUser];
            localStorage.setItem('profiles', JSON.stringify({
                [mainUser]: main_user
            }))
            setChat(false);
            setUserInfo(false);
            setSelfProfile(false);
        };
    };
    

    async function addFriend(name) {
        const url = 'http://localhost:3333/api/addFriend';
        if (!name || name === mainUser || props.friends.includes(name)) {
            return;
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: mainUser,
                userId: localStorage.getItem('id'),
                friend: name
            })
        });

        if (response.ok) {
            const data = await response.json();

            console.log(data);

            props.setFriends(prev => {
                const friendsArray = [...prev, name]
                localStorage.setItem('friends', JSON.stringify(friendsArray));
                return friendsArray;
            });
        }
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
        const token = localStorage.getItem('token');
        if (token) {
            props.setIsToken(true);
        }
        else {
            navigate('/');
        }
    }, []);


    const home = new HomeInterface();
    const conditionalStyle1 = {color: 'white'};
    const conditionalStyle2 = {color: '#ce31fd', backgroundColor: 'white'};


  return (
    <>
        <main className='homePage'>
            <sidebar>
                <div className='sidebarOpt'
                    onClick={() => home.displayUserInfo(mainUser)}
                    style={selfProfile === true ? conditionalStyle2 : conditionalStyle1}>
                    {
                        props.profile[mainUser] && props.profile[mainUser].picture ? 
                        <img src={props.profile[mainUser].picture} style={{width: 40, height: 40, borderRadius: '50%'}} /> :
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
                    setDisplayChatName={setDisplayChatName} 
                    profile={props.profile} histMsg={histMsg} 
                    getProfileInfo={props.getProfileInfo}
                    friends={props.friends}
                    setFriends={props.setFriends}
                />) :
                (<UserSearchs term={term} setTerm={setTerm} home={home} userList={userList}
                    setUserList={setUserList} setDisplayChatName={setDisplayChatName} 
                    getMessages={getMessages} setEmpty={setEmpty} addFriend={addFriend}
                    profile={props.profile} 
                />)
            }

            {
                userInfo ? (
                    <UserProfile 
                    profile={props.profile}
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
                        friends={props.friends}
                        setFriends={props.setFriends}
                        addFriend={addFriend} 
                        profile={props.profile}
                    />
                ) : selfProfile === true ? (
                    <SelfProfile profile={props.profile}
                    setProfile={props.setProfile}
                    getProfileInfo={props.getProfileInfo}
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
