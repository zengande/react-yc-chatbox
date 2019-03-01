import * as React from 'react';
import IconFont from '../IconFont';
import { Message } from '../MessageBox';
const styles = require('./FeedbackTooltip.css')

interface IFeedbackTooltipProps {
    message: Message;
    onItemSelected?: (message: Message, index: number) => boolean;
}

class FeedbackTooltip extends React.Component<IFeedbackTooltipProps> {
    state = {
        feedbackSucceeded: false,
        removeText: false
    }

    shouldComponentUpdate(nextProps: IFeedbackTooltipProps, nextState: any) {
        return nextState.feedbackSucceeded !== this.state.feedbackSucceeded ||
            nextState.removeText !== this.state.removeText;
    }

    itemClick = (index: number) => {
        const { feedbackSucceeded } = this.state;
        const { message, onItemSelected } = this.props;
        if (feedbackSucceeded) {
            return;
        }
        let success = false;
        if (onItemSelected) {
            success = onItemSelected(message, index);
        }
        this.setState({ feedbackSucceeded: success });
    }

    render() {
        const { feedbackSucceeded, removeText } = this.state;
        if (feedbackSucceeded) {
            setTimeout(() => {
                this.setState({ removeText: true })
            }, 2000);
        }

        return feedbackSucceeded ?
            !removeText && <p className={styles.text}>我们已经收集了您的反馈，非常感谢！</p> :
            <div className={styles.popover}>
                <ul className={styles.menus}>
                    <li onClick={() => { this.itemClick(1) }} className={styles.item}><IconFont type="biaoqing-gaoxing" />完美</li>
                    <li onClick={() => { this.itemClick(2) }} className={styles.item}><IconFont type="biaoqing-yiban" />还行</li>
                    <li onClick={() => { this.itemClick(3) }} className={styles.item}><IconFont type="biaoqing-bugaoxing" />糟糕</li>
                </ul>
            </div>
    }
}

export default FeedbackTooltip;