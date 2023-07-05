import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/ReserveBadmintonCourt.module.css'; 3
import { format, addDays, subDays, isBefore, isAfter } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';


interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
}

interface Court {
  id: number;
  title: string;
  status: number; // 1 if court is reserved, 0 otherwise
}

interface Reservation {
  id: number;
  court_id: number;
  time_slot_id: number;
  reserved_date: string;
}

interface Props {
  timeSlots: TimeSlot[];
  courts: Court[];
  reservations: Reservation[];
  isSidebarOpen: boolean;
  timeZone: string;
}

function ReserveBadmintonCourt({ timeSlots, courts, reservations, isSidebarOpen, timeZone }: Props) {

  const dateInBangkok = utcToZonedTime(new Date(), timeZone);
  const router = useRouter();
  console.log("isSidebarOpen", timeZone)
  
  const [selectedDate, setSelectedDate] = useState(dateInBangkok);

  const maxSelectableDate = addDays(dateInBangkok, 6);

  const handlePrevDay = () => {
    if (selectedDate && isAfter(selectedDate, dateInBangkok)) {
      const prevDay = subDays(selectedDate, 1);
      setSelectedDate(prevDay);
    }
  };

  const handleNextDay = () => {
    console.log(125)

    if (selectedDate && isBefore(selectedDate, maxSelectableDate)) {
      const nextDay = addDays(selectedDate, 1);
      setSelectedDate(nextDay);
    }
  };

  const handleCourtReservation = (
    courtId: number,
    timeSlotId: number,
    startTime: string,
    endTime: string
  ) => {
    router.push(
      `/Reserve/${courtId}?timeSlot=${timeSlotId}&startTime=${encodeURIComponent(
        startTime
      )}&endTime=${encodeURIComponent(endTime)}`
    );
  };

  const isCourtAvailable = (courtId: number, timeSlotId: number): boolean => {
    const reservation = reservations.find(
      (reservation) =>
        reservation.court_id === courtId && reservation.time_slot_id === timeSlotId
    );
    return !reservation;
  };

  const createInitialCourts = (): Court[] => {
    if (courts && courts.length > 0) {
      const initialCourts: Court[] = courts.map((court) => ({ ...court, reserved: false }));
      return initialCourts;
    }
    return [];
  };

  if (timeSlots == undefined) {
    return (
      <div className={styles.container}>
        <h2 className={styles.h2}>จองสนามแบดมินตัน</h2>
        <h3 className={styles.h2}>ระบบล่มจ้าาาาาาาาาาาาาาาาาาาาาาา...... </h3>
        <h3 className={styles.h2}>T_T</h3>
      </div>
    );
  } else {
    return (
      <div className={`${styles.container}`}>

        <h2 className={styles.h2}>จองสนามแบดมินตัน</h2>

        <div>
          <button onClick={handlePrevDay} disabled={!selectedDate || isBefore(selectedDate, dateInBangkok)}>
            Previous Day
          </button>
          <span>
            {selectedDate && format(selectedDate, 'dd MMMM yyyy')}
          </span>
          <button onClick={handleNextDay} disabled={!selectedDate || isAfter(selectedDate, maxSelectableDate)}>
            Next Day
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={`${styles.table} `} >
            <thead>
              <tr  >
                <td colSpan={7} className={styles.reserveDate}>
                  Reservation for 01 July 2023
                </td>
              </tr>
              <tr>
                <th className={styles.tablehead}>Time/Court</th>
                {courts &&
                  courts.length > 0 &&
                  courts.map((court) => <th className={styles.tablehead} key={court.id}> {court.title}</th>)}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot.id}>
                  <td className={styles.time}>
                    {timeSlot.start_time} - {timeSlot.end_time}
                  </td>
                  {courts.map((court) => (
                    <td
                      key={court.id}
                      className={`${styles.cell} ${isCourtAvailable(court.id, timeSlot.id)
                        ? styles.available
                        : styles.reserved
                        }`}
                      onClick={() => {
                        if (isCourtAvailable(court.id, timeSlot.id)) {
                          handleCourtReservation(
                            court.id,
                            timeSlot.id,
                            timeSlot.start_time,
                            timeSlot.end_time
                          );
                        }
                      }}
                    >
                      {isCourtAvailable(court.id, timeSlot.id) ? 'Available' : 'Reserved'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export async function getServerSideProps() {


  try {
    const timeZone = 'Asia/Bangkok';
    const timeSlotsResponse = await fetch(`${process.env.HOSTNAME}/api/reserve/time-slots`);
    const timeSlotsData = await timeSlotsResponse.json();
    const courtsResponse = await fetch(`${process.env.HOSTNAME}/api/reserve/courts`);
    const courtsData = await courtsResponse.json();
    const reservationsResponse = await fetch(`${process.env.HOSTNAME}/api/reserve/reservations`);
    const reservationsData = await reservationsResponse.json();
    return {
      props: {
        timeSlots: timeSlotsData.timeSlots,
        courts: courtsData.courts,
        reservations: reservationsData.reservations,
        timeZone: timeZone

      },
    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return {
      props: {
        timeSlots: [],
        courts: [],
        reservations: [],
      },
    };
  }
}

export default ReserveBadmintonCourt;