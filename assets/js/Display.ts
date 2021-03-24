/*
 * Copyright (c) 2021. Witt, Nils
 * MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


class Display {
    static refreshSecTime = 60;
    static scrollHoldtime = 5000;

    static data: DisplayDataSet;

    static replacementLessonContainer: HTMLDivElement;
    static examContainer: HTMLDivElement;

    static async startUp() {
        console.log("Init");
        await this.loadData();
        console.log(this.data)
        await this.parseData();
    }

    static loadData() {
        return new Promise(async (resolve, reject) => {
            this.data = await ApiConnector.loadData()
            resolve();
        });
    }

    static parseData() {
        return new Promise(async (resolve, reject) => {
            this.setReplacementLessons();
            this.setExams();
        });
    }

    static scrollDiv(div: HTMLDivElement) {
        let y = div.scrollTop;
        div.scrollTop = y + 1;
        if (y === div.scrollTop) {
            setTimeout(() => {
                div.scrollTop = 0;
                setTimeout(() => {
                    Display.scrollDiv(div);
                }, this.scrollHoldtime);
            }, this.scrollHoldtime);
        } else {
            window.setTimeout(() => {
                Display.scrollDiv(div);
            }, 80);
        }
    }


    static setReplacementLessons() {

        let container: HTMLDivElement = document.createElement("div");
        let replacementLessons = this.data.replacementLessons;

        replacementLessons.sort((a, b) => {
            if (a.date < b.date) {
                return -1;
            } else if (a.date > b.date) {
                return 1;
            } else {
                if (a.course.grade < b.course.grade) {
                    return -1;
                } else if (a.course.grade > b.course.grade) {
                    return 1;
                } else {
                    if (a.course.group < b.course.group) {
                        return -1;
                    } else if (a.course.group > b.course.group) {
                        return 1;
                    } else {
                        if (a.course.subject < b.course.subject) {
                            return -1;
                        } else if (a.course.subject > b.course.subject) {
                            return 1;
                        } else {
                            if (a.lesson.lessonNumber < b.lesson.lessonNumber) {
                                return -1;
                            } else if (a.lesson.lessonNumber > b.lesson.lessonNumber) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    }
                }
            }
        });

        let prevDate = "";
        let eventsContainer;
        for (let j = 0; j < replacementLessons.length; j++) {
            let event = replacementLessons[j];
            if (replacementLessons[j + 1] != null) {
                let next = replacementLessons[j + 1];
                if (event.date == next.date) {
                    if (event.course == next.course) {
                        if (event.course.subject == next.course.subject) {
                            if (event.subject == next.subject) {
                                if (event.teacherId == next.teacherId) {
                                    if (event.room == next.room) {
                                        //  event.lesson.lessonNumber = event["lesson"] + " / " + next["lesson"];
                                        j++;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (event.date != prevDate) {
                prevDate = event.date;

                let headerContainer = <HTMLDivElement>document.getElementById('vplanHeaderTemplate').cloneNode(true);
                (<HTMLSpanElement>headerContainer.getElementsByClassName('dateContainer').item(0)).innerText = timeDisplay(event.date);

                let dayContainer = <HTMLDivElement>document.getElementById('vplanTemplate').cloneNode(true);
                dayContainer.id = "Container-" + event.date;

                eventsContainer = dayContainer.getElementsByTagName('tbody').item(1);
                eventsContainer.innerHTML = "";
                container.append(headerContainer);
                container.append(dayContainer);
                container.append(document.createElement("br"))

            }


            let row = <HTMLTableRowElement>document.getElementById('vplanRowTemplate').cloneNode(true);
            if (eventsContainer != undefined) {
                eventsContainer.append(row);
                console.log(eventsContainer)
            }


            row.getElementsByClassName("lesson").item(0).innerHTML = event.lesson.lessonNumber.toString();
            row.getElementsByClassName("course").item(0).innerHTML = event.course.grade;
            row.getElementsByClassName("subject").item(0).innerHTML = event.course.subject + "-" + event.course.group;
            row.getElementsByClassName("newSubject").item(0).innerHTML = event.subject;
            row.getElementsByClassName("newTeacher").item(0).innerHTML = event.teacherId?.toString();
            row.getElementsByClassName("newRoom").item(0).innerHTML = event.room;
            row.getElementsByClassName("info").item(0).innerHTML = event.info;
        }

        this.replacementLessonContainer.innerHTML = container.innerHTML;
    }

    static setExams() {
        let container = <HTMLTableSectionElement>document.createElement('tbody');

        let exams = this.data.exams;
        let date = "";
        let grade = "";
        for (let entry in exams) {
            let exam = exams[entry];

            if (exam["date"] != date) {
                let dayHeader = <HTMLTableSectionElement>document.getElementById('klausurenDayHeaderTemplate').cloneNode(true);
                container.append(dayHeader)
                dayHeader.getElementsByClassName('weekday').item(0).innerHTML = getWeekdayByDate(exam["date"]).substr(0, 2);
                dayHeader.getElementsByClassName('date').item(0).innerHTML = klausurenDatum(exam["date"]);
                date = exam.date;
                grade = exam["grade"];
            } else if (exam["grade"] != grade) {
                container.append(document.getElementById('gradeSpaceholderTemplate').cloneNode(true));
                grade = exam["grade"];
            }

            let color = "#000000";
            if (exam["grade"] === "EF") {
                color = "#C00000";
            } else if (exam["grade"] === "Q2") {
                color = "#00B050";
            } else if (exam["grade"] === "Q1") {
                color = "#0000C0";
            }

            let eventRow = <HTMLTableRowElement>document.getElementById('klausurenRowTamplate').cloneNode(true);
            container.appendChild(eventRow);

            let timeFrameTd = <HTMLTableRowElement>eventRow.getElementsByClassName("timeframe").item(0);
            let courseTd = <HTMLTableRowElement>eventRow.getElementsByClassName("course").item(0);
            let teacherTd = <HTMLTableRowElement>eventRow.getElementsByClassName("teacher").item(0);
            let roomTd = <HTMLTableRowElement>eventRow.getElementsByClassName("room").item(0);

            timeFrameTd.style.color = color;
            courseTd.style.color = color;
            teacherTd.style.color = color;

            timeFrameTd.innerText = exam["from"].substr(0, 5) + "-" + exam["to"].substr(0, 5);
            teacherTd.innerHTML = exam.teacher;
            roomTd.innerHTML = exam.roomLink.room;

            for (const supervisorsKey in exam["supervisors"]) {
                try {
                    let column = <HTMLTableRowElement>eventRow.getElementsByClassName("r" + supervisorsKey).item(0);
                    column.innerText = exam["supervisors"][supervisorsKey];

                } catch (e) {
                    console.log(e);
                }
            }


            courseTd.innerText = exam.course.grade + ' / ' + exam.course.subject+ '-' + exam.course.group;

        }
        this.examContainer.innerHTML = container.innerHTML;
    }

    static setAnnouncements() {

    }
}

type DisplayDataSet = {
    replacementLessons: ReplacementLesson[];
    announcements: Announcement[];
    exams: Exam[];
}

type Exam = {
    display: boolean;
    date: string;
    course: Course;
    from: string;
    to: string;
    teacher: string;
    students: number;
    room: string;
    id: number;
}

type ReplacementLesson = {
    id: number | null;
    course: Course;
    lesson: Lesson;
    teacherId: number | null;
    room: string;
    subject: string;
    info: string;
    date: string;
}

type Course = {
    grade: string;
    subject: string;
    group: string;
}
type Lesson = {
    lessonNumber: number;
    day: number;
    room: string;
}

type Announcement = {}

let intervalId = 0;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js', {}).then(function (reg) {
        console.log('Registrierung erfolgreich. Scope ist ' + reg.scope);
        if (!reg.active) {
            console.log('SW not active');
            // location.reload();
        }
    }).catch(function (error) {
        console.log('Registrierung fehlgeschlagen mit ' + error);
    });
} else {
    console.log("No sw avilible")
}
/*

async function loadDataAushang() {
    return new Promise<void>(async (resolve, reject) => {
        let res;
        try {
            res = await ApiConnector.loadDataAushang();
            document.getElementById("aushangTableBody").innerHTML = AushangParse(res).innerHTML;
            document.getElementById("offlineIndicatior").style.visibility = "hidden";
        } catch (e) {
            console.log(e);
            document.getElementById("offlineIndicatior").style.visibility = "visible";
        }

        resolve();
    });
}

async function loadDataKlausuren() {
    return new Promise<void>(async (resolve, reject) => {
        let res;
        try {
            console.log("KL load")
            res = await ApiConnector.loadDataKlausuren();
            document.getElementById('klausurenTableBody').innerHTML = klausurenParse(res).innerHTML;
            document.getElementById("offlineIndicatior").style.visibility = "hidden";
        } catch (e) {
            console.log(e);
            document.getElementById("offlineIndicatior").style.visibility = "visible";
        }

        if (res.status === 200) {
            document.getElementById("offlineIndicatior").style.visibility = "hidden";

        }
        resolve();
    });

}

function setKey() {
    return new Promise<void>(async (resolve, reject) => {
        document.getElementById("keyInput").style.visibility = "hidden";
        document.getElementById("saveKey").style.visibility = "hidden";
        let keyInput = <HTMLInputElement>document.getElementById("keyInput");
        let key = keyInput.value;
        window.localStorage.setItem("key", key);
        window.localStorage.setItem("token", key);

        await loadVplan();
        await loadDataAushang();
        await loadDataKlausuren();

        intervalId = setInterval(async () => {
            await loadDataAushang();
            await loadDataKlausuren();
            await loadVplan();
        }, refresh_time);
        window.location.reload();
        resolve();
    });
}


//Initial start for all cycle functions
function start() {
    return new Promise<void>(async (resolve, reject) => {

        //first DataLoad
        await loadVplan();
        await loadDataAushang();
        await loadDataKlausuren();

        //start scrolling of divs
        window.setTimeout("scrolldiv('links')", wait_start);
        window.setTimeout("scrolldiv('rechts')", wait_start);

        //Set interval to pull data
        intervalId = setInterval(async () => {
            await loadDataAushang();
            await loadDataKlausuren();
            await loadVplan();
        }, refresh_time);


        resolve();
    });
}
*/

