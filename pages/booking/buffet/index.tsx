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
    const response = await fetch(`${process.env.HOSTNAME}/api/buffet/get_setting`);
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

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nickname, setNickname] = useState('');
  const [price, setPrice] = useState(0);

  const [error, setError] = useState('');
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState('')


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          const imageUrl = event.target.result;
          setImgUrl(imageUrl);
        }

        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("")
    if (name == '' || phone == '' || !nickname) {
      setError("กรุณากรอกฟิลให้ครบ")
      return;
    } else if (!selectedFile) {
      setError("กรุณาอัพโหลดภาพสลิป")
    } else if (phone.length < 10) {
      setError("กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 ตัว")
      return;
    }
    else {
      Swal.fire({
        title: 'กำลังบันทึก...',
        text: 'โปรดอย่าปิดหน้านี้',
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
        },
      });

      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('nickname', nickname);
        formData.append('usedate', format(dateInBangkok, 'dd MMMM yyyy'));
        formData.append('phone', phone);
        formData.append('price', buffet_setting.court_price.toString());
        formData.append('paymentimg', selectedFile);

        const response = await fetch('/api/buffet/add', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          // ถ้าอัปโหลดสำเร็จ แสดง SweetAlert2 ข้อความเสร็จสมบูรณ์
          // Swal.fire({
          //   title: 'บันทึกสำเร็จ',
          //   icon: 'success',
          //   showConfirmButton: false,
          //   timer: 1000, // แสดงข้อความเป็นเวลา 1.5 วินาทีแล้วปิด
          // });
          // รีเซ็ตค่าฟอร์ม
          Swal.fire({
            title: "บันทึกสำเร็จ",
            icon : 'success',
            text: "ต้องการไปหน้ารายละเอียดไหม ? ",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              router.replace("/booking/buffet/info")
            }
          });
          setName('');
          setPhone('');
          setNickname('');
          setSelectedFile(null);
          setPreviewImage(null);
          setImgUrl('');
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

  const showQR = () => {
    Swal.fire({
      imageUrl: '/QR_Buffet.jpg',
      imageHeight: 400,
      html: `<button ><a href="/QR_Buffet.jpg" download="QR_Buffet.jpg">ดาวน์โหลดภาพสลิป</a></button>
      <style>
      button {
        border : none;
        background-color: #0d6efd;
        padding : 8px;
        border-radius : 8px;
      }
      button a {
       color: white;
       text-decoration: none;

      }
    </style>`,
      imageAlt: 'QR_code',
      confirmButtonText: 'ปิดหน้าต่างนี้'
    })
  }

  return (
    <div className={styles['reserve-form-container']}>
      <Head>
        <title>จองตีบุฟเฟ่ต์</title>
      </Head>
      <h2>จองตีบุฟเฟ่ต์  </h2>
      <h2 style={{ color: 'red' }}>วันใช้งาน {format(dateInBangkok, 'dd MMMM yyyy')}</h2>
      <br />

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            maxLength={16}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='ชื่อ (ไม่เกิน 16 ตัวอักษร)'
            required
          />
        </label>
        <label>
          Nickname:
          <input
            type="text"
            maxLength={10}

            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder='ชื่อเล่น'
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
        <h6 style={{ color: "red" }}>ราคา {buffet_setting.court_price} บาท  {"(แค่ค่าสนาม) ค่าลูกจะคิดอีกทีหลังตีเสร็จ"}</h6>
        <div className='d-flex justify-content-center'>
          <label>
            Payment Slip:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {imgUrl ? (
          <div className='d-flex justify-content-center border'>
            <img src={imgUrl} alt="Payment Slip Preview" width="200" />
          </div>
        ) : (
          <>
            <span className='d-flex justify-content-center fw-bold'>QRcode สำหรับชำระเงิน</span>
            <div className='d-flex justify-content-center border' onClick={showQR}>
              <img src='/QR_buffet.jpg' alt="QR_code" width="200" />
            </div>
          </>

        )}

        <div>
          <p style={{ color: "red", fontWeight: 'Bold' }}>{error}</p>
        </div>
        <div className='row' >
          <Button className=' btn btn-success col' ><a href="/QR_buffet.jpg" style={{textDecoration : 'none' , color : 'white'}} download="QR_buffet.jpg">โหลดภาพสลิป</a></Button>
          <Button className='col mx-2' type="submit">ยืนยันการจอง</Button>
        </div>

      </form>
    </div>
  );
}
