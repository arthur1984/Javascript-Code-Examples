var LL_Rules = [];

/*
* Business rules JavaScript Library v1.0.0
* Date: December 22 15:33:00 2011 -0500
*/
var LL_BR_Core = new function() {

    this.Domain = "";

    this.BaseUrl = "";

    this.SiteId = "";

    this.PageTime = 0;

    this.LastActivityTime = 0;

    this.Init = function() {
        setInterval("LL_BR_Core.IncreasePageTime()", 1000);
        setInterval("LL_BR_Core.Rules.CheckRules()", 1000);

        LL_BR_Core.Helper.AddEvent(document, "mousedown", function() {
            LL_BR_Core.LastActivityTime = LL_BR_Core.PageTime;
            LL_BR_Core.Debug.WriteLog("activity", LL_BR_Core.LastActivityTime);
        });

        LL_BR_Core.Helper.AddEvent(document, "keydown", function() {
            LL_BR_Core.LastActivityTime = LL_BR_Core.PageTime;
            LL_BR_Core.Debug.WriteLog("activity", LL_BR_Core.LastActivityTime);
        });
    };

    this.IncreasePageTime = function() {
        LL_BR_Core.PageTime++;
        LL_BR_Core.Debug.WriteLog("time", LL_BR_Core.PageTime);
    };

    //Conditions
    this.Conditions = new function() {
        //Condition id : 101
        this.CheckCurrentURL = function(contain, type, url) {
            if (!contain || !type || !url) {
                return false;
            }
            return LL_BR_Core.Helper.CompareString(contain, type, document.location.href, url);
        };

        //Condition id : 102
        this.CheckReferrerURL = function(contain, type, url) {
            if (!contain || !type || !url) {
                return false;
            }
            return LL_BR_Core.Helper.CompareString(contain, type, document.referrer, url);
        };

        //Condition id : 204
        this.CheckCurrentHTML = function(contain, type, text) {
            if (!contain || !type || !text) {
                return false;
            }
            var content = document.getElementsByTagName("body")[0].innerHTML;
            return LL_BR_Core.Helper.CompareString(contain, type, content, text);
        };

        //Condition id : 301
        this.CheckInactivity = function(delay) {
            try {
                var d = parseInt(delay);
                if (d) {
                    return (LL_BR_Core.PageTime - LL_BR_Core.LastActivityTime) >= d;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        };

        //Condition id : 401
        this.IsAgentAvailable = function() {
            return false;
        };

        //Condition id : 700
        this.IsICBSupported = function() {
            var browser = LL_BR_Core.Helper.DetectBrowser();
            if ((browser.WebSocket && browser.PostMessage && browser.LocalStorage) || (browser.BrowserName == "MSIE" && browser.BrowserVersion >= "8.0")) {
                return true;
            }
            return false;
        };

        //Condition id : 701
        this.IsACBSupported = function() {
            var browser = LL_BR_Core.Helper.DetectBrowser();
            if (browser.BrowserName == "MSIE" && browser.NetVersion >= "2.0") {
                LL_BR_Core.Debug.WriteLog("log", "---ACB Detection---");
                LL_BR_Core.Debug.WriteLog("log", "Browser - IE");
                LL_BR_Core.Debug.WriteLog("log", ".NET Version >= 2.0");
                LL_BR_Core.Debug.WriteLog("log", "---");
                return true;
            }
            if (navigator.javaEnabled() == true) {
                var topJavaVersion = "";
                var requiredJavaVersion = "1.5";

                var jreArray = deployJava.getJREs();
                var count = jreArray.length;
                if (count) {
                    for (var i = 0; i < count; i++) {
                        var pluginVer = jreArray[i];
                        var versionRequirementsMet = !requiredJavaVersion || (requiredJavaVersion && (("" + requiredJavaVersion) < ("" + pluginVer)));
                        if (versionRequirementsMet) {
                            if (("" + topJavaVersion) < ("" + pluginVer)) {
                                topJavaVersion = pluginVer;
                            }
                        }
                    }
                }
                if (topJavaVersion) {
                    LL_BR_Core.Debug.WriteLog("log", "---ACB Detection---");
                    LL_BR_Core.Debug.WriteLog("log", "Java Enabled");
                    LL_BR_Core.Debug.WriteLog("log", "Java Version = " + topJavaVersion);
                    LL_BR_Core.Debug.WriteLog("log", "---");
                    return true;
                }
            }
            if (browser.BrowserName == "Chrome" && browser.OS == "Windows" && (browser.OSVersion == "Vista" || browser.OSVersion == "7" || browser.OSVersion == "8")) {
                var clickOnceSupported = 0;
                if (window.clientInformation && window.clientInformation.plugins) {
                    for (var i = 0; i < clientInformation.plugins.length; i++) {
                        if (clientInformation.plugins[i].name == 'ClickOnce plugin for Chrome') {
                            clickOnceSupported = 1;
                        }
                    }
                }
                if (clickOnceSupported == 1) {
                    LL_BR_Core.Debug.WriteLog("log", "---ACB Detection---");
                    LL_BR_Core.Debug.WriteLog("log", "Browser - Chrome");
                    LL_BR_Core.Debug.WriteLog("log", "ClickOnceSupported");
                    LL_BR_Core.Debug.WriteLog("log", "---");
                    return true;
                }

            }
            if (browser.BrowserName == "Firefox" && browser.NetVersion >= "2.0") {
                LL_BR_Core.Debug.WriteLog("log", "---ACB Detection---");
                LL_BR_Core.Debug.WriteLog("log", "Browser - Firefox");
                LL_BR_Core.Debug.WriteLog("log", ".NET Version >= 2.0");
                LL_BR_Core.Debug.WriteLog("log", "---");
                return true;
            }
            return false;
        };

    }; //end conditions

    //Actions
    this.Actions = new function() {
        //Action id : 101
        this.ShowDynamicPopup = function(type) {
            LL_BR_Core.Debug.WriteLog("log", "LL_BR_Core.ShowDynamicPopup('" + type + "')");

            var body = document.getElementsByTagName("body")[0];
            LL_BR_Core.Helper.RemoveElement(body, "ll_script");

            var s = document.createElement("scr" + "ipt");
            s.id = 'll_script';
            s.src = LL_BR_Core.BaseUrl + "Popup.aspx?type=" + type;

            body.appendChild(s);
        };

        //Action id : 102
        this.ShowPopupLancher = function(id) {
            LL_BR_Core.Debug.WriteLog("log", "LL_BR_Core.ShowPopupLancher('" + id + "')");
            var el = document.getElementById(id);
            if (el) {
                if (el.style.display == "none") {
                    el.style.display = "block";
                }
                if (el.style.visibility == "hidden") {
                    el.style.visibility = "visible";
                }
            }
        };

        //Action id : 103
        this.CreatePopupLancher = function(id, style) {
            LL_BR_Core.Debug.WriteLog("log", "LL_BR_Core.CreatePopupLancher('" + id + "')");
            var el = document.getElementById(id);

            if (!el) {
                var el = document.createElement("div");
                el.id = id;
                document.getElementsByTagName("body")[0].appendChild(el);
            }
            LL_BR_Core.Helper.AddEvent(el, "click", function() { LL_BR_Core.Helper.C2A_Start(); });
            LL_BR_Core.Helper.SetStyle(el, style);
        };

        //Action id : 201
        this.AllowedControls = [];
        this.AllowedExitControls = function(ids) {
            LL_BR_Core.Debug.WriteLog("log", "LL_BR_Core.AllowedExitControls('" + ids + "')");
            if (!ids) {
                return;
            }
            var lids = ids.toLowerCase().split(';');
            for (var i = 0; i < lids.length; i++) {
                LL_BR_Core.Actions.AllowedControls.push(lids[i].toLowerCase());
            }
            var tags = "!doctype html head body title script style meta h1 h2 h3 h4 h5 h6 ul ol li p table th td tr object param embed aplet".split(" ");
            var elements = document.all ? document.all : document.getElementsByTagName('*');

            LL_BR_Core.Helper.AddEvent(document.getElementsByTagName("body")[0], "contextmenu", function(e) {
                LL_BR_Core.Helper.CancelEvent(e);
                return false;
            });

            for (var i = 0; i < elements.length; i++) {
                var id = elements[i].id.toLowerCase();

                var tag = elements[i].tagName.toLowerCase();
                if (!LL_BR_Core.Helper.Contains(tags, tag)) {
                    elements[i].onclick = null;
                    elements[i].onmousedown = null;
                    elements[i].onmouseup = null;

                    LL_BR_Core.Helper.AddEvent(elements[i], "click", function(e) {
                        var el = LL_BR_Core.Helper.ElementFromEvent(e);
                        if (!el.id || !LL_BR_Core.Helper.Contains(LL_BR_Core.Actions.AllowedControls, el.id.toLowerCase())) {
                            LL_BR_Core.Helper.CancelEvent(e);
                            return false;
                        }
                        return true;
                    });
                    LL_BR_Core.Helper.AddEvent(elements[i], "mousedown", function(e) {
                        var el = LL_BR_Core.Helper.ElementFromEvent(e);
                        if (!el.id || !LL_BR_Core.Helper.Contains(LL_BR_Core.Actions.AllowedControls, el.id.toLowerCase())) {
                            LL_BR_Core.Helper.CancelEvent(e);
                            return false;
                        }
                        return true;
                    });
                    LL_BR_Core.Helper.AddEvent(elements[i], "mouseup", function(e) {
                        var el = LL_BR_Core.Helper.ElementFromEvent(e);
                        if (!el.id || !LL_BR_Core.Helper.Contains(LL_BR_Core.Actions.AllowedControls, el.id.toLowerCase())) {
                            LL_BR_Core.Helper.CancelEvent(e);
                            return false;
                        }
                        return true;
                    });
                    if (tag == "form") {
                        elements[i].onsubmit = null;
                        LL_BR_Core.Helper.AddEvent(elements[i], "submit", function(e) {
                            var el = LL_BR_Core.Helper.ElementFromEvent(e);
                            if (!el.id || !LL_BR_Core.Helper.Contains(LL_BR_Core.Actions.AllowedControls, el.id.toLowerCase())) {
                                LL_BR_Core.Helper.CancelEvent(e);
                                return false;
                            }
                            return true;
                        });
                    }
                    if (tag == "input" || tag == "textarea") {
                        elements[i].onkeydown = null;
                        LL_BR_Core.Helper.AddEvent(elements[i], "keydown", function(e) {
                            var el = LL_BR_Core.Helper.ElementFromEvent(e);
                            var key = LL_BR_Core.Helper.KeyFromEvent(e);
                            if (key == "13" && (!el.id || !LL_BR_Core.Helper.Contains(LL_BR_Core.Actions.AllowedControls, el.id.toLowerCase()))) {
                                LL_BR_Core.Helper.CancelEvent(e);
                                return false;
                            }
                            return true;
                        });
                    }
                }
            }
        };

        //Action id : 104
        this.LoadICBScript = function(supported) {
            LL_BR_Core.Debug.WriteLog("log", "LL_BR_Core.LoadICBScript(" + supported + ")");

            var body = document.getElementsByTagName("body")[0];
            LL_BR_Core.Helper.RemoveElement(body, "ll_icb_script");

            var s = document.createElement("scr" + "ipt");
            s.id = 'll_icb_script';
            s.src = "//" + LL_BR_Core.Domain + "/webinterfaces/icb/client/js/icb_launch.aspx?supported=" + supported + "&siteid=" + LL_BR_Core.SiteId;

            body.appendChild(s);
        };

    }; //end actions

    //Helper
    this.Helper = new function() {

        this.AddEvent = new function() {
            var setListener;
            return function(el, ev, fn) {
                if (!setListener) {
                    if (el.addEventListener) {
                        setListener = function(el, ev, fn) {
                            el.addEventListener(ev, fn, false);
                        };
                    } else if (el.attachEvent) {
                        setListener = function(el, ev, fn) {
                            el.attachEvent('on' + ev, fn);
                        };
                    } else {
                        setListener = function(el, ev, fn) {
                            el['on' + ev] = fn;
                        };
                    }
                }
                setListener(el, ev, fn);
            };
        };

        this.RemoveElement = function(element, child_id) {
            if (document.getElementById(child_id)) {
                var child = document.getElementById(child_id);
                if (child) {
                    element.removeChild(child);
                }
            }
        };

        this.CompareString = function(contain, type, source, str) {
            source = source.toLowerCase();
            str = str.toLowerCase();
            var result = false;
            if (type == 1) {
                result = (source.indexOf(str) != -1);
            } else if (type == 2) {
                result = source.match(str);
            } else {
                return false;
            }
            if (contain == 1) {
                return result;
            } else if (contain == 2) {
                return !result;
            }
            return false;
        };

        this.CancelEvent = function(e) {
            if (!e) {
                e = window.event;
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.cancelBubble = true;
            e.cancel = true;
            e.returnValue = false;
        };

        this.Contains = function(array, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == value) {
                    return true;
                }
            }
            return false;
        };

        this.ElementFromEvent = function(e) {
            var el;
            if (e.target) {
                el = e.target;
            } else if (e.srcElement) {
                el = e.srcElement;
            }
            if (el.nodeType == 3) {
                // defeat Safari bug
                el = targ.parentNode;
            }
            return el;
        };

        this.KeyFromEvent = function(e) {
            var key;
            if (e.keyCode) {
                key = e.keyCode;
            } else if (e.which) {
                key = e.which;
            } else if (e.charCode) {
                key = e.charCode;
            }
            return key;
        };

        this.IsRightClick = function(e) {
            var rightclick = false;
            if (e.which) {
                rightclick = (e.which == 3);
            } else if (e.button) {
                rightclick = (e.button == 2);
            }
            return rightclick;
        };

        this.GetWindowSize = function() {
            var winW = 0;
            var winH = 0;
            if (document.body && document.body.offsetWidth) {
                winW = document.body.offsetWidth;
                winH = document.body.offsetHeight;
            }
            if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {
                winW = document.documentElement.offsetWidth;
                winH = document.documentElement.offsetHeight;
            } else if (window.innerWidth && window.innerHeight) {
                winW = window.innerWidth;
                winH = window.innerHeight;
            }
            return { 'Width': winW, 'Height': winH };
        };

        this.HidePopup = function(id) {
            document.getElementById(id).style.display = "none";
        };

        this.PopupTimer = null;
        this.PopupAnimation = function(elem, topFrom, topTo) {
            var top = topFrom + "";
            var pos = top.indexOf("px");
            if (pos != -1) {
                top = top.substring(0, pos);
            }
            function frame() {
                elem.style.top = top + 'px';

                if (top === topTo || top >= topTo) {
                    clearInterval(LL_BR_Core.Helper.PopupTimer);
                }
                top++;
            }
            LL_BR_Core.Helper.PopupTimer = setInterval(frame, 15);
        };

        this.SetStyle = function(element, style) {
            if (style.charAt(style.length - 1) == ';') {
                style = style.slice(0, -1);
            }
            var k, v = "";
            var splitted = style.split(';');

            var f = function(s) {
                for (var exp = /-([a-z])/; exp.test(s); s = s.replace(exp, RegExp.$1.toUpperCase()));
                return s.replace(" ", "");
            };

            for (var i = 0; i < splitted.length; i++) {
                k = v = "";

                var kv = splitted[i].split(':');
                k = f(kv[0]);
                if (kv.length == 2) {
                    v = kv[1];
                } else {
                    for (var j = 1; j < kv.length; j++) {
                        v += (((j > 1) ? ":" : "") + kv[j]);
                    }
                }

                try {
                    eval("element.style." + k + "='" + v + "';");
                } catch (e) { }
            }
        };

        this.C2A_OnClickCalled = 0;
        this.C2A_Start = function() {
            try {
                var url = "//" + LL_BR_Core.Domain + "/welcome/start.aspx?siteid=" + LL_BR_Core.SiteId;
                LL_BR_Core.Helper.C2A_OnClickCalled++;
                if (LL_BR_Core.Helper.C2A_OnClickCalled <= 1) {
                    window.open(url, "LiveLOOK_Co_Browsing_C2A", "toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,titlebar=0,status=0,width=940,height=660,left=" + ((screen.width - 940) / 2) + ",top=" + (screen.height < 800 ? 0 : (screen.height - 710) / 2));
                    LL_BR_Core.Helper.C2A_OnClickCalled = 0;
                }
            } catch (ex) { }
        };

        this.DetectBrowser = function() {
            var ua = navigator.userAgent.toLowerCase();
            var Browser = {};
            Browser.OS = "";
            Browser.OSVersion = "";
            Browser.BrowserName = "";
            Browser.BrowserVersion = "";
            Browser.NetVersion = "";
            Browser.WebSocket = false;
            Browser.PostMessage = false;
            Browser.LocalStorage = false;

            //OS detection
            if (/windows/.test(ua)) {
                Browser.OS = "Windows";
            } else if (/macintosh/.test(ua)) {
                Browser.OS = "Mac";
            } else if (/linux/.test(ua)) {
                Browser.OS = "Linux";
            }
            //System version
            if (Browser.OS == "Windows") {
                if (/nt[\/\s](\d+\.\d+)/.test(ua)) {
                    if (RegExp.$ == "6.0") {
                        Browser.OSVersion = "Vista";
                    }
                    if (RegExp.$ == "6.1") {
                        Browser.OSVersion = "7";
                    }
                    if (RegExp.$ == "6.2") {
                        Browser.OSVersion = "8";
                    }
                }
            }
            //Browser detection
            if (/firefox[\/\s](\d+\.\d+)/.test(ua)) {
                Browser.BrowserName = "Firefox";
                Browser.BrowserVersion = "" + RegExp.$1;
            } else if (/msie[\/\s](\d+\.\d+)/.test(ua)) {
                Browser.BrowserName = "MSIE";
                Browser.BrowserVersion = "" + RegExp.$1;
            } else if (/opera/.test(ua) && /version[\/\s](\d+\.\d+)/.test(ua)) {
                Browser.BrowserName = "Opera";
                Browser.BrowserVersion = "" + RegExp.$1;
            } else if (/chrome[\/\s](\d+\.\d+)/.test(ua)) {
                Browser.BrowserName = "Chrome";
                Browser.BrowserVersion = "" + RegExp.$1;
            } else {
                if (Browser.OS == "Mac") {
                    if (/safari[\/\s](\d+\.\d+)/.test(ua)) {
                        Browser.BrowserName = "Safari";
                        Browser.BrowserVersion = "" + RegExp.$1;
                    }
                } else {
                    if (/version[\/\s](\d+\.\d+)/.test(ua)) {
                        Browser.BrowserName = "Safari";
                        Browser.BrowserVersion = "" + RegExp.$1;
                    }
                }
            }
            //.NET detection
            var match = ua.match(/\.net(\d+\.\d+)|\.net\sclr\s(\d+\.\d+)/g);
            if (match) {
                for (var i = 0; i < match.length; i++) {
                    match[i] = match[i].replace(/\.net\sclr\s/, "").replace(/\.net/, "");
                }
                match.sort();
                Browser.NetVersion = match[match.length - 1];
            }
            //WebSocket, PostMessage, LocalStorage
            Browser.WebSocket = ("WebSocket" in window);
            Browser.PostMessage = ("postMessage" in window);
            Browser.LocalStorage = ("localStorage" in window);
            
            return Browser;
        }
    }; //end helper

    //Rules
    this.Rules = new function() {

        this.CheckRules = function() {
            for (var i = 0; i < LL_Rules.length; i++) {
                if (!LL_Rules[i].AlreadyFired && LL_BR_Core.Rules.CheckConditions(LL_Rules[i])) {
                    LL_BR_Core.Debug.WriteLog("log", "Rule running Id - " + LL_Rules[i].Id);
                    LL_Rules[i].AlreadyFired = true;
                    if (LL_Rules[i].StopProcessingAfterRule) {
                        LL_BR_Core.Debug.WriteLog("log", "Stop processing after rule");
                        for (var j = 0; j < LL_Rules.length; j++) {
                            LL_Rules[j].AlreadyFired = true;
                        }
                    }
                    LL_BR_Core.Rules.FireActions(LL_Rules[i]);
                }
            }
        };

        this.CheckConditions = function(rule) {
            var ct = rule.ConditionType.toLowerCase();
            if (ct == "expression") {
                if (!rule.ConditionExpression) {
                    return false;
                }
                var ce = rule.ConditionExpression.toLowerCase();
                ce = ce.replace(new RegExp("and", 'g'), "&&");
                ce = ce.replace(new RegExp("or", 'g'), "||");
                var ce2 = ce.replace(new RegExp("\\&", 'g'), "");
                ce2 = ce2.replace(new RegExp("\\|", 'g'), "");
                ce2 = ce2.replace(new RegExp('\\(', 'g'), "");
                ce2 = ce2.replace(new RegExp('\\)', 'g'), "");
                ce2 = ce2.replace(new RegExp("  ", 'g'), " ");
                ce2 = ce2.replace(new RegExp("   ", 'g'), " ");
                var ce3 = ce2.split(" ");
                try {
                    for (var i = 0; i < ce3.length; i++) {
                        ce = ce.replace(new RegExp(ce3[i], 'g'), rule.Conditions[parseInt(ce3[i]) - 1]());
                    }
                    return eval(ce);
                } catch (e) {
                    return false;
                }
            }
            var b = false;
            if (ct == "all") {
                b = true;
            }
            for (var i = 0; i < rule.Conditions.length; i++) {
                switch (ct) {
                    case "all":
                        b = (b && rule.Conditions[i]());
                        break;
                    case "any":
                        b = (b || rule.Conditions[i]());
                        break;
                }
            }
            return b;
        };

        this.FireActions = function(rule) {
            for (var i = 0; i < rule.Actions.length; i++) {
                rule.Actions[i]();
            }
        };

    }; //end rules

    //Debug
    this.Debug = new function() {
        this.IsDebug = false;

        this.WriteLog = function(type, value) {

            if (LL_BR_Core.Debug.IsDebug) {
                if (!document.getElementById("ll_debug")) {
                    var debug = document.createElement("div");
                    debug.id = "ll_debug";
                    LL_BR_Core.Helper.SetStyle(debug, "width:300px; background-color:#fff; border:solid 1px Gray; position:absolute; top:5px; left:5px; padding:5px; z-index:100000; font-size:10pt; font-family:Verdana;");
                    document.getElementsByTagName("body")[0].appendChild(debug);

                    var title = document.createElement("h4");
                    title.id = "ll_title";
                    title.innerHTML = "LLRules debug panel"
                    var time = document.createElement("div");
                    time.id = "ll_time";
                    var activity = document.createElement("div");
                    activity.id = "ll_activity";
                    var log = document.createElement("div");
                    log.id = "ll_log";
                    debug.appendChild(title);
                    debug.appendChild(time);
                    debug.appendChild(activity);
                    debug.appendChild(log);
                }
                switch (type) {
                    case "time":
                        var el = document.getElementById("ll_time");
                        el.innerHTML = "Page time : " + value;
                        break;
                    case "activity":
                        var el = document.getElementById("ll_activity");
                        el.innerHTML = "Last activity : " + value;
                        break;
                    case "log":
                        var el = document.getElementById("ll_log");
                        el.innerHTML = el.innerHTML + value + "<br />";
                        break;
                }
            }
        };

    }; //end debug
};  //end core



LL_BR_Core.Domain = 'www.sharescreen.net';

LL_BR_Core.BaseUrl = 'http://www.sharescreen.net/services/LLRules/';

LL_BR_Core.SiteId = 'aaa:SC807147:AM:1';

LL_BR_Core.Debug.IsDebug = false;

LL_BR_Core.Init();