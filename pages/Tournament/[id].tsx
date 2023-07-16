import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Tournament.module.css';
import Swal from 'sweetalert2'
import { GetServerSideProps } from 'next';


interface TeamData {
  team_name: string;
  // Add other properties from your data
}


function Tournament() {
  const router = useRouter();
  const { id } = router.query;
  const parsedId = parseInt(id as string);
  const [level, setLevel] = useState('');

  useEffect(() => {
    if (parsedId < 0 || parsedId > 3) {
      router.push('/booking');
      return;
    } else {
      if (parsedId === 0) {
        setLevel('N');
      } else if (parsedId === 1) {
        setLevel('S');
      } else if (parsedId === 2) {
        setLevel('P-/P');
      } else if (parsedId === 3) {
        setLevel('P+/C');
      }
    }

    fetchData();
  }, [parsedId]);

  const fetchData = async () => {
    const response = await fetch('/api/tournament/check');
    const jsonData = await response.json();
    setTeamname(jsonData.results);
  }
  const [title, setTitle] = useState('');
  const [Name_1, setName_1] = useState('');
  const [Nickname_1, setNickname_1] = useState('');
  const [age_1, setAge_1] = useState('');
  const [gender_1, setGender_1] = useState('');
  const [affiliation_1, setAffiliation_1] = useState('');
  const [tel_1, setTel_1] = useState('');
  const [image_1, setImage_1] = useState(null);

  const [Name_2, setName_2] = useState('');
  const [Nickname_2, setNickname_2] = useState('');
  const [age_2, setAge_2] = useState('');
  const [gender_2, setGender_2] = useState('');
  const [affiliation_2, setAffiliation_2] = useState('');
  const [tel_2, setTel_2] = useState('');
  const [image_2, setImage_2] = useState(null);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleImageChange_1 = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImage_1(file);
    }
  };

  const handleImageChange_2 = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImage_2(file);
    }
  };
  const Swal = require('sweetalert2')

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    fetchData();
    checkTeamname(title);
    if (team_name_1 != true) {
      Swal.fire({
        icon: 'error',
        text: 'ชื่อทีมนี้มีผู้ใช้แล้วกรุณาเปลี่ยนชื่อทีม',
      })
    }
    else if (
      title &&
      Name_1 &&
      Nickname_1 &&
      age_1 &&
      gender_1 &&
      affiliation_1 &&
      tel_1 &&
      image_1 &&
      Name_2 &&
      Nickname_2 &&
      age_2 &&
      gender_2 &&
      affiliation_2 &&
      tel_2 &&
      image_2 &&
      level
    ) {
      setIsLoading(true)

      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('Name_1', Name_1);
        formData.append('Nickname_1', Nickname_1);
        formData.append('age_1', age_1);
        formData.append('gender_1', gender_1);
        formData.append('affiliation_1', affiliation_1);
        formData.append('tel_1', tel_1);
        formData.append('image_1', image_1);
        formData.append('Name_2', Name_2);
        formData.append('Nickname_2', Nickname_2);
        formData.append('age_2', age_2);
        formData.append('gender_2', gender_2);
        formData.append('affiliation_2', affiliation_2);
        formData.append('tel_2', tel_2);
        formData.append('image_2', image_2);
        formData.append('level', level);


        const response = await fetch('/api/tournament/regis', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setTitle('');
          setName_1('');
          setNickname_1('');
          setAge_1('');
          setGender_1('');
          setAffiliation_1('');
          setTel_1('');
          setImage_1(null);
          setName_2('');
          setNickname_2('');
          setAge_2('');
          setGender_2('');
          setAffiliation_2('');
          setTel_2('');
          setImage_2(null);
          setError('');
          setIsLoading(false)

          Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลเรียบร้อยแล้ว',
            text: 'เรากำลังพาไปหน้ารายละเอียด',
            showConfirmButton: false,
            timer: 1500
          })
          setMessage('Post added successfully!');
        } else {
          throw new Error('Something went wrong');
        }
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      // setError('All fields are required!');
      Swal.fire({
        icon: 'error',
        text: 'กรุณากรอกข้อมูลให้ครบ',
      })
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [teamname, setTeamname] = useState<TeamData[]>([]);
  const [team_name_1, setIsTeam_name_1] = useState(false);
  const checkTeamname = async (teamName: string) => {
    const find = teamname.find((t) => t.team_name === teamName);

    if (find) {
      setMessage('ชื่อทีมนี้มีผู้ใช้แล้ว');
      setTitle(teamName);
      setIsTeam_name_1(false)

    } else {
      setTitle(teamName);
      setIsTeam_name_1(true)
      setMessage('');
    }
  };
  return (

    <>
      <div className={`${styles.content} ${isLoading ? styles.load : ''}`}>
        <h4 className={styles.h3}>สมัครแข่งขัน ระดับมือ {level}</h4>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles['form-group']}>
            <label htmlFor="title">ชื่อทีม</label>
            <input
              name="title"
              type="text"
              placeholder="ชื่อทีม"
              onChange={(e) => checkTeamname(e.target.value)}
              value={title}
            />
            {message ? (
              <div style={{ color: 'red' }}>{message}</div>
            ) : ''}
          </div>
          <div className={styles.wrapper}>
            <div className={styles['form-group']}>
              <label htmlFor="">ผู้เข้าแข่งขัน 1</label>
              <div className={styles['form-row']}>
                <label htmlFor="Name_1">ชื่อ-สกุล  </label>
                <input
                  name="Name_1"
                  type="text"
                  placeholder="ชื่อ-สกุล"
                  onChange={(e) => setName_1(e.target.value)}
                  value={Name_1}
                />
              </div>

              <div className={styles['form-row']}>
                <label htmlFor="Nickname_1">ชื่อเล่น </label>
                <input
                  name="Nickname_1"
                  type="text"
                  placeholder="ชื่อเล่น"
                  onChange={(e) => setNickname_1(e.target.value)}
                  value={Nickname_1}
                />
              </div>

              <div className={styles['form-row']}>
                <label htmlFor="age_1">อายุ </label>
                <input
                  name="age_1"
                  type="number"
                  placeholder="อายุ"
                  onChange={(e) => setAge_1(e.target.value)}
                  value={age_1}
                />
              </div>
              <div className={styles['form-row']}>
                <label htmlFor="gender_1">เพศ </label>
                <input
                  name="gender_1"
                  type="text"
                  placeholder="เพศ"
                  onChange={(e) => setGender_1(e.target.value)}
                  value={gender_1}
                />
              </div>
              <div className={styles['form-row']}>
                <label htmlFor="affiliation_1">สังกัด </label>
                <input
                  name="affiliation_1"
                  type="text"
                  placeholder="สังกัด"
                  onChange={(e) => setAffiliation_1(e.target.value)}
                  value={affiliation_1}
                />
              </div>
              <div className={styles['form-row']}>
                <label htmlFor="tel_1">เบอร์โทร </label>
                <input
                  name="tel_1"
                  type="tel"
                  pattern="[0-9]*"
                  placeholder="เบอร์ติดต่อ"
                  onChange={(e) => setTel_1(e.target.value)}
                  value={tel_1}
                />
              </div>

              <label htmlFor="file-input-1" className={styles.file_input}>
                อัพโหลดภาพนักกีฬา 1
              </label>
              <input
                style={{ display: 'none' }}
                name="image_1"
                type="file"
                accept="image/*"
                onChange={handleImageChange_1}
                id="file-input-1"
                className={styles.file_input}
              />

            </div>

            <img
              src={`${image_1 ? URL.createObjectURL(image_1) : '/user.png'}`}
              alt="Participant 1"
              className={styles.imagePreview}
            />

          </div>
          <div className={styles.wrapper}>
            <div className={styles['form-group']}>
              <label htmlFor="">ผู้เข้าแข่งขัน 2</label>
              <div className={styles['form-row']}>
                <label htmlFor="Name_2">ชื่อ-สกุล  </label>
                <input
                  name="Name_2"
                  type="text"
                  placeholder="ชื่อ-สกุล"
                  onChange={(e) => setName_2(e.target.value)}
                  value={Name_2}
                />
              </div>

              <div className={styles['form-row']}>
                <label htmlFor="Nickname_">ชื่อเล่น </label>
                <input
                  name="Nickname_"
                  type="text"
                  placeholder="ชื่อเล่น"
                  onChange={(e) => setNickname_2(e.target.value)}
                  value={Nickname_2}
                />
              </div>

              <div className={styles['form-row']}>
                <label htmlFor="age_2">อายุ </label>
                <input
                  name="age_2"
                  type="number"
                  placeholder="อายุ"
                  onChange={(e) => setAge_2(e.target.value)}
                  value={age_2}
                />
              </div>
              <div className={styles['form-row']}>
                <label htmlFor="gender_2">เพศ </label>
                <input
                  name="gender_2"
                  type="text"
                  placeholder="เพศ"
                  onChange={(e) => setGender_2(e.target.value)}
                  value={gender_2}
                />
              </div>
              <div className={styles['form-row']}>
                <label htmlFor="affiliation_2">สังกัด </label>
                <input
                  name="affiliation_2"
                  type="text"
                  placeholder="สังกัด"
                  onChange={(e) => setAffiliation_2(e.target.value)}
                  value={affiliation_2}
                />
              </div>
              <div className={styles['form-row']}>
                <label htmlFor="tel_2">เบอร์โทร </label>
                <input
                  name="tel_2"
                  type="tel"
                  pattern="[0-9]*"
                  placeholder="เบอร์ติดต่อ"
                  onChange={(e) => setTel_2(e.target.value)}
                  value={tel_2}
                />
              </div>

              <label htmlFor="file-input-2" className={styles.file_input}>
                อัพโหลดภาพนักกีฬา 2
              </label>
              <input
                style={{ display: 'none' }}
                name="image_2"
                type="file"
                accept="image/*"
                onChange={handleImageChange_2}
                id="file-input-2"
                className={styles.file_input}
              />

            </div>

            <img
              src={`${image_2 ? URL.createObjectURL(image_2) : '/user.png'}`}
              alt="Participant 2"
              className={styles.imagePreview}
            />

          </div>
          <div>
            <button type="submit" className={styles.submit_btn}>
              ส่งข้อมูล
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className={styles.loading}>
          <p className={styles.span}>รอสักครู่... </p>
          <p className={styles.span}>กำลังบันทึกข้อมูล</p>
          <p className={styles.span}>กรุณาอย่าปิดหน้านี้</p>
          <div className={styles.spinner}></div>
        </div>

      )}
    </>
  );
}

export default Tournament;
