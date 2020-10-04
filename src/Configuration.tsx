
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

const Configuration: React.FC<HeadingProps> = (props) => (
    <div className='configuration'>
        <h3>Configuration</h3>
        <table>
            <tbody>
                <tr>
                    <td>Computer delay</td>
                    <td>
                        <input type='text' placeholder={String(props.defaultDelay) + ' milliseconds'} ref={delayInput} />
                        <input type='button' onClick={() => changeDelay(props.onDelayChange, props.defaultDelay)} value='Change'/>
                    </td>
                </tr>
                <tr>
                    <td>White AI</td>
                    <td>{props.whiteAI}</td>
                </tr>
                <tr>
                    <td>Black AI</td>
                    <td>{props.blackAI}</td>
                </tr>
            </tbody>
        </table>
    </div>
);

export { Configuration };
