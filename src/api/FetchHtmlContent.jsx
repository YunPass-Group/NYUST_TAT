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
    "https://webapp.yuntech.edu.tw/YunTechSSO/Account/Login?lang=zh-TW"
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
                    //click switch with class k-switch k-widget k-switch-off
                    document.getElementsByClassName('k-switch k-widget k-switch-off')[0].click();
                    loginButton.click();
                } else {
                    //window.ReactNativeWebView.postMessage('Elements not found'); // Logined
                }
            } catch (e) {
                window.ReactNativeWebView.postMessage('Error: ' + e.toString());
            }
        }, 500); // Wait for 0.5 seconds
        
        true;
    `;
};
// https://webapp.yuntech.edu.tw/YunTechSSO/Account/ChangePassword


  const handleNavigationStateChange = (newNavState) => {

    if (newNavState.loading === false && newNavState.url === url) {
        webViewRef.current.injectJavaScript(getHTMLDataJS());
    } else {
        setWebViewUrl(url);
        // // refresh();
        // webViewRef.current.setWebViewUrl(url);
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
      sharedCookiesEnabled={true}
      source={{ uri: webViewUrl }}
      setWebViewUrl={setWebViewUrl}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={onMessage}
      onLoadEnd={injectLoginScript}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
}
