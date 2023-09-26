import { useState } from "react";

// handle data
import {
  extractCoursesList,
  extractCoursesStudentList,
  extractCourseSyllabusAndTeachingPlan,
  extractStudentBasicInformation,
  extractSemeseterFromYear
} from "./DataProcess/";

import {FetchHtmlContentCredit, FetchHtmlContentFromYear, FetchHtmlContent } from "../api/";

export default function Student(username, password, onDataUpdated) {
  return {

    //student information

    getStudentInfo: () => {
      return (
        <FetchHtmlContent
          url="https://webapp.yuntech.edu.tw/eStudent/EStud/Default.aspx"
          onContentFetched={(htmlContent) => {
            onDataUpdated(extractStudentBasicInformation(htmlContent));
          }}
          username={username}
          password={password}
        />
      );
    },

    //course section

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
      if(courseDetialsURL === undefined || courseDetialsURL === null || courseDetialsURL === "") { 
        throw new Error("courseDetialsURL is not defined or null or empty");
      }
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
    },

    // TODO 選課流程/教師課程/校際選課/課程地圖

    // credit section

    getSemeseterList: () => {
      let semesterList = [];
      return (
          <FetchHtmlContentCredit
            url="https://webapp.yuntech.edu.tw/WebNewCAS/StudentFile/Score/"
            onContentFetched={(htmlContent) => {
              // onDataUpdated(extractSemeseterCredit(htmlContent));
              semesterList = htmlContent;
              onDataUpdated(htmlContent);
            }}
            username={username}
            password={password}
          />
      );
    },

    getCreditFromSemesterYear: (semesterYear, index) => {
      //this semesterYear something called when undified
      if(semesterYear == undefined || semesterYear == null || semesterYear == "") return;
      return (
        <FetchHtmlContentFromYear 
          key={index}
          url="https://webapp.yuntech.edu.tw/WebNewCAS/StudentFile/Score/"
          onContentFetched={(htmlContent) => {
            onDataUpdated(extractSemeseterFromYear(htmlContent, semesterYear, ""));
          }}
          username={username}
          password={password}
          semesterYear={semesterYear}
        />
      )
    }

  };
}
