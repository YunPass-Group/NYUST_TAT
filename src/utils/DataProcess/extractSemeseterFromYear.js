import { DOMParser } from 'react-native-html-parser';

export default function extractTableFromHTML(htmlContent) {
    // Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Find all elements with class 'GridView_AlternatingRow' and 'GridView_Row'
    const alternatingRows = Array.from(doc.getElementsByClassName('GridView_AlternatingRow'));
    const regularRows = Array.from(doc.getElementsByClassName('GridView_Row'));

    // Helper function to process each row and extract data
    const processRow = (row) => {
        // Define a helper function to clean text
        const cleanText = (text) => (text ? text.trim().replace(/\s+/g, ' ').replace(/[\r\n]+/g, ' ') : '');

        // Initialize variables to store extracted data
        let classText = '';
        let courseSerialNo = '';
        let curriculumNo = '';
        let courseName = '';
        let courseEnglishName = '';
        let requiredElective = '';
        let credits = '';
        let instructor = '';
        let score = '';
        const remarks = [];
        let warning = '';

        // Iterate over all <span> and <a> elements within the row
        const elements = Array.from(row.getElementsByTagName('span')).concat(Array.from(row.getElementsByTagName('a')));
        elements.forEach(element => {
            const id = element.getAttribute('id');
            if (id) {
                if (id.includes('_cour_class')) classText = cleanText(element.textContent);
                else if (id.includes('_current_subj')) courseSerialNo = cleanText(element.textContent);
                else if (id.includes('_Dept_Cour_No')) curriculumNo = cleanText(element.textContent);
                else if (id.includes('_cour_cname')) courseName = cleanText(element.textContent);
                else if (id.includes('_cour_ename')) courseEnglishName = cleanText(element.textContent);
                else if (id.includes('_maj_op')) requiredElective = cleanText(element.textContent);
                else if (id.includes('_credits')) credits = cleanText(element.textContent);
                else if (id.includes('_cour_emp')) instructor = cleanText(element.textContent);
                else if (id.includes('_Score')) score = cleanText(element.textContent);
                else if (id.includes('_remark_01') || id.includes('_remark_02')) remarks.push(cleanText(element.textContent));
                else if (id.includes('_Warning_Flag')) warning = cleanText(element.textContent);
            }
        });

        return {
            class: classText,
            courseSerialNo: courseSerialNo,
            curriculumNo: curriculumNo,
            courseName: courseName,
            courseEnglishName: courseEnglishName,
            requiredElective: requiredElective,
            credits: credits,
            instructor: instructor,
            score: score,
            remarks: remarks.filter(Boolean),
            warning: warning,
        };
    };


    // Process each row and extract the data
    const alternatingRowsData = alternatingRows.map(row => processRow(row));
    const regularRowsData = regularRows.map(row => processRow(row));

    // Combine the extracted data into an array
    const extractedData = [...alternatingRowsData, ...regularRowsData];

    // After extracting data for all rows, filter out the ones with empty values
    const nonEmptyData = extractedData.filter(entry => {
        const values = Object.values(entry);
        // Check if all properties, except "remarks", are empty strings
        return values.some(value => {
            if (Array.isArray(value)) {
                return value.length > 0;
            } else {
                return value !== "" && value !== null;
            }
        });
    });

    // Return the non-empty extracted data array
    return nonEmptyData;
}
