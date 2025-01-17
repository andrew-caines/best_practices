import { useState } from "react"
import styles from "./Greeting.module.css";

interface GreetingProps {
    message: string,
    title: string
}

export default function Greeting({ message, title }: GreetingProps) {
    const [count, setCount] = useState(0);
    return (
        <main className={styles.main}>
            <section className={styles.section}>
                <h2>{title}</h2>
                <p>{message}</p>
            </section>
            <section className={styles.section}>
                <div>
                    <button data-testid="inc" onClick={() => setCount(prev => prev + 1)}>+</button>
                </div>
                <div>
                    <button data-testid="dec" onClick={() => setCount(prev => prev - 1)}>-</button>
                </div>
                <p data-testid="count">{count}</p>
            </section>
        </main>
    )
}