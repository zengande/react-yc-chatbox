import * as dd from 'dingtalk-jsapi';
import axios from 'axios';

const ddService = {
    getUserInfo: (corpId, token, callback) => {
        // 免登获取钉钉用户信息
        dd.runtime.permission.requestAuthCode({
            corpId: corpId,
            onSuccess: (result) => {
                const { code } = result;
                axios({
                    method: 'get',
                    url: `/api/SampleData/GetUserInfo?code=${code}&token=${token}`,
                }).then((response) => {
                    if (response.data && response.data.code === 0) {
                        const { data } = response.data;
                        callback(data);
                    }
                }).catch(error => {
                    alert(error);
                })
            },
            onFail: (err) => {
                alert(JSON.stringify(err))
            }
        });
    }
}

export default ddService;