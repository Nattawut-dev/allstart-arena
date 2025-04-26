import { Toast } from '@/components/toast';
import useDebounce from '@/pages/hook/use-debounce';
import { useEffect, useState } from 'react';

interface ShuttleCockControlProps {
    buffetId: number;
    shuttlecockTypeId: number;
    initialQty: number;
    onUpdated?: () => void;
    readonly?: boolean;
}

const ShuttleCockControl = ({ buffetId, shuttlecockTypeId, initialQty, onUpdated, readonly = false }: ShuttleCockControlProps) => {
    const [quantity, setQuantity] = useState(initialQty);
    const debouncedQuantity = useDebounce(String(quantity), 500); // debounce 500ms

    useEffect(() => {
        if (String(initialQty) !== debouncedQuantity) {
            updateShuttlecockQty(buffetId, shuttlecockTypeId, parseInt(debouncedQuantity));
        }
    }, [debouncedQuantity]);

    const updateShuttlecockQty = async (id: number, typeId: number, qty: number) => {
        try {
            await fetch('/api/admin/buffet/add_reduce', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, shuttlecock_type_id: typeId, quantity: qty }),
            });
            onUpdated?.();
            Toast.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'อัพเดทจำนวนเรียบร้อยแล้ว',
            });
        } catch (err) {
            console.error('API update error:', err);
            Toast.fire({
                icon: 'error',
                title: 'ข้อผิดพลาด',
                text: 'เกิดข้อผิดพลาดขณะอัพเดทจำนวน',
            });

        }
    };

    return (
        <div className="input-group input-group-sm mb-1" style={{ width: '140px' }}>
            {!readonly && (
                <button
                    className="btn btn-outline-danger btn-light"
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
                    title="Reduce quantity"
                >
                    -
                </button>
            )}

            <input
                type="text"
                className="form-control text-center"
                value={`${quantity} ลูก`}
                readOnly
            />

            {!readonly && (
                <button
                    className="btn btn-outline-success btn-light"
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                >
                    +
                </button>
            )}

        </div>

    );
};

export default ShuttleCockControl;