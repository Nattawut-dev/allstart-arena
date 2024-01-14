import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from '@/styles/admin/tournament/Tournament.module.css';
import Swal from 'sweetalert2';
import Head from 'next/head';
import Image from 'next/image';

interface ProtestData {
  id: number;
  content: string;
  tournament_id: number;
  date: Date;
  team_name: string;

}
interface Listtournament {
  id: number;
  title: string;
  ordinal: number;
  location: string;
  timebetween: string;
  status: number;
}

interface Detail {
  id: number;
  listT_id: number
  team_name: string;
  Name_1: string;
  Nickname_1: string;
  age_1: number;
  gender_1: string;
  affiliation_1: string;
  tel_1: string;
  image_1: string;
  Name_2: string;
  Nickname_2: string;
  age_2: number;
  gender_2: string;
  affiliation_2: string;
  tel_2: string;
  image_2: string;
  level: string;
  status: number;
  paymentStatus: number;
}

const ProtestPage: React.FC = () => {
  const [protestData, setProtestData] = useState<ProtestData[]>([]);
  const [listtournamentData, setListtournamentData] = useState<Listtournament[]>([]);
  const [detail_data, setDetail_data] = useState<Detail>();
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [checkDisabled, setCheckDisabled] = useState(true);
  const [show, setShow] = useState(false);
  const [List_T_ID, setList_T_ID] = useState(0);

  async function fetchProtest(id: number) {
    try {
      const response = await fetch(`/api/admin/tournament/protest/get?listTourID=${id}`);
      const data = await response.json();
      setProtestData(data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchTournamentdata() {
    try {
      const response1 = await fetch('/api/admin/tournament/listTournament/get');
      const listtournament = await response1.json();
      setListtournamentData(listtournament);
      if (response1.ok) {
        const listTourID = listtournament[0].id
        setList_T_ID(listTourID);
        fetchProtest(listTourID);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchTournamentdata();
  }, []);


  const ListournamentOptions = listtournamentData.map((item) => {
    return (
      <option
        key={item.id}
        value={`${item.id}`}
      >
        {item.title}
      </option>
    );
  });

  const showDetail = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/tournament/protest/getTeamDetail?id=${id}`);
      const tournament_data = await response.json();
      if (response.ok) {
        setDetail_data(tournament_data[0]);
        setSelectedStatus(tournament_data[0].status);
        setCheckDisabled(true);
        setShow(true);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const deleteProtest = (item: ProtestData) => {

    Swal.fire({
      title: `ต้องการลบการประท้วง? `,
      text: `เนื้อหา "${item.content}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/admin/tournament/protest/delete?id=${item.id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('An error occurred while deleting the data.');
          } else {
            setShow(false);
            Swal.fire(
              'Deleted!',
              `ลบการประท้วงเนื้อหา "${item.content}"  เรียบร้อย`,
              'success'
            )
          }

          fetchProtest(List_T_ID);
        } catch (error: any) {
          console.error(error.message);
          // Handle any error or display an error message
        }

      }
    })

  }
  const updateStatus = () => {
    const text = detail_data?.status === 0 ? "ระหว่างพิจารณา" : detail_data?.status === 1 ? "ไม่ผ่าน" : "ผ่าน"
    const text2 = selectedStatus === 0 ? "ระหว่างพิจารณา" : selectedStatus === 1 ? "ไม่ผ่าน" : "ผ่าน"

    Swal.fire({
      title: `ต้องการบันทึกสถานะ ? `,
      text: `"${text}" เปลี่ยนเป็น "${text2}" `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'บันทึก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/admin/tournament/protest/updateStatus`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: detail_data?.id, newStatus: selectedStatus }),
          });

          if (!response.ok) {
            Swal.fire(
              'มีข้อผิดพลาด',
              ``,
              'error'
            )

            throw new Error('An error occurred while deleting the data.');

          } else {
            setShow(false);
            Swal.fire(
              'สำเร็จ!',
              `เปลี่ยนสถานะเป็น "${text2}" เรียบร้อย`,
              'success'
            )
          }

          fetchProtest(List_T_ID);
        } catch (error: any) {
          console.error(error.message);
          // Handle any error or display an error message
        }

      }
    })
  }

  return (
    <>
      <Head>
        <title>Protest</title>
      </Head>
      <div style={{ maxWidth: '1200px', textAlign: 'center', margin: 'auto' }}>
        <h4 className='d-flex flex-row ' style={{ width: 'fit-content' }}>
          <label htmlFor="status" className='text-nowrap mx-2 '>การประท้วง งานแข่ง : </label>
          <select
            className={`text-center form-select `}
            id="status"
            name="status"
            onChange={(e) => {
              const ID = parseInt(e.target.value);
              setList_T_ID(ID);
              fetchProtest(ID);
            }}
          >
            {ListournamentOptions}

          </select></h4>

        <table className="table table-bordered table-striped  table-sm">
          <thead className='table-primary'>
            <tr>
              <th>ลำดับ</th>
              <th>เนื้อหา</th>
              <th>ร้องเรียนทีม</th>
              <th scope="col">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {protestData.length < 1 && (
              <td colSpan={4}>ยังไม่มีการประท้วงสำหรับงานนี้</td>
            ) }
            {protestData.map((protest, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className='text-wrap' style={{ maxWidth: '350px', textAlign: 'start' }}>{protest.content}</td>
                  <td ><Button className={styles.detailBTN} onClick={() => showDetail(protest.tournament_id)}>{protest.team_name}</Button></td>
                  <td >
                    <Button
                      className="btn-sm btn-danger"
                      style={{ width: "100%" }}
                      onClick={() => deleteProtest(protest)}
                    >
                      ลบ
                    </Button></td>
                </tr>
              )

            })}
          </tbody>
        </table>

        <Modal
          show={show}
          onHide={() => setShow(false)}
          backdrop="static"
          keyboard={false}
          aria-hidden="true"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div className={styles.titleM}>
                <h5>รายละเอียดทีม <span style={{ fontWeight: 'bolder' }}> {detail_data?.team_name}  </span>ระดับมือ  {detail_data?.level}</h5>
              </div>

            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div className={styles.wrapper}>
              <div className={styles.detail}>
                <Image src={`${detail_data?.image_1}`} alt="photo" width="200" height="250" />
                <div> <span>ชื่อ {detail_data?.Name_1} ({detail_data?.Nickname_1})</span></div>
                <div><span>อายุ {detail_data?.age_1} ปี  : เพศ {detail_data?.gender_1}</span></div>
                <div> <span>สังกัด {detail_data?.affiliation_1}</span></div>
                <div> <span>เบอร์: {detail_data?.tel_1}</span></div>

              </div>
              <div className={styles.detail}>
                <Image src={`${detail_data?.image_2}`} alt="photo" width="200" height="250" />
                <div><span>ชื่อ {detail_data?.Name_2} ({detail_data?.Nickname_2})</span></div>
                <div><span>อายุ {detail_data?.age_2} ปี  : เพศ {detail_data?.gender_2}</span></div>
                <div><span>สังกัด {detail_data?.affiliation_2}</span></div>
                <div> <span>เบอร์: {detail_data?.tel_2}</span></div>

              </div>
            </div>

          </Modal.Body>
          <Modal.Footer className={styles.wrapper2}>
            <div className={styles.wrapper2}>

              <div >
                <h5 className={styles.wrapper3} >
                  <label htmlFor="status" className='text-nowrap mx-2 p-1'>เลือกสถานะ : </label>
                  <select
                    className={`text-center form-select text-dark ${selectedStatus === 0 ? 'bg-warning' : selectedStatus === 1 ? 'bg-danger text-white' : 'bg-info'} `}
                    id="status"
                    name="status"
                    value={selectedStatus}
                    onChange={(e) => {
                      const selectedStatus = e.target.value;
                      setCheckDisabled(parseInt(selectedStatus) === detail_data?.status)
                      setSelectedStatus(parseInt(selectedStatus));

                    }}
                  >
                    <option className='bg-white text-dark' value={0}>ระหว่างพิจารณา</option>
                    <option className='bg-white text-dark' value={1}>ไม่ผ่าน</option>
                    <option className='bg-white text-dark' value={2}>ผ่าน</option>

                  </select></h5>

              </div>
              { }
              <Button variant="primary" disabled={checkDisabled} onClick={() => updateStatus()}>บันทึกสถานะ</Button>





            </div>

          </Modal.Footer>
        </Modal>

      </div>
    </>

  );
};

export default ProtestPage;