import React, { useEffect, useState } from 'react';
import styles from '@/styles/reservetion.module.css';

interface Court {
  id: number;
  title: string;
  // Other relevant court details
}

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  // Other relevant time slot details
}

interface Reservation {
  id: number;
  name: string;
  court_id: number;
  time_slot_id: number;
  reserved_date: string;
}

const Schedule: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  useEffect(() => {
    fetchCourts();
    fetchTimeSlots();
    fetchReservations();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch('/api/reserve/courts');
      const data = await response.json();
      setCourts(data.courts);
    } catch (error) {
      console.error('Failed to fetch courts:', error);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch('/api/reserve/time-slots');
      const data = await response.json();
      setTimeSlots(data.timeSlots);
    } catch (error) {
      console.error('Failed to fetch time slots:', error);
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

  return (
    <div className={styles.container}>
      <h2>Schedule</h2>

      <div className={styles['table-container']}>
        <table className={styles['schedule-table']}>
          <thead>
            <tr>
              <th>Court</th>
              <th>Time Use</th>
              <th>Booked By</th>

            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              const court = courts.find((c) => c.id === reservation.court_id);
              const timeSlot = timeSlots.find((ts) => ts.id === reservation.time_slot_id);

              return (
                <tr key={reservation.id}>
                  <td>{court?.title}</td>
                  <td>{timeSlot?.start_time } - { timeSlot?.end_time}</td>
                  <td>{reservation.name}</td> 
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
