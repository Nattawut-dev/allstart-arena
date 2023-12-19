import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Tournament.module.css';
import Head from 'next/head';
import { Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

interface TeamData {
  team_name: string;
}

interface Listtournament {
  id: number;
  title: string;
  ordinal: number;
  location: string;
  timebetween: string;
  status: number;
}
interface Handlevel {
  id: number;
  name: string;
  max_team_number: number;
  price: number;
}
interface Props {
  selectedTournament: Listtournament;
  selectHandlevel: Handlevel | null;
  backToggle: () => void;

}

function Tournament({ selectedTournament, selectHandlevel, backToggle }: Props) {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 767 }); // กำหนดจุด breakpoint ของมือถือ

  useEffect(() => {
    if (!selectedTournament || !selectHandlevel) {
      router.replace('/Tournament')
    }
  }, [selectedTournament, selectHandlevel]);

  const fetchData = async (team_name : string) => {
    const response = await fetch(`/api/tournament/check?team_name=${team_name}`);
    const jsonData = await response.json();
    setTeamname(jsonData.results);
  }
  const [title, setTitle] = useState('');
  const [Name_1, setName_1] = useState('');
  const [Nickname_1, setNickname_1] = useState('');
  const [age_1, setAge_1] = useState('');
  const [gender_1, setGender_1] = useState('');
  const [otherGender1, setOtherGender1] = useState('');
  const [affiliation_1, setAffiliation_1] = useState('');
  const [tel_1, setTel_1] = useState('');
  const [image_1, setImage_1] = useState(null);
  const [Name_2, setName_2] = useState('');
  const [Nickname_2, setNickname_2] = useState('');
  const [age_2, setAge_2] = useState('');
  const [gender_2, setGender_2] = useState('');
  const [otherGender2, setOtherGender2] = useState('');
  const [affiliation_2, setAffiliation_2] = useState('');
  const [tel_2, setTel_2] = useState('');
  const [image_2, setImage_2] = useState<File | null>(null);
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
    checkTeamname(title);

    const formData = new FormData(e.target);
    const otherGender1 = formData.get('gender_1');
    const otherGender2 = formData.get('gender_2');

    const gender1Value = otherGender1 === 'อื่นๆ' ? gender_1 : otherGender1 || '';
    const gender2Value = otherGender2 === 'อื่นๆ' ? gender_2 : otherGender2 || '';
    if (tel_1.length < 10) {

      Swal.fire({
        icon: 'error',
        text: 'เบอร์ผู้สมัคร 1 ไม่ครบ 10 ตัว',
      })
      return;


    }
    else if (tel_2.length < 10) {
      Swal.fire({
        icon: 'error',
        text: 'เบอร์ผู้สมัคร 2 ไม่ครบ 10 ตัว',
      })
      return;

    }
    else if (image_1 == null) {
      Swal.fire({
        icon: 'error',
        text: 'โปรดอัพโหลดภาพผู้สมัคร1',
      })
      return;

    }
    else if (image_2 == null) {
      Swal.fire({
        icon: 'error',
        text: 'โปรดอัพโหลดภาพผู้สมัคร2',
      })
      return;

    }
    else if (team_name_1 != true && team_name_1 != null) {
      Swal.fire({
        icon: 'error',
        text: 'ชื่อทีมนี้มีผู้ใช้แล้วกรุณาเปลี่ยนชื่อทีม',
      })
      return;

    }
    else if (gender1Value === '' || gender2Value === '') {
      Swal.fire({
        icon: 'error',
        text: 'กรุณาเลือกเพศ',
      })
      return;

    }

    else if (
      selectedTournament &&
      title &&
      Name_1 &&
      Nickname_1 &&
      age_1 &&
      gender1Value &&
      affiliation_1 &&
      tel_1.length == 10 &&
      image_1 &&
      Name_2 &&
      Nickname_2 &&
      age_2 &&
      gender2Value &&
      affiliation_2 &&
      tel_2.length == 10 &&
      image_2 &&
      selectHandlevel
    ) {

      // setIsLoading(true)

      try {
        Swal.fire({
          title: 'กำลังบันทึก...',
          text: 'โปรดอย่าปิดหน้านี้',
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
          },
        });
  
        const formData = new FormData();
        formData.append('listT_id', selectedTournament.id.toString());
        formData.append('title', title);
        formData.append('Name_1', Name_1);
        formData.append('Nickname_1', Nickname_1);
        formData.append('age_1', age_1);
        formData.append('gender_1', gender1Value);
        formData.append('affiliation_1', affiliation_1);
        formData.append('tel_1', tel_1);
        formData.append('image_1', image_1);
        formData.append('Name_2', Name_2);
        formData.append('Nickname_2', Nickname_2);
        formData.append('age_2', age_2);
        formData.append('gender_2', gender2Value);
        formData.append('affiliation_2', affiliation_2);
        formData.append('tel_2', tel_2);
        formData.append('image_2', image_2);
        formData.append('level', selectHandlevel?.name);


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
            timer: 1000,

          })
          router.replace(`/Tournament/detail?tournament=${selectedTournament.id}&hand_level=${encodeURIComponent(selectHandlevel?.name)}`)
          setMessage('Post added successfully!');
        } else {
          setIsLoading(false);
          Swal.fire({
            icon: 'error',
            text: 'เกิดข้อผิดพลาด',
          })
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
    fetchData(teamName)
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


  const starRed = <span style={{ color: 'red' }}>*</span>
  return (

    <>
      <Head>
        <title>สมัครแข่งขัน ระดับมือ {selectHandlevel?.name}</title>
      </Head>

      <div className={styles.header}>

        {selectedTournament && (
          <div>
            <h6>รายการแข่งแบดมินตัน <span>{selectedTournament.title}</span> ครั้งที่ <span> {selectedTournament.ordinal}</span></h6>
            <h6>ณ สถานที่ <span> {selectedTournament.location}</span></h6>
            <h6>ระหว่างวันที่ <span>{selectedTournament.timebetween}</span></h6>
            <h6>ระดับมือ <span style={{ fontWeight: 'bolder' }}>{selectHandlevel?.name}</span> ค่าสมัคร <span style={{ fontWeight: 'bolder' }}>{selectHandlevel?.price?.toLocaleString()}</span> บาท </h6>
          </div>
        )
        }
      </div>
      <h4 className={styles.h3}>สมัครแข่งขัน ระดับมือ <span style={{ color: 'red' }}>{selectHandlevel?.name}</span></h4>
      <div className={`${styles.content} ${isLoading ? styles.load : ''}`}>
        <div className={styles.centeredContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles['form-group']}>
              <div className={styles['form-col']}>
                <label htmlFor="title">ชื่อทีม {starRed}</label>
                <input
                  name="title"
                  type="text"
                  placeholder="ชื่อทีม"
                  onChange={(e) => checkTeamname(e.target.value)}
                  value={title}
                  required
                />
                {message ? (
                  <div style={{ color: 'red' }}>{message}</div>
                ) : ''}
              </div>
            </div>

            <h6 className={styles.h6}>ผู้เข้าแข่งขัน 1</h6>

            <div className={styles.wrapper}>
              <div className={styles['form-group']}>
                <div className={styles['form-row']}>
                  <label htmlFor="Name_1">ชื่อ-สกุล {starRed}  </label>
                  <input
                    name="Name_1"
                    type="text"
                    placeholder="ชื่อ-สกุล"
                    onChange={(e) => setName_1(e.target.value)}
                    value={Name_1}
                    required
                  />
                </div>

                <div className={styles['form-row']}>
                  <label htmlFor="Nickname_1">ชื่อเล่น {starRed}</label>
                  <input
                    name="Nickname_1"
                    type="text"
                    placeholder="ชื่อเล่น"
                    onChange={(e) => setNickname_1(e.target.value)}
                    value={Nickname_1}
                    required
                  />
                </div>

                <div className={styles['form-row']}>
                  <label htmlFor="age_1">อายุ {starRed}</label>
                  <input
                    name="age_1"
                    type="number"
                    placeholder="อายุ"
                    onChange={(e) => setAge_1(e.target.value)}
                    value={age_1}
                    required
                  />
                </div>
                <div className={styles['form-row']}>
                  <label htmlFor="gender_1">เพศ {starRed}</label>
                  <select
                    name="gender_1"
                    onChange={(e) => { setOtherGender1(e.target.value); }}
                    value={otherGender1}
                    required
                  >
                    <option value="">เลือกเพศ</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                {otherGender1 === 'อื่นๆ' && (
                  <div className={styles['form-row']}>
                    <label htmlFor="other_gender">เพศอื่นๆ {starRed}</label>
                    <input
                      name="other_gender"
                      type="text"
                      placeholder="เพศอื่นๆ"
                      onChange={(e) => setGender_1(e.target.value)}
                      value={gender_1}
                      required
                    />
                  </div>
                )}
                <div className={styles['form-row']}>
                  <label htmlFor="affiliation_1">สังกัด {starRed}</label>
                  <input
                    name="affiliation_1"
                    type="text"
                    placeholder="สังกัด"
                    onChange={(e) => setAffiliation_1(e.target.value)}
                    value={affiliation_1}
                    required
                  />
                </div>
                <div className={styles['form-row']}>
                  <label htmlFor="tel_1">เบอร์โทร {starRed}</label>
                  <input
                    name="tel_1"
                    type="tel"
                    maxLength={10}
                    pattern="0[0-9]{9}"
                    placeholder="เบอร์ติดต่อ"
                    onChange={(e) => setTel_1(e.target.value)}
                    value={tel_1}
                    required
                  />
                </div>
                <div className={styles['form-row']}>
                  <label htmlFor="file-input-1">ภาพนักกีฬา 1 {starRed}</label>
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
              </div>

              <img
                src={`${image_1 ? URL.createObjectURL(image_1) : '/user.png'}`}
                alt="Participant 1"
                className={styles.imagePreview}
              />

            </div>
            <div className={styles.line}></div>
            <h6 className={styles.h6}>ผู้เข้าแข่งขัน 2 {starRed}</h6>
            <div className={styles.wrapper}>
              <div className={styles['form-group']}>
                <div className={styles['form-row']}>
                  <label htmlFor="Name_2">ชื่อ-สกุล {starRed} </label>
                  <input
                    name="Name_2"
                    type="text"
                    placeholder="ชื่อ-สกุล"
                    onChange={(e) => setName_2(e.target.value)}
                    value={Name_2}
                    required
                  />
                </div>

                <div className={styles['form-row']}>
                  <label htmlFor="Nickname_">ชื่อเล่น {starRed}</label>
                  <input
                    name="Nickname_"
                    type="text"
                    placeholder="ชื่อเล่น"
                    onChange={(e) => setNickname_2(e.target.value)}
                    value={Nickname_2}
                    required
                  />
                </div>

                <div className={styles['form-row']}>
                  <label htmlFor="age_2">อายุ {starRed}</label>
                  <input
                    name="age_2"
                    type="number"
                    placeholder="อายุ"
                    onChange={(e) => setAge_2(e.target.value)}
                    value={age_2}
                    required
                  />
                </div>
                <div className={styles['form-row']}>
                  <label htmlFor="gender_2">เพศ {starRed}</label>
                  <select
                    name="gender_2"
                    onChange={(e) => setOtherGender2(e.target.value)}
                    value={otherGender2}
                    required
                  >
                    <option value="">เลือกเพศ</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                {otherGender2 === 'อื่นๆ' && (
                  <div className={styles['form-row']}>
                    <label htmlFor="other_gender2">เพศอื่นๆ {starRed}</label>
                    <input
                      name="other_gender2"
                      type="text"
                      placeholder="เพศอื่นๆ"
                      onChange={(e) => setGender_2(e.target.value)}
                      value={gender_2}
                      required
                    />
                  </div>
                )}
                <div className={styles['form-row']}>
                  <label htmlFor="affiliation_2">สังกัด {starRed}</label>
                  <input
                    name="affiliation_2"
                    type="text"
                    placeholder="สังกัด"
                    onChange={(e) => setAffiliation_2(e.target.value)}
                    value={affiliation_2}
                    required
                  />
                </div>
                <div className={styles['form-row']}>
                  <label htmlFor="tel_2">เบอร์โทร {starRed}</label>
                  <input
                    name="tel_2"
                    type="tel"
                    maxLength={10}
                    pattern="0[0-9]{9}"
                    placeholder="เบอร์ติดต่อ"
                    onChange={(e) => setTel_2(e.target.value)}
                    value={tel_2}
                    required
                  />
                </div>
                <div className={styles['form-row']}>
                  <label htmlFor="file-input-2">ภาพนักกีฬา 2 {starRed}</label>
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

              </div>
              <img
                src={`${image_2 ? URL.createObjectURL(image_2) : '/user.png'}`}
                alt="Participant 2"
                className={styles.imagePreview}
              />

            </div>
            <div className='d-flex align-items-center'>
              <Button className={`btn btn-danger mx-2 ${styles.submit_btn}`} style={{ width: '20%', backgroundColor: '#dc3545' }} onClick={backToggle}>
                {isMobile ? '<' : 'ย้อนกลับ'}
              </Button>
              <button type="submit" className={styles.submit_btn}>
                ส่งข้อมูล
              </button>
            </div>
          </form>
        </div>


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
