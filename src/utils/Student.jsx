import { FetchHtmlContent } from "../api";
import { useState } from "react";

export default function Student( username, password, onDataUpdated) {

    const [htmlContent, setHtmlContent] = useState(null);

  return {
    getCourseList: () => {
      return (
        <FetchHtmlContent
          url="https://webapp.yuntech.edu.tw/WebNewCAS/StudentFile/Course/"
          onContentFetched={(htmlContent) => {
            onDataUpdated(htmlContent);
          }}
          username={username}
          password={password}
        />
      );
    },
  };
}
