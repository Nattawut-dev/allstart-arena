import React, { useState } from 'react'

import styles from '../../styles/Tournament.module.css'


function Tournament() {
    const [title, setTitle] = useState("");
    const [Name_1, setName_1] = useState("");
    const [Name_2, setName_2] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [tel, setTel] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (title && Name_1 && Name_2 && tel) {
            try {

                let response = await fetch("http://localhost:3000/api/addHandN", {
                    method: "POST",
                    body: JSON.stringify({
                        title,
                        Name_1,
                        Name_2,
                        tel
                    }),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                })

                response = await response.json();

                setTitle("");
                setName_1("");
                setName_2("");
                setTel("");
                setError("");
                setMessage("Post added successfully!");

            } catch(errorMessage: any) {
                setError(errorMessage);
            }
        } else {
            return setError("All fields are required!");
        }
    }

    return (

        <div>
            <h3 className={styles.header}> หน้า: สมัครเข้าร่วมการแข่งขัน    จาก: มือ N</h3>
            <div className={styles.content}>
                <h3 className={styles.h3}>ระดับมือ N</h3>
                <form onSubmit={handleSubmit} className='form'>
                    {error ? <div className='alert-error'>{error}</div> : null}
                    {message ? <div className='alert-message'>{message}</div> : null}
                    <div className="form-group">
                        <label htmlFor="title">ชื่อทีม</label>
                        <input
                            name='title'
                            type="text"
                            placeholder='ชื่อทีม'
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="content">ผู้เข้าแข่งขัน 1</label>
                        <input
                            name='Name1'
                            type="text"
                            placeholder=' ชื่อ-สกุล'
                            onChange={(e) => setName_1(e.target.value)}
                            value={Name_1}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="content">ชื่อผู้เข้าแข่งขัน 2</label>
                        <input
                            name='Name2'
                            type="text"
                            placeholder=' ชื่อ-สกุล'
                            onChange={(e) => setName_2(e.target.value)}
                            value={Name_2}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="content">เบอร์ติดต่อ</label>
                        <input
                            name='tel'
                            type="text"
                            placeholder=' เบอร์ติดต่อ'
                            onChange={(e) => setTel(e.target.value)}
                            value={tel}
                        />
                    </div>
                    <div className="form-group">
                        <button type='submit' className='submit_btn'>
                            ส่งข้อมูล
                        </button>
                    </div>
                </form>
            </div>

        </div>




    )
}

export default Tournament