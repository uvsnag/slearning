'use client';
import Link from 'next/link';
import React, { useEffect, useState, FC, ChangeEvent } from "react";

const Home: FC = () => {


  return (

    <div className="App">
        <li className='mst-menu-li'><Link href="/slearning">E-Learning</Link></li>
    </div>
    
  );
}

export default Home;
