
import React, { FormEvent, useState } from 'react';
import { ComputerSmartness } from './computer/ComputerUtils';

interface ConfigurationProps {
    defaultDelay: number;
    onDelayChange: (delay: number) => void;
    defaultWhiteAI: ComputerSmartness;
    defaultBlackAI: ComputerSmartness;
    onChangeWhiteAI: (smartness: ComputerSmartness) => void;
    onChangeBlackAI: (smartness: ComputerSmartness) => void;
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

interface ComputerSelectorProps {
    defaultValue: ComputerSmartness;
    onChange: (smartness: ComputerSmartness) => void;
}

const ComputerSelector: React.FC<ComputerSelectorProps> = (props: ComputerSelectorProps) => {
    const [selected, setSelected] = useState(props.defaultValue);

    const updateSelected = (e: FormEvent<HTMLDivElement>) => {
        if (e.target) {
            const smartness = (e.target as HTMLInputElement).value as ComputerSmartness;
            props.onChange(smartness);
            setSelected(smartness);
        }
    }

    const InputWithLabel: React.FC<{ name: string, value: string, selected: boolean }> = (p) => <>
        <label className='radioLabel'>
            { p.name }
            <input type='radio' value={ p.value } defaultChecked={ p.selected } />
            <span className='checkmark' />
        </label>
    </>;

    return (
        <div onChange={ updateSelected }>
            <InputWithLabel name='None'   value={ ComputerSmartness.NONE   } selected={ ComputerSmartness.NONE   === selected } />
            <InputWithLabel name='Random' value={ ComputerSmartness.RANDOM } selected={ ComputerSmartness.RANDOM === selected } />
            <InputWithLabel name='Smart'  value={ ComputerSmartness.SMART  } selected={ ComputerSmartness.SMART  === selected } />
        </div>
    );
};

const Configuration: React.FC<ConfigurationProps> = (props) => (
    <div className='configuration'>
        <h3>Configuration</h3>
        <table>
            <tbody>
                <tr>
                    <td><b>Computer delay</b></td>
                    <td>
                        <input type='text' placeholder={String(props.defaultDelay) + ' milliseconds'} ref={delayInput} />
                        <input type='button' className='configurationButton' onClick={() => changeDelay(props.onDelayChange, props.defaultDelay)} value='Change'/>
                    </td>
                </tr>
                <tr>
                    <td><b>White AI</b></td>
                    <td><ComputerSelector defaultValue={props.defaultWhiteAI} onChange={props.onChangeWhiteAI} /></td>
                </tr>
                <tr>
                    <td><b>Black AI</b></td>
                    <td><ComputerSelector defaultValue={props.defaultBlackAI} onChange={props.onChangeBlackAI} /></td>
                </tr>
            </tbody>
        </table>
    </div>
);

export { Configuration };
