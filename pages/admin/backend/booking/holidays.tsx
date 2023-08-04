import { differenceInCalendarDays } from 'date-fns';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



interface Holidays {
  id: number;
  title: string;
  date: string;
  status: number;
}
interface Props {
  holidays: Holidays[];
}




function holiday() {
  const [holidays, setHolidays] = useState<Holidays[]>([])
  const [isHoliday, setIsHoliday] = useState(false);
  const [selectedDate, setSelectedDate] = useState( new Date());

  useEffect(() => {
    getHoliday();
  }, []);
 // Function to handle date change
 const handleDateChange = (date: Date) => {
  setSelectedDate(date);
};
  const getHoliday = async () => {
    try {
      const response = await fetch(`/api/admin/holidays/get`);
      const data = await response.json();
      if (data.results.length >= 1) {
        setHolidays(data.results);
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
  if (!isHoliday) {
    return (
      <div>No holidays</div>
    )
  }

  return (

    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">หัวข้อ</th>
            <th scope="col">วันที่</th>
            <th scope="col">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
            </tr>
          ))}
          <tr>
            <td>#</td>
            <td><input type="text" /></td>
            <td> <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              
            /></td>
            <td><input type="text" /></td>
          </tr>

        </tbody>
      </table>
      <div className='d-flex justify-content-end'><Button >+</Button></div>
    </div>
  )
}

export default holiday