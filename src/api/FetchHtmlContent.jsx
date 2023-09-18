import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { WebView } from "react-native-webview";

export default function FetchHtmlContent({
  url,
  onContentFetched,
  username,
  password,
}) {
  const webViewRef = React.useRef(null);
  const [webViewUrl, setWebViewUrl] = useState(
    "https://webapp.yuntech.edu.tw/YunTechSSO/Account/Login"
  );

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
        setTimeout(() => {
            try {
                const usernameField = document.getElementsByName('pLoginName')[0];
                const passwordField = document.getElementsByName('pLoginPassword')[0];
                const loginButton = document.getElementById('LoginSubmitBtn');
                
                if (usernameField && passwordField && loginButton) {
                    usernameField.value = '${username}';
                    passwordField.value = '${password}';
                    loginButton.click();
                } else {
                    //window.ReactNativeWebView.postMessage('Elements not found');
                }
            } catch (e) {
                window.ReactNativeWebView.postMessage('Error: ' + e.toString());
            }
        }, 100); // Wait for 0.1 seconds
        true;
    `;
};



  const handleNavigationStateChange = (newNavState) => {
    if (newNavState.loading === false && newNavState.url === url) {
        webViewRef.current.injectJavaScript(getHTMLDataJS());
    } else {
        setWebViewUrl(url);
    }
};


  const injectLoginScript = () => {
    webViewRef.current.injectJavaScript(loginJavaScript());
    setWebViewUrl(url);
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
