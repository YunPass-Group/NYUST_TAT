export default function extractCourseDetails(htmlContent) {
    // Utility function to extract content based on id pattern and tag
    function extractContent(str, pattern, tag) {
        const regex = new RegExp(`<${tag}[^>]*id="[^"]*${pattern}[^"]*"[^>]*>(.*?)</${tag}>`, "i");
        const match = str.match(regex);
        return match ? match[1].trim().replace(/<br>/gi, '') : "";
    }

    // Utility function to extract URL based on id pattern
    function extractURL(str, pattern) {
        const regex = new RegExp(`<a[^>]*id="[^"]*${pattern}[^"]*"[^>]*href="([^"]+)"`, "i");
        const match = str.match(regex);
        return match ? match[1] : "";
    }

    // Utility function to extract student list URL
    function extractStudentListURL(str) {
        const regex = /<a[^>]*current_subj0[^>]*href="\/WebNewCAS\/Course\/StudList\.aspx\?acad_year=(\d+)&amp;seme_type=(\d+)&amp;current_subj=(\d+)"[^>]*>/i;
        const match = str.match(regex);
        if (match) {
            return `https://webapp.yuntech.edu.tw/WebNewCAS/Course/StudList.aspx?acad_year=${match[1]}&seme_type=${match[2]}&current_subj=${match[3]}`;
        }
        return "";
    }

    // Utility function to extract details URL
    function extractDetailsURL(str) {
        const regex = /<a[^>]*cour_cname[^>]*href="[^?]*\?&amp;(\d+)&amp;(\d+)&amp;(\d+)"[^>]*>/i;
        const match = str.match(regex);
        if (match) {
            return `https://webapp.yuntech.edu.tw/WebNewCAS/Course/Plan/Query.aspx?&${match[1]}&${match[2]}&${match[3]}`;
        }
        return "";
    }

    // Utility function to extract instructor details (name and email)
    function extractInstructors(str) {
        const regex = /<a href="mailto:([^"]+)">([^<]+)<\/a>/gi;
        const instructors = [...str.matchAll(regex)];
        return instructors.map(instructor => {
            return {
                name: instructor[2].trim(),
                email: instructor[1].trim()
            };
        });
    }

    // Utility function to extract student limit
    function extractStudentLimit(str) {
        const parts = str.split('<br>');
        if (parts.length > 1) {
            return parts[1].replace(/[^0-9]/g, '');
        }
        return '';
    }

    // Utility function to extract class time
    function extractClassTime(str) {
        const week = parseInt(str[0], 10);
        const time = str.substring(2).split('');
        return {
            "Week": week,
            "Time": time
        };
    }

    // Utility function to extract comments
    function extractComments(str) {
        const commentPatterns = ["comm", "CourRemark_00", "Remark_00_01", "remark_00_02"];
        return commentPatterns.map(pattern => extractContent(str, pattern, "span"));
    }

    const rowPattern = /<tr[^>]*class="GridView_(Row|AlternatingRow)"[^>]*>([\s\S]*?)<\/tr>/gi;
    const rows = [...htmlContent.matchAll(rowPattern)];

    const courseData = rows.map(row => {
        const rowData = row[2];
        const timeLocation = extractContent(rowData, "_Cour_Time", "span").split('/');
        return {
            "Course Serial No": extractContent(rowData, "current_subj0", "a"),
            "Curriculum No": extractContent(rowData, "Dept_Cour_No", "span"),
            "Class Name": extractContent(rowData, "cour_cname", "a"),
            "Course Name Eng": extractContent(rowData, "_cour_ename", "span"),
            "Department": extractContent(rowData, "_Cour_Class", "span"),
            "Class Type": extractContent(rowData, "_maj_op", "span"),
            "Credit": extractContent(rowData, "_credits", "span"),
            "ClassTime": extractClassTime(timeLocation[0]),
            "Location": timeLocation[1] || "",
            "Instructor": extractInstructors(extractContent(rowData, "cour_emp", "span")),
            "Students Joined": extractContent(rowData, "_SelNo", "span"),
            "Student Limit": extractStudentLimit(extractContent(rowData, "CourLimit", "span")),
            "Teaching Materials Website": extractURL(rowData, "TeachingUrlHyperLink"),
            "Comment": extractComments(rowData),
            "Details Website": extractDetailsURL(rowData),
            "Student List URL": extractStudentListURL(rowData),
        };
    });

    return courseData;
}