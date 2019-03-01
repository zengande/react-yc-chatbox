using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using YCAssistance.Models;

namespace YCAssistance.Common
{
    public class DingTalkHelper
    {

        /// <summary>
        /// 获取钉钉Token
        /// </summary>
        /// <param name="corpId"></param>
        /// <param name="corpSecret"></param>
        /// <returns></returns>
        public static string GetAccessToken(string corpId, string corpSecret)
        {
            string url = string.Format("https://oapi.dingtalk.com/gettoken?corpid={0}&corpsecret={1}", corpId, corpSecret);
            try
            {
                string response = HttpRequestHelper.Get(url);
                ResultModel.AccessTokenModel oat = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultModel.AccessTokenModel>(response);

                if (oat != null)
                {
                    {
                        return oat.access_token;
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return string.Empty;
        }

        /// <summary>
        /// 获取企业部门列表
        /// </summary>
        /// <param name="accessToken"></param>
        /// <returns></returns>
        public static string GetDepartmentsList(string accessToken)
        {
            string url = string.Format("https://oapi.dingtalk.com/department/list?access_token={0}", accessToken);
            try
            {
                string response = HttpRequestHelper.Get(url);
                ResultModel.DepartmentListModel oat = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultModel.DepartmentListModel>(response);

                if (oat != null)
                {
                    {
                        return Newtonsoft.Json.JsonConvert.SerializeObject(oat.Department);
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return string.Empty;
        }

        /// <summary>
        /// 获取JS ticket
        /// </summary>
        /// <param name="accessToken"></param>
        /// <returns></returns>
        public static string GetJsApiTicket(string accessToken)
        {
            string url = string.Format("https://oapi.dingtalk.com/get_jsapi_ticket?access_token={0}", accessToken);
            try
            {
                string response = HttpRequestHelper.Get(url);
                ResultModel.JsApiTicketModel model = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultModel.JsApiTicketModel>(response);

                if (model != null)
                {
                    {
                        return model.ticket;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return string.Empty;
        }

        /// <summary>
        /// 获取Userid
        /// </summary>
        /// <param name="accessToken"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        public static string GetUserId(string accessToken, string code)
        {
            string url = string.Format("https://oapi.dingtalk.com/user/getuserinfo?access_token={0}&code={1}", accessToken, code);
            try
            {
                string response = HttpRequestHelper.Get(url);
                ResultModel.GetUserInfoModel model = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultModel.GetUserInfoModel>(response);

                if (model != null)
                {
                    return model.userid;
                }
                else
                {
                    throw new Exception(model.errmsg);
                }
            }

            catch (Exception ex)
            {
                throw;
            }
        }

        /// <summary>
        /// 获取UserInfo
        /// </summary>
        /// <param name="accessToken"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public static ResultModel.Dingding_User GetUserInfo(string accessToken, string userId)
        {
            string url = string.Format("https://oapi.dingtalk.com/user/get?access_token={0}&userid={1}", accessToken, userId);
            try
            {
                string response = HttpRequestHelper.Get(url);
                ResultModel.Dingding_User model = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultModel.Dingding_User>(response);

                if (model != null)
                {
                    return model;
                }
            }

            catch (Exception ex)
            {
                throw;
            }
            return null;
        }


        public static ResultModel.DepartmentInfo GetDepartmentInfo(string accessToken, string id)
        {
            string url = string.Format("https://oapi.dingtalk.com/department/get?access_token={0}&id={1}", accessToken, id);
            try
            {
                string response = HttpRequestHelper.Get(url);
                ResultModel.DepartmentInfo model = Newtonsoft.Json.JsonConvert.DeserializeObject<ResultModel.DepartmentInfo>(response);

                if (model != null)
                {
                    {
                        return model;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return null;
        }

        /// <summary>
        /// 获取时间戳
        /// </summary>
        /// <returns></returns>
        public static long GetTimeStamp()
        {
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalSeconds);
        }


        /// <summary>
        /// 签名算法 对string1进行sha1签名，得到signature
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        private static Access_Sdk GetSdk(string url, string jsApiTicket)
        {
            var noncestr = CommonHelper.GuidTo16String();
            var timestamp = GetTimeStamp().ToString();
            var string1 = "jsapi_ticket=" + jsApiTicket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
            var signature = CommonHelper.Sha1(string1);
            var sdk = new Access_Sdk();
            sdk.noncestr = noncestr;
            sdk.timestamp = timestamp;
            sdk.signature = signature;
            return sdk;
        }


        public static ResultModel.ResultInfo<object> GetDingdingConfig(string url, string jsApiTicket)
        {
            string _agentId = DingTalkConfig.AgentId;
            string _corpId = DingTalkConfig.CorpId;
            Access_Sdk sdk = GetSdk(url, jsApiTicket);
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("agentId", _agentId);
            dic.Add("corpId", _corpId);
            dic.Add("timeStamp", sdk.timestamp);
            dic.Add("nonceStr", sdk.noncestr);
            dic.Add("signature", sdk.signature);
            ResultModel.ResultInfo<object> result = new ResultModel.ResultInfo<object>();
            result.Code = ResultModel.ResultCode.Success;
            result.Data = dic;
            result.Message = "ok";
            return result;
        }

        /// <summary>
        /// 发送工作通知
        /// </summary>
        public static async Task<DDWorkNoticeSentResult> SendWorkNoticeAsync(DDMessage msg, string userids)
        {
            var access_token = GetAccessToken(DingTalkConfig.CorpId, DingTalkConfig.CorpSecret);
            // var t = (DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0)).TotalMilliseconds;
            var httpClient = HttpClientFactory.Create();

            var list = new List<KeyValuePair<string, string>>();
            list.Add(new KeyValuePair<string, string>("agent_id", "203886196"));
            list.Add(new KeyValuePair<string, string>("userid_list", userids));
            list.Add(new KeyValuePair<string, string>("msg", JsonConvert.SerializeObject(msg)));
            var requestContent = new FormUrlEncodedContent(list);
            var response = await httpClient.PostAsync($"https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2?access_token={access_token}", requestContent);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<DDWorkNoticeSentResult>(json);
            }
            return null;
        }
    }
}