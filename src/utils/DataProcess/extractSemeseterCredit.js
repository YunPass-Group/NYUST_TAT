import { DOMParser } from 'react-native-html-parser';

export default function extractSemesterCredit(htmlContent) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlContent, 'text/html');

    function getDataByPartialId(partialId) {
        let elements = doc.getElementsByTagName('*');
        let filteredElements = [];
        for (let i = 0; i < elements.length; i++) {
            let el = elements.item(i);
            if (el.getAttribute('id') && el.getAttribute('id').includes(partialId)) {
                filteredElements.push(el);
            }
        }
        return filteredElements.map(el => el.textContent.trim());
    }

    function getScoreData() {
        let trs = doc.getElementsByTagName('tr');
        let scores = [];
        for (let i = 0; i < trs.length; i++) {
            if (trs.item(i).getAttribute('class') === 'GridView_Row' || trs.item(i).getAttribute('class') === 'GridView_AlternatingRow') {
                let tds = trs.item(i).getElementsByTagName('td');
                if (tds && tds.length > 7) {
                    let scoreText = tds.item(7).textContent.trim();
                    scores.push(scoreText);
                } else {
                    scores.push("");
                }
            }
        }
        return scores;
    }

    let tableData = [];
    let columns = [
        {name: 'Course Serial No.', partialId: 'current_subj'},
        {name: 'Curriculum No.', partialId: 'Dept_Cour_No'},
        {name: 'Course Name', partialId: 'cour_cname'},
        {name: 'Class', partialId: 'cour_class'},
        {name: 'Required/Elective', partialId: 'maj_op'},
        {name: 'Credits', partialId: 'credits'},
        {name: 'Instructor', partialId: 'cour_emp'},
        {name: 'Remarks', partialId: 'remark_01'},
        {name: 'Warning', partialId: 'Warning_Flag'}
    ];

    let scoreData = getScoreData();
    let numRows = getDataByPartialId(columns[0].partialId).length;

    for (let i = 0; i < numRows; i++) {
        let rowData = {};
        for (let col of columns) {
            rowData[col.name] = getDataByPartialId(col.partialId)[i] || "";
        }
        rowData["Score"] = scoreData[i] || "";
        tableData.push(rowData);
    }

    return tableData;
}