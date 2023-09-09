import { GetStaticProps } from 'next';
import React from 'react';
import styles from '@/styles/rules.module.css'
import NotFoundPage from './404'

interface Rules {
  id: number;
  title: string;
  content: string;
  tel: string;
  line_id: string;
  facebook_title: string;
  facebook_url: string;
}


interface Props {
  rules: Rules[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const response = await fetch(`${process.env.HOSTNAME}/api/rules`);
    const rulesdata = await response.json();
    return {
      props: {
        rules: rulesdata,
      },
    };
  } catch {
    return {
      props: {
        rules: [],
      },
    };
  }

};

const Rules = ({ rules }: Props) => {
  if (rules.length < 1) {
    return (
      <NotFoundPage />
    )
  }

  return (
    <>

      <div className={styles.container}>
        <h3 className={styles.heading}>{rules[0].title}</h3>
        <p className={styles.content}>{rules[0].content}</p>
        <div className={styles.contect} >
          <div className={styles.box}>

            <p style={{textAlign: "center" , marginBottom : "15px" , fontWeight : "bold"}}>ช่องทางการติดต่อ</p>
            <p>ไอดีไลน์ : {rules[0].line_id}</p>
            <p >โทร : {rules[0].tel}</p>
            <p >Facebook : <a href={rules[0].facebook_url} target="_blank">{rules[0].facebook_title}</a></p>
          </div>
        </div>

      </div>
    </>
  );
};

export default Rules;
