
import { useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from "@mui/material";

interface OptionsPickerProps {
    options: string[];
    pick: (index: number) => void;
}

export default function OptionsPicker({ options, pick }: OptionsPickerProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                sx={{ padding: 1, position: 'absolute', right: 0 }}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 20 * 4.5,
                        width: '15ch',
                    },
                }}
            >
                {
                    options.map(
                        (option, index) =>
                            <MenuItem key={index} onClick={() => {
                                pick(index)
                                handleClose()
                            }}>
                                {option}
                            </MenuItem>
                    )
                }
            </Menu>
        </>
    )
}