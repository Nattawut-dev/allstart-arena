import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/ReserveForm.module.css';
import { utcToZonedTime } from 'date-fns-tz';
import { format, addDays, differenceInHours, } from 'date-fns';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';


interface Buffet_setting {
  id: number;
  court_price: number;
  shuttle_cock_price: number;
}
interface Props {
  buffet_setting: Buffet_setting;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const response = await fetch(`${process.env.HOSTNAME}/api/buffet/newbie/get_setting`);
    const buffetSetting = await response.json();
    return {
      props: {
        buffet_setting: buffetSetting[0],

      },

    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return {
      props: {
        buffet_setting: [],
      },
    };
  }
}
export default function Page({ buffet_setting }: Props) {
  const router = useRouter();
  const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");

  const [phone, setPhone] = useState('');
  const [nickname, setNickname] = useState('');
  const [unique_nickname, setUnique_nickname] = useState(false)
  const [error, setError] = useState('');


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("")
    if (phone == '' || !nickname) {
      setError("กรุณากรอกฟิลให้ครบ")
      return;
    } else if (phone.length < 10) {
      setError("กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 ตัว")
      return;
    }
    else if (unique_nickname) {
      Swal.fire({
        icon: "error",
        title: "ชื่อนี้มีคนใช้แล้ว",
        text: "ชื่อซ้ำกรุณาเปลี่ยนชื่อ",
      });
      return;
    }
    else {
      Swal.fire({
        title: 'กำลังบันทึก...',
        text: 'โปรดอย่าปิดหน้านี้',
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const formData = new FormData();
        formData.append('nickname', nickname);
        formData.append('usedate', format(dateInBangkok, 'dd MMMM yyyy'));
        formData.append('phone', phone);
        formData.append('isStudent', isStudent.toString());

        const response = await fetch('/api/buffet/newbie/add', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {

          Swal.fire({
            title: "บันทึกสำเร็จ",
            icon: 'success',
            text: "ต้องการไปหน้ารายละเอียดไหม ? ",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              router.replace("/booking/buffet/newbie/info")
            }
          });
          setPhone('');
          setNickname('');
          setIsStudent(0)
        } else {
          // ถ้ามีข้อผิดพลาดในการอัปโหลด แสดง SweetAlert2 ข้อความข้อผิดพลาด
          Swal.fire({
            title: 'เกิดข้อผิดพลาดในการอัปโหลด',
            text: 'โปรดลองใหม่อีกครั้ง',
            icon: 'error',
          });
        }
      } catch (error) {
        // ถ้าเกิดข้อผิดพลาดในการทำงาน
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'โปรดลองใหม่อีกครั้ง',
          icon: 'error',
        });
        console.error('Error:', error);
      }

    }

  };

  const nick_name_check = async (nick_name: string) => {
    setNickname(nick_name)
    const response = await fetch(`/api/buffet/newbie/check_nick_name?nickname=${nick_name}&usedate=${format(dateInBangkok, 'dd MMMM yyyy')}`);
    const jsonData = await response.json();

    if (jsonData.length > 0) {
      if (jsonData[0].nickname == nick_name) {
        setError("ชื่อเล่นมีผู้ใช้แล้วโปรดเปลี่ยนชื่อ")
        setUnique_nickname(true)
      } else {
        setError('')
        setUnique_nickname(false)
      }
    } else {
      setError('')
      setUnique_nickname(false)
    }

  }
  const [isStudent, setIsStudent] = useState(0)
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsStudent(event.target.checked ? 1 : 0)
  };
  return (
    <div className={styles['reserve-form-container']}>
      <Head>
        <title>จองตีบุฟเฟ่ต์ (มือใหม่)</title>
      </Head>
      <h2>จองตีบุฟเฟ่ต์ (มือใหม่)  </h2>
      <h2 style={{ color: 'red' }}>วันใช้งาน {format(dateInBangkok, 'dd MMMM yyyy')}</h2>
      <br />

      <form onSubmit={handleSubmit}>

        <label>
          Nickname:
          <input
            type="text"
            maxLength={10}
            value={nickname}
            onChange={(e) => nick_name_check(e.target.value)}
            placeholder='ชื่อเล่น'
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            maxLength={10}
            pattern="0[0-9]{9}"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='เบอร์โทร'
            required
          />
        </label>
        <div className={`${styles.checkbox_wrapper} d-flex mt-3`}>
          <input type="checkbox" id="cbtest-19" value={isStudent} onChange={handleCheckboxChange} checked={isStudent == 1} />
          <label htmlFor="cbtest-19" className={styles.check_box}></label>
          <p className='mx-2' style={{ padding: '0' }}>นักเรียน / นักศึกษา</p>
        </div>


        <div>
          <p style={{ color: "red", fontWeight: 'Bold' }}>{error}</p>
        </div>
        <h6 >ค่าตีก๊วน <span style={{ color: "red" }} > {isStudent===1 ? "0" :  buffet_setting.court_price}</span>  บาทต่อคน  ค่าลูกต่อ 1 ลูก
          <span style={{ color: "red" }} > {buffet_setting.shuttle_cock_price} </span> บาท  </h6>
        <h6>(คนละ <span style={{ color: "red" }} > {buffet_setting.shuttle_cock_price / 4} </span> บาท/ลูก)</h6>

        <div className='row' >
          <Button className='col mx-2' type="submit">ยืนยันการจอง</Button>
        </div>

      </form>
    </div>
  );
}
