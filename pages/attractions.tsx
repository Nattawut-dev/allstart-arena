import { InferGetServerSidePropsType } from "next"
import { json } from "stream/consumers"
import { useState, useEffect } from "react"

type Props = {
    data: [Data]
}
type Data = {
    id: string,
    name: string,
    converimage: string,
    detail: string
}

export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch(`http://localhost:3000/api/attractions`)
    const data = await res.json()

    // Pass data to the page via props
    return { props: { data: data.results } }
}


export default function Page(props: Props) {

    const [data, setData] = useState<[Data]>(props.data)

    return (
        <ul>
            {data.map((project) => {
                return (
                    <li key={project.id}>{project.name}</li>
                )
            })}
        </ul>
    )
}
