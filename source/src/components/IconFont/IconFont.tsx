import * as React from 'react';
import './IconFont.css';

export interface IconFontProps {
    type: string;
    style?: React.CSSProperties;
    spin?: boolean;
}

class IconFont extends React.Component<IconFontProps>{
    static defaultProps = {
        spin: false
    }

    render() {
        const { type, style, spin } = this.props;
        let className = `iconfont icon-${type}`;
        if (spin) {
            className += ' yc-spin';
        }

        return (
            <i className={className} style={style}></i>
        )
    }
}

export default IconFont;