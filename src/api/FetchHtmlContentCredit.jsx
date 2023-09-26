import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { WebView } from "react-native-webview";

export default function FetchHtmlContentCredit({
  url,
  onContentFetched,
  username,
  password,
}) {
  const webViewRef = React.useRef(null);
  const [webViewUrl, setWebViewUrl] = useState(
    "https://webapp.yuntech.edu.tw/YunTechSSO/Account/Login?lang=zh-TW"
  );

  const [htmlContent, setHtmlContent] = useState([]);
  const [semesterList, setSemesterList] = useState([]); // ["1121", "1112", "1111", "1102", "1101"

  const getHTMLDataJS = () => {
    let script = "";

    // Post the entire HTML
    // script += 'window.ReactNativeWebView.postMessage(document.documentElement.outerHTML);';

    // Extract option values and post
    script += 'let selectElement = document.querySelector(\'select[id*="_MainContent_AcadSeme"]\');';
    script += 'let optionValues = Array.from(selectElement.options).map(option => option.value);';
    script += 'window.ReactNativeWebView.postMessage(optionValues.join(",")+"GET_SMESTER_LIST_FROM_HTML");'  // Joining the values for easy reading
    script += 'true;';

    return script;
  };

  const automateSemesterFetching = (semester) => {
    return `
        // Set the value of the <select> element
        selectElement.value = semester;

        // Trigger page refresh
        __doPostBack('ctl00$MainContent$AcadSeme','');

        // Increment the index for the next iteration
        currentIndex++;

        //pose to React native events
        data.push(document.documentElement.outerHTML);

        // After a delay (to allow the page to refresh), process the next semester
        setTimeout(processNextSemester, 3000);  // 3 seconds delay for demonstration, can be adjusted

        // message to React native events
        window.ReactNativeWebView.postMessage(data.join(",")+"GET_SMESTER_DATA_FROM_HTML");
    }
    `;
  }

  // This function can be called from the React Native WebView component to initiate the automation.



  const onMessage = (event) => {
    const htmlContent = event.nativeEvent.data;

    // get semester list from htmlContent if dectet array look like "1121,1112,1111,1102,1101" or "1121"
    if (htmlContent.includes("GET_SMESTER_LIST_FROM_HTML")) {
      let semesterList
      semesterList = htmlContent.split("GET_SMESTER_LIST_FROM_HTML")[0];
      semesterList = semesterList.split(",");
      // setSemesterList(semesterList);
      onContentFetched(semesterList);
    } 

    // onContentFetched(htmlContent);
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
