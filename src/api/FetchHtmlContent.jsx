import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { WebView } from "react-native-webview";

export default function FetchHtmlContent({ url, onContentFetched, username, password }) {
  const webViewRef = React.useRef(null);
  const [webViewUrl, setWebViewUrl] = useState(
    "https://webapp.yuntech.edu.tw/YunTechSSO/Account/Login"
  );
  const [loginScriptInjected, setLoginScriptInjected] = useState(false);

  const getHTMLDataJS = () => `
    window.ReactNativeWebView.postMessage(document.documentElement.outerHTML);
    true; // Note: this is important to avoid returning undefined
  `;

  const onMessage = (event) => {
    const htmlContent = event.nativeEvent.data;
    // console.log(htmlContent);
    onContentFetched(htmlContent);
  };

  const loginJavaScript = () => {
    return `
      if (document.getElementsByName('pLoginName').length > 0 && document.getElementsByName('pLoginPassword').length > 0) {
        document.getElementsByName('pLoginName')[0].value = ${username};
        document.getElementsByName('pLoginPassword')[0].value = ${password};
        if (document.getElementById('LoginSubmitBtn')) {
          document.getElementById('LoginSubmitBtn').click();
        }
      }
      true;
    `;
  };

  const handleNavigationStateChange = (newNavState) => {
    if (newNavState.url === url) {
      // webViewRef.current.injectJavaScript(getHTMLDataJS());
    }else{
      setWebViewUrl(
        url
      );
    }
    webViewRef.current.injectJavaScript(getHTMLDataJS());
  }

  const injectLoginScript = () => {
    // if (!loginScriptInjected) {
      webViewRef.current.injectJavaScript(loginJavaScript());
      setLoginScriptInjected(true);
      setWebViewUrl(
        url
      );
    // }
  };

  return (
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        thirdPartyCookiesEnabled={true}
        source={{ uri: webViewUrl }}
        javaScriptEnabled={true}
        onMessage={onMessage}
        onLoadEnd={injectLoginScript}
        onNavigationStateChange={handleNavigationStateChange}
      />

  );
}