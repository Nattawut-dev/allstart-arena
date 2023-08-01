import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/ReserveBadmintonCourt.module.css'; 3
import { format, addDays, isAfter, differenceInDays, parse } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import NotFoundPage from '../../../404'
import AdminLayout from '@/components/AdminLayout';
import { Button, Modal } from 'react-bootstrap';

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  price: number;
}

interface Court {
  id: number;
  title: string;
}

interface Reservation {
  id: number;
  name: string;
  court_id: number;
  time_slot_id: number;
  reserved_date: string;
  usedate: string;
  start_time: string;
  end_time: string;
}

interface Props {
  timeSlots: TimeSlot[];
  courts: Court[];
  timeZone: string;
}


export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const timeZone = 'Asia/Bangkok';
    const courts = await fetch(`${process.env.HOSTNAME}/api/reserve/courts`);
    const courts_data = await courts.json();
    const timeslots = await fetch(`${process.env.HOSTNAME}/api/reserve/time-slots`);
    const timeslots_data = await timeslots.json();

    return {
      props: {
        timeSlots: timeslots_data.timeSlots,
        courts: courts_data.courts,
        timeZone: timeZone
      },

    };
  } catch (error) {
    return {
      props: {
        timeSlots: [],
        courts: [],
        timeZone: "Asia/Bangkok"

      },
    };
  }
}


function ReserveBadmintonCourt({ timeSlots, courts, timeZone }: Props,) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    getReservations();
    check(parsedId)
  }, []);
  const check = (id: any) => {

  }
  const getReservations = async () => {
    const response = await fetch(`/api/reserve/reservations`);
    const data = await response.json();
    setReservations(data);
  };

  const dateInBangkok = utcToZonedTime(new Date(), timeZone);
  const parsedId = parseInt(router.query.id as string)


  const [selectedDate, setSelectedDate] = useState(addDays(dateInBangkok, parsedId));


  const setbtn = (addDay: number) => {
    setSelectedDate(addDays(dateInBangkok, addDay))
    getReservations();
    router.push(`/admin/backend/booking/${encodeURIComponent(addDay)}`)
  }

  const handleCourtReservation = (
    courtId: number,
    timeSlotId: number,
    startTime: string,
    endTime: string,
    usedate: number
  ) => {
    router.push(`/booking/Reserve/${courtId}?timeSlot=${timeSlotId}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&usedate=${encodeURIComponent(usedate)}`
    );
  };
  const getCurrentDate = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // State to manage the date input value
  const [startDate, setStartDate] = useState<string>(getCurrentDate());

  // Function to handle date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
    // const day = dateInBangkok.getDate();
    // const month = dateInBangkok.getMonth() + 1;
    // const year = dateInBangkok.getFullYear();
    // const currentDate = `${year}-${month}-${day}`;
    // const Sdate = new Date(event.target.value)
    // const diff = new Date(currentDate)
    const Sdate = new Date(event.target.value)
    const diff = new Date(); // The current date and time

    // Calculate the difference in days
    const daysDiff = differenceInDays(Sdate, diff);
    setbtn(daysDiff)
    console.log('Days difference:', daysDiff);

  };

  if (timeSlots.length < 1 || courts.length < 1) {

    return (
      <NotFoundPage />
    );
  } else {
    return (
      <AdminLayout>
        <div className={`${styles.container} `}>
          {/* {isLoading && (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                    </div>
                )} */}

          <div>
            {/* <h2 className={styles.h2}>จองสนามแบดมินตัน</h2> */}
            <div>
              <Button className=''>จองล่วงหน้า</Button>
              <label htmlFor="start">Start date:</label>
              <input
                type="date"
                id="start"
                name="trip-start"
                value={startDate}
                onChange={handleDateChange} // Handle date change
              />
            </div>
            <div className={styles.tableWrapper}>
              <table className={`${styles.table}  ${isLoading ? styles.load : ''}`} >
                <thead>
                  <tr >
                    <td colSpan={7} className={styles.reserveDate}>
                      Reservation for {selectedDate && format(selectedDate, 'dd MMMM yyyy')}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className={styles.reserveDate}>
                      <input
                        type="date"
                        id="start"
                        name="trip-start"
                        value={startDate}
                        onChange={handleDateChange} // Handle date change
                        className='mx-3'
                      />

                      <button className={`${styles.btn} ${parsedId == 0 ? styles.active : ''}`} onClick={() => setbtn(0)}>{format((dateInBangkok), 'dd MMMM ')}</button>
                      <button className={`${styles.btn} ${parsedId == 1 ? styles.active : ''}`} onClick={() => setbtn(1)}>{format(addDays(dateInBangkok, 1), 'dd MMMM ')}</button>
                      <button className={`${styles.btn} ${parsedId == 2 ? styles.active : ''}`} onClick={() => setbtn(2)}>{format(addDays(dateInBangkok, 2), 'dd MMMM ')}</button>
                      <button className={`${styles.btn} ${parsedId == 3 ? styles.active : ''}`} onClick={() => setbtn(3)}>{format(addDays(dateInBangkok, 3), 'dd MMMM ')}</button>
                      <button className={`${styles.btn} ${parsedId == 4 ? styles.active : ''}`} onClick={() => setbtn(4)}>{format(addDays(dateInBangkok, 4), 'dd MMMM ')}</button>
                      <button className={`${styles.btn} ${parsedId == 5 ? styles.active : ''}`} onClick={() => setbtn(5)}>{format(addDays(dateInBangkok, 5), 'dd MMMM ')}</button>
                      <button className={`${styles.btn} ${parsedId == 6 ? styles.active : ''}`} onClick={() => setbtn(6)}>{format(addDays(dateInBangkok, 6), 'dd MMMM ')}</button>
                      <button className={`${styles.btn} ${parsedId == 7 ? styles.active : ''}`} onClick={() => setbtn(7)}>{format(addDays(dateInBangkok, 7), 'dd MMMM ')}</button>

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
                      {courts.map((court) => {
                        const reservation = reservations.find(
                          (reservation) =>
                            reservation.court_id === court.id &&
                            reservation.usedate === format(selectedDate, 'dd MMMM yyyy') &&
                            (
                              // (reservation.start_time >= timeSlot.start_time && reservation.start_time < timeSlot.end_time) ||  // กรณีการจองเริ่มต้นในช่วงเวลาที่กำหนด
                              // (reservation.end_time > timeSlot.start_time && reservation.end_time <= timeSlot.end_time) ||  // กรณีการจองสิ้นสุดในช่วงเวลาที่กำหนด
                              (reservation.start_time <= timeSlot.start_time && reservation.end_time >= timeSlot.end_time)  // กรณีการจองที่ครอบคลุมช่วงเวลาที่กำหนด
                            )
                        );
                        const isAvailable = !reservation;
                        const isExpired = reservation && isAfter(new Date(), new Date(reservation.usedate));
                        return (
                          <td
                            key={court.id}
                            className={`${styles.cell} ${isAvailable ? styles.available : styles.reserved} ${isExpired ? styles.expired : ''
                              }`}
                            onClick={() => {
                              if (isAvailable && !isExpired) {
                                handleCourtReservation(
                                  court.id,
                                  timeSlot.id,
                                  timeSlot.start_time,
                                  timeSlot.end_time,
                                  parsedId
                                );
                              }
                            }}
                          >
                            {isAvailable ? timeSlot.price + " ฿" : reservation.name}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </AdminLayout>

    );
  }
}


export default ReserveBadmintonCourt;