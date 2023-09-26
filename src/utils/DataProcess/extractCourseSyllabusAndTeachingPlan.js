export default function extractCourseSyllabusAndTeachingPlan(htmlContent) {
    // Replace escaped quotes to simplify regex patterns
    htmlContent = htmlContent.replace(/\\\"/g, '"');

    // Helper function to extract data using a pattern
    const extractData = (pattern, isMultiLine = false) => {
        const match = htmlContent.match(pattern);
        if (!match) return isMultiLine ? [] : null;

        if (isMultiLine) {
            return match[1].split(/<br\s*\/?>|\n/)
                .map(line => line.trim())
                .filter(line => line !== '');  // Remove empty lines
        }
        return match[1].trim();
    };



    const extractAndSplitData = (pattern, splitter) => {
        const match = htmlContent.match(pattern);
        if (!match) return [];
        return match[1].replace(/'/g, " ").split(splitter).map(item => item.trim().replace(/\t/g, ' '));
    };

    const extractInstructorDepartment = () => {
        const match = htmlContent.match(instructorDepartmentPattern);
        if (!match) return {};
        return {
            email: match[1],
            name: match[2],
            department: match[3]
        };
    };

    const extractNumericData = (pattern) => {
        const match = htmlContent.match(pattern);
        if (!match) return null;
        const numericValue = match[0].replace(/\D/g, '');  // Remove non-numeric characters
        return numericValue ? parseInt(numericValue, 10).toString() : null;  // Convert to integer
    };

    // information
    const courseNamePattern = /<span[^>]*id="[^"]*_MainContent_Cour_cname_fLabel"[^>]*>([^<]*)<\/span>/;
    const courseNameEnglishPattern = /<span[^>]*id="[^"]*_MainContent_Cour_ename_fLabel"[^>]*>([^<]*)<\/span>/;
    const curriculumNoPattern = /<span[^>]*id="[^"]*_MainContent_Dept_Cour_No"[^>]*>([^<]*)<\/span>/;
    const semesterPattern = /<span[^>]*id="[^"]*_MainContent_AcadYearLabel"[^>]*>([^<]*)<\/span>/;
    const semesterTypePattern = /<span[^>]*id="[^"]*_MainContent_SemeTypeLabel"[^>]*>([^<]*)<\/span>/;
    const serialNoPattern = /<span[^>]*id="[^"]*_MainContent_CurrentSubjLabel"[^>]*>([^<]*)<\/span>/;
    const requiredElectivePattern = /<span[^>]*id="[^"]*_MainContent_Maj_OpLabel"[^>]*>([^<]*)<\/span>/;
    const courseTypePattern = /<span[^>]*id="[^"]*_MainContent_Cour_TypeLabel"[^>]*>([^<]*)<\/span>/;
    const classPattern = /<span[^>]*id="[^"]*_MainContent_CourClassLabel"[^>]*>([^<]*)<\/span>/;
    const creditsPattern = /<span[^>]*id="[^"]*_MainContent_CreditsLabel"[^>]*>([^<]*)<\/span>/;
    const scheduleClassroomPattern = /<span[^>]*id="[^"]*_MainContent_CourTimeLabel"[^>]*>([^<]*)<\/span>/;
    const instructorDepartmentPattern = /<a[^>]*href="mailto:([^"]*)">([^<]*)<\/a>\(([^)]*)\)/;
    const studentMaxPattern = /<span[^>]*id="[^"]*_MainContent_CourLimitLabel"[^>]*>([\s\S]*?)<\/span>/;
    const instructorEmailAndExtPattern = /<span[^>]*id="[^"]*_MainContent_Teacher_emailAndTel"[^>]*>([^<]*)<\/span>/;
    const instructorPattern = /<span[^>]*id="[^"]*_MainContent_CourRemarkLabel"[^>]*>([\s\S]*?)<\/span>/;
    const courseIntroductionPattern = /<span[^>]*id="[^"]*_MainContent_CourseIntroductionLabel"[^>]*>([\s\S]*?)<\/span>/;
    const teachingObjectivesPattern = /<span[^>]*id="[^"]*_MainContent_TeachingObjectivesLabel"[^>]*>([\s\S]*?)<\/span>/;
    const evaluationMethodsPattern = /<span[^>]*id="[^"]*_MainContent_EvaluationMethodsLabel"[^>]*>([\s\S]*?)<\/span>/;
    const officeHoursPattern = /<span[^>]*id="[^"]*_MainContent_Office_HoursLabel"[^>]*>([^<]*)<\/span>/;
    const teachingMaterialsPattern = /<a[^>]*id="[^"]*_MainContent_Teaching_URLHyperLink"[^>]*href="([^"]*)"/;

    //tables
    const extractTables = () => {
        const tablePattern = /<table[^>]*class="GridView_General table"[^>]*>([\s\S]*?)<\/table>/g;
        const tables = [];
        let match;
        while ((match = tablePattern.exec(htmlContent)) !== null) {
            tables.push(match[1]);
        }
        return tables;
    };

    const attachmentFile = extractTables();
    const textbooks = attachmentFile[0];
    const schedule = attachmentFile[1];
    const coreCompetencies = attachmentFile[2];

    function extractTextbooksDetails(textbooks) {

        const rows = textbooks.split(/<tr[^>]*>/).slice(2); // Skip the first two entries (header and split artifacts)

        const extractContent = (str, keyword) => {
            const regex = new RegExp(`<span[^>]*id="[^"]*${keyword}[^"]*">(.*?)<\/span>`, 'i');
            const match = str.match(regex);
            return match ? match[1].replace(/&nbsp;/g, '').trim().replace(/\s+/g, ' ') : ''; // Removes excessive white spaces
        };

        const data = rows.map(row => {
            const tds = row.split(/<td[^>]*>/).slice(1); // Split by <td> and remove the first empty match

            let bookNameAndISBN = extractContent(row, "_BookName");
            let bookName = "";
            let isbn = "";

            if (bookNameAndISBN.includes("<br>")) {
                const parts = bookNameAndISBN.split("<br>");
                bookName = parts[0].trim();
                isbn = parts[1].replace("ISBN:", "").trim();
            } else if (bookNameAndISBN.includes("ISBN:")) {
                isbn = bookNameAndISBN.replace("ISBN:", "").trim();
            } else {
                bookName = bookNameAndISBN.trim();
            }

            return {
                '教材類別': extractContent(row, "TchmaterCategorieLabel"),
                '編訂方式': extractContent(row, "_PrepareWayLabel"),
                '書名/ISBN': {
                    '書名': bookName,
                    'ISBN': isbn
                },
                '作者': tds[4] ? tds[4].replace(/<.*?>/g, '').replace(/&nbsp;/g, '').trim() : '',
                '出版者': tds[5] ? tds[5].replace(/<.*?>/g, '').replace(/&nbsp;/g, '').trim() : '',
                '出版年': tds[6] ? tds[6].replace(/<.*?>/g, '').replace(/&nbsp;/g, '').trim() : '',
                '索書號或登錄號': tds[7] ? tds[7].replace(/<.*?>/g, '').replace(/&nbsp;/g, '').trim() : '',
                '備註': tds[8] ? tds[8].replace(/<.*?>/g, '').replace(/&nbsp;/g, '').trim() : ''
            };
        });

        return data;
    }

    function extractSchedule(schedule) {
        const rowPattern = /<tr class="GridView_.*?">([\s\S]*?)<\/tr>/g;
        const cellPattern = /<span id=".*?">([\s\S]*?)<\/span>/;
        const urlPattern = /href="([\s\S]*?)"/;

        let match, cellMatch;
        let dataArray = [];

        while (match = rowPattern.exec(schedule)) {
            const rowContent = match[1];
            const cells = rowContent.split('</td>').slice(0, -1);
    
            const weekRaw = (cellPattern.exec(cells[0]) || [])[1];
            const week = weekRaw ? weekRaw.replace(/[^0-9]/g, '') : '';
            let teachingContent = (cellPattern.exec(cells[1]) || [])[1] || '';
            teachingContent = teachingContent.split("\n").filter(item => item.trim() !== ''); // Split by newline and filter out empty strings
            const teachingMethod = (cellPattern.exec(cells[2]) || [])[1] || '';
            const remarks = (cellPattern.exec(cells[3]) || [])[1] || '';
            const distanceTeachingUrl = (urlPattern.exec(cells[4]) || [])[1] || '';
    
            if (week) {
                dataArray.push({
                    week: week.trim(),
                    teachingContent: teachingContent, // Now an array
                    teachingMethod: teachingMethod.trim(),
                    remarks: remarks.trim(),
                    distanceTeachingUrl: distanceTeachingUrl.trim()
                });
            }
        }
    
        return dataArray;
    }

    function extractCoreCompetencies(htmlString) {
        const regex = /<td align="center" style="width:5%;">(\d+)<\/td><td style="width:45%;">([^<]+)<\/td>(<td align="center" style="width:8%;">(?:&nbsp;|◎)<\/td>)(<td align="center" style="width:8%;">(?:&nbsp;|◎)<\/td>)(<td align="center" style="width:8%;">(?:&nbsp;|◎)<\/td>)(<td align="center" style="width:8%;">(?:&nbsp;|◎)<\/td>)(<td align="center" style="width:8%;">(?:&nbsp;|◎)<\/td>)/g;

        let match;
        const results = [];

        while ((match = regex.exec(htmlString)) !== null) {
            results.push({
                itemNumber: match[1],
                coreAbility: match[2],
                noRelation: match[3].includes("◎"),
                lowRelation: match[4].includes("◎"),
                moderateRelation: match[5].includes("◎"),
                highRelation: match[6].includes("◎"),
                completeRelation: match[7].includes("◎"),
            });
        }

        return results; //return [] if 無相關課程核心能力
    }



    return {
        Information: {
            courseName: extractData(courseNamePattern),
            courseNameEnglish: extractData(courseNameEnglishPattern),
            curriculumNo: extractData(curriculumNoPattern),
            semester: extractData(semesterPattern),
            semesterType: extractData(semesterTypePattern),
            serialNo: extractData(serialNoPattern),
            requiredElective: extractData(requiredElectivePattern),
            courseType: extractData(courseTypePattern),
            class: extractData(classPattern),
            credits: extractData(creditsPattern),
            scheduleClassroom: extractData(scheduleClassroomPattern),
            instructorDepartment: extractInstructorDepartment(),
            studentMax: extractNumericData(studentMaxPattern),
            instructorEmailAndExt: extractData(instructorEmailAndExtPattern),
            instructor: extractData(instructorPattern).replace(/<br\s*\/?>/g, '').trim(),
            courseIntroduction: extractData(courseIntroductionPattern, true),
            teachingObjectives: extractAndSplitData(teachingObjectivesPattern, /<br\s*\/?>/),
            evaluationMethods: extractAndSplitData(evaluationMethodsPattern, /<br\s*\/?>/),
            officeHours: extractData(officeHoursPattern),
            teachingMaterials: extractData(teachingMaterialsPattern)
        },
        Textbooks: extractTextbooksDetails(textbooks),
        Schedule: extractSchedule(schedule),
        CoreCompetencies: extractCoreCompetencies(coreCompetencies)

        // TODO: add lidar canvas data
    };
}
