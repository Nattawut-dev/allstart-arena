import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';


const Home = () => {
  const [courts, setCourts] = useState<{ id: number; title: string; status: number }[]>([]);
  const [newCourtTitle, setNewCourtTitle] = useState('');
  const [editingCourt, setEditingCourt] = useState<{ id: number; title: string; status: number } | null>(null);


  const fetchCourts = async () => {
    try {
      const response = await fetch('/api/admin/practice-court/setting/courts');

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setCourts(data);
    } catch (error) {
      // แสดง SweetAlert2 ในกรณีเกิดข้อผิดพลาด
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch data. Please try again later.',
      });
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const addCourt = async () => {
    if (newCourtTitle.trim() === '') return;

    // แสดง SweetAlert2 สำหรับการยืนยันการเพิ่ม
    const result = await Swal.fire({
      title: 'Confirmation',
      text: `ยืนยันการเพิ่มคอร์ทใหม่? หัวข้อ "${newCourtTitle}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      const response = await fetch('/api/admin/practice-court/setting/courts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newCourtTitle }),
      });

      if (response.ok) {
        fetchCourts();
        setNewCourtTitle('');

        // แสดง SweetAlert2 ในกรณีเพิ่มสำเร็จ
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `เพิ่มคอร์ท "${newCourtTitle}"เรียบร้อยแล้ว`,
        });
      }
    }
  };

  const deleteCourt = async (id: number, title: string) => {
    // แสดง SweetAlert2 สำหรับการยืนยันการลบ
    const result1 = await Swal.fire({
      title: `แน่ใจนะว่าจะลบ "${title}"?`,
      text: '**หากลบแล้วรายชื่อที่เคยจองคอร์ทนี้จะไม่ขึ้นชื่อคอร์ท**',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (result1.isConfirmed) {
      const result2 = await Swal.fire({
        title: `ถามอีกครั้งว่าจะลบ "${title}" จริงๆเหรอ`,
        text: '**หากลบแล้วรายชื่อที่เคยจองคอร์ทนี้จะไม่ขึ้นชื่อคอร์ทนะ กู้ไม่ได้ด้วยแหละ**',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });

      if (result2.isConfirmed) {
        const response = await fetch(`/api/admin/practice-court/setting/courts?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedCourts = courts.filter((court) => court.id !== id);
          setCourts(updatedCourts);

          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: `ลบ "${title}" เรียบร้อย!`,
          });
        }
      }
    }

  };

  const saveEditedCourt = async () => {
    if (!editingCourt) return;
    const oldTitle = courts.find((item) => item.id === editingCourt.id)
    // แสดง SweetAlert2 สำหรับการยืนยันการแก้ไข
    const result = await Swal.fire({
      title: 'Confirmation',
      text: `ต้องการเปลี่ยนหัวข้อจาก ${oldTitle?.title} เป็น ${editingCourt.title}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      const response = await fetch(`/api/admin/practice-court/setting/courts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCourt),
      });

      if (response.ok) {
        // อัปเดตข้อมูล court ใน state
        const updatedCourts = courts.map((court) =>
          court.id === editingCourt.id ? editingCourt : court
        );
        setCourts(updatedCourts);
        setEditingCourt(null);

        // แสดง SweetAlert2 ในกรณีแก้ไขสำเร็จ
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'บันทึกการแก้ไขเรียบร้อยแล้ว',
        });
      }
    }
  };


  const editCourt = (court: { id: number; title: string; status: number }) => {
    setEditingCourt(court);
  };

  const toggleStatus = async (court: { id: number; title: string; status: number }) => {
    // สลับสถานะเป็นตรงกันข้าม
    const newStatus = court.status === 1 ? 0 : 1;

    const response = await fetch(`/api/admin/practice-court/setting/courts`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: court.id, title: court.title, status: newStatus }),
    });

    if (response.ok) {
      fetchCourts();
    }
  };

  return (
    <>
      <Head>
        <title>Courts setting</title>
      </Head>
      <div className="container mt-5">
        <h1>ชื่อหัวข้อ</h1>

        <table className="table table-bordered table-striped  table-sm">
          <thead className='table-primary'>
            <tr>
              <th>#</th>
              <th>Column name</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>

            </tr>
          </thead>
          <tbody>
            {courts.map((court, index) => (
              <tr key={court.id}>
                <td>{index + 1}</td>
                <td>
                  {editingCourt && editingCourt.id === court.id ? (
                    <input
                      type="text"
                      value={editingCourt.title}
                      onChange={(e) =>
                        setEditingCourt({
                          ...editingCourt,
                          title: e.target.value,
                        })
                      }
                    />
                  ) : (
                    court.title
                  )}
                </td>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`statusSwitch-${court.id}`}
                      checked={court.status === 1}
                      onChange={() => toggleStatus(court)}
                    />
                    <label className="form-check-label" htmlFor={`statusSwitch-${court.id}`}>
                      {court.status === 1 ? 'On' : 'Off'}
                    </label>
                  </div>
                </td>
                <td>
                  {editingCourt && editingCourt.id === court.id ? (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={saveEditedCourt}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => setEditingCourt(null)}
                      >

                        ยกเลิก
                      </button>
                    </>

                  ) : (
                    <>
                      <button
                        className="btn btn-warning mr-2"
                        onClick={() => editCourt(court)}
                      >
                        Edit
                      </button>

                    </>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteCourt(court.id, court.title)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">เพิ่มคอร์ท</span>
          <input
            type="text"
            className="form-control "
            placeholder="หัวข้อคอร์ท เช่น Court 1"
            value={newCourtTitle}
            onChange={(e) => setNewCourtTitle(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addCourt}>
            ยืนยัน
          </button>
        </div>
        <p className='text-danger'>**ไม่แนะนำให้ลบคอร์ท แต่แนะนำให้ ปิด/เปิดสถานะ หรือ แก้ไขชื่อคอร์ท เมื่อต้องการเปลี่ยนแปลงแทนการเพิ่ม เนื่องจากหากมีคนจองคอร์ทนั้นที่เราลบ ทุกรายการจะไม่ขึ้นชื่อคอร์ท **</p>
      </div>
    </>
  );
};

export default Home;
