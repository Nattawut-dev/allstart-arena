import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from '@/styles/admin/tournament/Tournament.module.css';

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
const ProtestPage: React.FC = () => {
  const [protestData, setProtestData] = useState<ProtestData[]>([]);
  const [listtournamentData, setListtournamentData] = useState<Listtournament[]>([]);
  const [detail_data, setDetail_data] = useState<Detail>();
  const [loading, setLoading] = useState(false);

  const [isTournament, setIsTournament] = useState(false);
  const [show, setShow] = useState(false);

  async function fetchProtest() {
    try {
      const response = await fetch('/api/admin/tournament/protest/get');
      const data = await response.json();
      setProtestData(data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async function fetchTournamentdata() {
    try {
      const response1 = await fetch('/api/tournament/listtournament');
      const listtournament = await response1.json();
      setListtournamentData(listtournament.results);
      if (response1.ok) {
        setIsTournament(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchProtest();
    // fetchTournamentdata();
  }, []);

  const showDetail = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/tournament/protest/getTeamDetail?id=${id}`);
      const tournament_data = await response.json();
      if (response.ok) {
        setDetail_data(tournament_data[0]);
        setShow(true);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <>

      <div style={{ maxWidth: '1200px', textAlign: 'center', margin: 'auto' }}>
        <h1>Protest Data</h1>

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
                      onClick={() => deletereserve(protest)}
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
                <h5>รายละเอียดทีม <span style={{ fontWeight: 'bolder' }}> {detail_data?.team_name}  </span>ระดับมือ</h5>
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

      </div>
    </>

  );
};

export default ProtestPage;