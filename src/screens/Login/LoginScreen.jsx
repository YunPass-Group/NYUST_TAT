import { View, Text } from 'react-native'
import { WebView } from "react-native-webview";
import React from 'react'

const LoginScreen = () => {

    const webViewRef = React.useRef(null);
    const [webViewUrl, setWebViewUrl] = React.useState(
        "https://webapp.yuntech.edu.tw/YunTechSSO/Account/Login?lang=zh-TW"
    );

    const handleNavigationStateChange = () => `
    window.ReactNativeWebView.postMessage(document.documentElement.outerHTML);
    true; // Note: this is important to avoid returning undefined
  `;

    const onMessage = (event) => {
        const htmlContent = event.nativeEvent.data;
        // console.log(htmlContent);
        onContentFetched(htmlContent);
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
            // onLoadEnd={injectLoginScript}
            onNavigationStateChange={handleNavigationStateChange}
        />
    )
}

export default LoginScreen