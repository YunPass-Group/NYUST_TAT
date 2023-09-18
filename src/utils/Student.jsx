import { FetchHtmlContent } from "../api";
import { useState } from "react";

// handle data
import { extractCourseDetails } from "./DataProcess/";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Student(username, password, onDataUpdated) {
  return {
    getCourseList: () => {

      return (
        <FetchHtmlContent
          url="https://webapp.yuntech.edu.tw/WebNewCAS/StudentFile/Course/"
          onContentFetched={(htmlContent) => {
            let courses = extractCourseDetails(htmlContent);

            onDataUpdated(courses);
          }}
          username={username}
          password={password}
        />
      );
    },
  };
}
