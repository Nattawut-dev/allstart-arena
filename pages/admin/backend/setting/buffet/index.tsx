import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

type BuffetSetting = {
    id: number;
    court_price: number;
    shuttle_cock_price: number;
};

function BuffetSetting() {
    const [buffetSettings, setBuffetSettings] = useState<BuffetSetting | null>(null);
    const [buffetSettingsNewbie, setBuffetSettingsNewbie] = useState<BuffetSetting | null>(null);
    const [editBuffetSetting, setEditBuffetSetting] = useState<BuffetSetting | null>(null);
    const [editBuffetSettingNewbie, setEditBuffetSettingNewbie] = useState<BuffetSetting | null>(null);
    const [editing, setEditing] = useState(false);
    const [editingNewbie, setEditingNewbie] = useState(false);

    const getBuffetSettings = async () => {
        try {
            const response = await fetch('/api/admin/buffet_setting', { method: 'GET' });
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

    const getBuffetSettingsNewbie = async () => {
        try {
            const response = await fetch('/api/admin/buffet_setting_newbie', { method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                setBuffetSettingsNewbie(data[0]);
            } else {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูล buffet_setting_newbie');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเรียก API', error);
        }
    };

    const updateBuffetSetting = async (id: number, updatedData: BuffetSetting) => {
        try {
            const response = await fetch(`/api/admin/buffet_setting`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
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

    const updateBuffetSettingNewbie = async (id: number, updatedData: BuffetSetting) => {
        try {
            const response = await fetch(`/api/admin/buffet_setting_newbie`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            if (response.status === 200) {
                getBuffetSettingsNewbie();
                setEditBuffetSettingNewbie(null);
                setEditingNewbie(false);
            } else {
                console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล buffet_setting_newbie');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเรียก API', error);
        }
    };

    useEffect(() => {
        getBuffetSettings();
        getBuffetSettingsNewbie();
    }, []);

    return (
        <>
            <Head>
                <title>Price buffet setting</title>
            </Head>
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
                                                setEditing(true);
                                            }}>
                                            แก้ไข
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className='d-flex justify-content-center mt-5'>
                    <h4 className='fw-bold'>ตั้งค่าตีบุฟเฟ่ต์ (มือใหม่)</h4>
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
                        {buffetSettingsNewbie && (
                            <tr >
                                <td>
                                    {editBuffetSettingNewbie && editingNewbie ? (
                                        <input
                                            type="number"
                                            className='text-center'
                                            value={editBuffetSettingNewbie.court_price}
                                            onChange={(e) =>
                                                setEditBuffetSettingNewbie({
                                                    ...editBuffetSettingNewbie,
                                                    court_price: +e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        buffetSettingsNewbie.court_price
                                    )}
                                </td>
                                <td>
                                    {editBuffetSettingNewbie && editingNewbie ? (
                                        <input
                                            type="number"
                                            className='text-center '
                                            value={editBuffetSettingNewbie.shuttle_cock_price}
                                            onChange={(e) =>
                                                setEditBuffetSettingNewbie({
                                                    ...editBuffetSettingNewbie,
                                                    shuttle_cock_price: +e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        buffetSettingsNewbie.shuttle_cock_price
                                    )}
                                </td>
                                <td>
                                    {editBuffetSettingNewbie && editingNewbie ? (
                                        <div>
                                            <Button
                                                className='btn btn-success mx-2 btn-sm'
                                                onClick={() => {
                                                    updateBuffetSettingNewbie(buffetSettingsNewbie.id, editBuffetSettingNewbie);
                                                }}
                                            >
                                                บันทึก
                                            </Button>
                                            <Button
                                                className='btn btn-danger btn-sm'
                                                onClick={() => {
                                                    setEditingNewbie(false);
                                                }}
                                            >
                                                ยกเลิก
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            className='btn btn-warning btn-sm'
                                            onClick={() => {
                                                setEditBuffetSettingNewbie(buffetSettingsNewbie);
                                                setEditingNewbie(true);
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
        </>
    );
}

export default BuffetSetting;
