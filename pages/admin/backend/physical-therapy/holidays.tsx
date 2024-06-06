import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/admin/holidays.module.css'
import Swal from 'sweetalert2'
import Head from 'next/head';

interface Holidays {
  id: number;
  title: string;
  date: string;
  status: number;
}


function Holiday() {
  const [holidays, setHolidays] = useState<Holidays[]>([])

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [id2, setID2] = useState(0);

  const [title2, setTitle2] = useState('');
  const [status2, setStatus2] = useState(false);
  const [selectedDate2, setSelectedDate2] = useState(new Date());

  const [status, setStatus] = useState(false);

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  useEffect(() => {
    getHoliday();
  }, []);

  // Function to handle date change
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  const handleDateChange2 = (date: Date) => {
    setSelectedDate2(date);
  };

  const getHoliday = async () => {
    try {
      const response = await fetch(`/api/admin/physical-therapy/holidays/get`);
      const data = await response.json();
      if (data.results.length >= 1) {
        setHolidays(data.results);
      } else {
        console.log('noholiday')
      }
    } catch {
      console.log('error');
    }
  };

  const handleCheckboxChange = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      const response = await fetch('/api/admin/physical-therapy/holidays/statusUpdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, newStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error('An error occurred while updating the data.');
      }

      // Update the local state immediately after the checkbox is clicked
      setHolidays((prevHolidays) =>
        prevHolidays.map((holiday) =>
          holiday.id === id ? { ...holiday, status: newStatus } : holiday
        )
      );
    } catch (error: any) {
      console.error(error.message);
      // Handle any error or display an error message
    }
  };
  const deleteHoliday = async (id: number, title: string, date: string) => {
    Swal.fire({
      title: `ต้องการลบ? `,
      text: `หัวข้อ ${title} วันที่ ${date}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/admin/physical-therapy/holidays/delete?id=${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('An error occurred while deleting the data.');
          } else {
            Swal.fire(
              'Deleted!',
              `ลบ หัวข้อ ${title} วันที่ ${date} เรียบร้อย`,
              'success'
            )
          }

          // Update the local state to remove the deleted holiday
          setHolidays((prevHolidays) =>
            prevHolidays.filter((holiday) => holiday.id !== id)
          );
        } catch (error: any) {
          console.error(error.message);
          // Handle any error or display an error message
        }

      }
    })

  };
  const handleAddHoliday = async () => {
    if (title == '') {
      Swal.fire({
        icon: 'error',
        title: 'กรอกหัวข้อ',
        text: 'กรุณากรอกหัวข้อ',
      })
      return;
    }
    try {

      const response = await fetch('/api/admin/physical-therapy/holidays/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, date: format(selectedDate, 'MM-dd-yyyy'), status: status ? 1 : 0 }),
      });

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'วันที่ซ้ำ',
          text: 'วันที่นี้มีข้อมูลอยู่แล้ว',
        })
        throw new Error('Failed to add the data.');
      }

      // Reset the state and close the modal after successful addition
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'เพิ่มวันหยุดสำเร็จ',
      })
      setTitle('');
      setSelectedDate(new Date());
      setStatus(false);
      setShow(false);
      getHoliday();
    } catch (error) {
      console.error('An error occurred while adding the data:', error);
      // Handle any error or display an error message
    }
  };
  const editSelecter = (item: Holidays) => {
    setTitle2(item.title);
    setStatus2(item.status === 1)
    setSelectedDate2(new Date(item.date))
    setID2(item.id)
    setShow2(true);
  }

  async function updateHoliday() {
    try {
      const response = await fetch(`/api/admin/physical-therapy/holidays/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id2,
          title: title2,
          date: format(selectedDate2, 'MM-dd-yyyy'),
          status: status2 ? 1 : 0

        }),
      });

      if (!response.ok) {
        throw new Error('An error occurred while updating the data.');
      }
      setSelectedDate2(new Date());
      setStatus2(false);
      setShow2(false);
      getHoliday();
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('An error occurred while updating the data:', error);
      throw error;
    }
  }

  return (
    <>
      <Head>
        <title>Physical Therapy Holidays</title>
      </Head>
      <div className={styles.container}>

        <div className={styles.box}>
          <h5 className='fw-bold'>จัดการวันหยุด นัดทำกายภาพ</h5>
          <table className="table table-bordered">
            <thead className='table-primary'>
              <tr>
                <th scope="col">#</th>
                <th scope="col">หัวข้อ</th>
                <th scope="col">วันที่ {'(เดือน-วัน-ปี)'}</th>
                <th scope="col">สถานะ</th>
                <th scope="col">อัพเดท</th>
                <th scope="col">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.date}</td>
                  <td>
                    <div className={styles.switch}>
                      <input
                        type="checkbox"
                        id={`${item.id}`}
                        checked={item.status === 1}
                        onChange={() => handleCheckboxChange(item.id, item.status)}
                      />
                      <label htmlFor={`${item.id}`}>Toggle</label>
                    </div>
                  </td>
                  <td>
                    <Button
                      className="btn-sm"
                      onClick={() => {
                        editSelecter(item)
                      }}
                    >
                      แก้ไข
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="btn-sm btn-danger"
                      onClick={() => deleteHoliday(item.id, item.title, item.date)}
                    >
                      ลบ
                    </Button></td>

                </tr>
              ))}


            </tbody>
          </table>

          <div className='d-flex justify-content-end'> <Button onClick={() => setShow(true)}>เพิ่มวันหยุด</Button></div>

        </div>

      </div>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มวันหยุด</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.addholiday}>
            <div className='d-flex flex-column'>
              <label htmlFor="title" className='mb-2'>หัวข้อ</label>
              <input
                type="text"
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='d-flex flex-column'>
              <label htmlFor="date" className='mb-2'>วันที่  {'(เดือน-วัน-ปี)'}</label>
              <DatePicker
                id='date'
                selected={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div className={styles.switch}>
              <div className='mb-3'>สถานะ</div>
              <input
                type="checkbox"
                id="switch"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
              />
              <label htmlFor="switch">Toggle</label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button onClick={handleAddHoliday}>ยืนยัน</Button>
          </div>
          <div>
            <Button className='btn-danger' onClick={() => setShow(false)}>ยกเลิก</Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal show={show2} onHide={() => setShow2(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขวันหยุด</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.addholiday}>
            <div className='d-flex flex-column'>
              <label htmlFor="title" className='mb-2'>หัวข้อ</label>
              <input
                type="text"
                id='title'
                value={title2}
                onChange={(e) => setTitle2(e.target.value)}
              />
            </div>
            <div className='d-flex flex-column'>
              <label htmlFor="date" className='mb-2'>วันที่  {'(เดือน-วัน-ปี)'}</label>
              <DatePicker
                id='date'
                selected={selectedDate2}
                onChange={handleDateChange2}
              />
            </div>
            <div className={styles.switch}>
              <div className='mb-3'>สถานะ</div>
              <input
                type="checkbox"
                id="switch"
                checked={status2}
                onChange={(e) => setStatus2(e.target.checked)}
              />
              <label htmlFor="switch">Toggle</label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button onClick={updateHoliday}>ยืนยัน</Button>
          </div>
          <div>
            <Button className='btn-danger' onClick={() => setShow2(false)}>ยกเลิก</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>

  )
}

export default Holiday