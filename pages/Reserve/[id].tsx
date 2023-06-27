import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/ReserveForm.module.css';

export default function Page() {
  const router = useRouter();
  const { id, timeSlot, startTime, endTime } = router.query;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/reserve/reservations', {
        method: 'POST',
        body: JSON.stringify({
          name, // Update to lowercase 'name'
          phone,
          court_id: id,
          time_slot_id: timeSlot,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Data submitted successfully');
        
        // Reset form fields if needed
        setName('');
        setPhone('');
        router.push(`/Reserve/Avaliable`)

      } else {
       
        console.error('Error submitting data');
        router.push(`/Reserve/notAvaliable`)

      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main>
      <div className={styles['reserve-form-container']}>
        <h2>จองสนามแบดมินตันคอร์ท {id}</h2>
        <h3>เวลา {startTime} - {endTime}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <br />
          <label>
            Phone:
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </main>
  );
}
