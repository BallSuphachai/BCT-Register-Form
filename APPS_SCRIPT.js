/**
 * Google Apps Script for BCT Registration Form
 * Paste this code into your Google Apps Script project.
 */

function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var doc = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = doc.getSheetByName('Responses');

        if (!sheet) {
            sheet = doc.insertSheet('Responses');
        }

        // Append Headers if sheet is empty
        if (sheet.getLastRow() === 0) {
            sheet.appendRow([
                'Timestamp', 'Apply Date', 'Academic Year', 'Curriculum', 'Major',
                'Prefix', 'First Name', 'Last Name', 'Nickname', 'ID Card',
                'Birth Date', 'Nationality', 'Race', 'Religion', 'Blood Type',
                'Weight', 'Height', 'Birth Place',
                'Total Siblings', 'Child Order', 'Siblings in BCT',
                'Address No', 'Moo', 'Soi', 'Road', 'Subdistrict', 'District', 'Province', 'Zipcode',
                'Home Phone', 'Mobile', 'Email',
                'Prev Grad Level', 'Vocational Type', 'GPA', 'Prev School', 'Prev School District', 'Prev School Province',
                'Prev Grad Year', 'Prev Grad Date', 'Prev School Type',
                'Father Prefix', 'Father Name', 'Father Surname', 'Father ID', 'Father Occ', 'Father Phone', 'Father Income',
                'Mother Prefix', 'Mother Name', 'Mother Surname', 'Mother ID', 'Mother Occ', 'Mother Phone', 'Mother Income',
                'Parents Status',
                'Disease', 'Talent', 'Current Job', 'Job Income', 'Workplace Phone',
                'Reason', 'Future Goal', 'Wanted Skills', 'Loan History', 'Loan Request', 'Recommender',
                'Accept Terms', 'Photo Name', 'Photo Link'
            ]);
        }

        var data = JSON.parse(e.postData.contents);

        // Create row data array (Order must match headers above)
        var rowData = [
            Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss"), // Date in Thai Time
            data.applyDate || '',
            data.academicYear || '',
            data.curriculum || '',
            data.major || '',
            data.prefix || '',
            data.firstName || '',
            data.lastName || '',
            data.nickname || '',
            "'" + data.idCard || '', // Force string for ID
            data.birthDate || '',
            data.nationality || '',
            data.race || '',
            data.religion || '',
            data.bloodType || '',
            data.weight || '',
            data.height || '',
            data.birthPlace || '',
            data.siblings || '',
            data.childOrder || '',
            data.siblingsInBCT || '',
            data.addressNo || '',
            data.moo || '',
            data.soi || '',
            data.road || '',
            data.subdistrict || '',
            data.district || '',
            data.province || '',
            data.zipcode || '',
            data.homePhone || '',
            "'" + data.mobilePhone || '', // Force string for phone
            data.email || '',
            data.prevGradLevel || '',
            data.vocationalType || '',
            data.gpa || '',
            data.prevSchool || '',
            data.prevSchoolDistrict || '',
            data.prevSchoolProvince || '',
            data.prevGradYear || '',
            data.prevGradDate || '',
            data.prevSchoolType || '',
            data.fatherPrefix || '',
            data.fatherName || '',
            data.fatherLastname || '',
            "'" + data.fatherIdCard || '',
            data.fatherOccupation || '',
            "'" + data.fatherPhone || '',
            data.fatherIncome || '',
            data.motherPrefix || '',
            data.motherName || '',
            data.motherLastname || '',
            "'" + data.motherIdCard || '',
            data.motherOccupation || '',
            "'" + data.motherPhone || '',
            data.motherIncome || '',
            data.parentsStatus || '',
            data.disease || '',
            data.talent || '',
            data.currentJob || '',
            data.jobIncome || '',
            data.workplacePhone || '',
            data.reason || '',
            data.futureGoal || '',
            data.wantedSkills || '',
            (data.loanHistory || '') + (data.loanHistoryNote ? ' - ' + data.loanHistoryNote : ''),
            data.loanRequest || '',
            data.recommender || '',
            data.acceptTerms ? 'Yes' : 'No',
            data.studentPhotoName || '',
            data.studentPhotoBase64 ? 'Image Data Received' : 'No Image' // Truncating base64 to avoid cell limit issues in basic mode
        ];

        sheet.appendRow(rowData);

        // If you want to handle the image upload to Drive properly:
        // This is a basic implementation. Storing full base64 in a cell is not recommended for large images.
        // Ideally, convert base64 to blob and create file in Drive, then save URL.

        if (data.studentPhotoBase64) {
            // --- Configuration: Enter your Folder ID here ---
            var FOLDER_ID = '19MFUpbFbd_pwzKi3v-KIj4dE0xBZeQor'; // <--- PASTE FOLDER ID HERE
            // -----------------------------------------------

            var contentType = data.studentPhotoBase64.substring(5, data.studentPhotoBase64.indexOf(';'));
            var bytes = Utilities.base64Decode(data.studentPhotoBase64.substr(data.studentPhotoBase64.indexOf('base64,') + 7));
            var blob = Utilities.newBlob(bytes, contentType, data.studentPhotoName || 'upload.png');

            var file;
            if (FOLDER_ID && FOLDER_ID !== '19MFUpbFbd_pwzKi3v-KIj4dE0xBZeQor') {
                try {
                    var folder = DriveApp.getFolderById(FOLDER_ID);
                    file = folder.createFile(blob);
                } catch (e) {
                    file = DriveApp.createFile(blob); // Fallback to root if ID is invalid
                }
            } else {
                file = DriveApp.createFile(blob);
            }

            sheet.getRange(sheet.getLastRow(), 69).setValue(file.getUrl());
        }

        return ContentService
            .createTextOutput(JSON.stringify({ "result": "success", "row": sheet.getLastRow() }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}