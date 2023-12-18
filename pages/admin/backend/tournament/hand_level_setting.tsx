import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';


const Home = () => {
    const [Hand_Level, setHand_Level] = useState<{ id: number; name: string; }[]>([]);
    const [newHand_levelName, setNewHand_levelName] = useState('');
    const [editingHand_level, seteditingHand_level] = useState<{ id: number; name: string } | null>(null);


    const fetchHand_level = async () => {
        try {
            const response = await fetch('/api/admin/setting/hand_level');

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setHand_Level(data);
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
        fetchHand_level();
    }, []);

    const addCourt = async () => {
        if (newHand_levelName.trim() === '') return;

        // แสดง SweetAlert2 สำหรับการยืนยันการเพิ่ม
        const result = await Swal.fire({
            title: 'Confirmation',
            text: `ยืนยันการเพิ่มระดับมือใหม่? หัวข้อ "${newHand_levelName}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        });

        if (result.isConfirmed) {
            const response = await fetch('/api/admin/setting/hand_level', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newHand_levelName }),
            });

            if (response.ok) {
                fetchHand_level();
                setNewHand_levelName('');

                // แสดง SweetAlert2 ในกรณีเพิ่มสำเร็จ
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: `เพิ่มระดับมือ "${newHand_levelName}"เรียบร้อยแล้ว`,
                });
            }
        }
    };

    const deleteCourt = async (id: number, name: string) => {
        // แสดง SweetAlert2 สำหรับการยืนยันการลบ
        const result1 = await Swal.fire({
            title: `แน่ใจนะว่าจะลบ "${name}"?`,
            text: '**คำแนะนำ* หากยังมีงานแข่งที่เลือกระดับมือนี้ โปรดเอาออกให้หมดก่อน**',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        });
        if (result1.isConfirmed) {
            const result2 = await Swal.fire({
                title: `ถามอีกครั้งว่าจะลบ "${name}" จริงๆเหรอ`,
                text: '**คำแนะนำ* หากยังมีงานแข่งที่เลือกระดับมือนี้ โปรดเอาออกให้หมดก่อน**',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
            });

            if (result2.isConfirmed) {
                const response = await fetch(`/api/admin/setting/hand_level?id=${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const updatedHand_Level = Hand_Level.filter((court) => court.id !== id);
                    setHand_Level(updatedHand_Level);

                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ',
                        text: `ลบ "${name}" เรียบร้อย!`,
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ลบไม่สำเร็จ',
                        text: `*คำแนะนำ* หากยังมีงานแข่งที่เลือกระดับมือนี้ โปรดเอาออกให้หมดก่อน`,
                    });
                }
            }
        }

    };

    const saveEditedCourt = async () => {
        if (!editingHand_level) return;
        const oldname = Hand_Level.find((item) => item.id === editingHand_level.id)
        // แสดง SweetAlert2 สำหรับการยืนยันการแก้ไข
        const result = await Swal.fire({
            title: 'Confirmation',
            text: `ต้องการเปลี่ยนหัวข้อจาก ${oldname?.name} เป็น ${editingHand_level.name}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        });

        if (result.isConfirmed) {
            const response = await fetch(`/api/admin/setting/hand_level`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingHand_level),
            });

            if (response.ok) {
                // อัปเดตข้อมูล court ใน state
                const updatedHand_Level = Hand_Level.map((court) =>
                    court.id === editingHand_level.id ? editingHand_level : court
                );
                setHand_Level(updatedHand_Level);
                seteditingHand_level(null);

                // แสดง SweetAlert2 ในกรณีแก้ไขสำเร็จ
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'บันทึกการแก้ไขเรียบร้อยแล้ว',
                });
            }
        }
    };


    const editCourt = (court: { id: number; name: string; }) => {
        seteditingHand_level(court);
    };



    return (
        <>
            <Head>
                <title>Hand level setting</title>
            </Head>
            <div className="container mt-5">
                <h1>ตารางระดับมือ</h1>

                <table className="table table-bordered table-striped  table-sm">
                    <thead className='table-primary'>
                        <tr>
                            <th>#</th>
                            <th> name</th>
                            <th>Edit</th>
                            <th>Delete</th>

                        </tr>
                    </thead>
                    <tbody>
                        {Hand_Level.map((court, index) => (
                            <tr key={court.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {editingHand_level && editingHand_level.id === court.id ? (
                                        <input
                                            type="text"
                                            value={editingHand_level.name}
                                            onChange={(e) =>
                                                seteditingHand_level({
                                                    ...editingHand_level,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        court.name
                                    )}
                                </td>

                                <td>
                                    {editingHand_level && editingHand_level.id === court.id ? (
                                        <>
                                            <button
                                                className="btn btn-success"
                                                onClick={saveEditedCourt}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => seteditingHand_level(null)}
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
                                        onClick={() => deleteCourt(court.id, court.name)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">เพิ่มระดับมือ</span>
                    <input
                        type="text"
                        className="form-control "
                        placeholder="ชื่อระดับมือเช่น N"
                        value={newHand_levelName}
                        onChange={(e) => setNewHand_levelName(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={addCourt}>
                        ยืนยัน
                    </button>
                </div>
                <p className='text-danger'>****</p>
            </div>
        </>
    );
};

export default Home;
