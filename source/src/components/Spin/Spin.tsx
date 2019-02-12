import * as React from 'react';
const styles =require('./Spin.css');

export default (props: any) => {
    return (
        <div className={styles.spin}>
            加载中...
        </div>
    )
}