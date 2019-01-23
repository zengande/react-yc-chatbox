import * as React from 'react';
import './IconFont.css';

class IconFont extends React.Component<{ type: string, style?: React.CSSProperties | undefined }>{

    render() {
        const { type, style } = this.props;
        return (
            <i className={`iconfont icon-${type}`} style={style}></i>
        )
    }
}

export default IconFont;