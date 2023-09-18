import { FetchHtmlContent } from "../api";
import { useState } from "react";

// handle data
import { extractCoursesList, extractCoursesStudentList, extractCourseSyllabusAndTeachingPlan } from "./DataProcess/";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Student(username, password, onDataUpdated) {
  return {
    getCourseList: () => {
      return (
        <FetchHtmlContent
          url="https://webapp.yuntech.edu.tw/WebNewCAS/StudentFile/Course/"
          onContentFetched={(htmlContent) => {
            onDataUpdated(extractCoursesList(htmlContent));
          }}
          username={username}
          password={password}
        />
      );
    },
    
    getCourseStudentList: (courseURL) => {
        return (
            <FetchHtmlContent
            url={courseURL}
            onContentFetched={(htmlContent) => {
                onDataUpdated(extractCoursesStudentList(htmlContent));
            }}
            username={username}
            password={password}
            />
        );
    },

    getCourseSyllabusAndTeachingPlan: (courseDetialsURL) => {
        return (
            <FetchHtmlContent
            url={courseDetialsURL}
            onContentFetched={(htmlContent) => {
                onDataUpdated(extractCourseSyllabusAndTeachingPlan(htmlContent));
            }}
            username={username}
            password={password}
            />
        );
    }
  };
}
