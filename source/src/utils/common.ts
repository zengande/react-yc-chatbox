
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
    }

}
