import * as React from 'react';
const styles = require('./StarMarking.css');

export default class StarMarking extends React.Component<any, any> {
    static defaultProps = {
        canClick: true,
        rateNum: 5,
        handleSelectRate: null,
        rateValue: 0
    }

    constructor(props: any) {
        super(props)
        this.state = {
            rateValue: 0,
            rateArray: new Array(Number(props.rateNum)).fill('')
        }
    }

    handleSelectRate(value: number) {
        if (!this.props.canClick) {
            return
        }
        this.setState({
            rateValue: value
        })
        this.props.handleSelectRate && this.props.handleSelectRate(value)
    }

    render() {
        const { rateArray, rateValue } = this.state
        const { rateNum } = this.props
        return (
            <div className={styles.rate}>
                <div className={styles.rate_bg}>
                    {rateArray.map((item: any, index: number) => <span onClick={() => this.handleSelectRate(index + 1)} key={`rate_${index}`}>☆</span>)}
                    <div className={styles.bg_realrate} style={{ width: `calc(${rateValue ? rateValue : this.props.rateValue} / ${rateNum} * 100%)` }}>
                        {rateArray.map((item: any, index: number) => <span onClick={() => this.handleSelectRate(index + 1)} key={`rate_selected_${index}`}>★</span>)}
                    </div>
                </div>
            </div>
        )
    }
}