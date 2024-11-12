import { SkillLevelEnum } from "@/enum/skillLevelEnum";


export const skillLevelsOptions = [
    { label: "Beginners Level 1 เริ่มต้น", value: SkillLevelEnum.BG1 },
    { label: "Beginners Level 2", value: SkillLevelEnum.BG2 },
    { label: "N", value: SkillLevelEnum.N },
    { label: "N+", value: SkillLevelEnum.NPlus },
    { label: "S", value: SkillLevelEnum.S },
    { label: "S+", value: SkillLevelEnum.SPlus },
    { label: "P-", value: SkillLevelEnum.PMinus },
    { label: "P ขึ้นไป", value: SkillLevelEnum.P },
    { label: "เล่นได้ทุกมือ BGถึงP", value: SkillLevelEnum.X },
    { label: "ยังไม่ทราบมือ", value: SkillLevelEnum.Unknown }
];