import { NextApiRequest, NextApiResponse } from 'next';
import moment from 'moment';
import pool from '@/db/db';

async function deleteExpiredReservations() {
    try {
        await pool.query('DELETE FROM reserve WHERE reserved_date < NOW() - INTERVAL 1 MINUTE AND status = 0;');
        console.log('Expired reservations with status = 0 deleted.');

    } catch (error) {
        console.error('Error deleting expired reservations:', error);
    }
}

async function getReservationTimeLeft(reservationId: number) {
    try {
        const [row] = await pool.query('SELECT reserved_date FROM reserve WHERE id = ?', [reservationId]);
        const rows = row as any
        if (rows.length > 0) {
            const reservedDate = moment(rows[0].reserved_date).format('YYYY-MM-DD HH:mm:ss');
            const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
            const timeLimit = moment(reservedDate).add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');

            return moment(timeLimit).diff(currentTime, 'seconds');
        }
        return 0;
    } catch (error) {
        console.error('Error fetching reservation time:', error);
        return 0;
    }
}

async function countdownTimer(req: NextApiRequest, res: NextApiResponse) {
    await deleteExpiredReservations();

    const reservationIds = [199]; // แทนที่ด้วยรายการไอดีที่ต้องการให้ทำ countdown ตามความเหมาะสมของโครงการ

    const timeLeftMap: { [id: number]: number } = {};
    for (const id of reservationIds) {
        const timeLeft = await getReservationTimeLeft(id);
        timeLeftMap[id] = timeLeft;
    }

    res.status(200).json({ timeLeftMap });
}

export default countdownTimer;
