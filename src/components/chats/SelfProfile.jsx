import React, { useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { ImPencil } from 'react-icons/im';
import { IoCameraSharp } from 'react-icons/io5';
import { GrSend } from 'react-icons/gr';

const SelfProfile = (props) => {

  const profiles = props.profile;
  const mainUser = profiles.mainUser;

  const fileInputRef = useRef(null);
  const dialogRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [picPath, setPicPath] = useState(profiles[mainUser].picture);
  const [name, setName] = useState('');
  const [nameEdit, setNameEdit] = useState(profiles[mainUser].name);
  const [bioEdit, setBioEdit] = useState(profiles[mainUser].bio);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfiles = () => {
    const updatedProfiles = JSON.parse(localStorage.getItem('profiles'));
    props.setProfile(updatedProfiles);
  };

  const sendProfileInfo = async (data) => {
    const url = `http://localhost:3333/api/setProfile`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const info = await response.json();
    console.log(info);
    setIsEditing(false);
    setNameEdit(info.name);
    setBioEdit(info.bio);

    fetchProfiles()
  };

  const editProfile = () => {
    const body = {
      id: localStorage.getItem('id'),
      username: mainUser,
      name: nameEdit,
      bio: bioEdit,
    };

    sendProfileInfo(body);
  };

  const editPicture = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', name);

    try {
      const picUrl = `http://localhost:3333/api/uploadPicture`;
      const response = await fetch(picUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Image uploaded successfully');
      console.log('Server response: ', data.image);

      const imageUrl = `http://localhost:3333/uploads/${data.image.src}`;

      const body = {
        id: localStorage.getItem('id'),
        username: mainUser,
        picture: imageUrl,
      };

      await sendProfileInfo(body);
      setPicPath(imageUrl);
    } catch (error) {
      console.log('Try catch error', error);
    }
  };


  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setName(file.name);
      editPicture(); // Chama a função para enviar a imagem
    }
  };

  useEffect(() => {
    fetchProfiles();

  }, [])

  return (
    <main className='userInfo'>
      <header>
        <section className='closeUI'>
          <div style={{ cursor: 'pointer' }} onClick={props.home.closeChat}>
            <MdClose size={50} color='brown' />
          </div>
        </section>
        <section className='profilePicture'>
          <div>
            {profiles[mainUser].picture ? (
              <img className='profilePhoto' src={picPath} alt='profile picture' style={{ width: 100, height: 100 }} onClick={() => dialogRef.current.showModal()} />
            ) : (
              <FaUserCircle size={'15vw'} color='rgb(209, 209, 209)' />
            )}
          </div>
          <div className='camera'>
            <div onClick={handleClick}>
              <IoCameraSharp size={'4vw'} />
            </div>
            <input
              type='file'
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </section>
        <section style={{ color: 'grey' }}>Online</section>
      </header>

      <dialog ref={dialogRef}>
        <div className='imgDialog'>
          <div className='closeBttn'
            onClick={() => dialogRef.current.close()}>
            <MdClose size={50} />
          </div>
          <img src={picPath} />
        </div>
      </dialog>

      <section style={{ cursor: 'default' }}>
        {mainUser}
      </section>

      <section className='name'>
        <div style={{ marginLeft: 25 }}>
          {isEditing ? (
            <input
              className='nameEdit'
              type='text'
              placeholder='William Harrys'
              value={nameEdit}
              onChange={(e) => setNameEdit(e.target.value)}
            />
          ) : (
            <section style={{fontSize: 30, padding: 5}}>
              {nameEdit}
            </section>
          )}
        </div>
        <div className='edit' onClick={() => setIsEditing(true)}>
          {isEditing ? (
            <div onClick={() => { setIsEditing(false); editProfile(); }}>
              <GrSend size={35} />
            </div>
          ) : (
            <ImPencil size={20} />
          )}
        </div>
      </section>

      <label htmlFor='' className='about'>About</label>
      <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50vw' }}>
        <div className={profiles[mainUser].bio && !isEditing ? 'displayBio' : 'noBio'}>
          {isEditing ? (
            <textarea
              placeholder='Your bio here :)'
              value={bioEdit}
              onChange={(e) => setBioEdit(e.target.value)}
            />
          ) : (
            <div style={{whiteSpace: 'pre-line'}}>
              {bioEdit}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default SelfProfile;
