
import React from 'react';

interface HeadingProps {
    defaultDelay: number;
    whiteAI: any;
    blackAI: any;
    onDelayChange: (delay: number) => void;
}

let delayInput: React.RefObject<HTMLInputElement> = React.createRef();

const changeDelay = (callback: (delay: number) => void, defaultDelay: number) => {
    if (delayInput.current) {
        if (delayInput.current.value === '' || isNaN(Number(delayInput.current.value))) {
            callback(defaultDelay);
        } else {
            callback(Number(delayInput.current.value));
        }
    }
}

const Heading: React.FC<HeadingProps> = (props) => <>
    <div className='heading'>
        <h1>Game of the Amazons</h1>

        <table>
            <tbody>
                <tr>
                    <td>Computer delay</td>
                    <td><input type="text" placeholder={String(props.defaultDelay) + ' milliseconds'} ref={delayInput} /></td>
                    <td><button onClick={() => changeDelay(props.onDelayChange, props.defaultDelay)}>Change delay</button></td>
                </tr>
                <tr>
                    <td>White AI</td>
                    <td colSpan={2}>{props.whiteAI}</td>
                </tr>
                <tr>
                    <td>Black AI</td>
                    <td colSpan={2}>{props.blackAI}</td>
                </tr>
            </tbody>
        </table>
    </div>
</>;

export { Heading };
