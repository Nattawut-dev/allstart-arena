import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Tournament.module.css';
import Swal from 'sweetalert2'
import { GetServerSideProps, GetStaticProps } from 'next';
import NotFoundPage from '../404';


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
interface Props {
  listtournament: Listtournament[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const List = await fetch(`${process.env.HOSTNAME}/api/tournament/listtournament`);
  const Listdata = await List.json();

  return {
    props: {
      listtournament: Listdata.results, // The fetched data is an array of rules, so we pass it directly
    },
  };
};

function Tournament({ listtournament }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const parsedId = parseInt(id as string);
  const [level, setLevel] = useState('');
  const [isTournament, setIsTournament] = useState(false);

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
    if (listtournament.length >= 1) {
      setIsTournament(true)
    } else {
      setIsTournament(false)
    }
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
    const formData = new FormData(e.target);
    const otherGender1 = formData.get('gender_1');
    const otherGender2 = formData.get('gender_2');

    const gender1Value = otherGender1 === 'อื่นๆ' ? gender_1 : otherGender1 || ''; // Ensure it's not null
    const gender2Value = otherGender2 === 'อื่นๆ' ? gender_2 : otherGender2 || ''; // Ensure it's not null

    if (team_name_1 != true && team_name_1 != null) {
      Swal.fire({
        icon: 'error',
        text: 'ชื่อทีมนี้มีผู้ใช้แล้วกรุณาเปลี่ยนชื่อทีม',
      })
    }
    else if (gender1Value === '' || gender2Value === '') {
      Swal.fire({
        icon: 'error',
        text: 'กรุณาเลือกเพศ',
      })
    }

    else if (
      listtournament &&
      title &&
      Name_1 &&
      Nickname_1 &&
      age_1 &&
      gender1Value &&
      affiliation_1 &&
      tel_1 &&
      image_1 &&
      Name_2 &&
      Nickname_2 &&
      age_2 &&
      gender2Value &&
      affiliation_2 &&
      tel_2 &&
      image_2 &&
      level
    ) {

      setIsLoading(true)

      try {

        const formData = new FormData();
        formData.append('listT_id', listtournament[0].id.toString());
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


  if (!isTournament) {
    return (
      <div className={styles.notnow}>
        <div className={styles.notnowBox}>
          <h1>ยังไม่มีการจัดการแข่งขัน</h1>
          <p>ขณะนี้ยังไม่มีการจัดการแข่งขัน เช็คอัพเดทการแข่งขันได้ที่เพจ</p>
        </div>
      </div>
    );
  }

  else {
    return (

      <>
        <div className={styles.header}>
          {listtournament.length >= 1 && (
            <div>
              <h6>รายการแข่งแบดมินตัน <span>{listtournament[0].title}</span> ครั้งที่ <span> {listtournament[0].ordinal}</span></h6>
              <h6>ณ สถานที่ <span> {listtournament[0].location}</span></h6>
              <h6>ระหว่างวันที่ <span>{listtournament[0].timebetween}</span></h6>
              <h6>ระดับมือ <span style={{ fontWeight: 'bolder' }}>{level}</span> </h6>
            </div>
          )
          }
        </div>
        <h4 className={styles.h3}>สมัครแข่งขัน ระดับมือ {level}</h4>
        <div className={`${styles.content} ${isLoading ? styles.load : ''}`}>
          <div className={styles.centeredContent}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles['form-group']}>
                <div className={styles['form-col']}>
                  <label htmlFor="title">ชื่อทีม</label>
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
                    <label htmlFor="Name_1">ชื่อ-สกุล  </label>
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
                    <label htmlFor="Nickname_1">ชื่อเล่น </label>
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
                    <label htmlFor="age_1">อายุ </label>
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
                    <label htmlFor="gender_1">เพศ </label>
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
                      <label htmlFor="other_gender">เพศอื่นๆ </label>
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
                    <label htmlFor="affiliation_1">สังกัด </label>
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
                    <label htmlFor="tel_1">เบอร์โทร </label>
                    <input
                      name="tel_1"
                      type="tel"
                      maxLength={10}
                      pattern="[0-9]*"
                      placeholder="เบอร์ติดต่อ"
                      onChange={(e) => setTel_1(e.target.value)}
                      value={tel_1}
                      required
                    />
                  </div>
                  <div className={styles['form-row']}>
                    <label htmlFor="">ภาพนักกีฬา 1</label>
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
                      required
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
              <h6 className={styles.h6}>ผู้เข้าแข่งขัน 2</h6>
              <div className={styles.wrapper}>
                <div className={styles['form-group']}>
                  <div className={styles['form-row']}>
                    <label htmlFor="Name_2">ชื่อ-สกุล  </label>
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
                    <label htmlFor="Nickname_">ชื่อเล่น </label>
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
                    <label htmlFor="age_2">อายุ </label>
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
                    <label htmlFor="gender_2">เพศ </label>
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
                      <label htmlFor="other_gender2">เพศอื่นๆ </label>
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
                    <label htmlFor="affiliation_2">สังกัด </label>
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
                    <label htmlFor="tel_2">เบอร์โทร </label>
                    <input
                      name="tel_2"
                      type="tel"
                      maxLength={10}
                      pattern="[0-9]*"
                      placeholder="เบอร์ติดต่อ"
                      onChange={(e) => setTel_2(e.target.value)}
                      value={tel_2}
                      required
                    />
                  </div>
                  <div className={styles['form-row']}>
                    <label htmlFor="">ภาพนักกีฬา 2</label>
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
                      required
                    />
                  </div>

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

}

export default Tournament;
