import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/ReserveBadmintonCourt.module.css';

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
const ReserveBadmintonCourt: React.FC = () => {
  const router = useRouter();

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // Fetch time slots from the timeSlots API endpoint
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch('/api/reserve/time-slots');
        const data = await response.json();
        setTimeSlots(data.timeSlots);
      } catch (error) {
        console.error('Failed to fetch time slots:', error);
      }
    };

    // Fetch courts from the courts API endpoint
    const fetchCourts = async () => {
      try {
        const response = await fetch('/api/reserve/courts');
        const data = await response.json();
        setCourts(data.courts);
      } catch (error) {
        console.error('Failed to fetch courts:', error);
      }
    };
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/reserve/reservations');
        const data = await response.json();
        setReservations(data.reservations);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      }
    };
    fetchTimeSlots();
    fetchCourts();
    fetchReservations();
  }, []);

  const handleCourtReservation = (courtId: number, timeSlotId: number, startTime: string, endTime: string) => {
    router.push(`/Reserve/${courtId}?timeSlot=${timeSlotId}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`);
  };
  

  const isCourtAvailable = (courtId: number, timeSlotId: number): boolean => {
    const reservation = reservations.find(
      (reservation) => reservation.court_id === courtId && reservation.time_slot_id === timeSlotId
    );
    return !reservation;
  };

  const createInitialCourts = (): Court[] => {
    if (courts && courts.length > 0) {
      const initialCourts: Court[] = courts.map(court => ({ ...court, reserved: false }));
      return initialCourts;
    }
    return [];
  };

  return (
    <div>
      <h2>จองสนามแบดมินตัน</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tablehead}>Time/Court</th>
            {courts && courts.length > 0 &&
              courts.map(court => (
                <th key={court.id}>Court {court.title}</th>
              ))}
          </tr>
        </thead>
        <tbody>
        {timeSlots.map(timeSlot => (
            <tr key={timeSlot.id}>
              <td className={styles.time}>{timeSlot.start_time} - {timeSlot.end_time}</td>
              {courts.map(court => (
                <td
                  key={court.id}
                  className={`${styles.cell} ${
                    isCourtAvailable(court.id, timeSlot.id) ? styles.available : styles.reserved
                  }`}
                  onClick={() => {
                    if (isCourtAvailable(court.id, timeSlot.id)) {
                      handleCourtReservation(court.id,timeSlot.id,timeSlot.start_time, timeSlot.end_time);
                    }
                  }}
                >
                  {isCourtAvailable(court.id, timeSlot.id) ? 'Available' : 'Reserved'}
                </td>
              ))}
            </tr>
          ))}
          
          {/* {timeSlots.map(slot => (
            <tr key={slot.id}>
              <td className={styles.time}>{slot.title}</td>
              {courts && courts.length > 0 &&
                createInitialCourts().map(court => (
                  <td
                    key={court.id}
                    className={`${styles.cell} ${court.status === 1 ? styles.reserved : styles.available}`}
                    onClick={() => {
                      if (court.status !== 1) {
                        handleCourtReservation(court.id);
                      }
                    }}
                  >
                    {court.status === 1 ? 'Reserved' : 'Available'}
                  </td>
                ))}
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default ReserveBadmintonCourt;
