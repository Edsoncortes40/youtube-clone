'use client';

import Image from "next/image"
import styles from "./navbar.module.css";
import Link from "next/link";
import SignIn from "./sign-in";
import { onAuthstateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";

export default function Navbar(){
    //Init user state
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthstateChangedHelper((user) => {
            setUser(user);
        });

        //cleanup subscription on unmount. If this function (Navbar) dies or is rerendered then this unsub function is called.
        return () => unsubscribe();
    });
    

    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image width={90} height={20}
                src="/youtube-logo.svg" alt="Youtube Logo"/>
            </Link>
            {
                //TODO: Add a upload button
            }
            <SignIn user={user}/>

        </nav>
    );
}