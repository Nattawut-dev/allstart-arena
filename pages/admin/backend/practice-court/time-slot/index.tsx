import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export interface TimeSlot {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  price: number;
  status: number;
}

const TimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [editedStartTime, setEditedStartTime] = useState('');
  const [editedEndTime, setEditedEndTime] = useState('');
  const [editedPrice, setEditedPrice] = useState<number | undefined>(undefined);

  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [newPrice, setNewPrice] = useState<number | undefined>(undefined);
  const [newStatus, setNewStatus] = useState(true);




  const fetchTimeSlots = async () => {
    try {
      const response = await fetch('/api/admin/practice-court/setting/timeSlots');

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setTimeSlots(data);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch data. Please try again later.',
      });
    }
  };

  useEffect(() => {
    fetchTimeSlots();

  }, []);

  const addTimeSlot = async () => {
    if (newStartTime.trim() === '') return;

    const result = await Swal.fire({
      title: 'Confirmation',
      text: `ยืนยันการเพิ่ม Time Slot ใหม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      const response = await fetch('/api/admin/practice-court/setting/timeSlots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newStartTime + ' - ' + newEndTime,
          start_time: newStartTime,
          end_time: newEndTime,
          price: newPrice,
          status: newStatus === true ? 1 : 0
        }),
      });

      if (response.ok) {
        fetchTimeSlots();
        setNewStartTime('');
        setNewEndTime('');
        setNewPrice(0);
        setNewStatus(true)
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `เพิ่ม Time Slot "${newStartTime + ' - ' + newEndTime}" เรียบร้อยแล้ว`,
        });
      }
    }
  };

  const deleteTimeSlot = async (id: number, title: string) => {
    const result1 = await Swal.fire({
      title: `แน่ใจนะว่าจะลบ Time Slot "${title}"?`,
      text: 'หากลบแล้วข้อมูลที่เกี่ยวข้องอาจถูกลบไปด้วย',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result1.isConfirmed) {
      const result2 = await Swal.fire({
        title: `ถามอีกครั้งว่าจะลบ "${title}" จริงๆหรือไม่`,
        text: 'หากลบแล้วข้อมูลที่เกี่ยวข้องจะถูกลบไปด้วยนะ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });

      if (result2.isConfirmed) {
        const response = await fetch(`/api/admin/practice-court/setting/timeSlots?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedTimeSlots = timeSlots.filter((timeSlot) => timeSlot.id !== id);
          setTimeSlots(updatedTimeSlots);

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `ลบ Time Slot "${title}" เรียบร้อยแล้ว`,
          });
        }
      }
    }
  };

  const saveEditedTimeSlot = async () => {
    if (!editingTimeSlot) return;

    const result = await Swal.fire({
      title: 'Confirmation',
      text: `ต้องการเปลี่ยนข้อมูล Time Slot "${editingTimeSlot.title}" ใหม่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      const response = await fetch(`/api/admin/practice-court/setting/timeSlots`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingTimeSlot.id,
          title: editedStartTime + ' - ' + editedEndTime,
          start_time: editedStartTime,
          end_time: editedEndTime,
          price: editedPrice,
          status: editingTimeSlot.status
        }),
      });

      if (response.ok) {
        fetchTimeSlots();
        setEditingTimeSlot(null);

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'บันทึกการแก้ไขเรียบร้อยแล้ว',
        });
      }
    }
  };

  const editTimeSlot = (timeSlot: TimeSlot) => {
    setEditingTimeSlot(timeSlot);
    setEditedStartTime(timeSlot.start_time);
    setEditedEndTime(timeSlot.end_time);
    setEditedPrice(timeSlot.price);
  };

  const toggleStatus = async (timeSlot: TimeSlot) => {
    const newStatus = timeSlot.status === 1 ? 0 : 1;

    const response = await fetch(`/api/admin/practice-court/setting/timeSlots`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: timeSlot.id,
        title: timeSlot.title,
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
        price: timeSlot.price,
        status: newStatus,
      }),
    });

    if (response.ok) {
      fetchTimeSlots();
    }
  };

  return (
    <>
      <Head>
        <title>Time slots  setting</title>
      </Head>
      <div className={`mt-5 `} >
        <h1>Time Slots</h1>
        <div style={{ overflow: 'auto', whiteSpace: 'nowrap' }} >
          <table className="table table-bordered table-striped  table-sm ">
            <thead className='table-primary'>
              <tr>
                <th>#</th>
                <th>Time Slot Title</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Price</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot, index) => (
                <tr key={timeSlot.id}>
                  <td>{index + 1}</td>
                  <td>
                    {timeSlot.title}
                  </td>
                  <td>
                    {editingTimeSlot && editingTimeSlot.id === timeSlot.id ? (
                      <input
                        type="text"
                        value={editedStartTime}
                        onChange={(e) => setEditedStartTime(e.target.value)} />
                    ) : (
                      timeSlot.start_time
                    )}
                  </td>
                  <td>
                    {editingTimeSlot && editingTimeSlot.id === timeSlot.id ? (
                      <input
                        type="text"
                        value={editedEndTime}
                        onChange={(e) => setEditedEndTime(e.target.value)} />
                    ) : (
                      timeSlot.end_time
                    )}
                  </td>
                  <td>
                    {editingTimeSlot && editingTimeSlot.id === timeSlot.id ? (
                      <input
                        type="number"
                        value={editedPrice || ''}
                        onChange={(e) => setEditedPrice(parseFloat(e.target.value))} />
                    ) : (
                      timeSlot.price
                    )}
                  </td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`statusSwitch-${timeSlot.id}`}
                        checked={timeSlot.status === 1}
                        onChange={() => toggleStatus(timeSlot)} />
                      <label className="form-check-label" htmlFor={`statusSwitch-${timeSlot.id}`}>
                        {timeSlot.status === 1 ? 'On' : 'Off'}
                      </label>
                    </div>
                  </td>
                  <td>
                    {editingTimeSlot && editingTimeSlot.id === timeSlot.id ? (
                      <>
                        <button className="btn btn-success" onClick={saveEditedTimeSlot}>
                          Save
                        </button>
                        <button className="btn btn-danger" onClick={() => setEditingTimeSlot(null)}>
                          ยกเลิก
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-warning mr-2" onClick={() => editTimeSlot(timeSlot)}>
                          Edit
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteTimeSlot(timeSlot.id, timeSlot.title)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        </div>
        <div style={{ overflow: 'auto', whiteSpace: 'nowrap' }} >

          <div className="inputGroup-sizing-default">
            <span></span>
            เพิ่ม Time Slot
          </div>
          <table className="table table-bordered table-striped  table-sm">
            <thead>
              <tr>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Price</th>
                <th>Status</th>
                <th>บันทึก</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    value={newStartTime}
                    required
                    placeholder='ex. 10:00'
                    onChange={(e) => setNewStartTime(e.target.value)} />
                </td>
                <td>
                  <input
                    type="text"
                    value={newEndTime}
                    required
                    placeholder='ex. 11:00'
                    onChange={(e) => setNewEndTime(e.target.value)} />
                </td>
                <td>
                  <input
                    type="number"
                    value={newPrice}
                    required
                    onChange={(e) => setNewPrice(parseFloat(e.target.value))} />
                </td>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`statusSwitch`}
                      checked={newStatus}
                      onChange={() => setNewStatus(!newStatus)}
                    />
                    <label className="form-check-label" htmlFor={`statusSwitch`}>
                      {newStatus ? 'On' : 'Off'}
                    </label>
                  </div>
                </td>

                <td>
                  <button className="btn btn-primary " onClick={addTimeSlot}>
                    ยืนยัน
                  </button>
                  <button className="btn btn-danger mx-2">
                    ยกเลิก
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-danger">
          **ไม่แนะนำให้ลบ Time Slot แต่แนะนำให้ปิด/เปิดสถานะ หรือแก้ไข Time Slot เมื่อต้องการเปลี่ยนแปลงแทนการเพิ่ม
          เนื่องจากหากมีการจอง Time Slot นั้น ๆ ที่คุณลบ รายการจองที่เกี่ยวข้องอาจหายไปด้วย**
        </p>
        <p className="text-danger">
          **เวลาเริ่ม และ สิ้นสุด ใช้รูปแบบ xx:xx ตัวอย่าง 10:00 เท่านั้น ถ้าใช้แบบอื่นระบบจะ error **
        </p>
      </div>
    </>
  );

}
export default TimeSlots;
