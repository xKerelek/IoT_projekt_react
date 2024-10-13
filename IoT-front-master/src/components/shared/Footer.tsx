import React from "react";
import {Box, Typography} from "@mui/material";

function Footer() {
    return <>
        <Box sx={{backgroundColor: 'black', width: "100%", padding: '15px'}}>
            <Typography textAlign={"center"} component={"p"} variant={"p"}>
                2024 &copy;<i>Technologie webowe w aplikacjach internetu rzeczy</i> <b>Karol Nowak</b>
            </Typography>
        </Box>
    </>
}

export default Footer;