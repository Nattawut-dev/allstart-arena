import { GetStaticProps } from 'next';
import React from 'react';
import styles from '@/styles/rules.module.css'
interface Rules {
  id: number;
  title: string;
  content: string;
}

interface Props {
  rules: Rules[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const response = await fetch(`${process.env.HOSTNAME}/api/rules`);
  const rulesdata = await response.json();
  return {
    props: {
      rules: rulesdata, // The fetched data is an array of rules, so we pass it directly
    },
  };
};

const Rules = ({ rules }: Props) => {
  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.heading}>{rules[0].title}</h3>
        <p className={styles.content}>{rules[0].content}</p>
      </div>
    </>
  );
};

export default Rules;
