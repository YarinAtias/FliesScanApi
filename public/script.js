const uploadFile = async () => {
    const fileInput = document.getElementById('fileInput');
    const uploadStatus = document.getElementById('uploadStatus');
    const linkRef = document.getElementById('linkref'); // מצביע ל-a
    const loadingDiv = document.getElementById('loading'); // מצביע ל-bar
    const progressBar = document.getElementById('progress'); // מצביע ל-bar עצמו

    if (fileInput.files.length === 0) {
        uploadStatus.innerText = "אנא בחר קובץ להעלאה";
        return;
    }

    // מציג את בר הטעינה
    loadingDiv.style.display = "block";
    progressBar.style.width = "0%";  // מאפס את בר הטעינה

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        // פה מתבצע קריאת הפוסט עם בר טעינה
        const response = await axios.post('http://localhost:5000/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                progressBar.style.width = percentCompleted + '%'; // עדכון בר הטעינה
            }
        });

        const fileName = response.data.file.filename;
        const isInfected = response.data.file.isInfected;
        const fileUrl = `http://localhost:5000/public/${isInfected ? 'infecteds' : 'uploads'}/${fileName}`;

        // עדכון הקישור
        linkRef.href = fileUrl;
        linkRef.innerText = `הקובץ הועלה בהצלחה: ${fileName}`;
        linkRef.style.display = "block"; // מציג את הקישור

        // צבעים לפי אם הקובץ נגוע או לא
        if (isInfected) {
            linkRef.style.color = "red"; // קובץ נגוע
        } else {
            linkRef.style.color = "green"; // קובץ תקין
        }

        // מסתיר את בר הטעינה
        loadingDiv.style.display = "none";
        uploadStatus.innerText = ""; // מוחק את הטקסט הישן

    } catch (error) {
        uploadStatus.innerText = "שגיאה בהעלאת הקובץ";
        console.error(error);

        // אם יש שגיאה מסתיר את בר הטעינה
        loadingDiv.style.display = "none";
    }
};



const fetchFiles = async () => {
    const filesContainer = document.getElementById('filesContainer'); // מצביע על div שבו נציג את הקבצים

    try {
        // פנייה לשרת לקבלת רשימת הקבצים
        const response = await axios.get('http://localhost:5000/files/files');
        
        // אם לא נמצא אף קובץ
        if (response.data.length === 0) {
            filesContainer.innerHTML = "לא נמצאו קבצים.";
            return;
        }

        // מנקים את התצוגה לפני שמדפיסים את הקבצים החדשים
        filesContainer.innerHTML = "";

        // לולאה שמדפיסה כל קובץ
        response.data.forEach(file => {
            const fileLink = document.createElement('a');
            const fileUrl = `http://localhost:5000/public/${file.isInfected ? 'infecteds' : 'uploads'}/${file.filename}`;
            fileLink.href = fileUrl;
            fileLink.target = "_blank";
            fileLink.innerText = `${file.filename} ${file.isInfected ? '(נגוע)' : '(תקין)'}`;

            // מוסיפים את הקישור לדף
            const fileItem = document.createElement('div');
            fileItem.appendChild(fileLink);
            filesContainer.appendChild(fileItem);
        });

    } catch (error) {
        console.error(error);
    }
};
