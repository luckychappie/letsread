import { InputProps, TextField } from '@mui/material';
import React from 'react'

type DebounceProps = {
    handleDebounce: (value: string) => void;
    debounceTimeout: number;
};

export default function DebounceSearchField(props: InputProps & DebounceProps) {

    const { handleDebounce, debounceTimeout, ...rest } = props;

    const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            handleDebounce(event.target.value);
        }, debounceTimeout);
    }
    return (
        <TextField fullWidth name="search" onChange={handleChange} id="outlined-basic" placeholder="Search" size="small" />
    )
}
