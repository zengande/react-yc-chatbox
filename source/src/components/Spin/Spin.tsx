import * as React from 'react';
const styles = require('./Spin.css');

export interface ISpinProps {
    scale?: number;
    className?: string
}

export default (props: ISpinProps) => {
    const scale = props.scale ? props.scale : 1;
    const { className } = props;
    return (
        <div className={`${styles.container} ${className}`} style={{ transform: `scale(${scale})` }}>
            <div className={styles.spinner} style={{ width: '100%', height: '100%' }}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}