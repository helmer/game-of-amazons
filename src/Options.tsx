
import React, {FormEvent, useEffect, useState} from 'react';
import { ComputerSmartness } from './computer/ComputerUtils';

interface OptionsProps {
    defaultDelay: number;
    onDelayChange: (delay: number) => void;
    defaultWhiteAI: ComputerSmartness;
    defaultBlackAI: ComputerSmartness;
    onChangeWhiteAI: (smartness: ComputerSmartness) => void;
    onChangeBlackAI: (smartness: ComputerSmartness) => void;
    onClose: () => void;
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

const ComputerSelector: React.FC<ComputerSelectorProps> = (p: ComputerSelectorProps) => {
    const [selected, setSelected] = useState(p.defaultValue);

    const updateSelected = (e: FormEvent<HTMLDivElement>) => {
        if (e.target) {
            const smartness = (e.target as HTMLInputElement).value as ComputerSmartness;
            p.onChange(smartness);
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
        <div className='optionsAI' onChange={ updateSelected }>
            <InputWithLabel name='None'   value={ ComputerSmartness.NONE   } selected={ ComputerSmartness.NONE   === selected } />
            <InputWithLabel name='Random' value={ ComputerSmartness.RANDOM } selected={ ComputerSmartness.RANDOM === selected } />
            <InputWithLabel name='Smart'  value={ ComputerSmartness.SMART  } selected={ ComputerSmartness.SMART  === selected } />
        </div>
    );
};

const Donate: React.FC = (p) => <>
    <form className='donate' action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>
        <input type='hidden' name='cmd' value='_s-xclick' />
        <input type='hidden' name='hosted_button_id' value='XBPDHM59DPX9E' />
        <button>
            <input type='button' name='submit' title='PayPal - The safer, easier way to pay online!' alt='' />
            Donate
        </button>
    </form>
</>

const Options: React.FC<OptionsProps> = (p) => {
    const handleKeyDown = (e: KeyboardEvent, p: OptionsProps) => {
        if (e.keyCode === 27) {
            p.onClose();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', e => handleKeyDown(e, p), false);
        return () => document.removeEventListener('keydown', e => handleKeyDown(e, p), false);
    }, [p]);

    return <>
        <div className='optionsModal'/>
        <div className='optionsContainer'>
            <div className='options'>
                <h3>Options</h3>
                <div className='optionsTable'>
                    <div><b>Computer delay (ms)</b></div>
                    <div><input type='number' min='0' max='10000' step='100' defaultValue='500' pattern='[0-9]*'
                                ref={delayInput} onChange={() => changeDelay(p.onDelayChange, p.defaultDelay)}/></div>
                    <div><b>White AI</b></div>
                    <ComputerSelector defaultValue={p.defaultWhiteAI} onChange={p.onChangeWhiteAI}/>
                    <div><b>Black AI</b></div>
                    <ComputerSelector defaultValue={p.defaultBlackAI} onChange={p.onChangeBlackAI}/>
                </div>

                <div className='optionsButtons'>
                    <Donate />
                    <div className='optionsClose'>
                        <button onClick={p.onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export { Options };
