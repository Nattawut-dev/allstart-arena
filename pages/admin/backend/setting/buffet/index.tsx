import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from 'react-bootstrap';

// กำหนดชนิดข้อมูลสำหรับข้อมูล BuffetSetting
type BuffetSetting = {
    id: number;
    court_price: number;
    shuttle_cock_price: number;
};
export const getServerSideProps = async ({ req }: any) => {
    const sessiontoken = req.cookies.sessionToken;

    if (!sessiontoken) {
        return {
            redirect: {
                destination: '/admin/login',
                permanent: false,
            },
        };
    } else {
        return {
            props: {
            },
        };
    }
}
function BuffetSetting() {
    const [buffetSettings, setBuffetSettings] = useState<BuffetSetting | null>(null);
    const [editBuffetSetting, setEditBuffetSetting] = useState<BuffetSetting | null>(null);
    const [message, setMessage] = useState<string>('');
    const [editing, setEditing] = useState(false); // ระบุสถานะการแก้ไข

    const getBuffetSettings = async () => {
        try {
            const response = await fetch('/api/admin/buffet_setting', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                setBuffetSettings(data[0]);
            } else {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูล buffet_setting');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเรียก API', error);
        }
    };

    const updateBuffetSetting = async (id: number, updatedData: BuffetSetting) => {
        try {
            const response = await fetch(`/api/admin/buffet_setting`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    court_price: updatedData.court_price,
                    shuttle_cock_price: updatedData.shuttle_cock_price
                }),
            });
            console.log(response.status)
            if (response.status === 200) {
                getBuffetSettings();
                setEditBuffetSetting(null);
                setEditing(false);
            } else {
                console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล buffet_setting');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเรียก API', error);
        }
    };

    useEffect(() => {
        getBuffetSettings();
    }, []);

    return (
        <AdminLayout>
            <div className='container mt-5 '>
                <div className='d-flex justify-content-center'>
                    <h4 className='fw-bold'>ตั้งค่าตีบุฟเฟ่ต์</h4>
                </div>
                <table className='table table-bordered table-striped  table-sm text-center' >
                    <thead className='table-primary'>
                        <tr>
                            <th>ค่าสนาม</th>
                            <th>ค่าลูก (ต่อลูก)</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody >
                        {buffetSettings && (
                            <tr >
                                <td>
                                    {editBuffetSetting && editing ? (
                                        <input
                                            type="number"
                                            className='text-center'
                                            value={editBuffetSetting.court_price}
                                            onChange={(e) =>
                                                setEditBuffetSetting({
                                                    ...editBuffetSetting,
                                                    court_price: +e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        buffetSettings.court_price
                                    )}
                                </td>
                                <td>
                                    {editBuffetSetting && editing ? (
                                        <input
                                            type="number"
                                            className='text-center '

                                            value={editBuffetSetting.shuttle_cock_price}
                                            onChange={(e) =>
                                                setEditBuffetSetting({
                                                    ...editBuffetSetting,
                                                    shuttle_cock_price: +e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        buffetSettings.shuttle_cock_price 
                                    )}
                                </td>
                                <td>
                                    {editBuffetSetting && editing ? (
                                        <div>
                                            <Button
                                            className='btn btn-success mx-2 btn-sm'
                                                onClick={() => {
                                                    updateBuffetSetting(buffetSettings.id, editBuffetSetting);
                                                }}
                                            >
                                                บันทึก
                                            </Button>
                                            <Button
                                            className='btn btn-danger btn-sm'
                                                onClick={() => {
                                                    setEditing(false);
                                                }}
                                            >
                                                ยกเลิก
                                            </Button>
                                        </div>


                                    ) : (
                                        <Button 
                                        className='btn btn-warning btn-sm'
                                        onClick={() => {
                                            setEditBuffetSetting(buffetSettings);
                                            setEditing(true); // เปิดโหมดแก้ไขเมื่อคลิกแก้ไข
                                        }}>
                                            แก้ไข
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export default BuffetSetting;
