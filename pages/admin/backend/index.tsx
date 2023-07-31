import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import styles from '@/styles/admin/backend.module.css';
import { GetStaticProps } from 'next';
import NotFoundPage from '@/pages/404';


interface Rules {
    id: number;
    title: string;
    content: string;
}




export default function Welcome() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [rules, setRules] = useState<Rules[]>([]);
    const [editableTitle, setEditableTitle] = useState(false);
    const [editableContent, setEditableContent] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('')

    useEffect(() => {
        // Fetch data from the server to check if the user is authenticated
        // You can use this endpoint to verify the session and perform any other checks
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
        const rules = async () => {
            try {
                const response = await fetch(`/api/rules`);
                const rulesdata = await response.json();
                setRules(rulesdata)
                setTitle(rulesdata[0].title)
                setContent(rulesdata[0].content)
            } catch {
                return (
                    <NotFoundPage />
                )
            }

        }
        rules();
        checkAuthentication();
    }, []);
    ;


    if (rules.length === 0) {
        return (
            <>
                <div style={{ top: "50%", left: "50%", position: "absolute", transform: "translate(-50%,-50%)" }}>
                    <h5 >loading....</h5>
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



    const handleTitleClick = () => {
        setEditableTitle(true);
    };

    const handleContentClick = () => {
        setEditableContent(true);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };
    return (
        <AdminLayout>

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

                            <p style={{ textAlign: "center", marginBottom: "15px", fontWeight: "bold" }}>ช่องทางการติดต่อ</p>
                            <p>ไอดีไลน์ : {"Sdf"}</p>
                            <p >โทร : {"0981290683"}</p>
                            <p >Facebook : <a href="">{"สนามแบดมินตัน"}</a></p>
                        </div>
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
}