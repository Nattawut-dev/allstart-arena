import React, { useState } from 'react';

export interface OptionType {
  id: number; // รหัส
  label: string; // ชื่อเต็ม
  code: string; // ตัวย่อ
  price: string;
  name : string;
};

type AbbreviatedSelectProps = {
  options: OptionType[];
  value?: string;
  onChange?: (value: string) => void;
  width?: string;
  disabled?: boolean;
};

const AbbreviatedSelect: React.FC<AbbreviatedSelectProps> = ({
  options,
  value,
  onChange,
  width = '50px',
  disabled = false,
}) => {
  const selectedOption = options.find((opt) => opt.id === Number(value)) || options[0];
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLabel = e.target.value;
    if (onChange) {
      onChange(selectedLabel);
    }
  };

  if (options.length === 0) {
    return null;
  }
  return (
    <div className='me-1' style={{ position: 'relative', width }}>
      <select
        value={selectedOption.id}
        onChange={handleChange}
        className="form-control"
        style={{
          width: '100%',
          appearance: 'none', // optional: to hide arrow on some browsers3
        }}
        disabled={disabled}
        
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.id} >
            {opt.label}
          </option>

        ))}
      </select>

      {/* Overlay text for abbreviation */}
      <div
        style={{
          position: 'absolute',
          backgroundColor: disabled ? '#e9ecef':'white',
          top: '6px',
          left: '10px',
          pointerEvents: 'none',
          fontSize: '14px',
        }}
      >
        {selectedOption.code}
      </div>
    </div>
  );
};

export default AbbreviatedSelect;
