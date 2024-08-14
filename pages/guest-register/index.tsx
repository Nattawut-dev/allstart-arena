import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/ReserveForm.module.css';
import { utcToZonedTime } from 'date-fns-tz';
import { format, addDays, differenceInHours, } from 'date-fns';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';


export default function Page() {

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

        const response = await fetch('/api/guest-register', {
          method: 'POST',
          body: JSON.stringify({ nickname: nickname, phone: phone }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if(response.status === 400) {
          return Swal.fire({
            title: 'ชื่อซ้ำกับลูกค้าท่านอื่น',
            text: 'โปรดเปลี่ยนชื่อ',
            icon: 'error',
          });
        }
        if (response.ok) {
          const data = await response.json();

          Swal.fire({
            title: `บันทึกสำเร็จ รหัสของท่านคือ ${data.barcode.barcode}`,
            icon: 'success',
            text: "ต้องการไปหน้ารายละเอียดไหม ? ",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
          }).then((result) => {
            if (result.isConfirmed) {
              router.replace("/guest-register/guest-register-info")
            }
          });
          setPhone('');
          setNickname('');
        } else {
          Swal.fire({
            title: 'เกิดข้อผิดพลาดในการอัปโหลด',
            text: 'โปรดลองใหม่อีกครั้ง',
            icon: 'error',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'โปรดลองใหม่อีกครั้ง',
          icon: 'error',
        });
        console.error('Error:', error);
      }

    }

  };

  return (
    <div className={styles['reserve-form-container']}>
      <Head>
        <title>ลงชื่อซื้อของ</title>
      </Head>
      <h2>ลงชื่อซื้อของ</h2>
      <h2 style={{ color: 'red' }}>วันที่ {format(dateInBangkok, 'dd MMMM yyyy')}</h2>
      <br />

      <form onSubmit={handleSubmit}>

        <label>
          Nickname:
          <input
            type="text"
            maxLength={10}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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
        <div>
          <p style={{ color: "red", fontWeight: 'Bold' }}>{error}</p>
        </div>
        <div className='row' >
          <Button className='col mx-2 mt-1' type="submit">ยืนยัน</Button>
        </div>
      </form>
      <p className='mt-2'>ลงชื่อเพื่อสามารถซื้อของโดยที่จ่ายทีหลังได้</p>
    </div>
  );
}
