using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using YCAssistance.Common;
using YCAssistance.Models;

namespace ChatBoxDemo.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet("[action]")]
        public IEnumerable<WeatherForecast> WeatherForecasts(int startDateIndex)
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index + startDateIndex).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }

        [HttpGet("[action]")]
        public IActionResult GetDDConfig()
        {
            //获取Token
            var corpId = DingTalkConfig.CorpId;
            var corpSecret = DingTalkConfig.CorpSecret;
            var token = DingTalkHelper.GetAccessToken(corpId, corpSecret);
            //HttpContext.Session.SetString("Token", _token);
            //获取部门
            //string _depart = DingTalkHelper.GetDepartmentsList(_token);
            //获取JsApiTicket
            var ticket = DingTalkHelper.GetJsApiTicket(token);
            //HttpContext.Session.SetString("Ticket", _ticket);
            //获取url
            string url = "http://10.0.1.46:5000/";//"http://" + HttpContext.Request.Host.ToString();
            //生成config信息
            var _ddconfig = DingTalkHelper.GetDingdingConfig(url, ticket);
            Dictionary<string, string> dic = new Dictionary<string, string>();
            if (_ddconfig.Code == ResultModel.ResultCode.Success)
            {
                dic = (Dictionary<string, string>)_ddconfig.Data;

                ViewBag.AgentId = dic["agentId"];
                ViewBag.Timestamp = dic["timeStamp"];
                ViewBag.Noncestr = dic["nonceStr"];
                ViewBag.Signature = dic["signature"];

                return Ok(new { token, ticket, corpId, url, agentId = dic["agentId"], timeStamp = dic["timeStamp"], nonceStr = dic["nonceStr"], signature = dic["signature"] });
            }

            return Ok();
        }

        /// <summary>
        /// 根据code和token获取用户信息
        /// </summary>
        /// <param name="code"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        [HttpGet("[action]")]
        public IActionResult GetUserInfo(string code, string token)
        {
            var _userid = DingTalkHelper.GetUserId(token, code);
            var userInfo = DingTalkHelper.GetUserInfo(token, _userid);
            ResultModel.ResultInfo<object> result = new ResultModel.ResultInfo<object>();
            result.Data = userInfo;
            // 将当前钉钉用户的用户信息保存到session中
            result.Code = ResultModel.ResultCode.Success;
            result.Message = "免登录，获取个人信息成功！";
            return Ok(result);
        }

        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }
}
