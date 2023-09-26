import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { WebView } from "react-native-webview";
export default function FetchHtmlContentFromYear({
  url,
  semesterYear,
  onContentFetched,
  username,
  password,
}) {
  const webViewRef = React.useRef(null);

  const [hasYearBeenSet, setHasYearBeenSet] = useState(false);
  const [isDataGotten, setIsDataGotten] = useState(false);
  const [timer, setTimer] = useState(0);

  const selectYear = () => {
    let script = "";
    script += `document.getElementById('ctl00_MainContent_AcadSeme')[0].value = ${semesterYear};`;
    script += '__doPostBack(\'ctl00$MainContent$AcadSeme\',\'\');';
    script += 'true;';
    return script;
  };

  const getHTMLJS = () => {
    const script = `window.ReactNativeWebView.postMessage(document.documentElement.outerHTML);`;
    return script;
  }

  const onMessage = (event) => {
    const htmlContent = event.nativeEvent.data;
    onContentFetched(htmlContent);
  };

  const handleNavigationStateChange = (newNavState) => {
    if (newNavState.loading === false) {
      if (!hasYearBeenSet) {
        console.log('Setting year and refreshing page');
        webViewRef.current.injectJavaScript(selectYear());
        setHasYearBeenSet(true);
      } else if (!isDataGotten) {
        // console.log('Fetching HTML content');
        // webViewRef.current.injectJavaScript(getHTMLJS());
        // setIsDataGotten(true);
      }
    }
  };

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={["*"]}
      thirdPartyCookiesEnabled={true}
      sharedCookiesEnabled={true}
      source={{ uri: url }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={onMessage}
      onNavigationStateChange={handleNavigationStateChange}
      onLoadEnd={() => {
        setTimer(timer + 1);
        if(timer >= 1) {
          webViewRef.current.injectJavaScript(getHTMLJS());
        }
      }}
    />
  );
}
