import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/admin/backend.module.css';
import NotFoundPage from '@/pages/404';
import Swal from 'sweetalert2'
import Head from 'next/head';

interface Rules {
    id: number;
    title: string;
    content: string;
    tel: string;
    line_id: string;
    facebook_title: string;
    facebook_url: string;
}



export default function Welcome() {
    const [rules, setRules] = useState<Rules[]>([]);
    const [editableTitle, setEditableTitle] = useState(false);
    const [editableContent, setEditableContent] = useState(false);
    const [btn, setBtn] = useState(true);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('')

    const [editableLineId, setEditableLineId] = useState(false);
    const [lineId, setLineId] = useState('');
    const [editableTel, setEditableTel] = useState(false);
    const [tel, setTel] = useState('');
    const [editableFacebookTitle, setEditableFacebookTitle] = useState(false);
    const [facebookTitle, setFacebookTitle] = useState('');
    const [editableFacebookUrl, setEditableFacebookUrl] = useState(false);
    const [facebookUrl, setFacebookUrl] = useState('');
    useEffect(() => {
        const rules = async () => {
            try {
                const response = await fetch(`/api/rules`);
                const rulesdata = await response.json();
                setRules(rulesdata)
                setTitle(rulesdata[0].title)
                setContent(rulesdata[0].content)
                setLineId(rulesdata[0].line_id)
                setTel(rulesdata[0].tel)
                setFacebookTitle(rulesdata[0].facebook_title)
                setFacebookUrl(rulesdata[0].facebook_url)
            } catch {
                return (
                    <NotFoundPage />
                )
            }
        }
        rules();
    }, []);
    ;



    const handleTitleClick = () => {
        setEditableTitle(true);
    };

    const handleContentClick = () => {
        setEditableContent(true);
    };

    const handleLineIdClick = () => {
        setEditableLineId(true);
    };

    const handleTelClick = () => {
        setEditableTel(true);
    };

    const handleFacebookTitleClick = () => {
        setEditableFacebookTitle(true);
    };

    const handleFacebookUrlClick = () => {
        setEditableFacebookUrl(true);
    };
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        if (event.target.value != rules[0].title) {
            setBtn(false)
        } else {
            setBtn(true)
        }

    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
        if (event.target.value != rules[0].content) {
            setBtn(false)
        } else {
            setBtn(true)
        }
    };
    const handleLineIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLineId(event.target.value);
        if (event.target.value != rules[0].line_id) {
            setBtn(false)
        } else {
            setBtn(true)
        }
    };

    const handleTelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTel(event.target.value);
        if (event.target.value != rules[0].tel) {
            setBtn(false)
        } else {
            setBtn(true)
        }
    };

    const handleFacebookTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFacebookTitle(event.target.value);
        if (event.target.value != rules[0].facebook_title) {
            setBtn(false)
        } else {
            setBtn(true)
        }
    };

    const handleFacebookUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFacebookUrl(event.target.value);
        if (event.target.value != rules[0].facebook_url) {
            setBtn(false)
        }
        else {
            setBtn(true)
        }
    };
    const editRules = async () => {
        Swal.fire({
            title: 'ยืนยันการแก้ไข ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ตกลง'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Send POST request to the API to update the title and content
                    const response = await fetch(`/api/admin/editRules`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: rules[0].id, // Assuming you have an 'id' property in the rules object
                            title: title,
                            content: content,
                            line_id: lineId,
                            tel: tel,
                            facebook_title: facebookTitle,
                            facebook_url: facebookUrl,
                        }),
                    });

                    if (response.ok) {
                        // Handle success, e.g., show a success message or update the rules state
                        Swal.fire({
                            icon: 'success',
                            title: 'บันทึกการแก้ไขแล้ว',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            window.location.reload();
                        })
                    } else {
                        // Handle errors, e.g., show an error message
                        Swal.fire({
                            icon: 'error',
                            title: 'มบางอย่างผิดพลาด',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                } catch (error) {
                    // Handle errors, e.g., show an error message
                    console.error('Error occurred:', error);
                }
            }
        })

    }

    return (
        <>
            <Head>
                <title>Rules setting</title>
            </Head>
            <div className={styles.Container}>
                <h3>ตั้งค่ากฎ/ข้อมูลติดต่อ</h3>

                <div className={styles.container}>
                    <h3 className={styles.heading} onClick={handleTitleClick}>
                        {editableTitle ? (
                            <input
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                onBlur={() => setEditableTitle(false)}
                                autoFocus
                            />
                        ) : (
                            title
                        )}
                    </h3>
                    <p className={styles.content} onClick={handleContentClick}>
                        {editableContent ? (
                            <textarea
                                value={content}
                                onChange={handleContentChange}
                                onBlur={() => setEditableContent(false)}
                                autoFocus
                            />
                        ) : (
                            content
                        )}
                    </p>

                    <div className={styles.contect} >
                        <div className={styles.box}>
                            <p style={{ textAlign: 'center', marginBottom: '15px', fontWeight: 'bold', backgroundColor: "aliceblue" }}>ช่องทางการติดต่อ</p>
                            <p onClick={handleLineIdClick}>
                                {editableLineId ? (
                                    <input
                                        type="text"
                                        value={lineId}
                                        onChange={handleLineIdChange}
                                        onBlur={() => setEditableLineId(false)}
                                        autoFocus
                                    />
                                ) : (
                                    `ไอดีไลน์ : ${lineId}`
                                )}
                            </p>
                            <p onClick={handleTelClick}>
                                {editableTel ? (
                                    <input
                                        type="text"
                                        value={tel}
                                        onChange={handleTelChange}
                                        onBlur={() => setEditableTel(false)}
                                        autoFocus
                                    />
                                ) : (
                                    `โทร : ${tel}`
                                )}
                            </p>
                            <p onClick={handleFacebookTitleClick}>
                                {editableFacebookTitle ? (
                                    <input
                                        type="text"
                                        value={facebookTitle}
                                        onChange={handleFacebookTitleChange}
                                        onBlur={() => setEditableFacebookTitle(false)}
                                        autoFocus
                                    />
                                ) : (
                                    `Facebook : ${facebookTitle}`
                                )}
                            </p>

                        </div>
                    </div>
                    <div className={styles.wrapperBtn}>

                        <button className={styles.btn} disabled={btn} onClick={editRules}>บันทึกการแก้ไข</button>
                        <div>
                            <p style={{ fontWeight: "bold", backgroundColor: "white" }} > {"แก้ลิ้ง facebook >"}</p>
                            <p onClick={handleFacebookUrlClick}>
                                {editableFacebookUrl ? (
                                    <input
                                        type="text"
                                        value={facebookUrl}
                                        onChange={handleFacebookUrlChange}
                                        onBlur={() => setEditableFacebookUrl(false)}
                                        autoFocus
                                    />
                                ) : (
                                    facebookUrl
                                )}
                            </p></div>

                    </div>
                    <h6 style={{ color: "red" }}>*หมายเหตุ ตัวที่พื้นหลังสีไข่ สามารถแก้ไขได้ทั้งหมด **หากบันทึกการแก้ไขแล้วจะ ย้อนกลับไม่ได้</h6>

                </div>
            </div>
        </>
    );
}