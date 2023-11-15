import {FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";


interface Props {
    options: any[];
    onChangeEvent: (event: any) => void;
    selectedValue: string;
}

export default function RadioButtonGroup({options, onChangeEvent, selectedValue}: Props) {

    return (<FormControl>
        <RadioGroup onChange={onChangeEvent} value={selectedValue}>
            {options.map(({value, label}) =>
                <FormControlLabel
                    key={label}
                    control={<Radio/>}
                    value={value}
                    label={label}
                />)}
        </RadioGroup>
    </FormControl>)
}