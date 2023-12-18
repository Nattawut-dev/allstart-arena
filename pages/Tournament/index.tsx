import React, { useEffect, useState } from 'react';
import styles from '../../styles/Tournament.module.css';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Regis from './regis'
import { Button } from 'react-bootstrap';

interface TeamData {
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
interface Handlevel {
    id: number;
    name: string;
    max_team_number : number;
    price : number;
  }
interface Props {
    listtournament: Listtournament[];
}


export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const List = await fetch(`${process.env.HOSTNAME}/api/tournament/listtournament`);
    const Listdata = await List.json();

    return {
        props: {
            listtournament: Listdata.results,
        },
    };
};
function Tournament({ listtournament }: Props) {


    const [selectedTournament, setSelectedTournament] = useState<Listtournament | null>();
    const [handlevel, setHandlevel] = useState<Handlevel[]>([]);
    const [selectHandlevel, setSelectedHandlevel] = useState<Handlevel | null>(null);

    const [tournament_id, setTournament_id] = useState<number>();
    const [selected, setSelected] = useState(false);

    const handleSelectTournament = async (tournament: Listtournament) => {
        setSelectedTournament(tournament);
        setTournament_id(tournament.id);
    };
    const handleContinue1 = async () => {
        const res = await fetch(`/api/tournament/select/hand_level?tournament_id=${selectedTournament?.id}`, {
            method: "GET",
        })
        const handLevel = await res.json()
        setHandlevel(handLevel);
    };
    const handleContinue2 = async () => {
        setSelected(true)
    };

    const backToggle = () => {
        setSelected(false)
    }

    return (
        <div>
        <Head>
            <title>Tournamnt Registers</title>
        </Head>
            {listtournament.length < 1 && (
                <div className={styles.notnow}>
                    <div className={styles.notnowBox}>
                        <h1>ยังไม่มีการจัดการแข่งขัน</h1>
                        <p>ขณะนี้ยังไม่มีการจัดการแข่งขัน เช็คอัพเดทการแข่งขันได้ที่เพจ</p>
                    </div>
                </div>
            )}
            {handlevel.length == 0 && listtournament.length > 0 && (
                <div className={styles.tournamentSelection}>
                    <h2 className='my-2'>โปรดเลือกงานแข่ง</h2>
                    <div className={styles.radioContainer}>
                        {listtournament.map((tournament, index) => (
                            <label key={index} className={`${styles.radio} ${tournament_id === tournament.id ? styles.selected : ''}`} onClick={() => handleSelectTournament(tournament)}>
                                {tournament.title}
                            </label>
                        ))}
                    </div>
                    <Button className='btn btn-lg' disabled={!selectedTournament} onClick={handleContinue1}>
                        ดำเนินการต่อ
                    </Button>
                </div>
            )}
            {handlevel.length > 0 && !selected && (
                <div className={styles.tournamentSelection}>
                    <h2>โปรดเลือกระดับมือ</h2>
                    <h5 className='mb-4'> *{selectedTournament?.title} ครั้งที่ {selectedTournament?.ordinal}*</h5>
                    <div className={styles.radioContainer}>
                        {handlevel.map((level, index) => (
                            <label key={index} className={`${styles.radio} ${selectHandlevel?.id === level.id ? styles.selected : ''}`} onClick={() => setSelectedHandlevel(level)}>
                                {level.name}
                            </label>
                        ))}
                    </div>
                    <div >
                        <Button className='btn btn-lg btn-danger mx-2' onClick={() => { setHandlevel([]); setSelectedHandlevel(null) }}>
                            ย้อนกลับ
                        </Button>
                        <Button className='btn btn-lg mx-2' disabled={!selectHandlevel} onClick={handleContinue2}>
                            ดำเนินการต่อ
                        </Button>
                    </div>
                </div>
            )}
            {selected && selectedTournament && handlevel.length > 0 && (
                <Regis selectedTournament={selectedTournament} selectHandlevel={selectHandlevel} backToggle={backToggle} />
            )}
        </div>
    );


}

export default Tournament;
