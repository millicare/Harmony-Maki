import React, { useEffect } from "react";

// ** Web3 React
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
    URI_AVAILABLE,
    UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
// ** Import Material-Ui Components
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import Alert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

// ** Import Material Icons
import CloseIcon from "@material-ui/icons/Close";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import OpenInNewOutlinedIcon from "@material-ui/icons/OpenInNewOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import ReplayIcon from '@material-ui/icons/Replay';

// ** Import Assets
import useStyles from "../../assets/styles";
import { Wallets, ConnectedWallet } from "../../constant/wallets";

import { walletconnect } from "../../constant/connectors";
import { useEagerConnect, useInactiveListener } from "../../hooks";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ConnectWallet = ({ isOpen, setIsOpen }) => {
    const classes = useStyles.base();
    const triedEager = useEagerConnect();
    const { activate, active, account, deactivate, connector, error, setError } =
        useWeb3React();

    const [activatingConnector, setActivatingConnector] = React.useState();
    const cWallet = ConnectedWallet();
    // ** Actions
    const copyAddress = () => {
        alert(`Copied to clipboard.`, "info");
    };
    const viewBlockUrl = (account) => {
        window.open(`https://harmony-explorer-5f241.web.app/address/${account}`);
    };
    // ** Effects
    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);
    // log the walletconnect URI
    useEffect(() => {
        const logURI = (uri) => {
            console.log("WalletConnect URI", uri);
        };
        walletconnect.on(URI_AVAILABLE, logURI);

        return () => {
            walletconnect.off(URI_AVAILABLE, logURI);
        };
    }, []);

    useInactiveListener(!triedEager);

    // ** Actions
    const retryConnect = () => {
        setError(false);
    };
    const onConnectWallet = async (item) => {
        setActivatingConnector(item.connector);
        await activate(item.connector);
    };
    const onDeactiveWallet = () => {
        deactivate();
    };
    const handleCloseWalletList = () => {
        setIsOpen(false);
    };
    const getErrorMessage = (error) => {
        if (error instanceof NoEthereumProviderError) {
            return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
        } else if (error instanceof UnsupportedChainIdError) {
            return "You're connected to an unsupported network.";
        } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect ||
            error instanceof UserRejectedRequestErrorFrame
        ) {
            return "Please authorize this website to access your Ethereum account.";
        } else {
            console.error(error);
            return "An unknown error occurred. Check the console for more details.";
        }
    };
    return (
        <Dialog
            onClose={handleCloseWalletList}
            classes={{
                paper: classes.connectWallet,
            }}
            open={isOpen}
            fullWidth={true}
        >
            {error && <Alert severity="error" action={
                <Button color="primary" onClick={() => retryConnect()}>
                    <ReplayIcon />
                </Button>
            }>{getErrorMessage(error)}</Alert>}
            <DialogTitle className="action">
                <Typography>{active && "Account"}</Typography>
                <Typography className="title">{!active && "Connect to a wallet"}</Typography>
                <IconButton
                    onClick={() => {
                        setIsOpen(false);
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            {active && (
                <Box className={classes.connectWalletButton}>
                    <Button endIcon={<img src={cWallet.logo} alt={cWallet.name} />}>
                        <Typography variant="caption">
                            {`${cWallet.name} Connected`}
                        </Typography>
                    </Button>
                    <TextField
                        inputProps={{
                            readOnly: true,
                        }}
                        value={
                            account
                                ? `${account.substring(
                                    0,
                                    16
                                )} ... ${account.substring(
                                    account.length - 4
                                )}`
                                : "Connect Wallet"
                        }
                    />
                    <ButtonGroup
                        className="buttonGroup"
                        color="primary"
                        aria-label="outlined primary button group"
                    >
                        <CopyToClipboard
                            text={account}
                            onCopy={() => copyAddress()}
                        >
                            <Button
                                onClick={() => copyAddress()}
                                startIcon={<FileCopyOutlinedIcon />}
                            >
                                <Typography variant="caption">Copy</Typography>
                            </Button>
                        </CopyToClipboard>
                        <Button
                            onClick={() => viewBlockUrl(account)}
                            startIcon={<OpenInNewOutlinedIcon />}
                        >
                            <Typography variant="caption">View</Typography>
                        </Button>
                        <Button
                            onClick={() => onDeactiveWallet()}
                            startIcon={<ExitToAppOutlinedIcon />}
                        >
                            <Typography variant="caption">
                                Deactivate
                            </Typography>
                        </Button>
                    </ButtonGroup>
                </Box>
            )}
            {!active ? (
                <List className="wallet-list">
                    {Wallets.map((item, idx) => {
                        const activating =
                            item.connector === activatingConnector;
                        const connected = item.connector === connector;
                        const disabled =
                            !triedEager ||
                            !!activatingConnector ||
                            connected ||
                            !!error;
                        return (
                            <ListItem
                                button
                                key={idx}
                                className="item"
                                disabled={disabled}
                                onClick={() => onConnectWallet(item)}
                            >
                                <ListItemIcon className="symbol">
                                    {activating ? (
                                        <CircularProgress />
                                    ) : (
                                        <img src={item.logo} alt={item.logo} />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.title}
                                    secondary={
                                        activating
                                            ? "Initializing..."
                                            : item.description
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                ""
            )}
        </Dialog>
    );
};

export default ConnectWallet;
