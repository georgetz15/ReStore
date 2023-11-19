import {InputBaseComponentProps} from "@mui/material";
import {forwardRef, Ref, useImperativeHandle, useRef} from "react";

interface Props extends InputBaseComponentProps {
}

// This element is created to create an input element with style of mui and functionality of stripe's card element
// See:
// - https://stripe.com/docs/stripe-js/react#element-components
// - https://react.dev/reference/react/useImperativeHandle
export const StripeInput = forwardRef(
    function StripeInput({
                             component: Component,
                             ...props
                         }: Props, ref: Ref<unknown>) {
        const elementRef = useRef<any>();

        useImperativeHandle(ref, () => ({
            focus: () => elementRef.current.focus
        }))

        return (
            <Component
                onReady={(element: any) => elementRef.current = element}
                {...props}
            />
        );
    })