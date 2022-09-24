import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import "./radio-button.css";

export function RadioButton({ selectedValue, children, className, ...props }: {selectedValue: string } & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>): React.ReactElement {
    const classes = ((selected: boolean) => `radio-button ${className? className: ''} ${selected? 'radio-button-selected': 'radio-button-unselected'}`)(props.value === selectedValue);
    return <>
        <button {...Object.assign({}, props, {
            className: classes
        })}>
            {children}
        </button>
    </>
}