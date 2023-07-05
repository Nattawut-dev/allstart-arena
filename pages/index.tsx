import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
const inter = Inter({ subsets: ['latin'] })



export default function Home() {
  const router = useRouter();

  useEffect(() => {
    {  router.push("/booking/0")}
}, []);


  return (
    <>
      <Head>
        <title>Badminton Cord </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
      <h2>หน้าแรก</h2>

      </main>
    </>
  )
}
