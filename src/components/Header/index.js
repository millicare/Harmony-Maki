import React from 'react';
import { useState } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import { Button } from '@material-ui/core';
import ThemeSwitchButton from '../ThemeSwitchButton';
import { MDBBtn, } from 'mdb-react-ui-kit';
import { MicNone } from '@material-ui/icons';
import Web3Modal from 'web3modal';
import WalletConnectProvider from "@walletconnect/web3-provider";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { ethers } from 'ethers';

import {
    TokenABI
} from '../../constant/contractABI';


const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1
    },
    appbar: {
        display: 'flex',
        backgroundColor: 'transparent !important',
        boxShadow: 'none',
        color: localStorage.theme == 'dark' ? '#979dc6' : '#030303'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
            width: '80px',
            height: '80px',
            marginLeft: "20px"
        },
    },
    info: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        },
    },
    search: {
        margin: '0px 120px !important',
        flex: "auto",
        // padding: "8px",
        position: 'relative',
        borderRadius: "8px",
        border: '1px solid #b23cfd',

        // border: '1px solid ',
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        // background: 'linear-gradient(90deg, #202231, #202231), linear-gradient(90deg,#27b0e6, #fa52a0)',
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
            border: '2px solid #b23cfd',
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: "100%",
        '&:hover': {
            border: '1px solid linear-gradient(90deg, #0993ec, #f338c3)',
        }
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    connectButton: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            marginRight: '50px'
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

export default function Header() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

        // wallet connect provider options
    // const providerOptions = {
    //     walletconnect: {
    //     package: WalletConnectProvider,
    //     options: {
    //         infuraId: "27e484dcd9e3efcfd25a83a78777cdf4" // Rinkeby network infuraid
    //     }
    //     }
    // };

    // //web3Modal connect to Metamask
    // const web3Modal = new Web3Modal({
    //     network: NETWORK, // optional
    //     cacheProvider: true, // optional
    //     providerOptions // required
    // });

    // //connect metamask to current website
    // async function connectWallet(){
    //     await window.ethereum.enable();
    //     await web3Modal.connect();
    // }

    const [account, setAccount] = useState('');
    const [authorised, setAuthorised] = useState(false);

    const [tokenName, setTokenName] = useState('');
    const [tokenAmount, setTokenAmount] = useState(0);

    const handleAccountsChanged = accounts => {
        if (accounts.length === 0) {
        console.error('Not found accounts');
        } else {
        setAccount(accounts[0]);
        }
    };

    const signInMetamask = async () => {
        const provider = await detectEthereumProvider();

        // @ts-ignore
        if (provider !== window.ethereum) {
          console.error('Do you have multiple wallets installed?');
        }
    
        if (!provider) {
          console.error('Metamask not found');
          return;
        }
    
        // MetaMask events
        provider.on('accountsChanged', handleAccountsChanged);
    
        provider.on('disconnect', () => {
          console.log('disconnect');
          setAuthorised(false);
          setAccount('');
        });
    
        provider.on('chainIdChanged', chainId =>
          console.log('chainIdChanged', chainId),
        );
    
        provider
          .request({ method: 'eth_requestAccounts' })
          .then(async params => {
            handleAccountsChanged(params);
            setAuthorised(true);
          })
          .catch(err => {
            setAuthorised(false);
    
            if (err.code === 4001) {
              console.error('Please connect to MetaMask.');
            } else {
              console.error(err);
            }
          });

        if (provider) {
            let contractToken = await getTokenInstance("0x45734927fa2f616fbe19e65f42a0ef3d37d1c80a");
            await contractToken.methods.name().call()
                .then((result) => {
                    console.log('name', result);
                    setTokenName(result);
                })
                .catch((err) => {
                    console.log('name err');
                });

            await contractToken.methods.balanceOf("0x6b0C1a8d88d7e72205C253363DA257Ff4548e036").call()
                .then((result) => {
                    console.log('amount',result);
                    setTokenAmount(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
    
    const getTokenInstance = async (contractAddress) => {
        const currentProvider = await detectEthereumProvider();
        if (currentProvider) {
            let web3Instance = await new Web3(currentProvider);
            if (web3Instance) {
                let contract = new web3Instance.eth.Contract(TokenABI, contractAddress);
                return contract;
            }
            else {
                return null;
            }
        }
        return null;
    }

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <MDBBtn className="theme-btn theme-btn-black mx-6 w-40 max-h-1" color='dark' onClick={signInMetamask}>
                    <span>Connect Wallet</span>
                </MDBBtn>
            </MenuItem>
            <MenuItem>
                <ThemeSwitchButton />
            </MenuItem>
        </Menu>
    );

    const appbar_background = () => {
        if (localStorage.theme === 'dark') {
            return {
                color: '#979dc6'
            }
        } else {
            return {
                color: '#030303'
            }
        }
    }

    return (
        <div className={classes.grow} >
            <AppBar position="static" className={classes.appbar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                    >
                        <img src="/logo.png" className={classes.title} />
                    </IconButton>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                            
                    <div className={classes.connectButton}>
                        { authorised && <h1 style={{padding:"5px"}}>Token Name: {tokenName}            </h1>}
                        
                        { authorised && <h1 style={{padding:"5px"}}>Token Amount: {ethers.utils.formatUnits(tokenAmount, 9)}</h1>}

                        { !authorised && 
                        <button style={{ background: "linear-gradient(90deg, #0993ec, #f338c3)", padding: "12px 36px", borderRadius: "12px", color: 'white' }} onClick={signInMetamask}>
                            <span>Connect Wallet</span>
                        </button>
                        }
                    </div>
                    <ThemeSwitchButton />

                    
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}
