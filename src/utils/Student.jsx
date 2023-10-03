import { useState } from "react";

import storage from "./storage";

// handle data
import {
  extractCoursesList,
  extractCoursesStudentList,
  extractCourseSyllabusAndTeachingPlan,
  extractStudentBasicInformation,
  extractSemeseterFromYear
} from "./DataProcess/";

import { FetchHtmlContentCredit, FetchHtmlContentFromYear, FetchHtmlContent } from "../api/";

export default function Student(username, password, onDataUpdated) {

  const EmptyView = ({ data, onContentFetched }) => {
    return (
      <View style={{
        height: 0,
      }}>{
          onContentFetched(data)
        }</View>

    )
  }
  return {

    getSemeseterList: () => {

      //TODO - chesk whether is saved, if not, get from api, otherwise, get from storage
      // storage.load({
      //   key: "semesterList",
      //   id: "semesterList",
      // })
      // .then((semesterList) => {
      //   console.warn("Loading offline data: ", JSON.stringify(semesterList.map(s => JSON.parse(JSON.parse(s)))));
      //   return(
      //     <EmptyView data={semesterList} onContentFetched={
      //       (data) => {
      //         onDataUpdated(data.map(s => JSON.parse(JSON.parse(s))));
      //       }
      //     }/>
      //   )
      // })


      return (
        <FetchHtmlContentCredit
          url="https://webapp.yuntech.edu.tw/WebNewCAS/StudentFile/Score/"
          onContentFetched={(htmlContent) => {
            // onDataUpdated(extractSemeseterCredit(htmlContent));
            console.log("Getting semester list from NYUST server...");
            //save to storage
            storage.save({
              key: "semesterList",
              id: "semesterList",
              data: htmlContent,
            });
            semesterList = htmlContent;
            onDataUpdated(htmlContent);
          }}
          username={username}
          password={password}
        />
      );
    },

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

    getCourseList: (year, index) => {

      const tableColor = [
        '#FFCCBB',
        '#FFECB2',
        '#FFCDD2',
        '#B3E5FC',
        '#B2DFDD',
        '#C8E6CA',
        '#F0F5C2',
        '#DDEDC8',
        '#FEE0B2',
        '#FEFAC2',
        '#E2BEE8',
        '#F9BBD0',
    
      ]

      return (
        <FetchHtmlContentFromYear
          key={index}
          url="https://webapp.yuntech.edu.tw/WebNewCAS/StudentFile/Course/"
          onContentFetched={(htmlContent) => {
            const data = extractCoursesList(htmlContent, year)
            //process mapping
            const initialCourseMapping = {};

            if (data && data.Courses) {
              data.Courses.forEach((course, table_row) => {
                const classTime = course.ClassTime;
                //"ClassTime":{"Week":2,"Time":["C","D"]}
                if (classTime) {
                  // console.log(classTime.Week, classTime.Time);
                  (classTime.Week && classTime.Time.length > 0) && classTime.Time.forEach((time, index) => {
                    const key = `${classTime.Week}_${time}`;

                    // initialCourseMapping[key] = [];
                    initialCourseMapping[key] = {
                      course: course,
                      color: tableColor[table_row % tableColor.length],
                    };
                    // console.warn(initialCourseMapping[key]);
                  });

                }
              });
            }
            storage.save({
              key: "courseList",
              id: year,
              data: initialCourseMapping,
            });
            onDataUpdated(initialCourseMapping);
            console.log(JSON.stringify(initialCourseMapping));
          }}
          semesterYear={year}
          username={username}
          password={password}
        />
      );
    },

    getCourseStudentList: (courseURL) => {
      console.log("Getting course list from NYUST website ...");
      return (
        <FetchHtmlContent
          url={courseURL}
          onContentFetched={(htmlContent) => {
            const data =  extractCoursesStudentList(htmlContent)
            storage.save({
              key: "courseStudentList",
              id: courseURL,
              data: data,
            });
            onDataUpdated(data);
          }}
          username={username}
          password={password}
        />
      );
    },

    getCourseSyllabusAndTeachingPlan: (courseDetialsURL) => {
      if (courseDetialsURL === undefined || courseDetialsURL === null || courseDetialsURL === "") {
        throw new Error("courseDetialsURL is not defined or null or empty");
      }
      
      return (
        <FetchHtmlContent
          url={courseDetialsURL}
          onContentFetched={(htmlContent) => {
            const data = extractCourseSyllabusAndTeachingPlan(htmlContent)
            console.log(data)
            storage.save({
              key: "courseSyllabusAndTeachingPlan",
              id: courseDetialsURL,
              data: data,
            });
            onDataUpdated(data);
          }}
          username={username}
          password={password}
        />
      );
    },

    // TODO 選課流程/教師課程/校際選課/課程地圖




    // credit section

    getCreditFromSemesterYear: (semesterYear, index) => {
      //this semesterYear something called when undified
      if (semesterYear == undefined || semesterYear == null || semesterYear == "") return;
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
