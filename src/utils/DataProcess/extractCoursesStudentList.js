export default function extractAllStudentsData(htmlContent) {
    htmlContent = htmlContent.replace(/\\\"/g, '"');
    const studentPattern = /<tr class="(GridView_Row|GridView_AlternatingRow)"[\s\S]+?<\/tr>/g;

    const students = [];

    // Helper function to extract data using a pattern
    const extractData = (pattern, content) => {
        const match = content.match(pattern);
        return match ? match[1] : null;
    };

    let studentMatch;
    while ((studentMatch = studentPattern.exec(htmlContent)) !== null) {
        const studentHtml = studentMatch[0];

        const emailPattern = /<a[^>]*id="[^"]*_eMail"[^>]*href="mailto:([^"]*)"/;
        const classPattern = /<span[^>]*id="[^"]*_class_desc"[^>]*>([^<]*)<\/span>/;
        const majorTypePattern = /<span[^>]*id="[^"]*_MajOp"[^>]*>([^<]*)<\/span>/;
        const numberPattern = /<a[^>]*id="[^"]*_StudNo"[^>]*>([^<]*)<\/a>/;
        const namePattern = /<span[^>]*id="[^"]*_StudName"[^>]*>([^<]*)<\/span>/;
        const englishNamePattern = /<span[^>]*id="[^"]*_EngName"[^>]*>([^<]*)<\/span>/;
        const photoUrlPattern = /<img[^>]*id="[^"]*_StudPhoto"[^>]*src="([^"]*)"/;
        const remarkPattern = /<span[^>]*id="[^"]*remark_pre"[^>]*>([^<]*)<\/span>/;

        let photoURL = "https://webapp.yuntech.edu.tw" + extractData(photoUrlPattern, studentHtml);
        photoURL = photoURL.replace(/&amp;/g, "&");

        const studentData = {
            studentEmail: extractData(emailPattern, studentHtml),
            studentClass: extractData(classPattern, studentHtml),
            studentMajorType: extractData(majorTypePattern, studentHtml),
            studentNumber: extractData(numberPattern, studentHtml),
            studentName: extractData(namePattern, studentHtml),
            studentEnglishName: extractData(englishNamePattern, studentHtml),
            studentPhotoURL: photoURL,
            studentRemark: extractData(remarkPattern, studentHtml)
        };

        students.push(studentData);
    }

    return students;
}