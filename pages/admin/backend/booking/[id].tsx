import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/admin/ReserveBadmintonCourt.module.css';
import { format, addDays, isAfter, differenceInCalendarDays, parse } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import NotFoundPage from '../../../404'
import AdminLayout from '@/components/AdminLayout';
import { Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
interface Holidays {
  id: number;
  title: string;
  date: string;
  status: number;
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
  const [foundHoliday, setFoundHoliday] = useState<Holidays[]>([])
  const [isHoliday, setIsHoliday] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
  };
  const getReservations = async () => {
    const response = await fetch(`/api/reserve/reservations`);
    const data = await response.json();
    setReservations(data);
  };

  const dateInBangkok = utcToZonedTime(new Date(), timeZone);
  const parsedId = parseInt(router.query.id as string)

  useEffect(() => {
    getHoliday();
    getReservations();
    selectDate(parsedId);
  }, [parsedId]);

  const [selectedDate, setSelectedDate] = useState(addDays(dateInBangkok, parsedId));

  const selectDate = (id: number) => {
    setSelectedDate(addDays(dateInBangkok, id))
  }
  const getHoliday = async () => {
    try {
      const selectDate = format(selectedDate, 'dd-MM-yyyy')
      const response = await fetch(`/api/reserve/holidays?date=${selectDate}`);
      const data = await response.json();
      if (data.results.length >= 1) {
        setFoundHoliday(data.results);
        if (data.results[0].status === 0) {
          setIsHoliday(true)
        } else {
          setIsHoliday(false)
        }
      } else {
        setIsHoliday(false)
      }
    } catch {
      console.log('error');
    }
  };


  const setbtn = (addDay: number) => {
    setSelectedDate(addDays(dateInBangkok, addDay))
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
    const id = parseInt(router.query.id as string)
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // State to manage the date input value
  const [startDate, setStartDate] = useState<string>(getCurrentDate());

  // Function to handle date change
  const handleDateChange = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const currentDate = `${year}-${month}-${day}`;
    const Sdate = new Date(currentDate)
    const diff = new Date(); // The current date and time

    // Calculate the difference in days
    const daysDiff = differenceInCalendarDays(Sdate, diff);
    setbtn(daysDiff)
    console.log('Days difference:', daysDiff);
  };

  if (timeSlots.length < 1 || courts.length < 1) {

    return (
      <NotFoundPage />
    );
  } else {
    return (

      <div className={`${styles.container} `}>

        {/* {isLoading && (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                    </div>
                )} */}

        <div>
          <Button onClick={() => setShow(true)}>ตั้งค่าวันหยุด</Button>
          <div className={styles.tableWrapper}>
            <table className={`${styles.table}  ${isLoading ? styles.load : ''}`} >
              <thead>
                <tr >
                  <td colSpan={7} className={styles.reserveDate}>
                    Reservation for <span>{selectedDate && format(selectedDate, 'dd MMMM yyyy')}</span>
                  </td>
                </tr>

                <tr>
                  <td >
                    <div className={styles.date_wrapper}>
                      <p>เดือน/วัน/ปี</p>
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        className={styles.DatePicker}
                      /></div>
                  </td>
                  <th colSpan={6} className={styles.reserveDate}>


                    <button className={`${styles.btn} ${parsedId == 0 ? styles.active : ''}`} onClick={() => setbtn(0)}>{format((dateInBangkok), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 1 ? styles.active : ''}`} onClick={() => setbtn(1)}>{format(addDays(dateInBangkok, 1), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 2 ? styles.active : ''}`} onClick={() => setbtn(2)}>{format(addDays(dateInBangkok, 2), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 3 ? styles.active : ''}`} onClick={() => setbtn(3)}>{format(addDays(dateInBangkok, 3), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 4 ? styles.active : ''}`} onClick={() => setbtn(4)}>{format(addDays(dateInBangkok, 4), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 5 ? styles.active : ''}`} onClick={() => setbtn(5)}>{format(addDays(dateInBangkok, 5), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 6 ? styles.active : ''}`} onClick={() => setbtn(6)}>{format(addDays(dateInBangkok, 6), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 7 ? styles.active : ''}`} onClick={() => setbtn(7)}>{format(addDays(dateInBangkok, 7), 'dd MMMM ')}</button>

                  </th>
                </tr>
                {!isHoliday &&
                  <tr>
                    <th className={styles.tablehead}>Time/Court</th>

                    {courts && courts.length > 0 && (

                      courts.map((court) => (<th className={styles.tablehead} key={court.id}> {court.title}</th>))
                    )

                    }
                  </tr>
                }

              </thead>

              {!isHoliday &&
                // if 
                <tbody>
                  {
                    timeSlots.map((timeSlot) => (
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
              }


            </table>
            {
              isHoliday &&
              <div className='d-flex justify-content-center fs-5 flex-column '>
                <span className='d-flex justify-content-center'>วันที่เลือกหยุดให้บริการเนื่องจาก</span>
                <span className='d-flex justify-content-center fs-5 text-danger fw-bold'>{foundHoliday[0].title}</span>

              </div>


            }
          </div>
        </div>

        <Modal

          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
          className='modal-dialog-scrollable'
        >
          <Modal.Header>
            <Modal.Title><h5>ตั้งค่าวันหยุด</h5></Modal.Title>
          </Modal.Header>
          <Modal.Body>


          </Modal.Body>
          <Modal.Footer>

          </Modal.Footer>
        </Modal>
      </div >

    );
  }
}


export default ReserveBadmintonCourt;