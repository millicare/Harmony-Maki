import React, { useEffect } from "react";
// import Icon from '@material-ui/core/Icon';
// import IconButton from '@material-ui/core/IconButton';
import { MDBBtn } from 'mdb-react-ui-kit';

function ThemeSwitchButton(props) {
  useEffect(() => {
    if (localStorage.theme === 'dark' || (window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.querySelector('html').classList.add('dark')
    } else if (localStorage.theme === 'dark') {
      document.querySelector('html').classList.add('dark')
    }
  })
  const switchTheme = () => {
    const htmlClasses = document.documentElement.classList;
    if (localStorage.theme === 'dark') {
      htmlClasses.remove('dark');
      localStorage.removeItem('theme')
    } else {
      htmlClasses.add('dark');
      localStorage.theme = 'dark';
    }
  }
  return (
    // <IconButton aria-label="dark-light theme" onClick={switchTheme}>
    //   <Icon color="action" className="dark:text-yellow-200 text-green-400">brightness_medium</Icon>
    // </IconButton>
    <button style={{ background: "linear-gradient(90deg, #0993ec, #f338c3)", padding: "12px 36px", borderRadius: "12px", color: 'white' }} onClick={switchTheme}>
      <img src="/images-new/light-dark-toggle.svg" alt="light-dark" />
    </button>
  );
}

export default ThemeSwitchButton;
