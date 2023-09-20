import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AdminLayout from '@/components/AdminLayout';

const MySwal = withReactContent(Swal);

const Home = () => {
  const [courts, setCourts] = useState<{ id: number; title: string; status: number }[]>([]);
  const [newCourtTitle, setNewCourtTitle] = useState('');
  const [editingCourt, setEditingCourt] = useState<{ id: number; title: string; status: number } | null>(null);

  const [message, setMessage] = useState('');
  const router = useRouter();

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/admin/check-auth', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        // Redirect to the login page if the user is not authenticated
        router.push('/admin/login')
        return;
      }

    } catch (error) {
      console.error('Error while checking authentication', error);
      setMessage('An error occurred. Please try again later.');
    }
  };


  const fetchCourts = async () => {
    try {
      const response = await fetch('/api/admin/setting/courts');

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setCourts(data);
    } catch (error) {
      // แสดง SweetAlert2 ในกรณีเกิดข้อผิดพลาด
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch data. Please try again later.',
      });
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchCourts();
    checkAuthentication();
  }, []);

  const addCourt = async () => {
    if (newCourtTitle.trim() === '') return;

    // แสดง SweetAlert2 สำหรับการยืนยันการเพิ่ม
    const result = await MySwal.fire({
      title: 'Confirmation',
      text: `ยืนยันการเพิ่มคอร์ทใหม่? หัวข้อ "${newCourtTitle}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      const response = await fetch('/api/admin/setting/courts', {
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
        MySwal.fire({
          icon: 'success',
          title: 'Success',
          text: `เพิ่มคอร์ท "${newCourtTitle}"เรียบร้อยแล้ว`,
        });
      }
    }
  };

  const deleteCourt = async (id: number, title: string) => {
    // แสดง SweetAlert2 สำหรับการยืนยันการลบ
    const result1 = await MySwal.fire({
      title: `แน่ใจนะว่าจะลบ "${title}"?`,
      text: '**หากลบแล้วรายชื่อที่เคยจองคอร์ทนี้จะไม่ขึ้นชื่อคอร์ท**',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (result1.isConfirmed) {
      const result2 = await MySwal.fire({
        title: `ถามอีกครั้งว่าจะลบ "${title}" จริงๆเหรอ`,
        text: '**หากลบแล้วรายชื่อที่เคยจองคอร์ทนี้จะไม่ขึ้นชื่อคอร์ทนะ กู้ไม่ได้ด้วยแหละ**',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });

      if (result2.isConfirmed) {
        const response = await fetch(`/api/admin/setting/courts?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedCourts = courts.filter((court) => court.id !== id);
          setCourts(updatedCourts);

          // แสดง SweetAlert2 ในกรณีลบสำเร็จ
          MySwal.fire({
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
    const result = await MySwal.fire({
      title: 'Confirmation',
      text: `ต้องการเปลี่ยนหัวข้อจาก ${oldTitle?.title} เป็น ${editingCourt.title}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      const response = await fetch(`/api/admin/setting/courts`, {
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
        MySwal.fire({
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

    const response = await fetch(`/api/admin/setting/courts`, {
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


  if (message === 'Not authenticated') {
    return (
      <>
        <div style={{ top: "50%", left: "50%", position: "absolute", transform: "translate(-50%,-50%)" }}>
          <h5 >Token หมดอายุ กรุณาล็อคอินใหม่</h5>
        </div>
      </>
    );
  }
  if (message != "Authenticated") {
    return (
      <>
        <div style={{ top: "50%", left: "50%", position: "absolute", transform: "translate(-50%,-50%)" }}>
          <h5 >loading....</h5>
        </div>
      </>
    );
  }
  return (
    <AdminLayout>
      <div className="container mt-5">
        <h1>Court List</h1>

        <table className="table table-bordered table-striped  table-sm">
          <thead className='table-primary'>
            <tr>
              <th>#</th>
              <th>Court Title</th>
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
    </AdminLayout>
  );
};

export default Home;
