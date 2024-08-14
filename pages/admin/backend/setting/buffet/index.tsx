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
    const [buffetStudentSettings, setBuffetStudentSettings] = useState<BuffetSetting | null>(null);
    const [buffetUniversitySettings, setBuffetUniversitySettings] = useState<BuffetSetting | null>(null);
    const [buffetSettingsNewbie, setBuffetSettingsNewbie] = useState<BuffetSetting | null>(null);
    const [buffetStudentSettingsNewbie, setBuffetStudentSettingsNewbie] = useState<BuffetSetting | null>(null);
    const [buffetUniversitySettingsNewbie, setBuffetUniversitySettingsNewbie] = useState<BuffetSetting | null>(null);
    const [editBuffetSetting, setEditBuffetSetting] = useState<BuffetSetting | null>(null);
    const [editBuffetStudentSetting, setEditBuffetStudentSetting] = useState<BuffetSetting | null>(null);
    const [editBuffetUniversitySetting, setEditBuffetUniversitySetting] = useState<BuffetSetting | null>(null);
    const [editBuffetSettingNewbie, setEditBuffetSettingNewbie] = useState<BuffetSetting | null>(null);
    const [editBuffetStudentSettingNewbie, setEditBuffetStudentSettingNewbie] = useState<BuffetSetting | null>(null);
    const [editBuffetUniversitySettingNewbie, setEditBuffetUniversitySettingNewbie] = useState<BuffetSetting | null>(null);
    const [editing, setEditing] = useState(false);
    const [editingNewbie, setEditingNewbie] = useState(false);

    const getBuffetSettings = async () => {
        try {
            const response = await fetch('/api/admin/buffet_setting', { method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                setBuffetSettings(data[0]);
                setBuffetStudentSettings(data[1]);
                setBuffetUniversitySettings(data[2]);
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
                setBuffetStudentSettingsNewbie(data[1]);
                setBuffetUniversitySettingsNewbie(data[2]);
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
                setEditBuffetStudentSetting(null);
                setEditBuffetUniversitySetting(null);
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
                setEditBuffetStudentSettingNewbie(null);
                setEditBuffetUniversitySettingNewbie(null);
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

    const renderTableRows = (
        settings: BuffetSetting | null,
        editSettings: BuffetSetting | null,
        editing: boolean,
        setEditSettings: React.Dispatch<React.SetStateAction<BuffetSetting | null>>,
        updateSettings: (id: number, updatedData: BuffetSetting) => void,
        type: string
    ) => (
        <>
            {settings && (
                <tr>
                    <td>{type}</td>
                    <td>
                        {editSettings && editing ? (
                            <input
                                type="number"
                                className="text-center"
                                value={editSettings.court_price}
                                onChange={(e) =>
                                    setEditSettings({
                                        ...editSettings,
                                        court_price: +e.target.value,
                                    })
                                }
                            />
                        ) : (
                            settings.court_price
                        )}
                    </td>
                    <td>
                        {editSettings && editing ? (
                            <input
                                type="number"
                                className="text-center"
                                value={editSettings.shuttle_cock_price}
                                onChange={(e) =>
                                    setEditSettings({
                                        ...editSettings,
                                        shuttle_cock_price: +e.target.value,
                                    })
                                }
                            />
                        ) : (
                            settings.shuttle_cock_price
                        )}
                    </td>
                    <td>
                        {editSettings && editing ? (
                            <div>
                                <Button
                                    className="btn btn-success mx-2 btn-sm"
                                    onClick={() => {
                                        updateSettings(settings.id, editSettings);
                                    }}
                                >
                                    บันทึก
                                </Button>
                                <Button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => {
                                        setEditSettings(null);
                                        setEditing(false);
                                    }}
                                >
                                    ยกเลิก
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="btn btn-warning btn-sm"
                                onClick={() => {
                                    setEditSettings(settings);
                                    setEditing(true);
                                }}
                            >
                                แก้ไข
                            </Button>
                        )}
                    </td>
                </tr>
            )}
        </>
    );
    
    return (
        <>
            <Head>
                <title>Price buffet setting</title>
            </Head>
            <div className="container mt-5">
                <div className="d-flex justify-content-center mt-5">
                    <h4 className="fw-bold">ตั้งค่าตีบุฟเฟ่ต์</h4>
                </div>
                <table className="table table-bordered table-striped table-sm text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>ประเภท</th>
                            <th>ค่าสนาม</th>
                            <th>ค่าลูก (ต่อลูก)</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableRows(buffetSettings, editBuffetSetting, editing, setEditBuffetSetting, updateBuffetSetting, "บุคคลทั่วไป")}
                        {renderTableRows(buffetStudentSettings, editBuffetStudentSetting, editing, setEditBuffetStudentSetting, updateBuffetSetting, "นักเรียน")}
                        {renderTableRows(buffetUniversitySettings, editBuffetUniversitySetting, editing, setEditBuffetUniversitySetting, updateBuffetSetting, "มหาวิทยาลัย")}
                    </tbody>
                </table>

                <div className="d-flex justify-content-center mt-5">
                    <h4 className="fw-bold">ตั้งค่าตีบุฟเฟ่ต์ (มือใหม่)</h4>
                </div>
                <table className="table table-bordered table-striped table-sm text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>ประเภท</th>
                            <th>ค่าสนาม</th>
                            <th>ค่าลูก (ต่อลูก)</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableRows(buffetSettingsNewbie, editBuffetSettingNewbie, editing, setEditBuffetSettingNewbie, updateBuffetSettingNewbie, "บุคคลทั่วไป")}
                        {renderTableRows(buffetStudentSettingsNewbie, editBuffetStudentSettingNewbie, editing, setEditBuffetStudentSettingNewbie, updateBuffetSettingNewbie, "นักเรียน")}
                        {renderTableRows(buffetUniversitySettingsNewbie, editBuffetUniversitySettingNewbie, editing, setEditBuffetUniversitySettingNewbie, updateBuffetSettingNewbie, "มหาวิทยาลัย")}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default BuffetSetting;
