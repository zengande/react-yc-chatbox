
export default {

    guid() {
        const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },

    getElementById<T extends HTMLElement>(id: string): T {
        return <T>document.getElementById(id);
    },

    convert<T>(source: any): T {
        try {
            return <T>(source);
        } catch (e) {
            throw `convert error!`
        }
    },

    formatSecond(second: number) {
        const h = Math.floor((second / 3600) % 24);
        const m = Math.floor((second / 60) % 60);
        const s = Math.round(second % 60);
        let result = s + "\'\'";
        if (m > 0) {
            result = m + "\'" + result;
        }
        if (h > 0) {
            result = h + ":" + result;
        }

        return result;
    },

    /**
 * 滚动
 * @param element 滚动元素
 * @param to 位置
 * @param duration 时间 
 */
    scrollTo(element: Element, to: number, duration: number) {
        if (!element || element === null) {
            return;
        }

        var start = element.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20;
        //t = current time
        //b = start value
        //c = change in value
        //d = duration
        const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        const animateScroll = function () {
            currentTime += increment;
            const val = easeInOutQuad(currentTime, start, change, duration);
            element.scrollTop = val;
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }

}
