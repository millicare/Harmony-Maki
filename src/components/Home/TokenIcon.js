import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { toChecksumAddress } from "web3-utils";
import { useMemo } from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(2),
    // background: "transparent",
    color: theme.palette.text.secondary,
  },
}));

export const TokenIcon = ({ id, ...rest }) => {
  const classes = useStyles();
  const src = useMemo(
    () =>
      (id === '0x45734927fa2f616fbe19e65f42a0ef3d37d1c80a' || id === '0x0ab8894cda70a6efd32ce7563834444e2811b182') ? './logo.png' : `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/harmony/assets/${toChecksumAddress(
        id
      )}/logo.png`,
    [id]
  );
  return <Avatar classes={{ root: classes.root }} src={src} {...rest} />;
}