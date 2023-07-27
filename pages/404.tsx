import React from 'react';
import styles from '@/styles/404.module.css';

const NotFoundPage = () => {
    return (
        <div className={styles.box}>
            <div className={styles.container}>
                <h1 className={styles.h1}>404</h1>
                <h2 className={styles.h2}>Page Not Found</h2>
                <p className={styles.p}>Sorry, the page you are looking for does not exist.</p>
            </div>

        </div>
    );
};

export default NotFoundPage;
