import * as React from 'react';
const styles = require('./Header.css');

export interface IHeaderProps {
    title?: React.ReactNode;
    className?: string
}

class Header extends React.PureComponent<IHeaderProps> {
    static defaultProps = {
        title: '标题栏'
    }

    render() {
        const { title, className } = this.props;

        return (
            <div className={className}>
                <div className={styles.title}>
                    {title}
                </div>
            </div>
        )
    }
}

export default Header;