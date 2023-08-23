import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import styles from '@/styles/Tournament.module.css';

interface ProtestData {
  content: string;
  tournament_id: number;
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
  const [detailData, setDetailData] = useState<Detail[]>([]);

  const [isTournament, setIsTournament] = useState(false);

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
      const response2 = await fetch(`/api/tournament/detailTournament?listT_id=${listtournament.results[0].id}`);
      const detailTournament = await response2.json();
      setListtournamentData(listtournament.results);
      setDetailData(detailTournament.detail)
      if (response1.ok){
        setIsTournament(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchProtest();
    fetchTournamentdata();
  }, []);


  if (!isTournament) {
    return (
      <div className={styles.notnow}>
        <div className={styles.notnowBox}>
          <h1>ยังไม่มีการจัดการแข่งขัน</h1>
          <p>ขณะนี้ยังไม่มีการจัดการแข่งขัน เช็คอัพเดทการแข่งขันได้ที่เพจ</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1>Protest Data</h1>
      <table className="table table-bordered table-striped  table-sm">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>เนื้อหา</th>
            <th>ร้องเรียนทีม</th>
            <th scope="col">ข้อมูล</th>
            <th scope="col">ลบ</th>
          </tr>
        </thead>
        <tbody>
          {protestData.map((protest, index) => {
            const teamname = detailData.find((item) => item.id === protest.tournament_id)
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{protest.content}</td>
                <td>{teamname?.team_name}</td>
                <td><Button className="btn-sm" onClick={() => { checkslip(protest); setShow(true); }}>ข้อมูล</Button></td>
                <td>
                  <Button
                    className="btn-sm btn-danger"
                    onClick={() => deletereserve(protest)}
                  >
                    ลบ
                  </Button></td>
              </tr>
            )

          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProtestPage;