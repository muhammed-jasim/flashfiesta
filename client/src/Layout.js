import { Link } from 'react-router-dom'
import React from 'react'

function Layout() {
  return ( 
    <div style={{display:'flex',justifyContent:'center'}}>
      <nav style={{display:'flex',justifyContent:'center'}}>
        <li style={{listStyleType:'none',margin:'10px'}}><Link to='/'> Nav</Link>  </li>
        <li style={{listStyleType:'none',margin:'10px'}}><Link to='/signup' > Signup </Link> </li>
        <li style={{listStyleType:'none',margin:'10px'}}><Link to='/myadmin' > Admin Panel </Link> </li>
      </nav>
    </div>
  )
}

export default Layout
