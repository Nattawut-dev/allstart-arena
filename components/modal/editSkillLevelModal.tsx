import { skillLevelsOptions } from '@/constant/options/skillValueOptions';
import { SkillLevelEnum } from '@/enum/skillLevelEnum';
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface EditSkillLevelModalProps {
  label : string;
  show: boolean;
  handleClose: () => void;
  skillLevel: string;
  setSkillLevel: (level: SkillLevelEnum) => void;
  handleConfirm: () => void;
}

const EditSkillLevelModal: React.FC<EditSkillLevelModalProps> = ({
  label,
  show,
  handleClose,
  skillLevel,
  setSkillLevel,
  handleConfirm,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className='p-4'>
        <Form>
          <Form.Group controlId="skillLevelSelect">
            <Form.Label className='text-center fs-5 d-flex justify-content-center'>ตั้งค่าระดับมือ {label}</Form.Label>
            <Form.Select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as SkillLevelEnum)}
              aria-label="Select an option"
              required
            >
              {skillLevelsOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.value})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <div className="d-flex justify-content-center mb-3">
        <Button variant="secondary" onClick={handleClose} className="me-2">
          ยกเลิก
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          บันทึกข้อมูล
        </Button>
      </div>
    </Modal>
  );
}

export default EditSkillLevelModal;
