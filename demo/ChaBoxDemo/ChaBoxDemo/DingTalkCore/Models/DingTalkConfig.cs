using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YCAssistance.Models
{
    public static class DingTalkConfig
    {
        public static string CorpId = "dingc134abc3630e0aa7";
        public static string CorpSecret = "-wmzv0nOLrfUW95wkfpYzE5phoQLEDgsYYIoAiX4pl5sCE60cKURGj2spSDmU8pi";
        public static string AgentId = "206547700";
    }

    public class Access_Sdk
    {
        public string signature { get; set; }
        public string noncestr { get; set; }
        public string timestamp { get; set; }
    }
}