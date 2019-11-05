import { useEffect, useRef } from "react";

//This is similar to useEffect but only callbacks after a change. (so skips initial call)
// Source: https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
export const useDidUpdateEffect = (onChange: () => void, inputs: any[]) => {

    const didMountRef = useRef(false);

    useEffect(() => {
        if (didMountRef.current)
            onChange();
        else
            didMountRef.current = true;
    }, inputs);
}