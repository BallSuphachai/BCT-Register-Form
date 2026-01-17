# วิธีการติดตั้ง Google Sheets Database

เพื่อให้ฟอร์มนี้สามารถบันทึกข้อมูลลง Google Sheets ของทางวิทยาลัยได้ ท่านต้องทำการติดตั้ง Script ตามขั้นตอนดังนี้:

## 1. สร้าง Google Sheet
1. ไปที่ [Google Sheets](https://sheets.google.com) และสร้าง SpreadSheet ใหม่
2. ตั้งชื่อไฟล์ตามต้องการ เช่น "BCT_Register_Data"

## 2. ติดตั้ง Script
1. ที่หน้า Google Sheet ไปที่เมนู **Extensions (ส่วนขยาย)** > **Apps Script**
2. จะมีหน้าต่างเขียนโค้ดปรากฏขึ้นมา
3. ลบโค้ดเดิม (`function myFunction()...`) ออกให้หมด
4. เปิดไฟล์ `APPS_SCRIPT.js` ในโฟลเดอร์โปรเจคนี้ และ Copy โค้ดทั้งหมดไปวางใน Apps Script Editor
5. กดปุ่ม Save (รูปแผ่นดิสก์) หรือ `Ctrl + S` ตั้งชื่อโครงการว่า "BCT Form Handler"

## 3. Deploy (เผยแพร่)
1. กดปุ่ม **Deploy (การทำให้ใช้งานได้)** สีน้ำเงิน มุมขวาบน
2. เลือก **New deployment (การทำให้ใช้งานได้รายการใหม่)**
3. กดรูปฟันเฟือง (Select type) เลือก **Web app**
4. กรอกข้อมูลดังนี้:
   - **Description**: BCT Register Form
   - **Execute as (ดำเนินการโดย)**: *Me (ฉัน)* (สำคัญมาก)
   - **Who has access (ผู้มีสิทธิ์เข้าถึง)**: *Anyone (ทุกคน)* (สำคัญมาก เพื่อให้หน้าเว็บส่งข้อมูลมาได้โดยไม่ต้องล็อกอิน)
5. กด **Deploy**
6. อาจจะมีการขอสิทธิ์เข้าถึง (Authorize access) ให้กด **Review permissions** -> เลือกบัญชี Gmail -> Advanced -> Go to ... (unsafe) -> Allow
7. เมื่อ Deploy สำเร็จ ท่านจะได้รับ **Web App URL** (ลิงก์ยาวๆ ที่ลงท้ายด้วย `/exec`)

## 4. เชื่อมต่อกับหน้าเว็บ
1. Copy **Web App URL** ที่ได้จากขั้นตอนที่แล้ว
2. กลับมาที่ไฟล์โปรเจค เปิดไฟล์ `script.js`
3. ค้นหาบรรทัดที่เขียนว่า:
   ```javascript
   const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
4. เปลี่ยน `'YOUR_GOOGLE_SCRIPT_URL_HERE'` เป็น URL ที่ท่าน Copy มา
   ตัวอย่าง:
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```
5. บันทึกไฟล์ `script.js`

เสร็จสิ้น! ตอนนี้ฟอร์มสมัครเรียนพร้อมใช้งานแล้ว เมื่อมีผู้มากรอกข้อมูล ข้อมูลจะไปปรากฏใน Google Sheet โดยอัตโนมัติ

---
**หมายเหตุ:** ไฟล์รูปภาพในเวอร์ชันนี้ จะแจ้งเตือนว่าได้รับไฟล์ แต่ไม่ได้บันทุกลง Drive โดยตรงเพื่อความง่ายในการติดตั้ง หากต้องการระบบฝากไฟล์รูปภาพจริงจัง จำเป็นต้องมีโค้ดเพิ่มเติมในการจัดการ Google Drive API
