import { useState, useEffect } from 'react';
import styles from '@/styles/detailTornament.module.css';
import { GetServerSideProps } from 'next';
import { Button, Modal } from 'react-bootstrap';
import Image from 'next/image'
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
interface Detail {
    id: number;
    listT_id: number
    team_name: string;
    Name_1: string;
    Nickname_1: string;
    age_1: number;
    gender_1: string;
    affiliation_1: string;
    image_1: string;
    Name_2: string;
    Nickname_2: string;
    age_2: number;
    gender_2: string;
    affiliation_2: string;
    image_2: string;
    level: string;
    status: number;
    paymentStatus: number;
}
interface Listtournament {
    id: number;
    title: string;
    ordinal: number;
    location: string;
    timebetween: string;
    max_team: number;
    status: number;
}
interface Props {
    listtournament: Listtournament[];
    detail: Detail[];
}
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const List = await fetch(`${process.env.HOSTNAME}/api/tournament/listtournament`);
    const Listdata = await List.json();
    const response = await fetch(`${process.env.HOSTNAME}/api/tournament/detailTournament?listT_id=${Listdata.results[0].id}`);
    const data = await response.json();
    return {
        props: {
            listtournament: Listdata.results,
            detail: data.detail
        },
    };
};

const DetailPage = ({ listtournament, detail }: Props) => {
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClose = () => setShow(false);
    const handleClose2 = () => { setShow2(false); setShow(true) };

    const [detail_data, setDetail_data] = useState<Detail>();


    const router = useRouter();
    const { id } = router.query;
    const parsedId = parseInt(id as string);
    const [level, setLevel] = useState('');

    // const fetchData2 = async () => {
    //     try {
    //         const response = await fetch(`/api/tournament/listtournament`);
    //         const data = await response.json();
    //         setListtournament(data.results);

    //     } catch (error) {
    //         console.error('Failed to fetch data:', error);
    //         setListtournament([]);
    //     }
    // };
    
    useEffect(() => {

        if (parsedId < 0 || parsedId > 3) {
            router.push('/booking');
            return;
        } else {
            if (parsedId === 0) {
                setLevel('N');
            } else if (parsedId === 1) {
                setLevel('S');
            } else if (parsedId === 2) {
                setLevel('P-/P');
            } else if (parsedId === 3) {
                setLevel('P+/C');
            }
            // fetchData2();
        }
    }, [parsedId]);


    const details = (id: number) => {
        const findData = detail.find((d) => d.id === id);
        if (findData) {
            setDetail_data(findData)
            setShow(true)
        }
    }
    const Payment = () => {
        setShow(false);
        setShow2(true);
    }

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);

            // Preview the selected image
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleUpload = async (id: any) => {
        if (selectedFile) {
            setLoading(true);

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('id', id);


            const res = await fetch('/api/uploadslip', {
                method: 'POST',
                body: formData,
            })
            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                    text: 'รอเจ้าหน้ที่ตรวจสอบ',
                    showConfirmButton: false,
                    timer: 1500
                })
                setSelectedFile(null)
                setLoading(false)
                setShow(false)
                setShow2(false)
            }


        }
    }



    const note = async (id: number, listTournament_id: number) => {
        const findData2 = detail.find((d) => d.id === id);

        if (findData2) {

            Swal.fire({
                title: `ประท้วงทีม ${findData2.team_name}`,
                input: 'textarea',
                inputPlaceholder: 'เหตุผลที่ต้องการประท้วง',
                inputAttributes: {
                    autocapitalize: 'off'

                },
                showCancelButton: true,
                confirmButtonText: 'ประท้วง',
                showLoaderOnConfirm: true,
                preConfirm: async (text) => {
                    if (text === '') {
                        Swal.fire({
                            icon: 'error',
                            title: 'ท่านไม่ได้กรอกอะไร',
                            text: 'ไม่มีการประท้วง',
                        })
                    }
                    else {
                        Swal.fire({
                            title: `ต้องการประท้วงทีม ${findData2.team_name} ?`,
                            icon: 'warning',
                            text: `ด้วยเหตุผล  ${text}`,
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'ยืนยัน'
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                try {
                                    const response = await fetch('/api/tournament/protest', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            id: findData2.id,
                                            postnote: text,
                                            listTournament_id: listTournament_id,
                                        })
                                    });

                                    if (response.ok) {
                                        Swal.fire(
                                            'ประท้วง!',
                                            'บันทึกข้อมูลเรียบร้อย',
                                            'success'
                                        )
                                    }
                                } catch (error) {
                                    Swal.showValidationMessage(`Request failed: ${error}`);
                                }

                            }
                        })
                    }

                },
                allowOutsideClick: () => !Swal.isLoading()
            });
        }
    };






    if (listtournament[0].status === 0) {
        return (
            <div className={styles.notnow}>
                <div className={styles.notnowBox}>
                    <h1>ยังไม่มีการจัดการแข่งขัน</h1>
                    <p>ขณะนี้ยังไม่มีการจัดการแข่งขัน เช็คอัพเดทการแข่งขันได้ที่เพจ</p>
                </div>
            </div>
        );
    }
    else {
        return (
            <>
                <div className={styles.header}>
                    {listtournament.length >= 1 && (
                        <div>
                            <h6>รายการแข่งแบดมินตัน <span>{listtournament[0].title}</span> ครั้งที่ <span> {listtournament[0].ordinal}</span></h6>
                            <h6>ณ สถานที่ <span> {listtournament[0].location}</span></h6>
                            <h6>ระหว่างวันที่ <span>{listtournament[0].timebetween}</span></h6>
                            <h6>ระดับมือ <span style={{ fontWeight: 'bolder' }}>{level}</span> </h6>
                        </div>
                    )
                    }
                </div>
                <div className={styles.container}>
                    <table className={`table table-bordered table-striped  ${styles.table}`}>
                        <thead className='table-info'>
                            <tr>
                                <th>#</th>
                                <th>ชื่อทีม</th>
                                <th>ชื่อนักกีฬา 1</th>

                                {/* <th>ภาพชื่อนักกีฬา 1</th> */}
                                <th>ชื่อนักกีฬา 2</th>

                                {/* <th>ภาพชื่อนักกีฬา 2</th> */}
                                <th>ผลการพิจารณา</th>

                                <th>สถานะการชำระ</th>
                                <th>รายละเอียด</th>

                                <th>ประท้วง</th>

                                <th>หมายเหตุ</th>

                            </tr>
                        </thead>
                        <tbody>

                            {detail

                                .filter(item => item.level === level)
                                .map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.team_name}</td>
                                        <td>{item.Name_1} ({item.Nickname_1})</td>
                                        <td>{item.Name_2}  ({item.Nickname_2})</td>

                                        {item.status === 0 && (
                                            <td className="table-warning">ระหว่างพิจารณา</td>
                                        )}
                                        {item.status === 2 && <td className="table-success">ผ่าน</td>}
                                        {item.status === 1 && <td className="table-danger">ไม่ผ่าน</td>}


                                        {item.paymentStatus === 0 && <td className="table-danger">ยังไม่ชำระ</td>}
                                        {item.paymentStatus === 1 && <td className="table-warning">รอตรวจสอบ</td>}
                                        {item.paymentStatus === 2 && <td className="table-success">ชำระแล้ว</td>}
                                        <td>
                                            <Button variant="primary btn-sm" onClick={() => details(item.id)} className={styles.btn}>
                                                รายละเอียด
                                            </Button>
                                        </td>
                                        <td><Button variant="danger btn-sm" onClick={() => note(item.id, item.listT_id)} className={styles.btn}>
                                            ประท้วง
                                        </Button></td>
                                        <td className='fw-bold'>{listtournament[0].max_team > index ? <span className='text-success'>ทีมหลัก</span> : <span className='text-warning'>ทีมสำรอง</span>}</td>

                                    </tr>
                                ))}
                            {detail.filter(item => item.level === level).length === 0 &&
                                <tr>
                                    <td colSpan={9} >ยังไม่มีผู้สมัคร</td>
                                </tr>
                            }

                        </tbody>
                    </table>
                </div>

                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    aria-hidden="true"
                    aria-labelledby="exampleModalToggleLabel" tabindex="-1"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div className={styles.titleM}>
                                <h5>รายละเอียดทีม <span style={{ fontWeight: 'bolder' }}> {detail_data?.team_name}  </span>ระดับมือ {level}</h5>


                                {/* {detail_data?.status === 0 && (
                                    <h5 className='table-warning'>ระหว่างพิจารณา</h5>
                                )}
                                {detail_data?.status === 2 && (
                                    <h5 style={{color: 'green'}}>ผ่าน</h5>
                                )}
                                {detail_data?.status === 1 && (
                                    <h5 className='table-danger'>ไม่ผ่าน</h5>
                                )} */}
                            </div>

                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={styles.wrapper}>
                            <div className={styles.detail}>
                                <img src={detail_data?.image_1} alt="photo" width="200" height="250" />
                                <div> <span>ชื่อ {detail_data?.Name_1} ({detail_data?.Nickname_1})</span></div>
                                <div><span>อายุ {detail_data?.age_1} ปี  : เพศ {detail_data?.gender_1}</span></div>
                                <div> <span>สังกัด {detail_data?.affiliation_1}</span></div>
                            </div>
                            <div className={styles.detail}>
                                <img src={detail_data?.image_2} alt="photo" width="200" height="250" />
                                <div><span>ชื่อ {detail_data?.Name_2} ({detail_data?.Nickname_2})</span></div>
                                <div><span>อายุ {detail_data?.age_2} ปี  : เพศ {detail_data?.gender_2}</span></div>
                                <div><span>สังกัด {detail_data?.affiliation_2}</span></div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer className={styles.wrapper2}>
                        <div className={styles.wrapper2}>
                            <div >
                                {detail_data?.status === 0 && (
                                    <h5>ผลการพิจารณา : <span style={{ color: 'orange' }}>ระหว่างพิจารณา</span>  </h5>
                                )}
                                {detail_data?.status === 2 && (
                                    <h5>ผลการพิจารณา :  <span style={{ color: 'green' }}>ผ่าน</span> </h5>
                                )}
                                {detail_data?.status === 1 && (
                                    <h5>ผลการพิจารณา :  <span style={{ color: 'red' }}>ไม่ผ่าน</span></h5>
                                )}
                            </div>
                            {detail_data?.status === 0 && (
                                <Button variant="primary" disabled={true} onClick={() => Payment()}>ระหว่างพิจารณา</Button>
                            )}
                            {detail_data?.status === 1 && (
                                <Button variant="primary" disabled={true} onClick={() => Payment()}>ไม่ผ่านการพิจารณา</Button>
                            )}
                            {detail_data?.status === 2 && detail_data?.paymentStatus !== 1 && (
                                <Button variant="primary" disabled={false} onClick={() => Payment()}>ชำระเงิน</Button>
                            )}
                            {detail_data?.paymentStatus === 1 && (
                                <Button variant="primary" disabled={true} onClick={() => Payment()}>กำลังตรวจสอบการชำระ</Button>
                            )
                            }



                        </div>

                    </Modal.Footer>
                </Modal>
                <Modal
                    show={show2}
                    onHide={handleClose2}
                    backdrop="static"
                    keyboard={false}
                    aria-hidden="true"
                    aria-labelledby="exampleModalToggleLabel" tabindex="-1"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div className={styles.titleM}>
                                <h5>การชำระเงิน <span style={{ fontWeight: 'bolder' }}> {detail_data?.team_name}  </span>ระดับมือ {level}</h5>

                            </div>

                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className={styles.status}>
                            {detail_data?.status === 0 && (
                                <h5>ผลการพิจารณา : <span style={{ color: 'orange' }}>ระหว่างพิจารณา</span> </h5>
                            )}
                            {detail_data?.status === 2 && (
                                <h5>ผลการพิจารณา :  <span style={{ color: 'green' }}>ผ่าน</span> </h5>
                            )}
                            {detail_data?.status === 1 && (
                                <h5>ผลการพิจารณา :  <span style={{ color: 'red' }}>ไม่ผ่าน</span></h5>
                            )}
                        </div>
                        <div className={styles.wrapper}>
                            <div className={styles.detail}>
                                <div>QR code สำหรับชำระเงิน</div>
                                <img src={'/QR1.jpg'} alt="photo" width="200" height="250" />

                            </div>
                            <div className={styles.detail}>
                                <div>ภาพสลิป</div>
                                {previewImage && <Image src={previewImage ? previewImage : ''} alt="Qrcode" width="200" height="250" />}
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer className={styles.wrapper3}>
                        <div className={styles.wrapper3}>
                            <Button variant="dark" disabled={detail_data?.status === 2 ? false : true} onClick={handleClose2}>ย้อนกลับ</Button>
                            <div>
                                <label htmlFor="file-input" className={styles.file_input}>
                                    เลือกภาพ
                                </label>
                                <input
                                    style={{ display: 'none' }}
                                    id="file-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="file-input"
                                />
                                <button
                                    onClick={() => handleUpload(detail_data?.id)}
                                    disabled={!selectedFile || loading}
                                    className={`${styles.slip} ${selectedFile ? '' : styles.disabled} `}
                                    style={{ backgroundColor: loading ? 'red' : '' }}
                                >
                                    {loading ? 'กำลังอัพโหลด...' : 'อัพโหลดสลิป'}
                                </button></div>

                        </div>

                    </Modal.Footer>
                </Modal>
            </>
        );
    }

};


// const Detail = () => {
//     const [detail, setDetail] = useState<Detail[]>([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(`/api/tournament/detailTournament`);
//                 const data = await response.json();
//                 setDetail(data.detail);
//             } catch (error) {
//                 console.error('Failed to fetch data:', error);
//                 setDetail([]);
//             }
//         };

//         fetchData();
//     }, []);

//     return <DetailPage detail={detail} />;
// };

export default DetailPage;
